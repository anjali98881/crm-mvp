
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
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

export default StatusBadge;
