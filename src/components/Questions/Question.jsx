import axios from "axios";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Question() {
  const [allQuestions, setAllQuestions] = useState([]);
  const getParam = useParams();

  useEffect(() => {
    axios
      .get(
        "http://ec2-3-144-111-86.us-east-2.compute.amazonaws.com:8080/questions/getAllQuestions"
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
    axios
      .delete(
        `http://ec2-3-144-111-86.us-east-2.compute.amazonaws.com:8080/questions/deleteQuestion`,
        {
          data: { questionId: [questionId] },
        }
      )
      .then((response) => {
        console.log("Deleted successfully:", response.data);

        const updatedQuestions = allQuestions.filter(
          (question) => question.id !== questionId
        );
        setAllQuestions(updatedQuestions);
      })
      .catch((error) => {
        console.error("Error deleting:", error);
      });
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
              style={{ color: "blueviolet", width: "50%", fontSize: "20px" }}
            >
              Title
            </th>
            <th
              scope="col"
              style={{ color: "blueviolet", width: "45%", fontSize: "20px" }}
            >
              Input Type
            </th>
            <th
              scope="col"
              style={{ color: "blueviolet", width: "36%", fontSize: "20px" }}
            >
              Ans.
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
            allQuestions
              .filter((question) => question.category_id == getParam.id)
              .map((question, index) => (
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
                      {question.type}
                    </p>
                  </td>
                  <td>
                    <p
                      className="fw-bold mb-1"
                      style={{ color: "#041083", cursor: "pointer" }}
                    >
                      {question.values.map((value) => value.value).join(", ")}
                    </p>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(question.id)}
                      className="btn btn-danger rounded-pill bg-danger"
                      style={{
                        fontSize: "14px",
                        width: "60px",
                        padding: "2px",
                      }}
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
