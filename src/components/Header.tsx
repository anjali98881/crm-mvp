
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, UserPlus } from "lucide-react";
import { toast } from "sonner";

interface HeaderProps {
  title: string;
  actionButton?: React.ReactNode;
}

const Header = ({ title, actionButton }: HeaderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is logged in when component mounts or when localStorage changes
  useEffect(() => {
    const checkLoginStatus = () => {
      const userLoggedIn = localStorage.getItem("userLoggedIn") === "true";
      const email = localStorage.getItem("userEmail");
      setIsLoggedIn(userLoggedIn);
      setUserEmail(email);
    };

    checkLoginStatus();

    // Add event listener to detect localStorage changes
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleSignOut = () => {
    // Remove user login info from localStorage
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    
    toast.info("Signing out...");
    
    setTimeout(() => {
      // Update logged in state
      setIsLoggedIn(false);
      setUserEmail(null);
      // Redirect to the sign in page
      navigate("/signin");
      toast.success("Successfully signed out!");
    }, 1000);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Link to="/signin">
                <Button variant="outline" size="sm">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="default" size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </Button>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              {userEmail && (
                <span className="text-sm text-gray-600 mr-2">
                  {userEmail}
                </span>
              )}
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          )}
          {actionButton}
        </div>
      </div>
    </header>
  );
};

export default Header;
