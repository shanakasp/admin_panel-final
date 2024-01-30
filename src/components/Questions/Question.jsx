import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  Modal,
  Pagination,
  Paper,
  Typography,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import axios from "axios";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
function Question() {
  const [allQuestions, setAllQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(10); // Adjust as needed
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [loadingMap, setLoadingMap] = useState({}); // Map to store loading state for each question
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
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

  const handleSeeDetails = (question) => {
    setSelectedQuestion(question);
  };

  const handleCloseDetails = () => {
    setSelectedQuestion(null);
  };

  const handleDelete = (questionId) => {
    // Set loading state for the specific question to true
    setLoadingMap((prevLoadingMap) => ({
      ...prevLoadingMap,
      [questionId]: true,
    }));

    axios
      .delete(`http://localhost:8080/questions/deleteQuestion`, {
        data: { questionId: [questionId] },
      })
      .then((response) => {
        console.log("Deleted successfully:", response.data);

        setTimeout(() => {
          const updatedQuestions = allQuestions.filter(
            (question) => question.id !== questionId
          );
          setAllQuestions(updatedQuestions);

          if (selectedQuestion && selectedQuestion.id === questionId) {
            setSelectedQuestion(null);
          }

          // Show success notification
          setNotification({
            open: true,
            message: "Deleted successfully",
            severity: "success",
          });

          // Reset loading state for the specific question
          setLoadingMap((prevLoadingMap) => ({
            ...prevLoadingMap,
            [questionId]: false,
          }));
        }, 2000);
      })
      .catch((error) => {
        console.error("Error deleting:", error);

        // Show error notification
        setNotification({
          open: true,
          message: "Error deleting",
          severity: "error",
        });

        // Reset loading state for the specific question
        setLoadingMap((prevLoadingMap) => ({
          ...prevLoadingMap,
          [questionId]: false,
        }));
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
          <div className="notification">
            <Snackbar
              open={notification.open}
              autoHideDuration={3000}
              onClose={() => setNotification({ ...notification, open: false })}
            >
              <MuiAlert
                elevation={6}
                variant="filled"
                onClose={() =>
                  setNotification({ ...notification, open: false })
                }
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                severity={notification.severity}
              >
                {notification.message}
              </MuiAlert>
            </Snackbar>
          </div>
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
                    <td>
                      <Typography
                        variant="body1"
                        style={{
                          color: "#000000",
                          cursor: "pointer",
                          fontSize: "15px",
                          textTransform: "capitalize",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "10ch", // Set your character limit here
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
                          fontSize: "15px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "10ch", // Set your character limit here
                        }}
                      >
                        {question.values.map((value) => value.value).join(", ")}
                      </Typography>
                    </td>
                    <td style={{ display: "flex", gap: "5px" }}>
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleSeeDetails(question)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(question.id)}
                        disabled={loadingMap[question.id]} // Disable the button when loading
                      >
                        {loadingMap[question.id] ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <DeleteIcon />
                        )}
                      </IconButton>
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

      {/* Details Modal */}
      <Modal
        open={!!selectedQuestion}
        onClose={handleCloseDetails}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card style={{ minWidth: 300, maxWidth: 600 }}>
          <CardContent>
            <Typography variant="h6" style={{ color: "#041083" }}>
              Question:
            </Typography>
            {selectedQuestion?.title}
            <Typography
              variant="h6"
              style={{ color: "#041083", marginTop: 10 }}
            >
              Input Type:
            </Typography>
            <span style={{ marginLeft: 0 }}>
              {selectedQuestion?.type.charAt(0).toUpperCase() +
                selectedQuestion?.type.slice(1)}
            </span>
            <Typography
              variant="h6"
              style={{ color: "#041083", marginTop: 10 }}
            >
              Answer(s):
            </Typography>
            <span>
              {selectedQuestion?.values.map((value) => value.value).join(", ")}
            </span>
          </CardContent>
          <CardActions>
            <Button
              onClick={handleCloseDetails}
              color="primary"
              style={{
                backgroundColor: "#1367F9",
                color: "#fff",
                borderRadius: "5px",
                marginLeft: "5px",
                fontSize: "12px", // Adjust the font size as needed
              }}
            >
              Close
            </Button>
          </CardActions>
        </Card>
      </Modal>
    </Grid>
  );
}

export default Question;
