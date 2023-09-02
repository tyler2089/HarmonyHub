import "./audiotrackplayer.css";
import lottieWeb from "https://cdn.skypack.dev/lottie-web";
import Play from "./play-button.png";
import Pause from "./pause.png";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import toggleAudio from "./actions/toggleaudio";
function AudioTrackPlayer(props) {
  // Variable Declaration
  const audio = useSelector((state) => state.audio);
  const dispatch = useDispatch();
  const [trackCurrentTime, setTrackCurrentTime] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  // Set Variable Initialization
  if (audio.audioElement) {
    audio.audioElement.addEventListener("volumechange", (event) => {
      setVolume(audio.audioElement.volume);
    });
    audio.audioElement.addEventListener("loadeddata", (event) => {
      setTrackCurrentTime(Math.floor(audio.audioElement.currentTime));
      setTrackDuration(Math.floor(audio.audioElement.duration));
      audio.audioElement.volume = volume;
    });
    audio.audioElement.addEventListener("timeupdate", (event) => {
      setTrackCurrentTime(Math.floor(audio.audioElement.currentTime));
      setTrackDuration(Math.floor(audio.audioElement.duration));
    });
  }

  // Play Button Conditions
  const PlayButton = () => {
    if (audio.audioIsPlaying) {
      return <img onClick={() => dispatch(toggleAudio())} src={Pause}></img>;
    } else {
      return <img onClick={() => dispatch(toggleAudio())} src={Play}></img>;
    }
  };

  // Track's Current Time Formatting
  const CurrentTime = () => {
    if (trackCurrentTime <= 9) {
      return <h6>0:0{trackCurrentTime}</h6>;
    } else {
      return <h6>0:{trackCurrentTime}</h6>;
    }
  };

  // Main Display
  const AudioInfo = () => {
    if (audio.audioInfo) {
      return (
        <div className="audio-card">
          <div className="audio-card-left">
            <img src={audio.audioInfo.album.images[0].url}></img>
            <div className="audio-card-left-info">
              <h3>{audio.audioInfo.name}</h3>
              <h4>{audio.audioInfo.artists[0].name}</h4>
            </div>
          </div>
          <div className="player">
            <PlayButton></PlayButton>
            <div className="seeker-info">
              <CurrentTime></CurrentTime>
              <input
                type="range"
                min="0"
                max={Math.floor(audio.audioElement.duration)}
                defaultValue={trackCurrentTime}
                onChange={() => {
                  if (document.getElementById("track-seeker")) {
                    audio.audioElement.currentTime =
                      document.getElementById("track-seeker").value;
                  }
                }}
                id="track-seeker"
              ></input>
              <h6>0:{trackDuration}</h6>
            </div>
          </div>
          <div className="volume">
            <h4>Volume</h4>
            <input
              id="volume-seeker"
              type="range"
              min="0"
              max="1"
              step="0.05"
              defaultValue={volume}
              onChange={() => {
                if (document.getElementById("volume-seeker")) {
                  if (audio.audioElement) {
                    audio.audioElement.volume =
                      document.getElementById("volume-seeker").value;
                  }
                }
              }}
            ></input>
          </div>
        </div>
      );
    }
  };
  return (
    <div className="audio-player">
      <AudioInfo></AudioInfo>
    </div>
  );
}

export default AudioTrackPlayer;
