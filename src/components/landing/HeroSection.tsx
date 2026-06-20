'use client';

import React, { useState, useEffect } from 'react';
import { Briefcase } from 'lucide-react';

interface HeroSectionProps {
  theme: 'light' | 'dark';
  tag?: string;
  title: React.ReactNode;
  description: string;
  actions: React.ReactNode;
}

const heroImages = [
  '/developer_workstation.png',
  '/about_hero_workstation.png',
  '/developer_laptop_coffee.png',
  '/server_room_glow.png'
];

export default function HeroSection({ theme, tag, title, description, actions }: HeroSectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto transition background images every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="overview-hero" style={{
      position: 'relative',
      minHeight: '660px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '120px 0 100px 0',
      overflow: 'hidden',
      background: 'var(--background)'
    }}>
      {/* Background Slideshow */}
      <div className="hero-bg-slideshow" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1
      }}>
        {heroImages.map((imgSrc, index) => (
          <img
            key={index}
            src={imgSrc}
            alt={`Workstation Slide ${index + 1}`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: currentImageIndex === index ? 0.65 : 0,
              transition: 'opacity 2.5s ease-in-out',
              zIndex: currentImageIndex === index ? 2 : 1,
              willChange: 'opacity'
            }}
          />
        ))}
        {/* Theme-aware overlay gradients for contrast and blending */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: theme === 'dark'
            ? 'linear-gradient(180deg, rgba(8, 12, 20, 0.5) 0%, rgba(8, 12, 20, 0.95) 100%)'
            : 'linear-gradient(180deg, rgba(245, 247, 250, 0.4) 0%, rgba(245, 247, 250, 0.95) 100%)',
          zIndex: 3,
          transition: 'background 0.3s ease'
        }}></div>
      </div>

      {/* Hero Content wrapped in glassmorphic card container */}
      <div className="container" style={{ position: 'relative', zIndex: 4, maxWidth: '850px', margin: '0 auto', padding: '0 24px' }}>
        <div className="hero-glass-card animate-fade-in-up" style={{
          background: theme === 'dark' ? 'rgba(16, 22, 38, 0.78)' : 'rgba(255, 255, 255, 0.88)',
          border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '16px',
          padding: '48px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          boxShadow: theme === 'dark' ? '0 20px 40px rgba(0, 0, 0, 0.4)' : '0 20px 40px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s ease'
        }}>
          {tag && (() => {
            const match = tag.match(/^([^\w\s\d]+)\s*(.*)$/);
            if (match) {
              const [, symbol, text] = match;
              return (
                <span className="hero-tag-pill">
                  {symbol === '💼' || symbol === '💥' ? (
                    <Briefcase size={12} className="hero-tag-symbol" style={{ strokeWidth: 2.5 }} />
                  ) : (
                    <span className="hero-tag-symbol">{symbol}</span>
                  )}
                  <span>{text}</span>
                </span>
              );
            }
            return (
              <span className="hero-tag-pill">
                {tag}
              </span>
            );
          })()}
          <h1 className="hero-title" style={{
            fontSize: '48px',
            lineHeight: '1.2',
            margin: '0 auto',
            color: theme === 'dark' ? '#ffffff' : '#0f172a',
            textAlign: 'center'
          }}>
            {title}
          </h1>
          <p className="hero-description" style={{
            fontSize: '16px',
            color: theme === 'dark' ? '#cbd5e1' : '#475569',
            lineHeight: '1.6',
            maxWidth: '640px',
            margin: '0 auto',
            textAlign: 'center'
          }}>
            {description}
          </p>
          <div className="hero-actions" style={{ justifyContent: 'center' }}>
            {actions}
          </div>
        </div>
      </div>
    </section>
  );
}
