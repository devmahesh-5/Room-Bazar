import axios from "axios";
const API = import.meta.env.VITE_API_BASE_URL;
class roommateServices {
    async registerRoommate(formData) {
        try {
            const response = await axios.post(`${API}/api/v1/roommates/register`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            if (!response) {
                throw new Error("Error adding roommate");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async updateRoommate(formData) {
        try {
            const response = await axios.patch(`${API}/api/v1/roommates/update-account`, formData, {

                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true

            });
            if (!response) {

                throw new Error("Error updating roommate");
            }
            return response;
        } catch (error) {
            console.log(error)
        }
    }

    async deleteRoommateAccount() {
        try {
            const response = await axios.delete(`${API}/api/v1/roommates/delete-account`,{
                withCredentials: true
            });
            if (!response) {
                throw new Error("Error deleting roommate");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async getRoommateById(roommateId) {
        try {
            const response = await axios.get(`${API}/api/v1/roommates/profile/${roommateId}`,{
                withCredentials: true
            });
            if (!response) {
                throw new Error("Error getting roommate");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async searchRoommates(page, limit, data) {
        try {
            const { query, field } = data
            const response = await axios.get(`${API}/api/v1/roommates/search?page=${page}&limit=${limit}&query=${query}&field=${field}`,{
                withCredentials: true
            });
            if (!response) {
                throw new Error("Error searching roommates");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async getRoommateByJob(job) {
        try {
            const response = await axios.get(`${API}/api/v1/roommates/job/${job}`,{
                withCredentials: true
            });
            if (!response) {
                throw new Error("Error getting roommate");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async getMyRoommates() {
        try {
            const response = await axios.get(`${API}/api/v1/roommates/my-roommates`,{
                withCredentials: true
            });
            if (!response) {
                throw new Error("Error getting roommates");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async getMyRoommateAccount() {
        try {
            const response = await axios.get(`${API}/api/v1/roommates/myprofile`,{
                withCredentials: true
            });
            if (!response) {
                throw new Error("Error getting roommate");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async getNonRoommates(page, limit) {
        try {
            const response = await axios.get(`${API}/api/v1//roommates/non-roommates?page=${page}&limit=${limit}`,{
                withCredentials: true
            });
            if (!response) {
                throw new Error("Error getting roommates");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async sendRoommateRequest(roommateId) {
        try {
            const response = await axios.post(`${API}/api/v1/roommates/sendrequest/${roommateId}`,{
                withCredentials: true
            });
            if (!response) {
                throw new Error("Error sending roommate request");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async acceptRoommateRequest(roommateId) {
        try {
            const response = await axios.patch(`${API}/api/v1/roommates/acceptrequest/${roommateId}`,{
                withCredentials: true
            });
            if (!response) {
                throw new Error("Error accepting roommate request");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async rejectRoommateRequest(roommateId) {
        try {
            const response = await axios.patch(`${API}/api/v1/roommates/rejectrequest/${roommateId}`,{
                withCredentials: true
            });
            if (!response) {
                throw new Error("Error rejecting roommate request");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async cancelRoommateRequest(roommateId) {
        try {
            const response = await axios.delete(`${API}/api/v1/roommates/cancelrequest/${roommateId}`,{
                withCredentials: true
            });
            if (!response) {
                throw new Error("Error canceling roommate request");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async getSentRoommateRequests() {
        try {
            const response = await axios.get(`${API}/api/v1/roommates/sentrequests`,{
                withCredentials: true
            });
            if (!response) {
                throw new Error("Error getting roommate requests");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async getReceivedRoommateRequests() {
        try {
            const response = await axios.get(`${API}/api/v1/roommates/receivedrequests`,{
                withCredentials: true
            });
            if (!response) {
                throw new Error("Error getting roommate requests");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async deleteRoommate(roommateId) {
        try {
            const response = await axios.delete(`${API}/api/v1/roommates/delete/${roommateId}`,{
                withCredentials: true
            });
            if (!response) {
                throw new Error("Error deleting roommate");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

}

const roommateService = new roommateServices();
export default roommateService