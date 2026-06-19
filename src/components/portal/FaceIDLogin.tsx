'use client';

import React, { useState } from 'react';
import { Shield, X, Key, User, Eye, EyeOff } from 'lucide-react';
import { translations, Locale } from '@/utils/translations';

interface FaceIDLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userName: string, role: 'ta' | 'ba') => void;
  locale: Locale;
}

export default function FaceIDLogin({ isOpen, onClose, onLoginSuccess, locale }: FaceIDLoginProps) {
  const t = translations[locale];

  // Manual input credentials
  const [email, setEmail] = useState('ta@vertex.vn');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg(t.faceIdErrMissing);
      return;
    }

    if (email === 'ta@vertex.vn' && password === 'password') {
      onLoginSuccess('Hương (TA Staff)', 'ta');
      onClose();
    } else if (email === 'ba@vertex.vn' && password === 'password') {
      onLoginSuccess('Dũng (BA Manager)', 'ba');
      onClose();
    } else {
      setErrorMsg(t.faceIdErrWrong);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal-backdrop" onClick={onClose}>
      <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ borderBottom: 'none', padding: '16px 20px 8px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, fontSize: '18px' }}>
            <Shield size={20} />
            <span style={{ letterSpacing: '-0.3px' }}>{t.faceIdHeader}</span>
          </div>
          <button type="button" className="login-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '8px 24px 24px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800 }}>{t.faceIdWelcome}</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              {t.faceIdWelcomeSub}
            </p>
          </div>

          <form onSubmit={handleManualSubmit}>
            {errorMsg && (
              <div style={{
                backgroundColor: 'var(--danger-bg)',
                border: '1px solid var(--danger)',
                color: 'var(--danger)',
                fontSize: '12px',
                padding: '8px 12px',
                borderRadius: '6px',
                marginRight: 'auto',
                marginLeft: 'auto',
                width: '100%',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                {errorMsg}
              </div>
            )}

            <div className="form-group">
              <label style={{ marginBottom: '6px' }}>{t.faceIdManualLabel}</label>
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
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
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

            <div className="form-group" style={{ marginBottom: '8px', marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ marginBottom: 0 }}>{t.faceIdPassLabel}</label>
                <a href="#" style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>{t.faceIdForget}</a>
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

            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', alignItems: 'center', marginTop: '12px' }}>
              <input type="checkbox" id="remember-me" defaultChecked style={{ width: '15px', height: '15px', cursor: 'pointer', accentColor: 'var(--primary)' }} />
              <label htmlFor="remember-me" style={{ margin: 0, fontSize: '12.5px', cursor: 'pointer', color: 'var(--text-secondary)' }}>{t.faceIdRemember}</label>
            </div>

            <button
              type="submit"
              className="login-submit-btn"
            >
              <Shield size={16} />
              {t.faceIdBtnLogin}
            </button>
          </form>
        </div>

        {/* Global style injection for custom modal CSS */}
        <style dangerouslySetInnerHTML={{__html: `
          /* Custom premium login modal styles */
          .login-modal-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(10, 15, 30, 0.7);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: modalFadeIn 0.3s ease;
          }

          .login-modal-content {
            background: var(--surface);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: var(--radius-lg);
            box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 50px -10px rgba(79, 70, 229, 0.15);
            width: 100%;
            max-width: 440px;
            overflow: hidden;
            position: relative;
            transition: all 0.3s ease;
            animation: modalScaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }

          @keyframes modalFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes modalScaleUp {
            from { transform: scale(0.95) translateY(10px); opacity: 0; }
            to { transform: scale(1) translateY(0); opacity: 1; }
          }

          /* Demo account badges */
          .demo-badge {
            font-size: 11px !important;
            font-weight: 600;
            background: var(--background);
            border: 1px solid var(--border) !important;
            color: var(--text-secondary);
            border-radius: 20px !important;
            padding: 4px 10px !important;
            cursor: pointer;
            transition: all 0.2s ease !important;
            display: inline-flex;
            align-items: center;
          }

          .demo-badge:hover {
            border-color: var(--primary) !important;
            color: var(--primary) !important;
            background: var(--primary-light) !important;
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
            background: linear-gradient(135deg, var(--primary) 0%, #6366f1 100%) !important;
            color: white !important;
            border: none !important;
            border-radius: var(--radius-sm) !important;
            cursor: pointer !important;
            transition: all 0.25s ease !important;
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-top: 16px;
          }

          .login-submit-btn:hover {
            filter: brightness(1.1);
            transform: translateY(-1.5px);
            box-shadow: 0 6px 16px rgba(79, 70, 229, 0.35);
          }

          .login-submit-btn:active {
            transform: translateY(0);
          }

          /* Close button hover */
          .login-close-btn {
            transition: all 0.2s ease;
            background: transparent;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            padding: 6px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .login-close-btn:hover {
            background: var(--surface-hover);
            color: var(--text-primary);
          }

          /* Input layout icons adjustment */
          .input-with-icon {
            position: relative;
          }

          .input-with-icon input {
            padding-left: 38px !important;
            height: 42px;
          }

          .input-with-icon svg.left-icon {
            position: absolute;
            left: 12px;
            top: 13px;
            color: var(--text-muted);
            pointer-events: none;
            transition: color 0.2s;
          }

          .input-with-icon input:focus ~ svg.left-icon {
            color: var(--primary);
          }

          .input-with-icon .right-btn {
            position: absolute;
            right: 12px;
            top: 13px;
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
            color: var(--text-primary);
          }
        `}} />
      </div>
    </div>
  );
}
