import MemoryGame from "./pages/mainPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MemoryGame />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
