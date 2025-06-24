import React,{useEffect, useState} from "react";
import { Link, useNavigate,useParams } from "react-router-dom";
import { Authloader } from "../components";
import paymentService from "../services/payment.services.js";
const Esewa=()=>{
    const navigate = useNavigate();
    const {paymentId}=useParams();
    const urlParams = new URLSearchParams(window.location.search);
    const data=urlParams.get('data');
    console.log(data);
    
    useEffect(() => {
        (async()=>{
            try{
                const response = await paymentService.afterPaymentEsewa({paymentId,data});
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

export default Esewa