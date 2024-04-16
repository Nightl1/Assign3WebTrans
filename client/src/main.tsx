import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './App.css'
// import App from './App.tsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Part1 from "./Views/Part1.tsx";
import Part2 from "./Views/Part2.tsx";
import Part3 from "./Views/Part3.tsx";
 
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Part1 />} />
        <Route path="/part2" element={<Part2 />} />
        <Route path="/part3" element={<Part3 />} />
      </Routes>
    </Router>
  </React.StrictMode>,
);
// APP.TSX was the one to center everything. FIX IT

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <User />
//   </React.StrictMode>,
// )
