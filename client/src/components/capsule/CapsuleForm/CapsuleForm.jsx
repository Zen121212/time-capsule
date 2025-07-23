import { useState } from "react";
import Modal from "../../common/Modal/Modal";
import Button from "../../common/Button/Button";
import ValidationPopup from "../../common/ValidationPopup/ValidationPopup";
import { getCurrentPosition } from "../../../utils/geolocation";
import styles from "./Capusle.module.css";
import { FaImage, FaMicrophone, FaStickyNote } from "react-icons/fa";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const colors = ["#5A4FFF", "#F7A72B", "#47CF73", "#DD2D6C", "#AC58FF"];
const emojis = ["🌟", "💕", "🎯", "🎓", "🌈", "🔥"];

export default function CreateCapsuleModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedEmoji, setSelectedEmoji] = useState(emojis[0]);
  const [revealDate, setRevealDate] = useState("");
  const [privacy, setPrivacy] = useState("Private");
  const [surpriseMode, setSurpriseMode] = useState(false);

  const [validationErrors, setValidationErrors] = useState([]);
  const [showValidationPopup, setShowValidationPopup] = useState(false);

  const validateForm = () => {
    const errors = [];
    if (!title.trim()) {
      errors.push("Capsule title is required");
    }

    if (!message.trim()) {
      errors.push("Message to future self is required");
    }

    if (!revealDate) {
      errors.push("Reveal date is required");
    } else {
      const selectedDate = new Date(revealDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate <= today) {
        errors.push("Reveal date must be in the future");
      }
    }

    return errors;
  };

  const handleCreate = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidationPopup(true);
      return;
    }

    const data = {
      title,
      message,
      color: selectedColor,
      emoji: selectedEmoji,
      revealDate,
      privacy,
      surpriseMode,
    };
    console.log("Attempting to get GPS coordinates...");
    try {
      const position = await getCurrentPosition();
      data.latitude = position.latitude;
      data.longitude = position.longitude;
      console.log("gps coordinates obtained successfully:", {
        latitude: position.latitude,
        longitude: position.longitude,
        accuracy: position.accuracy,
      });
    } catch {
      console.log("gps coordinates failed");
    }

    onSubmit(data);
    console.log(data);
    onClose();
  };

  const closeValidationPopup = () => setShowValidationPopup(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalContainer}>
        <h2 className={styles.title}>Create Time Capsule</h2>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Capsule Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your capsule a memorable title..."
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroupSpec}>
          <label className={styles.label}>Message to Future Self</label>
          <div className={styles.markdownContainer}>
            <MDEditor
              value={message}
              onChange={setMessage}
              placeholder="Write a message to your future self... Supports **markdown** formatting!"
              data-color-mode="light"
              height={200}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <p className={styles.sectionLabel}>Color</p>
            <div className={styles.colorRow}>
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`${styles.colorCircle} ${
                    selectedColor === c ? styles.active : ""
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <p className={styles.sectionLabel}>Emoji</p>
            <div className={styles.emojiRow}>
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`${styles.emojiButton} ${
                    selectedEmoji === emoji ? styles.active : ""
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Reveal Date</label>
          <input
            type="date"
            required
            value={revealDate}
            onChange={(e) => setRevealDate(e.target.value)}
            className={styles.input}
          />
        </div>

        <p className={styles.sectionLabel}>Privacy</p>
        <div className={styles.privacyOptions}>
          {["Private", "Public", "Unlisted"].map((option) => (
            <label key={option} className={styles.radioLabel}>
              <input
                type="radio"
                name="privacy"
                value={option}
                checked={privacy === option}
                onChange={() => setPrivacy(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>

        <label className={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={surpriseMode}
            onChange={(e) => setSurpriseMode(e.target.checked)}
          />
          Surprise Mode — hide content until reveal day
        </label>

        <div className={styles.actions}>
          <Button label="Cancel" onClick={onClose} variant="secondary" />
          <Button label="Create Capsule" onClick={handleCreate} />
        </div>
      </div>
      <ValidationPopup
        isOpen={showValidationPopup}
        onClose={closeValidationPopup}
        messages={validationErrors}
      />
    </Modal>
  );
}
