const ViewInfoGuide = () => {
    return (
        <div>
            <div className="font-bold text-3xl">Guide</div>
            <div className="mt-4">
                <div className="font-semibold text-xl">How to use</div>
                <div className="mt-2">
                    <div>
                        This is a visual representation of the relationships
                        between the characters in Hololive English's Enigmatic
                        Recollection project. You can click on the nodes to see
                        more information about the characters as well as the
                        events they were involved in on that day.
                    </div>
                    <div className="mt-2">
                        You can also click on the edges to see the events that
                        the characters were involved in together.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewInfoGuide;
