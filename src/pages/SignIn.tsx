
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
      console.log(`Attempting to log in user: ${email}`);
      
      // Query the userdetails table without .single() to avoid errors when no user is found
      const { data, error } = await supabase
        .from('userdetails')
        .select('*')
        .eq('email', email);
      
      if (error) {
        console.error("Login query error:", error);
        setErrorMessage("An error occurred during login");
        setIsLoading(false);
        return;
      }
      
      console.log("Query result:", data);
      
      // Check if any user was found
      if (data && data.length > 0) {
        // Check if the password matches
        const user = data[0];
        console.log("Found user:", { id: user.id, email: user.email });
        
        // Case-sensitive password comparison
        if (user.password === password) {
          // Successful login
          console.log("Login successful for user ID:", user.id);
          toast.success("Login successful!");
          
          // Set up user session
          localStorage.setItem("userLoggedIn", "true");
          localStorage.setItem("userEmail", email);
          localStorage.setItem("userId", user.id);
          
          // Redirect to the home page
          navigate("/");
        } else {
          // Invalid password
          console.log("Password mismatch - entered:", password, "stored:", user.password);
          setErrorMessage("Invalid email or password");
        }
      } else {
        // User not found
        console.log("User not found for email:", email);
        setErrorMessage("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred during login");
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
