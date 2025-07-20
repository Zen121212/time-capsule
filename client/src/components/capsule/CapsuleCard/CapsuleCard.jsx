import Button from "../../common/Button/Button";
import {
  FaLock,
  FaGlobe,
  FaLink,
  FaMapMarkerAlt,
  FaClock,
  FaShare,
  FaCopy,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./CapsuleCard.module.css";
import { getDaysLeft } from "../../../utils/dateConverter";

function CapsuleCard({ capsule, onEdit, onDelete }) {
  const navigate = useNavigate();
  const [copySuccess, setCopySuccess] = useState(false);
  
  const privacyIcons = {
    Private: FaLock,
    Public: FaGlobe,
    Unlisted: FaLink,
  };
  const Icon = privacyIcons[capsule.privacy];

  const daysLeft = getDaysLeft(capsule.revealDate);

  const privacyClass = capsule.isPublic
    ? styles.privacyPublic
    : styles.privacyPrivate;

  const handleCardClick = () => {
    navigate(`/capsule/${capsule.id}`);
  };
  
  const handleShareClick = async (e) => {
    e.stopPropagation(); // Prevent card click
    
    if (capsule.privacy === "Unlisted" && capsule.unlistedToken) {
      const shareUrl = `${window.location.origin}/capsule/unlisted/${capsule.unlistedToken}`;
      
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        // Fallback: select the text
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    }
  };

  return (
    <div className={styles.card} onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div
        className={styles.circle}
        style={{ backgroundColor: capsule.color || "#eee" }}
      >
        {capsule.emoji}
      </div>
      <div className={styles.info}>
        <div className={styles.heading}>
          <h3 className={styles.title}>{capsule.title}</h3>
          <span className={`${styles.privacy} ${privacyClass}`}>
            {Icon && <Icon />}
          </span>
        </div>
        <p className={styles.description}>{capsule.message}</p>
        {capsule.privacy === "Unlisted" && capsule.unlistedToken && (
          <div style={{ marginTop: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <strong>Share:</strong>
            <button
              onClick={handleShareClick}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                padding: "0.25rem 0.5rem",
                background: copySuccess ? "#10b981" : "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "0.8rem",
                cursor: "pointer",
                transition: "background-color 0.2s"
              }}
              title={copySuccess ? "Copied to clipboard!" : "Copy share link"}
            >
              {copySuccess ? <FaCopy /> : <FaShare />}
              <span>{copySuccess ? "Copied!" : "Copy Link"}</span>
            </button>
          </div>
        )}
        <div className={styles.meta}>
          <p>
            <span>
              <FaMapMarkerAlt />
            </span>
            <span>{capsule.location || "N/A"}</span>
          </p>
          <p>
            <span>
              <FaClock />
            </span>
            <span>
              {daysLeft !== null && (
                <>
                  {daysLeft > 0
                    ? `${daysLeft} day(s) left until reveal!`
                    : daysLeft === 0
                    ? "Today is the reveal day!"
                    : "Revealed"}
                </>
              )}
            </span>
          </p>
        </div>
        
        {/* Show author for public capsules */}
        {capsule.user && (
          <div style={{ 
            marginTop: '0.5rem',
            fontSize: '0.8rem',
            color: '#888',
            fontStyle: 'italic'
          }}>
            Created by {capsule.user.name}
          </div>
        )}
      </div>

      {(onEdit || onDelete) && (
        <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
          {onEdit && <Button label="Edit" variant="secondary" onClick={onEdit} />}
          {onDelete && <Button label="Delete" variant="danger" onClick={onDelete} />}
        </div>
      )}
    </div>
  );
}

export default CapsuleCard;
