import React, { useState, useEffect } from "react";
import {whales_data, buildWhaleTable} from "./Whales";
import * as ReactDOM from 'react-dom';
import { API, Storage, Auth} from "aws-amplify";
import {
    createBookmark as createBookmarkMutation
  } from "./graphql/mutations";
import { Network, Alchemy, Utils } from "alchemy-sdk";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faBookmark } from '@fortawesome/free-solid-svg-icons'

import {
  View,
  withAuthenticator,
} from "@aws-amplify/ui-react";
import toast, { Toaster } from 'react-hot-toast';


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

let blockFromAddresses = [];

const notify_saved_bookmark = () => toast.success('Your bookmark has been saved.', {duration: 3000});
const notify_ENS_completed = () => toast.success('All ENS and ETH holdings data added.', {duration: 3000});

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

  

    let fromENSnfts = [];
    let NFTresponse;

    let holdingsArray = [];
    let thisWalletETH;
    let formattedThisWalletETH;
    let ensContractAddress = "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85";
    let filteredEtherscanENSlink = "https://etherscan.io/token/0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85?a=";
    
    async function getAllENS(fromArray){
      
      for(let i=0; i<thisblockTransactionLength;i++){
        let walletAddress = fromArray[i];
        let customENSESlink = filteredEtherscanENSlink+walletAddress+"#inventory";
        let fullENSString;
        let ENShtml;

      //Get and set ENS names
      setTimeout(await alchemy.nft.getNftsForOwner(walletAddress, {contractAddresses: [ensContractAddress]}).then(
        function(data){
          //console.log(data);
          if(data["ownedNfts"].length>0){
            fullENSString = data["ownedNfts"][0]["title"];
            for(let j=0; j<data["ownedNfts"].length; j++){
              ENShtml = "<a class='undecoratedLink' rel='noopener noreferrer' target='_blank' href='https://opensea.io/"+walletAddress+"'>"+data["ownedNfts"][0]["title"]+"<img class='tableExternalIcon' src='../media/opensea-logo-white.png' alt='OS_logo' resizeMode='contain' /></a><a href='https://etherscan.io/address/"+walletAddress+"'><img class='tableExternalIcon' src='../media/etherscan-logo-light-circle.png' alt='ES_logo' resizeMode='contain' /></a>";
              if(j>0){
              fullENSString = fullENSString.concat(", ", data["ownedNfts"][j]["title"]);  
              ENShtml = "<a class='undecoratedLink' rel='noopener noreferrer' target='_blank' href='https://opensea.io/"+walletAddress+"'>"+fullENSString+"<img class='tableExternalIcon' src='../media/opensea-logo-white.png' alt='OS_logo' resizeMode='contain' /></a><a class='undecoratedLink' rel='noopener noreferrer' target='_blank' href='"+customENSESlink+"'><img class='tableExternalIcon' src='../media/etherscan-logo-light-circle.png' alt='ES_logo' resizeMode='contain' /></a>"
              }
            }
            try{document.getElementById("ENS"+walletAddress).innerHTML = ENShtml}catch(error){console.log(error);}
            fromENSnfts.push({[walletAddress]: data["ownedNfts"][0]["title"]})            
          };
        }), 50);

        //Fetch and construct ETH holdings array
        alchemy.core.getBalance(walletAddress, "latest").then(function(data){
          thisWalletETH = data["_hex"];
          if(thisWalletETH==undefined){
            thisWalletETH = 0;
          }
          formattedThisWalletETH = Utils.formatEther(thisWalletETH);
          holdingsArray.push({[walletAddress]: formattedThisWalletETH});
      });
        
        //Set ETH holdings in UI (TBD token holdings)
        for(let k=0; k<holdingsArray.length; k++){
       let helperElement= Object.keys(holdingsArray[k]);
       try{
         document.getElementById("ETHholdings"+helperElement).innerHTML = Object.values(holdingsArray[k]);
       }catch (error) {
        //console.error(error);
      }
      }
      
      //Look for whale address matches and update in the DOM
      var resultWhale = whales_data.find(item => item.address === walletAddress);
      if(resultWhale!=undefined)
      {
        try{
        document.getElementById("addressLabel"+walletAddress).innerHTML = resultWhale.name;
        }
        catch(error){}
      }

        
      }  
      //Browser notification to say we updated data
      notify_ENS_completed();
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

}

