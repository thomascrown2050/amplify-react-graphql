import React, { useState, useEffect } from "react";
import { Network, Alchemy } from "alchemy-sdk";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { API, Storage } from "aws-amplify";
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
import { listNotes } from "./graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
  createBookmark as createBookmarkMutation
} from "./graphql/mutations";

// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  apiKey: "CB-QgjFspXqe-NNDKq694tzcDuAtmpNs", // Replace with your Alchemy API Key.
  network: Network.ETH_MAINNET, // Replace with your network.
};
const alchemy = new Alchemy(settings);

let currentBlock;
alchemy.core.getBlockNumber().then(data => {currentBlock = data; console.log(currentBlock)});

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

  async function createBookmark(event){
    alert('hello world!');
    var currentUnixTime = date.Now();
    event.preventDefault();
    const newBookmarks = await API.graphql({
      query: createBookmarkMutation,
      variables: {
          input: {
      "user_id": "a3f4095e-39de-43d2-baf4-f8c16f0f6f4d",
      "bookmark_type": "Lorem ipsum dolor sit amet",
      "bookmark_value": "Lorem ipsum dolor sit amet",
      "timestamp_unix": 1023123,
      "comments": "Lorem ipsum dolor sit amet"
    }
      }
  });
    //event.target.reset();
  }

  async function createTestNote(event){
    alert('hello world!');
    event.preventDefault();
    //const form = new FormData(event.target);
    //const image = form.get("image");
    const data = {
      name: "testnote"+Math.random(),
      description: Math.random(),
      image: null
    };
    //if (!!data.image) await Storage.put(data.name, image);
    await API.graphql({
      query: createNoteMutation,
      variables: { input: data },
    });
    fetchNotes();
    //event.target.reset();
  }

  async function createNote(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const image = form.get("image");
    const data = {
      name: form.get("name"),
      description: form.get("description"),
      image: image.name,
    };
    if (!!data.image) await Storage.put(data.name, image);
    await API.graphql({
      query: createNoteMutation,
      variables: { input: data },
    });
    fetchNotes();
    event.target.reset();
  }

  async function deleteNote({ id, name }) {
  const newNotes = notes.filter((note) => note.id !== id);
  setNotes(newNotes);
  await Storage.remove(name);
  await API.graphql({
    query: deleteNoteMutation,
    variables: { input: { id } },
  });
}

  return (
    <View className="App">
      <Heading level={1}>My Notes App</Heading>
      <h1>Current block: {currentBlock} <button onClick={createBookmark}>Save</button></h1>
      <View as="form" margin="3rem 0" onSubmit={createNote}>
        <Flex direction="row" justifyContent="center">
          <TextField
            name="name"
            placeholder="Note Name"
            label="Note Name"
            labelHidden
            variation="quiet"
            required
          />
          <TextField
            name="description"
            placeholder="Note Description"
            label="Note Description"
            labelHidden
            variation="quiet"
            required
          />
          <View
          name="image"
          as="input"
          type="file"
          style={{ alignSelf: "end" }}
          />
          <Button type="submit" variation="primary">
            Create Note
          </Button>
        </Flex>
      </View>
      <Heading level={2}>Current Notes</Heading>
      <View margin="3rem 0">
      {notes.map((note) => (
  <Flex
    key={note.id || note.name}
    direction="row"
    justifyContent="center"
    alignItems="center"
  >
    <Text as="strong" fontWeight={700}>
      {note.name}
    </Text>
    <Text as="span">{note.description}</Text>
    {note.image && (
      <Image
        src={note.image}
        alt={`visual aid for ${notes.name}`}
        style={{ width: 20 }}
      />
    )}
    <Button variation="link" onClick={() => deleteNote(note)}>
      Delete note
    </Button>
  </Flex>
))}
      </View>
      <Button onClick={signOut}>Sign Out</Button>
    </View>
  );
};

export default withAuthenticator(App);