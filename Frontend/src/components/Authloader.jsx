import React from 'react';
import PropTypes from 'prop-types';
import { FaSpinner } from 'react-icons/fa';

const AuthLoader = ({ 
  message = 'Securing your account...', 
  fullScreen = false, 
  inline = false,
  size = 'md',
  color = 'primary'
}) => {
  // Size classes
  const sizeClasses = {
    sm: {
      icon: 'text-lg',
      text: 'text-sm',
      container: 'gap-2'
    },
    md: {
      icon: 'text-2xl',
      text: 'text-base',
      container: 'gap-3'
    },
    lg: {
      icon: 'text-3xl',
      text: 'text-lg',
      container: 'gap-4'
    }
  };

  // Color classes
  const colorClasses = {
    primary: 'text-[#6C48E3]',
    secondary: 'text-[#F2F4F7]',
    danger: 'text-red-600',
    success: 'text-green-600'
  };

  return (
    <div 
      className={`
        flex flex-col items-center justify-center
        ${fullScreen ? 'fixed inset-0 bg-white bg-opacity-90 z-50' : ''}
        ${inline ? 'inline-flex px-2.5' : ''}
      `}
    >
      <div className={`flex flex-col items-center ${sizeClasses[size].container}`}>
        {/* Spinner Icon */}
        <div className={`animate-spin ${colorClasses[color]} ${sizeClasses[size].icon}`}>
          <FaSpinner />
        </div>
        
        {/* Loading Message */}
        {message && (
          <p className={`text-gray-700 ${sizeClasses[size].text} text-center max-w-xs`}>
            {message}
          </p>
        )}
        
        {/* Optional Progress Bar */}
        {fullScreen && (
          <div className="w-48 h-1 bg-gray-200 rounded-full mt-5 overflow-hidden">
            <div className={`h-full w-1/2 ${colorClasses[color]} rounded-full animate-progress`} />
          </div>
        )}
      </div>
    </div>
  );
};

AuthLoader.propTypes = {
  message: PropTypes.string,
  fullScreen: PropTypes.bool,
  inline: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  color: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success'])
};



export default React.memo(AuthLoader);