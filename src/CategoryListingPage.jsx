import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { photographers } from "./data";

export default function CategoryListingPage() {
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All");
  const [stylesFilter, setStylesFilter] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [sortOption, setSortOption] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [visibleCount, setVisibleCount] = useState(6);

  const navigate = useNavigate();

  function fuzzyMatch(str, query) {
    if (!query) return true;
    return str.toLowerCase().includes(query.toLowerCase());
  }

  const filteredPhotographers = useMemo(() => {
    return photographers
      .filter((p) => category === "All" || p.category === category)
      .filter((p) => location === "All" || p.location === location)
      .filter((p) =>
        stylesFilter.length > 0
          ? stylesFilter.some((style) => p.styles?.includes(style))
          : true
      )
      .filter((p) => p.rating >= minRating)
      .filter(
        (p) =>
          p.price >= priceRange[0] &&
          p.price <= priceRange[1]
      )
 .filter((p) => {
  const search = searchTerm.toLowerCase();
  if (!search) return true;
  return (
    fuzzyMatch(p.name, search) ||
    fuzzyMatch(p.location, search) ||
    (p.tags || []).some((tag) => fuzzyMatch(tag, search))
  );
})

      .sort((a, b) => {
        if (sortOption === "priceLowToHigh") return a.price - b.price;
        if (sortOption === "ratingHighToLow") return b.rating - a.rating;
        if (sortOption === "recentlyAdded") return b.id - a.id;
        return 0;
      });
  }, [category, location, stylesFilter, minRating, sortOption, searchTerm, priceRange]);

  const visiblePhotographers = filteredPhotographers.slice(0, visibleCount);
  const maxPrice = Math.max(...photographers.map((p) => p.price));
  const allStyles = [...new Set(photographers.flatMap((p) => p.styles))];

  function toggleStyle(style) {
    setStylesFilter((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  }

  return (
    <div className="container" style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>
        {category !== "All" ? category : "All"} Photographers{" "}
        {location !== "All" ? `in ${location}` : ""}
      </h1>

      <input
        type="text"
        placeholder="Search by name, location, or tag"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          padding: "8px 12px",
          marginBottom: 20,
          borderRadius: 6,
          border: "1px solid #ccc",
          fontSize: 16,
        }}
      />

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: 20,
          alignItems: "flex-start",
        }}
      >
        <div>
          <label htmlFor="category-select">Category:</label>
          <select
            id="category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All</option>
            {[...new Set(photographers.map((p) => p.category))].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="location-select">Location:</label>
          <select
            id="location-select"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="All">All</option>
            {[...new Set(photographers.map((p) => p.location))].map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div style={{ maxWidth: 200 }}>
          <label>Styles:</label>
          <div
            style={{
              maxHeight: 120,
              overflowY: "auto",
              border: "1px solid #ccc",
              borderRadius: 6,
              padding: 10,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {allStyles.map((style) => (
              <label key={style} style={{ cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={stylesFilter.includes(style)}
                  onChange={() => toggleStyle(style)}
                />{" "}
                {style}
              </label>
            ))}
          </div>
        </div>

        <div style={{ minWidth: 200 }}>
          <label>Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}</label>
          <input
            type="range"
            min={0}
            max={maxPrice}
            value={priceRange[0]}
            onChange={(e) =>
              setPriceRange([Number(e.target.value), priceRange[1]])
            }
            style={{ width: "100%" }}
          />
          <input
            type="range"
            min={0}
            max={maxPrice}
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value)])
            }
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label htmlFor="rating-select">Min Rating:</label>
          <select
            id="rating-select"
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
          >
            <option value={0}>All</option>
            <option value={3}>3+</option>
            <option value={4}>4+</option>
            <option value={4.5}>4.5+</option>
          </select>
        </div>

        <div>
          <label htmlFor="sort-select">Sort By:</label>
          <select
            id="sort-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">None</option>
            <option value="priceLowToHigh">Price: Low to High</option>
            <option value="ratingHighToLow">Rating: High to Low</option>
            <option value="recentlyAdded">Recently Added</option>
          </select>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {visiblePhotographers.length === 0 && <p>No photographers found.</p>}

        {visiblePhotographers.map((p) => (
          <div
            key={p.id}
            className="photographer-card"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 20,
              backgroundColor: "#fff",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
              transition: "transform 0.2s ease, border-color 0.2s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.borderColor = "#007bff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.borderColor = "#ddd";
            }}
            onClick={() => navigate(`/profile/${p.id}`)}
          >
            <img
              src={p.profileImage || p.profilePic || "https://via.placeholder.com/140"}
              alt={p.name}
              style={{
                width: 140,
                height: 140,
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: 12,
              }}
            />
            <h3 style={{ margin: 0 }}>{p.name}</h3>
            <p style={{ margin: "4px 0", color: "#666" }}>{p.location}</p>
            <p
              style={{
                margin: "4px 0",
                fontWeight: "bold",
                fontSize: 16,
                color: "#007bff",
              }}
            >
              ₹{p.price}
            </p>
            <p
              style={{
                margin: "4px 0",
                color: "#ffb400",
                fontWeight: "bold",
              }}
            >
              ⭐ {p.rating}
            </p>
          </div>
        ))}
      </div>

      {visibleCount < filteredPhotographers.length && (
        <div style={{ textAlign: "center", marginTop: 30 }}>
          <button
            onClick={() => setVisibleCount((c) => c + 6)}
            style={{
              padding: "12px 24px",
              fontSize: 16,
              backgroundColor: "#007bff",
              color: "#fff",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
            }}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
