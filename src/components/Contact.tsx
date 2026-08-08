import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Award } from 'lucide-react';
import { publicApi } from '../api/client';

export default function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState<Record<string, string>>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [info, setInfo] = useState<Record<string, string>>({});
  const [formConfig, setFormConfig] = useState<any>(null);

  useEffect(() => {
    const fetchInfoAndConfig = async () => {
      try {
        const [infoRes, configRes] = await Promise.all([
          publicApi.getTempleInfo(),
          publicApi.getFormConfig('contact')
        ]);
        if (infoRes.data) setInfo(infoRes.data);
        if (configRes.data) setFormConfig(configRes.data);
      } catch (err) {
        console.error('Failed to load contact page config:', err);
      }
    };
    fetchInfoAndConfig();
  }, []);

  useEffect(() => {
    if (formConfig?.fields) {
      const initial: Record<string, string> = {};
      formConfig.fields.forEach((f: any) => {
        initial[f.name] = '';
      });
      setFormData(initial);
    }
  }, [formConfig]);

  const defaultInfo = {
    phone_primary: "+91 94252 04990",
    phone_emergency: "+91 94252 05899",
    email: "bmtsd72@gmail.com",
    address_line1: "Shri Bamleshwari Mandir Trust Samiti",
    address_line2: "Chhirpani Parisar, Dongargarh",
    address_city: "Rajnandgaon, Chhattisgarh – 491445",
    google_maps_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3714.4984241774845!2d80.74971847600863!3d21.179213982845624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a297e6855555555%3A0x6b7bb8d3b844ad3c!2sMaa%20Bamleshwari%20Temple!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
  };

  const current = { ...defaultInfo, ...info };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await publicApi.submitContact(formData);
      setFormSubmitted(true);
      
      const resetData: Record<string, string> = {};
      if (formConfig?.fields) {
        formConfig.fields.forEach((f: any) => {
          resetData[f.name] = '';
        });
      } else {
        Object.keys(formData).forEach(k => { resetData[k] = ''; });
      }
      setFormData(resetData);
    } catch (err) {
      console.error('Submission failed:', err);
      setErrorMsg('Failed to submit message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const renderDynamicForm = () => {
    const fields = formConfig?.fields || [
      { name: "name", label: "Full Name", type: "text", required: true },
      { name: "email", label: "Email Address", type: "email", required: true },
      { name: "phone", label: "Phone Number", type: "tel", required: false },
      { name: "subject", label: "Subject", type: "text", required: true },
      { name: "message", label: "Message Content", type: "textarea", required: true }
    ];

    const isGridTwoColumns = (name: string) => {
      return name !== 'message' && name !== 'subject';
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-5">
        {errorMsg && (
          <p className="text-xs text-red-600 font-semibold">{errorMsg}</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {fields.filter((f: any) => f.type !== 'textarea').map((field: any) => (
            <div key={field.name} className={`flex flex-col space-y-1 ${isGridTwoColumns(field.name) ? 'col-span-1' : 'sm:col-span-2'}`}>
              <label className="text-xs font-semibold text-text-dark" htmlFor={field.name}>
                {field.label} {field.required ? '*' : ''}
              </label>
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                required={field.required}
                value={formData[field.name] || ''}
                onChange={handleChange}
                className="bg-white/60 border border-light-gold-border/40 focus:border-primary-gold focus:ring-1 focus:ring-primary-gold rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
              />
            </div>
          ))}
        </div>

        {fields.filter((f: any) => f.type === 'textarea').map((field: any) => (
          <div key={field.name} className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-text-dark" htmlFor={field.name}>
              {field.label} {field.required ? '*' : ''}
            </label>
            <textarea
              id={field.name}
              name={field.name}
              required={field.required}
              rows={4}
              value={formData[field.name] || ''}
              onChange={handleChange}
              className="bg-white/60 border border-light-gold-border/40 focus:border-primary-gold focus:ring-1 focus:ring-primary-gold rounded-xl px-4 py-3 text-sm focus:outline-none transition-all resize-none"
            />
          </div>
        ))}

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-deep-maroon text-white font-bold py-4 rounded-xl shadow-md hover:bg-deep-maroon/95 hover:shadow-lg focus:outline-none flex items-center justify-center space-x-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Submitting...' : 'Submit Inquiries'}</span>
          </button>
        </div>
      </form>
    );
  };

  return (
    <section id="contact-section" className="py-20 px-6 md:px-12 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <span className="text-xs uppercase tracking-widest text-primary-gold font-bold">Connect With Us</span>
        <h2 className="font-serif font-extrabold text-3xl md:text-5xl text-deep-maroon">Contact Information</h2>
        <div className="w-24 h-1 bg-primary-gold mx-auto rounded-full" />
        <p className="text-text-muted text-sm leading-relaxed">
          Reach out to the temple office for general inquiries, room bookings, special pooja bookings, or administrative support.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Map & Address */}
        <div className="lg:col-span-6 space-y-8">
          {/* Google Map Embed */}
          <div className="rounded-[28px] overflow-hidden shadow-lg border border-light-gold-border/20 h-80 relative">
            <iframe
              src={current.google_maps_url}
              className="w-full h-full border-0 absolute inset-0"
              allowFullScreen
              loading="lazy"
              title="Dongargarh Maa Bamleshwari Temple Google Maps Location"
            />
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-[24px] border border-light-gold-border/10 shadow-sm flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-deep-maroon/5 flex items-center justify-center text-deep-maroon shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-deep-maroon text-sm mb-1">Temple Location</h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  {current.address_line1}, {current.address_line2}, {current.address_city}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[24px] border border-light-gold-border/10 shadow-sm flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-deep-maroon/5 flex items-center justify-center text-deep-maroon shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-deep-maroon text-sm mb-1">Phone Numbers</h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  Lower Temple: {current.phone_primary}<br />
                  Upper Temple: {current.phone_emergency}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[24px] border border-light-gold-border/10 shadow-sm flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-deep-maroon/5 flex items-center justify-center text-deep-maroon shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-deep-maroon text-sm mb-1">Official Email</h4>
                <p className="text-xs text-text-muted leading-relaxed select-all">
                  {current.email}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[24px] border border-light-gold-border/10 shadow-sm flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-deep-maroon/5 flex items-center justify-center text-deep-maroon shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-deep-maroon text-sm mb-1">Office Hours</h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  8:00 AM – 6:00 PM Daily<br />
                  (Admin Desk)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-6">
          <div className="glass-card rounded-[28px] p-8 md:p-10 shadow-xl border border-light-gold-border/20">
            <h3 className="font-serif font-extrabold text-2xl text-deep-maroon mb-2">Send a Message</h3>
            <p className="text-xs text-text-muted mb-6">Required fields are marked with *</p>

            {formSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-[20px] text-center space-y-3">
                <Award className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-serif font-bold text-lg">Message Submitted Successfully</h4>
                <p className="text-xs leading-relaxed">
                  Thank you for contacting the temple office. Our team will review your message and reach out to you as soon as possible.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="px-6 py-2 rounded-full bg-emerald-600 text-white font-bold text-xs shadow-md focus:outline-none"
                >
                  Send another message
                </button>
              </div>
            ) : (
              renderDynamicForm()
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

