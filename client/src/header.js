import "./header.css";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import setGlobalSearchInput from "./actions/setglobalsearchinput";
import setArtist from "./actions/setartist";
import setArtistTopSongs from "./actions/setartisttopsongs";
import showPlaylist from "./actions/showplaylist";

function Header(props) {
  const searchStore = useSelector((state) => state.search);
  const dispatch = useDispatch();
  let searchBarMobile = useRef();
  let searchBar = useRef();
  let searchOverlay = useRef();
  let navOverlayRef = useRef();
  if (window.innerWidth > 800) {
    return (
      <div className="header">
        <h1 onClick={() => window.location.reload()}>HarmonyHub</h1>
        <div className="input">
          <input
            id="search-bar"
            type="text"
            onChange={(event) =>
              dispatch(
                setGlobalSearchInput(
                  document.getElementById("search-bar").value
                )
              )
            }
            onClick={() => {
              dispatch(setArtist(null));
              dispatch(showPlaylist(false));
            }}
          ></input>
          <button
            onClick={() => {
              props.search();
            }}
          >
            Go
          </button>
        </div>
        <h1 onClick={() => props.runLogin()}>Log In</h1>
      </div>
    );
  } else {
    return (
      <div className="header-mobile">
        <h1
          id="menu"
          onClick={() => {
            navOverlayRef.current.style.width = "100vw";
          }}
        >
          Menu
        </h1>
        <div
          id="nav-overlay-mobile"
          className="nav-overlay"
          ref={navOverlayRef}
        >
          <div className="mobile-search">
            <h1
              id="search-overlay"
              ref={searchOverlay}
              onClick={() => {
                searchOverlay.current.style.transform =
                  "translate(-300px, 0px)";
                searchOverlay.current.style.width = "0%";
                searchBarMobile.current.style.transform = "translate(0)";
                searchBarMobile.current.style.width = "80%";
              }}
            >
              Search
            </h1>
            <div className="search-bar-container" ref={searchBarMobile}>
              <input
                id="search-bar-mobile"
                type="text"
                ref={searchBar}
                onChange={(event) => {
                  dispatch(setGlobalSearchInput(searchBar.current.value));
                }}
                onClick={() => {
                  dispatch(setArtist(null));
                  dispatch(showPlaylist(false));
                }}
              ></input>
              <button
                onClick={() => {
                  props.search();
                  navOverlayRef.current.style.width = "0vw";
                }}
              >
                Go
              </button>
            </div>
          </div>
          <h1 onClick={() => window.location.reload()}>Home</h1>
          <h1 onClick={() => props.runLogin()}>Login</h1>
          <h1
            onClick={() => {
              document.getElementById("nav-overlay-mobile").style.width = "0vw";
            }}
          >
            Exit
          </h1>
        </div>
      </div>
    );
  }
}

export default Header;
