import { company } from "@/data/content";

interface LogoTileProps {
  className?: string;
}

export function LogoTile({ className = "" }: LogoTileProps) {
  return (
    <span
      className={`logo-tile ${className}`}
      aria-label={`${company.shortName} logo`}
    >
      <span>{company.shortName}</span>
    </span>
  );
}
