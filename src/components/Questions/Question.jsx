import axios from "axios";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";

function Question() {
  const [allQuestions, setAllQuestions] = useState([]);

  useEffect(() => {
    axios
      .get(
        "http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:8000/questions/getAllQuestions"
      )
      .then((response) => {
        if (Array.isArray(response.data.result.questions)) {
          setAllQuestions(response.data.result.questions);
        } else {
          console.error("Invalid response format from server.");
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  }, []);

  const handleEdit = (questionId) => {
    console.log(`Edit button clicked for question with ID ${questionId}`);
  };

  const handleDelete = (questionId) => {
    // Perform the deletion through an API call
    axios
      .delete(
        `http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:8000/questions/deleteQuestion`,
        {
          data: { questionId: [questionId] },
        }
      )
      .then((response) => {
        console.log("Deleted successfully:", response.data);

        // Remove the deleted question from the state
        const updatedQuestions = allQuestions.filter(
          (question) => question.id !== questionId
        );
        setAllQuestions(updatedQuestions);
      })
      .catch((error) => {
        console.error("Error deleting:", error);
      });
  };

  // Modify the rendering logic for the Type column
  const renderTypeColumn = (question) => {
    if (
      question.type === "dropdown" &&
      Array.isArray(question.values) &&
      question.values.length > 0
    ) {
      const valuesString = question.values
        .map((value) => value.value)
        .join(", ");
      return `${question.type}: ${valuesString}`;
    } else {
      return question.type;
    }
  };

  return (
    <div
      className="QuestionsTable"
      style={{
        width: "100%",
        background: "#fff",
        overflowY: "scroll",
        height: "600px",
        padding: "25px",
        borderRadius: "10px",
        margin: "-15px 10px",
      }}
    >
      <MDBTable
        align="middle"
        style={{
          overflowY: "auto",
          height: "40px",
          tableLayout: "fixed",
          marginRight: "10px",
        }}
      >
        <MDBTableHead>
          <tr style={{ color: "#646a85" }}>
            <th
              scope="col"
              style={{ color: "blueviolet", width: "50%", fontSize: "25px" }}
            >
              Title
            </th>
            <th
              scope="col"
              style={{ color: "blueviolet", width: "35%", fontSize: "20px" }}
            >
              Input Type
            </th>
            <th
              scope="col"
              style={{ color: "blueviolet", width: "30%", fontSize: "20px" }}
            >
              Category ID
            </th>
            <th
              scope="col"
              style={{ color: "blueviolet", width: "30%", fontSize: "20px" }}
            >
              Action
            </th>
          </tr>
        </MDBTableHead>

        <MDBTableBody>
          {Array.isArray(allQuestions) && allQuestions.length > 0 ? (
            allQuestions.map((question, index) => (
              <tr key={index}>
                <td>
                  <p
                    className="fw-bold mb-1"
                    style={{ color: "#041083", cursor: "pointer" }}
                  >
                    {question.title}
                  </p>
                </td>
                <td>
                  <p
                    className="fw-bold mb-1"
                    style={{ color: "#041083", cursor: "pointer" }}
                  >
                    {renderTypeColumn(question)}
                  </p>
                </td>
                <td>
                  <p
                    className="fw-bold mb-1"
                    style={{ color: "#041083", cursor: "pointer" }}
                  >
                    {question.category_id}
                  </p>
                </td>
                <td>
                  <button
                    onClick={() => handleEdit(question.id)}
                    className="btn btn-primary rounded-pill"
                    style={{ marginRight: "10px" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(question.id)}
                    className="btn btn-danger rounded-pill"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No questions found.</td>
            </tr>
          )}
        </MDBTableBody>
      </MDBTable>
    </div>
  );
}

export default Question;
