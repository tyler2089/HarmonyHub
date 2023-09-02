import { createReducer } from "@reduxjs/toolkit";
import setGlobalSearchInput from "../actions/setglobalsearchinput";
import setGlobalSearchResult from "../actions/setglobalsearchresult";
import setArtist from "../actions/setartist";
import setArtistTopSongs from "../actions/setartisttopsongs";
const initialState = {
  userSearch: null,
  searchResult: null,
  artistPage: null,
  artistTopSongs: null,
};

const searchReducer = createReducer(initialState, (builder) => {
  builder.addCase(setGlobalSearchInput, (state, action) => {
    state.userSearch = action.payload;
  });
  builder.addCase(setGlobalSearchResult, (state, action) => {
    state.searchResult = action.payload;
  });
  builder.addCase(setArtist, (state, action) => {
    state.artistPage = action.payload;
  });
  builder.addCase(setArtistTopSongs, (state, action) => {
    state.artistTopSongs = action.payload;
  });
});

export default searchReducer;
