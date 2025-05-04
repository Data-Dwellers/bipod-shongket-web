import axiosClient from "./axiosBase";

export const createSpecialUser = async (userData) => {
    try {
        const response = await axiosClient.post("/api/special-users", userData);
        return response.data;
    } catch (error) {
        console.error("Error creating special user:", error);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to create special user",
        };
    }
};

export const getSpecialUsers = async (query = {}) => {
    try {
        const queryString = new URLSearchParams(query).toString();
        const url = queryString ? `/api/special-users?${queryString}` : "/api/special-users";
        const response = await axiosClient.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching special users:", error);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch special users",
        };
    }
};

export const updateSpecialUser = async (specialUserId, userData) => {
    try {
        const response = await axiosClient.put(`/api/special-users/${specialUserId}`, userData);
        return response.data;
    } catch (error) {
        console.error("Error updating special user:", error);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to update special user",
        };
    }
};
