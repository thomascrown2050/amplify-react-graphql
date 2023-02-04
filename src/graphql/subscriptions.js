/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateNote = /* GraphQL */ `
  subscription OnCreateNote($filter: ModelSubscriptionNoteFilterInput) {
    onCreateNote(filter: $filter) {
      id
      name
      description
      image
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateNote = /* GraphQL */ `
  subscription OnUpdateNote($filter: ModelSubscriptionNoteFilterInput) {
    onUpdateNote(filter: $filter) {
      id
      name
      description
      image
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteNote = /* GraphQL */ `
  subscription OnDeleteNote($filter: ModelSubscriptionNoteFilterInput) {
    onDeleteNote(filter: $filter) {
      id
      name
      description
      image
      createdAt
      updatedAt
    }
  }
`;
export const onCreateBookmark = /* GraphQL */ `
  subscription OnCreateBookmark($filter: ModelSubscriptionBookmarkFilterInput) {
    onCreateBookmark(filter: $filter) {
      id
      user_id
      name
      description
      bookmark_type
      bookmark_value
      timestamp_unix
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateBookmark = /* GraphQL */ `
  subscription OnUpdateBookmark($filter: ModelSubscriptionBookmarkFilterInput) {
    onUpdateBookmark(filter: $filter) {
      id
      user_id
      name
      description
      bookmark_type
      bookmark_value
      timestamp_unix
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteBookmark = /* GraphQL */ `
  subscription OnDeleteBookmark($filter: ModelSubscriptionBookmarkFilterInput) {
    onDeleteBookmark(filter: $filter) {
      id
      user_id
      name
      description
      bookmark_type
      bookmark_value
      timestamp_unix
      createdAt
      updatedAt
    }
  }
`;
