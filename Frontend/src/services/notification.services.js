import axios from "axios";
const API = import.meta.env.VITE_API_BASE_URL;
class notificationServices {
    async getMyNotifications() {
        try {
            const response = await axios.get(`${API}/api/v1/notifications`, {
                withCredentials: true
            });
            if (!response) {
                throw new Error("Error getting notifications");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async readNotification() {
        try {
            const response = await axios.post(`${API}/api/v1/notifications/markasread`, {}, {
                withCredentials: true
            });
            if (!response) {
                throw new Error("Error reading notification");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }
    
}

const notificationService = new notificationServices();
export default notificationService