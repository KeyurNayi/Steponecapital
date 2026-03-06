"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube, Globe } from "lucide-react";
import { getFileUrl } from "@/lib/strapi";

interface LinkItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

interface SocialLinkItem {
  platform: string;
  url: string;
}

interface AddressItem {
  title: string;
  description: any;
}

interface FooterData {
  companyDescription?: string;
  address?: string;
  phone?: string;
  email?: string;
  socialLinks?: SocialLinkItem[];
  quickLinks?: LinkItem[];
  serviceLinks?: LinkItem[];
  logo?: any;
  addresses?: AddressItem[];
}

interface FooterProps {
  data: FooterData | null;
}

const getSocialIcon = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes("facebook")) return <Facebook className="w-5 h-5" />;
  if (p.includes("twitter") || p.includes("x")) return <Twitter className="w-5 h-5" />;
  if (p.includes("linkedin")) return <Linkedin className="w-5 h-5" />;
  if (p.includes("instagram")) return <Instagram className="w-5 h-5" />;
  if (p.includes("youtube")) return <Youtube className="w-5 h-5" />;
  return <Globe className="w-5 h-5" />;
};

export default function Footer({ data }: FooterProps) {
  const year = new Date().getFullYear();

  // Handle Strapi v5 logo structure
  const logoData = data?.logo;
  const logoUrl = logoData?.url || logoData?.formats?.small?.url;
  const finalLogoUrl = logoUrl ? getFileUrl(logoUrl) : null;

  // If no CMS data at all, render a minimal footer
  if (!data) {
    return (
      <footer className="bg-gray-950 text-gray-500 py-8 text-center text-sm border-t border-gray-900">
        <p>© {year} StepOne Capital (P) Ltd. All Rights Reserved.</p>
      </footer>
    );
  }

    const strapiLoader = ({ src }: { src: string }) => src;

    return (
    <footer className="bg-gray-950 text-gray-400 pt-20 pb-10 border-t border-gray-900">
      <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 border-b border-gray-900 pb-16 mb-10">

        {/* Company Info */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            {finalLogoUrl ? (
              <div className="relative h-16 w-auto min-w-[160px]">
                <Image
                  loader={strapiLoader}
                  src={finalLogoUrl}
                  alt="StepOne Capital"
                  fill
                  className="object-contain object-left"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-lg shadow-primary/20">
                  <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-primary" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-black text-base tracking-tighter">S1</span>
                  </div>
                </div>
                <span className="text-white font-bold text-2xl tracking-tight font-outfit leading-none">
                  StepOne<span className="text-primary">Capital</span>
                </span>
              </div>
            )}
          </div>

          {data.companyDescription && (
            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">{data.companyDescription}</p>
          )}

          {data.socialLinks && data.socialLinks.length > 0 && (
            <div className="flex gap-4 flex-wrap">
              {data.socialLinks.map((social, idx) => (
                <SocialLinkNavItem key={idx} href={social.url} icon={getSocialIcon(social.platform)} />
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        {data.quickLinks && data.quickLinks.length > 0 && (
          <div>
            <h4 className="text-white font-bold mb-8 font-outfit uppercase tracking-wider text-sm opacity-80">Quick Links</h4>
            <ul className="space-y-4 text-sm font-medium">
              {data.quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Service Links */}
        {data.serviceLinks && data.serviceLinks.length > 0 && (
          <div>
            <h4 className="text-white font-bold mb-8 font-outfit uppercase tracking-wider text-sm opacity-80">Services</h4>
            <ul className="space-y-4 text-sm font-medium">
              {data.serviceLinks.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-10">
          <h4 className="text-white font-bold mb-8 font-outfit uppercase tracking-wider text-sm opacity-80">Get in Touch</h4>
          
          <ul className="space-y-8 text-sm font-medium">
            {data.addresses && data.addresses.length > 0 && 
              data.addresses.map((addr, idx) => (
                <li key={idx} className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div 
                      className="text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed whitespace-pre-line"
                      dangerouslySetInnerHTML={{ 
                        __html: typeof addr.description === 'string' 
                          ? addr.description 
                          : addr.description?.map((p: any) => p.children?.[0]?.text).join('<br/>') || ''
                      }}
                    />
                  </div>
                </li>
              ))
            }

            {data.phone && (
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <a href={`tel:${data.phone.replace(/\s+/g, '')}`} className="text-gray-400 group-hover:text-white transition-all">
                  {data.phone}
                </a>
              </li>
            )}
            
            {data.email && (
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <a href={`mailto:${data.email}`} className="text-gray-400 group-hover:text-white transition-all break-all">
                  {data.email}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="container flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-500 font-medium">
        <p>© {year} StepOne Capital (P) Ltd. All Rights Reserved.</p>
        {/* <div className="flex gap-8">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
        </div> */}
      </div>
    </footer>
  );
}

function SocialLinkNavItem({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-11 h-11 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center hover:bg-primary group transition-all duration-300 shadow-lg"
    >
      <div className="text-gray-400 group-hover:text-white group-hover:scale-110 transition-all duration-300">
        {icon}
      </div>
    </a>
  );
}
