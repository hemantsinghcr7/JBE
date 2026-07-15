import { cn } from "@/lib/utils";

interface KickerProps {
  children: React.ReactNode;
  white?: boolean;
  dark?: boolean;
  className?: string;
}

export function Kicker({ children, white, dark, className }: KickerProps) {
  return (
    <span className={cn("kicker", white && "kicker--w", dark && "kicker--dark", className)}>
      {children}
    </span>
  );
}
