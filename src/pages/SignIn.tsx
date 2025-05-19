
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
      // Trim the email to remove any leading/trailing whitespace
      const trimmedEmail = email.trim();
      
      console.log(`Attempting to log in user: ${trimmedEmail}`);
      
      // Query the userdetails table
      const { data: users, error } = await supabase
        .from('userdetails')
        .select('*')
        .eq('email', trimmedEmail);
      
      if (error) {
        console.error("Database query error:", error);
        throw new Error("An error occurred during login");
      }
      
      console.log("Query result:", users);
      
      // Check if any user was found
      if (!users || users.length === 0) {
        console.log("No user found for email:", trimmedEmail);
        throw new Error("Invalid email or password");
      }
      
      const user = users[0];
      console.log("Found user:", { id: user.id, email: user.email });
      
      // Debug password comparison in detail
      console.log("Password check:");
      console.log("- Input password:", password);
      console.log("- Stored password:", user.password);
      console.log("- Length input:", password.length);
      console.log("- Length stored:", user.password.length);
      console.log("- Characters (input):", [...password].map(c => c.charCodeAt(0)));
      console.log("- Characters (stored):", [...user.password].map(c => c.charCodeAt(0)));
      console.log("- Direct comparison result:", user.password === password);
      
      // Compare passwords (case-sensitive)
      if (user.password !== password) {
        console.log("Password mismatch");
        throw new Error("Invalid email or password");
      }
      
      // Successful login
      console.log("Login successful for user ID:", user.id);
      toast.success("Login successful!");
      
      // Set up user session
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userId", user.id);
      
      // Redirect to the home page
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(error instanceof Error ? error.message : "An error occurred during login");
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
