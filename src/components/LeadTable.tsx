import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Mail, Pencil, Trash2, Loader2 } from "lucide-react";
import UpdateStatusModal from "./UpdateStatusModal";
import SendEmailModal from "./SendEmailModal";
import EditLeadModal from "./EditLeadModal";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Define type for Lead with user_id included
export interface Lead {
  id: string;
  name: string;
  mobile: string;
  email: string;
  isProspect: boolean;
  status: string;
  user_id: string; // Added user_id as a required field
  created_at?: string;
  updated_at?: string;
}

// Define the type for new lead data coming from the form
export interface NewLeadData {
  name: string;
  mobileNumber: string;
  email: string;
  prospect: string;
  status: string;
}

// Define props interface with the setAddLeadFunction function
interface LeadTableProps {
  onAddLead?: (addLeadFn: (data: NewLeadData) => Promise<Lead>) => void;
}

const LeadTable = ({ onAddLead }: LeadTableProps) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [isSendEmailModalOpen, setIsSendEmailModalOpen] = useState(false);
  const [isEditLeadModalOpen, setIsEditLeadModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Get current user ID on component mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
    
    if (storedUserId) {
      fetchLeads(storedUserId);
    } else {
      // If no user ID is found, show an error
      setLeads([]);
      setError("Please log in to view your leads");
      setLoading(false);
    }
  }, []);

  // Function to fetch leads from Supabase for the current user
  const fetchLeads = async (currentUserId: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', currentUserId)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }

      if (!data) {
        setLeads([]);
        return;
      }

      // Transform the data to match our Lead interface
      const transformedLeads: Lead[] = data.map(lead => ({
        id: lead.id,
        name: lead.name,
        mobile: lead.mobile,
        email: lead.email,
        isProspect: lead.is_prospect,
        status: lead.status,
        user_id: (lead as any).user_id || currentUserId,
        created_at: lead.created_at,
        updated_at: lead.updated_at
      }));
      
      setLeads(transformedLeads);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch leads');
      toast.error('Failed to fetch leads');
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to add a new lead - fixing the return type
  const addLead = async (leadData: NewLeadData): Promise<Lead> => {
    try {
      if (!userId) {
        toast.error("Please log in to add leads");
        throw new Error("User not logged in");
      }

      // Prepare the lead data for insertion with the user_id
      const newLeadData = {
        name: leadData.name,
        mobile: leadData.mobileNumber,
        email: leadData.email,
        is_prospect: leadData.prospect === "Yes" || leadData.prospect === "yes" || leadData.prospect === "true" || leadData.prospect === "True",
        status: leadData.status,
        user_id: userId // Associate lead with current user
      };

      // Insert the new lead into Supabase
      const { data, error } = await supabase
        .from('leads')
        .insert([newLeadData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error("Failed to create lead");
      }

      // Transform the returned lead to match our Lead interface
      const newLead: Lead = {
        id: data.id,
        name: data.name,
        mobile: data.mobile,
        email: data.email,
        isProspect: data.is_prospect,
        status: data.status,
        user_id: (data as any).user_id || userId,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      // Update the leads state with the new lead
      setLeads(prevLeads => [newLead, ...prevLeads]);
      
      toast.success("Lead added successfully!");
      return newLead;
    } catch (err: any) {
      toast.error(`Failed to add lead: ${err.message}`);
      console.error('Error adding lead:', err);
      throw err;
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    let badgeClass = "";
    
    switch (status.toLowerCase()) {
      case "active":
      case "open":
        badgeClass = "bg-green-100 text-green-800 hover:bg-green-100";
        break;
      case "inactive":
      case "closed":
        badgeClass = "bg-red-100 text-red-800 hover:bg-red-100";
        break;
      case "pending":
      case "in progress":
        badgeClass = "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
        break;
      default:
        badgeClass = "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
    
    return (
      <Badge className={`font-medium ${badgeClass}`} variant="outline">
        {status}
      </Badge>
    );
  };

  // Handler for opening update status modal
  const handleUpdateStatus = (lead: Lead) => {
    setSelectedLead(lead);
    setIsUpdateStatusModalOpen(true);
  };

  // Handler for opening send email modal
  const handleSendEmail = (lead: Lead) => {
    setSelectedLead(lead);
    setIsSendEmailModalOpen(true);
  };

  // Handler for opening edit lead modal
  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsEditLeadModalOpen(true);
  };

  // Handler for opening delete confirmation
  const handleDeleteConfirm = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDeleteConfirmOpen(true);
  };

  // Handler for updating lead status
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      if (!userId) {
        toast.error("You must be logged in to update leads");
        return;
      }

      // Update the lead status in Supabase, ensuring user owns the lead
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', id)
        .eq('user_id', userId); // Ensure lead belongs to current user

      if (error) {
        throw error;
      }

      // Update the lead status in the UI
      setLeads(leads.map(lead => 
        lead.id === id ? { ...lead, status: newStatus } : lead
      ));
      
      setIsUpdateStatusModalOpen(false);
      toast.success("Status updated successfully");
    } catch (err: any) {
      toast.error(`Failed to update status: ${err.message}`);
      console.error('Error updating status:', err);
    }
  };

  // Handler for updating lead details
  const handleLeadUpdate = async (id: string, updatedData: Omit<Lead, "id" | "user_id">) => {
    try {
      if (!userId) {
        toast.error("You must be logged in to update leads");
        return;
      }

      // Prepare the data for update
      const updateData = {
        name: updatedData.name,
        mobile: updatedData.mobile,
        email: updatedData.email,
        is_prospect: updatedData.isProspect,
        status: updatedData.status
      };

      // Update the lead in Supabase, ensuring user owns the lead
      const { error } = await supabase
        .from('leads')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', userId); // Ensure lead belongs to current user

      if (error) {
        throw error;
      }

      // Update the lead in the UI
      setLeads(leads.map(lead => 
        lead.id === id ? { ...lead, ...updatedData } : lead
      ));

      toast.success("Lead updated successfully");
    } catch (err: any) {
      toast.error(`Failed to update lead: ${err.message}`);
      console.error('Error updating lead:', err);
    }
  };

  // Handler for deleting a lead
  const handleDeleteLead = async () => {
    if (!selectedLead) return;
    
    try {
      if (!userId) {
        toast.error("You must be logged in to delete leads");
        return;
      }

      // Delete the lead from Supabase, ensuring user owns the lead
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', selectedLead.id)
        .eq('user_id', userId); // Ensure lead belongs to current user

      if (error) {
        throw error;
      }

      // Remove the lead from the UI
      setLeads(leads.filter(lead => lead.id !== selectedLead.id));
      
      toast.success(`${selectedLead.name} has been removed from the leads list`);
      setIsDeleteConfirmOpen(false);
    } catch (err: any) {
      toast.error(`Failed to delete lead: ${err.message}`);
      console.error('Error deleting lead:', err);
    }
  };

  // Make addLead available to parent components
  if (onAddLead) {
    onAddLead(addLead);
  }

  // Icons for the UI
  const CheckIcon = ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );

  const XIcon = ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <span className="ml-2 text-lg text-gray-600">Loading leads...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col justify-center items-center h-60">
          <div className="text-red-500 mb-2">{error}</div>
          {userId && <Button onClick={() => fetchLeads(userId)}>Retry</Button>}
        </div>
      ) : leads.length === 0 ? (
        <div className="flex justify-center items-center h-60">
          <div className="text-gray-500">
            {userId 
              ? "No leads found. Add your first lead by clicking the \"Add New Lead\" button." 
              : "Please log in to view and manage your leads."}
          </div>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead className="w-[200px]">Mobile Number</TableHead>
              <TableHead className="w-[250px]">Email</TableHead>
              <TableHead className="w-[100px]">Prospect</TableHead>
              <TableHead className="w-[150px]">Status</TableHead>
              <TableHead className="w-[150px] text-center">Send Email</TableHead>
              <TableHead className="w-[120px] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>{lead.mobile}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>
                  {lead.isProspect ? (
                    <CheckIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <XIcon className="h-5 w-5 text-red-500" />
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={lead.status} />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleUpdateStatus(lead)}
                      className="h-6 w-6 p-0 ml-1"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => handleSendEmail(lead)}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEditLead(lead)}
                      className="h-8 w-8 p-0"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteConfirm(lead)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Update Status Modal */}
      {selectedLead && (
        <UpdateStatusModal
          open={isUpdateStatusModalOpen}
          onOpenChange={setIsUpdateStatusModalOpen}
          lead={selectedLead}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Send Email Modal */}
      {selectedLead && (
        <SendEmailModal
          open={isSendEmailModalOpen}
          onOpenChange={setIsSendEmailModalOpen}
          lead={selectedLead}
        />
      )}

      {/* Edit Lead Modal */}
      {selectedLead && (
        <EditLeadModal
          open={isEditLeadModalOpen}
          onOpenChange={setIsEditLeadModalOpen}
          lead={selectedLead}
          onSave={handleLeadUpdate}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this lead?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the lead
              {selectedLead && ` "${selectedLead.name}"`} and remove their data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteLead}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LeadTable;