const TableBlockTransactions =  (props)  =>{

let blockToUse = props.block;

const blockFromAddresses = [];    
const blockToAddresses = [];    

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
      (individualTransaction) => (
      blockFromAddresses.push(individualTransaction.from),
      blockToAddresses.push(individualTransaction.to),
      <tr key={individualTransaction.hash}><td key={individualTransaction.hash}><a className="undecoratedLink" rel="noopener noreferrer" target='_blank' href={`https://etherscan.io/tx/` + individualTransaction.hash}>{individualTransaction.hash}</a></td>
      <td>{Utils.formatEther(individualTransaction.value)}</td>
      <td><a className="undecoratedLink" rel="noopener noreferrer" href={`/address/${individualTransaction.from}`}>{individualTransaction.from}</a><a className="undecoratedLink" rel="noopener noreferrer" target='_blank' href={`https://etherscan.io/address/` + individualTransaction.from}><img class='tableExternalIcon' src='../media/etherscan-logo-light-circle.png' alt='ES_logo' resizeMode='contain' /></a></td>
      <td id={"addressLabel"+individualTransaction.from}>-</td>
      <td id={"ETHholdings"+individualTransaction.from}>-</td>
      <td id={"ENS"+individualTransaction.from}><a className="undecoratedLink" rel="noopener noreferrer" target='_blank' href={`https://opensea.io/` + individualTransaction.from}>-</a></td>
      <td><a className="undecoratedLink" rel="noopener noreferrer" href={`/address/${individualTransaction.to}`}>{individualTransaction.to}</a><a className="undecoratedLink" rel="noopener noreferrer" target='_blank' href={`https://etherscan.io/address/` + individualTransaction.to}><img class='tableExternalIcon' src='../media/etherscan-logo-light-circle.png' alt='ES_logo' resizeMode='contain' /></a></td>
      <td id={"addressLabel"+individualTransaction.to}>-</td>
      <td id={"ETHholdings"+individualTransaction.to}>-</td>
      <td id={"ENS"+individualTransaction.to}><a className="undecoratedLink" rel="noopener noreferrer" target='_blank' href={`https://opensea.io/` + individualTransaction.to}>-</a></td>
      <td><a className="undecoratedLink" rel="noopener noreferrer" target='_blank' href={`https://etherscan.io/tx/${individualTransaction.hash}`}>View</a></td>
      <td><button onClick={(e) => {notify_saved_bookmark(); createBookmark(e, individualTransaction.hash, authUserId, 1)}}><FontAwesomeIcon icon={faBookmark} /></button></td></tr>
      )
      );
      setTimeout(getAllENS(blockFromAddresses), 2000);
      setTimeout(getAllENS(blockToAddresses), 2000);      
  })


  useEffect(() => {
    
  }, [])

    return (
<View>
<div>
<Toaster />
</div>
<div>
<table><tbody><tr><th className="tableLabel">tx hash</th>
<th className="tableLabel">ETH</th><th className="tableLabel">From</th>
<th>From: Label</th>
<th>From: ETH Holdings</th>
<th>From: ENS</th> 
<th className="tableLabel">To</th>
<th>To: Label</th>
<th>To: ETH Holdings</th>
<th>To: ENS</th>
<th className="tableLabel">View</th><th className="tableLabel">Save</th></tr>
{listTransactions2}</tbody></table>        
</div>
</View>
    );
    }

export default TableBlockTransactions;
