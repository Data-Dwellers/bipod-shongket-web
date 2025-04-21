import axiosClient from "./axiosBase";

export const createReport = async (reportData) => {
    try {
        const response = await axiosClient.post("/api/reports", reportData);
        return response.data;
    } catch (error) {
        console.error("Error creating report:", error);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to create report",
        };
    }
};

export const getReports = async (query = {}) => {
    try {
        const queryString = new URLSearchParams(query).toString();
        const url = queryString
            ? `/api/reports?${queryString}`
            : "/api/reports";
        const response = await axiosClient.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching reports:", error);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch reports",
        };
    }
};

export const updateReport = async (query = {}, reportData) => {
    try {
        if (Object.keys(query).length === 0) {
            return {
                success: false,
                message: "Query parameters are required for update operation",
            };
        }

        const queryString = new URLSearchParams(query).toString();
        const response = await axiosClient.put(
            `/api/reports?${queryString}`,
            reportData
        );
        return response.data;
    } catch (error) {
        console.error("Error updating report:", error);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to update report",
        };
    }
};

export const deleteReport = async (query = {}) => {
    try {
        if (Object.keys(query).length === 0) {
            return {
                success: false,
                message: "Query parameters are required for delete operation",
            };
        }

        const queryString = new URLSearchParams(query).toString();
        const response = await axiosClient.delete(
            `/api/reports?${queryString}`
        );
        return response.data;
    } catch (error) {
        console.error("Error deleting report:", error);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to delete report",
        };
    }
};
