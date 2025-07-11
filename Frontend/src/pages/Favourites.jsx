import React, { useEffect, useState } from 'react'
import favouriteService from '../services/favourite.services.js'
import { Authloader, RoomCard } from '../components'

function Favourites() {
    const [favourites, setFavourites] = useState([]);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    useEffect(() => {
        ;(
            async () => {
                try {
                    const favourites = await favouriteService.getUserFavourites();
                    setFavourites(favourites.data);
                    
                } catch (error) {
                    setError(error.response.data.error)
                }finally{
                    setLoading(false)
                }
            }
        )();
    },[])
    if(Array.isArray(favourites) && favourites.length === 0){
        return !loading?(
            <div className="w-72 p-4 bg-[#F2F4F7] rounded-lg sticky top-0">
                <h2 className="text-lg font-semibold">No favourites</h2>
            </div>
        ):(
            <Authloader message='Loading favourites...' fullScreen={false} inline={false} size='md' color='primary' />
        )
    }else{
        return (!loading && !error)?(
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {
                favourites.map((favourite) => (
                    
                              <div key={favourite?._id} className="p-2">
                                
                                
                                <RoomCard
                                  _id={favourite?.room[0]?._id}
                                  thumbnail={favourite?.room[0]?.thumbnail}
                                  price={favourite?.room[0]?.price}
                                  title={favourite?.room[0]?.title}
                                  location={favourite?.room[0]?.location?.address}
                                  rentPerMonth={favourite?.room[0]?.rentPerMonth}
                                  status={favourite?.room[0]?.status}
                                  owner={favourite?.room[0]?.owner}
                                />
                                
                              </div>
                            ))}
            </div>
        ):!loading?(
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6C48E3]"></div>
        ):(
            <div className="w-72 p-4 bg-red-100 rounded-lg sticky top-0">
               {
                error && typeof error === 'string' && (<h2 className="text-lg font-semibold">{error}</h2>)}
            </div>
        )
    }
}

export default Favourites
