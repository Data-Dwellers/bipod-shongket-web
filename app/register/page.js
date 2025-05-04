"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthContext } from "@/providers/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function LogIn() {
    const router = useRouter();
    // Setup firebase auth functions
    const authContext = useContext(AuthContext);
    const {
        control,
        handleSubmit,
        setError,
        setValue,
        formState: { errors },
    } = useForm();
    const [authError, setAuthError] = useState();

    // User location states
    const [location, setLocation] = useState(null);
    const [locationName, setLocationName] = useState("");

    // Emergency contact location states
    const [emergencyLocation, setEmergencyLocation] = useState(null);
    const [emergencyLocationName, setEmergencyLocationName] = useState("");

    // Location search states
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showLocationDialog, setShowLocationDialog] = useState(false);
    const [activeLocationField, setActiveLocationField] = useState("user"); // "user" or "emergency"

    const locationInputRef = useRef(null);
    const emergencyLocationInputRef = useRef(null);

    // Function to get current location
    const getCurrentLocation = (locationType = "user") => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const long = position.coords.longitude;

                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=json`
                        );
                        const data = await response.json();

                        if (locationType === "user") {
                            setLocation({ lat, long });
                            setLocationName(data.display_name);
                            setValue("location", { name: data.display_name, lat, long });
                        } else {
                            setEmergencyLocation({ lat, long });
                            setEmergencyLocationName(data.display_name);
                            setValue("emergency_contact.location", { name: data.display_name, lat, long });
                        }
                    } catch (error) {
                        console.error("Error getting location name:", error);
                        const displayName = `Lat: ${lat.toFixed(4)}, Long: ${long.toFixed(4)}`;

                        if (locationType === "user") {
                            setLocation({ lat, long });
                            setLocationName(displayName);
                            setValue("location", { name: displayName, lat, long });
                        } else {
                            setEmergencyLocation({ lat, long });
                            setEmergencyLocationName(displayName);
                            setValue("emergency_contact.location", { name: displayName, lat, long });
                        }
                    }
                },
                (error) => {
                    console.error("Error getting geolocation:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    // Function to search for locations
    const searchLocations = async () => {
        if (!searchQuery.trim()) return;
        setIsSearching(true);

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=5`
            );
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error("Error searching locations:", error);
        } finally {
            setIsSearching(false);
        }
    };

    // Function to select a location from search results
    const selectLocation = (result) => {
        const lat = parseFloat(result.lat);
        const long = parseFloat(result.lon);

        if (activeLocationField === "user") {
            setLocation({ lat, long });
            setLocationName(result.display_name);
            setValue("location", { name: result.display_name, lat, long });
        } else {
            setEmergencyLocation({ lat, long });
            setEmergencyLocationName(result.display_name);
            setValue("emergency_contact.location", { name: result.display_name, lat, long });
        }

        setShowLocationDialog(false);
        setSearchResults([]);
        setSearchQuery("");
    };

    // Function to open location dialog for a specific field
    const openLocationDialog = (locationType) => {
        setActiveLocationField(locationType);
        setShowLocationDialog(true);
    };

    const submitHandler = async (data) => {
        console.log(`Trying to register ${data}`);
        authContext
            .createUser({ ...data })
            .then(async (result) => {
                console.log(result.user);
                router.push("/");
            })
            .catch((error) => {
                setAuthError(error.message);
                setError(errors);
                console.error(error);
            });
    };

    return (
        <div className="flex flex-col items-center w-full h-full">
            <h1 className="text-5xl p-5 text-red-600">Register your account</h1>
            <div className="grid gap-6 min-w-96 max-w-2xl mb-10">
                <form
                    className="space-y-4"
                    onSubmit={handleSubmit(submitHandler)}
                >
                    <div>
                        <Label className="mb-2">Name</Label>
                        <Controller
                            control={control}
                            name="name"
                            defaultValue=""
                            rules={{
                                required: "Name is required",
                            }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="name"
                                    placeholder="John Doe"
                                    type="text"
                                />
                            )}
                        />
                    </div>
                    <div>
                        <Label className="mb-2">Email</Label>
                        <Controller
                            control={control}
                            name="email"
                            defaultValue=""
                            rules={{
                                required: "Email is required",
                            }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="email"
                                    placeholder="name@example.com"
                                    type="email"
                                    autoComplete="email"
                                />
                            )}
                        />
                    </div>
                    <div>
                        <Label className="mb-2">Password</Label>
                        <Controller
                            control={control}
                            name="password"
                            defaultValue=""
                            rules={{
                                required: "Password is mandatory",
                            }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="password"
                                    type="password"
                                    placeholder="password"
                                />
                            )}
                        />
                    </div>
                    <div>
                        <Label className="mb-2">Default Location</Label>
                        <div className="flex gap-2">
                            <Controller
                                control={control}
                                name="location"
                                defaultValue=""
                                rules={{
                                    required: "Location is required",
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        ref={locationInputRef}
                                        id="location"
                                        placeholder="Your default location"
                                        value={locationName}
                                        onChange={(e) => setLocationName(e.target.value)}
                                        onClick={() => openLocationDialog("user")}
                                        readOnly
                                    />
                                )}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => getCurrentLocation("user")}
                                title="Get current location"
                            >
                                📍
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => openLocationDialog("user")}
                                title="Search location"
                            >
                                🔍
                            </Button>
                        </div>
                    </div>
                    <div>
                        <Label className="mb-2">Age</Label>
                        <Controller
                            control={control}
                            name="age"
                            defaultValue=""
                            rules={{
                                required: "Age is required",
                            }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="age"
                                    placeholder="0"
                                    type="number"
                                />
                            )}
                        />
                    </div>
                    <div>
                        <Label className="mb-2">Phone Number</Label>
                        <Controller
                            control={control}
                            name="phone"
                            defaultValue=""
                            rules={{
                                required: "Phone number is required",
                            }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="phone"
                                    placeholder="01521111913"
                                    type="tel"
                                />
                            )}
                        />
                    </div>

                    {/* Emergency Contact Section */}
                    <Separator className="my-6" />
                    <h2 className="text-xl font-semibold">Emergency Contact Information</h2>

                    <div>
                        <Label className="mb-2">Contact Name</Label>
                        <Controller
                            control={control}
                            name="emergency_contact.name"
                            defaultValue=""
                            rules={{
                                required: "Emergency contact name is required",
                            }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="emergency_name"
                                    placeholder="Jane Doe"
                                    type="text"
                                />
                            )}
                        />
                    </div>

                    <div>
                        <Label className="mb-2">Contact Phone</Label>
                        <Controller
                            control={control}
                            name="emergency_contact.phone"
                            defaultValue=""
                            rules={{
                                required: "Emergency contact phone is required",
                            }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="emergency_phone"
                                    placeholder="01521111914"
                                    type="tel"
                                />
                            )}
                        />
                    </div>

                    <div>
                        <Label className="mb-2">Contact Email</Label>
                        <Controller
                            control={control}
                            name="emergency_contact.email"
                            defaultValue=""
                            rules={{
                                required: "Emergency contact email is required",
                            }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="emergency_email"
                                    placeholder="emergency@example.com"
                                    type="email"
                                />
                            )}
                        />
                    </div>

                    <div>
                        <Label className="mb-2">Relation to You</Label>
                        <Controller
                            control={control}
                            name="emergency_contact.relation"
                            defaultValue=""
                            rules={{
                                required: "Relation is required",
                            }}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select relation" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="parent">Parent</SelectItem>
                                        <SelectItem value="spouse">Spouse</SelectItem>
                                        <SelectItem value="sibling">Sibling</SelectItem>
                                        <SelectItem value="child">Child</SelectItem>
                                        <SelectItem value="friend">Friend</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    <div>
                        <Label className="mb-2">Contact Location</Label>
                        <div className="flex gap-2">
                            <Controller
                                control={control}
                                name="emergency_contact.location"
                                defaultValue=""
                                rules={{
                                    required: "Emergency contact location is required",
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        ref={emergencyLocationInputRef}
                                        id="emergency_location"
                                        placeholder="Emergency contact location"
                                        value={emergencyLocationName}
                                        onChange={(e) => setEmergencyLocationName(e.target.value)}
                                        onClick={() => openLocationDialog("emergency")}
                                        readOnly
                                    />
                                )}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => getCurrentLocation("emergency")}
                                title="Get current location for emergency contact"
                            >
                                📍
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => openLocationDialog("emergency")}
                                title="Search location for emergency contact"
                            >
                                🔍
                            </Button>
                        </div>
                    </div>

                    {authError && (
                        <span className="text-destructive">{authError}</span>
                    )}
                    {errors &&
                        Object.entries(errors).map(([field, err]) => (
                            <p key={field} className="text-destructive">
                                {err.message}
                            </p>
                        ))}
                    <Button type="submit" className="w-full">
                        Register
                    </Button>
                </form>
                <p className="px-8 text-center text-sm text-muted-foreground">
                    {"Already have an account? "}
                    <Link href="/log-in">
                        <span className="cursor-pointer font-semibold underline underline-offset-4 hover:text-primary">
                            Log in
                        </span>
                    </Link>
                    .
                </p>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                </div>
            </div>

            {/* Location Search Dialog */}
            <AlertDialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
                <AlertDialogContent className="sm:max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {activeLocationField === "user"
                                ? "Search for your location"
                                : "Search for emergency contact's location"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Enter a location name or address to search
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex items-center space-x-2 py-4">
                        <Input
                            placeholder="Search locations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    searchLocations();
                                }
                            }}
                        />
                        <Button onClick={searchLocations} disabled={isSearching}>
                            {isSearching ? 'Searching...' : 'Search'}
                        </Button>
                    </div>
                    {searchResults.length > 0 && (
                        <div className="max-h-[300px] overflow-y-auto">
                            {searchResults.map((result) => (
                                <Card
                                    key={result.place_id}
                                    className="p-3 mb-2 cursor-pointer hover:bg-muted"
                                    onClick={() => selectLocation(result)}
                                >
                                    <p className="text-sm">{result.display_name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {result.type}, {result.lat.substring(0, 6)}, {result.lon.substring(0, 6)}
                                    </p>
                                </Card>
                            ))}
                        </div>
                    )}
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button onClick={() => getCurrentLocation(activeLocationField)}>
                            Use Current Location
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
