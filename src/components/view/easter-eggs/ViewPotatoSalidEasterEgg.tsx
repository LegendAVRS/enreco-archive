import { useAudioStore } from "@/store/audioStore";
import React from "react";

const ViewPotatoSalidEasterEgg = () => {
    // temporary gremlin liz
    const audioStore = useAudioStore();
    return (
        <img
            src="https://pbs.twimg.com/media/GQpgEDpb0AAWm_u?format=jpg&name=large"
            width={100}
            className="mx-auto cursor-pointer"
            onClick={() => {
                audioStore.changeBGM("potato");
            }}
            alt="potato salid"
        />
    );
};

export default ViewPotatoSalidEasterEgg;
