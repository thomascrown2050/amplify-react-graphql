import React, { useState, useEffect } from "react";
import App from "./App";
import { API, Storage, Auth} from "aws-amplify";
import {
    createBookmark as createBookmarkMutation
  } from "./graphql/mutations";
import { Network, Alchemy, Utils } from "alchemy-sdk";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookBookmark, faBookmark, faCoffee } from '@fortawesome/free-solid-svg-icons'

import {
  Button,
  Flex,
  Heading,
  Image,
  Table,
  Text,
  TextField,
  View,
  withAuthenticator,
} from "@aws-amplify/ui-react";

//Declare variables
let currentBlock;
let previousBlock1;
let previousBlock2;
let previousBlock3;

let listTransactions2;

let thisblockTimestamp;
let thisblockTimestampUTCString;
let thisblockTimestampLocalString;
let thisblockGasLimit;
let thisblockGasLimitHexValue;
let thisblockGasLimitDecValue;
let thisblockGasUsed;
let thisblockGasUsedHexValue; 
let thisblockGasUsedDecValue;
let thisblockMaxPriorityFeePerGas;
let thisblockMaxFeePerGas;
let thisblockTransactionLength;

let authUserId;

//Setup user authentication data
Auth.currentAuthenticatedUser({
  bypassCache: false // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
}).then((user) => 
  {authUserId = user.attributes["sub"];
}).catch((err) => console.log(err));

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

/*
const passedBlockTransactionsData = alchemy.core
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
    listTransactions = data["transactions"].map(
      (individualTransaction) =><tr key={individualTransaction.hash}><td key={individualTransaction.hash}><a className="undecoratedLink" target='_blank' href={`https://etherscan.io/tx/` + individualTransaction.hash}>{individualTransaction.hash}</a></td><td>{Utils.formatEther(individualTransaction.value)}</td><td><a className="undecoratedLink" target='_blank' href={`https://etherscan.io/address/` + individualTransaction.from}>{individualTransaction.from}</a></td><td><a className="undecoratedLink" target='_blank' href={`https://etherscan.io/address/` + individualTransaction.to}>{individualTransaction.to}</a></td><td><a className="undecoratedLink" target='_blank' href={`https://etherscan.io/tx/${individualTransaction.hash}`}>View</a></td><td><button onClick={(e) => {createBookmark(e, individualTransaction.hash, authUserId, 1)}}><FontAwesomeIcon icon={faBookmark} /></button></td></tr>
      );
  })
  */


const TableBlockTransactions =  (props)  =>{

let blockToUse = props.block;
console.log(typeof(blockToUse));
//let blockToUseInt = Number(blockToUse);

const passedBlockTransactionsData = alchemy.core
  .getBlockWithTransactions(
   blockToUse
  ).then(data => {
    thisblockTimestamp = data["timestamp"];
    let bts = new Date (thisblockTimestamp * 1000);
    thisblockTimestampUTCString = bts.toUTCString();
    thisblockTimestampLocalString = bts.toTimeString();

    thisblockGasLimit = data["gasLimit"];
    thisblockGasLimitHexValue = thisblockGasLimit._hex;
    thisblockGasLimitDecValue = parseInt(thisblockGasLimitHexValue);
    thisblockGasUsed = data["gasUsed"];
    thisblockGasUsedHexValue = thisblockGasUsed._hex;
    thisblockGasUsedDecValue = parseInt(thisblockGasUsedHexValue);
    thisblockMaxPriorityFeePerGas = data["maxPriorityFeePerGas"];
    thisblockMaxFeePerGas = data["maxFeePerGas"];
    thisblockTransactionLength = data["transactions"].length;
    listTransactions2 = data["transactions"].map(
      (individualTransaction) =><tr key={individualTransaction.hash}><td key={individualTransaction.hash}><a className="undecoratedLink" target='_blank' href={`https://etherscan.io/tx/` + individualTransaction.hash}>{individualTransaction.hash}</a></td><td>{Utils.formatEther(individualTransaction.value)}</td><td><a className="undecoratedLink" target='_blank' href={`https://etherscan.io/address/` + individualTransaction.from}>{individualTransaction.from}</a></td><td><a className="undecoratedLink" target='_blank' href={`https://etherscan.io/address/` + individualTransaction.to}>{individualTransaction.to}</a></td><td><a className="undecoratedLink" target='_blank' href={`https://etherscan.io/tx/${individualTransaction.hash}`}>View</a></td><td><button onClick={(e) => {createBookmark(e, individualTransaction.hash, authUserId, 1)}}><FontAwesomeIcon icon={faBookmark} /></button></td></tr>
      );
    console.log(listTransactions2);
    //console.log(blockToUseInt);
  })

  useEffect(() => {
//console.log('test');
  }, [])

    return (
<View>
<div>

<table><tbody><tr><th>tx hash</th><th>ETH</th><th>From</th><th>To</th><th>View</th><th>Save</th></tr>{listTransactions2}</tbody></table>        
</div>
</View>
    );
    }
//<span>Block: {props.block}</span>

export default TableBlockTransactions;