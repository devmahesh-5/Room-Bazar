import axios from "axios";

class paymentServices {
    async createPayment(data){
        try {
            const response = await axios.post(`/api/v1/payments/${data.roomId}`, data);
            if (!response) {
                throw new Error("Error creating payment");
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }
}

const paymentService = new paymentServices();
export default paymentService