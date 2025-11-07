import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={styles.container}>
      <h1>React 練習プロジェクト</h1>
      <p>各機能のページへ移動できます</p>

      <div style={styles.linkList}>
        <Link to="/counter" style={styles.card}>
          <h2>Counter</h2>
          <p>useStateを使ったシンプルなカウンター</p>
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
  },
  linkList: {
    display: 'grid',
    gap: '1rem',
    marginTop: '2rem',
  },
  card: {
    padding: '1.5rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'box-shadow 0.2s',
    cursor: 'pointer',
  } as React.CSSProperties,
};
