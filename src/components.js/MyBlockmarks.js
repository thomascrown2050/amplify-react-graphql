import React, { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { listNotes, listBookmarks } from "../graphql/queries";
import LoginObject from "../LoginObject";
import {
    View,
    withAuthenticator,
  } from "@aws-amplify/ui-react";

let listOfBookmarks;

function convertToLocalTime(unixVariable){
    let bts = new Date (unixVariable);
    //blockTimestampUTCString = bts.toUTCString();
    let blockTimestampLocalString = bts.toString();  
    return blockTimestampLocalString;  
}

function interpretBookmarkType(intBookmark){
let stringBookmarkType;
if(!intBookmark){
stringBookmarkType = "Unknown";    
}else if(intBookmark == 1){
stringBookmarkType = "Transaction";        
}else if(intBookmark == 2){
stringBookmarkType = "Block";        
}else if(intBookmark == 3){
stringBookmarkType = "Address";        
}
else{
stringBookmarkType = "Unknown";        
}
return stringBookmarkType;        
}

function MyBlockmarks(props) {

    const [notes, setNotes] = useState([]);
    const [mybookmarks, setBookmarks] = useState([]);

    useEffect(() => {
        fetchBookmarks();        
      }, []);

      let bookmark_created_unix;
      let bookmark_created_formatted;



      async function fetchBookmarks() {
      const apiDataBookmarks = await API.graphql(graphqlOperation(listBookmarks, {filter: {user_id : { contains: global.authUserId}}}));
      const bookmarksFromAPI = apiDataBookmarks.data.listBookmarks.items;
      listOfBookmarks =  await Promise.all(
          bookmarksFromAPI.map(async (mybookmark) => (
            <tr key={mybookmark.id}><td>{mybookmark.bookmark_value}</td><td>{interpretBookmarkType(mybookmark.bookmark_type)}</td><td>{convertToLocalTime(mybookmark.timestamp_unix)}</td></tr>
          )))
          setBookmarks(bookmarksFromAPI);
        console.log(listOfBookmarks);
    }
    //then({ bookmark_created_unix = mybookmark.timestamp_unix

    return (
    <View className="GeneralPage">
    <LoginObject />
    <div>
    <h1>Your bookmarks</h1>
    <table><tbody><tr><th className="tableLabel">tx hash or block</th><th className="tableLabel">Type</th><th className="tableLabel">Timestamp</th></tr>{listOfBookmarks}</tbody></table>
    </div>
    </View>
    )
  }

  export default MyBlockmarks;