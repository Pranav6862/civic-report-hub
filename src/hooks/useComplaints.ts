import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Complaint, ComplaintCategory, ComplaintStatus } from "@/types/complaint";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export function useUserComplaints() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["complaints", "user", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("complaints")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Complaint[];
    },
    enabled: !!user
  });
}

export function useAdminComplaints(category: string | null) {
  const { user, isAdmin } = useAuth();

  return useQuery({
    queryKey: ["complaints", "admin", category],
    queryFn: async () => {
      if (!user || !isAdmin) return [];
      
      if (category && category !== "all") {
        const { data, error } = await supabase
          .from("complaints")
          .select("*")
          .eq("category", category as "roads" | "waste" | "electricity")
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        return data as Complaint[];
      }

      const { data, error } = await supabase
        .from("complaints")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Complaint[];
    },
    enabled: !!user && isAdmin
  });
}

interface CreateComplaintData {
  category: ComplaintCategory;
  description: string;
  image_url: string;
  latitude: number;
  longitude: number;
  address?: string;
}

export function useCreateComplaint() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateComplaintData) => {
      if (!user) throw new Error("User not authenticated");

      const { data: complaint, error } = await supabase
        .from("complaints")
        .insert({
          ...data,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return complaint;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
      toast({
        title: "Complaint Submitted",
        description: "Your complaint has been submitted successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });
}

export function useUpdateComplaintStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      admin_notes 
    }: { 
      id: string; 
      status: ComplaintStatus; 
      admin_notes?: string;
    }) => {
      const updateData: Partial<Complaint> = { status };
      
      if (admin_notes !== undefined) {
        updateData.admin_notes = admin_notes;
      }
      
      if (status === "resolved") {
        updateData.resolved_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from("complaints")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
      toast({
        title: "Status Updated",
        description: "Complaint status has been updated."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });
}
