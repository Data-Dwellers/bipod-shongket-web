import axiosClient from "./axiosBase";
import { getPreciseDistance } from 'geolib';

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
const center = { latitude: 23.7600768, longitude: 90.4331264 };
const nearby = { latitude: 23.7645,    longitude: 90.4375    };

const rangeCheck = isWithinRange(center, point, 1000); 
1000m

rangeCheck will be either true or false
 */

export function isWithinRange(center, point, range) {
    const distance = getPreciseDistance(
        { latitude: center[0], longitude: center[1] },
        { latitude: point[0], longitude: point[1] },
        1 // accuracy in metres (optional)
    );
    return distance <= range;
}