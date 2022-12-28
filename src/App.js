import { useState, useEffect } from 'react';

const width = 8;
const candyColors = [
  'blue',
  'green',
  'orange',
  'purple',
  'red',
  'yellow'
];

function App() {
  const [currentColorArrangement, setCurrentColorArrangement] = useState([]);


  const [squareBeingDragged, setSquareBeingDragged] = useState(null);
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);

  const checkForColumnOfThree = () => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const decidedColor = currentColorArrangement[i];

      if (columnOfThree.every(square => currentColorArrangement[square] === decidedColor)) {
        columnOfThree.forEach(square => currentColorArrangement[square] = '');
        return true;
      }
    }
  }

  const checkForColumnOfFour = () => {
    for (let i = 0; i <= 39; i++) {
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
      const decidedColor = currentColorArrangement[i];

      if (columnOfFour.every(square => currentColorArrangement[square] === decidedColor)) {
        columnOfFour.forEach(square => currentColorArrangement[square] = '');
        return true;
      }
    }
  }

  const checkForRowOfThree = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = currentColorArrangement[i];
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64];

      if (notValid.includes(i)) continue;

      if (rowOfThree.every(square => currentColorArrangement[square] === decidedColor)) {
        rowOfThree.forEach(square => currentColorArrangement[square] = '');
        return true;
      }
    }
  }

  const checkForRowOfFour = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2, i + 3];
      const decidedColor = currentColorArrangement[i];
      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64];

      if (notValid.includes(i)) continue;

      if (rowOfThree.every(square => currentColorArrangement[square] === decidedColor)) {
        rowOfThree.forEach(square => currentColorArrangement[square] = '');
        return true;
      }
    }
  }

  const moveSquareBelow = () => {

    const firstRow = [0, 1, 2, 3, 4, 5, 6, 7,]
    for (let i = 0; i <= 55; i++) {
      const isFirstRow = firstRow.includes(i)

      if (isFirstRow && currentColorArrangement[i] === '') {
        const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)];
        currentColorArrangement[i] = randomColor;
      }


      if (currentColorArrangement[i + width] === '') {
        currentColorArrangement[i + width] = currentColorArrangement[i];
        currentColorArrangement[i] = '';
      }
    }
  }

  const dragStart = (e) => {

    setSquareBeingDragged(e.target);
    console.log('drag start', squareBeingDragged);


  }

  const dragDrop = (e) => {

    setSquareBeingReplaced(e.target);
    console.log('drag drop', squareBeingReplaced);
  }

  const dragEnd = (e) => {
    console.log('drag End', squareBeingReplaced);

    const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'));
    const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'));

    currentColorArrangement[squareBeingReplacedId] = squareBeingDragged.style.backgroundColor;
    currentColorArrangement[squareBeingDraggedId] = squareBeingReplaced.style.backgroundColor;

    console.log('squareBeingDraggedId', squareBeingDraggedId);
    console.log('squareBeingReplacedId', squareBeingReplacedId);

    const validMoves = [
      squareBeingDraggedId - 1,
      squareBeingDraggedId - width,
      squareBeingDraggedId + 1,
      squareBeingDraggedId + width
    ];

    const validMove = validMoves.includes(squareBeingReplacedId);

    const isAColumnOfFour = checkForColumnOfFour();
    const isAColumnOfThree = checkForColumnOfThree();
    const isARowOfFour = checkForRowOfFour();
    const isARowOfThree = checkForRowOfThree();

    if (squareBeingReplaced &&
      validMove &&
      (isAColumnOfFour ||
        isAColumnOfThree ||
        isARowOfFour ||
        isARowOfThree)) {
      setSquareBeingDragged(null)
      setSquareBeingReplaced(null)
    } else {
        currentColorArrangement[squareBeingReplacedId] = squareBeingReplaced.style.backgroundColor;
        currentColorArrangement[squareBeingDraggedId] = squareBeingDragged.style.backgroundColor;

    }

  }

  const createBoard = () => {
    const randomColorArrangement = [];
    for (let i = 0; i < width * width; i++) {
      const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)];
      randomColorArrangement.push(randomColor);
    }

    setCurrentColorArrangement(randomColorArrangement);
  }

  useEffect(() => {
    createBoard()
  }, [width])

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour();
      checkForColumnOfThree();
      checkForRowOfFour();
      checkForRowOfThree();
      moveSquareBelow();
      setCurrentColorArrangement([...currentColorArrangement]);
    }, 2000)
    return () => clearInterval(timer)

  }, [checkForColumnOfThree, checkForColumnOfFour, checkForRowOfThree, checkForRowOfFour, currentColorArrangement, moveSquareBelow])

  return (
    <div className="app">
      <div className="game">
        {currentColorArrangement.map((candyColor, index) => (
          <img
            key={index}
            style={{ backgroundColor: candyColor }}
            alt={candyColor}
            data-id={index}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
