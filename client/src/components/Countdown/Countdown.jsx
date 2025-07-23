import { useState, useEffect } from 'react';
import styles from './Countdown.module.css';

const Countdown = ({ revealDate, isRevealed = false }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (isRevealed) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const reveal = new Date(revealDate).getTime();
      const difference = reveal - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [revealDate, isRevealed]);

  if (isRevealed) {
    return <div className={styles.revealed}>Revealed</div>;
  }

  const { days, hours, minutes, seconds } = timeLeft;

  if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
    return <div className={styles.ready}>🎉 Ready to Open!</div>;
  }

  return (
    <div className={styles.countdown}>
      <div className={styles.timeUnit}>
        <span className={styles.number}>{days}</span>
        <span className={styles.label}>days</span>
      </div>
      <div className={styles.separator}>:</div>
      <div className={styles.timeUnit}>
        <span className={styles.number}>{hours.toString().padStart(2, '0')}</span>
        <span className={styles.label}>hours</span>
      </div>
      <div className={styles.separator}>:</div>
      <div className={styles.timeUnit}>
        <span className={styles.number}>{minutes.toString().padStart(2, '0')}</span>
        <span className={styles.label}>mins</span>
      </div>
      <div className={styles.separator}>:</div>
      <div className={styles.timeUnit}>
        <span className={styles.number}>{seconds.toString().padStart(2, '0')}</span>
        <span className={styles.label}>secs</span>
      </div>
    </div>
  );
};

export default Countdown;
