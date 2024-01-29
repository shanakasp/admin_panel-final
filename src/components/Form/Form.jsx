import { IconButton } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";
import { GrRedo, GrUndo } from "react-icons/gr";
import { useNavigate, useParams } from "react-router-dom";
import QuestionForm from "../QuestionForm/QuestionForm";
import Sidebar from "../Sidebar/Sidebar";
import Centeredtabs from "../Tabs/Tabs";
import "./Form.css";

const Form = () => {
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
        </div>
        <div className="form_header_right">
          {/* <IconButton>
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
          transition={{ duration: 0.6 }}
          className="form_bottom"
        >
          <QuestionForm paramId={params.id} />
        </motion.div>
      </div>
    </>
  );
};

export default Form;
