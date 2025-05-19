
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

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

const LeadTable = () => {
  const [leads] = useState(initialLeads);

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    let badgeClass = "";
    
    switch (status.toLowerCase()) {
      case "active":
        badgeClass = "bg-green-100 text-green-800 hover:bg-green-100";
        break;
      case "inactive":
        badgeClass = "bg-red-100 text-red-800 hover:bg-red-100";
        break;
      case "pending":
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

  const MailIcon = ({ className }: { className?: string }) => (
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
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
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
                <StatusBadge status={lead.status} />
              </TableCell>
              <TableCell className="text-center">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MailIcon className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeadTable;
