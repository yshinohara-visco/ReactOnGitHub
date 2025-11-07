import { Button, Stack, Typography } from "@mui/material";
import { useCountsContext, CountsProvider } from "./VariableContext";

export const VariableCounter = () => {
  return (
    <CountsProvider>
      <VariableCounterContent />
    </CountsProvider>
  );
};

const VariableCounterContent = () => {
  const { counts, addCounter, removeCounter } = useCountsContext();

  const sum = counts.ids.reduce((acc, id) => acc + counts.values[id], 0);

  return (
    <Stack padding={2} spacing={4} alignItems="flex-start">
      <Typography variant="h4">Variable Counter</Typography>
      <Typography variant="h5">Sum: {sum}</Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <Button variant="contained" onClick={() => addCounter()}>
          Add Counter
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            counts.ids.forEach((id) => {
              removeCounter(id);
            });
          }}
        >
          Clear Counter
        </Button>
      </Stack>
      <Stack direction="row" spacing={4} overflow="auto">
        {counts.ids.map((id) => (
          <CounterItem key={id} id={id} />
        ))}
      </Stack>
    </Stack>
  );
};

const CounterItem = (props: { id: number }) => {
  const { id } = props;
  const { counts, setCount, removeCounter } = useCountsContext();
  const count = counts.values[id];

  return (
    <Stack
      padding={3}
      spacing={2}
      alignItems="center"
      sx={{ border: "1px solid #ddd" }}
    >
      <Typography variant="h2">{count}</Typography>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={() => setCount(id, count - 1)}>
          -1
        </Button>
        <Button variant="outlined" onClick={() => setCount(id, 0)}>
          Reset
        </Button>
        <Button variant="contained" onClick={() => setCount(id, count + 1)}>
          +1
        </Button>
        <Button variant="text" color="error" onClick={() => removeCounter(id)}>
          Remove
        </Button>
      </Stack>
    </Stack>
  );
};
