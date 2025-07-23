import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button/Button";
import CapsuleCard from "../../components/capsule/CapsuleCard/CapsuleCard";
import CapsuleStats from "../../components/CapsuleStats/CapsuleStats";
import CreateCapsuleModal from "../../components/capsule/CapsuleForm/CapsuleForm";
import { timeCapsuleService } from "../../services/timeCapsuleService.js";
import { authService } from "../../services/authService.js";
import { FaPlus } from "react-icons/fa";
import styles from "./Dashboard.module.css";
const Capsules = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/");
      return;
    }

    fetchTimeCapsules();
  }, [navigate]);

  const fetchTimeCapsules = async () => {
    setLoading(true);
    setError("");

    const result = await timeCapsuleService.getTimeCapsules();

    if (result.success) {
      const transformedCapsules = result.data.map((capsule) => ({
        id: capsule.id,
        title: capsule.title,
        message: capsule.message,
        location: capsule.location,
        revealDate: new Date(capsule.reveal_date),
        isPublic: capsule.is_public,
        color: capsule.color,
        emoji: capsule.emoji,
        privacy:
          capsule.privacy?.charAt(0).toUpperCase() +
            capsule.privacy?.slice(1) || "Private",
      }));
      setCapsules(transformedCapsules);
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  const handleCapsuleCreation = async (newCapsuleData) => {
    const result = await timeCapsuleService.createTimeCapsule(newCapsuleData);

    if (result.success) {
      const transformedCapsule = {
        id: result.data.id,
        title: result.data.title,
        message: result.data.message,
        location: result.data.location,
        revealDate: new Date(result.data.reveal_date),
        isPublic: result.data.is_public,
        color: result.data.color,
        emoji: result.data.emoji,
        privacy:
          result.data.privacy?.charAt(0).toUpperCase() +
            result.data.privacy?.slice(1) || "Private",
      };

      setCapsules((prev) => [...prev, transformedCapsule]);
      setOpenModal(false);
    } else {
      alert(result.message || "Failed to create time capsule");
    }
  };

  return (
    <>
      <section>
        <div className={styles.section}>
          <div>
            <h1>My Time Capsules</h1>
          </div>
          <Button
            label="Create Capsule"
            variant="primary"
            iconLeft={<FaPlus />}
            onClick={() => setOpenModal(true)}
          />
        </div>

        <CapsuleStats capsules={capsules} />

        <div style={{ marginTop: "2rem" }}>
          {loading && (
            <div className={styles.loading}>Loading your time capsules...</div>
          )}

          {error && <div className={styles.error}>{error}</div>}

          {!loading && !error && capsules.length === 0 && (
            <div className={styles.empty}>
              No time capsules found. Create your first one!
            </div>
          )}

          {!loading &&
            capsules.map((capsule) => (
              <CapsuleCard
                key={capsule.id}
                capsule={capsule}
                onEdit={() => console.log("Edit capsule", capsule.id)}
                onDelete={() => console.log("Delete capsule", capsule.id)}
              />
            ))}
        </div>
      </section>

      <CreateCapsuleModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleCapsuleCreation}
      />
    </>
  );
};

export default Capsules;
