import axios from "axios";
const API = import.meta.env.VITE_API_BASE_URL;
class roomServices {

    async addRoom(formData) {
        try {
            const response = await axios.post(`${API}/api/v1/rooms/add`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (!response) {
                throw new Error("Error adding room");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async updateRoom(roomId, formData) {
        try {
            const response = await axios.patch(`${API}/api/v1/rooms/update/${roomId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (!response) {
                throw new Error("Error updating room");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async getAllRooms(page, limit) {
        try {
            const response = await axios.get(`${API}/api/v1/rooms/`);
            if (!response) {
                throw new Error("Error getting rooms");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async getRoomById(roomId) {
        try {
            const response = await axios.get(`${API}/api/v1/rooms/${roomId}`);
            if (!response) {
                throw new Error("Error getting room");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async getRoomByLocation(location) {
        try {
            const response = await axios.get(`${API}/api/v1/rooms/location/${location}`);
            if (!response) {
                throw new Error("Error getting room");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async getRoomByCategory(category) {
        try {
            const response = await axios.get(`${API}/api/v1/rooms/category/${category}`);
            if (!response) {
                throw new Error("Error getting room");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async bookRoom(roomId) {
        try {
            const response = await axios.post(`${API}/api/v1/rooms/booking/${roomId}`);
            if (!response) {
                throw new Error("Error booking room");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async searchRooms(page=1, limit=10,data) {
        try {
            const response = await axios.get(`${API}/api/v1/rooms/search?page=${page}&limit=${limit}&query=${data.query}&field=${data.field}`);
            if (!response) {
                throw new Error("Error searching rooms");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async deleteRoom(roomId) {
        try {
            const response = await axios.delete(`${API}/api/v1/rooms/delete/${roomId}`);
            if (!response) {
                throw new Error("Error deleting room");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async getMyRooms() {
        try {
            const response = await axios.get(`${API}/api/v1/rooms/myrooms`);
            if (!response) {
                throw new Error("Error getting my rooms");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async requestRefund(roomId,reason) {
        try {
            const response = await axios.patch(`${API}/api/v1/rooms/refund/${roomId}`,{reason});
            if (!response) {
                throw new Error("Error requesting refund");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async addReport(roomId,reason) {
        try {
            const response = await axios.patch(`${API}/api/v1/rooms/addreport/${roomId}`,{reason});
            if (!response) {
                throw new Error("Error reporting room");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async getReport(roomId) {
        try {
            const response = await axios.get(`${API}/api/v1/rooms/reports/${roomId}`);
            if (!response) {
                throw new Error("Error getting reports");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async addToFavourites(roomId) {
        try {
            const response = await axios.post(`${API}/api/v1/rooms/${roomId}`);
            if (!response) {
                throw new Error("Error adding to favourites");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async removeFromFavourites(roomId) {
        try {
            const response = await axios.delete(`${API}/api/v1/rooms/${roomId}`);
            if (!response) {
                throw new Error("Error removing from favourites");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async updateRoomLocation(roomId, data) {
        try {
            const response = await axios.patch(`${API}/api/v1/rooms/location/${roomId}`, data);
            if (!response) {
                throw new Error("Error updating room location");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

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

    async updateRoomReview(roomId, reviewId, data) {
        try {
            const response = await axios.patch(`${API}/api/v1/rooms/reviews/${roomId}/${reviewId}`, data);
            if (!response) {
                throw new Error("Error updating room review");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async deleteRoomReview(roomId, reviewId) {
        try {
            const response = await axios.delete(`${API}/api/v1/rooms/reviews/${roomId}/${reviewId}`);
            if (!response) {
                throw new Error("Error deleting room review");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }
}

const roomService = new roomServices();

export default roomService