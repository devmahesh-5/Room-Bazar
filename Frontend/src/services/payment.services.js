import axios from "axios";
const API = import.meta.env.VITE_API_BASE_URL;
class paymentServices {
    async createPayment(data){
        try {
            const response = await axios.post(`${API}/api/v1/payments/${data.roomId}`, data,{
                withCredentials: true
            });
            if (!response) {
                throw new Error("Error creating payment");
            }
            return response.data;
            
        } catch (error) {
            throw error
        }
    }

    async afterPaymentKhalti(data){
        try {
            const response = await axios.post(`${API}/api/v1/payments/khalti/success/${data.paymentId}?pidx=${data.pidx}`,{},{
                withCredentials: true
            });
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