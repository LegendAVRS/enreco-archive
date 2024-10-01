import { RelationshipType } from "./type";

/**
 * Get the style of the edge based on the relationship type.
 */
export const getEdgeStyle = (
    type: string,
    relationshipTypes: RelationshipType
) => {
    // Color
    const stroke = relationshipTypes[type].color;

    // Decoration
    let strokeDasharray = "none";
    switch (relationshipTypes[type].decoration) {
        case "dotted":
            strokeDasharray = "5 5";
            break;
    }

    return {
        stroke,
        strokeDasharray,
    };
};

/**
 * Map an object into Record<string, boolean> for visibility.
 */
export const mapObjToStringBoolObj = (object: Record<string, any>) => {
    return Object.keys(object).reduce((acc, key) => {
        acc[key] = true;
        return acc;
    }, {} as Record<string, boolean>);
};

/**
 * Map an array of strings into Record<string, boolean> for visibility.
 */
export const mapArrayToStringBoolObj = (arr: string[]) => {
    return arr.reduce((acc, key) => {
        acc[key] = true;
        return acc;
    }, {} as Record<string, boolean>);
};
