import React, { useEffect, useState } from 'react'
import favouriteService from '../services/favourite.services.js'
import { RoomCard } from '../components'

function Favourites() {
    const [favourites, setFavourites] = useState([]);
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        ;(
            async () => {
                try {
                    const favourites = await favouriteService.getUserFavourites();
                    setFavourites(favourites.data[0].room);
                    console.log(favourites.data[0].room);
                    
                } catch (error) {
                    throw error
                }finally{
                    setLoading(false)
                }
            }
        )();
    },[])
    if(Array.isArray(favourites) && favourites.length === 0){
        return (
            <div className="w-72 p-4 bg-[#F2F4F7] rounded-lg sticky top-0">
                <h2 className="text-lg font-semibold">No favourites</h2>
            </div>
        )
    }else{
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {
                favourites.map((favourite) => (
                              <div key={favourite._id} className="p-2">
                                
                                
                                <RoomCard
                                  _id={favourite?._id}
                                  thumbnail={favourite?.thumbnail}
                                  price={favourite?.price}
                                  title={favourite?.title}
                                  location={favourite?.location?.address}
                                  rentPerMonth={favourite?.rentPerMonth}
                                />
                              </div>
                            ))}
            </div>
        )
    }
}

export default Favourites
