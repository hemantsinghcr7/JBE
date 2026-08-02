"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const BUYING = [
  { label: "New Purchase", href: "/dashboard/purchases/new" },
  { label: "Purchases", href: "/dashboard/purchases" },
  { label: "Customers", href: "/dashboard/customers" },
];

const SELLING = [
  { label: "New Sale", href: "/dashboard/sales/new" },
  { label: "Sales", href: "/dashboard/sales" },
  { label: "Buyers", href: "/dashboard/buyers" },
];

const OVERVIEW = { label: "Overview", href: "/dashboard" };
const ALL = [OVERVIEW, ...BUYING, ...SELLING];

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

  const link = ({ label, href }: { label: string; href: string }) => (
    <Link
      key={href}
      href={href}
      className={`dash-nav-link${active === href ? " dash-nav-link--active" : ""}`}
      aria-current={active === href ? "page" : undefined}
    >
      {label}
    </Link>
  );

  return (
    <nav className="dash-nav">
      {link(OVERVIEW)}
      <span className="dash-nav-section">Buying</span>
      {BUYING.map(link)}
      <span className="dash-nav-section">Selling</span>
      {SELLING.map(link)}
    </nav>
  );
}
