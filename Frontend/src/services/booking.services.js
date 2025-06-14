import axios from "axios";
import api from "./apiconfig.js";
const API = import.meta.env.VITE_API_BASE_URL;
class bookingServices {
    async getMyBookings() {
        try {
            const response = await axios.get(`${API}/api/v1/bookings/my-bookings`)
            if (!response) {
                throw new Error("Error getting bookings");
            }
            return response.data
        } catch (error) {
            throw error
        }
    }

    async updateBooking(bookingId) {
        try {
            const response = await axios.patch(`${API}/api/v1/bookings/checkin/${bookingId}`,{
                withCredentials: true
            });
            if (!response) {
                throw new Error("Error updating booking");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }
}

const bookingService = new bookingServices();

export default bookingService