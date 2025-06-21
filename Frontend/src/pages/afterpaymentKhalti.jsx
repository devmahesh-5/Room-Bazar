import React,{useEffect, useState} from "react";
import { Link, useNavigate,useParams } from "react-router-dom";
import { Authloader } from "../components";
import paymentService from "../services/payment.services.js";
const Khalti=()=>{
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const {paymentId}=useParams();
    const urlParams = new URLSearchParams(window.location.search);
    const pidx = urlParams.get('pidx');
    // const transaction_id = urlParams.get('transaction_id');
    // const tidx = urlParams.get('tidx');
    // const amount = urlParams.get('amount');
    // const txnId = urlParams.get('txnId');
    useEffect(() => {
        (async()=>{
            try{
                const response = await paymentService.afterPaymentKhalti({paymentId,pidx});
                navigate('/payments/success');
                
            }catch(err){
                navigate('/payments/failed');
            }
        })()
    }, []);
    return(
        <div className="flex justify-center items-center h-screen">
            <Authloader/>
        </div>
    )
}

export default Khalti