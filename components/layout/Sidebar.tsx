"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import {
  ChevronDown,
  LayoutDashboard,
  Package,
  Settings,
  Users,
  Box,
  List,
  Gem,
  PanelLeftClose,
} from "lucide-react";
import { motion } from "framer-motion";
import { Locale } from "@/i18n-config";
import Logo from "@/public/le_menu_svg_logo.svg";
import Image from "next/image";
import { DictionaryType } from "@/lib/i18n";
interface SidebarProps {
  translation: DictionaryType;
  lang: Locale;
}
const Sidebar = ({ lang, translation }: SidebarProps) => {
  const isRTL = lang === "ar";
  const pathname = usePathname();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  const menuSections = [
    {
      name: "Inventaire",
      icon: <Package className="w-5 h-5" />,
      items: [
        {
          name: "Produits simples",
          href: "/products",
          icon: <Box className="w-4 h-4" />,
        },
        {
          name: "Les pactes",
          href: "/bundles",
          icon: <Package className="w-4 h-4" />,
        },
        {
          name: "Liste de prix",
          href: "/pricing",
          icon: <List className="w-4 h-4" />,
        },
      ],
    },
    {
      name: "Administration",
      icon: <Settings className="w-5 h-5" />,
      items: [
        {
          name: "Membres",
          href: "/members",
          icon: <Users className="w-4 h-4" />,
        },
        {
          name: "Paramètres",
          href: "/settings",
          icon: <Settings className="w-4 h-4" />,
        },
      ],
    },
  ];

  useEffect(() => {
    const currentSection = menuSections.find((section) =>
      section.items.some((item) => pathname === `/${lang}${item.href}`)
    );
    setExpandedSection(currentSection?.name || null);
  }, [pathname, lang]);

  const toggleMenu = (menuName: string) => {
    setExpandedSection((prev) => (prev === menuName ? null : menuName));
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    const main = document.querySelector("main");
    if (main) {
      main.classList.toggle("ml-64");
    }
  };

  return (
    <motion.aside
      initial={{ width: 256 }}
      animate={{ width: isOpen ? 256 : 70 }}
      className={cn(
        "fixed top-0 h-[100vh] w-64 bg-background z-10 mt-2",
        isRTL ? "right-0  border-l " : "left-0 border-r "
      )}
    >
      <div className="p-4">
        <Link href={`/${lang}/`} className="flex items-end gap-2 mb-6">
          <Image src={Logo} alt="" width={30} />
          <p className="font-semibold text-2xl tracking-tight text-primary leading-none">
            {translation.nav.logo}
          </p>
        </Link>

        <button
          onClick={toggleSidebar}
          className="absolute top-2 right-2 p-1 hover:bg-accent rounded-full text-muted-foreground"
        >
          <PanelLeftClose className="w-5 h-5" />
        </button>
        <nav className="space-y-1">
          <Link
            href={`/${lang}/dashboard`}
            className={cn(
              "group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
              "hover:bg-accent",
              pathname === `/${lang}/dashboard`
                ? "bg-accent border shadow-sm"
                : "text-foreground hover:text-foreground/80"
            )}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            {isOpen && "Dashboard"}
            <Gem className="w-4 h-4 ml-auto text-primary/50" />
          </Link>

          {menuSections.map((section) => (
            <div key={section.name} className="space-y-1">
              <button
                onClick={() => toggleMenu(section.name)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent/50 rounded-lg transition-all duration-200 group"
              >
                <div className="flex items-center">
                  <span className="mr-3 text-muted-foreground group-hover:text-foreground">
                    {section.icon}
                  </span>
                  {isOpen && section.name}
                </div>
                <motion.div
                  animate={{
                    rotate: expandedSection === section.name ? 180 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  className="text-muted-foreground"
                >
                  {isOpen && <ChevronDown className="h-4 w-4" />}
                </motion.div>
              </button>
              {expandedSection === section.name && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`${isOpen ? "ml-8 space-y-1" : "ml-[5px]"}`}
                >
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={`/${lang}${item.href}`}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-lg",
                        "transition-all duration-200 hover:pl-4 hover:bg-accent/30",
                        pathname === `/${lang}${item.href}`
                          ? "bg-accent shadow-sm border border-primary/10"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <span
                        className={`${
                          pathname === `/${lang}${item.href}` && !isOpen
                            ? "text-primary"
                            : "mr-2 text-muted-foreground"
                        }`}
                      >
                        {item.icon}
                      </span>
                      {isOpen && item.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
