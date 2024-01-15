import { IconButton } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";
import { GrRedo, GrUndo } from "react-icons/gr";
import { useNavigate, useParams } from "react-router-dom";
import Question from "../Questions/Question";
import Sidebar from "../Sidebar/Sidebar";
import Centeredtabs from "../Tabs/Tabs";
import "./FormPreview.css";
const FormPreview = () => {
  const params = useParams();
  const navigate = useNavigate();

  return (
    <>
      <div className="form_header">
        <div className="form_header_left">
          <Sidebar />
          <img
            src=".././images/body.jpg"
            alt=""
            className="form_header_image"
          />

          {/* <input type="text" placeholder="Untitled Form" className="form_name" /> */}
          {/* <IconButton>
            <IoMdFolderOpen className="form_header_icon" style={{fontSize:'25px'}}/>
            </IconButton>
            <IconButton>
            <FiStar className="form_header_icon"/>
            </IconButton> */}
        </div>
        <div className="form_header_right">
          {/* <IconButton>
                <ColorLensIcon size="small" className="form_header_icon"/>
            </IconButton> */}
          {/* <IconButton 
            onClick={()=>{navigate('/preview')}}
            >
                <AiOutlineEye className="form_header_icon"/>
            </IconButton>
            <IconButton>
                <FiSettings className="form_header_icon"/>
            </IconButton> */}
          <IconButton onClick={() => navigate(-1)}>
            <GrUndo className="form_header_icon" />
          </IconButton>

          <IconButton onClick={() => navigate(+1)}>
            <GrRedo className="form_header_icon" />
          </IconButton>

          <IconButton></IconButton>
        </div>
      </div>
      <div>
        <Centeredtabs paramId={params.id} />
        <motion.div
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="form_bottom"
        >
          <Question paramId={params.id} />
        </motion.div>
      </div>
    </>
  );
};

export default FormPreview;
