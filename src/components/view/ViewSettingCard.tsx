import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VaulDrawer from "@/components/view/VaulDrawer";
import ViewCard from "@/components/view/ViewCard";
import ViewGeneralCard from "@/components/view/ViewGeneralCard";
import ViewVisibilityCard from "@/components/view/ViewVisibilityCard";
import { Chapter, ChartData, StringToBooleanObjectMap } from "@/lib/type";
import { cn } from "@/lib/utils";
import { BrowserView, MobileView } from "react-device-detect";

interface Props {
    isCardOpen: boolean;
    onCardClose: () => void;
    chapter: number;
    chapterData: Chapter;
    day: number;
    dayData: ChartData;
    onDayChange: (newDay: number) => void;
    onModalOpen: () => void;
    edgeVisibility: StringToBooleanObjectMap;
    onEdgeVisibilityChange: (newEdgeVisibility: StringToBooleanObjectMap) => void;
    teamVisibility: StringToBooleanObjectMap;
    onTeamVisibilityChange: (newTeamVisibility: StringToBooleanObjectMap) => void; 
    characterVisibility: { [key: string]: boolean };
    onCharacterVisibilityChange: (newCharacterVisibility: StringToBooleanObjectMap) => void;
}

const ViewSettingCard = ({ 
    isCardOpen, 
    onCardClose, 
    chapter, 
    chapterData, 
    day, 
    dayData, 
    onDayChange, 
    onModalOpen,
    edgeVisibility, 
    onEdgeVisibilityChange,
    teamVisibility,
    onTeamVisibilityChange,
    characterVisibility,
    onCharacterVisibilityChange,
}: Props) => {
    function onDrawerOpenChange(newOpenState: boolean): void {
        if(!newOpenState) {
            onCardClose();
        }
    }

    if(!isCardOpen) {
        return;
    }

    return (
        <>
            <BrowserView>
                <ViewCard
                    isCardOpen={isCardOpen}
                    className={cn("transition-all absolute p-0", {
                        "opacity-0 -z-10 invisible": !isCardOpen,
                        "opacity-1 z-10 visible": isCardOpen,
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
                            <ViewGeneralCard 
                                chapter={chapter}
                                chapterData={chapterData}
                                day={day}
                                dayData={dayData}
                                onDayChange={onDayChange}
                                onModalOpen={onModalOpen}
                            />
                        </TabsContent>
                        <TabsContent value="visibility" className="h-full">
                            <ViewVisibilityCard 
                                edgeVisibility={edgeVisibility}
                                onEdgeVisibilityChange={onEdgeVisibilityChange}
                                teamVisibility={teamVisibility}
                                onTeamVisibilityChange={onTeamVisibilityChange}
                                characterVisibility={characterVisibility}
                                onCharacterVisibilityChange={onCharacterVisibilityChange}
                                dayData={dayData}
                            />
                        </TabsContent>
                    </Tabs>
                </ViewCard>
            </BrowserView>
            <MobileView>
                <VaulDrawer
                    open={true}
                    onOpenChange={onDrawerOpenChange}
                    disableScrollablity={true}
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
                            <ViewGeneralCard 
                                chapter={chapter}
                                chapterData={chapterData}
                                day={day}
                                dayData={dayData}
                                onDayChange={onDayChange}
                                onModalOpen={onModalOpen}
                            />
                        </TabsContent>
                        <TabsContent
                            value="visibility"
                            className="h-[80vh] pb-[10vh]"
                        >
                            <ViewVisibilityCard 
                                edgeVisibility={edgeVisibility}
                                onEdgeVisibilityChange={onEdgeVisibilityChange}
                                teamVisibility={teamVisibility}
                                onTeamVisibilityChange={onTeamVisibilityChange}
                                characterVisibility={characterVisibility}
                                onCharacterVisibilityChange={onCharacterVisibilityChange}
                                dayData={dayData}
                            />
                        </TabsContent>
                    </Tabs>
                </VaulDrawer>
            </MobileView>
        </>
    );
};

export default ViewSettingCard;
