import {
  Avatar,
  Card,
  CardHeader,
  Typography,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  Stack,
  TextField,
  Alert,
  Button,
  Divider,
  ListItemAvatar,
  ListItemText,
  Box,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SendIcon from "@mui/icons-material/Send";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import useAxios from "axios-hooks";
import axios from "axios";

type ArticleCardProps = {
  article: {
    id: number;
    title: string;
    author: string;
    content: string;
    created_at: string;
  };
};

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <Card sx={{ my: 1 }}>
      <CardHeader
        avatar={
          <Avatar>
            <PersonIcon />
          </Avatar>
        }
        title={article.author}
        subheader={new Date(article.created_at).toDateString()}
      />
      <CardContent>
        <Typography variant="h3">{article.title}</Typography>
        <Typography
          sx={{ mt: 2.0, whiteSpace: "pre-wrap" }}
          color="text.secondary"
        >
          {article.content}
        </Typography>
      </CardContent>
    </Card>
  );
};

type Comment = {
  id: number;
  article_id: number;
  author: number;
  content: string;
  created_at: string;
};

const CommentsCard: React.FC = () => {
  const [submitLabel, setSubmitLabel] = useState("Submit");
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [submissionError, setSubmissionError] = useState<string>();
  const { article_id: articleId } = useParams();
  const [{ data, loading, error }, referch] = useAxios(
    `/api/articles/${articleId}/comments`
  );
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const handleAuthorChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthor(e.target.value);
  };
  const handleContentChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };
  const submitComment = () => {
    setSubmitLabel("Submitting...");
    setSubmitDisabled(true);
    setSubmissionError("");
    axios
      .post(`/api/articles/${articleId}/comments`, {
        author,
        content,
      })
      .then(() => {
        setAuthor("");
        setContent("");
        referch();
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
  if (loading) {
    return <CircularProgress />;
  }
  if (error) {
    return <p>{error}</p>;
  }
  return (
    <Card sx={{ my: 1 }}>
      <List sx={{ bgcolor: "background.paper" }}>
        <ListItem>
          <Stack direction="column" sx={{ mt: 4, width: "100%" }}>
            <TextField
              variant="outlined"
              placeholder="Your name"
              size="small"
              value={author}
              onChange={handleAuthorChanged}
              fullWidth
              required
            />
            <TextField
              variant="outlined"
              placeholder="Leave a comment"
              minRows="small"
              value={content}
              onChange={handleContentChanged}
              fullWidth
              required
              multiline
            />
            {submissionError ? (
              <Alert sx={{ mt: 4 }} severity="error">
                {submissionError}
              </Alert>
            ) : null}
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              sx={{ width: 100 }}
              onClick={submitComment}
              disabled={submitDisabled}
            >
              {submitLabel}
            </Button>
          </Stack>
        </ListItem>

        {data.comments.map((comment: Comment) => {
          return (
            <div key={comment.id}>
              <Divider />
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <>
                      {comment.author}
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        {` - ${new Date(comment.created_at).toDateString()}`}
                      </Typography>
                    </>
                  }
                  secondary={comment.content}
                />
              </ListItem>
            </div>
          );
        })}
      </List>
    </Card>
  );
};

const ArticlePage: React.FC = () => {
  const { article_id: articleId } = useParams();
  const [{ data, loading, error}] = useAxios(`/api/articles/${articleId}`)

  if (loading) {
    return <CircularProgress />
  }
  if (error) {
    return (
      <Box sx={{ my: 2, mx: 4 }}>
        <Typography variant="h3">Article not found</Typography>
        <Button component={Link} to="/">Go to top</Button>
      </Box>
    )
  }
  return (
    <Box sx={{ my: 2, mx: 4 }}>
      <Button component={Link} to="/">
        Go to top
      </Button>
      <ArticleCard article={data} />
      <CommentsCard />
    </Box>
  )
}

export default ArticlePage;