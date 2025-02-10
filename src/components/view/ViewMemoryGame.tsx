import { Button } from "@/components/ui/button";
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

const SHORTCUT_KEYS = {
    "1": 0,
    "2": 1,
    "3": 2,
    "4": 3,
};

const ViewMemoryGame = () => {
    const initBoardState = (boardSize: number) => {
        return Array.from({ length: boardSize }, () => -1);
    };
    const sideLength = 5;

    const [board, setBoard] = useState(initBoardState(sideLength * sideLength));
    const [difficulty, setDifficulty] = useState(2);
    const [chosenValue, setChosenValue] = useState(0);
    const [score, setScore] = useState(0);
    // const [timeLeft, setTimeLeft] = useState(60);
    const [allowClick, setAllowClick] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const getNumberOfUnsolvedSlots = (board: number[]) => {
        return board.filter((value) => value >= 4).length;
    };

    const calculateDifficulty = (score: number) => {
        return Math.min(Math.floor(score / 5) + 2, sideLength * sideLength);
    };

    const handleBoardClick = (index: number) => {
        if (board[index] !== -1 && board[index] < 4) {
            return;
        }

        if (!allowClick) {
            return;
        }

        let newScore = score;

        if (chosenValue !== -1 && chosenValue + 4 === board[index]) {
            if (getNumberOfUnsolvedSlots(board) === 1) {
                newScore += difficulty;
                setScore(newScore);
                setDifficulty(calculateDifficulty(newScore));
            }
            setBoard((prevBoard) => {
                const newBoard = [...prevBoard];
                newBoard[index] = chosenValue;
                return newBoard;
            });
        } else {
            newScore = Math.max(0, newScore - difficulty);
            setScore(newScore);
            setDifficulty(calculateDifficulty(newScore));
        }
    };

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            const value =
                SHORTCUT_KEYS[event.key as keyof typeof SHORTCUT_KEYS];
            if (value !== undefined) {
                setChosenValue(value);
            }
        };

        window.addEventListener("keydown", handleKeyPress);

        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, []);

    useEffect(() => {
        if (!isPlaying) {
            setBoard(initBoardState(sideLength * sideLength));
            return;
        }
        const setRandomBoardState = (boardSize: number, difficulty: number) => {
            // Get "difficulty" number of random numbers between 0 and boardSize
            const randomPositions = _.sampleSize(
                _.range(0, boardSize),
                difficulty,
            );
            // Get "difficulty" number of random numbers between 0 and 3
            const randomValues: number[] = [];
            for (let i = 0; i < difficulty; i++) {
                randomValues.push(Math.floor(Math.random() * 4));
            }

            // Set the positions in the board to the random values
            setBoard(() => {
                const newBoard = initBoardState(boardSize);
                randomPositions.forEach((position, index) => {
                    newBoard[position] = randomValues[index];
                });
                return newBoard;
            });
        };
        setAllowClick(false);
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
            setAllowClick(true);
        }, 3000);
    }, [difficulty, score, isPlaying]);

    const displayedBoard = board.map((value, index) => {
        return (
            <div
                key={index}
                className={clsx(`${COLOR_MAP[value < 4 ? value : -1]}`, {
                    "cursor-pointer hover:border-2 border-gray-400":
                        value === -1 || value >= 4,
                })}
                id={`box-${index}`}
                onClick={() => handleBoardClick(index)}
                // onMouseEnter={() => {
                //     if (!allowClick) {
                //         return;
                //     }
                //     if (value === -1 || value >= 4) {
                //         // add bg-opacity-50 class to this element and COLOR_MAP[chosenValue]
                //         const element = document.getElementById(`box-${index}`);
                //         if (element) {
                //             element.classList.add(
                //                 "opacity-50",
                //             );
                //         }
                //     }
                // }}
                // onMouseLeave={() => {
                //     if (!allowClick) {
                //         return;
                //     }
                //     if (value === -1 || value >= 4) {
                //         // remove bg-opacity-50 class to this element and COLOR_MAP[chosenValue]
                //         const element = document.getElementById(`box-${index}`);
                //         if (element) {
                //             element.classList.remove(
                //                 "opacity-50",
                //                 COLOR_MAP[chosenValue]
                //             );
                //         }
                //     }
                // }}
            ></div>
        );
    });

    const renderColorBox = (
        color: string,
        value: number,
        shortcutKey: string,
    ) => {
        return (
            <div className="flex flex-col items-center">
                <div
                    className={clsx(`box-${color}`, {
                        [`scale-110 opacity-100`]: chosenValue === value,
                        "opacity-50": chosenValue !== value,
                    })}
                    onClick={() => setChosenValue(value)}
                ></div>
                <span>{shortcutKey}</span>
            </div>
        );
    };

    return (
        <div className="flex justify-between">
            <div className="grid grid-cols-5 grid-rows-5 h-fit w-fit">
                {displayedBoard}
            </div>
            <div className="flex flex-col items-center gap-4">
                <div className="flex justify-center items-center gap-4">
                    {renderColorBox("red", 0, "1")}
                    {renderColorBox("green", 1, "2")}
                    {renderColorBox("blue", 2, "3")}
                    {renderColorBox("yellow", 3, "4")}
                </div>

                <div className="flex items-center gap-2">
                    <span>Difficulty: {difficulty}</span>
                    <span>Score: {score}</span>
                </div>
                <Button
                    onClick={() =>
                        setIsPlaying((prevIsPlaying) => !prevIsPlaying)
                    }
                >
                    {isPlaying ? "Stop" : "Start"}
                </Button>
            </div>
        </div>
    );
};

export default ViewMemoryGame;
