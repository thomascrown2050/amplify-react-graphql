import React, { useState, useEffect } from "react";
import TableBlockTransactions from "./TableBlockTransactions";
//import styled from 'styled-components';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link, 
  useParams
} from "react-router-dom";
import ReactDOM from 'react-dom'

import "./App.css";
import "@aws-amplify/ui-react/styles.css";
//  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//  import { faBookBookmark, faBookmark, faCoffee } from '@fortawesome/free-solid-svg-icons'
import { API, Storage, Auth} from "aws-amplify";
import {
  Button,
  Flex,
  Heading,
  Image,
  Text,
  TextField,
  View,
  withAuthenticator,
} from "@aws-amplify/ui-react";
import { listNotes, listBookmarks } from "./graphql/queries";

import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
  createBookmark as createBookmarkMutation
} from "./graphql/mutations";
import { Network, Alchemy, Utils } from "alchemy-sdk";

/*
let currentBlock;
let previousBlock1;
let previousBlock2;
let previousBlock3;

let listTransactions2;

let blockTimestamp;
let blockTimestampUTCString;
let blockTimestampLocalString;
let blockGasLimit;
let blockGasLimitHexValue;
let blockGasLimitDecValue;
let blockGasUsed;
let blockGasUsedHexValue; 
let blockGasUsedDecValue;
let blockMaxPriorityFeePerGas;
let blockMaxFeePerGas;
let blockTransactionLength;

let authUserId;
*/

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
<h1>Block: {blockId}</h1>
<TableBlockTransactions block={blockIdNumber} />
</View>
)

}

export default BlockDetails