
import React from 'react';

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
        {title}
      </h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
        {subtitle}
      </p>
    </div>
  );
};

export default DashboardHeader;
