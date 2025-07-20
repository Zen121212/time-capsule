import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDaysLeft } from "../../utils/dateConverter";
import { timeCapsuleService } from "../../services/timeCapsuleService.js";
import { authService } from "../../services/authService.js";
import Layout from "../../components/layout/layout";
import Button from "../../components/common/Button/Button";
import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaLock, FaGlobe, FaLink, FaShare, FaCopy } from "react-icons/fa";

import styles from "./CapsuleDetail.module.css";

export default function CapsuleDetail() {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const [capsule, setCapsule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const isUnlistedAccess = !!token;

  useEffect(() => {
    fetchCapsuleDetail();
  }, [id, token]);

  const fetchCapsuleDetail = async () => {
    // For token access, we don't require authentication
    if (!isUnlistedAccess && !authService.isAuthenticated()) {
      navigate('/');
      return;
    }

    setLoading(true);
    setError('');

    // Use different service methods based on access type
    const result = isUnlistedAccess 
      ? await timeCapsuleService.getTimeCapsuleByToken(token)
      : await timeCapsuleService.getTimeCapsule(id);

    if (result.success) {
      // Transform backend data to frontend format
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
        ipAddress: result.data.ip_address,
        createdAt: new Date(result.data.created_at),
        user: result.data.user || null,
        unlistedToken: result.data.unlisted_token || null
      };
      setCapsule(transformedCapsule);
    } else {
      console.error('Failed to fetch time capsule:', result.message);
      setError(result.message || 'Failed to load time capsule');
    }

    setLoading(false);
  };

  if (loading) return (
    <Layout>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        Loading time capsule...
      </div>
    </Layout>
  );

  if (error) return (
    <Layout>
      <div style={{
        background: '#f8d7da',
        color: '#721c24',
        padding: '1rem',
        borderRadius: '4px',
        marginBottom: '1rem'
      }}>
        {error}
      </div>
      {!isUnlistedAccess && (
        <Button 
          label="Go Back" 
          variant="secondary" 
          iconLeft={<FaArrowLeft />}
          onClick={() => navigate(-1)}
        />
      )}
    </Layout>
  );

  if (!capsule) return (
    <Layout>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        Time capsule not found.
      </div>
      {!isUnlistedAccess && (
        <Button 
          label="Go Back" 
          variant="secondary" 
          iconLeft={<FaArrowLeft />}
          onClick={() => navigate(-1)}
        />
      )}
    </Layout>
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
    <Layout>
      <div className={styles.container}>
        {/* Header with back button - only show for authenticated users */}
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

        {/* Main content */}
        <div className={styles.content}>
          {/* Hero section with emoji and color */}
          <div className={styles.hero}>
            <div 
              className={styles.emojiCircle}
              style={{ backgroundColor: capsule.color || '#eee' }}
            >
              {capsule.emoji}
            </div>
            <h1 className={styles.title}>{capsule.title}</h1>
            <div className={styles.privacyBadge}>
              {PrivacyIcon && <PrivacyIcon />}
              <span>{capsule.privacy}</span>
            </div>
            {/* Share button for unlisted capsules - only show for authenticated users */}
            {!isUnlistedAccess && capsule.privacy === "Unlisted" && capsule.unlistedToken && (
              <button
                onClick={handleShareClick}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  background: copySuccess ? "#10b981" : "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  marginTop: "1rem"
                }}
                title={copySuccess ? "Copied to clipboard!" : "Copy share link"}
              >
                {copySuccess ? <FaCopy /> : <FaShare />}
                <span>{copySuccess ? "Link Copied!" : "Share Link"}</span>
              </button>
            )}
          </div>

          {/* Time info */}
          <div className={styles.timeInfo}>
            <FaClock />
            <span>
              {daysLeft !== null && (
                <>
                  {daysLeft > 0
                    ? `Reveals in ${daysLeft} day(s)`
                    : daysLeft === 0
                    ? "Today is the reveal day!"
                    : "Revealed"}
                </>
              )}
            </span>
            <small>({capsule.revealDate.toLocaleDateString()})</small>
          </div>

          {/* Message */}
          <div className={styles.messageSection}>
            <h3>Message</h3>
            <div className={styles.message}>
              {capsule.message.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>

          {/* Metadata */}
          <div className={styles.metadata}>
            <div className={styles.metaItem}>
              <FaMapMarkerAlt />
              <div>
                <strong>Location</strong>
                <span>{capsule.location || 'Unknown'}</span>
              </div>
            </div>
            
            {capsule.user && (
              <div className={styles.metaItem}>
                <strong>Created by</strong>
                <span>{capsule.user.name}</span>
              </div>
            )}
            
            <div className={styles.metaItem}>
              <strong>Created</strong>
              <span>{capsule.createdAt.toLocaleDateString()}</span>
            </div>
            
            {capsule.ipAddress && (
              <div className={styles.metaItem}>
                <strong>IP Address</strong>
                <span>{capsule.ipAddress}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
