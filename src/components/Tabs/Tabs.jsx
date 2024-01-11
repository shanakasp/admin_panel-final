import { Paper, Tab, Tabs } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Tabs.css";

const Centeredtabs = (props) => {
  const navigate = useNavigate();
  return (
    <Paper className="root">
      <Tabs
        className="tabs"
        label="Questions"
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab
          className="tab"
          label="Questions"
          style={{ fontSize: "20px" }} // Adjust the font size as needed
          onClick={() => {
            navigate(`/form/${props.paramId}`);
          }}
        />
        <Tab
          className="tab"
          label="Preview"
          style={{ fontSize: "20px" }} // Adjust the font size as needed
          onClick={() => {
            navigate(`/preview/${props.paramId}`);
          }}
        />
      </Tabs>
    </Paper>
  );
};

export default Centeredtabs;
