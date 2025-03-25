
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import BlurBackground from '@/components/ui/blur-background';
import { useAuth } from '@/contexts/AuthProvider';

const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  return (
    <section 
      ref={heroRef} 
      className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 z-[-1] bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800"></div>
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-primary/5 to-transparent z-[-1]"></div>
      
      {/* Animated Background Circles */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl animate-float opacity-70 z-[-1]"></div>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-400/5 rounded-full filter blur-3xl animate-float opacity-70 z-[-1]" style={{ animationDelay: '-2s' }}></div>
      
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="inline-block mb-4">
          <span className="inline-flex items-center py-1 px-3 rounded-full text-xs font-medium bg-primary/10 text-primary">
            Elevate Your Breeding Program
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 max-w-4xl mx-auto leading-tight">
          The Ultimate Software Platform for
          <span className="text-primary"> Professional Dog Breeders</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
          Streamline your breeding program with our all-in-one platform. From pedigree management to puppy sales, we've got you covered.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          <Link to={user ? "/dashboard" : "/auth"}>
            <CustomButton
              size="lg"
              icon={<ArrowRight size={18} />}
              iconPosition="right"
            >
              {user ? "Go to Dashboard" : "Start Free Trial"}
            </CustomButton>
          </Link>
          <Link to="#features">
            <CustomButton
              variant="outline"
              size="lg"
              icon={<ChevronRight size={18} />}
              iconPosition="right"
            >
              Explore Features
            </CustomButton>
          </Link>
        </div>
        
        {/* Hero Image */}
        <div className="relative max-w-5xl mx-auto">
          <BlurBackground 
            className="rounded-xl p-2 animate-scale-in"
            intensity="md"
            opacity="medium"
          >
            <div className="overflow-hidden rounded-lg shadow-floating">
              <img 
                src="/placeholder.svg" 
                alt="BreedElite Dashboard" 
                className="w-full h-auto rounded-lg transform hover:scale-[1.02] transition-all duration-700"
              />
            </div>
          </BlurBackground>
          
          {/* Stats Overlay */}
          <div className="absolute -bottom-5 left-[10%] sm:left-[15%] lg:left-[20%] right-[10%] sm:right-[15%] lg:right-[20%]">
            <BlurBackground 
              className="py-4 px-6 rounded-xl grid grid-cols-3 gap-4 items-center animate-slide-up"
              intensity="lg"
              opacity="heavy"
            >
              {[
                { label: "Breeders", value: "2,000+" },
                { label: "Dogs Managed", value: "35,000+" },
                { label: "Litters Tracked", value: "8,500+" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-xl font-bold text-primary">{stat.value}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</div>
                </div>
              ))}
            </BlurBackground>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
