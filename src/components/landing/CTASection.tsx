
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';

const CTASection: React.FC = () => {
  return (
    <section className="py-20 bg-primary/5 dark:bg-slate-800/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Ready to Transform Your Breeding Program?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            Join thousands of professional breeders who are streamlining their operations, improving compliance, and growing their business with BreedElite.
          </p>
          <Link to="/dashboard">
            <CustomButton
              size="lg"
              icon={<ArrowRight size={18} />}
              iconPosition="right"
            >
              Get Started Today
            </CustomButton>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
