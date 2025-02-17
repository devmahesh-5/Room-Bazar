import React,{useState,useEffect} from 'react'
import { RoomCard } from '../components'
import roomService from '../services/room.services.js'
function Rooms() {
    const [rooms,setRooms] = useState([])

    useEffect(() => {
        ;(async()=>{
            try {
                const rooms = await roomService.getAllRooms();
                if(rooms){
                    setRooms(rooms.data)
                }
            } catch (error) {
                throw error
            }
        })()
    }, [])
    
    
    if(!Array.isArray(rooms)||rooms.length === 0){
        return (
            <div className="container">
                <div className="row">
                    <div className="w-1/3 p-4 bg-gray-100 rounded-lg">
                        <h2 className="text-lg font-semibold">No rooms found</h2>
                    </div>
                </div>
            </div>
        )
    }else{
        return (
            <div className="flex w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map((room) => (
                  <div key={room._id} className="p-2">
                    <RoomCard
                      _id={room._id}
                      thumbnail={room.thumbnail}
                      price={room.price}
                      title={room.title}
                      location={room.location.address}
                      rentPerMonth={room.rentPerMonth}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
    }
}

export default Rooms
