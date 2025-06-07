import React from 'react';

const PaymentCard = ({amount, onPayment}) => {
  return (
    <div className="max-w-sm mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
      {/* Card Header */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Complete Payment</h3>
        <p className="text-2xl font-semibold text-[#6C48E3]">NPR {amount}</p>
      </div>

      {/* Payment Buttons */}
      <div className="space-y-4 mb-5">
        {/* eSewa Button */}
        <button
        onClick={()=>{onPayment('ESewa')}}
          className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-md"
        >
          <img 
            src="https://esewa.com.np/common/images/esewa_logo.png" 
            alt="eSewa" 
            className="h-5 object-contain" 
          />
          Pay with eSewa
        </button>

        {/* Khalti Button */}
        <button
          onClick={()=>{onPayment('Khalti')}}
          className="w-full flex items-center justify-center gap-3 bg-[#5C2D91] hover:bg-[#7733BB] text-white py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-md"
        >
          <img 
            src="https://khalti.com/static/images/logo.svg" 
            alt="Khalti" 
            className="h-5 object-contain" 
          />
          Pay with Khalti
        </button>
      </div>

      {/* Footer Note */}
      <p className="text-xs text-center text-gray-500">
        Secure payment processed by our partners
      </p>
    </div>
  );
};

export default PaymentCard;