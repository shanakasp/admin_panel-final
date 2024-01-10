import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CommonQuestion from "./Pages/CommonQuestion";
import Components from "./Pages/Components";
import Homepage from "./Pages/Homepage";
import Login from "./Pages/Login";
import Form from "./components/Form/Form";
import FormPreview from "./components/FormPreview/FormPreview";
// import Template from './components/Template/Template'
import "bootstrap/dist/css/bootstrap.min.css";
import AddCategory from "./components/AddCategory/AddCategory";
import Profile from "./components/Profile/Profile";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Homepage />} />
          <Route path="/form/:id" element={<Form />} />
          <Route path="/common-question" element={<CommonQuestion />} />
          <Route path="/preview/:id" element={<FormPreview />} />
          <Route path="/dashboard" element={<Components />} />
          <Route path="/" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/addcategory" element={<AddCategory />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
