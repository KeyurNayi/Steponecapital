import { getServiceDetail } from "@/lib/strapi";
// import ServiceDetailClient from "./ServiceDetailClient";
import { Metadata } from "next";
import ServiceDetailClient from "./ServiceDetailClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pageData = await getServiceDetail(slug);
  if (!pageData) return { title: "Service Details | StepOne Capital" };
  
  return {
    title: pageData.seoTitle || `${pageData.title} | StepOne Capital`,
    description: pageData.seoDescription || `Learn more about our ${pageData.title} services.`,
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pageData = await getServiceDetail(slug);

  if (!pageData) {
    return (
      <div className="pt-48 min-h-[60vh] flex items-center justify-center container">
        <h1 className="text-3xl font-bold font-outfit text-[#113264]">Service not found.</h1>
      </div>
    );
  }

  return <ServiceDetailClient service={pageData} />;
}
