import React from 'react';
import cx from 'classnames';
import styles from './Cell.module.scss';

// Icons
import { ReactComponent as IconClosed } from 'static/assets/closed-bg.svg';
import { ReactComponent as IconOpen } from 'static/assets/open-bg.svg';
import { ReactComponent as IconPossibleBomb } from 'static/assets/flag.svg';

interface CellProps {
  cellClick: any;
  title: string;
  isBomb?: boolean;
  x: number;
  y: number;
}

const Cell: React.FC<CellProps> = ({ cellClick, title, isBomb }) => {
  return (
    <button
      className={cx([styles.cell], {
        [styles.cellBlue]: title === '1',
        [styles.cellGreen]: title === '2',
        [styles.cellRed]: title === '3',
        [styles.cellDarkRed]: title === '4',
        [styles.cellBurgundy]: title === '5',
      })}
      type="button"
      onClick={cellClick}
      data-testid="cell"
    >
      {title === '□' && !isBomb ? (
        <IconClosed className={styles.cellBg} />
      ) : (
        <>
          {isBomb ? (
            <IconPossibleBomb className={styles.cellBg} />
          ) : (
            <>
              {title === '0' ? (
                <IconOpen className={styles.cellBg} />
              ) : (
                <>
                  <IconOpen className={styles.cellBg} />
                  <span className={styles.cellTitle}>{title}</span>
                </>
              )}
            </>
          )}
        </>
      )}
    </button>
  );
};

export default Cell;
