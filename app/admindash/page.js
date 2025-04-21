"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminDashboard() {
    const [specialUserId, setSpecialUserId] = useState("");
    const [removeId, setRemoveId] = useState("");
    const [institution, setInstitution] = useState("");

    const handleAddUser = () => {
        console.log("Adding Special User:", specialUserId);
        setSpecialUserId("");
    };

    const handleRemoveUser = () => {
        console.log("Removing User:", removeId, institution);
        setRemoveId("");
        setInstitution("");
    };

    return (
        <div className="bg-black text-white font-sans overflow-x-auto overflow-y-auto min-h-screen w-full flex flex-col">
            <div className="grid grid-cols-12 gap-6 p-6 min-w-[1024px]">

                {/* Sidebar */}
                <div className="col-span-2 flex flex-col items-center space-y-6">
                    <div className="w-20 h-20 bg-bracorange rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M5.121 17.804A13.937 13.937 0 0112 15c2.364 0 4.575.586 6.5 1.617M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div className="text-center">
                        <h2 className="text-lg font-bold">ADMIN</h2>
                        <p className="text-sm text-gray-300">Email</p>
                        <p className="text-sm text-gray-300">Admin ID</p>
                    </div>
                    <div className="bg-zinc-900 p-4 rounded-md w-full text-left">
                        <h3 className="text-bracorange font-semibold mb-2">Current <span className="text-white">Pending</span> Users</h3>
                        <ul className="list-decimal list-inside space-y-1">
                            <li>User_1</li>
                            <li>User_2</li>
                            <li>User_3</li>
                        </ul>
                    </div>
                </div>

                {/* Middle Column */}
                <div className="col-span-5 flex flex-col justify-between space-y-6">

                    {/* Add Special Users */}
                    <div className="bg-zinc-900 p-6 rounded-md shadow-lg">
                        <h3 className="text-white font-semibold mb-4 text-lg">Add <span className="text-blue-400">Special</span> Users</h3>
                        <Input
                            type="text"
                            placeholder="Assign a Unique ID"
                            value={specialUserId}
                            onChange={(e) => setSpecialUserId(e.target.value)}
                            className="mb-4"
                        />
                        <Button onClick={handleAddUser} className="w-full rounded-full">ADD</Button>
                    </div>

                    {/* Remove/Block Users */}
                    <div className="bg-zinc-900 p-6 rounded-md shadow-lg">
                        <h3 className="text-bracorange font-semibold mb-4 text-lg">Remove/Block Users</h3>
                        <Label className="text-bracorange text-sm mb-1">Unique ID</Label>
                        <Input
                            type="text"
                            value={removeId}
                            onChange={(e) => setRemoveId(e.target.value)}
                            className="mb-4"
                        />
                        <Label className="text-bracorange text-sm mb-1">Associated Institution</Label>
                        <Input
                            type="text"
                            value={institution}
                            onChange={(e) => setInstitution(e.target.value)}
                            className="mb-4"
                        />
                        <Button onClick={handleRemoveUser} className="bg-bracorange text-white font-bold py-2 w-full rounded-md">Remove User</Button>
                    </div>
                </div>

                {/* Add Special Forces */}
                <div className="col-span-5 bg-zinc-900 p-6 rounded-md shadow-lg flex flex-col justify-start">
                    <h3 className="text-white font-semibold mb-6 text-lg">Add <span className="text-bracorange">Special Forces</span></h3>
                    <div className="space-y-6">
                        {["Police", "RAB", "Army", "Medical team"].map((unit) => (
                            <div key={unit} className="flex justify-between items-center">
                                <span className="text-white text-base">{unit}</span>
                                <Button variant="outline" className="bg-pink-300 text-black px-4 py-1 rounded-full font-semibold">Select</Button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
