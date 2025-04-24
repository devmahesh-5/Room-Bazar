import { useLocation, useNavigate } from 'react-router-dom';

export default function PaymentFailed() {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <svg className="mx-auto h-12 w-12 text-red-500" />
        <h2 className="mt-3 text-2xl font-bold text-gray-900">
          Payment Failed
        </h2>
        <p className="mt-2 text-gray-600">
          {'Unknown error occurred'}
        </p>
        <div className="mt-6 space-x-4">
          <button
            onClick={() => navigate('/rooms')}
            className="px-4 py-2 bg-gray-600 text-white rounded-md"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}