import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDaysLeft } from "../../utils/dateConverter";

import styles from "./CapsuleDetail.module.css";

export default function CapsuleDetail() {
  const { id } = useParams();
  const [capsule, setCapsule] = useState(null);
  const mockCapsules = [
    {
      id: "1",
      title: "Future Message to Myself",
      message:
        "Hey future me!\nHope you're doing great.\nRemember to keep coding 🚀",
      color: "#ff5733",
      emoji: "📝",
      revealDate: "2025-12-31",
      privacy: "private",
      surpriseMode: true,
      location: "Beirut, Lebanon",
      ipAddress: "192.168.1.1",
    },
    {
      id: "2",
      title: "Birthday Time Capsule",
      message: "Happy Birthday!\nYou deserve a party and a cake! 🎂",
      color: "#33c4ff",
      emoji: "🎉",
      revealDate: "2025-08-15",
      privacy: "public",
      surpriseMode: false,
      location: "Paris, France",
      ipAddress: "203.0.113.42",
    },
  ];

  useEffect(() => {
    const foundCapsule = mockCapsules.find((c) => c.id === id);
    setCapsule(foundCapsule);
  }, [id]);
  if (!capsule) return <p>Loading...</p>;

  const {
    title,
    message,
    color,
    emoji,
    revealDate,
    privacy,
    surpriseMode,
    location,
    ipAddress,
  } = capsule;

  const daysLeft = getDaysLeft(revealDate);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>

      <div className={styles.revealInfo}>
        Reveals in {daysLeft} days ({revealDate})
      </div>

      <div className={styles.message}>{message}</div>

      <div className={styles.emojiRow}>
        <span className={styles.emoji}>{emoji}</span>
        <div
          className={styles.colorSwatch}
          style={{ backgroundColor: color }}
          title={color}
        ></div>
      </div>

      <div className={styles.details}>
        <p>
          <span className={styles.strong}>Location:</span>{" "}
          {location || "Unknown"}
        </p>
        <p>
          <span className={styles.strong}>IP Address:</span>{" "}
          {ipAddress || "Unknown"}
        </p>
        <p>
          <span className={styles.strong}>Privacy:</span> {privacy}
        </p>
        <p>
          <span className={styles.strong}>Surprise Mode:</span>{" "}
          {surpriseMode ? "On" : "Off"}
        </p>
      </div>
    </div>
  );
}
