'use client';

import React from 'react';
import { Check, Info } from 'lucide-react';
import { translations, Locale } from '@/utils/translations';

interface PricingTabProps {
  locale: Locale;
  onSelectTab: (tab: string) => void;
}

export default function PricingTab({ locale, onSelectTab }: PricingTabProps) {
  const t = translations[locale];

  const packages = [
    {
      name: locale === 'vi' ? 'Khởi Nghiệp (Starter)' : 'Starter Plan',
      price: locale === 'vi' ? 'Từ $1,500/tháng' : 'From $1,500/mo',
      desc: locale === 'vi' ? 'Lý tưởng cho startup nhỏ cần 1-2 kỹ sư bổ sung nhanh vào dự án.' : 'Perfect for small startups needing 1-2 developers for staff augmentation.',
      features: locale === 'vi' ? [
        'Vượt qua quy trình thẩm định 4 lớp',
        'Bàn giao hồ sơ trong 5-10 ngày làm việc',
        'Hợp đồng 3 bên tuân thủ luật lao động',
        'Account Manager hỗ trợ hàng tháng'
      ] : [
        'Vetted through 4-layer screening',
        'Shortlist delivery in 5-10 working days',
        'Compliant 3-party contracts',
        'Monthly Account Manager check-in'
      ],
      isPopular: false,
      btnText: locale === 'vi' ? 'Bắt Đầu Ngay' : 'Get Started'
    },
    {
      name: locale === 'vi' ? 'Tăng Trưởng (Scale)' : 'Scale Plan',
      price: locale === 'vi' ? 'Từ $2,800/tháng' : 'From $2,800/mo',
      desc: locale === 'vi' ? 'Lợi ích cao nhất cho startup cần xây dựng đội ngũ lập trình viên chuyên dụng.' : 'Optimized for growth stage startups establishing a dedicated remote team.',
      features: locale === 'vi' ? [
        'Toàn bộ quyền lợi gói Starter',
        'Ưu tiên khớp nhân tài nhanh (3-5 ngày)',
        'Đảm bảo 100% bảo mật sở hữu trí tuệ IP',
        'Cấp phát máy tính và theo dõi chấm công',
        'Hỗ trợ đổi nhân sự nhanh chóng'
      ] : [
        'All features in Starter Plan',
        'Accelerated sourcing (3-5 days list)',
        '100% Intellectual Property (IP) security',
        'Hardware provisioning & attendance tracking',
        'Flexible replacement support'
      ],
      isPopular: true,
      btnText: locale === 'vi' ? 'Liên Hệ Tư Vấn' : 'Talk to Expert'
    },
    {
      name: locale === 'vi' ? 'Doanh Nghiệp (Enterprise)' : 'Enterprise',
      price: locale === 'vi' ? 'Báo giá theo dự án' : 'Custom Pricing',
      desc: locale === 'vi' ? 'Bàn giao trọn gói gói dự án lớn với đội ngũ kỹ sư được quản lý toàn diện.' : 'Complete turnkey delivery with fully managed software pods.',
      features: locale === 'vi' ? [
        'Đội ngũ đầy đủ kỹ sư, PM và Tech Lead',
        'Quản trị vận hành hậu cần Vertex chịu trách nhiệm',
        'Cam kết chất lượng SLA nghiêm ngặt',
        'Văn phòng onsite bảo mật riêng',
        'Báo cáo hiệu suất định kỳ hàng tuần'
      ] : [
        'Dedicated pod with PM, Tech Lead, Devs',
        'Vertex handles all operations & logistics',
        'Strict SLA & delivery commitments',
        'Secure office setup options',
        'Weekly velocity & performance reporting'
      ],
      isPopular: false,
      btnText: locale === 'vi' ? 'Nhận Báo Giá Chi Tiết' : 'Request Custom Quote'
    }
  ];

  return (
    <div className="pricing-container" style={{ animation: 'fadeIn 0.25s ease' }}>
      
      {/* 1. HEADER */}
      <section style={{ padding: '60px 0 40px 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="hero-tag-pill" style={{ marginBottom: '16px', display: 'inline-flex' }}>
            {locale === 'vi' ? 'Bảng giá linh hoạt' : 'Flexible Pricing'}
          </span>
          <h1 className="hero-title" style={{ fontSize: '38px', marginBottom: '16px' }}>
            {locale === 'vi' ? 'Tối ưu chi phí nhân sự IT' : 'Optimize Your IT Staffing Costs'}
          </h1>
          <p className="hero-description" style={{ fontSize: '15.5px', maxWidth: '600px', margin: '0 auto' }}>
            {locale === 'vi' ? 'Loại bỏ hoàn toàn các chi phí tuyển dụng, văn phòng và hành chính. Chỉ thanh toán dựa trên thời gian làm việc thực tế của kỹ sư.' : 'Eliminate hiring overhead, office rentals, and admin fees. Pay only for the actual hours worked by your developers.'}
          </p>
        </div>
      </section>

      {/* 2. PRICING CARDS */}
      <section style={{ padding: '40px 0 80px 0' }}>
        <div className="container">
          <div className="pricing-flex-layout" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '28px'
          }}>
            {packages.map((pkg, idx) => (
              <div 
                key={idx} 
                className="pricing-card" 
                style={{
                  background: pkg.isPopular ? 'linear-gradient(180deg, var(--surface), rgba(255, 125, 51, 0.03))' : 'var(--surface)',
                  border: pkg.isPopular ? '1px solid #FF7D33' : '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '36px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                  transition: 'all 0.25s ease',
                  position: 'relative'
                }}
              >
                {pkg.isPopular && (
                  <span style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#FF7D33',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {locale === 'vi' ? 'Khuyên dùng' : 'Recommended'}
                  </span>
                )}

                {/* Name & price */}
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {pkg.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '12px 0 8px 0' }}>
                    <span style={{ fontSize: '28px', fontWeight: 900, color: pkg.isPopular ? '#FF7D33' : 'var(--text-primary)' }}>
                      {pkg.price}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4, minHeight: '38px' }}>
                    {pkg.desc}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--border)' }}></div>

                {/* Features list */}
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', padding: 0 }}>
                  {pkg.features.map((feat, fidx) => (
                    <li key={fidx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      <Check size={14} style={{ color: '#FF7D33', flexShrink: 0, marginTop: '2px' }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button 
                  type="button" 
                  className={pkg.isPopular ? 'btn-solid-orange' : 'btn-outline-ghost'} 
                  style={{
                    marginTop: 'auto',
                    padding: '12px',
                    fontSize: '14px',
                    width: '100%',
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={() => onSelectTab('about')}
                >
                  {pkg.btnText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. INFO BANNER */}
      <section style={{ padding: '0 0 60px 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{
            background: 'var(--surface-hover)',
            border: '1px dashed var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start'
          }}>
            <Info size={18} style={{ color: '#FF7D33', flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {locale === 'vi' ? (
                'Chú ý: Mức lương thực tế dao động phụ thuộc vào yêu cầu công nghệ (Node.js, React, Python, Golang, DevOps, AI/ML) và số năm kinh nghiệm (Junior, Mid, Senior) của kỹ sư bạn cần tuyển. Hãy gửi yêu cầu dự án để nhận báo giá chi tiết trong vòng 24 giờ.'
              ) : (
                'Note: Actual rates vary depending on tech stacks (Node.js, React, Python, Golang, DevOps, AI/ML) and years of experience (Junior, Mid, Senior) requested. Submit a request to receive a customized proposal within 24 hours.'
              )}
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
