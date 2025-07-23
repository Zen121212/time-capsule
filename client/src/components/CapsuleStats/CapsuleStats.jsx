import styles from "./CapsuleStats.module.css";
import calendarIcon from "../../assets/icons/png/calendar.png";
import clockIcon from "../../assets/icons/png/clock.png";
import eyeIcon from "../../assets/icons/png/eye.png";
import globeIcon from "../../assets/icons/png/globe.png";
import { getDaysLeft } from "../../utils/dateConverter";

function CapsuleStats({ capsules }) {
  const total = capsules.length;
  const revealed = capsules.filter((c) => {
    const daysLeft = getDaysLeft(c.revealDate);
    return daysLeft !== null && daysLeft <= 0;
  }).length;
  const waiting = capsules.filter((c) => {
    const daysLeft = getDaysLeft(c.revealDate);
    return daysLeft === null || daysLeft > 0;
  }).length;
  const revealedPublic = capsules.filter((c) => {
    const daysLeft = getDaysLeft(c.revealDate);
    const isRevealed = daysLeft !== null && daysLeft <= 0;
    return isRevealed && c.privacy === "Public";
  }).length;

  return (
    <div className={styles.statsGrid}>
      <StatBox label="Total Capsules" count={total} icon={calendarIcon} />
      <StatBox label="Revealed" count={revealed} icon={eyeIcon} />
      <StatBox label="Waiting" count={waiting} icon={clockIcon} />
      <StatBox
        label="Revealed Public"
        count={revealedPublic}
        icon={globeIcon}
      />
    </div>
  );
}

function StatBox({ label, count, icon }) {
  return (
    <div className={`${styles.statBox}`}>
      <div className={`${styles.statsNumber}`}>
        <div className={styles.label}>{label}</div>
        <div className={styles.count}>{count}</div>
      </div>
      <div className={`${styles.statsImages}`}>
        <img src={icon} alt={`${label} icon`} className={styles.icon} />
      </div>
    </div>
  );
}

export default CapsuleStats;
