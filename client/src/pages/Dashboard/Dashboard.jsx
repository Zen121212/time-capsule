import { useState } from "react";
import Layout from "../../components/layout/layout";
import Button from "../../components/common/Button/Button";
import CapsuleCard from "../../components/capsule/CapsuleCard/CapsuleCard";
import CapsuleFilters from "../../components/CapsuleFilters/CapsuleFilters";
import CapsuleStats from "../../components/CapsuleStats/CapsuleStats";
import CreateCapsuleModal from "../../components/capsule/CapsuleForm/CapsuleForm";
import { FaPlus } from "react-icons/fa";
const Capsules = () => {
  // Placeholder capsules for UI testing
  const initialCapsules = [
    {
      id: 1,
      title: "New Year Resolutions",
      message:
        "I hope by 2026 I’ll have learned to cook properly and started that business I keep talking about!",
      location: "Beirut, Lebanon",
      revealDate: 176,
      isPublic: true,
      color: "#FFA500",
      emoji: "🎯",
      privacy: "Public",
    },
    {
      id: 2,
      title: "Wedding Day Memory",
      message:
        "Just got married! I wonder what our life will look like in 5 years...",
      location: "Paris, France",
      revealDate: 1437,
      isPublic: false,
      color: "#FF1493",
      emoji: "💕",
      privacy: "Private",
    },
    {
      id: 3,
      title: "Secret Project Notes",
      message:
        "This capsule is unlisted. Only people with the link should be able to see it.",
      location: "San Francisco, USA",
      revealDate: 365,
      isPublic: false,
      color: "#00CED1",
      emoji: "🤫",
      privacy: "Unlisted",
      unlistedToken: "abc123xyz", // uniquely identifies this capsule
    },
  ];
  const [openModal, setOpenModal] = useState(false);
  const [capsules, setCapsules] = useState(initialCapsules); // load this from API eventually
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
  });

  const filteredCapsules = capsules.filter((capsule) => {
    if (filters.status === "all") return true;
    return capsule.privacy === filters.status;
  });

  function handleCapsuleCreation(newCapsuleData) {
    const newCapsule = {
      ...newCapsuleData,
    };
    setCapsules((prev) => [...prev, newCapsule]);
    setOpenModal(false);
  }

  return (
    <Layout>
      <section>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1>My Time Capsules</h1>
            <p>Messages to your future self</p>
          </div>
          <Button
            label="Create Capsule"
            variant="primary"
            iconLeft={<FaPlus />}
            onClick={() => setOpenModal(true)}
          />
        </div>

        {/* STATS HEADER */}
        <CapsuleStats capsules={capsules} />

        {/* FILTERS */}
        <CapsuleFilters filters={filters} setFilters={setFilters} />

        {/* CAPSULE CARDS */}
        <div style={{ marginTop: "2rem" }}>
          {filteredCapsules.map((capsule) => (
            <CapsuleCard
              key={capsule.id}
              capsule={capsule}
              onEdit={() => console.log("Edit capsule", capsule.id)}
              onDelete={() => console.log("Delete capsule", capsule.id)}
            />
          ))}
        </div>
      </section>

      {/* CREATE CAPSULE MODAL */}
      <CreateCapsuleModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleCapsuleCreation}
      />
    </Layout>
  );
};

export default Capsules;
