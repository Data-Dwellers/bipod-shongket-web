import Card from "./Card";
import { Input } from "./ui/input";



export default function Banner(){
    return (
        <div className="flex flex-col ">
            <div className="flex flex-col items-center">
                <h1 className="text-2xl p-5 font-bold">Search Recent Reports Based on any Area Name</h1>
                <Input placeholder="Search"className="w-2xl h-8 border-red-700 border-2 rounded-3xl p-4"></Input>
            </div>
            <div className=" flex flex-wrap justify-self-start p-3">
                <Card></Card>
            </div>
            
        </div>
        
    );
};
