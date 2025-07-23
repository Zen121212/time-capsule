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
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import Countdown from "../../Countdown/Countdown";

function CapsuleCard({ capsule }) {
  const navigate = useNavigate();
  const [copySuccess, setCopySuccess] = useState(false);

  const privacyIcons = {
    Private: FaLock,
    Public: FaGlobe,
    Unlisted: FaLink,
  };
  const Icon = privacyIcons[capsule.privacy];

  const daysLeft = getDaysLeft(capsule.revealDate);
  const isRevealed = daysLeft !== null && daysLeft <= 0;

  const privacyClass = capsule.isPublic
    ? styles.privacyPublic
    : styles.privacyPrivate;

  const handleCardClick = () => {
    if (!isRevealed) {
      return;
    }
    navigate(`/capsule/${capsule.id}`);
  };

  const handleShareClick = async (e) => {
    e.stopPropagation();

    if (capsule.privacy === "Unlisted" && capsule.unlistedToken) {
      const shareUrl = `${window.location.origin}/capsule/unlisted/${capsule.unlistedToken}`;

      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error("Failed to copy to clipboard:", err);

        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    }
  };

  return (
    <div
      className={`${styles.card} ${!isRevealed ? styles.unrevealed : ""}`}
      onClick={handleCardClick}
    >
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
        <div
          className={`${styles.description} ${
            !isRevealed ? styles.blurred : ""
          }`}
        >
          <div data-color-mode="light">
            <MDEditor.Markdown source={capsule.message} />
          </div>
        </div>
        {capsule.privacy === "Unlisted" && capsule.unlistedToken && (
          <div className={styles.shareContainer}>
            <strong>Share:</strong>
            <button
              onClick={handleShareClick}
              className={`${styles.shareButton} ${
                copySuccess ? styles.copied : ""
              }`}
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
          <div className={styles.countdownContainer}>
            <FaClock />
            <Countdown
              revealDate={capsule.revealDate}
              isRevealed={isRevealed}
            />
          </div>
        </div>
        {capsule.user && (
          <div className={styles.authorInfo}>
            Created by {capsule.user.name}
          </div>
        )}
      </div>
    </div>
  );
}

export default CapsuleCard;
