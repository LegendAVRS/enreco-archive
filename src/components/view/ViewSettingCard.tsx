import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VaulDrawer from "@/components/view/VaulDrawer";
import ViewGeneralCard from "@/components/view/ViewGeneralCard";
import ViewVisibilityCard from "@/components/view/ViewVisibilityCard";
import { useViewStore } from "@/store/viewStore";
import { useEffect, useState } from "react";
import { BrowserView, MobileView } from "react-device-detect";

const ViewSettingCard = () => {
    const [open, setOpen] = useState(true);
    const { currentCard, setCurrentCard } = useViewStore();
    useEffect(() => {
        if (currentCard === "setting") {
            setOpen(true);
        }
    }, [currentCard]);
    return (
        <>
            <BrowserView>
                <Tabs
                    className="w-[400px] absolute right-10 top-1/2 -translate-y-1/2"
                    defaultValue="general"
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="visibility">Edge</TabsTrigger>
                    </TabsList>
                    <TabsContent value="general" className="h-[500px]">
                        <ViewGeneralCard />
                    </TabsContent>
                    <TabsContent value="visibility" className="h-[500px]">
                        <ViewVisibilityCard />
                    </TabsContent>
                </Tabs>
            </BrowserView>
            <MobileView>
                <VaulDrawer
                    open={open}
                    setOpen={setOpen}
                    onClose={() => setCurrentCard(null)}
                >
                    <Tabs defaultValue="visibility">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="general">General</TabsTrigger>
                            <TabsTrigger value="visibility">Edge</TabsTrigger>
                        </TabsList>
                        <TabsContent
                            value="general"
                            className="h-[80vh] pb-[10vh]"
                        >
                            <ViewGeneralCard />
                        </TabsContent>
                        <TabsContent
                            value="visibility"
                            className="h-[80vh] pb-[10vh]"
                        >
                            <ViewVisibilityCard />
                        </TabsContent>
                    </Tabs>
                </VaulDrawer>
            </MobileView>
        </>
    );
};

export default ViewSettingCard;
