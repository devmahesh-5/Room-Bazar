import React, { useState, useEffect, useCallback } from 'react'
import { RoomCard, Input, Button, Select, Authloader } from '../components'
import roomService from '../services/room.services.js'
import { useForm } from 'react-hook-form'

function Rooms() {
  const [rooms, setRooms] = useState([])
  const { register, handleSubmit, watch } = useForm();
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  useEffect(() => {
    ; (async () => {
      try {
        const rooms = await roomService.getAllRooms();
        if (rooms) {
          setRooms(rooms.data);
          
          
        }
      } catch (error) {
        setError(error.response.data.error)
      }
    })()
  }, [])
  const getSearchResults = useCallback(
    async (data) => {
      try {
        setError(null);
        setLoading(true);
        const rooms = await roomService.searchRooms(1, 10, data);
        if (rooms) {
          setRooms(rooms.data);
        }
      } catch (error) {
        setError(error.response.data.error)
      } finally {
        setLoading(false)
      }
    }, [setRooms]);



  if (!Array.isArray(rooms) || rooms.length === 0 || error) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F2F4F7] mt-4">
        <form onSubmit={handleSubmit(getSearchResults)}>
          <div className="w-full max-w-4xl p-4 bg-[#F2F4F7] rounded-lg items-center flex flex-row gap-4">
            <Input
              type="text"
              placeholder="Search..."
              className="px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-48 focus:outline-none focus:ring-2 focus:ring-[#6C48E3]"
              {...register("query")}
            />

            <Select
              options={["location", "title", "category", "description"]}
              className="px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-48 focus:outline-none focus:ring-2 focus:ring-[#6C48E3] appearance-none"
              {...register("field")}
            />

            <button
              type={`${watch('query') ? 'submit' : 'button'}`}
              className="bg-[#6C48E3] text-white px-3 py-2 rounded-lg hover:opacity-80 hover:text-white">
              Search
            </button>
          </div>
        </form>
        <div className="row">
          <div className="w-1/3 p-4 bg-gray-100 rounded-lg">
            {error && typeof error === 'string' && (<h2 className="text-lg font-semibold">{error}</h2>)}
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="flex flex-col min-h-screen bg-[#F2F4F7] mt-4">
        <form onSubmit={handleSubmit(getSearchResults)}>
          <div className="w-full max-w-4xl p-4 bg-[#F2F4F7] rounded-lg items-center flex flex-row gap-4">
            <Input
              type="text"
              placeholder="Search..."
              className="px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-48 focus:outline-none focus:ring-2 focus:ring-[#6C48E3]"
              {...register("query")}
            />

            <Select
              options={["location", "title", "category", "description"]}
              className="px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-48 focus:outline-none focus:ring-2 focus:ring-[#6C48E3]"
              {...register("field")}
            />

            <button
              type={`${watch('query') ? 'submit' : 'button'}`}
              className="bg-[#6C48E3] text-white px-3 py-2 rounded-lg hover:opacity-80 hover:text-white">
              Search
            </button>
          </div>
        </form>
        {!loading ? (<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {rooms.map((room) => (
            <div key={room._id} className="p-2">
              <RoomCard
                _id={room?._id}
                thumbnail={room?.thumbnail}
                price={room?.price}
                title={room?.title}
                location={room?.location?.address}
                rentPerMonth={room?.rentPerMonth}
                status={room?.status}
                owner={room?.owner}
                category={room?.category}
                createdAt={room?.createdAt}
                updatedAt={room?.updatedAt}
              />
            </div>
          ))}
        </div>)
          : (
            <Authloader message='searching...' fullScreen={false} inline={false} size='md' color='primary' />
          )}
      </div>
    )
  }
}

export default Rooms
