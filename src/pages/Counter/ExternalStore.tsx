/**
 * useSyncExternalStore の使用例
 * 
 * 【本来の主な用途】
 * - React外で変化するデータとの連携
 *   例: window.innerWidth, navigator.onLine, WebSocket, localStorage など
 * 
 * 【副次的な用途】
 * - 複雑なロジックをクラスに纏める
 *   例: 複数のuseRefで管理すると冗長になる場合、関連する変数や処理を
 *       クラスにまとめつつ、レンダリングをトリガーできる
 * 
 * 【注意】
 * このカウンターの例は学習目的です。
 * 実際のアプリケーションでは、単純な状態管理には Context API の方が適切です。
 */
import { Button, Stack, Typography } from "@mui/material";
import { useSyncExternalStore } from "react";

// 外部ストアの実装
class CounterStore {
  private count = 0;
  private listeners = new Set<() => void>();

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = () => {
    return this.count;
  };

  increment = () => {
    this.count++;
    this.emitChange();
  };

  decrement = () => {
    this.count--;
    this.emitChange();
  };

  reset = () => {
    this.count = 0;
    this.emitChange();
  };

  private emitChange = () => {
    this.listeners.forEach((listener) => listener());
  };
}

// グローバルストアのインスタンス
const counterStore = new CounterStore();

export const ExternalStoreCounter = () => {
  return (
    <Stack padding={2} spacing={4} alignItems="flex-start">
      <Typography variant="h4">External Store Counter (useSyncExternalStore)</Typography>
      <Typography variant="body1" color="text.secondary">
        このカウンターは useSyncExternalStore を使用して外部ストア（クラス）を購読しています。
      </Typography>
      <Stack direction="row" spacing={4} flexWrap="wrap">
        <CounterDisplay title="カウンター A" />
        <CounterDisplay title="カウンター B" />
      </Stack>
      <Typography variant="body2" color="text.secondary">
        💡 同一ページ内の複数のコンポーネントが同じストアインスタンスを購読できます。
        どちらのカウンターからでも状態を変更でき、両方が同期されます。
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
        ⚠️ 本来は window.innerWidth や WebSocket など、React外で変化するデータとの連携が主な用途です。
        このカウンターは仕組みを学ぶための例で、実際のアプリでは Context API の方が適切な場合が多いです。
      </Typography>
    </Stack>
  );
};

const CounterDisplay = ({ title }: { title: string }) => {
  // useSyncExternalStoreを使ってストアを購読
  const count = useSyncExternalStore(
    counterStore.subscribe,
    counterStore.getSnapshot
  );

  return (
    <Stack spacing={2} alignItems="center">
      <Typography variant="h6">{title}</Typography>
      <Stack
        padding={3}
        spacing={2}
        alignItems="center"
        sx={{ border: "1px solid #ddd", minWidth: 250 }}
      >
        <Typography variant="h2">{count}</Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={() => counterStore.decrement()}>
            -1
          </Button>
          <Button variant="outlined" onClick={() => counterStore.reset()}>
            Reset
          </Button>
          <Button variant="contained" onClick={() => counterStore.increment()}>
            +1
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};
