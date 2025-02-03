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
      name: translation.sidebar.dashboard.sections.inventory,
      icon: <Package className="w-5 h-5" />,
      items: [
        {
          name: translation.sidebar.dashboard.items.products,
          href: "/products",
          icon: <Box className="w-4 h-4" />,
        },
        {
          name: translation.sidebar.dashboard.items.bundles,
          href: "/bundles",
          icon: <Package className="w-4 h-4" />,
        },
        {
          name: translation.sidebar.dashboard.items.pricing,
          href: "/pricing",
          icon: <List className="w-4 h-4" />,
        },
      ],
    },
    {
      name: translation.sidebar.dashboard.sections.administration,
      icon: <Settings className="w-5 h-5" />,
      items: [
        {
          name: translation.sidebar.dashboard.items.members,
          href: "/members",
          icon: <Users className="w-4 h-4" />,
        },
        {
          name: translation.sidebar.dashboard.items.settings,
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

      <div className={`${isOpen ? "p-4" : "p-0"}`}>
        <motion.div
          layout
          className={`flex mb-6 ${isOpen ? "flex-row justify-between" : "flex-col items-center"
            }`}
          transition={{ duration: 0.2 }}
        >
          <Link href={`/${lang}/`} className={`${!isOpen && "mt-2"}`}>
            <motion.div
              className="flex items-center gap-2"
              animate={{
                flexDirection: isOpen ? "row" : "column",
              }}
            >
              <motion.div
                animate={{ scale: isOpen ? 1 : 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Image src={Logo} alt="" width={30} />
              </motion.div>
              <motion.div
                className="overflow-hidden"
                animate={{
                  maxWidth: isOpen ? 200 : 0,
                  opacity: isOpen ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                <p className="font-semibold text-2xl tracking-tight text-primary leading-none whitespace-nowrap">
                  {translation.nav.logo}
                </p>
              </motion.div>
            </motion.div>
          </Link>
          <motion.button
            onClick={toggleSidebar}
            className="p-2 hover:bg-accent rounded-full text-muted-foreground"
            layout
          >
            <motion.div
              animate={{ rotate: isOpen ? 0 : 180 }}
              transition={{ duration: 0.2 }}
            >
              <PanelLeftClose className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </motion.div>
        <nav className="space-y-1">
          <Link
            href={`/${lang}/dashboard`}
            className={cn(
              "group flex items-center px-4 py-3 text-sm font-medium rounded-full transition-all duration-200 mb-4",
              "hover:bg-accent",
              pathname === `/${lang}/dashboard`
                ? "bg-accent border shadow-sm"
                : "text-foreground hover:text-foreground/80"
            )}
          >
            <LayoutDashboard
              className={cn(
                "w-5 h-5",
                isOpen ? "mx-2" : "mx-auto"
              )}
            />
            {isOpen && translation.sidebar.dashboard.dashboard_link}
            {isOpen && (
              <Gem className="w-4 h-4 mx-4 text-primary/50" />
            )}
          </Link>

          {menuSections.map((section) => (
            <div key={section.name} className="space-y-1">
              <button
                onClick={() => toggleMenu(section.name)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent/50 rounded-lg transition-all duration-200 group"
              >
                <div className="flex items-center group relative">
                  <span className="mx-2 text-muted-foreground group-hover:text-foreground">
                    {section.icon}
                  </span>
                  {!isOpen && (
                    <div
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 bg-primary/95 text-gray-900  px-2 py-1  text-xs",
                        "opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none",
                        "whitespace-nowrap z-20",
                        isRTL ? "right-14" : "left-14"
                      )}
                    >
                      {section.name}
                    </div>
                  )}
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
                        "flex items-center px-3 py-2 text-sm font-medium rounded-lg group relative",
                        "transition-all duration-200 hover:pl-4 hover:bg-accent/30",
                        pathname === `/${lang}${item.href}`
                          ? "bg-accent shadow-sm border border-primary/10"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <span
                        className={`${pathname === `/${lang}${item.href}` && !isOpen
                          ? "text-primary"
                          : "mx-2 text-muted-foreground"
                          }`}
                      >
                        {item.icon}
                      </span>
                      {!isOpen && (
                        <div
                          className={cn(
                            "absolute top-1/2 -translate-y-1/2 bg-accent px-2 py-1 text-xs",
                            "opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none",
                            "whitespace-nowrap z-20",
                            isRTL ? "right-16" : "left-16"
                          )}
                        >
                          {item.name}
                        </div>
                      )}
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
