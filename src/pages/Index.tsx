
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Header from "@/components/Header";
import LeadTable from "@/components/LeadTable";
import AddLeadModal from "@/components/AddLeadModal";
import { Toaster } from "sonner";
import { AddLeadFunction, NewLeadData } from "@/types/lead";

const Index = () => {
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [addLeadFunction, setAddLeadFunction] = useState<AddLeadFunction | null>(null);
  const navigate = useNavigate();

  // Check if user is logged in on component mount
  useEffect(() => {
    const userLoggedIn = localStorage.getItem("userLoggedIn") === "true";
    setIsLoggedIn(userLoggedIn);
    
    // If user is not logged in, redirect to sign in page
    if (!userLoggedIn) {
      navigate("/signin");
    }
  }, [navigate]);

  // Function to set the addLead function from LeadTable
  const setAddLeadFn = (addLeadFn: AddLeadFunction) => {
    setAddLeadFunction(() => addLeadFn);
  };

  // Function to handle adding a new lead
  const handleAddLead = (leadData: NewLeadData) => {
    if (addLeadFunction) {
      addLeadFunction(leadData);
    }
  };

  if (!isLoggedIn) {
    return null; // Don't render anything while checking auth or redirecting
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Lead Management" 
        actionButton={
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700"
            onClick={() => setIsAddLeadModalOpen(true)}
          >
            <span className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Lead
            </span>
          </Button>
        } 
      />
      <main className="container mx-auto px-4 py-6">
        <LeadTable onAddLead={setAddLeadFn} />
      </main>
      
      <AddLeadModal 
        open={isAddLeadModalOpen}
        onOpenChange={setIsAddLeadModalOpen}
        onAddLead={handleAddLead}
      />
      
      <Toaster position="top-right" />
    </div>
  );
};

export default Index;
