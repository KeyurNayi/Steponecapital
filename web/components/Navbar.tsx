"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getFileUrl } from "@/lib/strapi";
import Image from "next/image";


interface SubItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

interface MenuItem {
  label: string;
  href?: string;
  subItems?: SubItem[];
}

interface NavbarProps {
  data: {
    logo?: { url?: string };
    menuItems?: MenuItem[];
    ctaLabel?: string;
    ctaLink?: string;
  } | null;
}

export default function Navbar({ data }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems: MenuItem[] = data?.menuItems || [];
  const rawLogoUrl = data?.logo?.url;
  const logoUrl = rawLogoUrl ? getFileUrl(rawLogoUrl) : null;

  // Custom loader: returns URL directly so Next.js skips its proxy (which blocks private IPs)
  const strapiLoader = ({ src }: { src: string }) => src;

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-3" : "bg-linear-to-b from-black/40 to-transparent py-5"
      )}
    >
      <div className="container flex items-center justify-between">

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3">
          {logoUrl && !logoError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <Image
              loader={strapiLoader}
              src={logoUrl}
              height={150}
              width={250}
              alt="StepOne Capital Logo"
              className="h-16 lg:h-20 xl:h-24 w-auto object-contain"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-primary" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-black text-lg tracking-tighter">S1</span>
              </div>
            </div>
          )}
        </Link>

        {/* Desktop Navigation — only renders if Strapi has menu items */}
        {menuItems.length > 0 && (
          <div className="hidden lg:flex items-center gap-4 xl:gap-8">
            {menuItems.map((item) => (
              item.subItems && item.subItems.length > 0 ? (
                <Dropdown
                  key={item.label}
                  label={item.label}
                  href={item.href}
                  items={item.subItems}
                  scrolled={scrolled}
                />
              ) : (
                <NavLink
                  key={item.label}
                  href={item.href || "#"}
                  active={pathname === item.href}
                  className={scrolled ? "" : "text-white/90 hover:text-white"}
                >
                  {item.label}
                </NavLink>
              )
            ))}

            {data?.ctaLink && (
              <Link
                href={data.ctaLink}
                className={cn(
                  "px-6 py-2.5 rounded-full text-sm font-bold transition-all",
                  scrolled
                    ? "bg-primary text-white hover:bg-blue-700 shadow-md shadow-primary/20"
                    : "bg-white/10 text-white border border-white/30 hover:bg-white/20 backdrop-blur-sm"
                )}
              >
                {data.ctaLabel || "Contact Us"}
              </Link>
            )}
          </div>
        )}

        {/* Mobile Toggle — only show if there are menu items */}
        {menuItems.length > 0 && (
          <button
            className={cn("lg:hidden p-2 rounded-lg", scrolled ? "text-gray-700" : "text-white")}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && menuItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 w-full bg-white shadow-2xl lg:hidden border-t border-gray-100 overflow-y-auto max-h-[80vh]"
          >
            <div className="container py-6 flex flex-col gap-2">
              {menuItems.map((item) => (
                <div key={item.label} className="flex flex-col">
                  {item.href ? (
                    <MobileNavLink href={item.href} onClick={() => setIsOpen(false)}>
                      {item.label}
                    </MobileNavLink>
                  ) : (
                    <div className="text-xs font-bold text-primary uppercase tracking-widest px-4 pt-4 pb-1 opacity-70">
                      {item.label}
                    </div>
                  )}
                  {item.subItems?.map(sub => (
                    <MobileNavLink
                      key={sub.label}
                      href={sub.href}
                      className="pl-6 text-sm opacity-70"
                      onClick={() => setIsOpen(false)}
                    >
                      {sub.label}
                    </MobileNavLink>
                  ))}
                </div>
              ))}
              {data?.ctaLink && (
                <div className="pt-4 border-t border-gray-100 mt-2">
                  <Link
                    href={data.ctaLink}
                    onClick={() => setIsOpen(false)}
                    className="block bg-primary text-white py-3 px-4 rounded-xl text-center font-bold hover:bg-blue-700 transition-all"
                  >
                    {data.ctaLabel || "Contact Us"}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavLink({ href, children, active, className }: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        active ? "text-primary" : "text-gray-600",
        className
      )}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, onClick, className }: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn("py-2.5 px-4 text-base font-medium text-gray-800 rounded-lg hover:bg-gray-50 transition-colors", className)}
    >
      {children}
    </Link>
  );
}

function Dropdown({ label, href, items, scrolled }: {
  label: string;
  href?: string;
  items: SubItem[];
  scrolled: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link 
        href={href || "#"}
        className={cn(
          "flex items-center gap-1 text-sm font-medium transition-colors group-hover:text-primary",
          scrolled ? "text-gray-600" : "text-white/90 hover:text-white"
        )}
      >
        {label} <ChevronDown className="w-4 h-4" />
      </Link>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute top-full left-0 w-64 bg-white shadow-2xl rounded-2xl py-3 mt-2 border border-gray-100"
          >
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                target={item.isExternal ? "_blank" : undefined}
                rel={item.isExternal ? "noopener noreferrer" : undefined}
                className={cn(
                  "block px-5 py-2.5 text-sm transition-colors hover:bg-blue-50 hover:text-primary",
                  pathname === item.href ? "text-primary bg-blue-50/50" : "text-gray-600"
                )}
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
