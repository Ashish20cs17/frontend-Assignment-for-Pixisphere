// src/PhotographerProfilePage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { photographers } from "./data";
import "./PhotographerProfilePage.css";

export default function PhotographerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const photographer = photographers.find((p) => p.id === Number(id));

  if (!photographer) {
    return (
      <div className="profile-container">
        <p className="not-found">Photographer not found.</p>
        <button className="back-btn" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back to listings
      </button>

      <div className="profile-card">
        <img
          src={photographer.profileImage}
          alt={photographer.name}
          className="profile-image"
        />

        <div className="profile-details">
          <h1>{photographer.name}</h1>
          <p><strong>Category:</strong> {photographer.category}</p>
          <p><strong>Location:</strong> {photographer.location}</p>
          <p><strong>Style:</strong> {photographer.style}</p>
          <p><strong>Rating:</strong> {photographer.rating}</p>
          <p><strong>Price:</strong> ₹{photographer.price}</p>
          <p><strong>Description:</strong> {photographer.description}</p>
          <p><strong>Contact:</strong> {photographer.contact}</p>
        </div>
      </div>
    </div>
  );
}
