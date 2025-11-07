import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div style={styles.container}>
      <h1>Counter</h1>
      <div style={styles.counterBox}>
        <p style={styles.count}>{count}</p>
        <div style={styles.buttonGroup}>
          <button onClick={() => setCount(count - 1)} style={styles.button}>
            -1
          </button>
          <button onClick={() => setCount(0)} style={styles.button}>
            Reset
          </button>
          <button onClick={() => setCount(count + 1)} style={styles.button}>
            +1
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '600px',
    margin: '0 auto',
  },
  counterBox: {
    marginTop: '2rem',
    padding: '2rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    textAlign: 'center' as const,
  },
  count: {
    fontSize: '4rem',
    fontWeight: 'bold',
    margin: '1rem 0',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
  },
  button: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#f0f0f0',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};
