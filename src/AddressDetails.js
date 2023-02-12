import React, { useState, useEffect } from "react";
import AddressInformation from "./AddressInformation";
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

const AddressDetails = ({ signOut }) => {
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

let { addressId } = useParams();
let addressIdNumber = Number(addressId);

return (
<View className="App">
<LoginObject />
<h1>Address: <Link to={`https://etherscan.io/address/` + addressId} target="_blank" rel="noopener noreferrer"></Link>{addressId}</h1>
<AddressInformation address={addressId} />
</View>
)

}

export default AddressDetails