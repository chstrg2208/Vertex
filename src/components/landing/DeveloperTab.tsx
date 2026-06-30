'use client';

import React from 'react';
import { ArrowRight, FileText, CheckCircle, Code, Shield, Globe, Clock, Zap, MapPin, DollarSign } from 'lucide-react';
import { translations, Locale } from '@/utils/translations';
import HeroSection from './HeroSection';

interface DeveloperTabProps {
  initialJobs: any[];
  locale: Locale;
  theme: 'light' | 'dark';
  onSelectTab: (tab: string) => void;
}

export default function DeveloperTab({ initialJobs, locale, theme, onSelectTab }: DeveloperTabProps) {
  const t = translations[locale];

  // Developer recruitment process steps
  const devSteps = [
    {
      step: '1',
      title: locale === 'vi' ? 'Gửi hồ sơ & CV ứng tuyển' : 'Submit Profile & CV',
      desc: locale === 'vi' 
        ? 'Lập trình viên gửi hồ sơ qua trang Liên hệ hoặc gửi trực tiếp CV/LinkedIn tới truongchitrung05@gmail.com.'
        : 'Developers submit profile details via the Contact page or send CV/LinkedIn to truongchitrung05@gmail.com.'
    },
    {
      step: '2',
      title: locale === 'vi' ? 'Đánh giá kỹ năng (Technical Test)' : 'Technical Skill Assessment',
      desc: locale === 'vi'
        ? 'Thực hiện bài test thực chiến và phỏng vấn trực tiếp với Senior Tech Leads để xác thực tư duy logic và kỹ năng viết code sạch.'
        : 'Complete hands-on coding tests and interviews with Senior Tech Leads to validate logic and clean code architecture.'
    },
    {
      step: '3',
      title: locale === 'vi' ? 'Đánh giá giao tiếp & độ tin cậy' : 'Communication & Reliability Vetting',
      desc: locale === 'vi'
        ? 'Phỏng vấn chuyên sâu đánh giá khả năng đọc hiểu tài liệu, kỹ năng làm việc nhóm Agile và giao tiếp tiếng Anh chuyên ngành.'
        : 'In-depth assessment of document comprehension, Agile teamwork skills, and professional English communication.'
    },
    {
      step: '4',
      title: locale === 'vi' ? 'Onboarding & Làm việc Remote' : 'Onboarding & Remote Placements',
      desc: locale === 'vi'
        ? 'Tham gia trực tiếp các dự án lớn từ đối tác toàn cầu. Làm việc 100% Remote, được hỗ trợ đầy đủ thiết bị và ký hợp đồng bảo vệ quyền lợi.'
        : 'Get matched with major projects from global partners. Work 100% Remote with device support and legally protected contracts.'
    }
  ];

  // Benefits for Remote Developers
  const benefits = [
    {
      icon: <Globe size={20} style={{ color: '#f97316' }} />,
      title: locale === 'vi' ? 'Làm việc 100% Remote từ xa' : '100% Flexible Remote Work',
      desc: locale === 'vi'
        ? 'Tự do làm việc tại nhà hoặc bất kỳ đâu, quản lý thời gian linh hoạt giúp nâng cao năng suất và cân bằng cuộc sống.'
        : 'Freedom to work from home or anywhere, managing flexible schedule to boost productivity and work-life balance.'
    },
    {
      icon: <Code size={20} style={{ color: '#f97316' }} />,
      title: locale === 'vi' ? 'Dự án quốc tế chất lượng' : 'Premium International Projects',
      desc: locale === 'vi'
        ? 'Cơ hội phát triển kỹ năng thực chiến với các dự án outsource quy mô lớn, công nghệ hiện đại từ các tập đoàn và đối tác toàn cầu.'
        : 'Opportunities to grow coding skills with large-scale outsourced projects and modern tech stacks from global clients.'
    },
    {
      icon: <Shield size={20} style={{ color: '#f97316' }} />,
      title: locale === 'vi' ? 'Pháp lý minh bạch & Thu nhập' : 'Transparent Contracts & Income',
      desc: locale === 'vi'
        ? 'Hợp đồng lao động đầy đủ, cam kết thu nhập hấp dẫn trả đúng hạn, hỗ trợ đóng bảo hiểm xã hội và thuế TNCN.'
        : 'Tripartite employment contracts, guaranteed on-time premium income, with tax and mandatory insurance support.'
    },
    {
      icon: <Clock size={20} style={{ color: '#f97316' }} />,
      title: locale === 'vi' ? 'Quy trình Onboarding nhanh' : 'Accelerated Developer Onboarding',
      desc: locale === 'vi'
        ? 'Quy trình kết nối dự án nhanh chóng chỉ trong 5-10 ngày làm việc. Luôn có Account Manager hỗ trợ trong suốt quá trình làm việc.'
        : 'Fast onboarding in 5-10 working days. Benefit from ongoing support of dedicated Account Managers during projects.'
    }
  ];

  return (
    <div className="developer-tab-container" style={{ animation: 'fadeIn 0.25s ease' }}>
      
      {/* 1. HERO SECTION - FULL WIDTH SLIDESHOW BANNER */}
      <HeroSection
        theme={theme}
        tag={locale === 'vi' ? 'HÀNH TRÌNH CHO LẬP TRÌNH VIÊN' : 'DEVELOPER PATHWAY'}
        title={
          locale === 'vi' 
            ? 'Cơ Hội Việc Làm Remote Hấp Dẫn Cho Lập Trình Viên' 
            : 'Premium Remote Job Opportunities for Software Developers'
        }
        description={
          locale === 'vi'
            ? 'Khám phá quy trình tuyển dụng thẩm định chuyên sâu và gia nhập mạng lưới kỹ sư Vertex để nhận dự án 100% remote từ đối tác toàn cầu.'
            : 'Explore our in-depth vetting flow and join the Vertex engineering network to work 100% remote on major global client projects.'
        }
        actions={
          <button 
            type="button" 
            className="btn-solid-orange" 
            style={{ padding: '14px 32px', fontSize: '15.5px' }}
            onClick={() => onSelectTab('contact')}
          >
            {locale === 'vi' ? 'Gửi Hồ Sơ Ứng Tuyển' : 'Submit Developer Profile'}
            <ArrowRight size={16} />
          </button>
        }
      />

      {/* 2. DEVELOPER HIRING PROCESS SECTION */}
      <section style={{ padding: '80px 0', background: 'var(--background)' }}>
        <div className="container">
          <div className="section-header-center" style={{ textAlign: 'center', marginBottom: '56px' }}>

            <h2 className="section-title-large" style={{ fontSize: '32px', marginBottom: '16px' }}>
              {locale === 'vi' ? 'Quy Trình Tuyển Dụng Cho Lập Trình Viên' : 'Developer Hiring & Vetting Flow'}
            </h2>
            <p className="section-subtitle-large" style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              {locale === 'vi' 
                ? 'Lộ trình 4 bước kiểm tra năng lực rõ ràng, giúp bạn phát huy thế mạnh và kết nối đúng dự án phù hợp.' 
                : 'A transparent 4-step assessment journey to highlight your strengths and connect you with the right project.'}
            </p>
          </div>

          <div className="animate-fade-in-up" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px'
          }}>
            {devSteps.map((step, idx) => {
              const delayClass = idx === 0 ? 'delay-100' : idx === 1 ? 'delay-200' : idx === 2 ? 'delay-300' : idx === 3 ? 'delay-400' : '';
              return (
                <div 
                  key={idx} 
                  className={`challenge-card-modern animate-fade-in-up ${delayClass}`} 
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: 'var(--shadow-sm)',
                  position: 'relative',
                  overflow: 'visible'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '24px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#f97316',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  boxShadow: '0 4px 10px rgba(249, 115, 22, 0.4)'
                }}>
                  {step.step}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '12px' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
        </div>
      </section>

      {/* 3. WORKING ENVIRONMENT & BENEFITS (DESCRIPTION OF DEVELOPER ROLE) */}
      <section style={{ padding: '80px 0', background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '48px', alignItems: 'center' }}>
            
            {/* Left side benefits grid */}
            <div className="animate-fade-in-left" style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px'
            }}>
              {benefits.map((item, idx) => {
                const delayClass = idx === 0 ? 'delay-100' : idx === 1 ? 'delay-200' : idx === 2 ? 'delay-300' : idx === 3 ? 'delay-400' : '';
                return (
                  <div key={idx} className={`card animate-fade-in-up ${delayClass}`} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', background: 'var(--background)' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'rgba(249, 115, 22, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      alignSelf: 'flex-start'
                    }}>
                      {item.icon}
                    </div>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{item.title}</h4>
                    <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{item.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Right side explanation */}
            <div className="animate-fade-in-right">

              <h2 style={{ fontSize: '32px', marginBottom: '20px', lineHeight: 1.3 }}>
                {locale === 'vi' ? 'Môi Trường Làm Việc Remote Thực Chiến' : 'Professional Remote Work Environment'}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15.5px', lineHeight: 1.6, marginBottom: '20px' }}>
                {locale === 'vi' 
                  ? 'Tại Vertex, công việc của Lập trình viên không chỉ đơn thuần là viết mã nguồn. Bạn chịu trách nhiệm giải quyết các bài toán hệ thống thực tế cho các startup công nghệ toàn cầu trong điều kiện làm việc từ xa (100% remote).'
                  : 'At Vertex, a Developer\'s job is more than writing code. You hold complete ownership over solving critical system challenges for venture-backed global startups under 100% remote working conditions.'}
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15.5px', lineHeight: 1.6 }}>
                {locale === 'vi'
                  ? 'Bạn sẽ được hòa mình vào quy trình Agile/Scrum bài bản, quản lý sản phẩm bằng Git/Jira, và liên tục cải tiến chất lượng mã nguồn (Clean Code) cùng Account Manager và Tech Leads hỗ trợ đồng hành.'
                  : 'You will integrate into clean Agile/Scrum practices, manage products using Git/Jira, and continuously refine software quality (Clean Code) alongside dedicated Account Managers and Tech Leads.'}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. OPEN ROLES LISTING */}
      <section style={{ padding: '80px 0', background: 'var(--background)' }}>
        <div className="container">
          <div className="section-header-center" style={{ textAlign: 'center', marginBottom: '56px' }}>

            <h2 className="section-title-large" style={{ fontSize: '32px' }}>
              {locale === 'vi' ? 'Vị Trí Đang Tuyển Dụng Remote' : 'Open Remote Positions'}
            </h2>
            <p className="section-subtitle-large" style={{ color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '600px', margin: '8px auto 0 auto' }}>
              {locale === 'vi' 
                ? 'Các dự án công nghệ đang tìm kỹ sư làm việc từ xa (Remote 100%) hoặc làm việc linh hoạt (Hybrid).' 
                : 'Active software projects currently looking for 100% Remote or flexible Hybrid engineers.'}
            </p>
          </div>

          <div className="jobs-grid animate-fade-in-up">
            {initialJobs.map((job, idx) => {
              const delayClass = idx === 0 ? 'delay-100' : idx === 1 ? 'delay-200' : idx === 2 ? 'delay-300' : '';
              return (
                <div 
                  key={job.id} 
                  className={`challenge-card-modern animate-fade-in-up ${delayClass}`} 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '16px',
                  position: 'relative',
                  background: 'var(--surface)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{job.title}</h3>
                  <span className="badge" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontSize: '11px', flexShrink: 0 }}>
                    {locale === 'vi' ? '100% Remote / Từ xa' : '100% Remote'}
                  </span>
                </div>

                <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {t.devCompanyLabel} {job.company}
                </div>

                <div className="job-details-meta" style={{ margin: '4px 0', display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <div className="meta-item" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><MapPin size={13} /> {locale === 'vi' ? 'Làm việc từ xa (Remote)' : 'Remote Location'}</div>
                  <div className="meta-item" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><DollarSign size={13} /> {job.salary}</div>
                </div>

                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, minHeight: '60px' }}>
                  {job.description}
                </p>

                <div className="job-tags" style={{ marginTop: 'auto', paddingTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {job.tags.map((tag: string, idx: number) => (
                    <span key={idx} className="job-tag" style={{
                      background: 'var(--background)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-secondary)',
                      padding: '4px 10px',
                      fontSize: '12px',
                      fontWeight: 600,
                      borderRadius: 'var(--radius-xs)'
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </section>

    </div>
  );
}
