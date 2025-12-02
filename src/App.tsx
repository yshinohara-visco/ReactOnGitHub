import { Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import { Counter } from "./pages/Counter/Counter";
import { Paint } from "./pages/Paint/Paint";
import { ApiDemo } from "./pages/ApiDemo/ApiDemo";

function App() {
  return (
    <>
      <CssBaseline />
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/counter" element={<Counter />} />
        <Route path="/paint" element={<Paint />} />
        <Route path="/api-demo" element={<ApiDemo />} />
      </Routes>
    </>
  );
}

export default App;
