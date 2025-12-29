import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserComplaints } from "@/hooks/useComplaints";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { CategoryBadge } from "@/components/CategoryBadge";
import { AlertTriangle, ArrowLeft, Plus, Loader2, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

export default function MyComplaints() {
  const { user, loading: authLoading } = useAuth();
  const { data: complaints, isLoading } = useUserComplaints();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="font-bold text-lg text-foreground">My Complaints</h1>
              <p className="text-xs text-muted-foreground">Track your reported issues</p>
            </div>
          </div>
          
          <Button asChild>
            <Link to="/submit">
              <Plus className="h-4 w-4 mr-2" />
              New Report
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : complaints && complaints.length > 0 ? (
          <div className="grid gap-4 max-w-3xl mx-auto">
            {complaints.map((complaint) => (
              <Card key={complaint.id} className="overflow-hidden animate-fade-in">
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="w-full md:w-48 h-48 md:h-auto flex-shrink-0">
                    <img
                      src={complaint.image_url}
                      alt="Complaint"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <CardHeader className="pb-2">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <CategoryBadge category={complaint.category} />
                        <StatusBadge status={complaint.status} />
                      </div>
                      <CardTitle className="text-base line-clamp-2">
                        {complaint.description}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(complaint.created_at), "MMM d, yyyy")}
                        </div>
                        {complaint.address && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span className="line-clamp-1">{complaint.address}</span>
                          </div>
                        )}
                      </div>
                      
                      {complaint.admin_notes && (
                        <div className="mt-3 p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium mb-1">Admin Note:</p>
                          <p className="text-sm text-muted-foreground">{complaint.admin_notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Complaints Yet</h2>
            <p className="text-muted-foreground mb-6">
              You haven't submitted any complaints yet. Report your first hazard!
            </p>
            <Button asChild>
              <Link to="/submit">
                <Plus className="h-4 w-4 mr-2" />
                Report a Hazard
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
