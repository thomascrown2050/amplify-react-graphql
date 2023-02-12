//import { Route } from 'react-router-dom';
import * as React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import {
    View,
    withAuthenticator,
  } from "@aws-amplify/ui-react";
import LoginObject from '../LoginObject';

function block(){
    let { userId } = useParams();

    return (
    <View className="GeneralPage">
    <LoginObject />
    <h1>Block Number: {userId}</h1>    
    </View>
    );
}

export default block;