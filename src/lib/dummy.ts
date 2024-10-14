import { ChartData, RelationshipStyle } from "./type";

// Dummy data
export const dummyData: ChartData = {
    nodes: [
        {
            id: "1",
            data: {
                width: 100,
                height: 100,
                imageSrc:
                    "https://static.miraheze.org/hololivewiki/0/03/Gigi_Murin_-_Portrait_01.png",
                sourceHandles: [{ id: "1" }],
                targetHandles: [{ id: "2" }],
            },
            position: {
                x: 100,
                y: 100,
            },
            type: "image",
        },
        {
            id: "2",
            data: {
                width: 100,
                height: 100,
                imageSrc:
                    "https://i1.sndcdn.com/artworks-ScX2qTn4KewPXHjJ-6WGqZA-t500x500.jpg",
                sourceHandles: [{ id: "1" }],
                targetHandles: [{ id: "2" }],
            },
            position: {
                x: 300,
                y: 100,
            },
            type: "image",
        },
        {
            id: "3",
            data: {
                width: 100,
                height: 100,
                imageSrc:
                    "https://yt3.googleusercontent.com/RZ4Fp3L6_zyq6YA7s5WnH8-22iezMLwdJhtkBgs_EAb06mvMCnF59JKMNu9YPCqb7nhaeXMdPvY=s900-c-k-c0x00ffffff-no-rj",
                sourceHandles: [{ id: "1" }],
                targetHandles: [{ id: "2" }],
            },
            position: {
                x: 500,
                y: 100,
            },
            type: "image",
        },
    ],
    edges: [
        {
            type: "custom",
            id: "1",
            source: "1",
            target: "2",
            data: {
                relationship: "romantic",
            },
        },
        {
            type: "custom",
            id: "2",
            source: "2",
            target: "3",
            data: {
                relationship: "family",
            },
        },
    ],
};

export const dummyRelationships: RelationshipStyle = {
    romantic: {
        stroke: "red",
    },
    family: {
        stroke: "blue",
    },
};
