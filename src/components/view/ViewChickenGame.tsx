import { Button } from "@/components/ui/button";
import { useAudioStore } from "@/store/audioStore";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";

const BASKET_WIDTH = 50;
const BASKET_HEIGHT = 60;
const CHICKEN_SIZE = 30;
const CHICKEN_FALL_SPEED = 3;
const SPAWN_INTERVAL = 300;
const GAME_DURATION = 30;

interface Chicken {
    x: number;
    y: number;
    id: number;
}

const ViewChickenGame = () => {
    const audioStore = useAudioStore();
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [basketX, setBasketX] = useState(0);
    const [chickens, setChickens] = useState<Chicken[]>([]);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);

    const boardRef = useRef<HTMLDivElement>(null);
    const animationFrameRef = useRef<number>();
    const lastSpawnRef = useRef<number>(0);
    const chickenIdRef = useRef<number>(0);
    const timerRef = useRef<NodeJS.Timeout>();

    // Timer effect
    useEffect(() => {
        if (!isPlaying) return;

        timerRef.current = setInterval(() => {
            setTimeLeft((prev: number) => {
                if (prev <= 1) {
                    // Game over
                    setIsPlaying(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isPlaying]);

    // Update highscore
    useEffect(() => {
        if (!isPlaying) {
            setHighScore((prev) => Math.max(prev, score));
        }
    }, [score, isPlaying]);

    const handleGameStart = () => {
        if (!isPlaying) {
            setScore(0);
            setTimeLeft(GAME_DURATION);
            setChickens([]);
            setBasketX(boardRef.current!.clientWidth / 2 - BASKET_WIDTH / 2);
        } else {
            setHighScore((prev) => Math.max(prev, score));
        }
        setIsPlaying(!isPlaying);
    };

    // Handle mouse/touch movement
    useEffect(() => {
        // if (!isPlaying) return;

        const handleMouseMove = (e: MouseEvent | TouchEvent) => {
            const board = boardRef.current;
            if (!board) return;

            const boardRect = board.getBoundingClientRect();
            const x =
                "touches" in e
                    ? e.touches[0].clientX - boardRect.left
                    : e.clientX - boardRect.left;

            setBasketX(
                Math.max(
                    0,
                    Math.min(
                        x - BASKET_WIDTH / 2,
                        boardRect.width - BASKET_WIDTH,
                    ),
                ),
            );
        };

        const board = boardRef.current;
        if (board) {
            if (isMobile) {
                board.addEventListener("touchmove", handleMouseMove);
            } else {
                board.addEventListener("mousemove", handleMouseMove);
            }
        }

        return () => {
            if (board) {
                if (isMobile) {
                    board.removeEventListener("touchmove", handleMouseMove);
                } else {
                    board.removeEventListener("mousemove", handleMouseMove);
                }
            }
        };
    }, []);

    // Game loop
    useEffect(() => {
        if (!isPlaying) return;

        const gameLoop = (timestamp: number) => {
            // Spawn new chickens
            if (
                timestamp - lastSpawnRef.current - Math.random() >
                SPAWN_INTERVAL
            ) {
                setChickens((prev) => [
                    ...prev,
                    {
                        x:
                            Math.random() *
                            (boardRef.current!.clientWidth - CHICKEN_SIZE),
                        y: -CHICKEN_SIZE,
                        id: chickenIdRef.current++,
                    },
                ]);
                lastSpawnRef.current = timestamp;
            }

            // Update chicken positions and check collisions
            setChickens((prev) => {
                const newChickens = prev
                    .filter((chicken) => {
                        // Check if chicken is caught
                        if (
                            chicken.y + CHICKEN_SIZE >
                                boardRef.current!.clientHeight -
                                    BASKET_HEIGHT &&
                            chicken.x + CHICKEN_SIZE > basketX &&
                            chicken.x < basketX + BASKET_WIDTH
                        ) {
                            // This sfx is too annoying, might change to sth else
                            // audioStore.playSFX("xp");
                            setScore((s) => s + 1);
                            return false;
                        }
                        // Remove if fallen off screen
                        if (chicken.y > boardRef.current!.clientHeight) {
                            return false;
                        }
                        return true;
                    })
                    .map((chicken) => ({
                        ...chicken,
                        y: chicken.y + CHICKEN_FALL_SPEED,
                    }));
                return newChickens;
            });

            animationFrameRef.current = requestAnimationFrame(gameLoop);
        };

        animationFrameRef.current = requestAnimationFrame(gameLoop);
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isPlaying, basketX, audioStore]);

    return (
        <div className="flex flex-col w-[90%] h-[90%] items-center gap-4">
            <div className="w-full relative h-4 bg-gray-200 rounded-lg mt-2 sm:mt-0">
                <div
                    className="absolute left-0 rounded-lg top-0 h-full transition-all bg-green-600 "
                    style={{ width: `${(timeLeft / GAME_DURATION) * 100}%` }}
                />
            </div>
            <div
                ref={boardRef}
                className="relative bg-blue-100  overflow-hidden w-full h-full"
            >
                {/* Chickens */}
                {chickens.map((chicken) => (
                    <div
                        key={chicken.id}
                        className="absolute"
                        style={{
                            left: chicken.x,
                            top: chicken.y,
                            width: CHICKEN_SIZE,
                            height: CHICKEN_SIZE,
                            fontSize: CHICKEN_SIZE,
                        }}
                    >
                        🐔
                    </div>
                ))}

                {/* Basket */}
                <div
                    className="absolute bottom-0 text-center"
                    style={{
                        left: basketX,
                        width: BASKET_WIDTH,
                        height: BASKET_HEIGHT,
                        fontSize: BASKET_WIDTH,
                    }}
                >
                    🧺
                </div>
            </div>

            <div className="flex gap-4 items-center">
                <span>Score: {score}</span>
                <span>High Score: {highScore}</span>
                <Button
                    onClick={handleGameStart}
                    disabled={timeLeft !== 0 && isPlaying}
                >
                    {isPlaying ? "Stop" : "Start"}
                </Button>
            </div>
        </div>
    );
};

export default ViewChickenGame;
