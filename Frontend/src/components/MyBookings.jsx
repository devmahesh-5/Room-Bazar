import React, { useEffect } from 'react'
import bookingService from '../services/booking.services'
function MyBookings() {
    useEffect(() => {
        ;(
            async () => {
                const response = await bookingService.getMyBookings()
                console.log(response)
            }
        )();
    })
    return (
        <div>MyBookings</div>
    )
}

export default MyBookings
