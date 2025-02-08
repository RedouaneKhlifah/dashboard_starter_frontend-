"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useEffect, useMemo } from "react";
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
  Weight,
} from "lucide-react";
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

  const menuSections = useMemo(
    () => [
      {
        name: translation.sidebar.dashboard.sections.inventory,
        icon: <Package className="w-5 h-5" />,
        items: [
          {
            name: translation.sidebar.dashboard.items.products,
            href: "/product",
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
        name: translation.sidebar.dashboard.sections.sales,
        icon: <Weight className="w-5 h-5" />,
        items: [
          {
            name: translation.sidebar.dashboard.items.clients,
            href: "/clients",
            icon: <Users className="w-4 h-4" />,
          },
          {
            name: translation.sidebar.dashboard.items.partners,
            href: "/partenaire",
            icon: <Package className="w-4 h-4" />,
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
    ],
    [translation]
  );

  useEffect(() => {
    const currentSection = menuSections.find((section) =>
      section.items.some((item) => pathname === `/${lang}${item.href}`)
    );
    setExpandedSection(currentSection?.name || null);
  }, [pathname, lang, menuSections]);

  const toggleMenu = (menuName: string) => {
    setExpandedSection((prev) => (prev === menuName ? null : menuName));
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    const main = document.querySelector("main");
    if (main) {
      main.style.transition = "margin 0.2s ease-in-out";
      isRTL
        ? (main.style.marginRight = isOpen ? "70px" : "256px")
        : (main.style.marginLeft = isOpen ? "70px" : "256px");
    }
  };

  return (
    <aside
      className={cn(
        "fixed top-0 h-[100vh] bg-background z-10 mt-2 transition-all duration-200 ease-in-out",
        isRTL ? "right-0 border-l" : "left-0 border-r",
        isOpen ? "w-64" : "w-[70px]"
      )}
    >
      <div className={`${isOpen ? "px-2 py-3" : "p-0"}`}>
        <div
          className={`flex mb-6 ${
            isOpen ? "flex-row justify-between" : "flex-col items-center"
          }`}
        >
          <Link href={`/${lang}/`} className={`${!isOpen && "my-2"}`}>
            <div className="flex items-center gap-2">
              <div
                className={`transition-transform duration-200 ease-in-out ${
                  isOpen ? "scale-100" : "scale-90"
                }`}
              >
                <Image src={Logo} alt="" width={30} />
              </div>
              <div
                className={`overflow-hidden transition-all duration-200 ease-in-out ${
                  isOpen ? "max-w-[200px] opacity-100" : "max-w-0 opacity-0"
                }`}
              >
                <p className="font-semibold text-2xl tracking-tight text-primary leading-none whitespace-nowrap">
                  {translation.nav.logo}
                </p>
              </div>
            </div>
          </Link>
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-accent rounded-full text-muted-foreground"
          >
            <div
              className={`transition-transform duration-200 ease-in-out ${
                isOpen ? "" : "rotate-180"
              }`}
            >
              <PanelLeftClose className="w-5 h-5" />
            </div>
          </button>
        </div>
        <nav className="space-y-1">
          <Link
            href={`/${lang}/dashboard`}
            className={`
                      group flex items-center px-2 py-3 text-sm font-medium  transition-all duration-200 
                      ${isOpen ? "mb-4 rounded-full" : "mb-4 mx-1 rounded-lg"}
                      hover:bg-accent
                      ${
                        pathname === `/${lang}/dashboard`
                          ? "bg-accent border shadow-sm"
                          : "text-foreground hover:text-foreground/80"
                      }
                     `}
          >
            <LayoutDashboard
              className={cn("w-5 h-5", isOpen ? "mx-2" : "mx-auto")}
            />
            {isOpen && (
              <>
                {translation.sidebar.dashboard.dashboard_link}
                <Gem className="w-4 h-4 mx-4 text-primary/50" />
              </>
            )}
          </Link>

          {menuSections.map((section) => (
            <div key={section.name} className="space-y-1">
              <button
                onClick={() => toggleMenu(section.name)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent/50 rounded-lg transition-all ease-in-out duration-200 group"
              >
                <div className="flex items-center group relative">
                  <span className="mx-2 text-muted-foreground group-hover:text-foreground">
                    {section.icon}
                  </span>
                  {!isOpen && (
                    <div
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 bg-primary/95 text-gray-900 px-2 py-1 text-xs",
                        "opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-200 pointer-events-none",
                        "whitespace-nowrap z-20",
                        isRTL ? "right-14" : "left-14"
                      )}
                    >
                      {section.name}
                    </div>
                  )}
                  {isOpen && section.name}
                </div>
                <div
                  className={`text-muted-foreground transition-transform duration-200 ease-in-out ${
                    expandedSection === section.name ? "rotate-180" : ""
                  }`}
                >
                  {isOpen && <ChevronDown className="h-4 w-4" />}
                </div>
              </button>
              {expandedSection === section.name && (
                <div
                  className={`${
                    isOpen ? "ml-8 space-y-1" : "ml-[5px]"
                  } animate-in fade-in slide-in-from-top-2`}
                >
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={`/${lang}${item.href}`}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-lg group relative",
                        "transition-all ease-in-out duration-200 hover:pl-4 hover:bg-accent/30",
                        pathname === `/${lang}${item.href}`
                          ? "bg-accent shadow-sm border border-primary/10"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <span
                        className={`${
                          pathname === `/${lang}${item.href}` && !isOpen
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
                            "opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-200 pointer-events-none",
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
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
