import { useState } from "react";
import Modal from "../../common/Modal/Modal";
import Button from "../../common/Button/Button";
import styles from "./Capusle.module.css";
import { FaImage, FaMicrophone, FaStickyNote } from "react-icons/fa";

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

  const handleCreate = () => {
    if (!revealDate) {
      alert("Reveal date is required!");
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
    onSubmit(data);
    console.log(data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalContainer}>
        <h2 className={styles.title}>Create Time Capsule</h2>

        <label className={styles.label}>Capsule Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your capsule a memorable title..."
          className={styles.input}
        />

        <label className={styles.label}>Message to Future Self</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a message to your future self..."
          className={styles.textarea}
        />

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

        <div className={styles.attachments}>
          <p className={styles.sectionLabel}>Attachments</p>
          <div className={styles.attachmentRow}>
            <button className={styles.attachmentBtn}>
              <FaImage /> Add Image
            </button>
            <button className={styles.attachmentBtn}>
              <FaMicrophone /> Record Audio
            </button>
            <button className={styles.attachmentBtn}>
              <FaStickyNote /> Add Note
            </button>
          </div>
        </div>

        <label className={styles.label}>Reveal Date</label>
        <input
          type="date"
          required
          value={revealDate}
          onChange={(e) => setRevealDate(e.target.value)}
          className={styles.input}
        />

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
    </Modal>
  );
}
