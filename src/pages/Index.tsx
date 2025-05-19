
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Header from "@/components/Header";
import LeadTable, { NewLeadData } from "@/components/LeadTable";
import AddLeadModal from "@/components/AddLeadModal";
import { Toaster } from "sonner";

const Index = () => {
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const addLeadFunctionRef = useRef<((data: NewLeadData) => void) | null>(null);

  // Function to set the addLead function from LeadTable
  const setAddLeadFunction = (addLeadFn: (data: NewLeadData) => void) => {
    addLeadFunctionRef.current = addLeadFn;
  };

  // Function to handle adding a new lead
  const handleAddLead = (leadData: NewLeadData) => {
    if (addLeadFunctionRef.current) {
      addLeadFunctionRef.current(leadData);
    }
  };

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
        <LeadTable onAddLead={setAddLeadFunction} />
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
