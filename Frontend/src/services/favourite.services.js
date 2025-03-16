import axios from "axios";

class favouriteServices {
    
   async toggleFavourite(roomId) {
       try {
           const response = await axios.post(`/api/v1/rooms/${roomId}`);
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
            const response = await axios.get(`/api/v1/favourites/myfavourites`);
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
            const response = await axios.get(`/api/v1/rooms/favourites/${roomId}`);
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