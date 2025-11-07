import { Button, CssBaseline, Divider, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { MultiCounter } from "./Multi";
import { VariableCounter } from "./Variable";

export const Counter = () => {
  return (
    <CssBaseline>
      <Stack padding={2} alignItems="flex-start" spacing={4}>
        <BasicCounter />
        <Divider flexItem />
        <MultiCounter />
        <Divider flexItem />
        <VariableCounter />
      </Stack>
    </CssBaseline>
  );
};

const BasicCounter = () => {
  const [count, setCount] = useState(0);

  return (
    <Stack padding={2} margin="0 auto" spacing={4}>
      <Typography variant="h4">Counter</Typography>
      <Stack
        padding={3}
        spacing={2}
        alignItems="center"
        sx={{ border: "1px solid #ddd" }}
      >
        <Typography variant="h2">{count}</Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={() => setCount(count - 1)}>
            -1
          </Button>
          <Button variant="outlined" onClick={() => setCount(0)}>
            Reset
          </Button>
          <Button variant="contained" onClick={() => setCount(count + 1)}>
            +1
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};
