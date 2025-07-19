function CapsuleFilters({ filters, setFilters }) {
  const handleStatusChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      status: e.target.value,
    }));
  };

  const handleSearchChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      search: e.target.value,
    }));
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        marginTop: "1.5rem",
      }}
    >
      <select value={filters.status} onChange={handleStatusChange}>
        <option value="all">All</option>
        <option value="private">Private</option>
        <option value="public">Public</option>
        <option value="unlisted">Unlisted</option>
      </select>

      <input
        type="text"
        placeholder="Search by title or text..."
        value={filters.search}
        onChange={handleSearchChange}
        style={{ padding: "0.5rem", flex: 1 }}
      />
    </div>
  );
}

export default CapsuleFilters;
