import { Link as RouterLink } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";

export default function Home() {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography variant="h3" component="h1">
            React 練習プロジェクト
          </Typography>
          <Typography variant="body1" color="text.secondary">
            各機能のページへ移動できます
          </Typography>
        </Stack>

        <Stack spacing={2}>
          <Card variant="outlined">
            <CardActionArea component={RouterLink} to="/counter">
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Counter
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  stateの基本的な操作、管理
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>

          <Card variant="outlined">
            <CardActionArea component={RouterLink} to="/paint">
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Paint
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  お絵描き機能
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>

          <Card variant="outlined">
            <CardActionArea component={RouterLink} to="/api-demo">
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  API Demo
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  API連携と仮想化のデモ
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Stack>
      </Stack>
    </Container>
  );
}


