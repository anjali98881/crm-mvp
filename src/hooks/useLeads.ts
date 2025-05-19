
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lead, NewLeadData, AddLeadFunction } from "@/types/lead";
import { toast } from "sonner";

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
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
        user_id: lead.user_id,
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

  // Function to add a new lead
  const addLead: AddLeadFunction = async (leadData) => {
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
        user_id: data.user_id,
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

  // Handler for updating lead status
  const updateLeadStatus = async (id: string, newStatus: string) => {
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
      
      toast.success("Status updated successfully");
      return true;
    } catch (err: any) {
      toast.error(`Failed to update status: ${err.message}`);
      console.error('Error updating status:', err);
      return false;
    }
  };

  // Handler for updating lead details
  const updateLead = async (id: string, updatedData: Omit<Lead, "id" | "user_id">) => {
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
      return true;
    } catch (err: any) {
      toast.error(`Failed to update lead: ${err.message}`);
      console.error('Error updating lead:', err);
      return false;
    }
  };

  // Handler for deleting a lead
  const deleteLead = async (id: string) => {
    try {
      if (!userId) {
        toast.error("You must be logged in to delete leads");
        return;
      }

      // Delete the lead from Supabase, ensuring user owns the lead
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id)
        .eq('user_id', userId); // Ensure lead belongs to current user

      if (error) {
        throw error;
      }

      // Remove the lead from the UI
      setLeads(leads.filter(lead => lead.id !== id));
      
      toast.success("Lead has been removed");
      return true;
    } catch (err: any) {
      toast.error(`Failed to delete lead: ${err.message}`);
      console.error('Error deleting lead:', err);
      return false;
    }
  };

  return {
    leads,
    loading,
    error,
    userId,
    addLead,
    updateLeadStatus,
    updateLead,
    deleteLead,
    fetchLeads
  };
}
