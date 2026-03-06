"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Banner from "@/components/Banner";
import { submitInquiry } from "@/lib/strapi";

interface ContactClientProps {
  pageData?: any;
}

export default function ContactClient({ pageData }: ContactClientProps) {
  const banner = pageData?.banner;
  const offices = pageData?.offices || [];
  const phone = pageData?.phone || "+91 89491 81856";
  const email = pageData?.email || "rohitlabana@steponecapital.in";
  
  const contactHeading = pageData?.contactInfoHeading || "Contact Information";
  const phoneLabel = pageData?.phoneLabel || "Call Us";
  const emailLabel = pageData?.emailLabel || "Email Us";

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await submitInquiry(formState);
      setIsSuccess(true);
      setFormState({ name: "", email: "", subject: "", message: "" });
      // Auto close after 10s if user doesn't close
      setTimeout(() => setIsSuccess(false), 10000);
    } catch (error) {
      alert("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-0 min-h-screen relative">
      {/* Enhanced Header */}
      <Banner 
        title={banner?.title || "Get In Touch"} 
        description={banner?.description} 
        image={banner?.image} 
      />

      <section className="container pb-24">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 font-outfit">{contactHeading}</h2>
            
            {offices.map((office: any, idx: number) => (
              <div key={idx} className="flex gap-6 p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">{office.title}</h4>
                  <div 
                    className="text-gray-600 text-sm leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: typeof office.description === 'string' 
                        ? office.description 
                        : office.description?.map((p: any) => p.children?.[0]?.text).join('<br/>') || ''
                    }}
                  />
                </div>
              </div>
            ))}

            {!offices.length && (
              <>
                <div className="flex gap-6 p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Registered Office (Vadodara)</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      A1, 4th F, 16, Akshar Pavilion. Gotri Rd, Bhaily, Vadodara, Vadodara-391410, Gujarat.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Ahmedabad Office</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      503/B, WallStreet-1, Opp. Orient Club, Nr. Railway Crossing, Ellisbridge, Ahmadabad-380 006
                    </p>
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-6 p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">{phoneLabel}</h4>
                <a 
                  href={`tel:${phone.replace(/\s+/g, '')}`} 
                  className="text-gray-600 text-sm hover:text-primary transition-colors"
                >
                  {phone}
                </a>
              </div>
            </div>

            <div className="flex gap-6 p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">{emailLabel}</h4>
                <a 
                  href={`mailto:${email}`} 
                  className="text-gray-600 text-sm hover:text-primary transition-colors"
                >
                  {email}
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-10 md:p-14 rounded-[3rem] border border-gray-100 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-10">
                <MessageSquare className="text-primary w-6 h-6" />
                <h3 className="text-2xl font-bold font-outfit">Send us a message</h3>
              </div>

              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700 ml-1">Your Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="John Doe"
                    disabled={isSubmitting}
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:border-primary focus:bg-white focus:outline-none transition-all disabled:opacity-50"
                    value={formState.name}
                    onChange={(e) => setFormState({...formState, name: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="john@example.com"
                    disabled={isSubmitting}
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:border-primary focus:bg-white focus:outline-none transition-all disabled:opacity-50"
                    value={formState.email}
                    onChange={(e) => setFormState({...formState, email: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2 space-y-3">
                  <label className="text-sm font-bold text-gray-700 ml-1">Subject</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Service Inquiry"
                    disabled={isSubmitting}
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:border-primary focus:bg-white focus:outline-none transition-all disabled:opacity-50"
                    value={formState.subject}
                    onChange={(e) => setFormState({...formState, subject: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2 space-y-3">
                  <label className="text-sm font-bold text-gray-700 ml-1">How can we help?</label>
                  <textarea 
                    rows={6} 
                    required 
                    placeholder="Tell us about your requirements..."
                    disabled={isSubmitting}
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-3xl focus:border-primary focus:bg-white focus:outline-none transition-all resize-none disabled:opacity-50"
                    value={formState.message}
                    onChange={(e) => setFormState({...formState, message: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2 pt-4">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-primary text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 disabled:bg-gray-400 disabled:shadow-none"
                  >
                    {isSubmitting ? (
                      <>Processing... <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /></>
                    ) : (
                      <>Send Message <Send className="w-5 h-5" /></>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Success Modal */}
      <AnimatePresence>
        {isSuccess && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-[#113264]/40 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] p-10 md:p-16 max-w-xl w-full text-center relative shadow-3xl border border-white/20"
            >
              <button 
                onClick={() => setIsSuccess(false)}
                className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-8 flex justify-center">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-16 h-16 text-green-500" strokeWidth={1} />
                </div>
              </div>

              <h3 className="text-4xl font-bold text-[#113264] font-outfit mb-4">Thank You!</h3>
              <p className="text-gray-500 text-lg leading-relaxed font-outfit mb-10">
                Your message has been successfully received. Our team will review your inquiry and get back to you shortly.
              </p>

              <button
                onClick={() => setIsSuccess(false)}
                className="bg-[#113264] text-white px-10 py-5 rounded-2xl font-bold transition-all hover:bg-primary shadow-xl shadow-[#113264]/20"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
