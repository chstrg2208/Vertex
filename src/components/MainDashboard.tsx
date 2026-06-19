'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, LogOut, Sun, Moon } from 'lucide-react';
import OverviewTab from './landing/OverviewTab';
import DeveloperTab from './landing/DeveloperTab';
import EmployerTab from './landing/EmployerTab';
import ContactTab from './landing/ContactTab';
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
  const [activePublicTab, setActivePublicTab] = useState<string>('overview');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark'); // Set default theme to dark for premium aesthetic
  const [locale, setLocale] = useState<Locale>('vi');

  // Recruiter Chat states inside Portal
  const [activeChatContactName, setActiveChatContactName] = useState<string | null>(null);

  // Initialize theme and locale
  useEffect(() => {
    // Default to dark mode for the premium nocturnal aesthetic
    const savedTheme = localStorage.getItem('theme') || 'dark';
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
    setActivePublicTab('overview');
  };

  const handleOpenChatFromATS = (contactName: string) => {
    setActiveChatContactName(contactName);
  };

  const onGetStartedClick = () => {
    setActivePublicTab('contact');
    setTimeout(() => {
      const formEl = document.getElementById('contact-split-section');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  const t = translations[locale];

  return (
    <div className="layout-wrapper">
      {/* Dynamic Header Navbar */}
      <header className="header-glass">
        <div className="container nav-container">
          
          {/* Logo */}
          <div className="logo" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => setActivePublicTab('overview')}>
            <img src="/logo.png" alt="Vertex Logo" style={{ height: '28px', width: 'auto', display: 'block' }} />
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
              /* Public Nav Links (Overview, Developers, Employers, Contact) */
              <ul className="nav-links" style={{ gap: '0' }}>
                <li>
                  <button
                    type="button"
                    className={`nav-tab-modern ${activePublicTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActivePublicTab('overview')}
                  >
                    {t.overview}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={`nav-tab-modern ${activePublicTab === 'developer' ? 'active' : ''}`}
                    onClick={() => setActivePublicTab('developer')}
                  >
                    {locale === 'vi' ? 'Lập trình viên' : 'Developers'}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={`nav-tab-modern ${activePublicTab === 'employer' ? 'active' : ''}`}
                    onClick={() => setActivePublicTab('employer')}
                  >
                    {locale === 'vi' ? 'Nhà tuyển dụng' : 'Employers'}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={`nav-tab-modern ${activePublicTab === 'contact' ? 'active' : ''}`}
                    onClick={() => setActivePublicTab('contact')}
                  >
                    {locale === 'vi' ? 'Liên hệ' : 'Contact'}
                  </button>
                </li>
              </ul>
            )}
          </nav>

          {/* User controls (Login/Logout & Theme) */}
          <div className="controls-container" style={{ gap: '12px' }}>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-outline-login"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  {t.login}
                </button>
                <button
                  type="button"
                  className="btn-solid-orange"
                  style={{ padding: '8px 18px', fontSize: '13.5px', height: '38px', borderRadius: '4px', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}
                  onClick={onGetStartedClick}
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Language Switcher */}
            <button
              type="button"
              className="theme-toggle-btn"
              style={{
                fontWeight: 'bold',
                fontSize: '11px',
                padding: '0 6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '50px',
                height: '38px',
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
              style={{ height: '38px', width: '38px' }}
              onClick={toggleTheme}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Pages Content */}
      <main className="page-container" style={{ padding: '0 0 60px 0' }}>
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
            {activePublicTab === 'overview' && (
              <OverviewTab
                onOpenLogin={() => setIsLoginModalOpen(true)}
                onSelectTab={setActivePublicTab}
                locale={locale}
                theme={theme}
              />
            )}

            {activePublicTab === 'developer' && (
              <DeveloperTab
                initialJobs={initialJobs}
                locale={locale}
                theme={theme}
                onSelectTab={setActivePublicTab}
              />
            )}

            {activePublicTab === 'employer' && (
              <EmployerTab
                locale={locale}
                theme={theme}
                onSelectTab={setActivePublicTab}
              />
            )}

            {activePublicTab === 'contact' && (
              <ContactTab
                locale={locale}
                theme={theme}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer" style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)', padding: '48px 0 32px 0' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div className="footer-top-layout" style={{ display: 'grid', gridTemplateColumns: '1.2fr repeat(3, 1fr)', gap: '40px', textAlign: 'left' }}>
            {/* Branding Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src="/logo.png" alt="Vertex Logo" style={{ height: '24px', width: 'auto', display: 'block' }} />
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: '240px' }}>
                {t.footerSlogan}
              </p>
            </div>

            {/* Legal Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Legal
              </h4>
              <a href="#" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Privacy Policy</a>
              <a href="#" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Terms of Service</a>
              <a href="#" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Cookie Policy</a>
            </div>

            {/* Navigation Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Navigation
              </h4>
              <a href="#" onClick={() => setActivePublicTab('overview')} style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Sitemap</a>
            </div>

            {/* Support Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Support
              </h4>
              <a href="#" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Contact Support</a>
            </div>
          </div>

          {/* Bottom Divider & copyright */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span>{t.footerCopyright}</span>
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
