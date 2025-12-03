import axios from "axios";

// Fetch all cases
export const fetchCases = async () => {
    try {
        const response = await axios.get("/api/cases"); // adjust path if needed
        return response.data;
    } catch (error) {
        console.error("Error fetching cases:", error);
        throw error;
    }
};
