"use client";

import { useEffect, useState } from "react";
import { getHomePage } from "@/lib/strapi";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import FeaturesSection from "@/components/FeaturesSection";
import ServicesSection from "@/components/ServicesSection";
import WhoWeAre from "@/components/WhoWeAre";
import MarqueeBand from "@/components/MarqueeBand";

export default function Home() {
  const [homeData, setHomeData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const data = await getHomePage();
      setHomeData(data);
    }
    fetchData();
  }, []);

  const data = homeData?.attributes || homeData;
  const heroData = data?.hero_section;
  const aboutData = data?.about_section || (data?.about_section?.data?.attributes);
  const strengthsData = data?.strengths_section || (data?.strengths_section?.data?.attributes);
  const whoWeAreData = data?.who_we_are_section;
  const servicesData = data?.services || [];

  return (
    <div className="flex flex-col w-full">
      <Hero heroData={heroData} tickers={data?.tickers || []} />
      
      <MarqueeBand />
      
      <AboutSection data={aboutData?.data?.attributes || aboutData} />
      
      <FeaturesSection data={strengthsData?.data?.attributes || strengthsData} />

      {/* <ServicesSection 
        services={servicesData} 
        title={data?.services_title} 
        subtitle={data?.services_subtitle} 
      /> */}

      <WhoWeAre title={whoWeAreData?.title} stats={whoWeAreData?.stats} />
    </div>
  );
}

