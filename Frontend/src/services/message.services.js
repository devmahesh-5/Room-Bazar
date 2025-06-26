import axios from "axios";
const API = import.meta.env.VITE_API_BASE_URL;
class messageServices {
    async sendMessage(userId, formData) {
        try {
            const response = await axios.post(`${API}/api/v1/messages/ib/${userId}`, formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true
                }
            );
            if (!response) {
                throw new Error("Error sending message");
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getMessages(userId,limit=10) {
        try {
            const response = await axios.get(`${API}/api/v1/messages/ib/${userId}?limit=${limit}`,{
                withCredentials: true
            });
            if (!response) {
                throw new Error("Error getting messages");
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getUnreadMessagesPerson(){
        try {
            const response = await axios.get(`${API}/api/v1/messages/unread`,{
                withCredentials: true
            });
            if (!response) {
                throw new Error("Error getting messages");
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getMessageProfile() {
        try {
            const response = await axios.get(`${API}/api/v1/messages`,{
                withCredentials: true
            });
            if (!response) {
                throw new Error("Error getting messages");
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async deleteMessage(messageId) {
        try {
            const response = await axios.delete(`${API}/api/v1/messages/${messageId}`,{
                withCredentials: true
            });
            if (!response) {
                throw new Error("Error deleting message");
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    
}

const messageService = new messageServices();

export default messageService