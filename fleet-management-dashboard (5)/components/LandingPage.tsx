
import React from 'react';
import { Company } from '../types';
import { COMPANIES } from '../constants';

interface LandingPageProps {
  onSelectCompany: (company: Company) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSelectCompany }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-2">Fleet Management</h1>
        <p className="text-xl text-gray-400">Select a company to view the dashboard.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
        {COMPANIES.map((company) => (
          <button
            key={company.id}
            onClick={() => onSelectCompany(company.id)}
            className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 transform transition-all duration-300 hover:scale-105 hover:bg-indigo-600/30 hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <h2 className="text-2xl font-semibold text-white group-hover:text-indigo-300 transition-colors duration-300">
              {company.name}
            </h2>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
