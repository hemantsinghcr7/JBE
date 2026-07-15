interface LogoTileProps {
  className?: string;
}

export function LogoTile({ className = "" }: LogoTileProps) {
  return (
    <span className={`brand-mark ${className}`}>JBE</span>
  );
}
