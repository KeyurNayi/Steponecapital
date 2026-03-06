import { getInvestorsPage } from "@/lib/strapi";
import InvestorsClient from "./InvestorsClient";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getInvestorsPage();
  if (!pageData) return { title: "Investors | StepOne Capital" };
  
  return {
    title: pageData.seoTitle || `${pageData.pageTitle || "Investors"} | StepOne Capital`,
    description: pageData.seoDescription || "Investor relations and strategic information for StepOne Capital.",
  };
}

export default async function InvestorsPage() {
  const pageData = await getInvestorsPage();
  
  if (!pageData) {
    return <InvestorsClient pageTitle="Investors" />;
  }

  const { pageTitle, introText, banner } = pageData;

  return (
    <InvestorsClient 
      pageTitle={pageTitle}
      introText={introText}
      banner={banner}
    />
  );
}
