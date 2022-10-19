const express = require('express')
const fileUpload = require('express-fileupload');
const app = express()
let cors = require('cors');
const port = 3001
const fs = require('fs');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });
const dotenv = require('dotenv');
const parseResult = dotenv.config()

if (parseResult.error) {
  throw parseResult.error
}

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: 'tmp'
}));

const s3Object = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamoDbObject = new AWS.DynamoDB({ apiVersion: '2012-08-10' ,
    region: "us-west-2",
    endpoint: "http://dynamodb.us-west-2.amazonaws.com",
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY});

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))

app.post('/pushFileToS3', function (req, res) {
  
  const s3ObjectParameters = {
    Bucket: "dropboxpro",
    Key: req.files.inputFile.name,
    ContentType: req.files.inputFile.mimetype,
    Body: fs.createReadStream(req.files.inputFile.tempFilePath)
  };

  s3Object.upload(s3ObjectParameters, function (err, data) {
    if (!err) {
      try {
        fs.unlinkSync(req.files.inputFile.tempFilePath)
      } catch (e) {}
      dynamoDbUpdate();
      return res.status(200);
    }
  });

  function dynamoDbUpdate() {
    var id = req.body.user_name.concat("_", req.files.inputFile.name)

    dynamoDbObject.scan({
      TableName: 'usertable-dropboxpro',
    }, function (err, data) {
      if (!err) {
        if (data.Items.filter(item => item.userId.S === id).length > 0) {
          const retrievedData = data.Items.filter(item => item.userId.S === id)[0];
          addData(id, req.body.user_name, req.files.inputFile.name, req.body.file_description, retrievedData.file_created.S);
        } else {
          addData(id, req.body.user_name, req.files.inputFile.name, req.body.file_description, new Date().toString());
        }
      }
    });
  }

  function addData(userId, user_name, file_name, file_description, fileCreationTime) {
    const dynamoDbParams = {
    TableName: 'usertable-dropboxpro',
    Item: {
      'userId': { S: userId },
      'user_name': { S: user_name },
      'file_name': { S: file_name },
      'file_description': { S: file_description },
      'file_created': { S: fileCreationTime },
      'file_updated': { S: new Date().toString() }
      }
    };
    dynamoDbObject.putItem(dynamoDbParams, function (err, data) {})
  }
});

app.delete('/removeS3Object', function (req, res) {
  const s3ObjectParameters = {
    Bucket: "dropboxpro",
    Key: req.body.deleteFile
  };
  s3Object.deleteObject(s3ObjectParameters, function (err, data) {
    if (!err) {
      removeDataFromDynamo();
      return res.status(200);
    }
  });

  function removeDataFromDynamo() {
    const dynamoDbParams = {
      TableName: 'usertable-dropboxpro',
      Key: {
        "userId": { "S": req.body.userId }
      }
    };

    dynamoDbObject.deleteItem(dynamoDbParams, function (err, data) {});
  }
});

app.get('/fetchS3Data/:user_name', function (req, res) {
  AWS.config.update({
    region: "us-west-2",
    endpoint: "http://dynamodb.us-west-2.amazonaws.com",
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });
  
  var awsDynamoClient = new AWS.DynamoDB.DocumentClient();
  
  var params = {
      TableName: usertable-dropboxpro,
      FilterExpression: '#user_name = :user_name',
      ExpressionAttributeNames: {
        '#user_name' : 'user_name'
      },
      ExpressionAttributeValues: {
        ':user_name' : req.params.user_name
      }
  };
  
  awsDynamoClient.scan(params, function(err, data) {
      if (!err) {
          return res.status(200);
      }
  });
});

app.get('/fetchAdmin', function (req, res) {
  AWS.config.update({
    region: "us-west-2",
    endpoint: "http://dynamodb.us-west-2.amazonaws.com",
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });
  
  var awsDynamoClient = new AWS.DynamoDB.DocumentClient();
  var params = {
    TableName: 'usertable-dropboxpro'
  };

  awsDynamoClient.scan(params, function (err, data) {
    if (!err) {
      return res.status(200);
    }
  });
});

app.listen(port, () => console.log(`app listening on port ${port}!`))