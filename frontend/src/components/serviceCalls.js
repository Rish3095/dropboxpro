global.fetch = require('node-fetch');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');

export const backendConfig = {
    serverUrl: "http://localhost:3001"// rishabhcloudproject.com
}

export const getHeaders = {
    headers: {
        method: 'GET',
        headers: { "Content-Type": "application/json" }
    }
}

function fetchS3Data(user) {
    return fetch(`${backendConfig.serverUrl}/fetchS3Data/${user}`, getHeaders.headers).then(res => {
        return res.json();
    })
}

function fetchAdmin() {
    return fetch(`${backendConfig.serverUrl}/fetchAdmin`, getHeaders.headers).then(res => {
        return res.json();
    })
}

function createUploadData(newFile, user, fileDesc) {
    const uploadData = new FormData();
    uploadData.append('inputFile', newFile);
    uploadData.append('user_name', user);
    uploadData.append('file_description', fileDesc);
    return uploadData;
}

function pushFileToS3(newFile, user, fileDesc) {
    const headers = {
        method: 'POST',
        body: createUploadData(newFile, user, fileDesc),
    }
    return fetch(`${backendConfig.serverUrl}/pushFileToS3`, headers).then(res => {
        return res;
    })
}

function removeS3Object(name, userId) {
    const headers = {
        method: 'DELETE',
        body: JSON.stringify({
            "deleteFile": name,
            "userId": userId
        }),
        headers: { "Content-Type": "application/json" }
    }
    return fetch(`${backendConfig.serverUrl}/removeS3Object`, headers)
}


function awsUser() {
    var userPool = new AmazonCognitoIdentity.CognitoUserPool({
        UserPoolId: 'us-west-2_YBN0LoINM', 
        ClientId: '6du6tkbf7lvqhdl5evnn6vc7sm'
    });
    var cognitoUser = userPool.getCurrentUser();
    
    if (cognitoUser != null) {
        cognitoUser.getSession(function(err, session) {
            if (err) {
                alert(err.message || JSON.stringify(err));
                return;
            }
            cognitoUser.getUserAttributes(function(err, attributes) {});
        });
    }
}

export const restOperations = {
    fetchS3Data,
    fetchAdmin,
    pushFileToS3,
    removeS3Object,
    awsUser,
}