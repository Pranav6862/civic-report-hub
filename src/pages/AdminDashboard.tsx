import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdminComplaints, useUpdateComplaintStatus } from "@/hooks/useComplaints";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";
import { CategoryBadge } from "@/components/CategoryBadge";
import { Loader2, LogOut, Home } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { ComplaintStatus } from "@/types/complaint";

export default function AdminDashboard() {
  const { user, loading, isAdmin, adminCategory, signOut } = useAuth();
  const { data: complaints, isLoading } = useAdminComplaints(adminCategory);
  const updateStatus = useUpdateComplaintStatus();

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!user || !isAdmin) return <Navigate to="/" replace />;

  const handleStatusChange = (id: string, status: ComplaintStatus) => {
    updateStatus.mutate({ id, status });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-lg">Admin Dashboard</h1>
            <p className="text-xs text-muted-foreground capitalize">{adminCategory === "all" ? "All Departments" : `${adminCategory} Department`}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild><Link to="/"><Home className="h-4 w-4" /></Link></Button>
            <Button variant="ghost" size="sm" onClick={signOut}><LogOut className="h-4 w-4" /></Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : complaints && complaints.length > 0 ? (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complaints.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="whitespace-nowrap">{format(new Date(c.created_at), "MMM d")}</TableCell>
                    <TableCell><CategoryBadge category={c.category} showIcon={false} /></TableCell>
                    <TableCell className="max-w-xs truncate">{c.description}</TableCell>
                    <TableCell><img src={c.image_url} alt="" className="w-16 h-12 object-cover rounded" /></TableCell>
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
          <div className="text-center py-20 text-muted-foreground">No complaints found for your department.</div>
        )}
      </main>
    </div>
  );
}
