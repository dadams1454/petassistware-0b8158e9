
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Logo from '@/components/common/Logo';
import { CustomButton } from '@/components/ui/custom-button';
import BlurBackground from '@/components/ui/blur-background';
import { useAuth } from '@/contexts/AuthProvider';
import { 
  ChevronRight, ArrowRight, Dog, PawPrint, 
  Users, FileText, BarChart3, Globe, Database, ShieldCheck, LogOut 
} from 'lucide-react';
import { LogoutDialog } from '@/components/user-management/LogoutDialog';
import { useToast } from '@/hooks/use-toast';
import ConfirmDialog from '@/components/ui/standardized/ConfirmDialog';

const Index: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      
      toast({
        title: "Success",
        description: "You have been signed out successfully.",
        variant: "default"
      });
      
      // Redirect to auth page
      navigate('/auth');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: `Failed to sign out: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsSigningOut(false);
      setShowLogoutDialog(false);
    }
  };

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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'py-3 bg-blur-lg shadow-subtle border-b border-slate-200/70 dark:border-slate-800/70' 
          : 'py-5 bg-transparent'
      )}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="transition-transform duration-300 hover:scale-105"
              aria-label="Go to homepage"
            >
              <Logo />
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                to="#features"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary"
              >
                Features
              </Link>
              <Link
                to="#pricing"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary"
              >
                Pricing
              </Link>
              <Link
                to="#testimonials"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary"
              >
                Testimonials
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <Link to="/dashboard">
                    <CustomButton
                      variant="primary"
                      size="sm"
                    >
                      Dashboard
                    </CustomButton>
                  </Link>
                  <CustomButton
                    variant="outline"
                    size="sm"
                    onClick={() => setShowLogoutDialog(true)}
                    icon={<LogOut size={16} />}
                  >
                    Sign Out
                  </CustomButton>
                </>
              ) : (
                <>
                  <Link to="/auth">
                    <CustomButton
                      variant="outline"
                      size="sm"
                    >
                      Log in
                    </CustomButton>
                  </Link>
                  <Link to="/auth">
                    <CustomButton
                      variant="primary"
                      size="sm"
                    >
                      Get Started
                    </CustomButton>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
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

      {/* Features Section */}
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

      {/* CTA Section */}
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
      
      {/* Footer */}
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
      
      {/* Logout Dialog */}
      <LogoutDialog 
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleSignOut}
        isLoading={isSigningOut}
      />
    </div>
  );
};

export default Index;
