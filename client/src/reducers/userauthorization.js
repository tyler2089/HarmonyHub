import { createReducer } from "@reduxjs/toolkit";
import setGlobalAccessToken from "../actions/setglobalaccesstoken";
import setGlobalUserProfile from "../actions/setuserprofile";
import setUserTopItems from "../actions/setusertopitems";
import setUserTopTracks from "../actions/setusertoptracks";

const initialState = {
  profile: null,
  accessToken: null,
  userTopItems: null,
  userTopTracks: null,
  test: null,
};
const userAuthorization = createReducer(initialState, (builder) => {
  builder.addCase(setGlobalAccessToken, (state, action) => {
    state.accessToken = action.payload;
  });
  builder.addCase(setGlobalUserProfile, (state, action) => {
    state.profile = action.payload;
  });
  builder.addCase(setUserTopItems, (state, action) => {
    state.userTopItems = action.payload;
  });
  builder.addCase(setUserTopTracks, (state, action) => {
    state.userTopTracks = action.payload;
  });
});

// User Authorizaton Screen

async function getProfile() {
  let accessToken = localStorage.getItem("access_token");

  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });

  const data = await response.json();
}

export default userAuthorization;
