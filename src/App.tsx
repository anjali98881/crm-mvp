
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";

const App = () => {
  // Move the QueryClient creation inside the component
  // This ensures React hooks are called within the component function
  const [queryClient] = useState(() => new QueryClient());
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check authentication status on mount and when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      const userLoggedIn = localStorage.getItem("userLoggedIn") === "true";
      setIsLoggedIn(userLoggedIn);
    };
    
    checkAuth();
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={isLoggedIn ? <Index /> : <Navigate to="/signin" />} />
            <Route path="/signin" element={!isLoggedIn ? <SignIn /> : <Navigate to="/" />} />
            <Route path="/signup" element={!isLoggedIn ? <SignUp /> : <Navigate to="/" />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
