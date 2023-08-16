const prompt = require('prompt-sync')({ sigint: true });

class Field {
  constructor(fieldArray) {
    this.field = fieldArray;
    this.currentPosition = { row: 0, col: 0 };
  }

  static generateField(height, width, holePercentage) {
    const field = new Array(height).fill(null).map(() => new Array(width).fill('░'));

    const totalTiles = height * width;
    const hatPosition = Math.floor(Math.random() * totalTiles);

    let holesCount = Math.floor(totalTiles * holePercentage);
    while (holesCount > 0) {
      const row = Math.floor(Math.random() * height);
      const col = Math.floor(Math.random() * width);

      if (field[row][col] !== 'O' && (row !== 0 || col !== 0)) {
        field[row][col] = 'O';
        holesCount--;
      }
    }

    const hatRow = Math.floor(hatPosition / width);
    const hatCol = hatPosition % width;
    field[hatRow][hatCol] = '^';

    return field;
  }

  print() {
    process.stdout.write('\x1Bc'); // Clear the console

    for (let i = 0; i < this.field.length; i++) {
      let row = '';
      for (let j = 0; j < this.field[i].length; j++) {
        if (i === this.currentPosition.row && j === this.currentPosition.col) {
          row += '*';
        } else {
          row += this.field[i][j];
        }
      }
      console.log(row);
    }
  }

  move(direction) {
    switch (direction) {
      case 'w':
        this.currentPosition.row -= 1;
        break;
      case 's':
        this.currentPosition.row += 1;
        break;
      case 'a':
        this.currentPosition.col -= 1;
        break;
      case 'd':
        this.currentPosition.col += 1;
        break;
      default:
        console.log('Invalid direction');
        return;
    }
  }

  isInBounds() {
    const { row, col } = this.currentPosition;
    return row >= 0 && row < this.field.length && col >= 0 && col < this.field[0].length;
  }

  isHole() {
    const { row, col } = this.currentPosition;
    return this.field[row][col] === 'O';
  }

  isHat() {
    const { row, col } = this.currentPosition;
    return this.field[row][col] === '^';
  }

  playGame() {
    let playing = true;
    while (playing) {
      this.print();
      const direction = prompt('Which direction do you want to move? (w/a/s/d): ');

      if (direction === 'w' || direction === 'a' || direction === 's' || direction === 'd') {
        this.move(direction);

        if (!this.isInBounds()) {
          console.log('Oops! You moved outside the field. Game over!');
          playing = false;
        } else if (this.isHole()) {
          console.log('Oops! You fell into a hole. Game over!');
          playing = false;
        } else if (this.isHat()) {
          console.log('Congratulations! You found your hat!');
          playing = false;
        }
      } else {
        console.log('Invalid direction. Please use w, a, s, or d.');
      }
    }
  }
}

// Generate a 10x10 field with a 20% hole percentage
const height = 10;
const width = 10;
const holePercentage = 0.2;

// Create a new Field instance
const randomField = Field.generateField(height, width, holePercentage);
console.log(randomField);

// Start the game
const myField = new Field(randomField);
myField.playGame();


 

 