import { Button, Stack, Typography } from "@mui/material";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type Counts = {
  ids: number[];
  values: { [key: number]: number };
};

type ContextCountsType = {
  counts: Counts;
  setCount: (id: number, value: number) => void;
  addCounter: () => number;
  removeCounter: (id: number) => void;
};
export const ContextCounts = createContext<ContextCountsType | null>(null);
export const ProviderCounts = (props: { children: React.ReactNode }) => {
  const [counts, setCounts] = useState<Counts>({
    ids: [],
    values: {},
  });

  const setCount = useCallback((id: number, value: number) => {
    setCounts((prev) => ({
      ids: prev.ids,
      values: { ...prev.values, [id]: value },
    }));
  }, []);

  const addCounter = useCallback(() => {
    const id = Date.now(); // 甘いけどとりあえず一意なIDとして
    setCounts((prev) => ({
      ids: [...prev.ids, id],
      values: { ...prev.values, [id]: 0 },
    }));
    return id;
  }, []);

  const removeCounter = useCallback((id: number) => {
    setCounts((prev) => {
      const { [id]: _, ...values } = prev.values;
      return {
        ids: prev.ids.filter((item) => item !== id),
        values,
      };
    });
  }, []);

  const value = useMemo(
    () => ({
      counts,
      setCount,
      addCounter,
      removeCounter,
    }),
    [counts, setCount, addCounter, removeCounter]
  );

  return (
    <ContextCounts.Provider value={value}>
      {props.children}
    </ContextCounts.Provider>
  );
};

export const WrapCounterVaribale = () => {
  return (
    <ProviderCounts>
      <CounterVaribale />
    </ProviderCounts>
  );
};

const CounterVaribale = () => {
  const { counts, addCounter, removeCounter } = useContext(ContextCounts)!;

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
  const { counts, setCount, removeCounter } = useContext(ContextCounts)!;
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
