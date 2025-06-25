import React,{useEffect, useState} from "react";
import { Link, useNavigate,useParams } from "react-router-dom";
import { Authloader } from "../components";
import paymentService from "../services/payment.services.js";
const Esewa=()=>{
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const {paymentId}=useParams();
    const urlParams = new URLSearchParams(window.location.search);
    const data=urlParams.get('data');
    
    useEffect(() => {
        (async()=>{
            try{
                setLoading(true);
                setError(null);
                const response = await paymentService.afterPaymentEsewa({paymentId,data});
                navigate('/payments/success');
            }catch(err){
                setError(err.response.data.error);
            }finally{
                setLoading(false);
            }
        })()
    }, []);
    return!error?(
        <div className="flex justify-center items-center h-screen">
            <Authloader message="Processing your payment please wait"/>
        </div>
    ):(
        <div className="flex justify-center items-center h-screen">
            <p className="text-center p-6 bg-white rounded-lg shadow-md">{error}</p>
        </div>
    )
}

export default Esewa