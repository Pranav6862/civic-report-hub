import { ComplaintCategory, CATEGORY_LABELS, CATEGORY_ICONS } from "@/types/complaint";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: ComplaintCategory;
  showIcon?: boolean;
  className?: string;
}

export function CategoryBadge({ category, showIcon = true, className }: CategoryBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border-2",
        category === "roads" && "border-category-roads text-category-roads",
        category === "waste" && "border-category-waste text-category-waste",
        category === "electricity" && "border-category-electricity text-category-electricity",
        className
      )}
    >
      {showIcon && <span className="mr-1">{CATEGORY_ICONS[category]}</span>}
      {CATEGORY_LABELS[category]}
    </Badge>
  );
}
