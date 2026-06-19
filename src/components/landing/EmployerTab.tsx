'use client';

import React from 'react';
import { ArrowRight, ShieldCheck, Award, Layers, CheckCircle } from 'lucide-react';
import { translations, Locale } from '@/utils/translations';
import HeroSection from './HeroSection';

interface EmployerTabProps {
  locale: Locale;
  theme: 'light' | 'dark';
  onSelectTab: (tab: string) => void;
}

export default function EmployerTab({ locale, theme, onSelectTab }: EmployerTabProps) {
  const t = translations[locale];

  // Helper for rendering icons in commitments cards
  const getCommitmentIcon = (index: number) => {
    const iconStyle = { size: 24, style: { color: '#FF7D33', flexShrink: 0 } };
    switch (index) {
      case 0:
        return <Award {...iconStyle} />;
      case 1:
        return <ShieldCheck {...iconStyle} />;
      case 2:
        return <Layers {...iconStyle} />;
      default:
        return <Award {...iconStyle} />;
    }
  };

  const commitments = [
    { title: t.empCard1, desc: t.empCard1d },
    { title: t.empCard2, desc: t.empCard2d },
    { title: t.empCard3, desc: t.empCard3d },
  ];

  return (
    <div className="employer-tab-container" style={{ animation: 'fadeIn 0.25s ease' }}>
      
      {/* 1. HERO SECTION - FULL WIDTH SLIDESHOW BANNER */}
      <HeroSection
        theme={theme}
        tag={t.empTabBadge}
        title={t.empTabTitle}
        description={t.empTabSubtitle}
        actions={
          <button 
            type="button" 
            className="btn-solid-orange" 
            style={{ padding: '14px 32px', fontSize: '15.5px' }}
            onClick={() => onSelectTab('contact')}
          >
            {locale === 'vi' ? 'Liên Hệ Báo Giá' : 'Request a Quote'}
            <ArrowRight size={16} />
          </button>
        }
      />

      {/* 2. COMMITMENTS SECTION */}
      <section style={{ padding: '80px 0', background: 'var(--background)' }}>
        <div className="container">
          <div className="section-header-center" style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 className="section-title-large" style={{ fontSize: '32px', marginBottom: '16px' }}>
              {locale === 'vi' ? 'Cam Kết Chất Lượng Dịch Vụ' : 'Service Quality Commitments'}
            </h2>
            <p className="section-subtitle-large" style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              {locale === 'vi' 
                ? 'Vertex thiết lập tiêu chuẩn vận hành cấp doanh nghiệp lớn nhằm bảo vệ tối đa quyền lợi khách hàng.' 
                : 'Vertex establishes enterprise-grade operations standards to maximize client protection.'}
            </p>
          </div>

          <div className="animate-fade-in-up" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '28px'
          }}>
            {commitments.map((item, idx) => {
              const delayClass = idx === 0 ? 'delay-100' : idx === 1 ? 'delay-200' : idx === 2 ? 'delay-300' : '';
              return (
                <div 
                  key={idx} 
                  className={`challenge-card-modern animate-fade-in-up ${delayClass}`}
                  style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  transition: 'all 0.25s ease',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  background: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {getCommitmentIcon(idx)}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
        </div>
      </section>

      {/* 3. VETTING & PROCESS DETAILS */}
      <section style={{ padding: '80px 0', background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '48px', alignItems: 'center' }}>
            <div className="animate-fade-in-left">
              <span className="badge" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', marginBottom: '16px' }}>
                {locale === 'vi' ? 'TIÊU CHUẨN KHẢO SÁT' : 'SCREENING STANDARDS'}
              </span>
              <h2 style={{ fontSize: '32px', marginBottom: '20px', lineHeight: 1.3 }}>
                {t.empSection1Title}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15.5px', lineHeight: 1.6, marginBottom: '20px' }}>
                {t.empSection1Desc}
              </p>
              <button 
                type="button"
                className="btn-solid-orange"
                style={{ padding: '12px 28px', fontSize: '14px' }}
                onClick={() => onSelectTab('contact')}
              >
                {locale === 'vi' ? 'Nhận Tư Vấn Tiêu Chuẩn' : 'Get Standards Consultation'}
              </button>
            </div>

            <div className="animate-fade-in-right" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {t.empSection1List.map((item, idx) => {
                const delayClass = idx === 0 ? 'delay-100' : idx === 1 ? 'delay-200' : idx === 2 ? 'delay-300' : idx === 3 ? 'delay-400' : '';
                return (
                  <div key={idx} className={`card animate-fade-in-up ${delayClass}`} style={{ display: 'flex', gap: '16px', padding: '20px', alignItems: 'flex-start', background: 'var(--background)' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(249, 115, 22, 0.1)',
                    color: '#f97316',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    flexShrink: 0,
                    fontSize: '13px'
                  }}>
                    {idx + 1}
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5, fontWeight: 500 }}>{item}</p>
                  </div>
                </div>
              );
            })}
          </div>
          </div>
        </div>
      </section>

      {/* 4. HR & OPERATIONS SUPPORT */}
      <section style={{ padding: '80px 0', background: 'var(--background)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '48px', alignItems: 'center' }}>
            <div className="animate-fade-in-left" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {t.empSection2List.map((item, idx) => {
                const delayClass = idx === 0 ? 'delay-100' : idx === 1 ? 'delay-200' : idx === 2 ? 'delay-300' : '';
                return (
                  <div key={idx} className={`card animate-fade-in-up ${delayClass}`} style={{ display: 'flex', gap: '12px', padding: '20px', alignItems: 'center', background: 'var(--surface)' }}>
                    <CheckCircle size={20} style={{ color: 'var(--success)', flexShrink: 0 }} />
                    <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.4 }}>{item}</p>
                  </div>
                );
              })}
            </div>

            <div className="animate-fade-in-right">
              <span className="badge" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)', marginBottom: '16px' }}>
                {locale === 'vi' ? 'HỖ TRỢ VẬN HÀNH' : 'OPERATIONAL SUPPORT'}
              </span>
              <h2 style={{ fontSize: '32px', marginBottom: '20px', lineHeight: 1.3 }}>
                {t.empSection2Title}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15.5px', lineHeight: 1.6 }}>
                {locale === 'vi' 
                  ? 'Chúng tôi giải phóng doanh nghiệp hoàn toàn khỏi các thủ tục hành chính phức tạp tại Việt Nam, từ hợp đồng pháp lý đến quản trị thiết bị phần cứng bảo mật.'
                  : 'We completely free businesses from complex administrative procedures in Vietnam, from legal contracts to security hardware device administration.'}
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
