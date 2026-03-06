"use client";

import { motion } from "framer-motion";
import { FileText, Download, Search, Filter } from "lucide-react";
import { useState } from "react";
import Banner from "@/components/Banner";

const documentCategories = ["All", "IPO", "Rights Issue", "FPO", "Delisting", "Buy Back", "Takeover"];

const documents = [
  { id: 1, name: "Draft Red Herring Prospectus - XYZ Ltd", category: "IPO", date: "2024-02-15", size: "12.4 MB" },
  { id: 2, name: "Letter of Offer - ABC Industries", category: "Rights Issue", date: "2024-01-20", size: "8.1 MB" },
  { id: 3, name: "Public Announcement - Global Tech Delisting", category: "Delisting", date: "2023-12-05", size: "2.3 MB" },
  { id: 4, name: "Offer for Sale - Sunrise Energy", category: "FPO", date: "2023-11-12", size: "5.7 MB" },
  { id: 5, name: "Draft Letter of Offer - Tech Solutions", category: "Buy Back", date: "2023-10-28", size: "4.2 MB" },
  { id: 6, name: "Detailed Public Statement - Orion Takeover", category: "Takeover", date: "2023-09-15", size: "3.5 MB" },
];

export default function IpoOfferClient({ banner }: { banner?: any }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filteredDocs = documents.filter(doc => {
    const matchesFilter = filter === "All" || doc.category === filter;
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="pt-0 min-h-screen pb-24 relative">
      <Banner 
        title={banner?.title || "IPO & Offer Documents"} 
        description={banner?.description || null} 
        image={banner?.image} 
      />
    </div>
  );
}
