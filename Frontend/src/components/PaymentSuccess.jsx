import React from 'react';
import {useNavigate } from 'react-router-dom';

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <svg className="mx-auto h-12 w-12 text-green-500" />
        <h2 className="mt-3 text-2xl font-bold text-gray-900">
          Payment Successful!
        </h2>
        <div className="mt-6">
          <button
            onClick={() => navigate('/users/my-bookings')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md"
          >
            View Your Bookings
          </button>
        </div>
      </div>
    </div>
  );
}