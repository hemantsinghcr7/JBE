"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Icon = "overview" | "stock" | "add" | "list" | "people";

const I = (props: { d: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={props.d} />
  </svg>
);

const ICONS: Record<Icon, React.ReactNode> = {
  overview: <I d="M3 3h7v8H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 15h7v6H3z" />,
  stock: <I d="M3 7l9-4 9 4-9 4-9-4zM3 12l9 4 9-4M3 17l9 4 9-4" />,
  add: <I d="M12 5v14M5 12h14" />,
  list: <I d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
  people: <I d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />,
};

interface NavItem {
  label: string;
  href: string;
  icon: Icon;
}

const TOP: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: "overview" },
  { label: "Stock", href: "/dashboard/stock", icon: "stock" },
];

const BUYING: NavItem[] = [
  { label: "New Purchase", href: "/dashboard/purchases/new", icon: "add" },
  { label: "Purchases", href: "/dashboard/purchases", icon: "list" },
  { label: "Customers", href: "/dashboard/customers", icon: "people" },
];

const ALL = [...TOP, ...BUYING];

// Longest matching href wins, so /dashboard/purchases/new highlights
// "New Purchase" rather than also lighting up "Purchases".
function activeHref(pathname: string): string | null {
  let best: string | null = null;
  for (const { href } of ALL) {
    const matches = pathname === href || pathname.startsWith(`${href}/`);
    if (matches && (best === null || href.length > best.length)) best = href;
  }
  return best;
}

export function DashboardNav() {
  const pathname = usePathname();
  const active = activeHref(pathname);

  const link = ({ label, href, icon }: NavItem) => (
    <Link
      key={href}
      href={href}
      className={`dash-nav-link${active === href ? " dash-nav-link--active" : ""}`}
      aria-current={active === href ? "page" : undefined}
    >
      {ICONS[icon]}
      <span>{label}</span>
    </Link>
  );

  return (
    <nav className="dash-nav">
      {TOP.map(link)}
      <span className="dash-nav-section">Buying</span>
      {BUYING.map(link)}
    </nav>
  );
}
