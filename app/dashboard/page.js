"use client";

import { useContext, useEffect, useState } from "react";
import {
  getSOSRequests,
  createSOSRequest,
  updateSOSRequest,
} from "@/services/sosRequestService";
import { isWithinRange, getLocationName } from "@/services/locationService";
import { AuthContext } from "@/providers/AuthProvider";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

export default function Page() {
  const [sosRequests, setSosRequests] = useState([]);
  const [nearbyRequests, setNearbyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSOS, setSelectedSOS] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [activeSOS, setActiveSOS] = useState(null);
  const [activatingSOSState, setActivatingSOSState] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchSOSRequests = async () => {
      try {
        // Get all SOS requests
        const result = await getSOSRequests();

        if (result && result.data) {
          setSosRequests(result.data);

          // Check if user has any active SOS
          if (user && user.email) {
            const activeUserSOS = result.data.find(
              (sos) => sos.user === user.email && sos.isActive === true
            );

            if (activeUserSOS) {
              setActiveSOS(activeUserSOS);
            }
          }

          // Filter SOS requests that are within range (1000 meters = 1km) AND active
          if (
            user &&
            user.location &&
            user.location.lat &&
            user.location.long
          ) {
            const userLocation = [user.location.lat, user.location.long];
            setUserLocation({
              lat: user.location.lat,
              long: user.location.long,
            });

            const nearby = result.data.filter((request) => {
              if (
                request.location &&
                request.location.lat &&
                request.location.long &&
                request.isActive === true
              ) {
                const requestLocation = [
                  request.location.lat,
                  request.location.long,
                ];
                // Check if the request is within 5km of the user
                return isWithinRange(userLocation, requestLocation, 20000);
              }
              return false;
            });
            setNearbyRequests(nearby);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching SOS requests:", error);
        setLoading(false);
      }
    };

    fetchSOSRequests();

    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, [user]);

  const handleRespond = async (sosRequest) => {
    setSelectedSOS(sosRequest);
    setShowModal(true);
    setLocationLoading(true);

    try {
      const name = await getLocationName(
        sosRequest.location.lat,
        sosRequest.location.long
      );
      setLocationName(name || "Location name not available");
    } catch (error) {
      console.error("Error fetching location name:", error);
      setLocationName("Error fetching location name");
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSOSToggle = async () => {
    if (activatingSOSState) return; // Prevent multiple clicks while processing

    setActivatingSOSState(true);

    try {
      if (activeSOS) {
        // Deactivate existing SOS
        await updateSOSRequest(
          { _id: activeSOS._id },
          { isActive: false }
        ).then(() => {
          window.location.reload();
        });
        setActiveSOS(null);
      } else {
        // Create a new active SOS
        // Use the most current location
        const currentLocation =
          userLocation ||
          (user && user.location
            ? { lat: user.location.lat, long: user.location.long }
            : null);

        if (!currentLocation) {
          alert(
            "Cannot send SOS: Location not available. Please enable location services."
          );
          setActivatingSOSState(false);
          return;
        }

        const sosData = {
          user: user.email,
          location: currentLocation,
          date: new Date(),
          isActive: true,
        };

        const result = await createSOSRequest(sosData).then(() => {
          window.location.reload();
        });
        if (result && result.data) {
          setActiveSOS(result.data);
        }
      }
    } catch (error) {
      console.error("Error toggling SOS state:", error);
      alert("Error activating/deactivating SOS. Please try again.");
    } finally {
      setActivatingSOSState(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-20">
        <Loading />
      </div>
    );
  }

  if (!user || !user.location) {
    return (
      <div className="flex justify-center items-center p-10">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle className="text-center text-red-600">
              Location Not Available
            </CardTitle>
          </CardHeader>
          <div className="p-6 text-center">
            <p>
              Please update your profile with your location to see nearby SOS
              requests.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* SOS Activation Button */}
      <div className="mb-10 flex flex-col items-center">
        <Button
          size="lg"
          className={`text-2xl p-8 ${activeSOS
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
            } w-full max-w-md shadow-lg transition-all transform hover:scale-105`}
          onClick={handleSOSToggle}
          disabled={activatingSOSState}
        >
          {activatingSOSState
            ? "Processing..."
            : activeSOS
              ? "SOS ACTIVE - Click to Deactivate"
              : "ACTIVATE SOS EMERGENCY"}
        </Button>
        {activeSOS && (
          <p className="mt-2 text-center text-red-500 font-semibold">
            Your emergency SOS is active and visible to nearby users
          </p>
        )}
      </div>

      <h1 className="text-3xl font-bold mb-6 text-red-600">
        SOS Requests Within Your Range
      </h1>

      {nearbyRequests.length === 0 ? (
        <div className="text-center p-10">
          <p className="text-lg">No SOS requests found within your range.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nearbyRequests.map((request) => (
            <Card
              key={request._id}
              className="border-red-500 shadow-md hover:shadow-lg transition-shadow"
            >
              <CardHeader className="bg-red-50 dark:bg-red-900/20">
                <CardTitle className="text-red-600">Emergency SOS</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Sent by:{" "}
                    <span className="font-semibold">{request.user}</span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Date:{" "}
                    <span className="font-semibold">
                      {new Date(request.date).toLocaleString()}
                    </span>
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-red-200 hover:bg-green-700"
                  onClick={() => handleRespond(request)}
                >
                  Respond to Emergency
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* SOS Details Modal */}
      <AlertDialog open={showModal} onOpenChange={setShowModal}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">
              Emergency SOS Details
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedSOS && (
                <div className="space-y-4 mt-4">
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="text-sm font-medium">
                      Sent by:{" "}
                      <span className="font-bold">{selectedSOS.user}</span>
                    </p>
                    <p className="text-sm font-medium">
                      Date:{" "}
                      <span className="font-bold">
                        {new Date(selectedSOS.date).toLocaleString()}
                      </span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold">Location Details:</h3>
                    <p className="text-sm">
                      <span className="font-medium">Latitude:</span>{" "}
                      {selectedSOS.location.lat}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Longitude:</span>{" "}
                      {selectedSOS.location.long}
                    </p>
                    <div className="pt-2">
                      <p className="text-sm font-medium">Location Name:</p>
                      {locationLoading ? (
                        <p className="text-sm italic">
                          Loading location name...
                        </p>
                      ) : (
                        <p className="text-sm break-words">{locationName}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <Link
              href={`/singleusermap?lat=${selectedSOS?.location.lat}&long=${selectedSOS?.location.long}`}
            >
              <AlertDialogAction className="bg-yellow-100 hover:bg-yellow-300">
                Show On Map
              </AlertDialogAction>
            </Link>
            <Link href="/emergency">
              <AlertDialogAction className="bg-red-300 hover:bg-red-500">
                Contact Emergency Services
              </AlertDialogAction>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
