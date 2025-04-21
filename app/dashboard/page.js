"use client";

import SOSRequestCard from "@/components/SOSRequestCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    createSOSRequest,
    deleteSOSRequest,
    getSOSRequests,
} from "@/services/sosRequestService";
import React, { useState } from "react";

export default function Dashboard() {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [reply, setReply] = useState(null);

    const handleSendSOS = async () => {
        setIsLoading(true);
        setMessage(null);
        try {
            // Get current location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const sosData = {
                            location: {
                                lat: position.coords.latitude,
                                long: position.coords.longitude,
                            },
                            date: new Date(),
                        };

                        const result = await createSOSRequest(sosData);

                        if (result) {
                            setMessage(
                                result.message ||
                                    "Your emergency signal has been sent successfully."
                            );
                        } else {
                            setMessage("Failed to send SOS request");
                        }
                        setIsLoading(false);
                    },
                    (error) => {
                        console.error("Error getting location:", error);
                        setMessage(
                            "Could not access your location. Please enable location services."
                        );
                        setIsLoading(false);
                    }
                );
            } else {
                setMessage("Geolocation is not supported by your browser.");
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error sending SOS:", error);
            setMessage("An unexpected error occurred while sending SOS");
            setIsLoading(false);
        }
    };

    const handleGetSOS = async () => {
        setIsLoading(true);
        setMessage(null);
        try {
            const result = await getSOSRequests();

            if (result && result.data) {
                // Display the data returned from the API instead of a success message
                setReply(result.data);
            } else {
                // Use result.message for error display as that's what the service returns
                setReply("Failed to retrieve SOS requests");
            }
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching SOS:", error);
            setReply(
                "An unexpected error occurred while fetching SOS requests"
            );
            setIsLoading(false);
        }
    };

    const handleDeleteSOS = async (query) => {
        setIsLoading(true);
        setMessage(null);
        try {
            const result = await deleteSOSRequest(query);

            if (result) {
                // Show success message
                setMessage(
                    result.message || "SOS request deleted successfully"
                );

                setReply(reply.filter((item) => item._id !== query._id));
            } else {
                // Show error message
                setMessage("Failed to delete SOS request");
            }
            setIsLoading(false);
        } catch (error) {
            console.error("Error deleting SOS:", error);
            setMessage(
                "An unexpected error occurred while deleting SOS request"
            );
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="space-y-10 p-10">
                <h1 className="text-5xl font-black">
                    This is a test button to send SOS
                </h1>
                <Button
                    size="lg"
                    className="text-4xl p-10"
                    variant="destructive"
                    onClick={handleSendSOS}
                    disabled={isLoading}
                >
                    {isLoading ? "Sending..." : "SOS"}
                </Button>

                {message && <div className="mt-4">{message}</div>}
            </div>
            <Separator></Separator>
            <div className="space-y-10 p-10">
                <h1 className="text-5xl font-black">
                    Button to get all the requests
                </h1>
                <Button
                    size="lg"
                    className="text-4xl p-10"
                    onClick={handleGetSOS}
                    disabled={isLoading}
                >
                    {isLoading ? "Getting..." : "SOS"}
                </Button>

                <div className="flex flex-col justify-center items-center gap-10">
                    {reply &&
                        reply.map((item) => (
                            <SOSRequestCard
                                key={item._id}
                                lat={item.location.lat}
                                long={item.location.long}
                                date={item.date}
                                id={item._id}
                                deleteHandler={handleDeleteSOS}
                            ></SOSRequestCard>
                        ))}
                </div>
            </div>
        </>
    );
}
