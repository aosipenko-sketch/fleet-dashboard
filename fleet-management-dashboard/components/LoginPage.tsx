import React from 'react';
import { GoogleIcon } from '../constants';
import { User } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    // In a real app, this would trigger the Google OAuth flow.
    // Here, we'll just use mock data for demonstration.
    const handleLogin = () => {
        const mockUser: User = {
            name: 'Alex Williams',
            email: 'alex.williams@example.com',
            avatarUrl: `https://i.pravatar.cc/150?u=alexwilliams`,
        };
        onLoginSuccess(mockUser);
    };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-2xl text-center">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Fleet Dashboard</h1>
          <p className="text-gray-400">Please sign in to continue</p>
        </div>
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center px-4 py-3 font-semibold text-gray-800 bg-white rounded-lg shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-colors duration-200"
        >
          <GoogleIcon />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;