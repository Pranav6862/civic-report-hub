import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdminComplaints, useUpdateComplaintStatus } from "@/hooks/useComplaints";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";
import { Loader2, LogOut, Home, Zap } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { ComplaintStatus } from "@/types/complaint";

export default function ElectricityAdmin() {
  const { user, loading, isAdmin, adminCategory, signOut } = useAuth();
  const { data: complaints, isLoading } = useAdminComplaints("electricity");
  const updateStatus = useUpdateComplaintStatus();

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  
  // Only electricity_admin or super_admin can access
  if (!user || !isAdmin || (adminCategory !== "electricity" && adminCategory !== "all")) {
    return <Navigate to="/" replace />;
  }

  const handleStatusChange = (id: string, status: ComplaintStatus) => {
    updateStatus.mutate({ id, status });
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <header className="border-b bg-blue-600 text-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="h-8 w-8" />
            <div>
              <h1 className="font-bold text-lg">Electricity Department</h1>
              <p className="text-xs text-blue-100">Streetlights & Power Issues</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" asChild><Link to="/"><Home className="h-4 w-4" /></Link></Button>
            <Button variant="ghost" size="sm" onClick={signOut} className="text-white hover:bg-blue-700"><LogOut className="h-4 w-4" /></Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-blue-900">Electricity Complaints</h2>
          <p className="text-blue-700">Manage streetlight and power issue reports</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
        ) : complaints && complaints.length > 0 ? (
          <Card className="border-blue-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-100">
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complaints.map((c) => (
                  <TableRow key={c.id}>
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
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View Map
                      </a>
                    </TableCell>
                    <TableCell><StatusBadge status={c.status} /></TableCell>
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
                ))}
              </TableBody>
            </Table>
          </Card>
        ) : (
          <Card className="p-12 text-center border-blue-200">
            <Zap className="h-12 w-12 text-blue-300 mx-auto mb-4" />
            <p className="text-blue-700">No electricity complaints found.</p>
          </Card>
        )}
      </main>
    </div>
  );
}
