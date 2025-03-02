import axios from "axios";

class notificationServices {
    async getMyNotifications() {
        try {
            const response = await axios.get(`/api/v1/notifications`);
            if (!response) {
                throw new Error("Error getting notifications");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }
}

const notificationService = new notificationServices();
export default notificationService