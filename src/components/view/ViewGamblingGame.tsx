import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
// import lodash
import * as _ from "lodash";
import clsx from "clsx";
import { LS_GAMBLING_HS } from "@/lib/constants";

const WINNING_MULTIPLIER = {
    "box-blue": 2,
    "box-green": 3,
    "box-yellow": 5,
    "box-red": 10,
};

const initializeBoard = () => {
    // Board should be a 1D array, flattening out the 2D array
    const sideLength = 7;
    const boardSize = sideLength * sideLength;
    const initialValueBoard = Array(boardSize).fill("box-empty");
    const initialPositionBoard = Array.from({ length: boardSize }, (_, i) => i);

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
            sideLength - curRow - 1,
        );
        initialValueBoard[i] = indexColorMap[currentVal];
    }

    return { initialValueBoard, initialPositionBoard };
};

const { initialValueBoard, initialPositionBoard } = initializeBoard();

const ViewGamblingGame = () => {
    // Initialize the board, there are four values, RED, YELLOW, GREEN, BLUE
    // RED = 10, YELLOW = 5, GREEN = 3, BLUE = 2, mutipliers for winning
    // Indeally the size should be 7x7, red in the center, then surrounded by yellow, then green, then blue

    // Initialize the board
    const [valueBoard, setValueBoard] = useState(initialValueBoard);
    const [positionBoard, setPositionBoard] = useState(initialPositionBoard);
    const [chosenValue, setChosenValue] = useState("box-blue");
    const [betAmount, setBetAmount] = useState(0);
    const [currentBudget, setCurrentBudget] = useState(1000);
    const [currentRoll, setCurrentRoll] = useState(0);
    const [highScore, setHighScore] = useState(currentBudget);

    const displayedBoard = valueBoard.map((value, index) => {
        return <div key={index} className={`${value}`}></div>;
    });

    // Init highscore
    useEffect(() => {
        const value = localStorage.getItem(LS_GAMBLING_HS);
        if (value) {
            console.log("hs", value);
            setHighScore(parseInt(value));
        }
    }, []);

    // Update highscore
    useEffect(() => {
        if (currentBudget > highScore) {
            localStorage.setItem(LS_GAMBLING_HS, currentBudget.toString());
            setHighScore(currentBudget);
        }
    }, [currentBudget, highScore, setHighScore]);

    // Select 12 random positions 4 times in such a way that there is a 4s delay after each
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
                        (position) => !randomPositions.includes(position),
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
                (value) => value !== "box-empty",
            );
            if (winningColor === chosenValue) {
                const winningMutiplier =
                    WINNING_MULTIPLIER[
                        winningColor as keyof typeof WINNING_MULTIPLIER
                    ];
                setCurrentBudget((prevCurrentBudget) => {
                    return prevCurrentBudget + betAmount * winningMutiplier;
                });
            }

            setCurrentRoll(0);
        }
    }, [
        valueBoard,
        positionBoard,
        chosenValue,
        betAmount,
        currentBudget,
        currentRoll,
    ]);

    const renderColorBox = (value: string) => {
        return (
            <div className="flex flex-col items-center">
                <div
                    className={clsx(`${value}`, {
                        [`scale-110 opacity-100`]: chosenValue === value,
                        "opacity-50": chosenValue !== value,
                    })}
                    onClick={() => setChosenValue(value)}
                ></div>
            </div>
        );
    };

    return (
        <div className="flex flex-col md:flex-row items-center md:gap-4 md:justify-between">
            <div className="grid grid-cols-7 grid-rows-7 h-fit w-fit">
                {displayedBoard}
            </div>
            <div className="flex flex-col gap-2 items-center grow mt-2">
                <div className="flex gap-2">
                    <span className="text-center">
                        <span className="font-semibold">Current Budget:</span>{" "}
                        {currentBudget}
                    </span>
                    <span>|</span>
                    <span className="text-center">
                        <span className="font-semibold">Personal Record:</span>{" "}
                        {highScore}
                    </span>
                </div>
                <div className="flex flex-col items-center">
                    <span>Choose color</span>
                    <div className="flex gap-2">
                        {renderColorBox("box-blue")}
                        {renderColorBox("box-green")}
                        {renderColorBox("box-yellow")}
                        {renderColorBox("box-red")}
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <span>Bet Amount</span>
                    <Input
                        type="number"
                        onChange={(e) => setBetAmount(+e.target.value)}
                    />
                </div>
                <Button
                    disabled={
                        (currentRoll <= 4 && currentRoll !== 0) ||
                        currentBudget <= 0 ||
                        betAmount === 0 ||
                        betAmount > currentBudget
                    }
                    onClick={() => {
                        // reset the board
                        setValueBoard(initialValueBoard);
                        setPositionBoard(initialPositionBoard);

                        // start roll
                        setCurrentRoll(1);
                        setCurrentBudget((prevCurrentBudget) => {
                            return prevCurrentBudget - betAmount;
                        });
                    }}
                >
                    {currentBudget > 0
                        ? currentRoll === 0 || currentRoll > 4
                            ? "Lock In"
                            : "Rolling"
                        : "Out of money"}
                </Button>
            </div>
        </div>
    );
};

export default ViewGamblingGame;
