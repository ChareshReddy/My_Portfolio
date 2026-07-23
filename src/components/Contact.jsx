import React, { useState } from 'react';
import { Mail, Phone, Copy, Check, Terminal, Send } from 'lucide-react';
import { contact } from '../data/content';
import ScrollReveal from './ScrollReveal';

function GithubIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    const subject = encodeURIComponent(`Contact Stream Request from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n\n` +
      `Message:\n${formData.message}`
    );

    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;

    setShowToast(true);
    setTimeout(() => setShowToast(false), 4500);

    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="relative px-4 md:px-8 py-20 border-t border-slate-900/50">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <div className="flex flex-col mb-16">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest mb-2">IO Interface</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-100 font-display">
            Open Connection Stream
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-teal-400 mt-4 rounded-full" />
        </div>

        {/* Form and Info Columns (GSAP ScrollReveal wrapped) */}
        <ScrollReveal
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto items-stretch"
          stagger={0.2}
        >
          {/* Connection Specs (Info Column) */}
          <div className="lg:col-span-5 flex flex-col justify-between glass-panel border border-cyan-500/5 p-6 md:p-8 rounded-2xl">
            <div className="text-left">
              <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-wider block mb-4">
                // System Endpoint Details
              </span>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8">
                {contact.ctaText}
              </p>

              {/* Direct links list */}
              <div className="space-y-4">
                {/* Email (with copy) */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/45 border border-slate-900">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-cyan-950/40 flex items-center justify-center text-cyan-400">
                      <Mail className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-mono text-[9px] text-slate-500 uppercase">Mail Endpoint</span>
                      <a href={`mailto:${contact.email}`} className="text-xs sm:text-sm font-semibold text-slate-200 hover:text-cyan-400 focus-ring rounded transition-colors">
                        {contact.email}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyEmail}
                    className="p-2 text-slate-500 hover:text-cyan-400 rounded-lg hover:bg-slate-900 transition-colors focus-ring"
                    aria-label="Copy email address to clipboard"
                  >
                    {copied ? <Check className="w-4.5 h-4.5 text-emerald-400" /> : <Copy className="w-4.5 h-4.5" />}
                  </button>
                </div>

                {/* Phone */}
                <div className="flex items-center p-3.5 rounded-xl bg-slate-950/45 border border-slate-900">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-cyan-950/40 flex items-center justify-center text-cyan-400">
                      <Phone className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-mono text-[9px] text-slate-500 uppercase">Voice Line</span>
                      <a href={`tel:${contact.phone.replace(/\s+/g, '')}`} className="text-xs sm:text-sm font-semibold text-slate-200 hover:text-cyan-400 focus-ring rounded transition-colors">
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Nodes */}
            <div className="mt-10 pt-6 border-t border-slate-900/80">
              <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest block mb-4 text-left">
                Network Handshakes:
              </span>
              <div className="flex items-center gap-3">
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-950 border border-slate-900 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-300 focus-ring"
                  aria-label="Visit Github profile"
                >
                  <GithubIcon className="w-4.5 h-4.5" />
                </a>
                <a
                  href={`https://linkedin.com/in/${contact.linkedinUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-950 border border-slate-900 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-300 focus-ring"
                  aria-label="Visit LinkedIn profile"
                >
                  <LinkedinIcon className="w-4.5 h-4.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Form Terminal */}
          <div className="lg:col-span-7 glass-panel border border-cyan-500/10 rounded-2xl shadow-xl overflow-hidden flex flex-col justify-between">
            {/* Terminal Mock Header */}
            <div className="flex items-center justify-between px-5 py-3 bg-slate-950/60 border-b border-slate-900">
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-550 uppercase tracking-wider">
                <Terminal className="w-4.5 h-4.5 text-cyan-400" />
                send_connection_handshake()
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-slate-700" />
                <span className="font-mono text-[9px] text-slate-600 font-bold uppercase">STDOUT</span>
              </div>
            </div>

            {/* Input Form Fields */}
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5 text-left flex-grow bg-slate-950/20">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="name" className="font-mono text-[10px] text-slate-450 uppercase tracking-wider block font-semibold">
                    [01] Caller Name:
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter full name"
                    className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl font-mono text-sm text-slate-200 placeholder-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="font-mono text-[10px] text-slate-450 uppercase tracking-wider block font-semibold">
                    [02] Reply Gateway:
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter return email"
                    className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl font-mono text-sm text-slate-200 placeholder-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="font-mono text-[10px] text-slate-450 uppercase tracking-wider block font-semibold">
                  [03] Packet Payload (Message):
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  placeholder="Describe connection scope or project requirements..."
                  className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl font-mono text-sm text-slate-200 placeholder-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all resize-none"
                />
              </div>

              {/* Submit Trigger */}
              <button
                type="submit"
                className="group w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-semibold text-sm transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] shadow-md hover:shadow-cyan-500/20 cursor-pointer focus-ring"
              >
                Trigger Ingestion Pipeline
                <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </form>
          </div>
        </ScrollReveal>
      </div>

      {/* Toast Notification (standard CSS active transition fallback) */}
      <div
        className={`fixed bottom-6 right-6 z-50 glass-panel-heavy border-emerald-500/30 rounded-xl p-4 shadow-2xl max-w-sm transition-all duration-300 transform ${
          showToast ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
        }`}
      >
        <div className="flex items-start gap-3">
          <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="text-left font-mono">
            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Connection Opened</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Ingestion request parsed. Redirection to client application launched.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
