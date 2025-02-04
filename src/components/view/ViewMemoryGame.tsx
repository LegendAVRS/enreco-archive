import clsx from "clsx";
import _ from "lodash";
import { useEffect, useState } from "react";

const COLOR_MAP: { [key: number]: string } = {
    [-1]: "box-empty",
    0: "box-red",
    1: "box-green",
    2: "box-blue",
    3: "box-yellow",
};

const ViewMemoryGame = () => {
    const initBoardState = (boardSize: number) => {
        return Array.from({ length: boardSize }, () => -1);
    };
    const sideLength = 5;

    const [board, setBoard] = useState(initBoardState(sideLength * sideLength));
    const [difficulty, setDifficulty] = useState(2);
    const [chosenValue, setChosenValue] = useState(-1);

    const setRandomBoardState = (boardSize: number, difficulty: number) => {
        // Get "difficulty" number of random numbers between 0 and boardSize
        const randomPositions = _.sampleSize(_.range(0, boardSize), difficulty);
        // Get "difficulty" number of random numbers between 0 and 3
        const randomValues: number[] = [];
        for (let i = 0; i < difficulty; i++) {
            randomValues.push(Math.floor(Math.random() * 4));
        }

        console.log(randomPositions);
        console.log(randomValues);

        // Set the positions in the board to the random values
        setBoard((prevBoard) => {
            const newBoard = [...prevBoard];
            randomPositions.forEach((position, index) => {
                newBoard[position] = randomValues[index];
            });
            return newBoard;
        });
    };

    const handleBoardClick = (index: number) => {
        if (board[index] !== -1 && board[index] < 4) {
            return;
        }

        if (chosenValue !== -1 && chosenValue + 4 === board[index]) {
            setBoard((prevBoard) => {
                const newBoard = [...prevBoard];
                newBoard[index] = chosenValue;
                return newBoard;
            });
        }
    };

    useEffect(() => {
        setRandomBoardState(sideLength * sideLength, difficulty);
        setTimeout(() => {
            // add 4 to all none -1 values in the board
            setBoard((prevBoard) => {
                const newBoard = [...prevBoard];
                for (let i = 0; i < newBoard.length; i++) {
                    if (newBoard[i] !== -1) {
                        newBoard[i] += 4;
                    }
                }
                return newBoard;
            });
        }, 2000);
    }, [difficulty]);

    const displayedBoard = board.map((value, index) => {
        return (
            <div
                key={index}
                className={clsx(`${COLOR_MAP[value < 4 ? value : -1]}`, {
                    "cursor-pointer": value === -1 || value >= 4,
                })}
                onClick={() => handleBoardClick(index)}
            ></div>
        );
    });

    return (
        <div className="flex gap-4">
            <div className="grid grid-cols-5 grid-rows-5 h-fit w-fit">
                {displayedBoard}
            </div>
            <div className="flex flex-col">
                <div className="flex justify-center items-center gap-4">
                    <div
                        className={clsx("box-red", {
                            "box-selected border-red-300":
                                COLOR_MAP[chosenValue] === "box-red",
                        })}
                        onClick={() => setChosenValue(0)}
                    ></div>
                    <div
                        className={clsx("box-green", {
                            "box-selected border-green-300":
                                COLOR_MAP[chosenValue] === "box-green",
                        })}
                        onClick={() => setChosenValue(1)}
                    ></div>
                    <div
                        className={clsx("box-blue", {
                            "box-selected border-blue-300":
                                COLOR_MAP[chosenValue] === "box-blue",
                        })}
                        onClick={() => setChosenValue(2)}
                    ></div>
                    <div
                        className={clsx("box-yellow", {
                            "box-selected border-yellow-300":
                                COLOR_MAP[chosenValue] === "box-yellow",
                        })}
                        onClick={() => setChosenValue(3)}
                    ></div>
                </div>
                {/* reset board */}
                <button
                    onClick={() =>
                        setBoard(initBoardState(sideLength * sideLength))
                    }
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default ViewMemoryGame;
