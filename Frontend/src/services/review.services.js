import axios  from "axios";
const API = import.meta.env.VITE_API_BASE_URL;
class reviewServices {
    async addReview(roomId, data) {
        try {
            const response = await axios.post(`${API}/api/v1/rooms/reviews/${roomId}`, data);
            if (!response) {
                throw new Error("Error adding review");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async updateReview(roomId, reviewId, data) {
        try {
            const response = await axios.patch(`${API}/api/v1/rooms/reviews/${roomId}/${reviewId}`, data);
            if (!response) {
                throw new Error("Error updating review");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async deleteReview(roomId, reviewId) {
        try {
            const response = await axios.delete(`${API}/api/v1/rooms/reviews/${roomId}/${reviewId}`);
            if (!response) {
                throw new Error("Error deleting review");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async getRoomReviews(roomId) {
        try {
            const response = await axios.get(`${API}/api/v1/rooms/reviews/${roomId}`);
            if (!response) {
                throw new Error("Error getting room reviews");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }
}

const reviewService = new reviewServices();

export default reviewService;