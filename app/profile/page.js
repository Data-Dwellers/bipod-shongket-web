"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { AuthContext } from "@/providers/AuthProvider";
import { useContext, useEffect, useState } from "react";
import { updateUser } from "@/services/userService";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

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

    // State for user form inputs
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        email: "",
        phone: "",
        location: {
            name: "",
            lat: "",
            long: ""
        }
    });

    // State for emergency contact form inputs
    const [emergencyFormData, setEmergencyFormData] = useState({
        name: "",
        phone: "",
        email: "",
        relation: "",
        location: {
            name: "",
            lat: "",
            long: ""
        }
    });

    // State for status messages
    const [updateStatus, setUpdateStatus] = useState("");
    const [emergencyUpdateStatus, setEmergencyUpdateStatus] = useState("");
    const [userLoading, setUserLoading] = useState(false);
    const [activeDialog, setActiveDialog] = useState(""); // Changed from "userInfo" to empty string so modal doesn't show up automatically

    useEffect(() => {
        if (!loading && user) {
            console.log("User data loaded:", user);
            setFormData({
                name: user?.name || "",
                age: user?.age || "",
                email: user?.email || "",
                phone: user?.phone || "",
                location: {
                    name: user?.location?.name || "",
                    lat: user?.location?.lat || "",
                    long: user?.location?.long || ""
                }
            });

            setEmergencyFormData({
                name: user?.emergency_contact?.name || "",
                phone: user?.emergency_contact?.phone || "",
                email: user?.emergency_contact?.email || "",
                relation: user?.emergency_contact?.relation || "",
                location: {
                    name: user?.emergency_contact?.location?.name || "",
                    lat: user?.emergency_contact?.location?.lat || "",
                    long: user?.emergency_contact?.location?.long || ""
                }
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
        phone: user?.phone,
        location: user?.location?.name ? `${user.location.name} (${user.location.lat}, ${user.location.long})` : "Not set"

    }

    const emergencyData = {
        name: user?.emergency_contact?.name || "Not set",
        phone: user?.emergency_contact?.phone || "Not set",
        email: user?.emergency_contact?.email || "Not set",
        relation: user?.emergency_contact?.relation || "Not set",
        location: user?.emergency_contact?.location?.name ?
            `${user.emergency_contact.location.name} (${user.emergency_contact.location.lat}, ${user.emergency_contact.location.long})` : "Not set"
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parentKey, childKey] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parentKey]: {
                    ...prev[parentKey],
                    [childKey]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleEmergencyInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parentKey, childKey] = name.split('.');
            setEmergencyFormData(prev => ({
                ...prev,
                [parentKey]: {
                    ...prev[parentKey],
                    [childKey]: value
                }
            }));
        } else {
            setEmergencyFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleUpdateUser = async () => {
        setUserLoading(true);
        try {
            // Don't update the email as it's used as identifier
            const { email, ...updateData } = formData;
            await updateUser({ email: user.email }, updateData).then((result) => {
                if (result.success) {
                    setUpdateStatus("User information updated successfully!");
                    setActiveDialog(""); // Close the dialog
                    window.location.reload(); // Reload the page to reflect changes
                } else {
                    setUpdateStatus(`Failed to update: ${result.message}`);
                }
                setUserLoading(false);
            });
        } catch (error) {
            console.error("Error updating user:", error);
            setUpdateStatus("An error occurred while updating your information");
            setUserLoading(false);
        }
    };

    const handleUpdateEmergencyContact = async () => {
        setUserLoading(true);
        try {
            const updateData = {
                emergency_contact: emergencyFormData
            };
            await updateUser({ email: user.email }, updateData).then((result) => {
                if (result.success) {
                    setEmergencyUpdateStatus("Emergency contact updated successfully!");
                    setActiveDialog(""); // Close the dialog
                    window.location.reload(); // Reload the page to reflect changes
                } else {
                    setEmergencyUpdateStatus(`Failed to update: ${result.message}`);
                }
                setUserLoading(false);
            });
        } catch (error) {
            console.error("Error updating emergency contact:", error);
            setEmergencyUpdateStatus("An error occurred while updating emergency contact");
            setUserLoading(false);
        }
    };

    return (
        <>
            <AlertDialog open={activeDialog === "userInfo"} onOpenChange={() => setActiveDialog(activeDialog === "userInfo" ? "" : "userInfo")}>
                <div className="flex flex-col justify-around items-center p-10 gap-10">
                    {userLoading ? <Loading></Loading> :
                        <Card className="w-full">
                            <CardHeader className="text-4xl font-black">User Info</CardHeader>
                            <CardContent className="text-lg">
                                <ul className="space-y-2">
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
                        <CardHeader className="text-4xl font-black">Emergency Contact</CardHeader>
                        <CardContent className="text-lg">
                            <ul className="space-y-2">
                                {Object.entries(emergencyData).map(([key, value]) => (
                                    <li key={key}>
                                        <span className="font-bold uppercase">{key}{" : "}</span>
                                        <span>{value}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={() => setActiveDialog("emergencyContact")}>Update Emergency Contact</Button>
                        </CardFooter>
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

                                <Separator className="my-4" />
                                <h3 className="text-lg font-semibold">Default Location</h3>

                                <div className="grid gap-2">
                                    <Label htmlFor="defaultLocation.name">Location Name</Label>
                                    <Input
                                        id="defaultLocation.name"
                                        name="defaultLocation.name"
                                        value={formData.location.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="defaultLocation.lat">Latitude</Label>
                                        <Input
                                            id="defaultLocation.lat"
                                            name="defaultLocation.lat"
                                            value={formData.location.lat}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="defaultLocation.long">Longitude</Label>
                                        <Input
                                            id="defaultLocation.long"
                                            name="defaultLocation.long"
                                            value={formData.location.long}
                                            onChange={handleInputChange}
                                        />
                                    </div>
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

            <AlertDialog open={activeDialog === "emergencyContact"} onOpenChange={() => setActiveDialog(activeDialog === "emergencyContact" ? "" : "emergencyContact")}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Update Emergency Contact</AlertDialogTitle>
                        <AlertDialogDescription>
                            <div className="space-y-4 mt-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="emergency_name">Name</Label>
                                    <Input
                                        id="emergency_name"
                                        name="name"
                                        value={emergencyFormData.name}
                                        onChange={handleEmergencyInputChange}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="emergency_phone">Phone</Label>
                                    <Input
                                        id="emergency_phone"
                                        name="phone"
                                        value={emergencyFormData.phone}
                                        onChange={handleEmergencyInputChange}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="emergency_email">Email</Label>
                                    <Input
                                        id="emergency_email"
                                        name="email"
                                        value={emergencyFormData.email}
                                        onChange={handleEmergencyInputChange}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="emergency_relation">Relation</Label>
                                    <Input
                                        id="emergency_relation"
                                        name="relation"
                                        value={emergencyFormData.relation}
                                        onChange={handleEmergencyInputChange}
                                    />
                                </div>

                                <Separator className="my-4" />
                                <h3 className="text-lg font-semibold">Emergency Contact Location</h3>

                                <div className="grid gap-2">
                                    <Label htmlFor="location.name">Location Name</Label>
                                    <Input
                                        id="location.name"
                                        name="location.name"
                                        value={emergencyFormData.location.name}
                                        onChange={handleEmergencyInputChange}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="location.lat">Latitude</Label>
                                        <Input
                                            id="location.lat"
                                            name="location.lat"
                                            value={emergencyFormData.location.lat}
                                            onChange={handleEmergencyInputChange}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="location.long">Longitude</Label>
                                        <Input
                                            id="location.long"
                                            name="location.long"
                                            value={emergencyFormData.location.long}
                                            onChange={handleEmergencyInputChange}
                                        />
                                    </div>
                                </div>

                                {emergencyUpdateStatus && (
                                    <p className={`mt-2 text-sm ${emergencyUpdateStatus.includes("Failed") || emergencyUpdateStatus.includes("error") ? "text-red-500" : "text-green-500"}`}>
                                        {emergencyUpdateStatus}
                                    </p>
                                )}
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleUpdateEmergencyContact}>Update</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
