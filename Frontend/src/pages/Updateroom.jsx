import React,{useState,useEffect} from 'react'
import { useParams } from 'react-router-dom'
import roomService from '../services/room.services.js'
import { useNavigate } from 'react-router-dom'
import { Roomform } from '../components/index.js'
function Updateroom() {
    const navigate = useNavigate()
    const {roomId} = useParams();
    const [room, setRoom] = useState({});

    useEffect(() => {
        ;(async()=>{
            try {
                const room = await roomService.getRoomById(roomId);
                if(room){
                    console.log(room);
                    setRoom(room)
                }
            } catch (error) {
                throw error
            }
        })();
    })
    return (
        
        <Roomform room={room} />
    )
}

export default Updateroom
