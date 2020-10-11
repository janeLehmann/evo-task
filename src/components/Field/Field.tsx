import React, { useState, useRef, useCallback, useEffect } from 'react';
import { OK, LOOSE, MAX_CELLS_COUNT_IN_LINE } from 'constants/index';
import { getRandomInt } from 'helpers/index';

import styles from './Field.module.scss';

import Cell from 'components/Cell/Cell';

interface CellType {
  title: string;
  id: string;
  x: number;
  y: number;
  realBombsCount: number;
  bombPossibility: number;
  cellClick: any;
}

interface CellWithGroupType {
  openCell: CellType;
  aroundGroup: CellType[];
}

interface FieldProps {
  currentLevel: number;
  goBack: any;
}

const Field: React.FC<FieldProps> = ({ currentLevel, goBack }) => {
  const wsRef = useRef<any>(null);
  const [cells, setCells] = useState<Array<Array<CellType>>>([]);
  const [restart, setRestart] = useState<boolean>(false);
  const hasOpenCellsWithZeros = useRef(false);
  const hasToOpenPossibilitiesCell = useRef<boolean>(false);
  const resolvedCells = useRef<any>({});
  const bombs = useRef<any>({});

  const sendMap = useCallback(() => {
    wsRef.current.send('map');
  }, []);

  /** Set webSocket connection */
  useEffect(() => {
    wsRef.current = new WebSocket('ws://hometask.eg1236.com/game1/');
    wsRef.current.onopen = () => {
      wsRef.current.send(`new ${currentLevel}`);
    };

    wsRef.current.onerror = () => {
      wsRef.current.close();
    };

    wsRef.current.onclose = () => {};

    wsRef.current.onmessage = (event) => {
      if (event.data) {
        if (event.data === 'new: OK') {
          sendMap();
        }

        if (event.data.includes('map')) {
          const messageWithCellsData = event.data.replace('map:', '').replace(/ /g, '');
          const rowCellsArray = messageWithCellsData
            .split(/\r?\n/)
            .filter((el) => el !== '')
            .map((item) => {
              return item.split('');
            });
          const cellsArray = rowCellsArray.map((line, lineI) => {
            return line.map((item, i) => {
              return {
                title: item,
                id: `cell-${lineI}-${i}`,
                x: i,
                y: lineI,
              };
            });
          });

          setCells(cellsArray);
        }

        if (
          event.data === OK &&
          (!hasOpenCellsWithZeros.current || hasToOpenPossibilitiesCell.current)
        ) {
          sendMap();
          hasToOpenPossibilitiesCell.current = false;
        }

        if (event.data.indexOf('You win') > -1) {
          debugger;
        }

        if (event.data === LOOSE) {
          reStartGame();
        }
      }
    };

    return () => {
      wsRef.current.close();
    };
  }, [sendMap, currentLevel]);

  /** Open single cell */
  const openNewCell = (cellX, cellY) => {
    wsRef.current.send(`open ${cellX} ${cellY}`);
  };

  /** Open multiple cells */
  const openMultipleCells = useCallback(
    (multipleCells) => {
      multipleCells.forEach((item) => {
        wsRef.current.send(`open ${item.x} ${item.y}`);
      });
      sendMap();
    },
    [sendMap],
  );

  /** Restart game */
  const reStartGame = () => {
    setCells([]);
    bombs.current = {};
    resolvedCells.current = {};
    hasOpenCellsWithZeros.current = false;
    setRestart(true);
  };

  useEffect(() => {
    if (restart) {
      wsRef.current.send(`new ${currentLevel}`);
    }
  }, [restart, currentLevel]);

  const updateCells = useCallback(() => {
    let cellsWithZero = false;

    cells.forEach((item) => {
      for (let i = 0; i < item.length; i++) {
        if (item[i].title === '0') {
          cellsWithZero = true;
          break;
        }
      }
    });
    const groupAroundOpenCell: CellWithGroupType[] = [];
    const groupToClick: CellType[] = [];
    const problemCells: {
      [name: string]: {
        item: CellType;
        groupAroundProblemCell: CellType[];
      };
    } = {};

    if (!hasOpenCellsWithZeros.current && !cellsWithZero) {
      const cell = {
        x: getRandomInt(MAX_CELLS_COUNT_IN_LINE[currentLevel - 1].x),
        y: getRandomInt(MAX_CELLS_COUNT_IN_LINE[currentLevel - 1].y),
      };
      openNewCell(cell.x, cell.y);
    } else {
      hasOpenCellsWithZeros.current = true;

      /** Set around group cell */
      for (let y = 0; y < cells.length; y++) {
        for (let i = 0; i < cells[y].length; i++) {
          if (
            !resolvedCells.current[cells[y][i].id] &&
            cells[y][i].title !== '0' &&
            cells[y][i].title !== '□'
          ) {
            let aroundCells: CellType[] = [];

            /** Find cells around open cell to push it into group array */
            if (cells[cells[y][i].y - 1]) {
              if (cells[cells[y][i].y - 1][cells[y][i].x]) {
                aroundCells.push(cells[cells[y][i].y - 1][cells[y][i].x]);
              }

              if (cells[cells[y][i].y - 1][cells[y][i].x - 1]) {
                aroundCells.push(cells[cells[y][i].y - 1][cells[y][i].x - 1]);
              }

              if (cells[cells[y][i].y - 1][cells[y][i].x + 1]) {
                aroundCells.push(cells[cells[y][i].y - 1][cells[y][i].x + 1]);
              }
            }

            if (cells[cells[y][i].y + 1]) {
              if (cells[cells[y][i].y + 1][cells[y][i].x]) {
                aroundCells.push(cells[cells[y][i].y + 1][cells[y][i].x]);
              }

              if (cells[cells[y][i].y + 1][cells[y][i].x - 1]) {
                aroundCells.push(cells[cells[y][i].y + 1][cells[y][i].x - 1]);
              }

              if (cells[cells[y][i].y + 1][cells[y][i].x + 1]) {
                aroundCells.push(cells[cells[y][i].y + 1][cells[y][i].x + 1]);
              }
            }

            if (cells[cells[y][i].y][cells[y][i].x + 1]) {
              aroundCells.push(cells[cells[y][i].y][cells[y][i].x + 1]);
            }

            if (cells[cells[y][i].y][cells[y][i].x - 1]) {
              aroundCells.push(cells[cells[y][i].y][cells[y][i].x - 1]);
            }

            aroundCells = aroundCells.filter((item) => item.title === '□');

            /** Find closed cells in around group */
            if (aroundCells.length > 0) {
              groupAroundOpenCell.push({ openCell: cells[y][i], aroundGroup: aroundCells });
            }
          }
        }
      }

      /** Set bombs, add cells with bombs to resolvedCells  */
      for (let i = 0; i < groupAroundOpenCell.length; i++) {
        if (+groupAroundOpenCell[i].openCell.title === groupAroundOpenCell[i].aroundGroup.length) {
          groupAroundOpenCell[i].aroundGroup.forEach((aroundGroupItem) => {
            bombs.current[aroundGroupItem.id] = aroundGroupItem.id;
            resolvedCells.current[aroundGroupItem.id] = aroundGroupItem.id;
          });

          resolvedCells.current[groupAroundOpenCell[i].openCell.id] =
            groupAroundOpenCell[i].openCell.id;
        }
      }

      /** Set group to click */
      for (let i = 0; i < groupAroundOpenCell.length; i++) {
        let coincidenceCount = 0;

        if (
          groupAroundOpenCell[i].openCell.title !==
          groupAroundOpenCell[i].aroundGroup.length.toString()
        ) {
          groupAroundOpenCell[i].aroundGroup.forEach((aroundGroupItem) => {
            if (bombs.current[aroundGroupItem.id]) {
              coincidenceCount++;
            }
          });
        }

        /**
         * if bombs count in groupAroundOpenCell is equal to open cell title
         * and in the groupAroundOpenCell there are closed cells, add them to
         * array to open
         * */
        if (coincidenceCount === Number(groupAroundOpenCell[i].openCell.title)) {
          groupAroundOpenCell[i].aroundGroup.forEach((aroundGroupItem) => {
            if (!bombs.current[aroundGroupItem.id]) {
              if (!groupToClick.includes(aroundGroupItem)) {
                resolvedCells.current[groupAroundOpenCell[i].openCell.id] =
                  groupAroundOpenCell[i].openCell.id;
                groupToClick.push(aroundGroupItem);
              }
            }
          });
        }
      }

      /** Open multiple cells from group to click */
      if (groupToClick.length) {
        openMultipleCells(groupToClick);
      }

      /** If there no cells to open, find problem cells to count possibility of bomb */
      if (groupToClick.length === 0) {
        for (let i = 0; i < groupAroundOpenCell.length; i++) {
          if (groupAroundOpenCell[i].aroundGroup.length) {
            let problemCellsCoincidenceCount = 0;

            if (
              groupAroundOpenCell[i].openCell.title !==
              groupAroundOpenCell[i].aroundGroup.length.toString()
            ) {
              groupAroundOpenCell[i].aroundGroup.forEach((aroundGroupItem) => {
                if (Object.prototype.hasOwnProperty.call(bombs.current, aroundGroupItem.id)) {
                  problemCellsCoincidenceCount++;
                }
              });
            }

            if (
              Number(groupAroundOpenCell[i].openCell.title) > problemCellsCoincidenceCount &&
              Number(groupAroundOpenCell[i].openCell.title) <
                groupAroundOpenCell[i].aroundGroup.length
            ) {
              problemCells[groupAroundOpenCell[i].openCell.id] = {
                item: {
                  ...groupAroundOpenCell[i].openCell,
                  realBombsCount:
                    Number(groupAroundOpenCell[i].openCell.title) - problemCellsCoincidenceCount,
                },
                groupAroundProblemCell: groupAroundOpenCell[i].aroundGroup
                  .filter(
                    (filteredAroundGroupCell) =>
                      !Object.prototype.hasOwnProperty.call(
                        bombs.current,
                        filteredAroundGroupCell.id,
                      ),
                  )
                  .map((aroundGroupCell) => {
                    return {
                      ...aroundGroupCell,
                      bombPossibility:
                        (Number(groupAroundOpenCell[i].openCell.title) -
                          problemCellsCoincidenceCount) /
                        groupAroundOpenCell[i].aroundGroup.filter(
                          (aroundGroupCell) =>
                            !Object.prototype.hasOwnProperty.call(
                              bombs.current,
                              aroundGroupCell.id,
                            ),
                        ).length,
                    };
                  }),
              };
            } else {
              delete problemCells[groupAroundOpenCell[i].openCell.id];
            }

            if (groupAroundOpenCell[i].aroundGroup.length === 0) {
              delete problemCells[groupAroundOpenCell[i].openCell.id];
            }
          }
        }
      }

      /** Sort problem cells by bomb possibility range and click the most safe cell  */
      if (Object.keys(problemCells).length) {
        const closedProblemCells: CellType[] = [];
        const entries = Object.values(problemCells);

        entries.forEach((item) => {
          item.groupAroundProblemCell.forEach((subItem) => {
            closedProblemCells.push(subItem);
          });
        });

        for (let i = 0; i < 20; i++) {
          const flagClosedProblemCells: { [name: string]: CellType | boolean } = {};

          closedProblemCells.forEach((item) => {
            if (flagClosedProblemCells[item.id]) {
              return;
            }
            const filtered = closedProblemCells.filter((subItem) => subItem.id === item.id);
            if (!filtered.length) {
              return;
            }

            flagClosedProblemCells[item.id] = true;
            let realPossibility = 1;

            filtered.forEach((filterItem) => {
              realPossibility *= 1 - filterItem.bombPossibility;
            });

            realPossibility = 1 - realPossibility;

            filtered.forEach((filterItem) => {
              filterItem.bombPossibility = realPossibility;
            });
          });

          entries.forEach((item) => {
            let sum = 0;

            item.groupAroundProblemCell.forEach((subItem) => {
              sum += subItem.bombPossibility;
            });

            const multiplier = item.item.realBombsCount / sum;

            item.groupAroundProblemCell.forEach((subItem) => {
              subItem.bombPossibility *= multiplier;
            });
          });
        }

        closedProblemCells.sort((a, b) => a.bombPossibility - b.bombPossibility);

        if (closedProblemCells[0]) {
          hasToOpenPossibilitiesCell.current = true;
          openNewCell(closedProblemCells[0].x, closedProblemCells[0].y);
        }
      }
    }
  }, [cells, openMultipleCells, currentLevel]);

  useEffect(() => {
    if (cells.length) {
      setRestart(false);
      updateCells();
    }
  }, [cells, updateCells]);

  return (
    <div className={styles.field} data-testid="board">
      <button
        className={styles.fieldGoBackButton}
        type="button"
        onClick={() => {
          // wsRef.current.close();
          goBack();
        }}
      >
        Back to start
      </button>

      <div className={styles.fieldInner}>
        {cells.map((line, i) => (
          <div className={styles.fieldLine} key={i * 10}>
            {line &&
              line.length &&
              line.map((cell) => (
                <Cell
                  cellClick={() => openNewCell(cell.x, cell.y)}
                  x={cell.x}
                  y={cell.y}
                  title={cell.title}
                  key={cell.id}
                  isBomb={Boolean(bombs.current[`cell-${cell.y}-${cell.x}`])}
                />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Field;
