import "./header.css";
import { useSelector, useDispatch } from "react-redux";
import setGlobalSearchInput from "./actions/setglobalsearchinput";
import setArtist from "./actions/setartist";
import setArtistTopSongs from "./actions/setartisttopsongs";
import showPlaylist from "./actions/showplaylist";
function Header(props) {
  const searchStore = useSelector((state) => state.search);
  const dispatch = useDispatch();

  return (
    <div className="header">
      <h1 onClick={() => window.location.reload()}>HarmonyHub</h1>
      <div className="input">
        <input
          id="search-bar"
          type="text"
          onChange={(event) =>
            dispatch(
              setGlobalSearchInput(document.getElementById("search-bar").value)
            )
          }
          onClick={() => {
            dispatch(setArtist(null));
            dispatch(showPlaylist(false));
          }}
        ></input>
        <button onClick={() => props.search()}>Go</button>
      </div>
      <h1 onClick={() => props.runLogin()}>Log In</h1>
    </div>
  );
}

export default Header;
