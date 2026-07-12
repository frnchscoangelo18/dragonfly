"use client";

import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { categoryIcons } from "@/lib/apis/project/constants";
import { ProjectModel } from "@/lib/apis/project/types";
import { VisibilityBadge } from "@/components/VisibilityBadge";
import { ProjectCost } from "@/components/ProjectCost";
import { ProjectTagBadge } from "@/components/ProjectTagBadge";

interface ProjectCardProps {
  project: ProjectModel;
  onSelect?: (name: string) => void;
  href?: string;
  className?: string;
}

function CardBody({ project }: { project: ProjectModel }) {
  const alias = project.authorAlias?.trim();

  return (
    <>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        {(() => {
          const Icon = categoryIcons[project.tag];
          return <Icon size={18} />;
        })()}
      </div>

      {/* Group 2: title + author + price (left-justified) */}
      <div className="min-w-0 flex-1 items-start justify-center text-left">
        <p className="truncate text-sm font-medium">{project.name}</p>
        <p>
          <span className="text-[10px] text-muted-foreground">by </span>
          {alias ? (
            <span className="text-[10px] text-foreground">
              {alias.toUpperCase() || "Unknown"}
            </span>
          ) : (
            <span className="text-[10px] text-muted-foreground">Unknown</span>
          )}
        </p>
        <p className="text-xs text-muted-foreground">
          <ProjectCost project={project} />
        </p>
      </div>

      {/* Group 1: visibility + type + elapsed time */}
      <div className="flex shrink-0 flex-col items-end gap-1">
        <VisibilityBadge isPublic={!!project.isPublic} />
        <ProjectTagBadge tag={project.tag} />
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock size={12} /> {formatRelativeTime(project.time)}
        </span>
      </div>

      <ArrowRight
        size={18}
        className="shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
      />
    </>
  );
}

export function ProjectCard({
  project,
  onSelect,
  href,
  className,
}: ProjectCardProps) {
  const base = cn(
    "group flex items-center gap-3 rounded-2xl bg-surface/60 p-4 ring-1 ring-white/5 transition-colors hover:bg-surface-elevated",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={base}>
        <CardBody project={project} />
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect?.(project.name)}
      className={base}
    >
      <CardBody project={project} />
    </button>
  );
}
