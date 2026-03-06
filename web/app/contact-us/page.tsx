import { getContactPage } from "@/lib/strapi";
import ContactClient from "./ContactClient";

export const metadata = {
  title: "Contact Us | StepOne Capital",
  description: "Get in touch with StepOne Capital for strategic financial advisory.",
};

export const dynamic = 'force-dynamic';

export default async function ContactUs() {
  const pageData = await getContactPage();

  return (
    <ContactClient 
      pageData={pageData}
    />
  );
}
