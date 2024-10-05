import { AStarFinder, DiagonalMovement, Grid } from "pathfinding";

export default class CustomAStarFinder extends AStarFinder {
    constructor(options) {
        super(options);
        this.prevDirection = null; // To track the previous move direction
    }

    // New method to calculate the direction between two nodes
    calculateDirection(node1, node2) {
        return {
            x: node2[0] - node1[0],
            y: node2[1] - node1[1],
        };
    }

    // Override the method that processes the pathfinding logic
    findPath(startX, startY, endX, endY, grid) {
        this.prevDirection = null; // Reset the previous direction before starting
        return super.findPath(startX, startY, endX, endY, grid);
    }

    // Override the heuristic to include penalty for direction changes
    heuristic(dx, dy, currentNode, previousNode) {
        let penalty = 0;
        if (previousNode) {
            const prevDir = this.calculateDirection(
                [previousNode.x, previousNode.y],
                [currentNode.x, currentNode.y]
            );
            const newDir = { x: dx, y: dy };

            // Check if there's a direction change
            if (prevDir.x !== newDir.x || prevDir.y !== newDir.y) {
                penalty = 20; // Add a penalty for changing direction (adjust this value)
            }
        }

        // Manhattan distance + direction change penalty
        return dx + dy + penalty;
    }

    // Override the pathfinding process to apply penalty while exploring neighbors
    processNode(
        currentNode,
        neighbors,
        grid,
        gScore,
        openList,
        cameFrom,
        fScore,
        endX,
        endY
    ) {
        const currentG = gScore.get(`${currentNode.x},${currentNode.y}`);

        for (const neighbor of neighbors) {
            const tentativeGScore =
                currentG + grid.getWeightAt(neighbor.x, neighbor.y);
            const prevNode = cameFrom.get(`${currentNode.x},${currentNode.y}`);
            const dx = Math.abs(neighbor.x - endX);
            const dy = Math.abs(neighbor.y - endY);
            const heuristicCost = this.heuristic(dx, dy, neighbor, currentNode);

            if (
                tentativeGScore <
                (gScore.get(`${neighbor.x},${neighbor.y}`) || Infinity)
            ) {
                // Store the node information and update scores
                cameFrom.set(`${neighbor.x},${neighbor.y}`, currentNode);
                gScore.set(`${neighbor.x},${neighbor.y}`, tentativeGScore);
                fScore.set(
                    `${neighbor.x},${neighbor.y}`,
                    tentativeGScore + heuristicCost
                );

                if (
                    !openList.some(
                        (node) => node.x === neighbor.x && node.y === neighbor.y
                    )
                ) {
                    openList.push(neighbor); // Add neighbor to open list if not already present
                }
            }
        }
    }
}
