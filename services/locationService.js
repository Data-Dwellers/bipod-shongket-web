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