import React from 'react';
import styles from './ChooseLevel.module.scss';

interface Level {
  title: string;
  desc: string;
  onClick: any;
}

interface ChooseLevelProps {
  levels: Level[];
}

const ChooseLevel: React.FC<ChooseLevelProps> = ({ levels }) => {
  return (
    <div className={styles.chooseLevel}>
      <h1 className={styles.chooseLevelTitle}>Choose the level</h1>
      <div className={styles.chooseLevelDesc}>
        After choosing the level the game will start automatically
      </div>

      <div className={styles.chooseLevelList}>
        {levels.map((item) => (
          <div className={styles.chooseLevelItem} key={item.title} data-testid="choose-level-item">
            <button className={styles.chooseLevelItemButton} type="button" onClick={item.onClick}>
              Level {item.title}
            </button>
            <div className={styles.chooseLevelItemText}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChooseLevel;
