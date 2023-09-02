import "./toolbar.css";
import { useSelector, useDispatch } from "react-redux";
import showPlaylist from "./actions/showplaylist";

function Toolbar(props) {
  const userInfo = useSelector((state) => state.userInfo);
  const dispatch = useDispatch();
  // Setting Toolbar Display predicated off if user has logged in yet
  const UserTopArtists = () => {
    if (userInfo.userTopItems) {
      let result = [];

      userInfo.userTopItems.items.map((item, index) => {
        if (index < 5) {
          result.push(
            <div
              className="top-artist-card"
              onClick={() => {
                props.getArtist(item.id);
                dispatch(showPlaylist(false));
              }}
              key={index}
            >
              <img src={item.images[0].url}></img>
              <h4>{item.name}</h4>
            </div>
          );
        }
      });

      return (
        <div className="top-artist-display">
          {result.map((item, index) => {
            return item;
          })}
        </div>
      );
    }
  };

  const UserTopTracks = () => {
    if (userInfo.userTopTracks) {
      let result = [];

      userInfo.userTopTracks.items.map((item, index) => {
        if (index < 5) {
          result.push(
            <div
              className="top-tracks-card"
              onClick={() => {
                dispatch(showPlaylist(false));
                props.getTrackPreview(item.id);
              }}
              key={index}
            >
              <img src={item.album.images[0].url}></img>
              <h4>{item.name}</h4>
            </div>
          );
        }
      });

      return (
        <div className="top-tracks-display">
          {result.map((item, index) => {
            return item;
          })}
        </div>
      );
    }
  };

  const Display = () => {
    // If we have user info display their information
    if (userInfo.profile) {
      return (
        <div className="userInfoDisplay">
          <img
            id="user-profile-picture"
            src={userInfo.profile.images[1].url}
          ></img>
          <h2>{userInfo.profile.display_name}</h2>
          <h2
            id="create-a-playlist-button"
            onClick={() => {
              dispatch(showPlaylist(true));
            }}
          >
            Create A Playlist
          </h2>
          <h3>Your Top Artists</h3>
          <UserTopArtists></UserTopArtists>
          <h3>Your Top Tracks</h3>
          <UserTopTracks></UserTopTracks>
        </div>
      );
    }
  };

  return (
    <div className="toolbar">
      <Display></Display>
    </div>
  );
}
export default Toolbar;
