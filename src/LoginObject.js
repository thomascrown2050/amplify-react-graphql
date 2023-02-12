import React from "react";
import { API, Storage, Auth} from "aws-amplify";
import {
      BrowserRouter as Router,
      Link, 
    } from "react-router-dom";
import {
      View,
      withAuthenticator,
    } from "@aws-amplify/ui-react";


    Auth.currentAuthenticatedUser({
      bypassCache: false // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then((user) => 
      {
        //authUserId = user.attributes["sub"];
      global.authUserId = user.attributes["sub"];
      global.authUserName = user.username;
      //console.log(user);
}).catch((err) => console.log(err));

function LoginObject ({signOut}){ 

return (
<div id="loginObject">
      <span>{global.authUserName}</span>&nbsp;|&nbsp;
      <span><Link className="navLink" to={`/`}>Latest</Link></span>&nbsp;|&nbsp;
      <span><Link className="navLink" to={`blockmarks`}>Saved</Link></span>&nbsp;|&nbsp;
      <span><Link className="navLink" to={`whales`}>Whales</Link></span>&nbsp;|&nbsp;
      <span className="identityButton" onClick={signOut}>Log out</span>
      </div>
);      
}

export default withAuthenticator(LoginObject);