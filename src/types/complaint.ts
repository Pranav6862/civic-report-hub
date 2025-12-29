export type ComplaintCategory = "roads" | "waste" | "electricity";
export type ComplaintStatus = "pending" | "in_progress" | "resolved";

export interface Complaint {
  id: string;
  user_id: string;
  category: ComplaintCategory;
  description: string;
  image_url: string;
  latitude: number;
  longitude: number;
  address: string | null;
  status: ComplaintStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

export const CATEGORY_LABELS: Record<ComplaintCategory, string> = {
  roads: "Roads & Potholes",
  waste: "Waste & Garbage",
  electricity: "Streetlights & Electricity"
};

export const CATEGORY_ICONS: Record<ComplaintCategory, string> = {
  roads: "🛣️",
  waste: "🗑️",
  electricity: "💡"
};

export const STATUS_LABELS: Record<ComplaintStatus, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  resolved: "Resolved"
};
