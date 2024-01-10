import AppsIcon from "@mui/icons-material/Apps";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton } from "@mui/material";
import React, { useRef } from "react";
import Sidebar from "../Sidebar/Sidebar";
import "./Header.css";
const Header = (props) => {
  const inputRef = useRef("");

  const passValue = () => {
    props.setSearch(inputRef.current.value);
  };

  return (
    <div className="header">
      <div className="header_info">
        <Sidebar />

        <div className="info">
          <img
            src=".././images/medical.png"
            alt=""
            className="header_logo"
            width={"150px"}
          />
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div className="header_search">
          <IconButton>
            <SearchIcon />
          </IconButton>
          <input
            type="text"
            placeholder="Search"
            ref={inputRef}
            onChange={() => passValue()}
          />
        </div>
        <div className="header_right">
          <IconButton>
            <AppsIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default Header;
