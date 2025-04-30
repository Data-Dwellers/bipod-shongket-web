"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { AuthContext } from "@/providers/AuthProvider";
import { useContext, useEffect, useState } from "react";
import { updateUser } from "@/services/userService";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading";


export default function Profile() {
    const { user, loading } = useContext(AuthContext);
    const router = useRouter();

    // State for form inputs
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        email: "",
        phone: ""
    });

    // State for status message
    const [updateStatus, setUpdateStatus] = useState("");
    const [userLoading, setUserLoading] = useState(false)

    useEffect(() => {
        if (!loading && user) {
            console.log("User data loaded:", user);
            setFormData({
                name: user?.name || "",
                age: user?.age || "",
                email: user?.email || "",
                phone: user?.phone || ""
            });
        }
    }, [user, loading]);

    if (loading) {
        return <div className="flex justify-center items-center p-20">
            <Loading></Loading>
        </div>;
    }

    const jsonData = {
        name: user?.name,
        age: user?.age,
        email: user?.email,
        phone: user?.phone
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateUser = async () => {
        setUserLoading(true)
        try {
            // Don't update the email as it's used as identifier
            const { email, ...updateData } = formData;
            await updateUser({ email: user.email }, updateData).then((result) => {
                router.push("/profile");
                window.location.reload();
                if (result.success) {
                    setUpdateStatus("User information updated successfully!");
                } else {
                    setUpdateStatus(`Failed to update: ${result.message}`);
                }
            })

        } catch (error) {
            console.error("Error updating user:", error);
            setUpdateStatus("An error occurred while updating your information");
        }
    };

    return (
        <>
            <AlertDialog>
                <div className="flex flex-col justify-around items-center p-10 gap-10">
                    {userLoading ? <Loading></Loading> :
                        <Card className="w-full">
                            <CardHeader className="text-4xl font-black">User Info</CardHeader>
                            <CardContent className="text-lg">
                                <ul>
                                    {Object.entries(jsonData).map(([key, value]) => (
                                        <li key={key}>
                                            <span className="font-bold uppercase">{key}{" : "}</span>
                                            <span>{value}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <AlertDialogTrigger>
                                    <Button>Update Info</Button>
                                </AlertDialogTrigger>
                            </CardFooter>

                        </Card>

                    }
                    <Card className="w-full">
                        <CardHeader className="text-4xl font-black">Emergency Contacts</CardHeader>
                        <CardContent className="text-lg">
                            <ul>
                                <li></li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Update your information</AlertDialogTitle>
                        <AlertDialogDescription>
                            <div className="space-y-4 mt-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="age">Age</Label>
                                    <Input
                                        id="age"
                                        name="age"
                                        type="number"
                                        value={formData.age}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email (cannot be changed)</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        disabled
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                {updateStatus && (
                                    <p className={`mt-2 text-sm ${updateStatus.includes("Failed") || updateStatus.includes("error") ? "text-red-500" : "text-green-500"}`}>
                                        {updateStatus}
                                    </p>
                                )}
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleUpdateUser}>Update</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
