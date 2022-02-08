import axios from "axios";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import { Link, useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  TextField,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";

const NewArticlePage: React.FC = () => {
  const navigate = useNavigate();
  const [submitLabel, setSubmitLabel] = useState("Publish");
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [submissionError, setSubmissionError] = useState<string>();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const handleTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const handleAuthorChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthor(e.target.value);
  };
  const handleContentChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };
  const publishArticle = () => {
    setSubmitLabel("Publishing...");
    setSubmitDisabled(true);
    setSubmissionError("");
    axios
      .post("/api/articles", {
        title,
        content,
        author,
      })
      .then((response) => {
        navigate(`/article/${response.data.id}`);
      })
      .catch((err) => {
        if (err?.response?.data?.message) {
          setSubmissionError(err?.response?.data?.message);
        } else {
          setSubmissionError(err.message);
        }
      })
      .finally(() => {
        setSubmitDisabled(false);
        setSubmitLabel("Publish");
      });
  };

  return (
    <Box sx={{ my: 2, mx: 4 }}>
      <Card sx={{ my: 1 }}>
        <CardHeader
          title={
            <TextField
              label="Title"
              placeholder="Title"
              variant="standard"
              value={title}
              onChange={handleTitleChanged}
              required
              fullWidth
            />
          }
          subheader={
            <TextField
              label="Author"
              variant="standard"
              value={author}
              onChange={handleAuthorChanged}
              fullWidth
              required
              sx={{ mt: 2 }}
            />
          }
        />
        <CardContent>
          <TextField
            variant="outlined"
            placeholder="Write your article content here"
            minRows="12"
            value={content}
            onChange={handleContentChanged}
            fullWidth
            required
            multiline
          />
          <Stack spacing={2} direction="row" sx={{ mt: 4 }}>
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={publishArticle}
              disabled={submitDisabled}
            >
              {submitLabel}
            </Button>
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              component={Link}
              to="/"
            >
              Discard
            </Button>
          </Stack>
          {submissionError ? (
            <Alert sx={{ mt: 4 }} severity="error">
              {submissionError}
            </Alert>
          ) : null}
        </CardContent>
      </Card>
    </Box>
  );
};

export default NewArticlePage;
