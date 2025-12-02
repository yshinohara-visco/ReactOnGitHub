import { useEffect, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import type { Post, Comment, DisplayMode } from "./types";

export const ApiDemo = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("virtualized");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      // 意図的な遅延を追加（ローディング状態を見やすくするため）
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data: Post[] = await response.json();

      // データを10回複製して1000件に増やす
      const expandedData = Array.from({ length: 10 }, (_, i) =>
        data.map((post) => ({
          ...post,
          id: post.id + i * 100,
        }))
      ).flat();

      setPosts(expandedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostClick = async (post: Post) => {
    setSelectedPost(post);
    setLoadingComments(true);
    try {
      // 元のポストID（1-100の範囲）を取得
      const originalPostId = ((post.id - 1) % 100) + 1;
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${originalPostId}/comments`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      const data: Comment[] = await response.json();
      setComments(data);
    } catch (err) {
      console.error("Failed to load comments:", err);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleCloseDialog = () => {
    setSelectedPost(null);
    setComments([]);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={2}>
        <Stack spacing={1}>
          <Typography variant="h3" component="h1">
            API Demo
          </Typography>
          <Typography variant="body1" color="text.secondary">
            JSONPlaceholder APIから取得した{posts.length}件のポストを表示しています。
          </Typography>
        </Stack>

        {error ? (
          <Stack spacing={2} alignItems="center" sx={{ py: 4 }}>
            <Typography color="error">Error: {error}</Typography>
            <Button variant="contained" onClick={fetchPosts} startIcon={<RefreshIcon />}>
              Retry
            </Button>
          </Stack>
        ) : loading ? (
          <Stack spacing={2}>
            <Skeleton variant="rectangular" height={40} />
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={120} />
            ))}
          </Stack>
        ) : (
          <>
            <Stack direction="row" spacing={2} alignItems="center">
              <Tabs
                value={displayMode}
                onChange={(_, value) => setDisplayMode(value)}
              >
                <Tab label="仮想化" value="virtualized" />
                <Tab label="通常表示" value="normal" />
              </Tabs>
              <Box sx={{ flexGrow: 1 }} />
              <Button
                variant="outlined"
                size="small"
                onClick={fetchPosts}
                startIcon={<RefreshIcon />}
              >
                Refresh
              </Button>
            </Stack>

            <PostList
              posts={posts}
              displayMode={displayMode}
              onPostClick={handlePostClick}
            />

            <Typography variant="body2" color="text.secondary">
              💡 仮想化は表示範囲のみをレンダリングし、通常表示は1000個全てをレンダリングします。タブ切り替え時やダイアログ開閉時の動作に差が出ています。
            </Typography>
          </>
        )}
      </Stack>

      <PostDetailDialog
        post={selectedPost}
        comments={comments}
        loadingComments={loadingComments}
        onClose={handleCloseDialog}
      />
    </Container>
  );
};

interface PostListProps {
  posts: Post[];
  displayMode: DisplayMode;
  onPostClick: (post: Post) => void;
}

const PostList = ({ posts, displayMode, onPostClick }: PostListProps) => {
  if (displayMode === "virtualized") {
    return (
      <Box sx={{ border: "1px solid #ddd", borderRadius: 1, height: 600 }}>
        <Virtuoso
          style={{ height: "100%" }}
          data={posts}
          itemContent={(_index, post) => <PostCard post={post} onClick={onPostClick} />}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        border: "1px solid #ddd",
        borderRadius: 1,
        height: 600,
        overflow: "auto",
      }}
    >
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onClick={onPostClick} />
      ))}
    </Box>
  );
};

interface PostDetailDialogProps {
  post: Post | null;
  comments: Comment[];
  loadingComments: boolean;
  onClose: () => void;
}

const PostDetailDialog = ({
  post,
  comments,
  loadingComments,
  onClose,
}: PostDetailDialogProps) => {
  return (
    <Dialog open={!!post} onClose={onClose} maxWidth="md" fullWidth>
      {post && (
        <>
          <DialogTitle>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                {post.title}
              </Typography>
              <IconButton onClick={onClose} size="small">
                <CloseIcon />
              </IconButton>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Post ID: {post.id} | User ID: {post.userId}
                </Typography>
                <Typography variant="body1">{post.body}</Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="h6" gutterBottom>
                  Comments ({comments.length})
                </Typography>
                {loadingComments ? (
                  <Stack spacing={2}>
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} variant="rectangular" height={80} />
                    ))}
                  </Stack>
                ) : (
                  <Stack spacing={2}>
                    {comments.map((comment) => (
                      <Card key={comment.id} variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle2" gutterBottom>
                            {comment.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                            {comment.email}
                          </Typography>
                          <Typography variant="body2">{comment.body}</Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                )}
              </Box>
            </Stack>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};

const PostCard = ({ post, onClick }: { post: Post; onClick: (post: Post) => void }) => (
  <Box sx={{ px: 2, py: 1 }}>
    <Card variant="outlined">
      <CardActionArea onClick={() => onClick(post)}>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            {post.id}. {post.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            User ID: {post.userId}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {post.body}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  </Box>
);
