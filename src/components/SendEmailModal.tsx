
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Lead {
  id: number;
  name: string;
  email: string;
}

interface SendEmailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
}

const SendEmailModal = ({ open, onOpenChange, lead }: SendEmailModalProps) => {
  const [emailData, setEmailData] = useState({
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmailData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the email using an API
    console.log("Sending email to:", lead.email, emailData);
    
    // Show success message
    toast.success(`Email sent to ${lead.name}`);
    
    // Close modal and reset form
    onOpenChange(false);
    setEmailData({
      subject: "",
      message: ""
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Send Email to {lead.name}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="recipient" className="text-right">
                To
              </Label>
              <Input 
                id="recipient" 
                value={lead.email} 
                className="col-span-3" 
                disabled
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="subject" className="text-right">
                Subject
              </Label>
              <Input 
                id="subject" 
                name="subject"
                value={emailData.subject} 
                onChange={handleChange} 
                className="col-span-3" 
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-2">
              <Label htmlFor="message" className="text-right pt-2">
                Message
              </Label>
              <Textarea 
                id="message" 
                name="message"
                value={emailData.message} 
                onChange={handleChange} 
                className="col-span-3 min-h-[150px]" 
                required
              />
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
            <Button type="submit">Send Email</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SendEmailModal;
