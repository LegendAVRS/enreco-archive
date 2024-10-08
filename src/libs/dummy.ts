import { ChartData } from "./type";

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
            },
            position: {
                x: 100,
                y: 100,
            },
            type: "imageNode",
        },
        {
            id: "2",
            data: {
                width: 100,
                height: 100,
                imageSrc:
                    "https://i1.sndcdn.com/artworks-ScX2qTn4KewPXHjJ-6WGqZA-t500x500.jpg",
            },
            position: {
                x: 300,
                y: 100,
            },
            type: "imageNode",
        },
        {
            id: "3",
            data: {
                width: 100,
                height: 100,
                imageSrc:
                    "https://yt3.googleusercontent.com/RZ4Fp3L6_zyq6YA7s5WnH8-22iezMLwdJhtkBgs_EAb06mvMCnF59JKMNu9YPCqb7nhaeXMdPvY=s900-c-k-c0x00ffffff-no-rj",
            },
            position: {
                x: 500,
                y: 100,
            },
            type: "imageNode",
        },
    ],
    edges: [
        {
            type: "step",
            id: "1",
            source: "1",
            target: "2",
        },
        {
            type: "step",
            id: "2",
            source: "2",
            target: "3",
        },
    ],
};
