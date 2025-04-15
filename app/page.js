"use client"
import {Routes, Route, BrowserRouter} from "react-router-dom";

import { Banner } from "@/components/Banner";
import { Header } from "@/components/Header";
import { Separator } from "@/components/ui/separator";
import { LogIn } from "@/views/logIn";


export default function Home() {
    return (
        <BrowserRouter>
            <div>
                <Header></Header>
                <Separator className="bg-red-600"></Separator>
                

                <Routes>
                    <Route path="/log-in" element={ <LogIn></LogIn>} />
                    <Route path="/" element={<Banner></Banner>}></Route>
                </Routes>
            </div>
        </BrowserRouter>
        
    );
}
