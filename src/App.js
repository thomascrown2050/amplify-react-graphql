import React, { useState, useEffect } from "react";
import TableBlockTransactions from "./TableBlockTransactions";
import styled from 'styled-components';
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
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
  import { faBookBookmark, faBookmark, faCoffee, faSolid, faArrowRighFromBracket, faBoltLightning, faSignIn, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

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

/* global BigInt */

/* 
Notes:
https://cssgradient.io/
https://www.joshwcomeau.com/gradient-generator/
https://stackoverflow.com/questions/2869212/css3-gradient-background-set-on-body-doesnt-stretch-but-instead-repeats

Bookmark types
1 = tx hash
2 = block
3 = address 

TODOs
P0s
- DONE Show blockdata as a component
- TBD Show user their own bookmarks

Backlog
- Security check
- Figure out a wallet login somehow 
- Get working block pages
- minify the favicon
- add tx's for recent blocks
- cleanup: remove notes functions
- recent block metadata: consider adding the transactions
- add links to each component
- Get price data so you can estimate the amount spent on gas on this block
- consistent case usage like camelCase
- turn block data into array
- Add Powered by page
- Bring user auth up and ability to log out
- Understand why you pass the sign out variable in app function
- Show that user's bookmarks 
- Let user delete a bookmark
- Show metadata about block e.g. # transactions
 - Add ENS name for the from and to 
 - enhanced blockdata - unique addresses, top addresses and transactions/value , 
 - enhanced tx's - value they received
 - show eth balance of the from + other tokens/total value
 - alchemy_getEnhancedBlockData = e.g. # transactions today, this week, anomaly vs. gas usage, etc. 
 - Search blocks by number, hash, day/time, and then bookmark things / email / tweet it out...
*/

//Declare variables
let currentBlock;
let previousBlock1;
let previousBlock2;
let previousBlock3;


//For rendering current block metadata
//let listTransactions;
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
let authUserName;

//Setup user authentication data
Auth.currentAuthenticatedUser({
  bypassCache: false // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
}).then((user) => 
  {authUserId = user.attributes["sub"];
  authUserName = user.username;
  //console.log(user);
}).catch((err) => console.log(err));

//Declare Alchemy
const settings = {
  apiKey: "CB-QgjFspXqe-NNDKq694tzcDuAtmpNs", 
  network: Network.ETH_MAINNET, 
};

const alchemy = new Alchemy(settings);

//Get latest block
alchemy.core.getBlockNumber().then(data => {
  currentBlock = data;
  previousBlock1 = currentBlock-1;
  previousBlock2 = currentBlock-2;
  previousBlock3 = currentBlock-3;
});

//Main app

const App = ({ signOut }) => {
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

  async function createBookmark(event, hash, user_id, bookmarkType){

    if(user_id===null){
      user_id = 1;
    }

    var currentUnixTime = Date.now();
    event.preventDefault();

    const newBookmarks = await API.graphql({
      query: createBookmarkMutation,
      variables: {
          input: {
      "user_id": user_id,            
      "name": "No name",
      "description": "No description",
      "bookmark_type": bookmarkType,
      "bookmark_value": hash,
      "timestamp_unix": currentUnixTime
    }
      }
  }).catch(e => {console.log(e)})
  //const apiBookmarkData = await API.graphql({ query: listBookmarks });
  //const bookmarksFromAPI = apiBookmarkData.data.listBookmarks.items.then(console.log("Bookmarks" + bookmarksFromAPI));
  
  }

  //For rendering summary data about the block on the page
  const currentBlockTransactionsData = alchemy.core
  .getBlockWithTransactions(
   currentBlock
  ).then(data => {
    blockTimestamp = data["timestamp"];
    let bts = new Date (blockTimestamp * 1000);
    blockTimestampUTCString = bts.toUTCString();
    blockTimestampLocalString = bts.toTimeString();

    blockGasLimit = data["gasLimit"];
    blockGasLimitHexValue = blockGasLimit._hex;
    blockGasLimitDecValue = parseInt(blockGasLimitHexValue);
    blockGasUsed = data["gasUsed"];
    blockGasUsedHexValue = blockGasUsed._hex;
    blockGasUsedDecValue = parseInt(blockGasUsedHexValue);
    blockMaxPriorityFeePerGas = data["maxPriorityFeePerGas"];
    blockMaxFeePerGas = data["maxFeePerGas"];
    blockTransactionLength = data["transactions"].length;
    /*
    listTransactions = data["transactions"].map(
      (individualTransaction) =><tr key={individualTransaction.hash}><td key={individualTransaction.hash}><a className="undecoratedLink" target='_blank' href={`https://etherscan.io/tx/` + individualTransaction.hash}>{individualTransaction.hash}</a></td><td>{Utils.formatEther(individualTransaction.value)}</td><td><a className="undecoratedLink" target='_blank' href={`https://etherscan.io/address/` + individualTransaction.from}>{individualTransaction.from}</a></td><td><a className="undecoratedLink" target='_blank' href={`https://etherscan.io/address/` + individualTransaction.to}>{individualTransaction.to}</a></td><td><a className="undecoratedLink" target='_blank' href={`https://etherscan.io/tx/${individualTransaction.hash}`}>View</a></td><td><button onClick={(e) => {createBookmark(e, individualTransaction.hash, authUserId, 1)}}><FontAwesomeIcon icon={faBookmark} /></button></td></tr>
      );
      */
  })


  //<span className="identityButton" onClick={signOut}><FontAwesomeIcon icon={faSignOutAlt} /></span>

  return (
    <View className="App">


      <div id="loginObject">
      <span>{authUserName}</span>&nbsp;|&nbsp;
      <span>Blockmarks</span>&nbsp;|&nbsp;
      <span className="identityButton" onClick={signOut}>Log out</span>
      </div>

      <h1 className="funHeading">blockmark</h1>

      <div id="currentBlockInfo">
      <div>Current block: {currentBlock} <button><FontAwesomeIcon icon={faBookmark} onClick={(e) => {createBookmark(e, currentBlock, authUserId, 2)}} /></button></div>
      <div id="blockMetadata">
      <span className="metadataLabels">Finalized: </span> {blockTimestampLocalString} &nbsp;
      <span className="metadataLabels">txs: </span> {blockTransactionLength} &nbsp;
      <span className="metadataLabels">Gas limit: </span> {blockGasLimitDecValue} ({blockGasLimitHexValue}) &nbsp;
      <span className="metadataLabels">Gas used: </span> {blockGasUsedDecValue} ({blockGasUsedHexValue})
      </div>

      <div>Recent: 
        &nbsp; 
      
      <Link className="fancyLink" to={`block/` + previousBlock3}>{previousBlock3}</Link>&nbsp;|&nbsp;  
      <Link className="fancyLink" to={`block/` + previousBlock2}>{previousBlock2}</Link>&nbsp;|&nbsp;  
      <Link className="fancyLink" to={`block/` + previousBlock1}>{previousBlock1}</Link>&nbsp; 
      </div>
      </div>
      <br />
      <TableBlockTransactions block={currentBlock} />
      
      
    </View>
  );
};

//<TableBlockTransactions2 block={currentBlock} tx={listTransactions} />
//<TableBlockTransactions block={currentBlock} tx={listTransactions} />

//Moved to a component
//<table><tr><th>tx hash</th><th>ETH</th><th>From</th><th>To</th><th>View</th><th>Save</th></tr>{listTransactions}</table>

export default withAuthenticator(App);