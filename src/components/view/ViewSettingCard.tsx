import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ViewGeneralCard from "@/components/view/ViewGeneralCard";
import ViewVisibilityCard from "@/components/view/ViewVisibilityCard";

const ViewSettingCard = () => {
    return (
        <Tabs
            className="w-[400px] absolute right-10 top-1/2 -translate-y-1/2"
            defaultValue="general"
        >
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="visibility">Edge</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="h-[80%]">
                <ViewGeneralCard />
            </TabsContent>
            <TabsContent value="visibility">
                <ViewVisibilityCard />
            </TabsContent>
        </Tabs>
    );
};

export default ViewSettingCard;
