'use client';

import React, { useState } from 'react';
import { Rocket, Folder, GraduationCap, ShieldAlert, CheckCircle } from 'lucide-react';
import { translations, Locale } from '@/utils/translations';

interface AboutTabProps {
  locale: Locale;
  onOpenLogin: () => void;
}

export default function AboutTab({ locale, onOpenLogin }: AboutTabProps) {
  const t = translations[locale];

  // Form states
  const [founderName, setFounderName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [technicalNeeds, setTechnicalNeeds] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!founderName || !projectName || !technicalNeeds) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Clear inputs
      setFounderName('');
      setProjectName('');
      setTechnicalNeeds('');
      setEstimatedBudget('');
      
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="about-container" style={{ animation: 'fadeIn 0.25s ease' }}>
      
      {/* 1. HERO SECTION */}
      <section className="about-hero">
        <div className="container hero-grid">
          
          {/* Left Column: Text */}
          <div className="hero-text-side">
            <h1 className="hero-title">
              {t.aboutHeading1} <br />
              <span className="text-gradient">{t.aboutHeading2}</span>
            </h1>
            <p className="hero-description">
              {t.aboutSubheading}
            </p>
          </div>

          {/* Right Column: Workstation/Server Image */}
          <div className="hero-img-side">
            <div className="hero-img-wrapper">
              <img 
                src="/about_hero_workstation.png" 
                alt="Vertex Workstation Setup" 
                className="hero-display-img"
              />
              <div className="hero-img-glow"></div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. MISSION GRID CARDS */}
      <section className="mission-grid-section">
        <div className="container mission-cards-layout">
          
          {/* Large Mission Card */}
          <div className="card-mission-large">
            <Rocket size={120} className="mission-bg-icon-rocket" />
            <span className="mission-badge">{t.missionLabel}</span>
            <h3 className="mission-title">{t.missionTitle}</h3>
            <p className="mission-desc">
              {t.missionDesc}
            </p>
          </div>

          {/* Right Column Stack of Cards */}
          <div className="mission-right-cards-stack">
            
            {/* Ambitious Founders */}
            <div className="card-small-accent">
              <div className="card-small-icon-box">
                <Folder size={18} style={{ color: '#FF7D33' }} />
              </div>
              <h4 className="card-small-title">{t.foundersTitle}</h4>
              <p className="card-small-desc">{t.foundersDesc}</p>
            </div>

            {/* Student Leaders */}
            <div className="card-small-accent">
              <div className="card-small-icon-box">
                <GraduationCap size={18} style={{ color: '#FF7D33' }} />
              </div>
              <h4 className="card-small-title">{t.studentsTitle}</h4>
              <p className="card-small-desc">{t.studentsDesc}</p>
            </div>

            {/* IP Security Guarantee (Horizontal card/block) */}
            <div className="card-horizontal-badge">
              <div className="badge-value-box">
                <span className="badge-bullet-orange"></span>
                <span className="badge-value-num">{t.ipGuaranteeValue}</span>
              </div>
              <div className="badge-label-txt">{t.ipGuaranteeLabel}</div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. ECOSYSTEM SECTION (The Perfect Bridge) */}
      <section className="ecosystem-bridge-section">
        <div className="container ecosystem-split-grid">
          
          {/* Left Column: Text & Features */}
          <div className="ecosystem-text-side">
            <span className="ecosystem-pill-tag">
              {t.ecosystemTag}
            </span>
            <h2 className="ecosystem-title">{t.bridgeHeading}</h2>
            <p className="ecosystem-desc">
              {t.bridgeDesc}
            </p>

            {/* IP Protection feature box */}
            <div className="ip-protection-feature-card">
              <div className="ip-header">
                <ShieldAlert size={18} style={{ color: '#FF7D33' }} />
                <h4 className="ip-title">{t.ipProtectionTitle}</h4>
              </div>
              <p className="ip-desc">{t.ipProtectionDesc}</p>
            </div>
          </div>

          {/* Right Column: Bridge Image */}
          <div className="ecosystem-img-side">
            <div className="ecosystem-img-wrapper">
              <img 
                src="/bridge_red_orange.png" 
                alt="The Perfect Bridge" 
                className="bridge-display-img"
              />
              <div className="bridge-img-glow"></div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. START BUILDING FORM SECTION */}
      <section className="start-building-section" id="start-building">
        <div className="container start-building-grid">
          
          {/* Left Side: Info */}
          <div className="start-building-info">
            <h2 className="section-title-large">{t.startBuildingTitle}</h2>
            <p className="section-subtitle-large">
              {t.startBuildingSub}
            </p>

            <div className="bullet-points-list">
              <div className="bullet-item-check">
                <CheckCircle size={18} className="orange-check-icon" />
                <div>
                  <h4 className="bullet-title">{t.accSourcingTitle}</h4>
                  <p className="bullet-desc">{t.accSourcingDesc}</p>
                </div>
              </div>

              <div className="bullet-item-check">
                <CheckCircle size={18} className="orange-check-icon" />
                <div>
                  <h4 className="bullet-title">{t.vettedExpTitle}</h4>
                  <p className="bullet-desc">{t.vettedExpDesc}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Interactive Inquiry Form */}
          <div className="start-building-form-wrapper">
            <div className="card-form-container">
              
              {isSuccess ? (
                <div className="form-success-banner">
                  <CheckCircle size={32} style={{ color: 'var(--success)', marginBottom: '12px' }} />
                  <p>{t.successStartup}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="inquiry-form">
                  
                  {/* Row: Founder Name & Project Name */}
                  <div className="form-row-grid">
                    <div className="form-input-group">
                      <label>{t.formFounderName}</label>
                      <input 
                        type="text" 
                        required
                        placeholder={t.formFounderPlh}
                        value={founderName}
                        onChange={(e) => setFounderName(e.target.value)}
                      />
                    </div>

                    <div className="form-input-group">
                      <label>{t.formProjectName}</label>
                      <input 
                        type="text" 
                        required
                        placeholder={t.formProjectPlh}
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Textarea: Technical Needs */}
                  <div className="form-input-group">
                    <label>{t.formTechnicalNeeds}</label>
                    <textarea 
                      rows={5}
                      required
                      placeholder={t.formTechnicalPlh}
                      value={technicalNeeds}
                      onChange={(e) => setTechnicalNeeds(e.target.value)}
                    />
                  </div>

                  {/* Select Dropdown: Budget */}
                  <div className="form-input-group">
                    <label>{t.formEstimatedBudget}</label>
                    <div className="custom-select-wrapper">
                      <select 
                        required
                        value={estimatedBudget}
                        onChange={(e) => setEstimatedBudget(e.target.value)}
                      >
                        <option value="" disabled hidden>{t.formEstimatedBudgetPlh}</option>
                        <option value="under_5k">{locale === 'vi' ? 'Dưới $5,000 / tháng' : 'Under $5,000 / month'}</option>
                        <option value="5k_10k">$5,000 - $10,000 / tháng</option>
                        <option value="10k_25k">$10,000 - $25,000 / tháng</option>
                        <option value="over_25k">{locale === 'vi' ? 'Trên $25,000 / tháng' : 'Over $25,000 / month'}</option>
                      </select>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    className="btn-solid-orange submit-form-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (locale === 'vi' ? 'Đang gửi...' : 'Submitting...') : t.btnSubmitRequest}
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
