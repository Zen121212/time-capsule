import Button from "../../common/Button/Button";
import {
  FaLock,
  FaGlobe,
  FaLink,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import styles from "./CapsuleCard.module.css";
import { getDaysLeft } from "../../../utils/dateConverter";

function CapsuleCard({ capsule, onEdit, onDelete }) {
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

  return (
    <div className={styles.card}>
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
          <div style={{ marginTop: "0.5rem" }}>
            <strong>Share Link:</strong>{" "}
            <a
              href={`/capsule/unlisted/${capsule.unlistedToken}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Capsule
            </a>
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
      </div>

      <div className={styles.actions}>
        <Button label="Edit" variant="secondary" onClick={onEdit} />
        <Button label="Delete" variant="danger" onClick={onDelete} />
      </div>
    </div>
  );
}

export default CapsuleCard;
