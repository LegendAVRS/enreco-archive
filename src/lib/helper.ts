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
