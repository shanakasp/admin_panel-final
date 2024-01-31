import { Paper, Tab, Tabs } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Tabs.css";

const Centeredtabs = (props) => {
  const navigate = useNavigate();
  return (
    <Paper className="root" elevation={3} square>
      <Tabs className="tabs" label="Questions" textColor="primary" centered>
        <Tab
          className="tab"
          label="Questions"
          style={{
            fontSize: "15px",
            borderRadius: "5px",
            marginRight: "40px",
            boxShadow: "0 2px 5px ", // Add box shadow
          }}
          onClick={() => {
            navigate(`/form/${props.paramId}`);
          }}
        />
        <Tab
          className="tab"
          label="Preview"
          style={{
            fontSize: "15px",
            borderRadius: "5px",
            boxShadow: "0 2px 5px ", // Add box shadow
          }}
          onClick={() => {
            navigate(`/preview/${props.paramId}`);
          }}
        />
      </Tabs>
    </Paper>
  );
};

export default Centeredtabs;
