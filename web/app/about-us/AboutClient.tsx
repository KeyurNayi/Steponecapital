"use client";

import { motion } from "framer-motion";
import { Users, Target, Shield, Award, Rocket, CheckCircle2, Building2, Eye, Gem } from "lucide-react";
import Banner from "@/components/Banner";
import Image from "next/image";
import { getFileUrl } from "@/lib/strapi";
import AnimatedHeading from "@/components/AnimatedHeading";

const values = [
  {
    title: "Client-Centric",
    desc: "We put our clients' interests at the heart of everything we do.",
    icon: <Users className="w-6 h-6" />,
  },
  {
    title: "Integrity",
    desc: "Upholding the highest standards of professional and ethical integrity.",
    icon: <Shield className="w-6 h-6" />,
  },
  {
    title: "Expertise",
    desc: "Driven by deep research and years of capital market experience.",
    icon: <Award className="w-6 h-6" />,
  },
  {
    title: "Solutions Driven",
    desc: "Providing tailored solutions for complex financial challenges.",
    icon: <Target className="w-6 h-6" />,
  },
];

interface AboutClientProps {
  aboutData?: any;
}

export default function AboutClient({ aboutData }: AboutClientProps) {
  const strapiLoader = ({ src }: { src: string }) => src;

  const getMediaUrl = (media: any) => {
    if (!media) return null;
    const data = media.data ? (media.data.attributes || media.data) : media;
    return data?.url || data?.formats?.large?.url || data?.formats?.medium?.url;
  };

  const mainImageUrl = getMediaUrl(aboutData?.mainImage);
  const secondaryImageUrl = getMediaUrl(aboutData?.secondaryImage);

  const mainImage = mainImageUrl ? getFileUrl(mainImageUrl) : null;
  const secondaryImage = secondaryImageUrl ? getFileUrl(secondaryImageUrl) : null;
  
  const banner = aboutData?.banner;

  const subtitle = aboutData?.pageSubtitle || "About";
  const title = aboutData?.mainHeading || "Step One Capital Advisors";
  // Convert markdown-like newlines or just display as paragraph
  const description = aboutData?.description || "We, at Stepone Capital Advisors Pvt. Ltd., are providing services in various areas of capital markets which include Investment Banking Services, Corporate Advisory Services, and Asset Management Services. We are actively involving in SME Listing, valuation of companies for various transactions, fund raising, migration to main board, mergers and acquisition, takeovers.\n\nCurrently, we are advising to more than 10 companies for their capital market needs. We also have NBFC for catering various financial needs of our clients.";

  const paragraphs = description.split('\n').filter((p: string) => p.trim() !== "");
  return (
    <div className="pt-0 min-h-screen relative">
      {/* Dynamic Banner */}
      <Banner 
        title={banner?.title || "About StepOne Capital"} 
        description={banner?.description}
        image={banner?.image}
      />

      {/* Hero / About Company Section */}
      <section className="py-24 bg-white overflow-hidden px-4 md:px-8">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center max-w-7xl mx-auto">
            
            {/* Left: Overlapping Circular Images */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative aspect-square max-w-[400px] mx-auto lg:mx-0"
            >
              {/* Main large circle */}
              <motion.div 
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 left-0 w-[80%] h-[80%] rounded-full overflow-hidden border-4 border-[#113264]/10 shadow-[0_20px_50px_rgba(17,50,100,0.15)] z-10 hover:scale-[1.02] bg-gray-100 flex items-center justify-center transition-transform duration-700"
              >
                {mainImage ? (
                  <Image 
                    loader={strapiLoader}
                    src={mainImage}
                    alt="StepOne Capital Main HQ"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Building2 className="w-16 h-16 text-gray-300" />
                )}
              </motion.div>

              {/* Secondary overlapping circle */}
              <motion.div 
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-0 right-0 w-[60%] h-[60%] rounded-full overflow-hidden border-[6px] border-white shadow-[0_30px_60px_rgba(17,50,100,0.2)] z-20 hover:scale-[1.05] transition-transform duration-700"
              >
                <div className="w-full h-full rounded-full border-4 border-[#113264] overflow-hidden bg-gray-50 flex items-center justify-center">
                  {secondaryImage ? (
                    <Image 
                      loader={strapiLoader}
                      src={secondaryImage}
                      alt="StepOne Capital Operations"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Target className="w-10 h-10 text-gray-300" />
                  )}
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Text Content */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.15
                  }
                }
              }}
              className="max-w-xl"
            >
              <AnimatedHeading
                text={subtitle}
                className="text-primary font-bold text-lg mb-4 tracking-wider uppercase"
              />
              <motion.h2 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                }}
                className="text-3xl md:text-4xl font-bold text-primary font-outfit mb-6 leading-tight whitespace-nowrap"
              >
                {title}
              </motion.h2>
              
              <div className="space-y-6">
                {paragraphs.map((para: string, idx: number) => (
                  <motion.p 
                    key={idx} 
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                    }}
                    className="text-gray-600 leading-relaxed text-lg"
                  >
                    {para}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      
      {/* Bento Grid Mission, Vision, Values Sections */}
      {aboutData?.missionVisionValues && aboutData.missionVisionValues.length > 0 && (
        <section className="py-24 bg-slate-50/50 relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-100 rounded-full blur-[100px]" />
          </div>

          <div className="container max-w-7xl mx-auto relative z-10 px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
              {/* Mission & Vision Row */}
              {aboutData.missionVisionValues.slice(0, 2).map((item: any, idx: number) => {
                const iconUrl = getMediaUrl(item.icon);
                const finalIconUrl = iconUrl ? getFileUrl(iconUrl) : null;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: idx * 0.15, ease: "easeOut" }}
                    className="group relative bg-white/70 backdrop-blur-md rounded-[3rem] p-8 md:p-12 border border-white/50 shadow-[0_8px_32px_rgba(17,50,100,0.05)] hover:shadow-2xl hover:-translate-y-2 transition-all duration-700 overflow-hidden flex flex-col h-full"
                  >
                    {/* Corner Accent */}
                    <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                    
                    <div className="mb-10 w-24 h-24 rounded-3xl bg-white border border-slate-100 flex items-center justify-center relative shadow-sm group-hover:shadow-[0_20px_40px_rgba(17,50,100,0.1)] group-hover:scale-105 group-hover:rotate-3 transition-all duration-700 z-10">
                      <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity" />
                      {finalIconUrl ? (
                        <div className="relative w-12 h-12">
                          <Image 
                            src={finalIconUrl} 
                            alt={item.title || "Icon"} 
                            fill 
                            className="object-contain transition-transform duration-700 group-hover:scale-110"
                            loader={strapiLoader}
                          />
                        </div>
                      ) : (
                        <Target className="w-10 h-10 text-primary transition-transform duration-700 group-hover:scale-110" strokeWidth={1} />
                      )}
                    </div>
                    
                    <div className="relative z-10 space-y-5">
                      <h3 className="text-2xl md:text-3xl font-bold text-[#113264] font-outfit tracking-tight group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <div className="w-16 h-1.5 bg-primary/20 rounded-full group-hover:w-24 group-hover:bg-primary transition-all duration-500" />
                      <p className="text-gray-500 text-lg leading-relaxed font-outfit font-light">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}

              {/* Core Values Row (Full Width) */}
              {aboutData.missionVisionValues.slice(2, 3).map((item: any, idx: number) => {
                const iconUrl = getMediaUrl(item.icon);
                const finalIconUrl = iconUrl ? getFileUrl(iconUrl) : null;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                    className="lg:col-span-2 group relative bg-[#113264] rounded-[3rem] p-8 md:p-12 border border-white/10 shadow-3xl hover:shadow-[0_40px_80px_rgba(17,50,100,0.3)] hover:-translate-y-2 transition-all duration-700 overflow-hidden"
                  >
                    {/* Decorative Elements */}
                    <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-80 h-80 bg-white/5 rounded-full blur-[100px] group-hover:bg-white/10 transition-colors" />
                    <div className="absolute top-0 left-0 -ml-20 -mt-20 w-80 h-80 bg-white/5 rounded-full blur-[100px] group-hover:bg-white/10 transition-colors" />

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-12 md:gap-20 h-full">
                      {/* Left: Icon */}
                      <div className="shrink-0 pt-2">
                        <div className="w-28 h-28 md:w-36 md:h-36 rounded-4xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center relative shadow-2xl group-hover:scale-105 group-hover:-rotate-3 transition-all duration-700">
                          {finalIconUrl ? (
                            <div className="relative w-14 h-14 md:w-20 md:h-20">
                              <Image 
                                src={finalIconUrl} 
                                alt={item.title || "Icon"} 
                                fill 
                                className="object-contain invert brightness-0 transition-transform duration-700 group-hover:scale-110"
                                loader={strapiLoader}
                              />
                            </div>
                          ) : (
                            <Gem className="w-14 h-14 md:w-20 md:h-20 text-white/40 group-hover:text-white transition-colors duration-500" strokeWidth={1} />
                          )}
                        </div>
                      </div>

                      {/* Right: Content */}
                      <div className="flex-1 text-center md:text-left space-y-6 md:space-y-8">
                        <div className="space-y-4">
                          <h3 className="text-3xl md:text-5xl font-bold text-white font-outfit leading-tight">
                            {item.title}
                          </h3>
                        </div>
                        
                        <div className="w-20 h-2 bg-white/20 rounded-full mx-auto md:mx-0 group-hover:w-40 group-hover:bg-white transition-all duration-700" />
                        
                        <p className="text-white/70 text-lg md:text-2xl leading-relaxed md:leading-[1.4] font-outfit font-light max-w-4xl mx-auto md:mx-0">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}
      {/* Dynamic Our Strengths from CMS */}
      {aboutData?.ourStrengthsSection?.strengths && aboutData.ourStrengthsSection.strengths.length > 0 && (
        <section className="py-24 bg-white relative">
          <div className="container max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
               <h2 className="text-3xl md:text-5xl font-bold text-[#113264] font-outfit mb-4">
                 {aboutData.ourStrengthsSection.title || "Our Strengths"}
               </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {aboutData.ourStrengthsSection.strengths.map((strength: any, idx: number) => {
                const titleParts = strength.title ? strength.title.split(/(and|&)/i) : [];
                
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: idx * 0.15, ease: "easeOut" }}
                    className="group bg-white p-8 md:p-10 rounded-2xl shadow-[0_4px_20px_rgb(17,50,100,0.08)] border border-gray-100 hover:shadow-[0_10px_40px_rgb(17,50,100,0.15)] transition-all duration-300 text-center flex flex-col items-center justify-center min-h-[200px]"
                  >
                    <h3 className="text-2xl md:text-3xl font-bold text-[#113264] mb-4 font-outfit leading-tight group-hover:text-blue-700 transition-colors">
                      {strength.title}
                    </h3>
                    
                    {/* Render rich text descriptions seamlessly */}
                    <div 
                      className="text-gray-600 leading-relaxed text-[15px] prose prose-sm prose-p:my-1 max-w-none text-center"
                      dangerouslySetInnerHTML={{ 
                        __html: typeof strength.description === 'string' 
                          ? strength.description 
                          : strength.description?.map((p: any) => p.children?.[0]?.text).join('<br/>') || ''
                      }}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Key Features Solutions from CMS */}
      {aboutData?.keyFeatures && aboutData.keyFeatures.length > 0 && (
        <section className="py-24 bg-white">
          <div className="container max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
              {aboutData.keyFeatures.map((item: any, idx: number) => {
                const iconUrl = getMediaUrl(item.icon);
                const finalIconUrl = iconUrl ? getFileUrl(iconUrl) : null;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: idx * 0.15, ease: "easeOut" }}
                    className="flex flex-col items-center text-center group"
                  >
                    <div className="mb-6 relative w-16 h-16 flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-2">
                      {finalIconUrl ? (
                        <Image 
                          src={finalIconUrl} 
                          alt={item.title || "Icon"} 
                          fill 
                          className="object-contain"
                          loader={strapiLoader}
                        />
                      ) : (
                        <Target className="w-12 h-12 text-[#113264]" strokeWidth={2} />
                      )}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-[#113264] mb-4 font-outfit px-4 leading-snug">
                      {item.title}
                    </h3>
                    
                    <div className="text-gray-600 leading-relaxed text-[15px] max-w-sm">
                      {item.description}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
