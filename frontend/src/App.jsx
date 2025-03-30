import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Liveplay from "./components/Liveplay";
import Progress from "./components/Progress";
import Tuner from "./components/Tuner";
import Homepage from "./components/Homepage";

function App() {
  return (
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={< Homepage />} />
          <Route path="/liveplay" element={< Liveplay />} />
          <Route path="/progress" element={< Progress />} />
          <Route path="/tuner" element={< Tuner />} />
        </Routes>
  )
}

export default App;
