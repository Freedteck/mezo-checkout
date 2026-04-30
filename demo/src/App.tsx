import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./app/page";
import Dashboard from "./app/dashboard/page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;