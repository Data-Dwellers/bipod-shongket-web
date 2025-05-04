import { getPreciseDistance } from 'geolib';
import axiosClient from "./axiosBase";

export const getLocation = async (lat, long) => {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=json&addressdetails=1`
        const response = await axiosClient.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching location:", error);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch location",
        };
    }
};

export const getLocationName = async (lat, long) => {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=json&addressdetails=1`
        const response = await axiosClient.get(url);
        return response?.data?.display_name;
    } catch (error) {
        console.error("Error fetching location:", error);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch location",
        };
    }
};



/**
isWithinRange([23.7937, 90.4066], [23.7937, 90.4066], 1000);
1000m
 */
export function isWithinRange(center, point, range) {
    // Convert coordinates to standard geolib format if they're in array form
    const centerCoords = Array.isArray(center)
        ? { latitude: center[0], longitude: center[1] }
        : center;

    const pointCoords = Array.isArray(point)
        ? { latitude: point[0], longitude: point[1] }
        : point;

    // Calculate distance in meters using geolib's getPreciseDistance
    const distance = getPreciseDistance(
        centerCoords,
        pointCoords
    );

    // Return true if point is within range, false otherwise
    return distance <= range;
}