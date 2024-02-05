import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { Button, Grid, Paper, Typography } from "@mui/material";
import axios from "axios";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Question() {
  const [allQuestions, setAllQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(10);

  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [orderedQuestions, setOrderedQuestions] = useState([]);

  const getParam = useParams();

  useEffect(() => {
    axios
      .get("http://3.143.231.155:3006/questions/getAllQuestions")
      .then((response) => {
        if (Array.isArray(response.data.result.questions)) {
          const allQuestions = response.data.result.questions;
          setAllQuestions(allQuestions);
          setFilteredQuestions(
            allQuestions.filter(
              (question) => question.category_id == getParam.id
            )
          );
          setOrderedQuestions(
            allQuestions.filter(
              (question) => question.category_id == getParam.id
            )
          );
        } else {
          console.error("Invalid response format from server.");
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  }, [getParam.id]);

  const currentQuestions = orderedQuestions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  const handleOrderUp = (index) => {
    if (index > 0) {
      setOrderedQuestions((prevOrderedQuestions) => {
        const updatedQuestions = [...prevOrderedQuestions];
        const temp = updatedQuestions[index];
        updatedQuestions[index] = updatedQuestions[index - 1];
        updatedQuestions[index - 1] = temp;
        return updatedQuestions;
      });
    }
  };

  const handleOrderDown = (index) => {
    if (index < orderedQuestions.length - 1) {
      setOrderedQuestions((prevOrderedQuestions) => {
        const updatedQuestions = [...prevOrderedQuestions];
        const temp = updatedQuestions[index];
        updatedQuestions[index] = updatedQuestions[index + 1];
        updatedQuestions[index + 1] = temp;
        return updatedQuestions;
      });
    }
  };

  const handleUpdateOrder = () => {
    const newQuestionsData = orderedQuestions.map((question, index) => ({
      ...question,
      order: index + 1,
    }));

    fetch("http://3.143.231.155:3006/questions/addQuestions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ questions: newQuestionsData }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("New questions added successfully", data);
      })
      .catch((error) => {
        console.error("Error adding new questions:", error.message);
        alert(
          "Error adding new questions. Please check server logs for details."
        );
      });
  };

  return (
    <Grid container spacing={2} justifyContent="right">
      <Grid item xs={12}>
        <Paper
          className="QuestionsTable"
          style={{ padding: "15px", borderRadius: "10px" }}
        >
          <Typography variant="h5" color="primary" gutterBottom>
            Questions
          </Typography>

          <MDBTable style={{}}>
            <MDBTableHead style={{ alignSelf: "center", width: "700px" }}>
              <tr style={{ color: "#041083" }}>
                <th scope="col" style={{ color: "#041083", width: "30%" }}>
                  Title
                </th>
                <th scope="col" style={{ color: "#041083", width: "30%" }}>
                  Input Type
                </th>
                <th scope="col" style={{ color: "#041083", width: "30%" }}>
                  Answer(s)
                </th>
                <th scope="col" style={{ color: "#041083", width: "30%" }}>
                  Actions
                </th>
                <th scope="col" style={{ color: "#041083", width: "5%" }}>
                  Change Order
                </th>
              </tr>
            </MDBTableHead>

            <MDBTableBody>
              {Array.isArray(currentQuestions) &&
              currentQuestions.length > 0 ? (
                currentQuestions.map((question, index) => (
                  <tr key={index}>
                    <td>
                      <Typography
                        variant="body1"
                        style={{
                          color: "#000000",
                          cursor: "pointer",
                          fontSize: "15px",
                          maxWidth: "12ch",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {`${
                          (currentPage - 1) * questionsPerPage + index + 1
                        }. ${question.title.slice(0, 15)}`}
                      </Typography>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td style={{ display: "flex" }}>
                      <Button onClick={() => handleOrderUp(index)}>
                        <ArrowUpward />
                      </Button>
                      <Button onClick={() => handleOrderDown(index)}>
                        <ArrowDownward />
                      </Button>
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
          <MDBTableBody>
            <tr>
              <td colSpan="5" style={{ textAlign: "right" }}>
                <Button
                  variant="contained"
                  color="warning" // Use the appropriate color for warning
                  onClick={handleUpdateOrder}
                >
                  Update Order
                </Button>
              </td>
            </tr>
          </MDBTableBody>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Question;
