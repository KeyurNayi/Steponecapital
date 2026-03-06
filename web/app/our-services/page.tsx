import { getServicesPage, getServiceDetails } from "@/lib/strapi";
import ServicesClient from "./ServicesClient";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getServicesPage();
  if (!pageData) return { title: "Our Services | StepOne Capital" };
  
  return {
    title: pageData.seoTitle || `${pageData.pageTitle || "Our Services"} | StepOne Capital`,
    description: pageData.seoDescription || "Explore StepOne Capital's comprehensive range of banking and financial advisory services.",
  };
}

export default async function ServicesPage() {
  const pageData = await getServicesPage();
  const allServices = await getServiceDetails();

  if (!pageData) {
    return (
      <ServicesClient 
        pageTitle="Our Services" 
        allServices={allServices}
      />
    );
  }

  const { 
    pageTitle, 
    banner, 
    serviceOfferings,
    advisorySection
  } = pageData;

  return (
    <ServicesClient 
      pageTitle={pageTitle}
      banner={banner}
      serviceOfferings={serviceOfferings}
      advisorySection={advisorySection}
      allServices={allServices}
    />
  );
}
