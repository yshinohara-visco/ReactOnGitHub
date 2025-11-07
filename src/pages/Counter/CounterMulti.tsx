import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";

export const CounterMulti = () => {
  const [countA, setCountA] = useState(0);
  const [countB, setCountB] = useState(0);

  const sum = countA + countB;

  return (
    <Stack padding={2} spacing={4}>
      <Typography variant="h4">Multi Counter</Typography>
      <Typography variant="h5">Sum: {sum}</Typography>
      <Stack direction="row" spacing={4} justifyContent="center">
        <CounterChild count={countA} setCount={setCountA} />
        <CounterChild count={countB} setCount={setCountB} />
      </Stack>
    </Stack>
  );
};

const CounterChild = (props: {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { count, setCount } = props;

  return (
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
  );
};
