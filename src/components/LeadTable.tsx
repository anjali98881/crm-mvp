
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

// Import from our newly created files
import { Lead, AddLeadFunction } from "@/types/lead";
import { useLeads } from "@/hooks/useLeads";
import StatusBadge from "./leads/StatusBadge";
import { CheckIcon, XIcon } from "./leads/LeadIcons";

// Define props interface with the onAddLead function
interface LeadTableProps {
  onAddLead?: (addLeadFn: AddLeadFunction) => void;
}

const LeadTable = ({ onAddLead }: LeadTableProps) => {
  const { 
    leads, 
    loading, 
    error, 
    userId,
    addLead, 
    updateLeadStatus, 
    updateLead, 
    deleteLead 
  } = useLeads();

  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [isSendEmailModalOpen, setIsSendEmailModalOpen] = useState(false);
  const [isEditLeadModalOpen, setIsEditLeadModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

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

  // Handler for deleting a lead
  const handleDeleteLead = () => {
    if (!selectedLead) return;
    deleteLead(selectedLead.id);
    setIsDeleteConfirmOpen(false);
  };

  // Handler for status update
  const handleStatusChange = async (id: string, newStatus: string) => {
    const success = await updateLeadStatus(id, newStatus);
    if (success) {
      setIsUpdateStatusModalOpen(false);
    }
  };

  // Handler for lead update
  const handleLeadUpdate = async (id: string, updatedData: Omit<Lead, "id" | "user_id">) => {
    const success = await updateLead(id, updatedData);
    if (success) {
      setIsEditLeadModalOpen(false);
    }
  };

  // Make addLead available to parent components
  if (onAddLead) {
    onAddLead(addLead);
  }

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
          {userId && <Button onClick={() => userId && userId.length > 0 && useLeads().fetchLeads(userId)}>Retry</Button>}
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
