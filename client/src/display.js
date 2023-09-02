import "./display.css";
import "./userplaylist.css";
import { useSelector, useDispatch } from "react-redux";
import addToPlaylist from "./actions/addtoplaylist";
import removeFromPlaylist from "./actions/removefromplaylist";
function Display(props) {
  const searchStore = useSelector((state) => state.search);
  const playlistInfo = useSelector((state) => state.playlist);
  const dispatch = useDispatch();

  // If searchStore.searchResult is populated, display songs, artists and tracks
  const SongDisplay = () => {
    if (searchStore.searchResult) {
      let result = [];
      searchStore.searchResult.tracks.items.map((item, index) => {
        if (index < 5) {
          let string = "";
          result.push(
            <div
              className="song-card"
              key={index}
              onClick={() => props.getTrackPreview(item.id)}
            >
              <div className="song-info">
                <img src={item.album.images[0].url}></img>
                <div className="song-card-info">
                  <h3>{item.name}</h3>
                  {item.artists.map((item, index) => {
                    if (index === 0) {
                      string += item.name;
                    } else {
                      string += ", " + item.name;
                    }
                  })}
                  <h5>{string}</h5>
                </div>
              </div>
              <h3
                className="song-card-add-song"
                onClick={() =>
                  dispatch(
                    addToPlaylist({
                      image: item.album.images[0].url,
                      name: item.name,
                      artist: string,
                      uri: item.uri,
                    })
                  )
                }
              >
                +
              </h3>
            </div>
          );
        }
      });
      return (
        <div className="song-display">
          {result.map((item, index) => {
            return item;
          })}
        </div>
      );
    }
  };

  const ArtistDisplay = () => {
    if (searchStore.searchResult) {
      let result = [];
      searchStore.searchResult.artists.items.map((item, index) => {
        if (index < 5) {
          if (item.images[0]) {
            result.push(
              <div
                className="artist-card"
                onClick={() => {
                  props.getArtist(item.id);
                }}
                key={index}
              >
                <img src={item.images[0].url}></img>
                <h4>{item.name}</h4>
              </div>
            );
          } else {
            result.push(
              <div className="artist-card" key={index}>
                <img src="https://i.pinimg.com/736x/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.jpg"></img>
                <h4>{item.name}</h4>
              </div>
            );
          }
        }
      });

      return (
        <div className="artist-display">
          {result.map((item, index) => {
            return item;
          })}
        </div>
      );
    }
  };
  const AlbumDisplay = () => {
    if (searchStore.searchResult) {
      let result = [];

      searchStore.searchResult.albums.items.map((item, index) => {
        let albumName = "";

        if (index < 5) {
          if (item.name.length > 20) {
            albumName = item.name.slice(0, 20);
            albumName += "...";
          } else {
            albumName = item.name;
          }
          result.push(
            <div className="album-card" key={index}>
              <img src={item.images[0].url}></img>
              <h4>{item.release_date.slice(0, 4) + " | " + albumName}</h4>
            </div>
          );
        }
      });

      return (
        <div className="album-display">
          {result.map((item, index) => {
            return item;
          })}
        </div>
      );
    }
  };

  const UserPlaylist = () => {
    return (
      <div className="userplaylist-song-container">
        {playlistInfo.playlistContent.map((item, index) => {
          return (
            <div className="userplaylist-song-card">
              <img src={item.image}></img>
              <h3 className="userplaylist-song-card-name">{item.name}</h3>
              <h3 className="userplaylist-song-card-artist">{item.artist}</h3>
              <h3
                className="userplaylist-remove-song"
                onClick={() => dispatch(removeFromPlaylist(item.name))}
              >
                -
              </h3>
            </div>
          );
        })}
      </div>
    );
  };
  const SearchDisplay = () => {
    if (playlistInfo.showPlaylist) {
      return (
        <div className="userplaylist-container">
          <h1>Playlist Name: </h1>
          <input type="text" id="playlist-name-input"></input>
          <h2>Your Songs: </h2>
          <UserPlaylist></UserPlaylist>
          <h1
            className="upload-playlist-button"
            onClick={() =>
              props.createPlaylist(
                document.querySelector("#playlist-name-input").value
              )
            }
          >
            Upload Playlist To Spotify
          </h1>
        </div>
      );
    }
    if (searchStore.artistPage && searchStore.artistTopSongs) {
      let result = [];
      let artistName = "";
      return (
        <div className="artist-page-display">
          <img src={searchStore.artistPage.images[0].url}></img>
          <div className="artist-page-info">
            <h1>{searchStore.artistPage.name}</h1>
            <h4>
              Followers:{" "}
              {searchStore.artistPage.followers.total.toLocaleString()}
            </h4>

            {/* Iterating through top song info */}
            <div className="artist-top-song-container">
              {searchStore.artistTopSongs.tracks.map((item, index) => {
                if (index < 8) {
                  item.artists.map((item, index) => {
                    if (index === 0) {
                      artistName = item.name;
                    } else {
                      artistName += ", " + item.name;
                    }

                    if (artistName.length > 20) {
                      artistName = artistName.slice(0, 20) + "...";
                    }
                  });
                  return (
                    <div
                      className="artist-top-song-card"
                      key={index}
                      onClick={() => props.getTrackPreview(item.id)}
                    >
                      <img src={item.album.images[0].url}></img>
                      <h4>{item.name}</h4>
                      <h5>{artistName}</h5>
                      <h3
                        onClick={() => {
                          dispatch(
                            addToPlaylist({
                              image: item.album.images[0].url,
                              name: item.name,
                              artist: artistName,
                              uri: item.uri,
                            })
                          );
                        }}
                      >
                        +
                      </h3>
                    </div>
                  );
                }
              })}
            </div>
            {/*----------------------------------*/}
          </div>
        </div>
      );
    }
    if (searchStore.searchResult) {
      return (
        <div className="search-display">
          <h2>Songs</h2>
          <SongDisplay></SongDisplay>
          <h2>Artists</h2>
          <ArtistDisplay></ArtistDisplay>
          <h2>Albums</h2>
          <AlbumDisplay></AlbumDisplay>
        </div>
      );
    }
  };
  return (
    <div className="display-body">
      <SearchDisplay></SearchDisplay>
    </div>
  );
}

export default Display;
