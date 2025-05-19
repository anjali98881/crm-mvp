
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lead } from "@/types/lead";  // Import from our new types file

interface UpdateStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
  onStatusChange: (id: string, status: string) => void;
}

const UpdateStatusModal = ({ 
  open, 
  onOpenChange, 
  lead, 
  onStatusChange 
}: UpdateStatusModalProps) => {
  const [status, setStatus] = useState(lead.status);

  const handleStatusChange = (value: string) => {
    setStatus(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStatusChange(lead.id, status);
    toast.success(`Status updated for ${lead.name}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Update Status: {lead.name}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Update Status</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStatusModal;
