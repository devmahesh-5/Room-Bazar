import axios from "axios";
import api from "./apiconfig.js";
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
    
    async verifyOTP(data) {
        try {
            const response = await axios.post("/api/v1/users/verify-otp", data);
            if (!response) {
                throw new Error("Error verifying OTP");
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async resendOTP(email) {
        try {
            const response = await axios.post("/api/v1/users/resend-otp", { email });
            if (!response) {
                throw new Error("Error resending OTP");
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async loginUser(data) {
        try {
            
            const response = await axios.post("/api/v1/users/login", data,{
                withCredentials: true
            });
            if (!response) {
                throw new Error("Error logging in user");
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // async continueWithGoogle() {
    //     try {
    //         const response = await api.get("/api/v1/users/auth/google",{
    //             withCredentials: true
    //         });
    //         if (!response) {
    //             throw new Error("Error logging in user");
    //         }
    //         return response.data;
    //     } catch (error) {
    //         throw error;
    //     }
    // }

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
                    withCredentials: true,
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

    async getOauthCurrentUser() {
        try {
            const response = await axios.get("/api/v1/users/oauth-callback",
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

    async updateProfilePic(formData) {
        const newFormData = new FormData();
        for(const [key, value] of formData.entries()) {
            console.log(key);
            if (key !== 'coverImage') {
                newFormData.append(key, value);
            }
        }
        
        try {
            const response = await axios.patch("/api/v1/users/updateprofilepicture", newFormData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (!response) {
                throw new Error("Error updating profile pic");
            }
            return response.data;
        } catch (error) {
            console.error("Error updating profile pic:", error);
        }
    }
    async updateCoverImage(formData) {
        const newFormData = new FormData();
        for (const [key, value] of formData.entries()) {
            if(key !== 'avatar') {
                newFormData.append(key, value);
            }
        }
        try {
            const response = await axios.patch("/api/v1/users/updatecoverpicture", newFormData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
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
            throw error.response.data.error;
        }
    } 
    
    async getUserDashboard(roommateId) {
        try {
            
             const response = await axios.get(`/api/v1/users/dashboard/${roommateId}`,
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

    async getMyDashboard(){
        try {
            
            const response = await axios.get(`/api/v1/users/get-my-dashboard`,
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
    
    async getUserByRoommateId({ roommateId }) {
        try {
            const response = await axios.get(`/api/v1/users/getroommatesuserid/${roommateId}`);
            if (!response) {
                throw new Error("Error getting user by roommate ID");
            }
            return response.data;
        } catch (error) {
            console.error("Error getting user by roommate ID:", error);
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

    async getUserById({ userId }) {
        try {
            const response = await axios.get(`/api/v1/users/${userId}`);
            if (!response) {
                throw new Error("Error getting user by ID");
            }
            return response.data;
        } catch (error) {
            console.error("Error getting user by ID:", error);
        }
    }

    async refreshAccessToken() {
        try {
            const response = await axios.post("/api/v1/users/refresh-token",
                {
                    withCredentials: true
                }
            );
            if (!response) {
                throw new Error("Error refreshing access token");
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

const authService = new authServices();
export default authService;