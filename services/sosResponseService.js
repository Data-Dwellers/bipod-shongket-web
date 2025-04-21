import axiosClient from "./axiosBase";

export const createSOSResponse = async (responseData) => {
    try {
        const response = await axiosClient.post(
            "/api/sos-responses",
            responseData
        );
        return response.data;
    } catch (error) {
        console.error("Error creating SOS response:", error);
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "Failed to create SOS response",
        };
    }
};

export const getSOSResponses = async (query = {}) => {
    try {
        const queryString = new URLSearchParams(query).toString();
        const url = queryString
            ? `/api/sos-responses?${queryString}`
            : "/api/sos-responses";
        const response = await axiosClient.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching SOS responses:", error);
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "Failed to fetch SOS responses",
        };
    }
};

export const updateSOSResponse = async (query = {}, responseData) => {
    try {
        if (Object.keys(query).length === 0) {
            return {
                success: false,
                message: "Query parameters are required for update operation",
            };
        }

        const queryString = new URLSearchParams(query).toString();
        const response = await axiosClient.put(
            `/api/sos-responses?${queryString}`,
            responseData
        );
        return response.data;
    } catch (error) {
        console.error("Error updating SOS response:", error);
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "Failed to update SOS response",
        };
    }
};

export const deleteSOSResponse = async (query = {}) => {
    try {
        if (Object.keys(query).length === 0) {
            return {
                success: false,
                message: "Query parameters are required for delete operation",
            };
        }

        const queryString = new URLSearchParams(query).toString();
        const response = await axiosClient.delete(
            `/api/sos-responses?${queryString}`
        );
        return response.data;
    } catch (error) {
        console.error("Error deleting SOS response:", error);
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "Failed to delete SOS response",
        };
    }
};
