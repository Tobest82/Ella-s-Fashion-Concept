import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, CheckCircle2, Crown } from 'lucide-react';
import { SiteSettings } from '../types';
import { store } from '../services/store';

interface ContactPageProps {
  settings: SiteSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastSubmittedDetails, setLastSubmittedDetails] = useState<{
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  } | null>(null);

  const targetEmail = settings.email || 'ellafashionconcept58@gmail.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSending(true);

    // Save to local admin store
    await store.addMessage({
      name,
      email,
      phone,
      subject: subject || 'General Fitting Inquiry',
      message,
    });

    const submittedData = { name, email, phone, subject: subject || 'General Fitting Inquiry', message };

    // Post to FormSubmit AJAX endpoint (sends directly to ellafashionconcept58@gmail.com)
    try {
      await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `New Client Inquiry: ${subject || 'General Inquiry'} from ${name}`,
          _template: 'table',
          "Client Name": name,
          "Client Email": email,
          "Phone Number": phone || 'N/A',
          "Subject": subject || 'General Inquiry',
          "Message": message
        })
      });
    } catch (err) {
      console.warn("FormSubmit transmission fallback:", err);
    }

    // Trigger mailto link as browser fallback option
    const emailSubject = encodeURIComponent(subject || `Client Inquiry from ${name}`);
    const emailBody = encodeURIComponent(
      `Full Name: ${name}\nClient Email: ${email}\nPhone Number: ${phone || 'N/A'}\nSubject: ${subject || 'General Inquiry'}\n\nMessage / Requirements:\n${message}`
    );
    window.location.href = `mailto:${targetEmail}?subject=${emailSubject}&body=${emailBody}`;

    setLastSubmittedDetails(submittedData);
    setIsSending(false);
    setSubmitted(true);
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#F4C430]">
          Customer Support
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#121212]">
          Contact Us
        </h1>
        <p className="text-xs text-[#8C8275] leading-relaxed">
          Have questions about custom sizing, orders, or delivery? Send us a message and we will help you right away.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Contact Info Box */}
        <div className="bg-[#121212] text-white p-8 rounded-3xl space-y-8 shadow-2xl relative overflow-hidden">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#F4C430]">
              <Crown className="w-5 h-5" />
              <span className="font-serif font-bold text-xl text-white">Ella's Concept</span>
            </div>
            <p className="text-xs text-[#A39B8E] leading-relaxed">
              Experience personalized fashion consultation and master fitting services.
            </p>
          </div>

          <div className="space-y-6 text-xs text-[#D4CEC5]">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#F4C430] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white mb-0.5">Boutique Address</strong>
                <span>{settings.address}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#F4C430] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white mb-0.5">Direct Line</strong>
                <span>{settings.phone_number}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#F4C430] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white mb-0.5">Official Email</strong>
                <span>{settings.email}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#F4C430] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white mb-0.5">Fitting Hours</strong>
                <span>Mon – Sat: 9:00 AM – 7:00 PM</span>
              </div>
            </div>
          </div>

          <a
            href={`https://wa.me/${settings.whatsapp_number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-2 shadow-xl"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            Instant WhatsApp Consultation
          </a>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-[#E8E4DE] shadow-luxury space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#121212] border-b border-[#F0ECE6] pb-4">
            Send Us a Message
          </h2>

          {submitted && (
            <div className="p-5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                Message Transmitted Successfully!
              </div>
              <p className="text-emerald-700 leading-relaxed">
                Thank you, <strong>{lastSubmittedDetails?.name || 'Client'}</strong>! Your inquiry was submitted directly to our primary email <strong>{targetEmail}</strong>. We will reply to <em>{lastSubmittedDetails?.email}</em> promptly.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href={`mailto:${targetEmail}?subject=${encodeURIComponent(lastSubmittedDetails?.subject || 'Client Inquiry')}&body=${encodeURIComponent(`Client: ${lastSubmittedDetails?.name}\nEmail: ${lastSubmittedDetails?.email}\nPhone: ${lastSubmittedDetails?.phone}\n\n${lastSubmittedDetails?.message}`)}`}
                  className="px-4 py-2 bg-emerald-700 text-white font-bold rounded-lg hover:bg-emerald-800 transition-colors inline-flex items-center gap-1.5 text-xs shadow-sm cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Open in Mail App
                </a>
                <a
                  href={`https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(`Hello Ella! I submitted a message on the site.\nName: ${lastSubmittedDetails?.name}\nEmail: ${lastSubmittedDetails?.email}\nPhone: ${lastSubmittedDetails?.phone}\nMessage: ${lastSubmittedDetails?.message}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#25D366] text-white font-bold rounded-lg hover:bg-[#20bd5a] transition-colors inline-flex items-center gap-1.5 text-xs shadow-sm cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  Send on WhatsApp (09121252258)
                </a>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#121212] mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Lady Genevieve N."
                  className="w-full bg-[#FAF8F5] border border-[#E8E4DE] rounded-xl px-4 py-3 text-xs text-[#121212] focus:outline-none focus:border-[#F4C430]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#121212] mb-1">Your Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. genevieve@example.com"
                  className="w-full bg-[#FAF8F5] border border-[#E8E4DE] rounded-xl px-4 py-3 text-xs text-[#121212] focus:outline-none focus:border-[#F4C430]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#121212] mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09121252258"
                  className="w-full bg-[#FAF8F5] border border-[#E8E4DE] rounded-xl px-4 py-3 text-xs text-[#121212] focus:outline-none focus:border-[#F4C430]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#121212] mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Custom Fitting Appointment"
                  className="w-full bg-[#FAF8F5] border border-[#E8E4DE] rounded-xl px-4 py-3 text-xs text-[#121212] focus:outline-none focus:border-[#F4C430]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#121212] mb-1">Message / Requirements *</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about the design, occasion date, or specific measurements..."
                className="w-full bg-[#FAF8F5] border border-[#E8E4DE] rounded-xl px-4 py-3 text-xs text-[#121212] focus:outline-none focus:border-[#F4C430]"
              />
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="px-8 py-3.5 bg-[#121212] text-[#F4C430] font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-black cursor-pointer transition-all flex items-center gap-2 shadow-xl disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {isSending ? `Sending to ${targetEmail}...` : 'Submit Client Inquiry'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
