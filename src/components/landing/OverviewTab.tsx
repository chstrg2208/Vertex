'use client';

import React from 'react';
import { Wallet, UserX, Sliders, Gauge, Scale, Target, ArrowRight } from 'lucide-react';
import { translations, Locale } from '@/utils/translations';
import HeroSection from './HeroSection';

interface OverviewTabProps {
  onOpenLogin: () => void;
  onSelectTab: (tab: string) => void;
  locale: Locale;
  theme: 'light' | 'dark';
}

export default function OverviewTab({ onOpenLogin, onSelectTab, locale, theme }: OverviewTabProps) {
  const t = translations[locale];

  // Helper for rendering icons in the challenges grid
  const getChallengeIcon = (index: number) => {
    const iconStyle = { color: '#FF7D33', size: 22 };
    switch (index) {
      case 0: return <Wallet {...iconStyle} />;
      case 1: return <UserX {...iconStyle} />;
      case 2: return <Sliders {...iconStyle} />;
      case 3: return <Gauge {...iconStyle} />;
      case 4: return <Scale {...iconStyle} />;
      case 5: return <Target {...iconStyle} />;
      default: return <Wallet {...iconStyle} />;
    }
  };

  const challenges = [
    { 
      title: t.cCard1Title, 
      desc: t.cCard1Desc, 
      metric: locale === 'vi' ? 'Tối ưu 60% chi phí' : 'Save up to 60%',
      span: 'span-2'
    },
    { 
      title: t.cCard2Title, 
      desc: t.cCard2Desc, 
      metric: locale === 'vi' ? '0% Ghosting' : '0% Ghosting Rate',
      span: 'span-1'
    },
    { 
      title: t.cCard3Title, 
      desc: t.cCard3Desc, 
      metric: locale === 'vi' ? 'Top 3% đạt chuẩn' : 'Top 3% Vetted Talent',
      span: 'span-1'
    },
    { 
      title: t.cCard4Title, 
      desc: t.cCard4Desc, 
      metric: locale === 'vi' ? 'Khớp trong 3-5 ngày' : '3-5 Days Matching',
      span: 'span-2'
    },
    { 
      title: t.cCard5Title, 
      desc: t.cCard5Desc, 
      metric: locale === 'vi' ? 'Bảo vệ IP 100%' : '100% IP Secure',
      span: 'span-2'
    },
    { 
      title: t.cCard6Title, 
      desc: t.cCard6Desc, 
      metric: locale === 'vi' ? 'Đội ngũ chuyên biệt' : 'Dedicated Team',
      span: 'span-1'
    }
  ];

  const vettingSteps = [
    { num: 1, title: t.vCard1Title, desc: t.vCard1Desc },
    { num: 2, title: t.vCard2Title, desc: t.vCard2Desc },
    { num: 3, title: t.vCard3Title, desc: t.vCard3Desc },
    { num: 4, title: t.vCard4Title, desc: t.vCard4Desc }
  ];

  return (
    <div className="overview-container" style={{ animation: 'fadeIn 0.25s ease' }}>

      {/* 1. HERO SECTION - FULL WIDTH SLIDESHOW BANNER */}
      <HeroSection
        theme={theme}
        tag={t.heroTag}
        title={
          <>
            {t.heroHeading1} <br />
            <span className="text-gradient">{t.heroHeading2}</span>
          </>
        }
        description={t.heroSubheadingNew}
        actions={
          <>
            <button
              type="button"
              className="btn-solid-orange"
              style={{ padding: '14px 32px', fontSize: '15.5px' }}
              onClick={() => onSelectTab('contact')}
            >
              {t.btnConsult}
              <ArrowRight size={16} />
            </button>
            <button
              type="button"
              className="btn-outline-ghost"
              style={{
                padding: '14px 32px',
                fontSize: '15.5px',
                color: theme === 'dark' ? '#ffffff' : '#0f172a',
                borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
              }}
              onClick={() => {
                const element = document.getElementById('vetting-section');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              {t.btnProcess}
            </button>
          </>
        }
      />

      {/* 2. CHALLENGES SECTION */}
      <section className="challenges-section">
        <div className="container">
          <div className="section-header-center">
            <h2 className="section-title-large">{t.challengeHeading}</h2>
            <p className="section-subtitle-large">
              {t.challengeSubheadingNew}
            </p>
          </div>

          <div className="challenges-bento-grid">
            {challenges.map((challenge, idx) => {
              const delayClass = idx === 0 ? 'delay-100' : idx === 1 ? 'delay-200' : idx === 2 ? 'delay-300' : idx === 3 ? 'delay-400' : idx === 4 ? 'delay-500' : '';
              return (
                <div key={idx} className={`challenge-card-modern ${challenge.span} animate-fade-in-up ${delayClass}`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '4px' }}>
                    <div className="challenge-icon-box">
                      {getChallengeIcon(idx)}
                    </div>
                    {challenge.metric && (
                      <span className="challenge-card-metric-badge">
                        {challenge.metric}
                      </span>
                    )}
                  </div>
                  <h3 className="challenge-card-title">{challenge.title}</h3>
                  <p className="challenge-card-desc">{challenge.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. VETTING SECTION */}
      <section className="vetting-section" id="vetting-section">
        <div className="container vetting-split-grid">

          {/* Left Column: Heading and info */}
          <div className="vetting-info-side animate-fade-in-left">
            <h2 className="vetting-title">{t.vettingHeadingNew}</h2>
            <p className="vetting-desc">
              {t.vettingSubheadingNew}
            </p>
            <a
              href="#contact"
              className="vetting-link"
              onClick={(e) => {
                e.preventDefault();
                onSelectTab('about');
              }}
            >
              {t.vettingLinkNew} <span className="arrow-glow">→</span>
            </a>
          </div>

          {/* Right Column: 4 cards grid */}
          <div className="vetting-cards-side animate-fade-in-right">
            <div className="vetting-grid-2x2">
              {vettingSteps.map((step) => {
                const delayClass = step.num === 1 ? 'delay-100' : step.num === 2 ? 'delay-200' : step.num === 3 ? 'delay-300' : step.num === 4 ? 'delay-400' : '';
                return (
                  <div key={step.num} className={`vetting-card-step animate-fade-in-up ${delayClass}`}>
                    <div className="step-number-badge">
                      {step.num}
                    </div>
                    <h3 className="step-card-title">{step.title}</h3>
                    <p className="step-card-desc">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* 4. READY TO OPTIMIZE SECTION */}
      <section className="ready-cta-section">
        <div className="ready-cta-glow-bg"></div>
        <div className="container ready-cta-content">
          <h2 className="ready-title">{t.readyHeadingNew}</h2>
          <p className="ready-subtitle">
            {t.readySubheadingNew}
          </p>
          <button
            type="button"
            className="btn-solid-orange cta-large-btn"
            onClick={() => onSelectTab('about')}
          >
            {t.btnGetStartedNow}
          </button>
        </div>
      </section>

    </div>
  );
}
