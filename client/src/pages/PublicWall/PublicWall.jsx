import { useState, useEffect } from "react";
import CapsuleCard from "../../components/capsule/CapsuleCard/CapsuleCard";
import { timeCapsuleService } from "../../services/timeCapsuleService.js";
import { getDaysLeft } from "../../utils/dateConverter";
import styles from "./PublicWall.module.css";

const EMOJI_MOODS = {
  "🌟": "Hopeful",
  "💕": "Love",
  "🎯": "Ambitious",
  "🎓": "Achievement",
  "🌈": "Optimistic",
  "🔥": "Passionate",
};

const MOOD_OPTIONS = Object.values(EMOJI_MOODS);

const PublicWall = () => {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    country: "",
    mood: "",
    timeRange: "all",
  });

  useEffect(() => {
    fetchPublicCapsules();
  }, []);

  const fetchPublicCapsules = async () => {
    setLoading(true);
    setError("");
    const result = await timeCapsuleService.getPublicTimeCapsules();

    if (result.success) {
      const transformedCapsules = result.data.map((capsule) => ({
        id: capsule.id,
        title: capsule.title,
        message: capsule.message,
        location: capsule.location,
        revealDate: new Date(capsule.reveal_date),
        createdAt: new Date(capsule.created_at),
        isPublic: capsule.is_public,
        color: capsule.color,
        emoji: capsule.emoji,
        privacy:
          capsule.privacy?.charAt(0).toUpperCase() +
            capsule.privacy?.slice(1) || "Public",
        user: capsule.user || { name: "Anonymous" },
      }));
      setCapsules(transformedCapsules);
    } else {
      setError(result.message);
    }

    setLoading(false);
  };
  const availableCountries = capsules
    .map((capsule) => {
      const parts = capsule.location?.split(", ");
      return parts && parts.length > 1 ? parts[parts.length - 1] : null;
    })
    .filter((country) => country && country !== "Unknown")
    .filter((country, index, self) => self.indexOf(country) === index)
    .sort();
  const revealedPublicCapsules = capsules.filter((capsule) => {
    const daysLeft = getDaysLeft(capsule.revealDate);
    const isRevealed = daysLeft !== null && daysLeft <= 0;
    if (!isRevealed) return false;
    if (capsule.privacy !== "Public") return false;

    return true;
  });

  const filteredCapsules = revealedPublicCapsules.filter((capsule) => {
    if (filters.country) {
      const capsuleCountry = capsule.location?.split(", ").pop();
      if (capsuleCountry !== filters.country) return false;
    }
    if (filters.mood) {
      const capsuleMood = EMOJI_MOODS[capsule.emoji];
      if (capsuleMood !== filters.mood) return false;
    }
    if (filters.timeRange !== "all" && capsule.createdAt) {
      const now = new Date();
      const timeDiff = now - capsule.createdAt;
      const daysDiff = timeDiff / (1000 * 3600 * 24);

      switch (filters.timeRange) {
        case "today":
          if (daysDiff > 1) return false;
          break;
        case "week":
          if (daysDiff > 7) return false;
          break;
        case "month":
          if (daysDiff > 30) return false;
          break;
        case "year":
          if (daysDiff > 365) return false;
          break;
        default:
          break;
      }
    }

    return true;
  });

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  return (
    <main>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Public Time Capsules</h1>
        </div>
        {!loading && capsules.length > 0 && (
          <div className={styles.filterPanel}>
            <div className={styles.filterHeader}>
              <h3 className={styles.filterTitle}>Filters</h3>
            </div>
            <div className={styles.filterRow}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Country</label>
                <div className={styles.selectWrapper}>
                  <select
                    className={styles.filterInput}
                    value={filters.country}
                    onChange={(e) =>
                      handleFilterChange("country", e.target.value)
                    }
                  >
                    <option value="">All Countries</option>
                    {availableCountries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Mood</label>
                <div className={styles.selectWrapper}>
                  <select
                    className={styles.filterInput}
                    value={filters.mood}
                    onChange={(e) => handleFilterChange("mood", e.target.value)}
                  >
                    <option value="">All Moods</option>
                    {MOOD_OPTIONS.map((mood) => (
                      <option key={mood} value={mood}>
                        {mood}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Time Range</label>
                <div className={styles.selectWrapper}>
                  <select
                    className={styles.filterInput}
                    value={filters.timeRange}
                    onChange={(e) =>
                      handleFilterChange("timeRange", e.target.value)
                    }
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
        {loading && (
          <div className={styles.loading}>Loading public time capsules...</div>
        )}
        {error && <div className={styles.error}>{error}</div>}
        {!loading && !error && capsules.length === 0 && (
          <div className={styles.empty}>No public capsules found.</div>
        )}
        {!loading &&
          !error &&
          capsules.length > 0 &&
          revealedPublicCapsules.length === 0 && (
            <div className={styles.empty}>
              No revealed public capsules available yet. Check back later!
            </div>
          )}
        {!loading &&
          !error &&
          revealedPublicCapsules.length > 0 &&
          filteredCapsules.length === 0 && (
            <div className={styles.empty}>
              No capsules match your current filters. Try adjusting your search
              criteria.
            </div>
          )}
        <div className={styles.capsuleGrid}>
          {!loading &&
            filteredCapsules.map((capsule) => (
              <CapsuleCard
                key={capsule.id}
                capsule={capsule}
                onEdit={null}
                onDelete={null}
              />
            ))}
        </div>
      </div>
    </main>
  );
};

export default PublicWall;
