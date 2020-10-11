import React, { useState } from 'react';

import ChooseLevel from 'components/ChooseLevel/ChooseLevel';
import Field from 'components/Field/Field';

import styles from './Main.module.scss';

export const Main: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState(0);

  const levels = [
    {
      title: '1',
      desc: '10x10 cells',
      onClick: () => setCurrentLevel(1),
    },
    {
      title: '2',
      desc: '20x40 cells',
      onClick: () => setCurrentLevel(2),
    },
    {
      title: '3',
      desc: '50x100 cells',
      onClick: () => setCurrentLevel(3),
    },
    {
      title: '4',
      desc: '50x500 cells',
      onClick: () => setCurrentLevel(4),
    },
  ];

  return (
    <div className={styles.main}>
      {currentLevel ? (
        <Field currentLevel={currentLevel} goBack={() => setCurrentLevel(0)} />
      ) : (
        <ChooseLevel levels={levels} />
      )}
    </div>
  );
};

export default Main;
