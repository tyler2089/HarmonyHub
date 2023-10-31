import "./App.css";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import setGlobalAccessToken from "./actions/setglobalaccesstoken";
import setGlobalUserProfile from "./actions/setuserprofile";
import setGlobalSearchResult from "./actions/setglobalsearchresult";
import setUserTopItems from "./actions/setusertopitems";
import setUserTopTracks from "./actions/setusertoptracks";
import setArtist from "./actions/setartist";
import setArtistTopSongs from "./actions/setartisttopsongs";
import setAudioFile from "./actions/setaudiofile";
import Header from "./header";
import Toolbar from "./toolbar";
import Display from "./display";
import AudioTrackPlayer from "./audiotrackplayer";
function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [playlistID, setPlaylistID] = useState(null);
  const [reload, setReload] = useState(0);
  const userStatus = useSelector((state) => state.userInfo);
  const searchStore = useSelector((state) => state.search);
  const playlistInfo = useSelector((state) => state.playlist);
  const audio = useSelector((state) => state.audio);
  const dispatch = useDispatch();
  // Get User Authorization
  // Redirects User to Spotify to Grant Authorization
  function generateRandomString(length) {
    let text = "";
    let possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  async function generateCodeChallenge(codeVerifier) {
    function base64encode(string) {
      return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest("SHA-256", data);

    return base64encode(digest);
  }

  let codeVerifier = generateRandomString(128);

  // Call this LogIn() function to redirect to spotify
  function logIn() {
    generateCodeChallenge(codeVerifier).then((codeChallenge) => {
      let state = generateRandomString(16);
      let scope =
        "user-read-private user-read-email user-top-read playlist-modify-public playlist-modify-private";
      const clientId = "6cd40c683f49475bb57d07ca668d4659";
      const redirectUri = "https://tyler2089.github.io/HarmonyHub/";

      localStorage.setItem("code_verifier", codeVerifier);

      let args = new URLSearchParams({
        response_type: "code",
        client_id: clientId,
        scope: scope,
        redirect_uri: redirectUri,
        state: state,
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
      });

      window.location = "https://accounts.spotify.com/authorize?" + args;
    });
  }

  // Get AccessToken if Authorization Granted and Not already Retrieved
  useEffect(() => {
    // Fetch Access Token if Authorization is Granted
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get("code");
    if (code !== null && accessToken === null) {
      const clientId = "6cd40c683f49475bb57d07ca668d4659";
      const redirectUri = "https://tyler2089.github.io/HarmonyHub/";
      const urlParams = new URLSearchParams(window.location.search);
      code = urlParams.get("code");
      let _codeVerifier = localStorage.getItem("code_verifier");

      let body = new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier: _codeVerifier,
      });

      const response = fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("HTTP status " + response.status);
          }
          return response.json();
        })
        .then((data) => {
          setAccessToken(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, []);

  // Once Access Token Renders, save globaly
  useEffect(() => {
    if (accessToken) {
      dispatch(setGlobalAccessToken(accessToken.access_token));
      fetchProfile(accessToken.access_token);
    }
  }, [accessToken]);

  async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((result) => result.json())
      .then((data) => dispatch(setGlobalUserProfile(data)));

    const result2 = await fetch(
      "https://api.spotify.com/v1/me/top/artists?time_range=short_term",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((result) => result.json())
      .then((data) => dispatch(setUserTopItems(data)));

    const result3 = await fetch(
      "https://api.spotify.com/v1/me/top/tracks?time_range=short_term",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((result) => result.json())
      .then((data) => dispatch(setUserTopTracks(data)));
  }

  // Search Function
  async function search() {
    if (
      accessToken &&
      searchStore.userSearch !== "" &&
      searchStore.userSearch !== null
    ) {
      const result = await fetch(
        "https://api.spotify.com/v1/search?q=" +
          searchStore.userSearch +
          "&type=album,artist,track",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken.access_token}` },
        }
      )
        .then((result) => result.json())
        .then((data) => setSearchResult(data));
    }
  }

  useEffect(() => {
    if (searchResult) {
      dispatch(setGlobalSearchResult(searchResult));
    }
  }, [searchResult]);

  // Get Artist
  async function getArtist(artistID) {
    const result = await fetch(
      "https://api.spotify.com/v1/artists/" + artistID,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${userStatus.accessToken}` },
      }
    )
      .then((response) => response.json())
      .then((data) => dispatch(setArtist(data)));
    const resultAgain = await fetch(
      "https://api.spotify.com/v1/artists/" +
        artistID +
        "/top-tracks?market=US",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${userStatus.accessToken}` },
      }
    )
      .then((response) => response.json())
      .then((data) => dispatch(setArtistTopSongs(data)));
  }

  // Upload User Playlist

  // Create Playlist

  async function createPlaylist(playlistName = "Default Playlist") {
    let body = {
      name: playlistName,
      description: "Created On HarmonyHub",
      public: true,
    };

    const result = await fetch(
      `https://api.spotify.com/v1/users/${userStatus.profile.id}/playlists`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userStatus.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    )
      .then((response) => response.json())
      .then((data) => setPlaylistID(data.id));
  }

  // Add songs to created playlist

  useEffect(() => {
    if (playlistID) {
      let uris = [];
      playlistInfo.playlistContent.map((item, index) => {
        uris.push(item.uri);
      });
      let body = {
        uris: uris,
        position: 0,
      };
      const response = fetch(
        `https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userStatus.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      )
        .then((response) => response.json())
        .then((data) => setPlaylistID(null));
    }
  }, [playlistID]);

  // Get Track Preview

  async function getTrackPreview(trackID) {
    const response = await fetch(
      `https://api.spotify.com/v1/tracks/${trackID}?market=US`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userStatus.accessToken}`,
        },
      }
    )
      .then((result) => result.json())
      .then((data) => dispatch(setAudioFile(data)));

    setReload(reload + 1);
  }
  return (
    <div className="app">
      <Header runLogin={logIn} search={search}></Header>
      <div className="body">
        <Toolbar
          getArtist={getArtist}
          getTrackPreview={getTrackPreview}
        ></Toolbar>
        <Display
          getArtist={getArtist}
          createPlaylist={createPlaylist}
          getTrackPreview={getTrackPreview}
        ></Display>
      </div>
      <AudioTrackPlayer reload={reload}></AudioTrackPlayer>
    </div>
  );
}

export default App;
