import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VaulDrawer from "@/components/view/VaulDrawer";
import ViewCard from "@/components/view/ViewCard";
import ViewGeneralCard from "@/components/view/ViewGeneralCard";
import ViewVisibilityCard from "@/components/view/ViewVisibilityCard";
import { cn } from "@/lib/utils";
import { useViewStore } from "@/store/viewStore";
import { useEffect, useState } from "react";
import { BrowserView, MobileView } from "react-device-detect";

const ViewSettingCard = () => {
    const [open, setOpen] = useState(true);
    const { currentCard, setCurrentCard } = useViewStore();
    // For mobile drawer
    useEffect(() => {
        if (currentCard === "setting") {
            setOpen(true);
        }
    }, [currentCard]);
    return (
        <>
            <BrowserView>
                <ViewCard
                    className={cn("transition-all absolute p-0", {
                        "opacity-0 -z-10 invisible": currentCard !== "setting",
                        "opacity-1 z-10 visible": currentCard === "setting",
                    })}
                >
                    <Tabs
                        defaultValue="general"
                        className="w-full h-[calc(100%-3.5rem)]"
                    >
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="general">General</TabsTrigger>
                            <TabsTrigger value="visibility">Edge</TabsTrigger>
                        </TabsList>
                        <TabsContent value="general" className="h-full">
                            <ViewGeneralCard />
                        </TabsContent>
                        <TabsContent value="visibility" className="h-full">
                            <ViewVisibilityCard />
                        </TabsContent>
                    </Tabs>
                </ViewCard>
            </BrowserView>
            <MobileView>
                <VaulDrawer
                    open={open}
                    setOpen={setOpen}
                    onClose={() => setCurrentCard(null)}
                >
                    <Tabs defaultValue="general">
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
