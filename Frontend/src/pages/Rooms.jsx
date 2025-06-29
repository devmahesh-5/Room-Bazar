import React, { useState, useEffect, useCallback } from 'react'
import { RoomCard, Input, Button, Select, Authloader } from '../components'
import roomService from '../services/room.services.js'
import { useForm } from 'react-hook-form'

function Rooms() {
  const [rooms, setRooms] = useState([])
  const { register, handleSubmit, watch } = useForm();
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [showFilters, setShowFilters] = useState(false);
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
          <div className="w-full max-w-4xl p-3 bg-[#F2F4F7] rounded-lg shadow-sm">
            {/* Main Search Row */}
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              {/* Search Input with Mobile Search Icon */}
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search rooms..."
                  className="w-full pl-4 pr-10 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#6C48E3]"
                  {...register("query")}
                />
                {/* Mobile Search Button */}
                <button
                  type="submit"
                  className="sm:hidden absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#6C48E3]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>

              {/* Desktop Filter and Search Button */}
              <div className="hidden sm:flex items-center gap-3 w-full sm:w-auto">
                <Select
                  options={["location", "title", "category", "description"]}
                  className="w-full sm:w-48 px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6C48E3]"
                  {...register("field")}
                />
                <button
                  type="submit"
                  disabled={!watch('query')}
                  className="bg-[#6C48E3] text-white px-4 py-2 rounded-lg hover:bg-[#5a3acf] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Search</span>
                </button>
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <div className="sm:hidden flex justify-between mt-3">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="text-xs text-[#6C48E3] flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Filters
              </button>

              {watch('query') && (
                <button
                  type="submit"
                  className="text-xs text-[#6C48E3]"
                >
                  Search
                </button>
              )}
            </div>

            {/* Expanded Mobile Filters */}
            {showFilters && (
              <div className="sm:hidden mt-3 space-y-3">
                <Select
                  options={["location", "title", "category", "description"]}
                  className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg"
                  {...register("field")}
                />
              </div>
            )}
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
          <div className="w-full max-w-4xl p-3 bg-[#F2F4F7] rounded-lg shadow-sm ">
            {/* Main Search Row */}
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              {/* Search Input with Mobile Search Icon */}
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search rooms..."
                  className="w-full pl-4 pr-10 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#6C48E3]"
                  {...register("query")}
                />
                {/* Mobile Search Button */}
                <button
                  type="submit"
                  className="sm:hidden absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#6C48E3]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>

              {/* Desktop Filter and Search Button */}
              <div className="hidden sm:flex items-center gap-3 w-full sm:w-auto">
                <Select
                  options={["location", "title", "category", "description"]}
                  className="w-full sm:w-48 px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6C48E3]"
                  {...register("field")}
                />
                <button
                  type="submit"
                  disabled={!watch('query')}
                  className="bg-[#6C48E3] text-white px-4 py-2 rounded-lg hover:bg-[#5a3acf] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Search</span>
                </button>
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <div className="sm:hidden flex justify-between mt-3">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="text-xs text-[#6C48E3] flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Filters
              </button>

              {watch('query') && (
                <button
                  type="submit"
                  className="text-xs text-[#6C48E3]"
                >
                  Search
                </button>
              )}
            </div>

            {/* Expanded Mobile Filters */}
            {showFilters && (
              <div className="sm:hidden mt-3 space-y-3">
                <Select
                  options={["location", "title", "category", "description"]}
                  className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg"
                  {...register("field")}
                />
              </div>
            )}
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
