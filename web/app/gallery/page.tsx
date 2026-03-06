import { getGalleryItems, getGalleryPage } from "@/lib/strapi";
import GalleryClient from "./GalleryClient";

export const metadata = {
  title: "Media Gallery | StepOne Capital",
  description: "Glimpses into our corporate events, conferences, and significant milestones.",
};

export default async function Gallery() {
  const [items, pageData] = await Promise.all([
    getGalleryItems(),
    getGalleryPage(),
  ]);

  return (
    <GalleryClient 
      items={items} 
      banner={pageData?.banner} 
    />
  );
}

