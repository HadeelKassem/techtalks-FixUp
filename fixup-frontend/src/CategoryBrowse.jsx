import { useState } from "react";
import "./CategoryBrowse.css";
import ProviderCard from "./ProviderCard";

function CategoryBrowse() {
  const providers = [
    {
      id: 1,
      name: "John Smith",
      category: "Plumber",
      rating: 4.8,
      description: "Professional plumbing services.",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      category: "Electrician",
      rating: 4.6,
      description: "Residential and commercial electrical work.",
    },
    {
      id: 3,
      name: "Michael Brown",
      category: "Painter",
      rating: 4.7,
      description: "Interior and exterior painting.",
    },
  ];

  const [search, setSearch] = useState("");

  const filteredProviders = providers.filter(
    (provider) =>
      provider.name.toLowerCase().includes(search.toLowerCase()) ||
      provider.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="browse-container">
      <h1>Browse Service Providers</h1>

      <input
        type="text"
        placeholder="Search providers..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="providers-list">
        {filteredProviders.map((provider) => (
          <ProviderCard key={provider.id} provider={provider} />
        ))}
      </div>
    </div>
  );
}

export default CategoryBrowse;