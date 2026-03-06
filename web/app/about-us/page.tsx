import { getAboutPage } from "@/lib/strapi";
import AboutClient from "./AboutClient";

export const metadata = {
  title: "About Us | StepOne Capital",
  description: "A premier SEBI Registered Category-I Merchant Banker dedicated to empowering enterprises through strategic financial advisory.",
};

export const dynamic = 'force-dynamic';

export default async function AboutUs() {
  const pageData = await getAboutPage();

  return (
    <AboutClient 
      aboutData={pageData}
    />
  );
}
