import axios from "axios";

class messageServices {
    async sendMessage(userId, formData) {
        try {
            const response = await axios.post(`/api/v1/messages/ib/${userId}`, formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
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

    async getMessages(userId) {
        try {
            const response = await axios.get(`/api/v1/messages/ib/${userId}`);
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
            const response = await axios.get(`/api/v1/messages`);
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
            const response = await axios.delete(`/api/v1/messages/${messageId}`);
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