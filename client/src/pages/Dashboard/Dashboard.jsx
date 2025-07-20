import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/layout";
import Button from "../../components/common/Button/Button";
import CapsuleCard from "../../components/capsule/CapsuleCard/CapsuleCard";
import CapsuleFilters from "../../components/CapsuleFilters/CapsuleFilters";
import CapsuleStats from "../../components/CapsuleStats/CapsuleStats";
import CreateCapsuleModal from "../../components/capsule/CapsuleForm/CapsuleForm";
import { timeCapsuleService } from "../../services/timeCapsuleService.js";
import { authService } from "../../services/authService.js";
import { FaPlus } from "react-icons/fa";
const Capsules = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
  });

  // Check authentication and fetch capsules on component mount
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/');
      return;
    }
    
    fetchTimeCapsules();
  }, [navigate]);

  const fetchTimeCapsules = async () => {
    setLoading(true);
    setError('');
    
    const result = await timeCapsuleService.getTimeCapsules();
    
    if (result.success) {
      // Transform backend data to frontend format
      const transformedCapsules = result.data.map(capsule => ({
        id: capsule.id,
        title: capsule.title,
        message: capsule.message,
        location: capsule.location,
        revealDate: new Date(capsule.reveal_date), // Convert to Date object
        isPublic: capsule.is_public,
        color: capsule.color,
        emoji: capsule.emoji,
        privacy: capsule.privacy?.charAt(0).toUpperCase() + capsule.privacy?.slice(1) || 'Private',
      }));
      setCapsules(transformedCapsules);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const filteredCapsules = capsules.filter((capsule) => {
    if (filters.status === "all") return true;
    return capsule.privacy === filters.status;
  });

  const handleCapsuleCreation = async (newCapsuleData) => {
    const result = await timeCapsuleService.createTimeCapsule(newCapsuleData);
    
    if (result.success) {
      // Transform the returned capsule and add it to the list
      const transformedCapsule = {
        id: result.data.id,
        title: result.data.title,
        message: result.data.message,
        location: result.data.location,
        revealDate: new Date(result.data.reveal_date),
        isPublic: result.data.is_public,
        color: result.data.color,
        emoji: result.data.emoji,
        privacy: result.data.privacy?.charAt(0).toUpperCase() + result.data.privacy?.slice(1) || 'Private',
      };
      
      setCapsules((prev) => [...prev, transformedCapsule]);
      setOpenModal(false);
    } else {
      // Handle creation error
      alert(result.message || 'Failed to create time capsule');
    }
  };

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
          {loading && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              Loading your time capsules...
            </div>
          )}
          
          {error && (
            <div style={{ 
              background: '#f8d7da', 
              color: '#721c24', 
              padding: '1rem', 
              borderRadius: '4px',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}
          
          {!loading && !error && filteredCapsules.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem',
              color: '#666'
            }}>
              No time capsules found. Create your first one!
            </div>
          )}
          
          {!loading && filteredCapsules.map((capsule) => (
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
