import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Mail, Pencil, Trash2 } from "lucide-react";
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

// Sample data for the leads
const initialLeads = [
  {
    id: 1,
    name: "John Doe",
    mobile: "+1 (555) 123-4567",
    email: "john.doe@example.com",
    isProspect: true,
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    mobile: "+1 (555) 987-6543",
    email: "jane.smith@example.com",
    isProspect: false,
    status: "Inactive",
  },
  {
    id: 3,
    name: "Robert Johnson",
    mobile: "+1 (555) 456-7890",
    email: "robert.johnson@example.com",
    isProspect: true,
    status: "Pending",
  },
  {
    id: 4,
    name: "Emily Davis",
    mobile: "+1 (555) 789-0123",
    email: "emily.davis@example.com",
    isProspect: true,
    status: "Active",
  },
  {
    id: 5,
    name: "Michael Wilson",
    mobile: "+1 (555) 321-0987",
    email: "michael.wilson@example.com",
    isProspect: false,
    status: "Inactive",
  },
];

// Define type for Lead
export interface Lead {
  id: number;
  name: string;
  mobile: string;
  email: string;
  isProspect: boolean;
  status: string;
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
  onAddLead?: (addLeadFn: (data: NewLeadData) => void) => void;
}

const LeadTable = ({ onAddLead }: LeadTableProps) => {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [isSendEmailModalOpen, setIsSendEmailModalOpen] = useState(false);
  const [isEditLeadModalOpen, setIsEditLeadModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Function to add a new lead
  const addLead = (leadData: NewLeadData) => {
    const newId = leads.length > 0 ? Math.max(...leads.map(lead => lead.id)) + 1 : 1;
    
    const newLead: Lead = {
      id: newId,
      name: leadData.name,
      mobile: leadData.mobileNumber,
      email: leadData.email,
      isProspect: leadData.prospect === "Yes" || leadData.prospect === "yes" || leadData.prospect === "true" || leadData.prospect === "True",
      status: leadData.status
    };
    
    setLeads(prevLeads => [...prevLeads, newLead]);
    return newLead;
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
  const handleStatusChange = (id: number, newStatus: string) => {
    setLeads(leads.map(lead => 
      lead.id === id ? { ...lead, status: newStatus } : lead
    ));
    setIsUpdateStatusModalOpen(false);
  };

  // Handler for updating lead details
  const handleLeadUpdate = (id: number, updatedData: Omit<Lead, "id">) => {
    setLeads(leads.map(lead => 
      lead.id === id ? { ...lead, ...updatedData } : lead
    ));
  };

  // Handler for deleting a lead
  const handleDeleteLead = () => {
    if (selectedLead) {
      setLeads(leads.filter(lead => lead.id !== selectedLead.id));
      toast.success(`${selectedLead.name} has been removed from the leads list`);
      setIsDeleteConfirmOpen(false);
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
