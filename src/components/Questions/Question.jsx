import {
  ArrowDownward,
  ArrowUpward,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
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
  Snackbar,
  Typography,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
function QuestionForm() {
  const [allQuestions, setAllQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
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
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [orderedQuestions, setOrderedQuestions] = useState([]);
  const [questionsPerPage, setQuestionsPerPage] = useState(10);
  const [updateOrderMode, setUpdateOrderMode] = useState(true); // State to track the mode of the button
  const [showChangeOrderColumn, setShowChangeOrderColumn] = useState(false);

  const handleButtonClick = () => {
    if (!updateOrderMode) {
      handleDone();
    } else {
      handleUpdateOrder();
    }
    // Toggle the mode after each click
    setUpdateOrderMode(!updateOrderMode);
  };
  const handleDone = () => {
    setQuestionsPerPage(10);
    setShowChangeOrderColumn(false); // Hide the Change Order column
    console.log("Handle Done");
  };

  const handleUpdateOrder = () => {
    // Your existing logic for handling update order goes here
    console.log("Handle Update Order");
    setShowChangeOrderColumn(true);
    setCurrentPage(1);
    // Change questionsPerPage to 1000
    setQuestionsPerPage(100000);
  };

  useEffect(() => {
    axios
      .get("http://localhost:8080/questions/getAllQuestions")
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

          // Log IDs and orders of the questions
          console.log("Questions IDs with their order:");
          allQuestions.forEach((question) => {
            console.log(`ID: ${question.id}, Order: ${question.order}`);
          });
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
        const movedQuestion = updatedQuestions[index];
        const temp = updatedQuestions[index];
        updatedQuestions[index] = updatedQuestions[index - 1];
        updatedQuestions[index - 1] = temp;

        // Swap order values dynamically
        const tempOrder = movedQuestion.order;
        movedQuestion.order = updatedQuestions[index].order;
        updatedQuestions[index].order = tempOrder;

        // Update order numbers for preceding questions
        for (let i = index - 1; i >= 0; i--) {
          updatedQuestions[i].order = updatedQuestions[i + 1].order - 1;
        }

        // Log and send updated order values
        updatedQuestions.forEach(({ id, order }) => {
          console.log(`Question ID: ${id}, New order: ${order}`);
          axios
            .put("http://localhost:8080/questions/updateQuestion", {
              questionId: id,
              order: order,
            })
            .then((response) => {
              console.log("Order updated successfully", response.data);
            })
            .catch((error) => {
              console.error("Error updating order:", error);
            });
        });

        return updatedQuestions;
      });
    }
  };

  const handleOrderDown = (index) => {
    if (index < orderedQuestions.length - 1) {
      setOrderedQuestions((prevOrderedQuestions) => {
        const updatedQuestions = [...prevOrderedQuestions];
        const movedQuestion = updatedQuestions[index];
        const temp = updatedQuestions[index];
        updatedQuestions[index] = updatedQuestions[index + 1];
        updatedQuestions[index + 1] = temp;

        // Swap order values dynamically
        const tempOrder = movedQuestion.order;
        movedQuestion.order = updatedQuestions[index].order;
        updatedQuestions[index].order = tempOrder;

        // Update order numbers for subsequent questions
        for (let i = index + 1; i < updatedQuestions.length; i++) {
          updatedQuestions[i].order = updatedQuestions[i - 1].order + 1;
        }

        // Log and send updated order values
        updatedQuestions.forEach(({ id, order }) => {
          console.log(`Question ID: ${id}, New order: ${order}`);
          axios
            .put("http://localhost:8080/questions/updateQuestion", {
              questionId: id,
              order: order,
            })
            .then((response) => {
              console.log("Order updated successfully", response.data);
            })
            .catch((error) => {
              console.error("Error updating order:", error);
            });
        });

        return updatedQuestions;
      });
    }
  };

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
      .delete(`http://localhost:8080/questions/deleteQuestion`, {
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
    <>
      {/* Existing code for QuestionForm component */}

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
                onClose={() =>
                  setNotification({ ...notification, open: false })
                }
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
            <MDBTable style={{ width: "100%" }}>
              <MDBTableHead style={{ alignSelf: "center" }}>
                <tr style={{ color: "#041083" }}>
                  <th scope="col" style={{ width: "30%" }}>
                    Title
                  </th>
                  <th scope="col" style={{ width: "30%" }}>
                    Input Type
                  </th>
                  <th scope="col" style={{ width: "40%" }}>
                    Answer(s)
                  </th>
                  <th
                    scope="col"
                    style={{
                      marginLeft: "15px",
                      display: showChangeOrderColumn ? "none" : "table-cell",
                    }}
                  >
                    Actions
                  </th>
                  <th
                    scope="col"
                    style={{
                      width: "5%",
                      display: showChangeOrderColumn ? "table-cell" : "none",
                    }}
                  >
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
                            maxWidth: "8ch",
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
                            maxWidth: "6ch",
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
                            maxWidth: "7ch",
                          }}
                        >
                          {question.values
                            .map((value) => value.value)
                            .join(", ")}
                        </Typography>
                      </td>
                      <td
                        style={{
                          display: showChangeOrderColumn
                            ? "none"
                            : "table-cell",
                        }}
                      >
                        <div style={{ display: "flex", gap: "5px" }}>
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
                        </div>
                      </td>

                      <td
                        style={{
                          display: showChangeOrderColumn
                            ? "table-cell"
                            : "none",
                        }}
                      >
                        <div style={{ display: "flex" }}>
                          <Button onClick={() => handleOrderUp(index)}>
                            <ArrowUpward />
                          </Button>
                          <Button onClick={() => handleOrderDown(index)}>
                            <ArrowDownward />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No questions found.</td>
                  </tr>
                )}
              </MDBTableBody>
            </MDBTable>

            <td colSpan="5" style={{ textAlign: "right" }}>
              <Button
                variant="contained"
                color={updateOrderMode ? "warning" : "primary"} // Color changes based on mode
                onClick={handleButtonClick}
              >
                {updateOrderMode ? "Update Order" : "Save Order"}
              </Button>
            </td>
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
                {selectedQuestion?.values
                  .map((value) => value.value)
                  .join(", ")}
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
    </>
  );
}

export default QuestionForm;
