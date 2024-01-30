import DeleteIcon from "@mui/icons-material/Delete";
import { Button, Grid, Pagination, Paper, Typography } from "@mui/material";
import axios from "axios";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Question() {
  const [allQuestions, setAllQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(10); // Adjust as needed
  const getParam = useParams();

  useEffect(() => {
    axios
      .get("http://localhost:8080/questions/getAllQuestions")
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

  // Get current questions
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = allQuestions
    .filter((question) => question.category_id == getParam.id)
    .slice(indexOfFirstQuestion, indexOfLastQuestion);

  // Change page
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };
  const handleDelete = (questionId) => {
    axios
      .delete(`http://localhost:8080/questions/deleteQuestion`, {
        data: { questionId: [questionId] },
      })
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
    <Grid container spacing={2} justifyContent="right">
      <Grid item xs={12}>
        <Paper
          className="QuestionsTable"
          style={{ padding: "15px", borderRadius: "10px" }}
        >
          <Typography variant="h5" color="primary" gutterBottom>
            Questions
          </Typography>
          <MDBTable responsive>
            <MDBTableHead>
              <tr style={{ color: "#041083" }}>
                <th scope="col" style={{ color: "#041083", width: "35%" }}>
                  Title
                </th>
                <th scope="col" style={{ color: "#041083" }}>
                  Input Type
                </th>
                <th scope="col" style={{ color: "#041083", width: "50%" }}>
                  Ans.
                </th>
                <th scope="col" style={{ color: "#041083", width: "5%" }}>
                  Action
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
                          fontSize: "14px",
                        }}
                      >
                        {question.title}
                      </Typography>
                    </td>
                    <td>
                      <Typography
                        variant="body1"
                        style={{
                          color: "#000000",
                          cursor: "pointer",
                          fontSize: "14px",
                          textTransform: "capitalize",
                        }}
                      >
                        {question.type.charAt(0).toUpperCase() +
                          question.type.slice(1)}
                      </Typography>
                    </td>
                    <td>
                      <Typography
                        variant="body1"
                        style={{
                          color: "#000000",
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                      >
                        {question.values.map((value) => value.value).join(", ")}
                      </Typography>
                    </td>
                    <td style={{ display: "flex", gap: "5px" }}>
                      <Button
                        onClick={() => handleDelete(question.id)}
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon />}
                        size="small"
                      ></Button>
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
          <Pagination
            count={Math.ceil(
              allQuestions.filter(
                (question) => question.category_id == getParam.id
              ).length / questionsPerPage
            )}
            page={currentPage}
            onChange={handleChangePage}
            color="primary"
            style={{ marginTop: "20px" }}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Question;
