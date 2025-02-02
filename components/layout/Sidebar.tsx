// sidebar.tsx
"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Logo from "@/public/le_menu_svg_logo.svg";
import Image from "next/image";

const Sidebar = ({ lang }: { lang: "fr" | "en" | "ar" }) => {
  const pathname = usePathname();
  const isRTL = lang === "ar";

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "🏠",
    },
    {
      name: "Orders",
      href: "/orders",
      icon: "📦",
    },
    {
      name: "Menu",
      href: "/menu",
      icon: "📋",
    },
    {
      name: "Settings",
      href: "/settings",
      icon: "⚙️",
    },
  ];

  return (
    <aside
      className={cn(
        "fixed top-0 h-[100vh] w-64 bg-background z-10 mt-2",
        isRTL ? "right-0  border-l " : "left-0 border-r "
      )}
    >
      <div className="p-4">
        <Link href={`/${lang}/dashboard`} className="flex items-center gap-2">
          <Image src={Logo} alt="Logo" width={40} height={40} />
          <span className="font-bold">Le Menu</span>
        </Link>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:bg-accent"
              )}
            >
              <span className={cn("text-lg", isRTL ? "ml-3" : "mr-3")}>
                {item.icon}
              </span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
