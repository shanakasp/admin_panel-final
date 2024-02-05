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
  const [questionsPerPage] = useState(10);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [loadingMap, setLoadingMap] = useState({});
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [questionIdToDelete, setQuestionIdToDelete] = useState(null);
  const getParam = useParams();

  useEffect(() => {
    axios
      .get("http://3.143.231.155:3006/questions/getAllQuestions")
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

  const currentQuestions = allQuestions
    .filter((question) => question.category_id == getParam.id)
    .slice(
      (currentPage - 1) * questionsPerPage,
      currentPage * questionsPerPage
    );

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
    setConfirmDelete(true);
    setQuestionIdToDelete(questionId);
  };

  const handleDeleteConfirmed = () => {
    setLoadingMap((prevLoadingMap) => ({
      ...prevLoadingMap,
      [questionIdToDelete]: true,
    }));

    axios
      .delete(`http://3.143.231.155:3006/questions/deleteQuestion`, {
        data: { questionId: [questionIdToDelete] },
      })
      .then((response) => {
        console.log("Deleted successfully:", response.data);

        setTimeout(() => {
          const updatedQuestions = allQuestions.filter(
            (question) => question.id !== questionIdToDelete
          );
          setAllQuestions(updatedQuestions);

          if (selectedQuestion && selectedQuestion.id === questionIdToDelete) {
            setSelectedQuestion(null);
          }

          setNotification({
            open: true,
            message: "Deleted successfully",
            severity: "success",
          });

          setLoadingMap((prevLoadingMap) => ({
            ...prevLoadingMap,
            [questionIdToDelete]: false,
          }));
        }, 500);
      })
      .catch((error) => {
        console.error("Error deleting:", error);

        setNotification({
          open: true,
          message: "Error deleting",
          severity: "error",
        });

        setLoadingMap((prevLoadingMap) => ({
          ...prevLoadingMap,
          [questionIdToDelete]: false,
        }));
      });

    setConfirmDelete(false);
    setQuestionIdToDelete(null);
  };

  const handleDeleteCanceled = () => {
    setConfirmDelete(false);
    setQuestionIdToDelete(null);
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
                  Answer(s)
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
                          maxWidth: "10ch",
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
                          maxWidth: "10ch",
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
                        disabled={loadingMap[question.id]}
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
              variant="contained"
              color="primary"
              style={{
                borderRadius: "5px",
                marginLeft: "5px",
                fontSize: "12px",
              }}
            >
              Close
            </Button>
          </CardActions>
        </Card>
      </Modal>

      {/* Confirmation Dialog */}
      <Modal
        open={confirmDelete}
        onClose={handleDeleteCanceled}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card style={{ minWidth: 300, maxWidth: 600 }}>
          <CardContent>
            <Typography variant="h6" style={{ color: "#041083" }}>
              Are you sure you want to delete this question?
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              onClick={handleDeleteConfirmed}
              variant="contained"
              color="primary"
              style={{
                backgroundColor: "#FF616D",
                color: "#fff",
                borderRadius: "5px",
                marginLeft: "5px",
                fontSize: "12px",
              }}
            >
              Delete
            </Button>
            <Button
              onClick={handleDeleteCanceled}
              variant="contained"
              color="primary"
              style={{
                borderRadius: "5px",
                marginLeft: "5px",
                fontSize: "12px",
              }}
            >
              Cancel
            </Button>
          </CardActions>
        </Card>
      </Modal>
    </Grid>
  );
}

export default Question;
