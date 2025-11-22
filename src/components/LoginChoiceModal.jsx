import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, User, Shield } from 'lucide-react';

/**
 * Modal component to let the user choose between logging in as a standard user or an admin.
 * Assumes: 
 * - Standard User login path is '/user-login'
 * - Admin login path is '/admin-login'
 */
function LoginChoiceModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) {
    return null;
  }

  const handleChoice = (path) => {
    onClose(); // Close the modal first
    navigate(path);
  };

  return (
    // Backdrop
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-[100] transition-opacity duration-300">
      
      {/* Modal Container */}
      <div 
        className="bg-white p-6 sm:p-10 rounded-xl shadow-2xl w-full max-w-sm transform transition-all duration-300 scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-extrabold text-blue-700">Login Access</h3>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-gray-600 mb-8 font-medium">
          Please select your intended access level to continue.
        </p>
        
        <div className="space-y-4">
          
          {/* User Login Button */}
          <button
            onClick={() => handleChoice("/login")}
            className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-3 rounded-lg text-lg font-bold shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-[1.02]"
          >
            <User className="w-5 h-5" />
            Student / Standard Login
          </button>

          {/* Admin Login Button */}
          <button
            onClick={() => handleChoice("/adminlogin")}
            className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white py-3 rounded-lg text-lg font-bold shadow-md hover:bg-indigo-700 transition duration-300 transform hover:scale-[1.02]"
          >
            <Shield className="w-5 h-5" />
            Administrator Login
          </button>

        </div>
      </div>
    </div>
  );
}

export default LoginChoiceModal;