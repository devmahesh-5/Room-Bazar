import { useNavigate } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';

export default function PaymentFailed() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <FaTimesCircle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="mt-3 text-2xl font-extrabold text-gray-900">
            Payment Failed
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We couldn't process your payment. Please try again.
          </p>
          <p className="mt-1 text-sm text-red-500 font-medium">
            Error: Unknown error occurred
          </p>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/rooms')}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Back to Home
            </button>
            <button
              onClick={() => window.location.reload()} // or navigate back to payment page
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>
              Need help?{' '}
              <a href="/contact" className="font-medium text-red-600 hover:text-red-500">
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}