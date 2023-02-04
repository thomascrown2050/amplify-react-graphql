//import { Route } from 'react-router-dom';
import * as React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';

function block(){
    //const router = useRouter()
    //const { number }  = router.query
    let { userId } = useParams();

    return (
    <h1>Block Number: {userId}</h1>    
    );
}

export default block;