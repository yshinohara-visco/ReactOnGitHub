import { Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import { Counter } from "./pages/Counter/Counter";
import { Paint } from "./pages/Paint/Paint";

function App() {
  return (
    <>
      <CssBaseline />
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/counter" element={<Counter />} />
        <Route path="/paint" element={<Paint />} />
      </Routes>
    </>
  );
}

export default App;
