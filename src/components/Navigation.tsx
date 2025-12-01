import { Link } from 'react-router-dom';

export default function Navigation() {
  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.link}>Home</Link>
      <Link to="/counter" style={styles.link}>Counter</Link>
      <Link to="/paint" style={styles.link}>Paint</Link>
    </nav>
  );
}

const styles = {
  nav: {
    padding: '1rem',
    backgroundColor: '#333',
    display: 'flex',
    gap: '1rem',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,
};
