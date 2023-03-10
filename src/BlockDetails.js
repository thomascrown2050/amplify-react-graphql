import React, { useState, useEffect } from "react";
import TableBlockTransactions from "./TableBlockTransactions";
import {
  Link,
  useParams
} from "react-router-dom";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { API, Storage} from "aws-amplify";
import {
  View
} from "@aws-amplify/ui-react";
import { listNotes, listBookmarks } from "./graphql/queries";
import LoginObject from "./LoginObject";

//Find a way to clean up this function and remove things about notes you dojn't use
const BlockDetails = ({ signOut }) => {
        const [notes, setNotes] = useState([]);

        useEffect(() => {
            fetchNotes();
          }, []);
        
          async function fetchNotes() {
            const apiData = await API.graphql({ query: listNotes });
            const notesFromAPI = apiData.data.listNotes.items;
            await Promise.all(
              notesFromAPI.map(async (note) => {
                if (note.image) {
                  const url = await Storage.get(note.name);
                  note.image = url;
                }
                return note;
              })
            );
            setNotes(notesFromAPI);
          }

let { blockId } = useParams();
let blockIdNumber = Number(blockId);

return (
<View className="App">
<LoginObject />
<h1>Block: <Link to={`https://etherscan.io/block/` + blockId} target="_blank" rel="noopener noreferrer"></Link>{blockId}</h1>
<TableBlockTransactions block={blockIdNumber} />
</View>
)

}

export default BlockDetails