const ViewInfoGuide = () => {
    return (
        <>
            <span className="font-bold text-3xl">Guide</span>
            <div className="mt-4">
                <div className="mb-2">
                    Welcome to{" "}
                    <span className="font-semibold">ENReco Archive!</span> A
                    fan-made project created with the goal to recollect, archive all
                    the events that transpired in Hololive English's long running
                    project Enigmatic Recollection.
                </div>
                <div className="font-semibold text-xl">How to use</div>
                <div className="mt-2 space-y-2">
                    <div>
                        This is a visual representation of the relationships
                        between the characters in Hololive English's Enigmatic
                        Recollection project. You can click on the nodes to see
                        more information about the characters as well as the
                        events they were involved in on that day.
                    </div>
                    <div>
                        You can also click on the edges to see the events that
                        the characters were involved in together.
                    </div>
                </div>
            </div>
        </>
    );
};

export default ViewInfoGuide;
