import React, { useState } from 'react';
import { Shield, FileText } from 'lucide-react';

interface PrivacyTermsProps {
  initialTab: 'privacy' | 'terms';
}

export default function PrivacyTerms({ initialTab }: PrivacyTermsProps) {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(initialTab);

  return (
    <div className="py-24 px-6 md:px-12 max-w-[1000px] mx-auto space-y-10 font-sans text-sm text-text-dark/90 leading-relaxed">
      {/* Tab Switcher */}
      <div className="flex justify-center border-b border-light-gold-border/20 pb-4 space-x-6">
        <button
          onClick={() => setActiveTab('privacy')}
          className={`flex items-center space-x-2 pb-2 font-serif font-bold text-lg focus:outline-none transition-all ${
            activeTab === 'privacy'
              ? 'text-deep-maroon border-b-2 border-primary-gold'
              : 'text-text-muted hover:text-deep-maroon'
          }`}
        >
          <Shield className="w-5 h-5" />
          <span>Privacy Policy</span>
        </button>
        
        <button
          onClick={() => setActiveTab('terms')}
          className={`flex items-center space-x-2 pb-2 font-serif font-bold text-lg focus:outline-none transition-all ${
            activeTab === 'terms'
              ? 'text-deep-maroon border-b-2 border-primary-gold'
              : 'text-text-muted hover:text-deep-maroon'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span>Terms & Conditions</span>
        </button>
      </div>

      {activeTab === 'privacy' ? (
        <div className="space-y-6">
          <h2 className="font-serif font-bold text-deep-maroon text-2xl">Privacy Policy</h2>
          <p className="text-xs text-text-muted">Last Updated: July 2026</p>
          
          <p>
            Shri Bamleshwari Mandir Trust Samiti, Dongargarh, is committed to respecting and protecting the privacy of our devotees and portal users. This privacy statement outlines the type of data we collect and how we utilize it.
          </p>

          <h3 className="font-serif font-bold text-deep-maroon text-lg">1. Information Collection</h3>
          <p>
            We collect personal details such as donor name, PAN number, email address, phone number, and postal address when you submit online donations, flag bookings, or contact forms. All financial information is processed securely by payment gateways and is not stored on our trust servers.
          </p>

          <h3 className="font-serif font-bold text-deep-maroon text-lg">2. Usage of Personal Information</h3>
          <p>
            The collected information is solely used to dispatch official donation tax receipts, provide booking updates (SMS/Email), respond to inquiries, and comply with tax authorities regarding Section 80G deductions. We do not sell or lease donor databases to third-party institutions.
          </p>

          <h3 className="font-serif font-bold text-deep-maroon text-lg">3. Security Standards</h3>
          <p>
            Our web platform employs 256-bit Secure Sockets Layer (SSL) certificates and complies with payment industry standards (PCI-DSS) to guarantee safe transactions.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="font-serif font-bold text-deep-maroon text-2xl">Terms & Conditions</h2>
          <p className="text-xs text-text-muted">Last Updated: July 2026</p>

          <p>
            Welcome to the official portal of Shri Bamleshwari Mandir Trust Samiti, Dongargarh. By accessing this portal, you agree to comply with the terms and conditions outlined below.
          </p>

          <h3 className="font-serif font-bold text-deep-maroon text-lg">1. Online Services & Refunds</h3>
          <p>
            All online bookings, including Flag bookings (*Dhwaja*), special pooja offerings, and online room reservations at Trust Dharamshalas are final. Payments are non-refundable and dates cannot be rescheduled once transaction receipts are generated.
          </p>

          <h3 className="font-serif font-bold text-deep-maroon text-lg">2. Donation Policy</h3>
          <p>
            Donations once paid online cannot be cancelled or refunded. Devotees are requested to double check the amount, purpose, and PAN card details before finalizing transactions to ensure smooth 80G tax deductions.
          </p>

          <h3 className="font-serif font-bold text-deep-maroon text-lg">3. Devotee Conduct</h3>
          <p>
            The trust reserves the right to deny entry to pilgrims breaching the temple guidelines, dress code standards, or carrying banned items within the hilltop precinct.
          </p>
        </div>
      )}
    </div>
  );
}
