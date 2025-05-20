import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lead } from "./LeadTable";  // Import the Lead type from LeadTable.tsx

interface SendEmailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
}

const SendEmailModal = ({ open, onOpenChange, lead }: SendEmailModalProps) => {
  const [emailData, setEmailData] = useState({
    from: "anjali98881@gmail.com", // Default from address
    subject: "",
    message: ""
  });

  const [isSending, setIsSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmailData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    try {
      // Here you would send the email using an API
      // For now, we're simulating the API call with a timeout
      console.log("Sending email from:", emailData.from);
      console.log("Sending email to:", lead.email);
      console.log("Subject:", emailData.subject);
      console.log("Message:", emailData.message);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast.success(`Email sent to ${lead.name}`);
      
      // Close modal and reset form
      onOpenChange(false);
      setEmailData({
        from: "anjali98881@gmail.com",
        subject: "",
        message: ""
      });
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
    }
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
              <Label htmlFor="from" className="text-right">
                From
              </Label>
              <Input 
                id="from" 
                name="from"
                value={emailData.from} 
                onChange={handleChange} 
                className="col-span-3" 
                required
              />
            </div>
            
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
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Send Email"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SendEmailModal;
