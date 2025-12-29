import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, MapPin, ClipboardList, Shield, ArrowRight, LogOut, Loader2 } from "lucide-react";

export default function Index() {
  const { user, loading, isAdmin, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">Hazard Reporter</h1>
              <p className="text-xs text-muted-foreground">Community Reporting System</p>
            </div>
          </div>
          
          <nav className="flex items-center gap-3">
            {user ? (
              <>
                {isAdmin && (
                  <Button variant="outline" asChild>
                    <Link to="/admin">Admin Dashboard</Link>
                  </Button>
                )}
                <Button variant="outline" asChild>
                  <Link to="/my-complaints">My Complaints</Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={signOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 animate-fade-in">
            Report Local Hazards,{" "}
            <span className="text-primary">Build Safer Communities</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8 animate-fade-in">
            Spotted a pothole, broken streetlight, or garbage overflow? Report it instantly 
            with a photo and your location. We'll route it to the right department for quick resolution.
          </p>
          
          {user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Button size="lg" asChild className="gap-2">
                <Link to="/submit">
                  <AlertTriangle className="h-5 w-5" />
                  Report a Hazard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/my-complaints">
                  <ClipboardList className="h-5 w-5 mr-2" />
                  View My Reports
                </Link>
              </Button>
            </div>
          ) : (
            <Button size="lg" asChild className="animate-fade-in">
              <Link to="/auth">
                Get Started
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h3 className="text-2xl font-bold text-center mb-12">What You Can Report</h3>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="border-2 border-category-roads/30 hover:border-category-roads transition-colors">
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full bg-category-roads/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🛣️</span>
                </div>
                <CardTitle className="text-category-roads">Roads & Potholes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Potholes, road damage, missing signs, damaged guardrails, and other road infrastructure issues.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 border-category-waste/30 hover:border-category-waste transition-colors">
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full bg-category-waste/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🗑️</span>
                </div>
                <CardTitle className="text-category-waste">Waste & Garbage</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Overflowing bins, illegal dumping, garbage on streets, damaged trash containers.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 border-category-electricity/30 hover:border-category-electricity transition-colors">
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full bg-category-electricity/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💡</span>
                </div>
                <CardTitle className="text-category-electricity">Streetlights</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Broken streetlights, damaged poles, exposed wiring, flickering lights.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h3 className="text-2xl font-bold text-center mb-12">How It Works</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h4 className="font-semibold mb-2">Take a Photo</h4>
              <p className="text-muted-foreground text-sm">
                Snap a photo of the hazard using your phone's camera.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h4 className="font-semibold mb-2">Auto-Locate</h4>
              <p className="text-muted-foreground text-sm">
                We automatically capture your GPS location for accurate reporting.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h4 className="font-semibold mb-2">Track Progress</h4>
              <p className="text-muted-foreground text-sm">
                Monitor your complaint status as it's reviewed and resolved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground text-sm">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-4 w-4" />
            <span>Community Hazard Reporting System</span>
          </div>
          <p>Making our neighborhoods safer, one report at a time.</p>
        </div>
      </footer>
    </div>
  );
}
