import { cn } from "@/lib/utils";

interface KickerProps {
  children: React.ReactNode;
  white?: boolean;
  className?: string;
}

export function Kicker({ children, white, className }: KickerProps) {
  return (
    <span className={cn("kicker", white && "kicker--w", className)}>
      {children}
    </span>
  );
}
