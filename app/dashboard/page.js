import { Button } from "@/components/ui/button";
import React from "react";

export default function About() {
    return (
        <div className="space-y-10 p-10">
            <h1 className="text-5xl font-black">
                This is a test button to send SOS
            </h1>
            <Button size="lg" className="text-4xl p-10" variant="destructive">
                SOS
            </Button>
        </div>
    );
}
