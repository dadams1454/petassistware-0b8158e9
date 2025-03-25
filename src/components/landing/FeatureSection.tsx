
import React from 'react';
import { Dog, PawPrint, Users, FileText, Globe, BarChart3, Database, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: <Dog size={24} />,
    title: "Dog Management",
    description: "Keep detailed records of all your dogs with health tracking, pedigree information, and automated reminders."
  },
  {
    icon: <PawPrint size={24} />,
    title: "Litter Tracking",
    description: "Document litters from conception to placement, with weight charts, vaccine scheduling, and milestone tracking."
  },
  {
    icon: <Users size={24} />,
    title: "Client Management",
    description: "Maintain a database of clients, handle puppy reservations, and automate communications through the customer lifecycle."
  },
  {
    icon: <FileText size={24} />,
    title: "Document Generation",
    description: "Create professional contracts, health certificates, and pedigrees with automated data insertion."
  },
  {
    icon: <Globe size={24} />,
    title: "Breeder Website",
    description: "Share available puppies and kennel information with a built-in breeder website that updates automatically."
  },
  {
    icon: <BarChart3 size={24} />,
    title: "Breeding Analytics",
    description: "Make informed decisions with visual reports on genetic analysis, financials, and breeding outcomes."
  },
  {
    icon: <Database size={24} />,
    title: "Financial Tracking",
    description: "Monitor expenses, sales, and profitability with detailed financial reports and tax preparation tools."
  },
  {
    icon: <ShieldCheck size={24} />,
    title: "Compliance Tools",
    description: "Stay compliant with automated document retention, kennel club record-keeping, and regulation alerts."
  }
];

const FeatureSection: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <span className="inline-flex items-center py-1 px-3 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">
            Powerful Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Our comprehensive set of tools helps you manage every aspect of your breeding program with ease and efficiency.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-subtle hover:shadow-elevated transition-all duration-300 bg-white dark:bg-slate-900"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
