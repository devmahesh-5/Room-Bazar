import axios from "axios";

class bookingServices {
    async getMyBookings() {
        try {
            const response = await axios.get('/api/v1/bookings/my-bookings')
            if (!response) {
                throw new Error("Error getting bookings");
            }
            return response.data
        } catch (error) {
            throw error
        }
    }
}

const bookingService = new bookingServices();

export default bookingService