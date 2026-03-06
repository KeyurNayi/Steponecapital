import { getIpoOfferPage } from "@/lib/strapi";
import IpoOfferClient from "./IpoOfferClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "IPO / Offer Document | StepOne Capital",
  description: "View the official Initial Public Offering (IPO) and Offer Documents for StepOne Capital.",
};

export const revalidate = 60; // Revalidate every minute

export default async function IpoOfferPage() {
  const pageData = await getIpoOfferPage();
  
  return <IpoOfferClient banner={pageData?.banner} />;
}
