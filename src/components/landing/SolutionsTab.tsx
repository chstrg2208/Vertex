'use client';

import React from 'react';
import { Zap, Users, Inbox, Check } from 'lucide-react';
import { translations, Locale } from '@/utils/translations';

interface SolutionsTabProps {
  locale: Locale;
  onSelectTab: (tab: string) => void;
}

export default function SolutionsTab({ locale, onSelectTab }: SolutionsTabProps) {
  const t = translations[locale];

  const models = [
    {
      title: t.m1,
      desc: t.m1d,
      badge: locale === 'vi' ? 'Khởi động nhanh' : 'Fast Launch',
      features: t.m1list,
      icon: <Zap size={24} style={{ color: '#FF7D33' }} />,
      borderColor: '#FF7D33'
    },
    {
      title: t.m2,
      desc: t.m2d,
      badge: locale === 'vi' ? 'Phổ biến nhất' : 'Most Popular',
      features: t.m2list,
      icon: <Users size={24} style={{ color: '#6366F1' }} />,
      borderColor: '#6366F1'
    },
    {
      title: t.m3,
      desc: t.m3d,
      badge: locale === 'vi' ? 'Bàn giao trọn gói' : 'Turnkey Delivery',
      features: t.m3list,
      icon: <Inbox size={24} style={{ color: '#10B981' }} />,
      borderColor: '#10B981'
    }
  ];

  return (
    <div className="solutions-container" style={{ animation: 'fadeIn 0.25s ease' }}>
      
      {/* 1. HEADER */}
      <section style={{ padding: '60px 0 40px 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="hero-tag-pill" style={{ marginBottom: '16px', display: 'inline-flex' }}>
            {t.modelBadge}
          </span>
          <h1 className="hero-title" style={{ fontSize: '38px', marginBottom: '16px' }}>
            {t.modelTitle}
          </h1>
          <p className="hero-description" style={{ fontSize: '15.5px', maxWidth: '600px', margin: '0 auto' }}>
            {t.modelSubtitle}
          </p>
        </div>
      </section>

      {/* 2. THREE MODELS GRID */}
      <section style={{ padding: '40px 0 80px 0' }}>
        <div className="container">
          <div className="solutions-flex-layout" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '28px'
          }}>
            {models.map((model, idx) => (
              <div 
                key={idx} 
                className="solution-card-premium" 
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderTop: `4px solid ${model.borderColor}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  transition: 'all 0.25s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Header info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    background: 'var(--background)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {model.icon}
                  </div>
                  <span className="badge" style={{
                    backgroundColor: 'var(--background)',
                    color: 'var(--text-secondary)',
                    fontSize: '11px',
                    border: '1px solid var(--border)'
                  }}>
                    {model.badge}
                  </span>
                </div>

                {/* Title and description */}
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {model.title}
                  </h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5, minHeight: '60px' }}>
                    {model.desc}
                  </p>
                </div>

                {/* Divider */}
                <div style={{ borderTop: '1px solid var(--border)', margin: '4px 0' }}></div>

                {/* Bullet list */}
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0 }}>
                  {model.features.map((feat, fidx) => (
                    <li key={fidx} style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <Check size={16} style={{ color: model.borderColor, flexShrink: 0 }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Action button */}
                <button 
                  type="button" 
                  className="btn-outline-ghost" 
                  style={{
                    marginTop: 'auto',
                    padding: '12px',
                    fontSize: '13.5px',
                    width: '100%',
                    borderColor: 'var(--border)',
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={() => onSelectTab('about')}
                >
                  {locale === 'vi' ? 'Chọn Mô Hình Này' : 'Select Model'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
