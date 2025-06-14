// src/pages/ErrorPage.jsx
import { useRouteError, Link } from 'react-router-dom';
import { Logo } from '../components';
import { FaHome, FaRedo } from 'react-icons/fa';

export default function ErrorPage() {
  const error = useRouteError();

  // Define error messages
  const errorMessages = {
    404: {
      title: "Page Not Found",
      description: "The page you're looking for doesn't exist or has been moved."
    },
    500: {
      title: "Server Error", 
      description: "Something went wrong on our end. Please try again later."
    },
    default: {
      title: "Oops!",
      description: "An unexpected error has occurred."
    }
  };

  const status = error?.status || 500;
  const { title, description } = errorMessages[status] || errorMessages.default;

  return (
    <div className="min-h-screen bg-[#F2F4F7] flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="mb-6">
          <Logo width="120px" />
        </div>
        
        {/* Error graphic (can replace with your own SVG) */}
        <div className="w-32 h-32 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
          <span className="text-5xl text-red-500">!</span>
        </div>
        
        <h1 className="text-3xl font-bold text-[#2C2C2C] mb-3">{title}</h1>
        <p className="text-gray-600 mb-6">{description}</p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link 
            to="/" 
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#6C48E3] text-white rounded-md hover:bg-[#5a3acf] transition-colors"
          >
            <FaHome /> Go Home
          </Link>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            <FaRedo /> Try Again
          </button>
        </div>
      </div>
    </div>
  );
}