'use client';

import React, { useState } from 'react';
import { Mail, MapPin, Share2, Users, Radio, CheckCircle, ArrowRight } from 'lucide-react';
import { translations, Locale } from '@/utils/translations';
import HeroSection from './HeroSection';

interface ContactTabProps {
  locale: Locale;
  theme: 'light' | 'dark';
}

export default function ContactTab({ locale, theme }: ContactTabProps) {
  const t = translations[locale];

  // Role Switch State: 'employer' | 'developer'
  const [activeRole, setActiveRole] = useState<'employer' | 'developer'>('employer');

  // Contact Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [message, setMessage] = useState('');
  
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !message) return;
    if (activeRole === 'developer' && (!phone || !specialty)) return;

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSuccess(true);
      
      // Reset form
      setFullName('');
      setEmail('');
      setCompanyName('');
      setPhone('');
      setSpecialty('');
      setMessage('');
      
      setTimeout(() => setSuccess(false), 6000);
    }, 1500);
  };

  return (
    <div className="contact-tab-container" style={{ animation: 'fadeIn 0.25s ease' }}>
      
      {/* 1. HERO SECTION - FULL WIDTH SLIDESHOW BANNER */}
      <HeroSection
        theme={theme}
        tag={locale === 'vi' ? 'Kết Nối Với Vertex' : 'Connect With Vertex'}
        title={
          activeRole === 'employer'
            ? (locale === 'vi' ? 'Liên Hệ & Hợp Tác Tuyển Dụng' : 'Contact & Hiring Collaboration')
            : (locale === 'vi' ? 'Gia Nhập Mạng Lưới Kỹ Sư' : 'Join Our Developer Network')
        }
        description={
          activeRole === 'employer'
            ? (locale === 'vi' ? 'Hãy gửi yêu cầu của bạn, chúng tôi luôn sẵn sàng hỗ trợ bạn xây dựng đội ngũ IT tinh nhuệ nhất.' : 'Send us your request, we are always ready to help you build the most elite IT team.')
            : (locale === 'vi' ? 'Nâng cao sự nghiệp của bạn. Nhận các cơ hội làm việc Remote/Hybrid cho các đối tác toàn cầu.' : 'Elevate your career. Get Remote/Hybrid job opportunities with global partners.')
        }
        actions={
          <button 
            type="button" 
            className="btn-solid-orange" 
            style={{ padding: '14px 32px', fontSize: '15.5px' }}
            onClick={() => {
              const element = document.getElementById('contact-split-section');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            {locale === 'vi' ? 'Gửi Yêu Cầu Ngay' : 'Send Message Now'}
            <ArrowRight size={16} />
          </button>
        }
      />

      {/* 2. SPLIT LAYOUT CONTACT SECTION */}
      <section 
        id="contact-split-section" 
        style={{ 
          padding: '80px 0', 
          background: 'var(--background)',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <div className="container" style={{ maxWidth: '1200px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 1fr',
            gap: '64px',
            alignItems: 'start'
          }}>
            
            {/* LEFT SIDE: DYNAMIC INFO */}
            <div className="animate-fade-in-left" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div>
                {activeRole === 'employer' ? (
                  <>
                    <h2 style={{
                      fontSize: '44px',
                      fontWeight: 800,
                      lineHeight: '1.2',
                      color: 'var(--text-primary)',
                      marginBottom: '16px',
                      fontFamily: 'var(--font-heading)'
                    }}>
                      {locale === 'vi' ? 'Hãy xây dựng ' : "Let's build your " }
                      <span style={{ color: '#f97316' }}>
                        {locale === 'vi' ? 'đội ngũ trong mơ của bạn.' : 'dream team.'}
                      </span>
                    </h2>
                    <p style={{
                      fontSize: '16px',
                      lineHeight: '1.6',
                      color: 'var(--text-secondary)',
                      maxWidth: '520px'
                    }}>
                      {locale === 'vi'
                        ? 'Bạn có thắc mắc về hệ thống quản lý và cung ứng nhân sự CNTT của chúng tôi? Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ mở rộng tổ chức của bạn.'
                        : 'Have questions about our IT staffing management platform? Our expert team is ready to help you scale your engineering organization.'}
                    </p>
                  </>
                ) : (
                  <>
                    <h2 style={{
                      fontSize: '44px',
                      fontWeight: 800,
                      lineHeight: '1.2',
                      color: 'var(--text-primary)',
                      marginBottom: '16px',
                      fontFamily: 'var(--font-heading)'
                    }}>
                      {locale === 'vi' ? 'Khởi đầu ' : "Scale your " }
                      <span style={{ color: '#f97316' }}>
                        {locale === 'vi' ? 'sự nghiệp IT vượt trội.' : 'IT career.'}
                      </span>
                    </h2>
                    <p style={{
                      fontSize: '16px',
                      lineHeight: '1.6',
                      color: 'var(--text-secondary)',
                      maxWidth: '520px'
                    }}>
                      {locale === 'vi'
                        ? 'Gia nhập mạng lưới lập trình viên hàng đầu của Vertex. Nhận đánh giá năng lực 4 lớp chuyên sâu và kết nối với các nhà tuyển dụng toàn cầu.'
                        : 'Join Vertex\'s network of elite software developers. Get assessed across our 4-layer validation flow and matched directly with top employers.'}
                    </p>
                  </>
                )}
              </div>

              {/* CARD DETAILS: EMAIL & HEADQUARTERS */}
              <div className="card" style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                boxShadow: 'var(--shadow-sm)'
              }}>
                
                {/* Email row */}
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: 'rgba(249, 115, 22, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Mail size={20} style={{ color: '#f97316' }} />
                  </div>
                  <div>
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: 700, 
                      letterSpacing: '0.08em', 
                      color: 'var(--text-muted)', 
                      display: 'block', 
                      marginBottom: '4px',
                      textTransform: 'uppercase'
                    }}>
                      {locale === 'vi' ? 'EMAIL HỖ TRỢ' : 'EMAIL SUPPORT'}
                    </span>
                    <a 
                      href="mailto:truongchitrung05@gmail.com" 
                      style={{ 
                        fontSize: '17px', 
                        fontWeight: 700, 
                        color: 'var(--text-primary)',
                        textDecoration: 'none'
                      }}
                    >
                      truongchitrung05@gmail.com
                    </a>
                  </div>
                </div>

                {/* Headquarters row */}
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: 'rgba(249, 115, 22, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <MapPin size={20} style={{ color: '#f97316' }} />
                  </div>
                  <div>
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: 700, 
                      letterSpacing: '0.08em', 
                      color: 'var(--text-muted)', 
                      display: 'block', 
                      marginBottom: '4px',
                      textTransform: 'uppercase'
                    }}>
                      {locale === 'vi' ? 'TRỤ SỞ CHÍNH' : 'HEADQUARTERS'}
                    </span>
                    <span style={{ 
                      fontSize: '15px', 
                      fontWeight: 700, 
                      color: 'var(--text-primary)',
                      lineHeight: '1.5'
                    }}>
                      {locale === 'vi' 
                        ? 'Nhà văn hóa Sinh viên ĐHQG TP.HCM, Số 1 Lưu Hữu Phước, Đông Hòa, Dĩ An, Thành phố Hồ Chí Minh' 
                        : 'Student Cultural House of VNU-HCMC No. 1 Luu Huu Phuoc, Dong Hoa, Di An, Ho Chi Minh City'}
                    </span>
                  </div>
                </div>

              </div>

              {/* MAP PREVIEW PLACEHOLDER */}
              <div style={{
                height: '180px',
                background: theme === 'dark' ? '#172036' : '#e2e8f0',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '12px',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)'
              }}>
                <MapPin size={28} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '14px', fontWeight: 600 }}>
                  {locale === 'vi' ? 'Xem Bản Đồ' : 'Map Preview'}
                </span>
              </div>

              {/* FOLLOW US */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  {locale === 'vi' ? 'Theo dõi chúng tôi:' : 'Follow us:'}
                </span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" style={socialIconStyle}>
                    <Share2 size={16} />
                  </button>
                  <button type="button" style={socialIconStyle}>
                    <Users size={16} />
                  </button>
                  <button type="button" style={socialIconStyle}>
                    <Radio size={16} />
                  </button>
                </div>
              </div>

            </div>

            {/* RIGHT SIDE: MESSAGE CONTACT FORM CARD */}
            <div className="card animate-fade-in-right" style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              padding: '44px 40px',
              boxShadow: theme === 'dark' ? '0 20px 40px rgba(0, 0, 0, 0.3)' : '0 20px 40px rgba(0, 0, 0, 0.04)'
            }}>
              
              {/* TOGGLE SWITCH TO SWITCH BETWEEN EMPLOYER AND DEV FORM */}
              <div style={{
                display: 'flex',
                background: theme === 'dark' ? '#172036' : '#f1f5f9',
                padding: '4px',
                borderRadius: '10px',
                marginBottom: '28px',
                border: '1px solid var(--border)'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveRole('employer');
                    setSuccess(false);
                  }}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: activeRole === 'employer' ? '#f97316' : 'transparent',
                    color: activeRole === 'employer' ? '#ffffff' : 'var(--text-secondary)',
                    transition: 'all 0.2s ease',
                    boxShadow: activeRole === 'employer' ? '0 2px 6px rgba(249, 115, 22, 0.3)' : 'none'
                  }}
                >
                  {locale === 'vi' ? 'Nhà tuyển dụng' : 'Employer'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveRole('developer');
                    setSuccess(false);
                  }}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: activeRole === 'developer' ? '#f97316' : 'transparent',
                    color: activeRole === 'developer' ? '#ffffff' : 'var(--text-secondary)',
                    transition: 'all 0.2s ease',
                    boxShadow: activeRole === 'developer' ? '0 2px 6px rgba(249, 115, 22, 0.3)' : 'none'
                  }}
                >
                  {locale === 'vi' ? 'Lập trình viên / Dev' : 'Developer / Dev'}
                </button>
              </div>

              <h3 style={{
                fontSize: '24px',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: '28px'
              }}>
                {activeRole === 'employer'
                  ? (locale === 'vi' ? 'Gửi tin nhắn cho chúng tôi' : 'Send us a message')
                  : (locale === 'vi' ? 'Gửi hồ sơ ứng tuyển' : 'Submit your profile')}
              </h3>

              {success ? (
                <div style={{
                  background: 'var(--success-bg)',
                  border: '1px solid var(--success)',
                  color: 'var(--success)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center',
                  fontSize: '14.5px',
                  lineHeight: 1.5
                }}>
                  <CheckCircle size={28} style={{ margin: '0 auto 10px auto', display: 'block' }} />
                  {activeRole === 'employer' ? t.successStartup : t.successDev}
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Row: Name and Email */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={labelStyle}>{t.formName}</label>
                      <input 
                        type="text" 
                        required
                        placeholder={t.formNamePlh}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        style={inputStyle(theme)}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={labelStyle}>
                        {activeRole === 'employer' ? t.formEmail : (locale === 'vi' ? 'ĐỊA CHỈ EMAIL *' : 'EMAIL ADDRESS *')}
                      </label>
                      <input 
                        type="email" 
                        required
                        placeholder={t.formEmailPlh}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle(theme)}
                      />
                    </div>
                  </div>

                  {/* Fields for Employer */}
                  {activeRole === 'employer' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={labelStyle}>{t.formCompany}</label>
                      <input 
                        type="text"
                        placeholder={t.formCompanyPlh}
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        style={inputStyle(theme)}
                      />
                    </div>
                  )}

                  {/* Fields for Developer */}
                  {activeRole === 'developer' && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '20px'
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={labelStyle}>{t.formPhone}</label>
                        <input 
                          type="text" 
                          required
                          placeholder={t.formPhonePlh}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          style={inputStyle(theme)}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={labelStyle}>{t.formSpec}</label>
                        <input 
                          type="text" 
                          required
                          placeholder={t.formSpecPlh}
                          value={specialty}
                          onChange={(e) => setSpecialty(e.target.value)}
                          style={inputStyle(theme)}
                        />
                      </div>
                    </div>
                  )}

                  {/* How can we help / Intro textarea */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={labelStyle}>
                      {activeRole === 'employer' ? t.formContentStartup : t.formContentDev}
                    </label>
                    <textarea 
                      rows={5}
                      required
                      placeholder={activeRole === 'employer' ? t.formContentStartupPlh : t.formContentDevPlh}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      style={{
                        ...inputStyle(theme),
                        resize: 'none',
                        height: 'auto',
                        padding: '14px 16px'
                      }}
                    />
                  </div>

                  {/* Button Submit */}
                  <button 
                    type="submit" 
                    disabled={isSending}
                    style={{
                      background: '#f97316',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '14px',
                      fontSize: '15px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      marginTop: '10px',
                      transition: 'background 0.2s ease',
                      width: '100%'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#ea580c')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#f97316')}
                  >
                    {isSending ? t.formBtnSending : t.formBtnSubmit}
                  </button>

                  {/* Disclaimer Footer */}
                  <p style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    textAlign: 'center',
                    lineHeight: 1.5,
                    marginTop: '8px'
                  }}>
                    {locale === 'vi' ? (
                      <>
                        Bằng việc gửi thông tin, bạn đồng ý với{' '}
                        <a href="#" style={{ textDecoration: 'underline' }}>Chính sách Bảo mật</a> và{' '}
                        <a href="#" style={{ textDecoration: 'underline' }}>Điều khoản Dịch vụ</a> của chúng tôi.
                      </>
                    ) : (
                      <>
                        By submitting information, you agree to our{' '}
                        <a href="#" style={{ textDecoration: 'underline' }}>Privacy Policy</a> and{' '}
                        <a href="#" style={{ textDecoration: 'underline' }}>Terms of Service</a>.
                      </>
                    )}
                  </p>

                </form>
              )}
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

// Styled helper components/styles
const socialIconStyle: React.CSSProperties = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  background: '#1e293b',
  color: '#ffffff',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'transform 0.2s ease'
};

const labelStyle: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 800,
  letterSpacing: '0.08em',
  color: 'var(--text-secondary)'
};

const inputStyle = (theme: 'light' | 'dark'): React.CSSProperties => ({
  background: theme === 'dark' ? '#172036' : '#f8fafc',
  border: 'none',
  borderRadius: '8px',
  padding: '12px 16px',
  color: 'var(--text-primary)',
  fontSize: '14px',
  fontFamily: 'inherit',
  width: '100%',
  outline: 'none',
  transition: 'box-shadow 0.2s ease'
});
