import React, { useState } from 'react'
import { PaymentCard,Authloader } from '../components/index.js'
import { useParams } from 'react-router-dom'
import { useNavigate,Link } from 'react-router-dom'
import paymentService from '../services/payment.services.js'

function Payment() {
    const navigate = useNavigate()
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState(null)
    const amount = useParams().amount
    const roomId = useParams().roomId
    const [htmlContent,sethtmlContent] = useState(null)
    const onPayment = async (type)=>{
        try {
            setLoading(true)
            const paymentResponse = await paymentService.createPayment({roomId,paymentGateway:type})
            if(paymentResponse){
                if(type === 'Khalti'){
                    window.location.href = paymentResponse?.data?.payment_url;
                }else{
                    sethtmlContent(paymentResponse?.data?.htmlForm)
                }
                
            }
        } catch (error) {
            setError(error)

        }finally{
            setLoading(false)
        }
        
    }

    return loading? (
        <Authloader message='making payment...' fullScreen={false} inline={false} size='md' color='primary' />
    ):htmlContent?(
        <div dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
    ):(
        <PaymentCard amount={amount} onPayment={onPayment} />
    )
}

export default Payment
