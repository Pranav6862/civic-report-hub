import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdminComplaints, useUpdateComplaintStatus } from "@/hooks/useComplaints";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";
import { Loader2, LogOut, Home, Trash2, AlertTriangle, Clock } from "lucide-react";
import { format, differenceInHours } from "date-fns";
import { Link } from "react-router-dom";
import { ComplaintStatus, Complaint } from "@/types/complaint";
import { useMemo } from "react";

const OVERDUE_HOURS = 48; // 2 days

function getUrgencyLevel(complaint: Complaint): "critical" | "none" {
  if (complaint.status === "resolved") return "none";
  const hoursElapsed = differenceInHours(new Date(), new Date(complaint.created_at));
  if (hoursElapsed >= OVERDUE_HOURS) return "critical";
  return "none";
}

export default function WasteAdmin() {
  const { user, loading, isAdmin, adminCategory, signOut } = useAuth();
  const { data: complaints, isLoading } = useAdminComplaints("waste");
  const updateStatus = useUpdateComplaintStatus();

  const overdueCount = useMemo(() => {
    if (!complaints) return 0;
    return complaints.filter((c) => getUrgencyLevel(c) === "critical").length;
  }, [complaints]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  
  // Only waste_admin or super_admin can access
  if (!user || !isAdmin || (adminCategory !== "waste" && adminCategory !== "all")) {
    return <Navigate to="/" replace />;
  }

  const handleStatusChange = (id: string, status: ComplaintStatus) => {
    updateStatus.mutate({ id, status });
  };

  return (
    <div className="min-h-screen bg-green-50">
      <header className="border-b bg-green-600 text-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trash2 className="h-8 w-8" />
            <div>
              <h1 className="font-bold text-lg">Waste Management</h1>
              <p className="text-xs text-green-100">Garbage & Sanitation Issues</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" asChild><Link to="/"><Home className="h-4 w-4" /></Link></Button>
            <Button variant="ghost" size="sm" onClick={signOut} className="text-white hover:bg-green-700"><LogOut className="h-4 w-4" /></Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Overdue Banner */}
        {overdueCount > 0 && (
          <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-600 shrink-0" />
            <div>
              <p className="font-semibold text-red-800">
                {overdueCount} complaint{overdueCount > 1 ? "s" : ""} overdue!
              </p>
              <p className="text-sm text-red-600">
                These complaints have not been resolved for more than 2 days. Please take action.
              </p>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-green-900">Waste Complaints</h2>
          <p className="text-green-700">Manage garbage and sanitation reports</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-green-600" /></div>
        ) : complaints && complaints.length > 0 ? (
          <Card className="border-green-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-green-100">
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complaints.map((c) => {
                  const urgency = getUrgencyLevel(c);
                  return (
                    <TableRow key={c.id} className={urgency === "critical" ? "bg-red-50" : ""}>
                      <TableCell className="whitespace-nowrap">{format(new Date(c.created_at), "MMM d, yyyy")}</TableCell>
                      <TableCell className="max-w-xs truncate">{c.description}</TableCell>
                      <TableCell>
                        <img src={c.image_url} alt="Complaint" className="w-20 h-14 object-cover rounded border" />
                      </TableCell>
                      <TableCell>
                        <a 
                          href={`https://maps.google.com/?q=${c.latitude},${c.longitude}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-green-600 hover:underline text-sm"
                        >
                          View Map
                        </a>
                      </TableCell>
                      <TableCell><StatusBadge status={c.status} /></TableCell>
                      <TableCell>
                        {urgency === "critical" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 border border-red-300 px-2.5 py-1 text-xs font-semibold text-red-700">
                            <Clock className="h-3 w-3" />
                            Overdue
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Select value={c.status} onValueChange={(v) => handleStatusChange(c.id, v as ComplaintStatus)}>
                          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        ) : (
          <Card className="p-12 text-center border-green-200">
            <Trash2 className="h-12 w-12 text-green-300 mx-auto mb-4" />
            <p className="text-green-700">No waste complaints found.</p>
          </Card>
        )}
      </main>
    </div>
  );
}
