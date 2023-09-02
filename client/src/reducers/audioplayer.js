import { createReducer } from "@reduxjs/toolkit";
import setAudioFile from "../actions/setaudiofile";
import toggleAudio from "../actions/toggleaudio";
const initialState = {
  audioInfo: null,
  audioElement: null,
  audioIsPlaying: false,
};
const audioPlayer = createReducer(initialState, (builder) => {
  builder.addCase(setAudioFile, (state, action) => {
    if (state.audioInfo && state.audioInfo !== action.payload) {
      state.audioElement.pause();
      state.audioIsPlaying = false;
    }
    state.audioInfo = action.payload;
    state.audioElement = new Audio(action.payload.preview_url);
  });

  builder.addCase(toggleAudio, (state, action) => {
    if (state.audioElement) {
      if (state.audioIsPlaying === false) {
        state.audioElement.play();
        state.audioIsPlaying = true;
      } else {
        state.audioElement.pause();
        state.audioIsPlaying = false;
      }
    }
  });
});

export default audioPlayer;
