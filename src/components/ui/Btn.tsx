import { cn } from "@/lib/utils";

type BtnVariant = "default" | "amber" | "dark";
type BtnSize = "md" | "sm";

interface BtnProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: BtnVariant;
  size?: BtnSize;
  href: string;
  children: React.ReactNode;
}

const variantClass: Record<BtnVariant, string> = {
  default: "",
  amber:   "btn--amber",
  dark:    "btn--dark",
};

export function Btn({ variant = "default", size = "md", href, children, className, ...props }: BtnProps) {
  return (
    <a
      href={href}
      className={cn("btn", variantClass[variant], size === "sm" && "btn--sm", className)}
      {...props}
    >
      {children}
    </a>
  );
}
