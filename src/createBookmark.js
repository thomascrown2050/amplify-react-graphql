async function CreateBookmark(event, hash, user_id, bookmarkType){

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

  export default CreateBookmark;