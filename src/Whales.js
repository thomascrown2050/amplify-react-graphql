import React, { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { listNotes, listBookmarks } from "./graphql/queries";
import LoginObject from "./LoginObject";
import {
    View,
    withAuthenticator,
  } from "@aws-amplify/ui-react";

export let whales_data = [
    {
        "name": "Kraken 1",
        "organization": "Kraken",
        "addressType": "wallet",
        "address": "0x2910543Af39abA0Cd09dBb2D50200b3E800A63D2"
    },
    {
        "name": "Kraken 2",
        "organization": "Kraken",
        "addressType": "wallet",
        "address": "0x0A869d79a7052C7f1b55a8EbAbbEa3420F0D1E13"
    },
    {
        "name": "Kraken 3",
        "organization": "Kraken",
        "addressType": "wallet",
        "address": "0xE853c56864A2ebe4576a807D26Fdc4A0adA51919"
    },
    {
        "name": "Kraken 4",
        "organization": "Kraken",
        "addressType": "wallet",
        "address": "0x267be1C1D684F78cb4F6a176C4911b741E4Ffdc0"
    },
    {
        "name": "Kraken 5",
        "organization": "Kraken",
        "addressType": "wallet",
        "address": "0xFa52274DD61E1643d2205169732f29114BC240b3"
    },
    {
        "name": "Kraken 6",
        "organization": "Kraken",
        "addressType": "wallet",
        "address": "0x53d284357ec70cE289D6D64134DfAc8E511c8a3D"
    },
    {
        "name": "Kraken 7",
        "organization": "Kraken",
        "addressType": "wallet",
        "address": "0x89e51fA8CA5D66cd220bAed62ED01e8951aa7c40"
    },
    {
        "name": "Kraken 8",
        "organization": "Kraken",
        "addressType": "wallet",
        "address": "0xc6bed363b30DF7F35b601a5547fE56cd31Ec63DA"
    },
    {
        "name": "Kraken 9",
        "organization": "Kraken",
        "addressType": "wallet",
        "address": "0x29728D0efd284D85187362fAA2d4d76C2CfC2612"
    },
    {
        "name": "Kraken 10",
        "organization": "Kraken",
        "addressType": "wallet",
        "address": "0xAe2D4617c862309A3d75A0fFB358c7a5009c673F"
    },
    {
        "name": "Kraken 11",
        "organization": "Kraken",
        "addressType": "wallet",
        "address": "0x43984D578803891dfa9706bDEee6078D80cFC79E"
    },    
    {
        "name": "Kraken 12",
        "organization": "Kraken",
        "addressType": "wallet",
        "address": "0x66c57bF505A85A74609D2C83E94Aabb26d691E1F"
    },    
    {
        "name": "Kraken 13",
        "organization": "Kraken",
        "addressType": "wallet",
        "address": "0xDA9dfA130Df4dE4673b89022EE50ff26f6EA73Cf"
    },            
    {
        "name": "Kraken 14",
        "organization": "Kraken",
        "addressType": "wallet",
        "address": "0xA83B11093c858c86321FBc4c20FE82cdbd58E09E"
    },            
    {
        "name": "Unknown",
        "organization": "Unknown",
        "addressType": "wallet",
        "address": "0x8D56f551b44a6dA6072a9608d63d664ce67681a5"
    },
    {
        "name": "Kucoin",
        "organization": "Kucoin",
        "addressType": "wallet",
        "address": "0x2B5634C42055806a59e9107ED44D43c426E58258"
    },
    {
        "name": "Kucoin 2",
        "organization": "",
        "addressType": "wallet",
        "address": "0x689C56AEf474Df92D44A1B70850f808488F9769C"
    },
    {
        "name": "Kucoin 3",
        "organization": "",
        "addressType": "wallet",
        "address": "0xa1D8d972560C2f8144AF871Db508F0B0B10a3fBf"
    },
    {
        "name": "Kucoin 4",
        "organization": "",
        "addressType": "wallet",
        "address": "0x4ad64983349C49dEfE8d7A4686202d24b25D0CE8"
    },
    {
        "name": "Kucoin 5",
        "organization": "",
        "addressType": "wallet",
        "address": "0x1692E170361cEFD1eb7240ec13D048Fd9aF6d667"
    },
    {
        "name": "Kucoin 6",
        "organization": "",
        "addressType": "wallet",
        "address": "0xD6216fC19DB775Df9774a6E33526131dA7D19a2c"
    },
    {
        "name": "Kucoin 7",
        "organization": "",
        "addressType": "wallet",
        "address": "0xe59Cd29be3BE4461d79C0881D238Cbe87D64595A"
    },
    {
        "name": "Kucoin 8",
        "organization": "",
        "addressType": "wallet",
        "address": "0x899B5d52671830f567BF43A14684Eb14e1f945fe"
    },
    {
        "name": "Kucoin 9",
        "organization": "",
        "addressType": "wallet",
        "address": "0xf16E9B0D03470827A95CDfd0Cb8a8A3b46969B91"
    },
    {
        "name": "Kucoin 10",
        "organization": "",
        "addressType": "wallet",
        "address": "0xcaD621da75a66c7A8f4FF86D30A2bF981Bfc8FdD"
    },
    {
        "name": "Kucoin 11",
        "organization": "",
        "addressType": "wallet",
        "address": "0xeC30d02f10353f8EFC9601371f56e808751f396F"
    },
    {
        "name": "Kucoin 12",
        "organization": "",
        "addressType": "wallet",
        "address": "0x738cF6903E6c4e699D1C2dd9AB8b67fcDb3121eA"
    },
    {
        "name": "Kucoin 13",
        "organization": "",
        "addressType": "wallet",
        "address": "0xd89350284c7732163765b23338f2ff27449E0Bf5"
    },
    {
        "name": "Kucoin 14",
        "organization": "",
        "addressType": "wallet",
        "address": "0x88Bd4D3e2997371BCEEFE8D9386c6B5B4dE60346"
    },
    {
        "name": "Kucoin 15",
        "organization": "",
        "addressType": "wallet",
        "address": "0xb8e6D31e7B212b2b7250EE9c26C56cEBBFBe6B23"
    },
    {
        "name": "Beacon Deposit Contract",
        "organization": "",
        "addressType": "wallet",
        "address": "0x00000000219ab540356cBB839Cbe05303d7705Fa"
    },
    {
        "name": "Wrapped Ether",
        "organization": "",
        "addressType": "contract",
        "address": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    },
    {
        "name": "Binance 7",
        "organization": "",
        "addressType": "exchange wallet",
        "address": "0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8"
    },
    {
        "name": "Gate.io Main",
        "organization": "",
        "addressType": "wallet",
        "address": "0x0D0707963952f2fBA59dD06f2b425ace40b492Fe"
    },
    {
        "name": "Arbitrum Bridge",
        "organization": "",
        "addressType": "wallet",
        "address": "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
    },
    {
        "name": "Kraken 13",
        "organization": "",
        "addressType": "wallet",
        "address": "0xDA9dfA130Df4dE4673b89022EE50ff26f6EA73Cf"
    },
    {
        "name": "Gemini 3",
        "organization": "",
        "addressType": "wallet",
        "address": "0x61EDCDf5bb737ADffE5043706e7C5bb1f1a56eEA"
    },
    {
        "name": "Lido: Curve Liquidity Farming Pool Contract	",
        "organization": "",
        "addressType": "wallet",
        "address": "0xDC24316b9AE028F1497c275EB9192a3Ea0f67022"
    },
    {
        "name": "Binance 14",
        "organization": "",
        "addressType": "wallet",
        "address": "0x28C6c06298d514Db089934071355E5743bf21d60"
    },
    {
        "name": "Bitfinex 19",
        "organization": "",
        "addressType": "wallet",
        "address": "0xE92d1A43df510F82C66382592a047d288f85226f"
    },
    {
        "name": "Liquity: Active Pool",
        "organization": "",
        "addressType": "wallet",
        "address": "0xDf9Eb223bAFBE5c5271415C75aeCD68C21fE3D7F"
    },
    {
        "name": "EthDev",
        "organization": "",
        "addressType": "wallet",
        "address": "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe"
    },
    {
        "name": "Polkadot Multisig",
        "organization": "",
        "addressType": "wallet",
        "address": "0x3BfC20f0B9aFcAcE800D73D2191166FF16540258"
    },
    {
        "name": "Bitfinex 2",
        "organization": "",
        "addressType": "wallet",
        "address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
    },
    {
        "name": "Crypto.com 5",
        "organization": "",
        "addressType": "wallet",
        "address": "0xCFFAd3200574698b78f32232aa9D63eABD290703"
    },
    {
        "name": "",
        "organization": "",
        "addressType": "wallet",
        "address": ""
    },
    {
        "name": "Compound: cETH Token",
        "organization": "",
        "addressType": "wallet",
        "address": "0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5"
    },
    {
        "name": "Bitfinex 20",
        "organization": "",
        "addressType": "wallet",
        "address": "0x8103683202aa8DA10536036EDef04CDd865C225E"
    },
    {
        "name": "BitDAO Treasury",
        "organization": "",
        "addressType": "wallet",
        "address": "0x78605Df79524164911C144801f41e9811B7DB73D"
    },
    {
        "name": "Polygon (MATIC): Ether Bridge",
        "organization": "",
        "addressType": "bridge",
        "address": "0x8484Ef722627bf18ca5Ae6BcF031c23E6e922B30"
    },
    {
        "name": "Optimism Gateway",
        "organization": "",
        "addressType": "wallet",
        "address": "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
    },
    {
        "name": "Bitfinex 9",
        "organization": "",
        "addressType": "wallet",
        "address": "0x59448fe20378357F206880c58068f095ae63d5A5"
    },
    {
        "name": "Bithumb 12",
        "organization": "",
        "addressType": "wallet",
        "address": "0x558553D54183a8542F7832742e7B4Ba9c33Aa1E6"
    },
    {
        "name": "OKX 6",
        "organization": "",
        "addressType": "wallet",
        "address": "0x98EC059Dc3aDFBdd63429454aEB0c990FBA4A128"
    },
    {
        "name": "Crypto.com: 1",
        "organization": "",
        "addressType": "wallet",
        "address": "0x6262998Ced04146fA42253a5C0AF90CA02dfd2A3"
    },
    {
        "name": "Bitfinex 10",
        "organization": "",
        "addressType": "wallet",
        "address": "0x36a85757645E8e8AeC062a1dEE289c7d615901Ca"
    },
    {
        "name": "Kraken 4",
        "organization": "",
        "addressType": "wallet",
        "address": "0x267be1C1D684F78cb4F6a176C4911b741E4Ffdc0"
    },
    {
        "name": "FixedFloat Exchange",
        "organization": "",
        "addressType": "wallet",
        "address": "0x4E5B2e1dc63F6b91cb6Cd759936495434C7e972F"
    },
    {
        "name": "Gemini: Contract 1",
        "organization": "",
        "addressType": "wallet",
        "address": "0x07Ee55aA48Bb72DcC6E9D78256648910De513eca"
    },
    {
        "name": "Golem: Multisig",
        "organization": "",
        "addressType": "wallet",
        "address": "0x7da82C7AB4771ff031b66538D2fB9b0B047f6CF9"
    },
    {
        "name": "Gate.io: 5",
        "organization": "",
        "addressType": "wallet",
        "address": "0xC882b111A75C0c657fC507C04FbFcD2cC984F071"
    },
    {
        "name": "KuCoin 6",
        "organization": "",
        "addressType": "wallet",
        "address": "0xD6216fC19DB775Df9774a6E33526131dA7D19a2c"
    },
    {
        "name": "Unknown Whale 86M",
        "organization": "",
        "addressType": "wallet",
        "address": "0xBf94F0AC752C739F623C463b5210a7fb2cbb420B"
    },
    {
        "name": "Unknown Whale: 2M",
        "organization": "",
        "addressType": "wallet",
        "address": "0x832F166799A407275500430b61b622F0058f15d6"
    },
    {
        "name": "Binance US: 3",
        "organization": "",
        "addressType": "wallet",
        "address": "0xf60c2Ea62EDBfE808163751DD0d8693DCb30019c"
    },
    {
        "name": "Bybit",
        "organization": "",
        "addressType": "wallet",
        "address": "0xf89d7b9c864f589bbF53a82105107622B35EaA40"
    },
    {
        "name": "Binance 14",
        "organization": "",
        "addressType": "wallet",
        "address": "0x28C6c06298d514Db089934071355E5743bf21d60"
    },
    {
        "name": "Binance 15",
        "organization": "",
        "addressType": "wallet",
        "address": "0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549"
    },
    {
        "name": "Binance 16",
        "organization": "",
        "addressType": "wallet",
        "address": "0xDFd5293D8e347dFe59E90eFd55b2956a1343963d"
    },
    {
        "name": "Binance 17",
        "organization": "",
        "addressType": "wallet",
        "address": "https://etherscan.io/address/0x56Eddb7aa87536c09CCc2793473599fD21A8b17F"
    },

    {
        "name": "Unknown Whale 20M",
        "organization": "",
        "addressType": "wallet",
        "address": "0x941b4FdB4b1533Ab2Cc8b90fF0700F658B4Aa642"
    },
    {
        "name": "Unknown Whale 2M",
        "organization": "",
        "addressType": "wallet",
        "address": "0x389505f098a29a994A3ed0e674f07cd451dde42C"
    },
    {
        "name": "Unknown Whale 1M",
        "organization": "",
        "addressType": "wallet",
        "address": "0xA549487362B9BC4a66804fbf4774B2Cc26Ffd4Bb"
    },
    {
        "name": "Unknown Whale 5M",
        "organization": "",
        "addressType": "wallet",
        "address": "0xCfC0F98f30742B6d880f90155d4EbB885e55aB33"
    },
    {
        "name": "Stake.com: Gambling",
        "organization": "",
        "addressType": "wallet",
        "address": "0x974CaA59e49682CdA0AD2bbe82983419A2ECC400"
    },
    {
        "name": "Union Chain",
        "organization": "",
        "addressType": "wallet",
        "address": "0x963737C550E70FFe4D59464542a28604eDb2eF9a"
    },
    {
        "name": "",
        "organization": "",
        "addressType": "wallet",
        "address": ""
    },
    {
        "name": "Unknown Whale 40M",
        "organization": "",
        "addressType": "wallet",
        "address": "0xb16b7454C71C04DaFF93614AB4f98e2eE75613D4"
    },
    {
        "name": "Gemini: Main",
        "organization": "",
        "addressType": "wallet",
        "address": "0xd24400ae8BfEBb18cA49Be86258a3C749cf46853"
    },
    {
        "name": "Bovada: Gambling",
        "organization": "",
        "addressType": "wallet",
        "address": "0x6dfc34609a05bC22319fA4Cce1d1E2929548c0D7"
    },
    {
        "name": "Unknown Whale: 100M",
        "organization": "",
        "addressType": "wallet",
        "address": "0x4E7b110335511F662FDBB01bf958A7844118c0D4"
    },
    {
        "name": "Nexo 2",
        "organization": "",
        "addressType": "wallet",
        "address": "0xFfec0067F5a79CFf07527f63D83dD5462cCf8BA4"
    },
    {
        "name": "Nexo 3",
        "organization": "",
        "addressType": "wallet",
        "address": "0x0031e147A79c45f24319dc02ca860cB6142FCBA1"
    },
    {
        "name": "Unknown Whale: 10M",
        "organization": "",
        "addressType": "wallet",
        "address": "0x292f04a44506c2fd49Bac032E1ca148C35A478c8"
    },    

    {
        "name": "Paxos",
        "organization": "",
        "addressType": "wallet",
        "address": "0xc5a8859c44aC8AA2169aFaCF45B87C08593beC10"
    },    

    {
        "name": "DuelBits",
        "organization": "",
        "addressType": "wallet",
        "address": "0x4E80744fa23cEC76e1621ce0DfACeB4B1D532e12"
    },    
    {
        "name": "MEV Bot Unknown",
        "organization": "",
        "addressType": "wallet",
        "address": "0xf8b721bFf6Bf7095a0E10791cE8f998baa254Fd0"
    },   
    {
        "name": "MEV Bot Unknown",
        "organization": "",
        "addressType": "wallet",
        "address": "0xa57Bd00134B2850B2a1c55860c9e9ea100fDd6CF"
    },   
    {
        "name": "MEV Bot Unknown",
        "organization": "",
        "addressType": "wallet",
        "address": "0x0000000000007F150Bd6f54c40A34d7C3d5e9f56"
    },   
    {
        "name": "MEV Bot Unknown",
        "organization": "",
        "addressType": "wallet",
        "address": "0x860bd2dba9Cd475A61E6d1b45e16c365F6D78F66"
    },   
    {
        "name": "MEV Bot Unknown",
        "organization": "",
        "addressType": "wallet",
        "address": "0x000000000000006F6502B7F2bbaC8C30A3f67E9a"
    },   
    {
        "name": "MEV Bot Unknown",
        "organization": "",
        "addressType": "wallet",
        "address": "0x98C3d3183C4b8A650614ad179A1a98be0a8d6B8E"
    },   
    {
        "name": "MEV Bot Unknown",
        "organization": "",
        "addressType": "wallet",
        "address": "0x4Cb18386e5d1F34dC6EEA834bf3534A970a3f8e7"
    },   
    {
        "name": "MEV Bot Unknown",
        "organization": "",
        "addressType": "wallet",
        "address": "0x4d246bE90C2f36730bb853aD41d0a189061192d3"
    },   
    {
        "name": "MEV Bot Unknown",
        "organization": "",
        "addressType": "wallet",
        "address": "0xA69babEF1cA67A37Ffaf7a485DfFF3382056e78C"
    },   
    {
        "name": "MEV Bot Unknown",
        "organization": "",
        "addressType": "wallet",
        "address": "0xBEEFBaBEeA323F07c59926295205d3b7a17E8638"
    },   
    {
        "name": "MEV Bot Unknown",
        "organization": "",
        "addressType": "wallet",
        "address": "0x000000000dFDe7deaF24138722987c9a6991e2D4"
    },   
    {
        "name": "Bittrex",
        "organization": "",
        "addressType": "wallet",
        "address": "0xFBb1b73C4f0BDa4f67dcA266ce6Ef42f520fBB98"
    },   
    {
        "name": "Tether: USDT contract",
        "organization": "",
        "addressType": "contract",
        "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7"
    },   

]

let whaleHTML = "";
export function buildWhaleTable(whaleInput){
    
       let whaleHTML =  whaleInput.map(
            (individualWhale) => 
            ( <tr><td>{individualWhale.name}</td><td><a class='undecoratedLink' rel='noopener noreferrer' target='_blank' href={`https://etherscan.io/address/` +individualWhale.address}>{individualWhale.address}</a></td></tr>
            )
       );
    return whaleHTML;
}

function Whales(props) {
    useEffect(() => {
      }, []);

    return (
    <View className="GeneralPage">
    <LoginObject />
    <div>
    <h1>Whales: Large Wallets and Notable Accounts</h1>
    {whales_data.length} Whales:
    <table id="whaleTable">
    {buildWhaleTable(whales_data)}
    </table>
    </div>
    </View>
    )
  }

  export default Whales;