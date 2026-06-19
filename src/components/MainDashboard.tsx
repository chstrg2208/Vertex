'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, LogOut, Sun, Moon, Briefcase, FileText, Share2, HelpCircle, Users, CheckCircle, Award, ShieldCheck, AlertTriangle } from 'lucide-react';
import LandingPage from './landing/LandingPage';
import PortalWorkspace from './portal/PortalWorkspace';
import FaceIDLogin from './portal/FaceIDLogin';
import { translations, Locale } from '@/utils/translations';

interface MainDashboardProps {
  initialJobs: any[];
  initialCandidates: any[]; // List of all developers
  initialProfile: any; // First candidate profile Nguyễn Văn A
  initialApplications: any[];
  initialPosts: any[];
  initialMessages: any[];
}

export default function MainDashboard({
  initialJobs,
  initialCandidates,
  initialProfile,
  initialApplications,
  initialPosts,
  initialMessages,
}: MainDashboardProps) {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<{ name: string; role: 'ta' | 'ba' } | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Tab navigation state
  // Public tabs: 'home' | 'developer' | 'employer_public'
  const [activePublicTab, setActivePublicTab] = useState<string>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [locale, setLocale] = useState<Locale>('vi');

  // Recruiter Chat states inside Portal
  const [activeChatContactName, setActiveChatContactName] = useState<string | null>(null);

  // Initialize theme and locale
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme as 'light' | 'dark');
    document.documentElement.setAttribute('data-theme', savedTheme);

    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale === 'vi' || savedLocale === 'en') {
      setLocale(savedLocale);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const toggleLocale = () => {
    const nextLocale = locale === 'vi' ? 'en' : 'vi';
    setLocale(nextLocale);
    localStorage.setItem('locale', nextLocale);
  };

  const handleLoginSuccess = (userName: string, role: 'ta' | 'ba') => {
    setIsLoggedIn(true);
    setLoggedInUser({ name: userName, role });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInUser(null);
    setActivePublicTab('home');
  };

  const handleOpenChatFromATS = (contactName: string) => {
    setActiveChatContactName(contactName);
  };

  const t = translations[locale];

  return (
    <div className="layout-wrapper">
      {/* Dynamic Header Navbar */}
      <header className="header-glass">
        <div className="container nav-container">
          
          {/* Logo */}
          <div className="logo" style={{ cursor: 'pointer' }} onClick={() => setActivePublicTab('home')}>
            <Sparkles size={24} style={{ color: 'var(--primary)' }} />
            <span>Vertex</span>
            <span style={{ fontSize: '9px', background: 'var(--primary-light)', color: 'var(--primary)', padding: '1px 6px', borderRadius: '8px', fontWeight: 'bold' }}>
              PRO
            </span>
          </div>

          {/* Navigation Links */}
          <nav>
            {isLoggedIn && loggedInUser ? (
              /* Recruiter Portal Nav Header label */
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge" style={{ backgroundColor: 'var(--secondary-light)', color: 'var(--secondary)', fontWeight: 700 }}>
                  {loggedInUser.role === 'ta' ? t.roleTA : t.roleBA}
                </span>
              </div>
            ) : (
              /* Public Nav Links (Home, Developer, Nhà tuyển dụng) */
              <ul className="nav-links">
                <li>
                  <button
                    type="button"
                    className={`nav-tab ${activePublicTab === 'home' ? 'active' : ''}`}
                    onClick={() => setActivePublicTab('home')}
                  >
                    {t.home}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={`nav-tab ${activePublicTab === 'developer' ? 'active' : ''}`}
                    onClick={() => setActivePublicTab('developer')}
                  >
                    <Briefcase size={14} />
                    {t.developer}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={`nav-tab ${activePublicTab === 'employer_public' ? 'active' : ''}`}
                    onClick={() => setActivePublicTab('employer_public')}
                  >
                    <ShieldCheck size={14} />
                    {t.employer}
                  </button>
                </li>
              </ul>
            )}
          </nav>

          {/* User controls (Login/Logout & Theme) */}
          <div className="controls-container">
            {isLoggedIn && loggedInUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '13.5px', fontWeight: 700 }}>
                  👤 {loggedInUser.name}
                </span>
                <button
                  type="button"
                  className="role-btn"
                  style={{
                    backgroundColor: 'var(--danger-bg)',
                    color: 'var(--danger)',
                    border: '1px solid var(--danger)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px'
                  }}
                  onClick={handleLogout}
                >
                  <LogOut size={13} />
                  {t.logout}
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="apply-btn"
                style={{ flex: 'none', padding: '8px 18px', fontSize: '13.5px' }}
                onClick={() => setIsLoginModalOpen(true)}
              >
                {t.login}
              </button>
            )}

            {/* Language Switcher */}
            <button
              type="button"
              className="theme-toggle-btn"
              style={{
                fontWeight: 'bold',
                fontSize: '12px',
                padding: '0 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '56px',
                background: 'var(--surface-hover)',
                border: '1px solid var(--border)'
              }}
              onClick={toggleLocale}
            >
              {locale === 'vi' ? '🇺🇸 EN' : '🇻🇳 VI'}
            </button>

            <button
              type="button"
              className="theme-toggle-btn"
              onClick={toggleTheme}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Pages Content */}
      <main className="page-container">
        {isLoggedIn && loggedInUser ? (
          /* Recruiter Workspace unlocked */
          <PortalWorkspace
            candidates={initialCandidates}
            jobs={initialJobs}
            applications={initialApplications}
            messages={initialMessages}
            currentUser={{ name: loggedInUser.name, role: loggedInUser.role }}
            onOpenChat={handleOpenChatFromATS}
            activeChatContactName={activeChatContactName}
            onSelectChatContactName={setActiveChatContactName}
            locale={locale}
          />
        ) : (
          /* Public Candidate Tabs */
          <div className="tab-content">
            {/* Landing Page */}
            {activePublicTab === 'home' && (
              <LandingPage
                onOpenLogin={() => setIsLoginModalOpen(true)}
                onSelectTab={setActivePublicTab}
                jobsCount={initialJobs.length}
                talentsCount={initialCandidates.length}
                locale={locale}
              />
            )}

            {/* Developer Tab: Displays Client Job/Staffing Requests */}
            {activePublicTab === 'developer' && (
              <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <span className="badge" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', marginBottom: '12px' }}>
                    {t.devTabBadge}
                  </span>
                  <h2 style={{ fontSize: '28px' }}>{t.devTabTitle}</h2>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '14.5px' }}>
                    {t.devTabSubtitle}
                  </p>
                </div>

                <div className="jobs-grid">
                  {initialJobs.map((job) => (
                    <div key={job.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{job.title}</h3>
                        <span className="badge" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)', fontSize: '11px' }}>
                          {t.devClientTag}
                        </span>
                      </div>

                      <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {t.devCompanyLabel} {job.company}
                      </div>

                      <div className="job-details-meta" style={{ margin: '4px 0' }}>
                        <div className="meta-item">📍 {job.location}</div>
                        <div className="meta-item">💰 {job.salary}</div>
                      </div>

                      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, minHeight: '60px' }}>
                        {job.description}
                      </p>

                      <div className="job-tags" style={{ marginTop: 'auto', paddingTop: '10px' }}>
                        {job.tags.map((tag: string, idx: number) => (
                          <span key={idx} className="job-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Employer/Nhà Tuyển Dụng Tab: Displays Vertex Commitments */}
            {activePublicTab === 'employer_public' && (
              <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                <div style={{ textAlign: 'center' }}>
                  <span className="badge" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)', marginBottom: '12px' }}>
                    {t.empTabBadge}
                  </span>
                  <h2 style={{ fontSize: '28px' }}>{t.empTabTitle}</h2>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '14.5px', maxWidth: '700px', margin: '8px auto 0 auto' }}>
                    {t.empTabSubtitle}
                  </p>
                </div>

                {/* Grid 1: SLAs Commitments */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                  <div className="card" style={{ padding: '24px', borderTop: '4px solid #f97316' }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚡</div>
                    <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>{t.empCard1}</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {t.empCard1d}
                    </p>
                  </div>
                  <div className="card" style={{ padding: '24px', borderTop: '4px solid var(--primary)' }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔒</div>
                    <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>{t.empCard2}</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {t.empCard2d}
                    </p>
                  </div>
                  <div className="card" style={{ padding: '24px', borderTop: '4px solid var(--success)' }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>🛡️</div>
                    <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>{t.empCard3}</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {t.empCard3d}
                    </p>
                  </div>
                </div>

                {/* Grid 2: 4-layer vetting info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '48px', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>{t.empSection1Title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', lineHeight: 1.6, marginBottom: '16px' }}>
                      {t.empSection1Desc}
                    </p>
                    <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: 'var(--text-secondary)' }}>
                      {t.empSection1List.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="card" style={{ padding: '32px', background: 'var(--surface-hover)' }}>
                    <h4 style={{ fontSize: '16px', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                      {t.empSection2Title}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {t.empSection2List.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '8px' }}>
                          <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '2px' }} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p style={{ color: 'var(--text-muted)' }}>{t.footerText}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span>{t.footerItem1}</span>
            <span>•</span>
            <span>{t.footerItem2}</span>
            <span>•</span>
            <span>{t.footerItem3}</span>
          </div>
        </div>
      </footer>

      {/* Biometric FaceID Login Modal */}
      {isLoginModalOpen && (
        <FaceIDLogin
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          locale={locale}
        />
      )}
    </div>
  );
}
