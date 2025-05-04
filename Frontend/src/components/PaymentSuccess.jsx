import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <FaCheckCircle className="h-6 w-6 text-green-600" aria-hidden="true" />
          </div>
          <h2 className="mt-3 text-2xl font-extrabold text-gray-900">
            Payment Successful!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Thank you for your payment. Your transaction has been completed successfully.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/users/my-bookings')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              View Your Bookings
            </button>
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>
              Need help?{' '}
              <a href="/contact" className="font-medium text-indigo-600 hover:text-indigo-500">
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}