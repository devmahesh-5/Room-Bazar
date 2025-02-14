import axios from "axios";
class authServices {
    
    async registerUser(formData) {
   
        try {
            const response = await axios.post("/api/v1/users/register", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
    
            if (!response || !response.data) {
                throw new Error("Invalid response from server");
            }
    
            return response.data;
        } catch (error) {
            console.error("Error registering user:", error.response?.data || error.message);
            throw error; // Rethrow the error so it can be handled in UI
        }
    }
    
    async loginUser(data) {
        try {
            const response = await axios.post("/api/v1/users/login", data);
            
            if (!response) {
                throw new Error("Error logging in user");
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async logoutUser() {
        try {
            const response = await axios.post("/api/v1/users/logout",
                {
                    withCredentials: true
                }
            );
            if (!response) {
                throw new Error("Error logging out user");
            }
            return response.data;
        } catch (error) {
            console.error("Error logging out user:", error);
        }
    }

    async getCurrentUser() {
        try {
            const response = await axios.get("/api/v1/users/myprofile",
                {
                    withCredentials: true
                }
            );
            if (!response) {
                throw new Error("Error getting current user");
            }
            return response.data;
        } catch (error) {
            console.error("Error getting current user:", error);
        }
    }

    async updatePassword({ oldPassword, newPassword }) {
        try {
            const response = await axios.patch("/api/v1/users/change-password", { oldPassword, newPassword });
            if (!response) {
                throw new Error("Error updating password");
            }
            return response.data;
        } catch (error) {
            console.error("Error updating password:", error);
        }
    }

    async updateProfile({ fullName, email, phone, address }) {
        try {
            const response = await axios.patch("/api/v1/users/updateprofile", { fullName, email, phone, address });
            if (!response) {
                throw new Error("Error updating profile");
            }
            return response.data;
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    }

    async updateProfilePic({ avatar }) {
        try {
            const response = await axios.patch("/api/v1/users/updateprofilepicture", { avatar });
            if (!response) {
                throw new Error("Error updating profile pic");
            }
            return response.data;
        } catch (error) {
            console.error("Error updating profile pic:", error);
        }
    }
    async updateCoverImage({ coverImage }) {
        try {
            const response = await axios.patch("/api/v1/users/updatecoverimage", { coverImage });
            if (!response) {
                throw new Error("Error updating cover image");
            }
            return response.data;
        } catch (error) {
            console.error("Error updating cover image:", error);
        }
    }

    async getMyLocation() {
        try {
            const response = await axios.get("/api/v1/users/mylocation",
                {
                    withCredentials: true
                }
            );
            if (!response) {
                throw new Error("Error getting my location");
            }
            return response.data;
        } catch (error) {
            console.error("Error getting my location:", error);
        }
    }

    async deleteUserAccount() {
        try {
            const response = await axios.delete("/api/v1/users/delete-account",
                {
                    withCredentials: true
                }
            );
            if (!response) {
                throw new Error("Error deleting user account");
            }
            return response.data;
        } catch (error) {
            console.error("Error deleting user account:", error);
        }
    } 
    
    async getUseDashboars(){
        try {
            const response = await axios.get("/api/v1/users/dashboard",
                {
                    withCredentials: true
                }
            );
            if (!response) {
                throw new Error("Error getting user dashboard");
            }
            return response.data;
        } catch (error) {
            console.error("Error getting user dashboard:", error);
        }
    }

    async updateLocation({ address, latitude, longitude }) {
        try {
            const response = await axios.patch("/api/v1/users/mylocation", { address,latitude, longitude });
            if (!response) {
                throw new Error("Error updating location");
            }
            return response.data;
        } catch (error) {
            console.error("Error updating location:", error);
        }
    }

    async getUserFavourites() {
        try {
            const response = await axios.get("/api/v1/users/myfavourites",
                {
                    withCredentials: true
                }
            );
            if (!response) {
                throw new Error("Error getting user favourites");
            }
            return response.data;
        } catch (error) {
            console.error("Error getting user favourites:", error);
        }
    }

    async reportOwner({ reason,ownerId }) {
        try {
            const response = await axios.patch(`/api/v1/users/addreport/${ownerId}`, { reason });
            if (!response) {
                throw new Error("Error reporting owner");
            }
            return response.data;
        } catch (error) {
            console.error("Error reporting owner:", error);
        }
    }

    async getOwnerReports({ ownerId }) {
        try {
            const response = await axios.get(`/api/v1/users/reports/${ownerId}`,
                {
                    withCredentials: true
                }
            );
            if (!response) {
                throw new Error("Error getting owner reports");
            }
            return response.data;
        } catch (error) {
            console.error("Error getting owner reports:", error);
        }
    }
}

const authService = new authServices();
export default authService;