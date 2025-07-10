import Button from "../../common/Button/Button";
import styles from "./CapsuleCard.module.css";

function CapsuleCard({ capsule, onEdit, onDelete }) {
  function getDaysLeft(revealDate) {
    if (!revealDate) return null; // no date chosen yet

    const reveal = new Date(revealDate);
    const today = new Date();

    // remove time portion so we're comparing pure dates
    reveal.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffMs = reveal - today;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return diffDays;
  }
  const daysLeft = getDaysLeft(capsule.revealDate);
  // console.log("CAPSUELS", capsule);
  const privacyClass = capsule.isPublic
    ? styles.privacyPublic
    : styles.privacyPrivate;

  return (
    <div className={styles.card}>
      {/* Color + Emoji */}
      <div
        className={styles.circle}
        style={{ backgroundColor: capsule.color || "#eee" }}
      >
        {capsule.emoji}
      </div>

      {/* Capsule Info */}
      <div className={styles.info}>
        <h3 className={styles.title}>{capsule.title}</h3>
        <p className={styles.description}>{capsule.message}</p>
        <p className={styles.meta}>
          Location: {capsule.location || "N/A"}
          {daysLeft !== null && (
            <>
              {" • "}
              {daysLeft > 0
                ? `${daysLeft} day(s) left until reveal!`
                : daysLeft === 0
                ? "Today is the reveal day!"
                : "Revealed !"}
            </>
          )}
        </p>
        <span className={`${styles.privacy} ${privacyClass}`}>
          {capsule.privacy.toUpperCase()}
        </span>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <Button label="Edit" variant="secondary" onClick={onEdit} />
        <Button label="Delete" variant="danger" onClick={onDelete} />
      </div>
    </div>
  );
}

export default CapsuleCard;
