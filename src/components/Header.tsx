
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, UserPlus } from "lucide-react";
import { toast } from "sonner";

interface HeaderProps {
  title: string;
  actionButton?: React.ReactNode;
}

const Header = ({ title, actionButton }: HeaderProps) => {
  // This would typically come from an auth context
  const isLoggedIn = true; // Changed to true for this implementation
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Here you would typically sign out the user from your auth system
    // For now, we'll just simulate a sign out with a timeout
    toast.info("Signing out...");
    
    setTimeout(() => {
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
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          )}
          {actionButton}
        </div>
      </div>
    </header>
  );
};

export default Header;
