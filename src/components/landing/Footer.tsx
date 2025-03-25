
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/common/Logo';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-4 md:px-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Logo className="mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              The ultimate platform for professional dog breeders to manage their breeding program with elegance and efficiency.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-slate-900 dark:text-white mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary">Features</Link></li>
              <li><Link to="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary">Pricing</Link></li>
              <li><Link to="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary">Integrations</Link></li>
              <li><Link to="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary">Roadmap</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-slate-900 dark:text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary">About</Link></li>
              <li><Link to="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary">Blog</Link></li>
              <li><Link to="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary">Careers</Link></li>
              <li><Link to="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-slate-900 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary">Terms</Link></li>
              <li><Link to="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary">Privacy</Link></li>
              <li><Link to="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary">Cookies</Link></li>
              <li><Link to="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary">Compliance</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} BreedElite. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
