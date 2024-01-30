import { motion } from "framer-motion";
import React from "react";
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
            src=".././images/medical.png"
            alt=""
            className="header_logo"
            width={"150px"}
          />

          {/* <input type="text" placeholder="Untitled Form" className="form_name" /> */}
        </div>
        <div className="form_header_right"></div>
      </div>
      <div>
        <Centeredtabs paramId={params.id} />
        <motion.div
          animate={{ opacity: 3 }}
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
