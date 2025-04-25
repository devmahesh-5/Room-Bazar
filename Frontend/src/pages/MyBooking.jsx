import React from 'react'
import { MyBookings } from '../components/index.js';
import bookingService from '../services/booking.services'
import { useEffect } from 'react';
import {Authloader} from '../components/index.js'

function MyBooking() {
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(null)
    const [myBookings, setMyBookings] = React.useState([])
    
   
    useEffect(() => {
        ;(
            async () => {
                try {
                    setLoading(true);
                    const response = await bookingService.getMyBookings()
                    if(response){
                        setMyBookings(response.data);
                    }
                } catch (error) {
                    setError(error)
                }finally{
                    setLoading(false)
                }
            }
        )();
    },[]);

    const handleCheckIn = async(bookingId)=>{
        try {
            const updatedBooking = await bookingService.updateBooking(bookingId);
        } catch (error) {
            setError(error)
        }
    }

    return !loading && Array.isArray(myBookings) && myBookings.length > 0 ?(
        myBookings.map((booking) =><div key={booking._id}> <MyBookings booking={booking} handleCheckIn={handleCheckIn} /></div>)
    ):loading?(
        <Authloader message='Fetching your bookings...' fullScreen={false} inline={false} size='md' color='primary' />
    ):(
        <div>no bookings</div>
    )
}

export default MyBooking
