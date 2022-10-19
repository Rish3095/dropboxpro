import React, { PureComponent } from 'react'
import { Button, Card, Navbar, Table  } from "react-bootstrap";
import { restOperations } from './serviceCalls';
import SignOut from './SignOut';
var jwt = require('jsonwebtoken');

class S3Data extends PureComponent {
    constructor(props) {
        super(props)
        const sessionToken = sessionStorage.getItem("token")
        this.state = {
            dynamoData: [],
            userData: undefined,
            isAdmin: false,
            files: [],
            descr: "",
            result: ""
        }
        this.userTableUpdate = this.userTableUpdate.bind(this)
        this.pushNewFile = this.pushNewFile.bind(this)
    }

    componentDidMount() {
        var decryptToken = jwt.decode(sessionStorage.getItem("token"), { complete: true });
        const isAdmin = decryptToken.payload && decryptToken.payload["cognito:groups"] && decryptToken.payload["cognito:groups"].filter(g => g == "admin").length > 0;
        this.setState({ isAdmin , userData: decryptToken.payload});
        setTimeout(()=> {
            this.userTableUpdate()
        }, 500);
        
        restOperations.awsUser()
    }

    deleteFile(fileName, id) {
        restOperations.removeS3Object(fileName, id)
            .then(json => {
                setTimeout(()=> {
                    this.userTableUpdate()
            }, 300);
            });
    }

    userTableUpdate() {
        if(this.state.isAdmin) {
            restOperations.fetchAdmin()
            .then(json => this.setState({dynamoData: json}));
        } else {
            restOperations.fetchS3Data(this.state.userData.email)
            .then(json => this.setState({dynamoData: json}));
        }
    }

    pushNewFile() {
        if (this.state.files.length >= 1) {
            restOperations.pushFileToS3(this.state.files[0], this.state.userData.email, this.state.descr)
                .then(json => {
                    this.setState({
                        result: "Successfull Upload"
                    }, () => {
                        setTimeout(()=> {
                            this.userTableUpdate();
                        }, 500);
                    });
                });
        }
    }

    getDateTime = (input) => {
        return new Date(input).toLocaleString()
    }

    render() {
        const { isAdmin } = this.state;
        return (
            <div>
                <Navbar>
                    <Navbar.Brand>DropBoxPro {this.state.userData && this.state.userData.email}</Navbar.Brand>
                    {(this.state.userData) ?
                    <SignOut /> : 
                    <div>
                        <Card>
                            DropBoxPro
                            <Card.Body>
                                <Button href="https://dropboxpro.auth.us-west-2.amazoncognito.com/login?client_id=2g50de80miob1nu4p4lf8jnqqh&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=http://localhost:3000/">
                                    Please proceed to register
                                </Button>
                            </Card.Body>
                        </Card>
                    </div>}
                </Navbar>
                {
                    this.state.userData ?
                    <div>
                        Upload File
                        <input type="file" onChange={(e) => 
                                this.setState({
                                    files: e.target.files
                            })} />
                        <input
                                value={this.state.descr}
                                onChange={e => this.setState({
                                    descr: e.target.value
                                })}
                                placeholder="Description"
                                type="text"
                                name="Description"
                            />
                            &nbsp; &nbsp;
                        <Button onClick={this.pushNewFile}>Upload</Button>
                    </div> : <div/>
                }

                <div>
                    <Table>
                        <thead>
                            <tr key={0}>
                                {
                                    !isAdmin ? <th /> : <th>User Name</th>
                                }
                                <th>Name</th>
                                <th>Description</th>
                                <th>Upload Time</th>
                                <th>Updated Time</th>
                                <th>Download</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.dynamoData.map(dynamoDoc => {
                                    return (
                                        <tr key={dynamoDoc.userId}>
                                            {<td>{dynamoDoc.user_name}</td>}
                                            <td>{dynamoDoc.file_name}</td>
                                            <td>{dynamoDoc.file_description}</td>
                                            <td>{this.getDateTime(dynamoDoc.file_created)}</td>
                                            <td>{this.getDateTime(dynamoDoc.file_updated)}</td>
                                            <td>
                                                <Button onClick={event => window.open("https://d3u2de4a513qh9.cloudfront.net/" + dynamoDoc.file_name)}>
                                                    DownLoad
                                                </Button></td>
                                            <td>
                                                <Button onClick={event => this.deleteFile(dynamoDoc.file_name, dynamoDoc.userId)}>
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </Table>
                </div>
            </div>
        )
    }
}

export default S3Data