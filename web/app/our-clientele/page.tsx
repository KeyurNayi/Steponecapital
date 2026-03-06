import { getClientsPage } from "@/lib/strapi";
import ClienteleClient from "./ClienteleClient";

export const metadata = {
  title: "Our Clientele | StepOne Capital",
  description: "We have had the privilege of working with leading enterprises across diverse industries.",
};

export default async function Clientele() {
  const pageData = await getClientsPage();

  return (
    <ClienteleClient
      banner={pageData?.banner}
      pageTitle={pageData?.pageTitle}
      industries={pageData?.industries}
      industriesSectionTitle={pageData?.industriesSectionTitle}
      testimonials={pageData?.testimonials}
    />
  );
}
