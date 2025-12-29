import { ComplaintStatus, STATUS_LABELS } from "@/types/complaint";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: ComplaintStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      className={cn(
        "font-medium",
        status === "pending" && "status-pending",
        status === "in_progress" && "status-progress",
        status === "resolved" && "status-resolved",
        className
      )}
    >
      {STATUS_LABELS[status]}
    </Badge>
  );
}
