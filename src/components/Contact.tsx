import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Award } from 'lucide-react';

export default function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API Submission
    setTimeout(() => {
      setFormSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 800);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.1293671239843!2d73.52303037604473!3d22.46174783705915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3960efcaaaaaaaab%3A0xb35a0bf64396b1b4!2sKalika%20Mata%20Temple!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              className="w-full h-full border-0 absolute inset-0"
              allowFullScreen
              loading="lazy"
              title="Shree Kalika Mataji Temple Google Maps Location"
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
                  Shri Kalika Mataji Temple, Pavagadh, Panchmahal, Gujarat – 389360
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
                  +91 9099091042<br />
                  02676-228888 / 228899
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
                  pavagadh.mandirtrust@gmail.com
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
                  Thank you for contacting the Pavagadh Temple Trust. Our office will review your request and get back to you shortly.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="px-6 py-2 rounded-full bg-emerald-600 text-white font-bold text-xs shadow-md focus:outline-none"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-semibold text-text-dark" htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-white/60 border border-light-gold-border/40 focus:border-primary-gold focus:ring-1 focus:ring-primary-gold rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-semibold text-text-dark" htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-white/60 border border-light-gold-border/40 focus:border-primary-gold focus:ring-1 focus:ring-primary-gold rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-semibold text-text-dark" htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="bg-white/60 border border-light-gold-border/40 focus:border-primary-gold focus:ring-1 focus:ring-primary-gold rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-semibold text-text-dark" htmlFor="subject">Subject *</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="bg-white/60 border border-light-gold-border/40 focus:border-primary-gold focus:ring-1 focus:ring-primary-gold rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-text-dark" htmlFor="message">Message Content *</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="bg-white/60 border border-light-gold-border/40 focus:border-primary-gold focus:ring-1 focus:ring-primary-gold rounded-xl px-4 py-3 text-sm focus:outline-none transition-all resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-deep-maroon text-white font-bold py-4 rounded-xl shadow-md hover:bg-deep-maroon/95 hover:shadow-lg focus:outline-none flex items-center justify-center space-x-2 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiries</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
