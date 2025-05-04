"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getSpecialUsers, createSpecialUser, updateSpecialUser } from '@/services/specialUserService';

export default function AdminDashboard() {
    const [specialUserId, setSpecialUserId] = useState("");
    const [specialUserName, setSpecialUserName] = useState("");
    const [specialUserEmail, setSpecialUserEmail] = useState("");
    const [specialUserPhone, setSpecialUserPhone] = useState("");
    const [Status, setStatus] = useState("");
    const [removeId, setRemoveId] = useState("");
    const [institution, setInstitution] = useState("");
    const [role, setRole] = useState("");

    const [addedUsers, setAddedUsers] = useState([]);
    const [removedUsers, setRemovedUsers] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSpecialUsers();
    }, []);

    const fetchSpecialUsers = async () => {
        try {
            const result = await getSpecialUsers();

            if (result.success) {
                const active = result.data.filter(user => user.status === 'active');
                const removed = result.data.filter(user => user.status === 'removed');
                setAddedUsers(active);
                setRemovedUsers(removed);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Failed to fetch special users');
            console.error(err);
        }
    };

    const handleAddUser = async () => {
        if (specialUserId && specialUserName && specialUserEmail && specialUserPhone && Status && role) {
            setIsLoading(true);
            setError(null);

            const newUser = {
                specialUserId,
                specialUserName,
                specialUserEmail,
                specialUserPhone,
                Status,
                role,
            };

            try {
                const result = await createSpecialUser(newUser);

                if (result.success) {
                    await fetchSpecialUsers();
                    setSpecialUserId("");
                    setSpecialUserName("");
                    setSpecialUserEmail("");
                    setSpecialUserPhone("");
                    setStatus("");
                    setRole("");
                } else {
                    setError(result.message);
                }
            } catch (err) {
                setError('Failed to add special user');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleRemoveUser = async () => {
        if (removeId && institution) {
            setIsLoading(true);
            setError(null);

            try {
                const result = await updateSpecialUser(removeId, {
                    status: "removed",
                    institution
                });

                if (result.success) {
                    await fetchSpecialUsers();
                    setRemoveId("");
                    setInstitution("");
                } else {
                    setError(result.message);
                }
            } catch (err) {
                setError('Failed to remove special user');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="bg-black text-white font-sans overflow-x-auto overflow-y-auto min-h-screen w-full flex flex-col">
            {error && (
                <div className="bg-red-500/10 text-red-500 p-4 mb-4 rounded-md">
                    {error}
                </div>
            )}
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
                        <Input
                            type="text"
                            placeholder="User Name"
                            value={specialUserName}
                            onChange={(e) => setSpecialUserName(e.target.value)}
                            className="mb-4"
                        />
                        <Input
                            type="email"
                            placeholder="Email"
                            value={specialUserEmail}
                            onChange={(e) => setSpecialUserEmail(e.target.value)}
                            className="mb-4"
                        />
                        <Input
                            type="number"
                            placeholder="Phone Number"
                            value={specialUserPhone}
                            onChange={(e) => setSpecialUserPhone(e.target.value)}
                            className="mb-4"
                        />
                        <Input
                            type="text"
                            placeholder="Status"
                            value={Status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="mb-4"
                        />
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="mb-4 w-full p-2 rounded-md bg-zinc-800 text-white"
                        >
                            <option value="">Select Role</option>
                            <option value="police">Police</option>
                            <option value="rab">RAB</option>
                            <option value="army">Army</option>
                            <option value="medical team">Medical Team</option>
                        </select>
                        <Button
                            onClick={handleAddUser}
                            className="w-full rounded-full"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Adding...' : 'ADD'}
                        </Button>
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
                        <Button
                            onClick={handleRemoveUser}
                            className="bg-bracorange text-white font-bold py-2 w-full rounded-md"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Removing...' : 'Remove User'}
                        </Button>
                    </div>
                </div>

                {/* Right Column */}
                <div className="col-span-5 flex flex-col space-y-6">

                    {/* Display Added Users */}
                    <div className="bg-zinc-900 p-6 rounded-md shadow-lg">
                        <h3 className="text-green-400 font-semibold mb-4 text-lg">Active Special Users</h3>
                        {addedUsers.length > 0 ? (
                            <ul className="list-disc list-inside space-y-2">
                                {addedUsers.map((user) => (
                                    <li key={user.specialUserId}>
                                        <p><span className="font-semibold text-white">ID:</span> {user.specialUserId}</p>
                                        <p><span className="font-semibold text-white">Name:</span> {user.specialUserName}</p>
                                        <p><span className="font-semibold text-white">Email:</span> {user.specialUserEmail}</p>
                                        <p><span className="font-semibold text-white">Phone:</span> {user.specialUserPhone}</p>
                                        <p><span className="font-semibold text-white">Status:</span> {user.Status}</p>
                                        <p><span className="font-semibold text-white">Role:</span> {user.role}</p>
                                        <hr className="my-2 border-blue-600" />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400">No active special users.</p>
                        )}
                    </div>

                    {/* Display Removed Users */}
                    <div className="bg-zinc-900 p-6 rounded-md shadow-lg">
                        <h3 className="text-red-400 font-semibold mb-4 text-lg">Removed/Blocked Users</h3>
                        {removedUsers.length > 0 ? (
                            <ul className="list-disc list-inside space-y-2">
                                {removedUsers.map((user) => (
                                    <li key={user.specialUserId}>
                                        <p><span className="font-semibold text-white">ID:</span> {user.specialUserId}</p>
                                        <p><span className="font-semibold text-white">Institution:</span> {user.institution}</p>
                                        <hr className="my-2 border-gray-600" />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400">No removed users.</p>
                        )}
                    </div>

                </div>

            </div>
        </div>
    );
}