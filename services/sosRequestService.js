import axiosClient from "./axiosBase";

export const createSOSRequest = async (requestData) => {
    try {
        const response = await axiosClient.post(
            "/api/sos-requests",
            requestData
        );
        return response.data;
    } catch (error) {
        console.error("Error creating SOS request:", error);
        return {
            success: false,
            message:
                error.response?.data?.message || "Failed to create SOS request",
        };
    }
};

export const getSOSRequests = async (query = {}) => {
    try {
        const queryString = new URLSearchParams(query).toString();
        const url = queryString
            ? `/api/sos-requests?${queryString}`
            : "/api/sos-requests";
        const response = await axiosClient.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching SOS requests:", error);
        return {
            success: false,
            message:
                error.response?.data?.message || "Failed to fetch SOS requests",
        };
    }
};

export const updateSOSRequest = async (query = {}, requestData) => {
    try {
        if (Object.keys(query).length === 0) {
            return {
                success: false,
                message: "Query parameters are required for update operation",
            };
        }

        const queryString = new URLSearchParams(query).toString();
        const response = await axiosClient.put(
            `/api/sos-requests?${queryString}`,
            requestData
        );
        return response.data;
    } catch (error) {
        console.error("Error updating SOS request:", error);
        return {
            success: false,
            message:
                error.response?.data?.message || "Failed to update SOS request",
        };
    }
};

export const deleteSOSRequest = async (query = {}) => {
    try {
        if (Object.keys(query).length === 0) {
            return {
                success: false,
                message: "Query parameters are required for delete operation",
            };
        }

        const queryString = new URLSearchParams(query).toString();
        const response = await axiosClient.delete(
            `/api/sos-requests?${queryString}`
        );
        return response.data;
    } catch (error) {
        console.error("Error deleting SOS request:", error);
        return {
            success: false,
            message:
                error.response?.data?.message || "Failed to delete SOS request",
        };
    }
};
