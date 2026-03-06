import axios from "axios";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export const strapi = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getFileUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${STRAPI_URL}${path}`;
};

export async function getHeader() {
  try {
    const res = await strapi.get(
      "/header?populate[menuItems][populate]=subItems&populate=logo"
    );
    return res.data?.data ?? null;
  } catch (error) {
    console.error("Error fetching header:", error);
    return null;
  }
}

export async function getFooter() {
  try {
    const res = await strapi.get("/footer", {
      params: {
        populate: ["socialLinks", "quickLinks", "serviceLinks", "logo", "addresses"]
      }
    });
    return res.data?.data ?? null;
  } catch (error) {
    console.error("Error fetching footer:", error);
    return null;
  }
}

export async function getGalleryPage() {
  try {
    // Standard Strapi v5 population for relations and their media
    const res = await strapi.get("/gallery-page?populate[banner][populate]=image");
    return res.data?.data ?? null;
  } catch (error) {
    console.error("Error fetching gallery page metadata:", error);
    return null;
  }
}

export async function getClientsPage() {
  try {
    const res = await strapi.get("/clients-page?populate[banner][populate]=image&populate[industries][populate]=icon&populate[testimonials][populate]=image");
    return res.data?.data ?? null;
  } catch (error) {
    console.error("Error fetching clients page metadata:", error);
    return null;
  }
}

export async function getAboutPage() {
  try {
    const res = await strapi.get("/about-page?populate[0]=banner.image&populate[1]=mainImage&populate[2]=secondaryImage&populate[3]=missionVisionValues.icon&populate[4]=ourStrengthsSection.strengths&populate[5]=keyFeatures.icon");
    return res.data?.data ?? null;
  } catch (error) {
    console.error("Error fetching about page metadata:", error);
    return null;
  }
}

export async function getContactPage() {
  try {
    const res = await strapi.get("/contact-page?populate[banner][populate]=image&populate[offices]=*");
    return res.data?.data ?? null;
  } catch (error) {
    console.error("Error fetching contact page metadata:", error);
    return null;
  }
}

export async function getInvestorsPage() {
  try {
    const res = await strapi.get("/investors-page?populate[banner][populate]=image");
    return res.data?.data ?? null;
  } catch (error) {
    console.error("Error fetching investors page metadata:", error);
    return null;
  }
}

export async function getIpoOfferPage() {
  try {
    const res = await strapi.get("/ipo-offer-page?populate[banner][populate]=image");
    return res.data?.data ?? null;
  } catch (error) {
    console.error("Error fetching IPO/Offer page metadata:", error);
    return null;
  }
}

export async function getServicesPage() {
  try {
    const res = await strapi.get("/services-page", {
      params: {
        populate: [
          "banner.image",
          "serviceOfferings",
          "serviceOfferings.cards",
          "serviceOfferings.cards.image",
          "advisorySection.image"
        ]
      }
    });
    return res.data?.data ?? null;
  } catch (error) {
    console.error("Error fetching services page metadata:", error);
    return null;
  }
}

export async function getServices() {
  try {
    const res = await strapi.get("/services?populate=image");
    return res.data?.data ?? [];
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
}

export async function getServiceDetails() {
  try {
    const res = await strapi.get("/service-details", {
      params: {
        populate: ["banner.image", "listImage"]
      }
    });
    return res.data?.data ?? [];
  } catch (error) {
    console.error("Error fetching all service details:", error);
    return [];
  }
}

export async function getServiceDetail(slug: string) {
  try {
    const res = await strapi.get(`/service-details`, {
      params: {
        filters: {
          slug: {
            $eq: slug
          }
        },
        populate: {
          banner: {
            populate: ["image"]
          },
          segments: {
            populate: ["image"]
          }
        }
      }
    });

    if (!res.data?.data || res.data.data.length === 0) {
      return null;
    }
    
    // Detailed service fetching normally returns an array from filtering
    return res.data.data[0];
  } catch (error) {
    console.error(`Error fetching service detail for slug ${slug}:`, error);
    return null;
  }
}

export async function getGalleryItems() {
  try {
    const res = await strapi.get("/gallery-items?populate=*");
    return res.data?.data ?? [];
  } catch (error) {
    console.error("Error fetching gallery items:", error);
    return [];
  }
}

export async function submitInquiry(data: any) {
  try {
    const res = await strapi.post("/inquiries", { data });
    return res.data?.data ?? null;
  } catch (error) {
    console.error("Error submitting inquiry:", error);
    throw error;
  }
}

// ── HOME PAGE DATA ──
export async function getHomePage() {
  try {
    const response = await strapi.get("/home-page", {
      params: {
        populate: {
          who_we_are_section: {
            populate: {
              stats: {
                populate: ["icon"]
              }
            }
          },
          hero_section: {
            populate: ["backgroundImage"]
          },
          about_section: {
            populate: {
              media: true,
              cards: {
                populate: ["icon"]
              }
            }
          },
          strengths_section: {
            populate: {
              strengths: {
                populate: ["icon"]
              }
            }
          },
          services: {
            populate: ["image"]
          },
          tickers: true
        }
      }
    });
    return response.data?.data;
  } catch (error) {
    console.error("Error fetching home-page data:", error);
    return null;
  }
}



