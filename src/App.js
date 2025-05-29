// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CategoryListingPage from "./CategoryListingPage";
import PhotographerProfilePage from "./PhotographerProfilePage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CategoryListingPage />} />
        <Route path="/profile/:id" element={<PhotographerProfilePage />} />
      </Routes>
    </Router>
  );
}
