import axiosClient from "./axiosBase";

export const createUserDB = async (userData) => {
    try {
        const response = await axiosClient.post("/api/users", userData);
        return response.data;
    } catch (error) {
        console.error("Error creating user:", error);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to create user",
        };
    }
};

export const getUsers = async (query = {}) => {
    try {
        const queryString = new URLSearchParams(query).toString();
        const url = queryString ? `/api/users?${queryString}` : "/api/users";
        const response = await axiosClient.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch users",
        };
    }
};

export const updateUser = async (query = {}, userData) => {
    try {
        if (Object.keys(query).length === 0) {
            return {
                success: false,
                message: "Query parameters are required for update operation",
            };
        }

        const queryString = new URLSearchParams(query).toString();
        const response = await axiosClient.put(
            `/api/users?${queryString}`,
            userData
        );
        return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to update user",
        };
    }
};

export const deleteUser = async (query = {}) => {
    try {
        if (Object.keys(query).length === 0) {
            return {
                success: false,
                message: "Query parameters are required for delete operation",
            };
        }

        const queryString = new URLSearchParams(query).toString();
        const response = await axiosClient.delete(`/api/users?${queryString}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting user:", error);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to delete user",
        };
    }
};
