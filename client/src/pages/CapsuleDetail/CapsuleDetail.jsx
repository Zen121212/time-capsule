import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDaysLeft } from "../../utils/dateConverter";
import { timeCapsuleService } from "../../services/timeCapsuleService.js";
import { authService } from "../../services/authService.js";
import Button from "../../components/common/Button/Button";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaClock,
  FaLock,
  FaGlobe,
  FaLink,
  FaShare,
  FaCopy,
} from "react-icons/fa";
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import Countdown from "../../components/Countdown/Countdown";

import styles from "./CapsuleDetail.module.css";

export default function CapsuleDetail() {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const [capsule, setCapsule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const isUnlistedAccess = !!token;

  useEffect(() => {
    fetchCapsuleDetail();
  }, [id, token]);

  const fetchCapsuleDetail = async () => {
    if (!isUnlistedAccess && !authService.isAuthenticated()) {
      navigate("/");
      return;
    }

    setLoading(true);
    setError("");
    const result = isUnlistedAccess
      ? await timeCapsuleService.getTimeCapsuleByToken(token)
      : await timeCapsuleService.getTimeCapsule(id);

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
        ipAddress: result.data.ip_address,
        createdAt: new Date(result.data.created_at),
        user: result.data.user || null,
        unlistedToken: result.data.unlisted_token || null,
      };
      setCapsule(transformedCapsule);
    } else {
      console.error("Failed to fetch time capsule:", result.message);
      setError(result.message || "Failed to load time capsule");
    }

    setLoading(false);
  };

  if (loading)
    return (
      <main>
        <div className={styles.loading}>Loading time capsule...</div>
      </main>
    );

  if (error)
    return (
      <main>
        <div className={styles.error}>{error}</div>
        {!isUnlistedAccess && (
          <Button
            label="Go Back"
            variant="secondary"
            iconLeft={<FaArrowLeft />}
            onClick={() => navigate(-1)}
          />
        )}
      </main>
    );

  if (!capsule)
    return (
      <main>
        <div className={styles.notFound}>Time capsule not found.</div>
        {!isUnlistedAccess && (
          <Button
            label="Go Back"
            variant="secondary"
            iconLeft={<FaArrowLeft />}
            onClick={() => navigate(-1)}
          />
        )}
      </main>
    );

  const daysLeft = getDaysLeft(capsule.revealDate);

  const privacyIcons = {
    Private: FaLock,
    Public: FaGlobe,
    Unlisted: FaLink,
  };
  const PrivacyIcon = privacyIcons[capsule.privacy];

  const handleShareClick = async () => {
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
    <main>
      <div className={styles.container}>
        {!isUnlistedAccess && (
          <div className={styles.header}>
            <Button
              label="Back"
              variant="secondary"
              iconLeft={<FaArrowLeft />}
              onClick={() => navigate(-1)}
            />
          </div>
        )}
        <div className={styles.detailWrapper}>
          <div
            className={styles.circle}
            style={{ backgroundColor: capsule.color || "#eee" }}
          >
            {capsule.emoji}
          </div>

          <div className={styles.info}>
            <div className={styles.heading}>
              <h1 className={styles.title}>{capsule.title}</h1>
              <div
                className={`${styles.privacy} ${
                  capsule.privacy === "Public"
                    ? styles.privacyPublic
                    : capsule.privacy === "Private"
                    ? styles.privacyPrivate
                    : styles.privacyUnlisted
                }`}
              >
                {PrivacyIcon && <PrivacyIcon />}
                <span>{capsule.privacy}</span>
              </div>
            </div>

            <div className={styles.description}>
              <div data-color-mode="light">
                <MDEditor.Markdown source={capsule.message} />
              </div>
            </div>

            <div className={styles.meta}>
              <div className={styles.countdownContainer}>
                <FaClock />
                <Countdown 
                  revealDate={capsule.revealDate} 
                  isRevealed={daysLeft !== null && daysLeft <= 0} 
                />
                <small>({capsule.revealDate.toLocaleDateString()})</small>
              </div>

              <p>
                <FaMapMarkerAlt />
                <strong>Location:</strong>
                <span>{capsule.location || "Unknown"}</span>
              </p>

              {capsule.user && (
                <p>
                  <strong>Created by:</strong>
                  <span>{capsule.user.name}</span>
                </p>
              )}
            </div>
            {!isUnlistedAccess &&
              capsule.privacy === "Unlisted" &&
              capsule.unlistedToken && (
                <button
                  onClick={handleShareClick}
                  className={`${styles.shareButton} ${
                    copySuccess ? styles.copied : ""
                  }`}
                  title={
                    copySuccess ? "Copied to clipboard!" : "Copy share link"
                  }
                >
                  {copySuccess ? <FaCopy /> : <FaShare />}
                  <span>{copySuccess ? "Link Copied!" : "Share Link"}</span>
                </button>
              )}
          </div>
        </div>
      </div>
    </main>
  );
}
