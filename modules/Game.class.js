'use strict';

export class Game {

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.getInitialTable = () => JSON.parse(JSON.stringify(initialState));
    this.state = this.getInitialTable();
    this.status = 'idle';
    this.score = 0;
  }

  calculateRow(arr) {
    let filteredArr = arr.filter(item => item !== 0);

    for (let i = 0; i < filteredArr.length - 1; i++) {
      if (filteredArr[i] === filteredArr[i + 1]) {
        filteredArr[i] *= 2;
        this.score += filteredArr[i];
        filteredArr[i + 1] = 0;
      }
    }

    filteredArr = filteredArr.filter(el => el);

    filteredArr.push(...(new Array(4 - filteredArr.length).fill(0)));

    return filteredArr;
  }

  moveLeft() {
    for (let i = 0; i < this.state.length; i++) {
      this.state[i] = this.calculateRow(this.state[i]);
    }
  }

  moveRight() {
    for (let i = 0; i < this.state.length; i++) {
      this.state[i] = this.calculateRow(this.state[i].reverse()).reverse();
    }
  }

  moveUp() {
    for (let indexRow = 0; indexRow < this.state.length; indexRow++) {
      const column = this.state.map(row => row[indexRow]);
      const newColumn = this.calculateRow(column);

      newColumn.forEach((value, indexColumn) => {
        this.state[indexColumn][indexRow] = value;
      });
    }
  }

  moveDown() {
    for (let indexRow = 0; indexRow < this.state.length; indexRow++) {
      const column = this.state.map(row => row[indexRow]).reverse();
      const newColumn = this.calculateRow(column).reverse();

      newColumn.forEach((value, indexColumn) => {
        this.state[indexColumn][indexRow] = value;
      });
    }
  }


  getScore() {
    return this.score;
  }


  getState() {
    return this.state;
  }

  getStatus() {
    return this.status;
  }


  start() {
    this.spawnCell(0);
    this.spawnCell(0);
    this.status = 'playing';
  }


  restart() {
    this.state = this.getInitialTable();
    this.score = 0;
    this.start();
  }

  spawnCell(percentForFour = 0.1) {
    const arrOfVoidIndexes = this.getVoidCellIndexes();

    if (arrOfVoidIndexes.length === 0) {
      return;
    }

    const randomIndex
      = arrOfVoidIndexes[Math.floor(Math.random() * arrOfVoidIndexes.length)];

    if (Math.random() < percentForFour) {
      this.state[randomIndex[0]][randomIndex[1]] = 4;
    } else {
      this.state[randomIndex[0]][randomIndex[1]] = 2;
    }
  }

  getVoidCellIndexes() {
    const result = [];

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 0) {
          result.push([i, j]);
        }
      }
    }

    return result;
  }

  checkWin() {
    for (let i = 0; i < this.state.length; i++) {
      if (this.state[i].indexOf(2048) !== -1) {
        this.status = 'win';
      }
    }
  }

  checkLose() {
    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length - 1; j++) {
        const isRightEqual = this.state[j + 1][i] === this.state[j][i];
        const isLeftEqual = this.state[i][j + 1] === this.state[i][j];

        if (this.state[i][j] === 0 || this.state[i][j + 1] === 0) {
          return;
        } else if (isLeftEqual || isRightEqual) {
          return;
        }
      }
    }
    this.status = 'lose';
  }
}
