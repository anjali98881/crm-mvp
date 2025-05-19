
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    
    // Validate email and password
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    if (!password) {
      toast.error("Please enter your password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Query the userdetails table to validate credentials
      const { data, error } = await supabase
        .from('userdetails')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error) {
        console.error("Login query error:", error);
        setErrorMessage("Invalid email or password");
        setIsLoading(false);
        return;
      }
      
      // Check if the password matches
      if (data && data.password === password) {
        // Successful login
        toast.success("Login successful!");
        
        // Set up user session
        localStorage.setItem("userLoggedIn", "true");
        localStorage.setItem("userEmail", email);
        
        // Redirect to the home page
        navigate("/");
      } else {
        // Invalid credentials
        console.log("Password mismatch or user not found");
        setErrorMessage("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Welcome to CRM MVP</h1>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                />
              </div>
              
              {errorMessage && (
                <div className="text-red-500 text-sm font-medium">
                  {errorMessage}
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                className="w-full" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Login"}
              </Button>
              
              <div className="text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-semibold" 
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
