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
    const onPayment = async (type)=>{
        try {
            setLoading(true)
            const paymentResponse = await paymentService.createPayment({roomId,paymentGateway:type})
            if(paymentResponse){
                window.location.href = paymentResponse.data.payment_url;
            }
        } catch (error) {
            setError(error)

        }finally{
            setLoading(false)
        }
        
    }

    return !loading? (

        <PaymentCard amount={amount} onPayment={onPayment} />
    ):(
        <Authloader message='making payment...' fullScreen={false} inline={false} size='md' color='primary' />
    )
}

export default Payment
