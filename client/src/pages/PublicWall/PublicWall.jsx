import { useState, useEffect } from "react";
import CapsuleCard from "../../components/capsule/CapsuleCard/CapsuleCard";
import Layout from "../../components/layout/layout";
import { timeCapsuleService } from "../../services/timeCapsuleService.js";
import styles from "./PublicWall.module.css";

const PublicWall = () => {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPublicCapsules();
  }, []);

  const fetchPublicCapsules = async () => {
    setLoading(true);
    setError("");
    const result = await timeCapsuleService.getPublicTimeCapsules();

    if (result.success) {
      // Transform backend data to frontend format
      const transformedCapsules = result.data.map(capsule => ({
        id: capsule.id,
        title: capsule.title,
        message: capsule.message,
        location: capsule.location,
        revealDate: new Date(capsule.reveal_date),
        isPublic: capsule.is_public,
        color: capsule.color,
        emoji: capsule.emoji,
        privacy: capsule.privacy?.charAt(0).toUpperCase() + capsule.privacy?.slice(1) || 'Public',
        // Include user info for public capsules
        user: capsule.user || { name: 'Anonymous' }
      }));
      setCapsules(transformedCapsules);
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <Layout>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem' 
      }}>
        <div>
          <h1>Public Time Capsules</h1>
          <p>Discover messages from the community</p>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          Loading public time capsules...
        </div>
      )}

      {error && (
        <div style={{
          background: "#f8d7da",
          color: "#721c24",
          padding: "1rem",
          borderRadius: "4px",
          marginBottom: "1rem",
        }}>
          {error}
        </div>
      )}

      {!loading && !error && capsules.length === 0 && (
        <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
          No public capsules found.
        </div>
      )}

      <div style={{ marginTop: "1rem" }}>
        {!loading && capsules.map((capsule) => (
          <CapsuleCard
            key={capsule.id}
            capsule={capsule}
            onEdit={null}
            onDelete={null}
          />
        ))}
      </div>
    </Layout>
  );
};

export default PublicWall;
