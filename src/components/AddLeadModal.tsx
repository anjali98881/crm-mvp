
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Lead } from "./LeadTable";

interface AddLeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLeadAdded?: (lead: Lead) => void;
}

const AddLeadModal = ({ open, onOpenChange, onLeadAdded }: AddLeadModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    email: "",
    isProspect: "true", // default to true
    status: "New"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProspectChange = (value: string) => {
    setFormData(prev => ({ ...prev, isProspect: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate a unique ID for the new lead (simple implementation)
    const newLeadId = Date.now();
    
    // Create the new lead object
    const newLead: Lead = {
      id: newLeadId,
      name: formData.name,
      mobile: formData.mobileNumber,
      email: formData.email,
      isProspect: formData.isProspect === "true", // Convert string to boolean
      status: formData.status
    };
    
    // Call the parent component's callback with the new lead
    if (onLeadAdded) {
      onLeadAdded(newLead);
    }
    
    // Show success toast
    toast.success("Lead added successfully!");
    
    // Close the modal
    onOpenChange(false);
    
    // Reset form for next use
    setFormData({
      name: "",
      mobileNumber: "",
      email: "",
      isProspect: "true",
      status: "New"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input 
                id="name" 
                name="name"
                value={formData.name} 
                onChange={handleChange} 
                className="col-span-3" 
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="mobileNumber" className="text-right">
                Mobile Number
              </Label>
              <Input 
                id="mobileNumber" 
                name="mobileNumber"
                value={formData.mobileNumber} 
                onChange={handleChange} 
                className="col-span-3" 
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input 
                id="email" 
                name="email"
                type="email" 
                value={formData.email} 
                onChange={handleChange} 
                className="col-span-3" 
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-2">
              <Label className="text-right">
                Prospect
              </Label>
              <div className="col-span-3">
                <RadioGroup 
                  value={formData.isProspect} 
                  onValueChange={handleProspectChange}
                  className="flex items-center space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="prospect-yes" />
                    <Label htmlFor="prospect-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="prospect-no" />
                    <Label htmlFor="prospect-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select 
                value={formData.status} 
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Lead</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLeadModal;
