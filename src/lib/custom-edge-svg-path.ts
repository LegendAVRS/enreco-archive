// Function that generates the SVG path given start/end coords of the edges and all the offsets.
export function generateOrthogonalEdgePath(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    padding: number,
    HCoffset = 0,
    VRoffset = 0,
    VLoffset = 0,
    HLoffset = 0,
    HRoffset = 0,
) {
    // Calculate horizontal and vertical distances
    const dy = endY - startY;

    // Calculate the position for the horizontal line
    const horizontalY = startY + dy / 2 - HCoffset;

    // Calculate the position for the vertical line
    const verticalX = endX - padding + VRoffset ;
    const verticalXT = startX - padding + VLoffset;

    // Create a path string, draw the line all at once from left to right.
    // Do it like this to get a nice smooth line.
    let path = `M${startX},${startY} `;

    // Part of the line that gets drawn if HL and its line segment exists.
    if (VLoffset !== 0) {
        path += `V${startY + HLoffset} `
        path += `H${verticalXT} `;
    }

    // Main part of the line
    path += `V${horizontalY} `;
    path += `H${verticalX} `;
    path += `V${endY + HRoffset} `;

    // Part of the line that gets drawn if HR and its line segment exists.
    if (VRoffset !== 0) {
        path += `H${endX} `;
        path += `V${endY} `;
    }

    return path.trim();
}