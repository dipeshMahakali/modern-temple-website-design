import React, { useState, useEffect } from 'react';
import { Gift, ShieldCheck, Landmark, Heart, Copy, Check } from 'lucide-react';
import { publicApi } from '../api/client';

interface BankDetailData {
  id: number;
  label: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  branch_name: string;
}

export default function DonatePage() {
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [bankDetails, setBankDetails] = useState<BankDetailData[]>([]);
  const [info, setInfo] = useState<Record<string, string>>({});
  const [formConfig, setFormConfig] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchDonateData = async () => {
      try {
        const [bankRes, infoRes, configRes] = await Promise.all([
          publicApi.getBankDetails(),
          publicApi.getTempleInfo('donate'),
          publicApi.getFormConfig('donate')
        ]);
        if (bankRes.data) setBankDetails(bankRes.data);
        if (infoRes.data) setInfo(infoRes.data);
        if (configRes.data) setFormConfig(configRes.data);
      } catch (err) {
        console.error('Failed to load donation portal details:', err);
      }
    };
    fetchDonateData();
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const defaultExemption = {
    donate_exemption_title: "Income Tax Deduction Under Section 80G",
    donate_exemption_desc: "All donations made to the Shri Bamleshwari Mandir Trust Samiti, Dongargarh, are eligible for a 50% tax exemption under Section 80G of the Indian Income Tax Act. A receipt containing the 80G registration number will be dispatched to your registered email address."
  };

  const defaultBanks = [
    {
      label: "General Mandir Development Fund",
      bank_name: "State Bank of India",
      account_number: "30012345678",
      ifsc_code: "SBIN0000366",
      branch_name: "Dongargarh, Chhattisgarh"
    },
    {
      label: "Annakshetra Fund (Free Devotee Meals)",
      bank_name: "State Bank of India",
      account_number: "30012345999",
      ifsc_code: "SBIN0000366",
      branch_name: "Dongargarh, Chhattisgarh"
    }
  ];

  const currentInfo = { ...defaultExemption, ...info };
  const currentBanks = bankDetails.length > 0 ? bankDetails : defaultBanks;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(id);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  return (
    <div className="py-24 px-6 md:px-12 max-w-[1440px] mx-auto space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest text-primary-gold font-bold">Contribution & Support</span>
        <h1 className="font-serif font-extrabold text-4xl md:text-5xl text-deep-maroon">Online Donation Portal</h1>
        <div className="w-24 h-1 bg-primary-gold mx-auto rounded-full" />
        <p className="text-text-muted text-sm leading-relaxed">
          Support the development of Dongargarh Maa Bamleshwari Temple and contribute to our pilgrim welfare services.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Exemption & Bank Details */}
        <div className="lg:col-span-7 space-y-8">
          {/* Exemption Card */}
          <div className="bg-gradient-to-r from-deep-maroon to-[#4D1212] text-white p-8 rounded-[28px] shadow-xl relative overflow-hidden">
            <Heart className="absolute -right-4 -bottom-4 w-40 h-40 text-white/5 pointer-events-none" />
            <div className="flex items-center space-x-2 text-primary-gold mb-3">
              <ShieldCheck className="w-6 h-6" />
              <span className="text-xs uppercase font-bold tracking-widest">Tax Exemption Guaranteed</span>
            </div>
            <h3 className="font-serif font-bold text-2xl mb-2">{currentInfo.donate_exemption_title}</h3>
            <p className="text-xs text-white/80 leading-relaxed max-w-xl">
              {currentInfo.donate_exemption_desc}
            </p>
          </div>

          {/* Bank Accounts List */}
          <div className="space-y-6">
            <h3 className="font-serif font-bold text-deep-maroon text-2xl">Direct Bank Transfer (NEFT / RTGS)</h3>
            <p className="text-xs text-text-muted">
              Devotees can transfer funds directly into the official bank accounts of the trust. Please specify the donation type in the transaction remarks.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentBanks.map((details, idx) => (
                <div key={idx} className="bg-white p-6 rounded-[24px] border border-light-gold-border/25 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-full bg-deep-maroon/5 flex items-center justify-center text-deep-maroon">
                      <Landmark className="w-5 h-5 text-primary-gold" />
                    </div>
                    <h4 className="font-serif font-bold text-deep-maroon text-base leading-snug">
                      {details.label}
                    </h4>
                    <p className="text-xs text-text-muted">Bank: {details.bank_name}</p>
                    
                    <div className="bg-[#FFF9F2] p-3 rounded-lg border border-light-gold-border/10 space-y-1.5 font-mono text-[11px] text-text-dark">
                      <div className="flex justify-between items-center">
                        <span>A/c: {details.account_number}</span>
                        <button
                          onClick={() => handleCopy(details.account_number, `acc-${idx}`)}
                          className="text-primary-gold hover:text-deep-maroon transition-colors"
                          aria-label="Copy account number"
                        >
                          {copiedAccount === `acc-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <div>IFSC: {details.ifsc_code}</div>
                      <div className="truncate">Branch: {details.branch_name}</div>
                    </div>
                  </div>
                  <div className="text-[10px] text-text-muted border-t border-light-gold-border/20 pt-3">
                    Copy the details above to transfer via NetBanking.
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Donation Form / Portal Selector */}
        <div className="lg:col-span-5">
          <div className="glass-card rounded-[28px] p-8 md:p-10 shadow-xl border border-light-gold-border/20 space-y-6">
            <h3 className="font-serif font-extrabold text-2xl text-deep-maroon">Donation Form</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Fill in your details to receive an official digital receipt.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Proceeding to secure payment gateway simulator...");
              }}
              className="space-y-4"
            >
              {formConfig?.fields ? (
                formConfig.fields.map((field: any) => (
                  <div key={field.name} className="flex flex-col space-y-1">
                    <label className="text-xs font-semibold text-text-dark" htmlFor={field.name}>
                      {field.label} {field.required ? '*' : ''}
                    </label>
                    {field.type === 'select' ? (
                      <select
                        id={field.name}
                        name={field.name}
                        required={field.required}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        className="bg-white/60 border border-light-gold-border/40 focus:border-primary-gold focus:ring-1 focus:ring-primary-gold rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
                      >
                        <option value="">Select Option</option>
                        {(field.options || []).map((opt: string) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        required={field.required}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        className="bg-white/60 border border-light-gold-border/40 focus:border-primary-gold focus:ring-1 focus:ring-primary-gold rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
                      />
                    )}
                  </div>
                ))
              ) : (
                <>
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-semibold text-text-dark" htmlFor="donorName">Donor's Full Name *</label>
                    <input
                      type="text"
                      id="donorName"
                      name="donorName"
                      required
                      placeholder="Shri / Smt"
                      value={formData.donorName || ''}
                      onChange={handleChange}
                      className="bg-white/60 border border-light-gold-border/40 focus:border-primary-gold focus:ring-1 focus:ring-primary-gold rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-semibold text-text-dark" htmlFor="donorPan">PAN Card Number (For 80G) *</label>
                    <input
                      type="text"
                      id="donorPan"
                      name="donorPan"
                      required
                      placeholder="ABCDE1234F"
                      value={formData.donorPan || ''}
                      onChange={handleChange}
                      className="bg-white/60 border border-light-gold-border/40 focus:border-primary-gold focus:ring-1 focus:ring-primary-gold rounded-xl px-4 py-3 text-sm focus:outline-none transition-all uppercase"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-semibold text-text-dark" htmlFor="donorAmount">Donation Amount (INR) *</label>
                    <input
                      type="number"
                      id="donorAmount"
                      name="donorAmount"
                      required
                      min={100}
                      placeholder="₹ 1000"
                      value={formData.donorAmount || ''}
                      onChange={handleChange}
                      className="bg-white/60 border border-light-gold-border/40 focus:border-primary-gold focus:ring-1 focus:ring-primary-gold rounded-xl px-4 py-3 text-sm focus:outline-none transition-all font-bold"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-semibold text-text-dark" htmlFor="donationType">Purpose of Donation *</label>
                    <select
                      id="donationType"
                      name="donationType"
                      required
                      value={formData.donationType || ''}
                      onChange={handleChange}
                      className="bg-white/60 border border-light-gold-border/40 focus:border-primary-gold focus:ring-1 focus:ring-primary-gold rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
                    >
                      <option value="general">General Mandir Development Fund</option>
                      <option value="annakshetra">Annakshetra (Free Pilgrim Meals)</option>
                      <option value="dhwaja">Dhwaj Booking Spire Ceremony</option>
                      <option value="pooja">Special Pooja & Havan Rituals</option>
                    </select>
                  </div>
                </>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full gold-gradient text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg focus:outline-none flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Gift className="w-4 h-4" />
                  <span>Proceed to Payment</span>
                </button>
              </div>
            </form>

            <div className="flex items-center justify-center space-x-2 text-[10px] text-text-muted pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>PCI-DSS Compliant 256-Bit Encrypted Gateway</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
