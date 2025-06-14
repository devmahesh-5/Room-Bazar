import axios from "axios";
const API = import.meta.env.VITE_API_BASE_URL;
class favouriteServices {
    
   async toggleFavourite(roomId) {
       try {
           const response = await axios.post(`${API}/api/v1/rooms/${roomId}`,{},{
               withCredentials: true
           });
           if (!response) {
               throw new Error("Error toggling favourite");
           }
           return response.data;
       } catch (error) {
           throw error
       }
   }

    async getUserFavourites() {
        try {
            const response = await axios.get(`${API}/api/v1/favourites/myfavourites`,{
                withCredentials: true
            });
            if (!response) {
                throw new Error("Error getting favourites");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async getFavouriteByRoomId(roomId) {
        try {
            const response = await axios.get(`${API}/api/v1/rooms/favourites/${roomId}`,{
                withCredentials: true
            });
            if (!response) {
                throw new Error("Error getting favourite");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }
    //may add remove favourite
}

const favouriteService = new favouriteServices();
export default favouriteService;