import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VisibilityCard from "@/components/view/VisibilityCard";

const SettingCard = () => {
    return (
        <Tabs
            className="w-[400px] absolute right-10 top-1/2 -translate-y-1/2"
            defaultValue="general"
        >
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="visibility">Edge</TabsTrigger>
            </TabsList>
            <TabsContent value="general"></TabsContent>
            <TabsContent value="visibility">
                <VisibilityCard />
            </TabsContent>
        </Tabs>
    );
};

export default SettingCard;
