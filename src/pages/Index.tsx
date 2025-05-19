
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Header from "@/components/Header";
import LeadTable, { Lead } from "@/components/LeadTable";
import AddLeadModal from "@/components/AddLeadModal";
import { Toaster } from "sonner";

const Index = () => {
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  // Reference to the LeadTable component for adding leads
  const [leads, setLeads] = useState<Lead[]>([]);

  // Handler for adding a new lead
  const handleAddLead = (lead: Lead) => {
    setLeads(prevLeads => [...prevLeads, lead]);
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
        <LeadTable />
      </main>
      
      <AddLeadModal 
        open={isAddLeadModalOpen}
        onOpenChange={setIsAddLeadModalOpen}
        onLeadAdded={handleAddLead}
      />
      
      <Toaster position="top-right" />
    </div>
  );
};

export default Index;
