import React from 'react';
import { FaCrown } from 'react-icons/fa';

export default function UpgradeButton({ message = "Upgrade to Premium", size = "medium" }) {
  const handleUpgrade = () => {
    // In a real app, this would redirect to a payment page
    window.open('https://billing.stripe.com/upgrade', '_blank');
  };

  const sizeClasses = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };

  return (
    <button
      onClick={handleUpgrade}
      className={`
        ${sizeClasses[size] || sizeClasses.medium}
        bg-gradient-to-r from-yellow-400 to-yellow-600 
        hover:from-yellow-500 hover:to-yellow-700 
        text-gray-900 font-bold rounded-lg
        shadow-lg hover:shadow-yellow-500/25
        transition-all duration-200 transform hover:scale-105
        flex items-center gap-2
      `}
    >
      <FaCrown className="text-yellow-900" />
      {message}
    </button>
  );
}
