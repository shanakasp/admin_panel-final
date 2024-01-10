import React from 'react'
import './Tabs.css'
import { Paper, Tab, Tabs } from '@mui/material';
import { useNavigate } from 'react-router-dom';

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
        <Tab className="tab" label="Questions" onClick={()=>{navigate(`/form/${props.paramId}`)}}/>
        <Tab className="tab" label="Preview" onClick={()=>{navigate(`/preview/${props.paramId}`)}}/>
      
        </Tabs>
    </Paper>
  )
}

export default Centeredtabs