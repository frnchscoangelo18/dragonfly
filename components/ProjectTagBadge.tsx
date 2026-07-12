import { cn } from "@/lib/utils";
import { projectTagStyles } from "@/lib/apis/project/constants";
import { ProjectTagEnum } from "@/lib/apis/project/types";

interface ProjectTagBadgeProps {
  tag: ProjectTagEnum | string;
  className?: string;
}

export function ProjectTagBadge({ tag, className }: ProjectTagBadgeProps) {
  const style =
    projectTagStyles[tag as ProjectTagEnum] ??
    projectTagStyles[ProjectTagEnum.NA];

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
        style,
        className,
      )}
    >
      {tag}
    </span>
  );
}
