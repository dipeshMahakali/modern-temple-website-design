import React from 'react';
import { Shield, Mail, Award, Landmark } from 'lucide-react';

export default function Trustees() {
  const primaryMembers = [
    {
      name: "Shri Surendrabhai Motibhai Patel",
      position: "Chairman",
      desc: "Supervises overall temple operations, administrative decisions, and central coordination with state heritage committees."
    },
    {
      name: "Shri Ashokbhai Sushilchandra Pandya",
      position: "Secretary",
      desc: "Manages financial trusts, devotee coordination, welfare programs (annakshetra), and regulatory reporting."
    },
    {
      name: "Shri Jigneshbhai Vyomeshbhai Bhatt",
      position: "Vice President",
      desc: "Directs redevelopment projects, infrastructure expansions, security services, and local administration."
    }
  ];

  const trusteesList = [
    "Shri Pareshbhai Kismatrai Patel",
    "Shri Vinodbhai Ramabhai Variya",
    "Shri Nikhilbhai Chandrakantbhai Bhatt",
    "Shri Sudhanshubhai Pravinbhai Bhatt",
    "Shri Chintankumar Babulal Purohit",
    "Shri Dr. Vijaybhai Kanshiram Patel",
    "Shri Parasbhai Arunbhai Joshi",
    "Shri Gordhanbhai Shankarbhai Chavda"
  ];

  return (
    <section id="trust-section" className="py-20 px-6 md:px-12 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <span className="text-xs uppercase tracking-widest text-primary-gold font-bold">Administration</span>
        <h2 className="font-serif font-extrabold text-3xl md:text-5xl text-deep-maroon">Trust & Management</h2>
        <div className="w-24 h-1 bg-primary-gold mx-auto rounded-full" />
        <p className="text-text-muted text-sm leading-relaxed">
          The administration and developmental operations of the Pavagadh temple are managed by the Shree Kalika Mataji Mandir Trust Board.
        </p>
      </div>

      {/* Board Executive Members */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {primaryMembers.map((member, idx) => (
          <div
            key={idx}
            className="bg-white rounded-[28px] border border-light-gold-border/20 p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Silhouette Avatar */}
              <div className="w-24 h-24 rounded-full bg-deep-maroon/5 border-2 border-primary-gold flex items-center justify-center mx-auto text-deep-maroon shadow-inner">
                <Landmark className="w-10 h-10 text-primary-gold" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary-gold bg-primary-gold/10 px-3 py-1 rounded-full">
                  {member.position}
                </span>
                <h4 className="font-serif font-bold text-deep-maroon text-xl mt-3 mb-2">
                  {member.name}
                </h4>
                <p className="text-xs text-text-muted leading-relaxed font-sans">
                  {member.desc}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-light-gold-border/20 flex items-center justify-center space-x-2 text-xs text-text-muted font-medium">
              <Shield className="w-4 h-4 text-primary-gold" />
              <span>Executive Committee Officer</span>
            </div>
          </div>
        ))}
      </div>

      {/* Board of Trustees Grid */}
      <div className="glass-card rounded-[28px] p-8 md:p-10 border border-light-gold-border/30">
        <h4 className="font-serif font-bold text-deep-maroon text-xl mb-6 text-center border-b border-light-gold-border/20 pb-4">
          Board of Trustees
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trusteesList.map((trustee, idx) => (
            <div
              key={idx}
              className="bg-white/50 border border-light-gold-border/10 p-5 rounded-[20px] shadow-sm hover:shadow-md transition-shadow text-center flex items-center justify-center"
            >
              <div>
                <Award className="w-5 h-5 text-primary-gold mx-auto mb-2" />
                <h5 className="font-serif font-bold text-text-dark text-sm">{trustee}</h5>
                <p className="text-[10px] text-text-muted uppercase tracking-widest mt-1">Trustee Member</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
