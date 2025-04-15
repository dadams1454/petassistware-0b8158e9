
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useMockSession } from '@/hooks/useMockSession';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { getAvailableRoles } from '@/utils/RBAC';

const Login: React.FC = () => {
  const { login } = useMockSession();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const roles = getAvailableRoles();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(email, password);
      toast({
        title: "Login successful",
        description: "You have been logged in successfully",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleQuickLogin = async (userEmail: string) => {
    setLoading(true);
    
    try {
      await login(userEmail, 'password');
      toast({
        title: "Quick login successful",
        description: `Logged in as ${userEmail}`,
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Quick login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            PetAssistWare
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to sign in
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="your@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          <div className="mt-6">
            <h3 className="text-sm font-medium text-center mb-2">Quick Access (Dev Only)</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => handleQuickLogin("admin@example.com")}>
                Admin
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleQuickLogin("manager@example.com")}>
                Manager
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleQuickLogin("staff@example.com")}>
                Staff
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleQuickLogin("vet@example.com")}>
                Veterinarian
              </Button>
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <p className="text-center text-sm text-gray-500 w-full">
            <Link to="/security-test" className="hover:underline text-primary">
              Test Security System
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
