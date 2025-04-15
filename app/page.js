import { Banner } from "@/components/Banner";
import { Header } from "@/components/Header";
import { Separator } from "@/components/ui/separator";

export default function Home() {
    return (
        <div>
            <Header></Header>
            <Separator className="bg-red-600"></Separator>
            <Banner></Banner>
        </div>
    );
}
