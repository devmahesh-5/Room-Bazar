import React,{useState,useEffect} from 'react'
import { useParams } from 'react-router-dom'
import roomService from '../services/room.services.js'
import { useNavigate } from 'react-router-dom'
import { Roomform } from '../components/index.js'
function Updateroom() {
    const navigate = useNavigate()
    const {roomId} = useParams();
    const [room, setRoom] = useState({});
    const [error, setError] = useState(null);
    useEffect(() => {
        ;(async()=>{
            try {
                const room = await roomService.getRoomById(roomId);
                if(room){
                    setRoom(room.data[0]);
                }
            } catch (error) {
                setError(error.response.data.error);
            }
        })();
    },[roomId])
    return !error && room? (
        <Roomform room={room} />
    ):(
        <h1 className='text-red-600'>{error}</h1>
    )
}

export default Updateroom
