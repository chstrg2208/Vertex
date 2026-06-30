'use client';

import React, { useState } from 'react';
import { Sparkles, Briefcase, FileText, Phone, MapPin, CheckCircle, ArrowRight, UserCheck, Shield, Zap, AlertTriangle, Layers, Clock, Award, ShieldCheck, Mail, HelpCircle } from 'lucide-react';
import { translations, Locale } from '@/utils/translations';

interface LandingPageProps {
  onOpenLogin: () => void;
  onSelectTab: (tab: string) => void;
  jobsCount: number;
  talentsCount: number;
  locale: Locale;
}

export default function LandingPage({ onOpenLogin, onSelectTab, jobsCount, talentsCount, locale }: LandingPageProps) {
  const t = translations[locale];

  // Sender Type Toggle: 'startup' | 'developer'
  const [senderType, setSenderType] = useState<'startup' | 'developer'>('startup');

  // Contact Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  // Developer Specific Fields
  const [phone, setPhone] = useState('');
  const [specialty, setSpecialty] = useState('');

  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    if (senderType === 'startup' && !content) return;
    if (senderType === 'developer' && (!phone || !specialty || !content)) return;

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSuccess(true);
      
      // Clear inputs
      setFullName('');
      setEmail('');
      setCompanyName('');
      setTitle('');
      setContent('');
      setPhone('');
      setSpecialty('');
      
      setTimeout(() => setSuccess(false), 6000);
    }, 1500);
  };

  const challenges = [
    { title: t.c1, desc: t.c1d },
    { title: t.c2, desc: t.c2d },
    { title: t.c3, desc: t.c3d },
    { title: t.c4, desc: t.c4d },
    { title: t.c5, desc: t.c5d },
    { title: t.c6, desc: t.c6d },
  ];

  const vettingSteps = [
    { step: '1', title: t.v1, desc: t.v1d },
    { step: '2', title: t.v2, desc: t.v2d },
    { step: '3', title: t.v3, desc: t.v3d },
    { step: '4', title: t.v4, desc: t.v4d },
  ];

  return (
    <div className="tab-content" style={{ animation: 'fadeIn 0.25s ease' }}>
      
      {/* 1. HERO SECTION */}
      <section style={{
        padding: '100px 0 120px 0',
        background: 'radial-gradient(circle at 80% 20%, rgba(249, 115, 22, 0.12), transparent 50%), radial-gradient(circle at 10% 80%, rgba(79, 70, 229, 0.08), transparent 50%)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ maxWidth: '900px' }}>

          <h1 style={{
            fontSize: '52px',
            lineHeight: '1.15',
            marginBottom: '24px',
            fontFamily: 'var(--font-heading)',
            fontWeight: '900'
          }}>
            {t.heroTitle1} <br />
            <span style={{
              background: 'linear-gradient(135deg, #f97316, var(--primary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>{t.heroTitle2}</span>
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            lineHeight: '1.6',
            marginBottom: '40px',
            maxWidth: '680px',
            margin: '0 auto 40px auto'
          }}>
            {t.heroSubtitle}
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button
              type="button"
              className="apply-btn"
              style={{ flex: 'none', padding: '14px 32px', fontSize: '15.5px', background: '#f97316', display: 'flex', alignItems: 'center', gap: '8px' }}
              onClick={onOpenLogin}
            >
              <UserCheck size={18} />
              {t.btnEmployer}
            </button>
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '14px 32px', fontSize: '15.5px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border)' }}
              onClick={() => onSelectTab('developer')}
            >
              {t.btnDeveloper}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* 2. CHALLENGES OF DIRECT REMOTE HIRING */}
      <section style={{ padding: '80px 0', background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>

            <h2 style={{ fontSize: '32px' }}>{t.challengeTitle}</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '600px', margin: '8px auto 0 auto' }}>
              {t.challengeSubtitle}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
            {challenges.map((item, idx) => (
              <div key={idx} className="card" style={{ padding: '24px', borderLeft: '4px solid var(--danger)' }}>
                <h4 style={{ fontSize: '15.5px', marginBottom: '8px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={16} style={{ color: 'var(--danger)' }} />
                  {item.title}
                </h4>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px', fontSize: '15px', fontWeight: 'bold', color: '#f97316' }}>
            {t.mitigate}
          </div>
        </div>
      </section>

      {/* 3. ENGAGEMENT MODELS */}
      <section style={{ padding: '80px 0', background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>

            <h2 style={{ fontSize: '32px' }}>{t.modelTitle}</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
              {t.modelSubtitle}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }}>
            <div className="card" style={{ padding: '28px', borderTop: '4px solid #f97316' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>{t.m1}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', lineHeight: 1.5, marginBottom: '20px' }}>
                {t.m1d}
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: 0 }}>
                {t.m1list.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="card" style={{ padding: '28px', borderTop: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>{t.m2}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', lineHeight: 1.5, marginBottom: '20px' }}>
                {t.m2d}
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: 0 }}>
                {t.m2list.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="card" style={{ padding: '28px', borderTop: '4px solid var(--success)' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>{t.m3}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', lineHeight: 1.5, marginBottom: '20px' }}>
                {t.m3d}
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: 0 }}>
                {t.m3list.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 4-LAYER DEVELOPER VETTING FLOW */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '48px', alignItems: 'center' }}>
            <div>

              <h2 style={{ fontSize: '32px', marginBottom: '20px', lineHeight: 1.3 }}>
                {t.vetTitle}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6, marginBottom: '20px' }}>
                {t.vetDesc1}
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6 }}>
                {t.vetDesc2}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {vettingSteps.map((item) => (
                <div key={item.step} className="card" style={{ display: 'flex', gap: '16px', padding: '16px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(249, 115, 22, 0.1)',
                    color: '#f97316',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    flexShrink: 0
                  }}>
                    {item.step}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14.5px', marginBottom: '4px' }}>{item.title}</h4>
                    <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. OPERATIONS & COMPLIANCE SUPPORT */}
      <section style={{ padding: '80px 0', background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>

            <h2 style={{ fontSize: '32px' }}>{t.opsTitle}</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '600px', margin: '8px auto 0 auto' }}>
              {t.opsSubtitle}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }}>
            <div className="card" style={{ padding: '24px' }}>
              <h4 style={{ fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} style={{ color: '#f97316' }} />
                {t.op1}
              </h4>
              <ul style={{ paddingLeft: '16px', fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: 0 }}>
                {t.op1list.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <h4 style={{ fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} style={{ color: 'var(--primary)' }} />
                {t.op2}
              </h4>
              <ul style={{ paddingLeft: '16px', fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: 0 }}>
                {t.op2list.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <h4 style={{ fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={18} style={{ color: 'var(--success)' }} />
                {t.op3}
              </h4>
              <ul style={{ paddingLeft: '16px', fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: 0 }}>
                {t.op3list.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HIRING STEPS */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '32px' }}>{t.stepsTitle}</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
              {t.stepsSubtitle}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#f97316', marginBottom: '8px' }}>{t.s1num}</div>
              <h4 style={{ fontSize: '16px', marginBottom: '12px' }}>{t.s1title}</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {t.s1desc}
              </p>
            </div>
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '8px' }}>{t.s2num}</div>
              <h4 style={{ fontSize: '16px', marginBottom: '12px' }}>{t.s2title}</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {t.s2desc}
              </p>
            </div>
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--success)', marginBottom: '8px' }}>{t.s3num}</div>
              <h4 style={{ fontSize: '16px', marginBottom: '12px' }}>{t.s3title}</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {t.s3desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DETAILED QUOTE / CONTACT US */}
      <section style={{ padding: '80px 0', background: 'var(--surface)' }} id="contact-us">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '48px' }}>
            <div>

              <h2 style={{ fontSize: '38px', marginBottom: '16px', fontWeight: 900, lineHeight: 1.2 }}>
                {locale === 'vi' ? 'NHẬN BÁO GIÁ CHO ĐỘI NGŨ NHÂN SỰ CỦA BẠN!' : 'GET A QUOTE FOR YOUR DELEGATED SOFTWARE TEAM!'}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6, marginBottom: '32px' }}>
                {t.contactSubtitle}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--background)', color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Phone size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.contactPhone}</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>+84 903 185 011</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--background)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.contactAddr}</div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{t.contactAddrVal}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="card" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>{t.formTitle}</h3>
              
              {/* SENDER ROLE TOGGLER SWITCH */}
              <div className="role-switcher" style={{ marginBottom: '24px', width: '100%', display: 'flex' }}>
                <button
                  type="button"
                  className={`role-btn ${senderType === 'startup' ? 'active employer' : ''}`}
                  style={{ flex: 1, textAlign: 'center', justifyContent: 'center' }}
                  onClick={() => {
                    setSenderType('startup');
                    setSuccess(false);
                  }}
                >
                  Startup
                </button>
                <button
                  type="button"
                  className={`role-btn ${senderType === 'developer' ? 'active candidate' : ''}`}
                  style={{ flex: 1, textAlign: 'center', justifyContent: 'center' }}
                  onClick={() => {
                    setSenderType('developer');
                    setSuccess(false);
                  }}
                >
                  Developer
                </button>
              </div>

              {success ? (
                <div style={{
                  backgroundColor: 'var(--success-bg)',
                  border: '1px solid var(--success)',
                  color: 'var(--success)',
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  lineHeight: 1.4
                }}>
                  {senderType === 'startup' ? t.successStartup : t.successDev}
                </div>
              ) : (
                <form onSubmit={handleContactSubmit}>
                  {/* Common Field: Name */}
                  <div className="form-group">
                    <label>{t.formName}</label>
                    <input
                      type="text"
                      required
                      placeholder={t.formNamePlh}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  {/* Common Field: Email */}
                  <div className="form-group">
                    <label>{t.formEmail}</label>
                    <input
                      type="email"
                      required
                      placeholder={t.formEmailPlh}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  {/* Conditional Fields: Startup */}
                  {senderType === 'startup' && (
                    <>
                      <div className="form-group">
                        <label>{t.formCompany}</label>
                        <input
                          type="text"
                          placeholder={t.formCompanyPlh}
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>{t.formTitleMsg}</label>
                        <input
                          type="text"
                          placeholder={t.formTitleMsgPlh}
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {/* Conditional Fields: Developer */}
                  {senderType === 'developer' && (
                    <>
                      <div className="form-group">
                        <label>{t.formPhone}</label>
                        <input
                          type="text"
                          required
                          placeholder={t.formPhonePlh}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>{t.formSpec}</label>
                        <input
                          type="text"
                          required
                          placeholder={t.formSpecPlh}
                          value={specialty}
                          onChange={(e) => setSpecialty(e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {/* Content field */}
                  <div className="form-group">
                    <label>
                      {senderType === 'startup' ? t.formContentStartup : t.formContentDev}
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder={senderType === 'startup' ? t.formContentStartupPlh : t.formContentDevPlh}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="apply-btn"
                    style={{ width: '100%', padding: '12px', marginTop: '10px', background: '#f97316' }}
                    disabled={isSending}
                  >
                    {isSending ? t.formBtnSending : t.formBtnSubmit}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
