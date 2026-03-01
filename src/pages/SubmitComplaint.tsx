import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useCreateComplaint } from "@/hooks/useComplaints";
import { ComplaintCategory, CATEGORY_LABELS, CATEGORY_ICONS } from "@/types/complaint";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Camera, MapPin, Loader2, Upload, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SubmitComplaint() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { latitude, longitude, error: geoError, loading: geoLoading, getLocation } = useGeolocation();
  const createComplaint = useCreateComplaint();
  const { toast } = useToast();

  const [category, setCategory] = useState<ComplaintCategory | null>(null);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!user) return <Navigate to="/auth" replace />;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !description || !imageFile || !latitude || !longitude) return;

    setUploading(true);
    const sanitizedName = imageFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileName = `${user.id}/${Date.now()}-${sanitizedName}`;
    const { error: uploadError } = await supabase.storage.from("complaint-images").upload(fileName, imageFile);
    
    if (uploadError) {
      console.error("Upload error:", uploadError);
      setUploading(false);
      toast({
        title: "Upload Failed",
        description: uploadError.message || "Failed to upload image. Please try again.",
        variant: "destructive"
      });
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("complaint-images").getPublicUrl(fileName);

    try {
      await createComplaint.mutateAsync({
        category,
        description,
        image_url: publicUrl,
        latitude,
        longitude
      });
      navigate("/my-complaints");
    } catch (err: any) {
      console.error("Submit error:", err);
      toast({
        title: "Submission Failed",
        description: err?.message || "Failed to submit complaint. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const isValid = category && description.trim() && imageFile && latitude && longitude;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild><Link to="/"><ArrowLeft className="h-5 w-5" /></Link></Button>
          <div><h1 className="font-bold text-lg">Report a Hazard</h1><p className="text-xs text-muted-foreground">Submit a new complaint</p></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div className="space-y-3">
            <Label>Category *</Label>
            <div className="grid grid-cols-3 gap-3">
              {(["roads", "waste", "electricity"] as ComplaintCategory[]).map((cat) => (
                <button key={cat} type="button" onClick={() => setCategory(cat)}
                  className={cn("p-4 rounded-lg border-2 text-center transition-all", category === cat ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}>
                  <span className="text-2xl block mb-1">{CATEGORY_ICONS[cat]}</span>
                  <span className="text-xs font-medium">{CATEGORY_LABELS[cat]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-3">
            <Label>Photo *</Label>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
            {imagePreview ? (
              <div className="relative"><img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                <Button type="button" variant="secondary" size="sm" className="absolute bottom-2 right-2" onClick={() => fileInputRef.current?.click()}><Camera className="h-4 w-4 mr-1" />Change</Button>
              </div>
            ) : (
              <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center hover:border-primary transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" /><span className="text-sm text-muted-foreground">Click to upload photo</span>
              </button>
            )}
          </div>

          {/* Location */}
          <div className="space-y-3">
            <Label>Location *</Label>
            {latitude && longitude ? (
              <div className="flex items-center gap-2 p-3 bg-accent/20 rounded-lg"><CheckCircle className="h-5 w-5 text-accent" /><span className="text-sm">Location captured</span></div>
            ) : (
              <Button type="button" variant="outline" onClick={getLocation} disabled={geoLoading} className="w-full">
                {geoLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <MapPin className="h-4 w-4 mr-2" />}
                {geoLoading ? "Getting location..." : "Get Current Location"}
              </Button>
            )}
            {geoError && <p className="text-sm text-destructive">{geoError}</p>}
          </div>

          {/* Description */}
          <div className="space-y-3">
            <Label>Description *</Label>
            <Textarea placeholder="Describe the issue..." value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
          </div>

          <Button type="submit" className="w-full" disabled={!isValid || uploading || createComplaint.isPending}>
            {uploading || createComplaint.isPending ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Submitting...</> : "Submit Complaint"}
          </Button>
        </form>
      </main>
    </div>
  );
}
