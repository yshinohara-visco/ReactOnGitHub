/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type Counts = {
  ids: number[];
  values: { [key: number]: number };
};

export type CountsContextType = {
  counts: Counts;
  setCount: (id: number, value: number) => void;
  addCounter: () => number;
  removeCounter: (id: number) => void;
};

const CountsContext = createContext<CountsContextType | null>(null);

export const useCountsContext = () => {
  const context = useContext(CountsContext);
  if (!context) {
    throw new Error("useCountsContext must be used within CountsProvider");
  }
  return context;
};

export const CountsProvider = (props: { children: React.ReactNode }) => {
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
      // prev.valuesからidキーを除外した新しいオブジェクトを作成
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
    <CountsContext.Provider value={value}>
      {props.children}
    </CountsContext.Provider>
  );
};
