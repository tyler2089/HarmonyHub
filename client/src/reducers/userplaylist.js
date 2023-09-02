import { createReducer } from "@reduxjs/toolkit";
import showPlaylist from "../actions/showplaylist";
import addToPlaylist from "../actions/addtoplaylist";
import removeFromPlaylist from "../actions/removefromplaylist";
const initialState = {
  showPlaylist: false,
  playlistContent: [],
};

const playlistReducer = createReducer(initialState, (builder) => {
  builder.addCase(showPlaylist, (state, action) => {
    state.showPlaylist = action.payload;
  });

  builder.addCase(addToPlaylist, (state, action) => {
    state.playlistContent = [...state.playlistContent, action.payload];
  });

  builder.addCase(removeFromPlaylist, (state, action) => {
    state.playlistContent = state.playlistContent.filter(
      (item) => item.name !== action.payload
    );

    console.log(state.playlistContent);
  });
});

export default playlistReducer;
