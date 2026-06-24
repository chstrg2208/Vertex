'use client';

import React, { useState, useEffect } from 'react';
import { Shield, X, Key, User, Eye, EyeOff } from 'lucide-react';
import { translations, Locale } from '@/utils/translations';
import { authenticateAccount } from '@/app/actions';

interface FaceIDLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userName: string, role: 'ta' | 'ba' | 'admin') => void;
  locale: Locale;
}

export default function FaceIDLogin({ isOpen, onClose, onLoginSuccess, locale }: FaceIDLoginProps) {
  const t = translations[locale];

  // Manual input credentials
  const [email, setEmail] = useState('admin@vertex.vn');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Smooth opening and closing animation states
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => setIsAnimating(true), 15);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Lock body scroll when modal is active to prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg(t.faceIdErrMissing);
      return;
    }

    const result = await authenticateAccount(email, password);
    if (result.success && result.user) {
      onLoginSuccess(result.user.name, result.user.role as any);
      onClose();
    } else {
      setErrorMsg(result.error || t.faceIdErrWrong);
    }
  };

  if (!shouldRender) return null;

  return (
    <div className={`login-modal-backdrop ${isAnimating ? 'active' : ''}`} onClick={onClose}>
      <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>

        {/* Left Side: Branding & Visual Showcase (60% Width, hidden on mobile) */}
        <div className="login-visual-showcase">
          <video
            src="/loginVideo1.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="login-video"
          />
          <div className="visual-nodes-container">
            <div className="glowing-orb orb-1"></div>
            <div className="glowing-orb orb-2"></div>
            <div className="glowing-orb orb-3"></div>
            <div className="grid-overlay"></div>
          </div>

          <div className="branding-text-block absolute left-12 bottom-12 max-w-lg z-10 text-left">
            <div className="branding-badge text-orange-500 font-extrabold text-[10px] tracking-[0.18em] uppercase mb-3">VERTEX INTELLECTUAL PIPELINE</div>
            <h1 className="branding-heading text-white text-3.5xl lg:text-4xl font-bold leading-snug mb-4 tracking-tight">Empowering Enterprise Tech Staffing</h1>
            <p className="branding-desc text-slate-400 text-sm leading-relaxed">
              Accelerate your software engineering scaling. We source, screen, and deploy top 3% vetted IT talents directly into your product workflows with zero overhead.
            </p>
          </div>
        </div>

        {/* Right Side: Interactive Login Panel (40% Width / 460px fixed width, full screen on mobile) */}
        <div className="login-panel">

          {/* Close button at top right of the panel */}
          <button type="button" className="login-close-btn-absolute" onClick={onClose}>
            <X size={20} />
          </button>

          <div className="login-form-wrapper min-h-full flex flex-col justify-center px-10 lg:px-16 py-8">
            <div className="login-form-container">
              {/* Header */}
              <div className="stagger-item stagger-1" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FF7D33', fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>
                <Shield size={20} />
                <span style={{ letterSpacing: '-0.3px' }}>{t.faceIdHeader}</span>
              </div>

              <div className="stagger-item stagger-2" style={{ marginBottom: '8px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', margin: 0 }}>{t.faceIdWelcome}</h2>
                <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '6px' }}>
                  {t.faceIdWelcomeSub}
                </p>
              </div>

              <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {errorMsg && (
                  <div className="stagger-item stagger-3" style={{
                    backgroundColor: 'var(--danger-bg)',
                    border: '1px solid var(--danger)',
                    color: 'var(--danger)',
                    fontSize: '12px',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center'
                  }}>
                    {errorMsg}
                  </div>
                )}

                <div className="form-group stagger-item stagger-3">
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>{t.faceIdManualLabel}</label>
                  <div className="input-with-icon">
                    <input
                      type="email"
                      required
                      placeholder={t.faceIdManualPlh}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <User size={16} className="left-icon" />
                  </div>

                  {/* Quick Testing Badges */}
                  <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Quick Login for Testing
                    </span>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className="demo-badge"
                        onClick={() => { setEmail('admin@vertex.vn'); setPassword('password'); }}
                      >
                        Demo Admin (admin@vertex.vn)
                      </button>
                      <button
                        type="button"
                        className="demo-badge"
                        onClick={() => { setEmail('ta@vertex.vn'); setPassword('password'); }}
                      >
                        Demo TA (ta@vertex.vn)
                      </button>
                      <button
                        type="button"
                        className="demo-badge"
                        onClick={() => { setEmail('ba@vertex.vn'); setPassword('password'); }}
                      >
                        Demo BA (ba@vertex.vn)
                      </button>
                    </div>
                  </div>
                </div>

                <div className="form-group stagger-item stagger-4" style={{ marginBottom: '2px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ margin: 0, fontSize: '12.5px', fontWeight: 600, color: '#94a3b8' }}>{t.faceIdPassLabel}</label>
                    <a href="#" style={{ fontSize: '11px', color: '#FF7D33', fontWeight: 600 }}>{t.faceIdForget}</a>
                  </div>
                  <div className="input-with-icon">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder={t.faceIdPassPlh}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Key size={16} className="left-icon" />
                    <button
                      type="button"
                      className="right-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="stagger-item stagger-4" style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                  <input type="checkbox" id="remember-me" defaultChecked style={{ width: '15px', height: '15px', cursor: 'pointer', accentColor: '#FF7D33' }} />
                  <label htmlFor="remember-me" style={{ margin: 0, fontSize: '12.5px', cursor: 'pointer', color: '#94a3b8' }}>{t.faceIdRemember}</label>
                </div>

                <div className="stagger-item stagger-5">
                  <button
                    type="submit"
                    className="login-submit-btn"
                    style={{ marginTop: 0 }}
                  >
                    {t.faceIdBtnLogin}
                  </button>
                </div>


              </form>
            </div>
          </div>

        </div>

      </div>

      {/* Global style injection for custom modal CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
        /* Custom premium login modal styles */
        .login-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(8, 12, 20, 0);
          backdrop-filter: blur(0px);
          -webkit-backdrop-filter: blur(0px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.35s ease-in-out, backdrop-filter 0.35s ease-in-out, -webkit-backdrop-filter 0.35s ease-in-out;
          pointer-events: none;
        }

        .login-modal-backdrop.active {
          background: rgba(8, 12, 20, 0.65);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          pointer-events: auto;
        }

        .login-modal-content {
          background: #0B0F19 !important;
          width: 100%;
          height: 100%;
          max-width: 100% !important;
          border-radius: 0px !important;
          box-shadow: none !important;
          display: flex;
          overflow: hidden;
          position: relative;
          transform: translateY(100%);
          opacity: 0;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease-in-out;
          will-change: transform, opacity;
        }

        .login-modal-backdrop.active .login-modal-content {
          transform: translateY(0);
          opacity: 1;
        }

        /* Split screen structure */
        .login-visual-showcase {
          flex: 1;
          height: 100%;
          background: #070A12;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }

        .login-panel {
          width: 460px;
          flex-shrink: 0;
          height: 100%;
          background: #0B0F19;
          position: relative;
          border-left: 1px solid rgba(255, 255, 255, 0.06);
          z-index: 5;
          overflow-y: auto;
        }

        .login-form-wrapper {
          min-height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 32px 40px; /* py-8 (32px) and px-10 (40px) */
          box-sizing: border-box;
          width: 100%;
        }

        @media (min-width: 1024px) {
          .login-form-wrapper {
            padding-left: 64px; /* lg:px-16 */
            padding-right: 64px;
          }
        }

        @media (max-width: 900px) {
          .login-visual-showcase {
            display: none !important;
          }
          .login-panel {
            width: 100% !important;
            border-left: none !important;
          }
        }

        /* Close button absolute positioning */
        .login-close-btn-absolute {
          position: absolute;
          top: 24px;
          right: 24px;
          transition: all 0.2s ease;
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        .login-close-btn-absolute:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #ffffff;
        }

        .login-form-container {
          width: 100%;
          max-width: 360px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* Staggered load items animation */
        .stagger-item {
          opacity: 0;
          transform: translateY(12px);
        }

        .login-modal-backdrop.active .stagger-item {
          animation: fadeUpStagger 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .login-modal-backdrop.active .stagger-1 { animation-delay: 0.12s; }
        .login-modal-backdrop.active .stagger-2 { animation-delay: 0.20s; }
        .login-modal-backdrop.active .stagger-3 { animation-delay: 0.28s; }
        .login-modal-backdrop.active .stagger-4 { animation-delay: 0.36s; }
        .login-modal-backdrop.active .stagger-5 { animation-delay: 0.44s; }
        .login-modal-backdrop.active .stagger-6 { animation-delay: 0.52s; }

        @keyframes fadeUpStagger {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .login-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
          opacity: 0.5;
          pointer-events: none;
        }

        /* Floating particles visual container on the left */
        .visual-nodes-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 1;
        }
        
        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.008) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.008) 1px, transparent 1px);
          background-size: 50px 50px;
          z-index: 2;
        }
        
        .glowing-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.12;
          z-index: 1;
          animation: floatAmbient 16s infinite ease-in-out;
        }
        
        .orb-1 {
          width: 320px;
          height: 320px;
          background: #FF7D33;
          top: 15%;
          left: 15%;
        }
        
        .orb-2 {
          width: 440px;
          height: 440px;
          background: #4f46e5;
          bottom: 12%;
          right: 12%;
          animation-delay: -5s;
        }
        
        .orb-3 {
          width: 260px;
          height: 260px;
          background: #0ea5e9;
          top: 50%;
          left: 45%;
          animation-delay: -10s;
        }
        
        @keyframes floatAmbient {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(40px, -60px) scale(1.1);
          }
          66% {
            transform: translate(-40px, 40px) scale(0.9);
          }
        }

        /* Branding card overlay text */
        .branding-text-block {
          position: absolute;
          bottom: 48px; /* bottom-12 (48px) */
          left: 48px; /* left-12 (48px) */
          z-index: 3;
          max-width: 512px; /* max-w-lg (512px) */
          opacity: 0;
          transform: translateY(15px);
        }

        .login-modal-backdrop.active .branding-text-block {
          animation: brandingFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.25s forwards;
        }

        @keyframes brandingFadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .branding-badge {
          font-size: 10px;
          font-weight: 800;
          color: #FF7D33;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 14px;
        }

        .branding-heading {
          font-family: var(--font-heading);
          font-size: 34px;
          font-weight: 700;
          line-height: 1.375; /* leading-snug */
          color: #ffffff;
          margin-bottom: 16px;
          letter-spacing: -0.01em;
        }

        .branding-desc {
          font-size: 14px;
          color: #94a3b8;
          line-height: 1.6;
          font-weight: 400;
        }

        /* Demo account badges */
        .demo-badge {
          font-size: 11px !important;
          font-weight: 600;
          background: #1e293b !important;
          border: 1px solid #334155 !important;
          color: #cbd5e1 !important;
          border-radius: var(--radius-md) !important;
          padding: 5px 12px !important;
          cursor: pointer;
          transition: all 0.2s ease !important;
          display: inline-flex;
          align-items: center;
        }

        .demo-badge:hover {
          border-color: #FF7D33 !important;
          color: #FF7D33 !important;
          background: rgba(255, 125, 51, 0.09) !important;
          transform: translateY(-1px);
        }

        .demo-badge:active {
          transform: translateY(0);
        }

        /* Premium Login Button */
        .login-submit-btn {
          width: 100%;
          padding: 12px !important;
          font-size: 14.5px !important;
          font-weight: 700 !important;
          background: linear-gradient(135deg, #FF7D33 0%, #ff9457 100%) !important;
          color: #080c14 !important;
          border: none !important;
          border-radius: var(--radius-md) !important;
          cursor: pointer !important;
          transition: all 0.25s ease !important;
          box-shadow: 0 4px 12px rgba(255, 125, 51, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 16px;
        }

        .login-submit-btn:hover {
          filter: brightness(1.1);
          transform: translateY(-1.5px);
          box-shadow: 0 6px 16px rgba(255, 125, 51, 0.35);
        }

        .login-submit-btn:active {
          transform: translateY(0);
        }

        /* Input layout styles */
        .input-with-icon {
          position: relative;
        }

        .input-with-icon input {
          width: 100%;
          background-color: #0f172a !important;
          border: 1px solid #1e293b !important;
          border-radius: var(--radius-md) !important;
          padding-left: 38px !important;
          padding-right: 38px !important;
          height: 44px;
          color: #ffffff !important;
          font-size: 14px;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .input-with-icon input:focus {
          outline: none;
          border-color: #FF7D33 !important;
          box-shadow: 0 0 0 3px rgba(255, 125, 51, 0.15) !important;
          background-color: #0c1220 !important;
        }

        .input-with-icon svg.left-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
          transition: color 0.2s;
        }

        .input-with-icon input:focus ~ svg.left-icon {
          color: #FF7D33;
        }

        .input-with-icon .right-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: color 0.2s;
        }

        .input-with-icon .right-btn:hover {
          color: #ffffff;
        }

        .login-divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 18px 0 14px 0;
          color: #64748b;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .login-divider::before,
        .login-divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid #1e293b;
        }

        .login-divider:not(:empty)::before {
          margin-right: .75em;
        }

        .login-divider:not(:empty)::after {
          margin-left: .75em;
        }

        .login-google-btn {
          width: 100%;
          padding: 12px !important;
          font-size: 14px !important;
          font-weight: 600 !important;
          background: #1e293b !important;
          border: 1px solid #334155 !important;
          color: #ffffff !important;
          border-radius: var(--radius-md) !important;
          cursor: pointer !important;
          transition: all 0.25s ease !important;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .login-google-btn:hover {
          background: #273549 !important;
          border-color: #475569 !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .login-google-btn:active {
          transform: translateY(0);
        }

        .google-icon {
          flex-shrink: 0;
        }
      `}} />
    </div>
  );
}
