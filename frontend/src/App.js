import './App.css';
import S3Data from './components/S3Data';
import React from 'react'
import { Button, Card } from "react-bootstrap";

function App(props) {
  if (props.location && props.location.hash) {
    const all_tokens = props.location.hash.split("&");
    if(all_tokens.length >= 1) {
      const finalTkn = all_tokens[0].replace("#id_token=", "").replace("#access_token=", "")
      sessionStorage.setItem("token", finalTkn);
    }
  }
  const validToken =  sessionStorage.getItem("token") != undefined &&  sessionStorage.getItem("token").length>0 ;
  const dropboxpro_url = "https://dropboxpro.auth.us-west-2.amazoncognito.com/login?client_id=2g50de80miob1nu4p4lf8jnqqh&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=http://localhost:3000/";

  return (
    <div>
      { (validToken) ? <S3Data /> : 
      <div>
      <Card>
          DropBoxPro
          <Card.Body>
              <Button href={dropboxpro_url}>
                  Please proceed to register
              </Button>
          </Card.Body>
      </Card>
  </div> }
    </div>
  );
}

export default App;
