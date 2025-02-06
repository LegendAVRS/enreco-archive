import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
// import lodash
import * as _ from "lodash";
import clsx from "clsx";

const WINNING_MULTIPLIER = {
    "box-blue": 2,
    "box-green": 3,
    "box-yellow": 5,
    "box-red": 10,
};

const ViewGamblingGame = () => {
    // Initialize the board, there are four values, RED, YELLOW, GREEN, BLUE
    // RED = 10, YELLOW = 5, GREEN = 3, BLUE = 2, mutipliers for winning
    // Indeally the size should be 7x7, red in the center, then surrounded by yellow, then green, then blue
    const initializeBoard = () => {
        // Board should be a 1D array, flattening out the 2D array
        const sideLength = 7;
        const boardSize = sideLength * sideLength;
        const initialValueBoard = Array(boardSize).fill("box-empty");
        const initialPositionBoard = Array.from(
            { length: boardSize },
            (_, i) => i
        );

        // A map a tuple to a value
        const indexColorMap: { [key: number]: string } = {
            0: "box-blue",
            1: "box-green",
            2: "box-yellow",
            3: "box-red",
        };

        for (let i = 0; i < boardSize; i++) {
            const curCol = i % sideLength;
            const curRow = Math.floor(i / sideLength);
            // Calculate distance to edge
            const currentVal = Math.min(
                curCol,
                curRow,
                sideLength - curCol - 1,
                sideLength - curRow - 1
            );
            initialValueBoard[i] = indexColorMap[currentVal];
        }

        return { initialValueBoard, initialPositionBoard };
    };

    // Initialize the board
    const { initialValueBoard, initialPositionBoard } = initializeBoard();
    const [valueBoard, setValueBoard] = useState(initialValueBoard);
    const [positionBoard, setPositionBoard] = useState(initialPositionBoard);
    const [chosenColor, setChosenColor] = useState("box-blue");
    const [betAmount, setBetAmount] = useState(0);
    const [currentBudget, setCurrentBudget] = useState(1000);
    const [currentRoll, setCurrentRoll] = useState(0);

    const displayedBoard = valueBoard.map((value, index) => {
        return <div key={index} className={`${value}`}></div>;
    });

    // Select 12 random positions 4 times in such a way that there is a 2s delay after each
    // Remove the selected positions from the board, by changing the value to box-empty
    // After 4 times, only one position/box is left

    useEffect(() => {
        const roll = () => {
            setTimeout(() => {
                // Select 12 random values from the position board
                const randomPositions = _.sampleSize(positionBoard, 12);
                setValueBoard((prevValueBoard) => {
                    const newValueBoard = [...prevValueBoard];
                    randomPositions.forEach((position) => {
                        newValueBoard[position] = "box-empty";
                    });
                    return newValueBoard;
                });

                setPositionBoard((prevPositionBoard) => {
                    const newPositionBoard = prevPositionBoard.filter(
                        (position) => !randomPositions.includes(position)
                    );
                    return newPositionBoard;
                });
                setCurrentRoll((prevCurrentRoll) => prevCurrentRoll + 1);
            }, 4000);
        };

        if (currentRoll > 0 && currentRoll <= 4) {
            roll();
        } else if (currentRoll > 4) {
            // Calculate the winning amount
            const winningColor = valueBoard.find(
                (value) => value !== "box-empty"
            );
            if (winningColor === chosenColor) {
                const winningMutiplier =
                    WINNING_MULTIPLIER[
                        winningColor as keyof typeof WINNING_MULTIPLIER
                    ];
                setCurrentBudget((prevCurrentBudget) => {
                    return prevCurrentBudget + betAmount * winningMutiplier;
                });
            }
            // Reset the board
            // const { initialValueBoard, initialPositionBoard } = initializeBoard();
            // setValueBoard(initialValueBoard);
            // setPositionBoard(initialPositionBoard);
            setCurrentRoll(0);
        }
    }, [
        valueBoard,
        positionBoard,
        chosenColor,
        betAmount,
        currentBudget,
        currentRoll,
    ]);

    return (
        <div className="flex flex-row justify-between">
            <div className="grid grid-cols-7 grid-rows-7 h-fit w-fit">
                {displayedBoard}
            </div>
            <div className="flex flex-col gap-2 items-center grow">
                <div>
                    <span>Current Budget : {currentBudget}</span>
                </div>
                <div>
                    <span>Choose color</span>
                    <div className="flex gap-2">
                        <div
                            className={clsx("box-blue", {
                                "box-selected border-blue-300":
                                    chosenColor === "box-blue",
                            })}
                            onClick={() => setChosenColor("box-blue")}
                        ></div>
                        <div
                            className={clsx("box-green", {
                                "box-selected border-green-300":
                                    chosenColor === "box-green",
                            })}
                            onClick={() => setChosenColor("box-green")}
                        ></div>
                        <div
                            className={clsx("box-yellow", {
                                "box-selected border-yellow-300":
                                    chosenColor === "box-yellow",
                            })}
                            onClick={() => setChosenColor("box-yellow")}
                        ></div>
                        <div
                            className={clsx("box-red", {
                                "box-selected border-red-300":
                                    chosenColor === "box-red",
                            })}
                            onClick={() => setChosenColor("box-red")}
                        ></div>
                    </div>
                </div>
                <div>
                    <span>Bet amount</span>
                    <Input
                        type="number"
                        onChange={(e) => setBetAmount(+e.target.value)}
                    />
                </div>
                <Button
                    onClick={() => {
                        setCurrentRoll(1);
                        setCurrentBudget((prevCurrentBudget) => {
                            return prevCurrentBudget - betAmount;
                        });
                    }}
                >
                    Roll
                </Button>
            </div>
        </div>
    );
};

export default ViewGamblingGame;
