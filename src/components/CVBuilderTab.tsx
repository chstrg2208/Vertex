'use client';

import React, { useState, useEffect } from 'react';
import { User, FileText, Briefcase, GraduationCap, Code, Plus, Trash2, Printer, Save, Check } from 'lucide-react';
import { updateCandidateProfile } from '@/app/actions';
import { useRouter } from 'next/navigation';

interface ExperienceItem {
  company: string;
  role: string;
  duration: string;
  description: string;
}

interface EducationItem {
  school: string;
  degree: string;
  duration: string;
}

interface Candidate {
  id: number;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  experience: any; // ExperienceItem[]
  education: any; // EducationItem[]
}

interface CVBuilderTabProps {
  initialCandidate: Candidate;
}

export default function CVBuilderTab({ initialCandidate }: CVBuilderTabProps) {
  const router = useRouter();
  const [candidate, setCandidate] = useState<Candidate>(initialCandidate);
  const [cvTheme, setCvTheme] = useState<'indigo' | 'emerald' | 'warm'>('indigo');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    setCandidate(initialCandidate);
  }, [initialCandidate]);

  const handleInputChange = (field: keyof Candidate, value: any) => {
    setCandidate((prev) => ({ ...prev, [field]: value }));
  };

  // Skill management
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillInput.trim()) return;
    if (candidate.skills.includes(skillInput.trim())) {
      setSkillInput('');
      return;
    }
    const updatedSkills = [...candidate.skills, skillInput.trim()];
    handleInputChange('skills', updatedSkills);
    setSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    const updatedSkills = candidate.skills.filter((s) => s !== skill);
    handleInputChange('skills', updatedSkills);
  };

  // Experience management
  const handleAddExperience = () => {
    const newExp: ExperienceItem = {
      company: 'Tên công ty mới',
      role: 'Vị trí làm việc',
      duration: 'Thời gian làm việc (ví dụ: 2024 - Hiện tại)',
      description: 'Mô tả chi tiết công việc của bạn tại đây...',
    };
    const experienceList = Array.isArray(candidate.experience) ? candidate.experience : [];
    handleInputChange('experience', [...experienceList, newExp]);
  };

  const handleExperienceChange = (index: number, field: keyof ExperienceItem, value: string) => {
    const experienceList = Array.isArray(candidate.experience) ? [...candidate.experience] : [];
    experienceList[index] = { ...experienceList[index], [field]: value };
    handleInputChange('experience', experienceList);
  };

  const handleRemoveExperience = (index: number) => {
    const experienceList = Array.isArray(candidate.experience) ? [...candidate.experience] : [];
    const filtered = experienceList.filter((_, idx) => idx !== index);
    handleInputChange('experience', filtered);
  };

  // Education management
  const handleAddEducation = () => {
    const newEdu: EducationItem = {
      school: 'Tên trường học',
      degree: 'Bằng cấp / Ngành học',
      duration: 'Thời gian học (ví dụ: 2018 - 2022)',
    };
    const educationList = Array.isArray(candidate.education) ? candidate.education : [];
    handleInputChange('education', [...educationList, newEdu]);
  };

  const handleEducationChange = (index: number, field: keyof EducationItem, value: string) => {
    const educationList = Array.isArray(candidate.education) ? [...candidate.education] : [];
    educationList[index] = { ...educationList[index], [field]: value };
    handleInputChange('education', educationList);
  };

  const handleRemoveEducation = (index: number) => {
    const educationList = Array.isArray(candidate.education) ? [...candidate.education] : [];
    const filtered = educationList.filter((_, idx) => idx !== index);
    handleInputChange('education', filtered);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    const result = await updateCandidateProfile({
      id: candidate.id,
      name: candidate.name,
      title: candidate.title,
      email: candidate.email,
      phone: candidate.phone,
      location: candidate.location,
      summary: candidate.summary,
      skills: candidate.skills,
      experience: candidate.experience,
      education: candidate.education,
    });

    if (result.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      router.refresh();
    } else {
      alert(result.error || 'Lưu hồ sơ thất bại!');
    }
    setIsSaving(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const experiences = Array.isArray(candidate.experience) ? candidate.experience : [];
  const educations = Array.isArray(candidate.education) ? candidate.education : [];

  return (
    <div className="container">
      <div className="cv-builder-layout">
        {/* Editor (Left Pane) */}
        <div className="cv-editor">
          {/* Header Actions */}
          <div className="editor-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Trình chỉnh sửa CV</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="add-item-btn"
                style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--primary-light)', border: '1px solid var(--primary)' }}
                onClick={handleSaveProfile}
                disabled={isSaving}
              >
                {saveSuccess ? (
                  <>
                    <Check size={16} style={{ color: 'var(--success)' }} />
                    Đã lưu
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {isSaving ? 'Đang lưu...' : 'Lưu CV'}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Personal Info */}
          <div className="editor-section">
            <h4 className="section-title">
              <User size={18} />
              Thông tin cá nhân
            </h4>
            <div className="form-row">
              <div className="form-group">
                <label>Họ và tên</label>
                <input
                  type="text"
                  value={candidate.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Vị trí mong muốn</label>
                <input
                  type="text"
                  value={candidate.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={candidate.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  value={candidate.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Địa điểm</label>
              <input
                type="text"
                value={candidate.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Tóm tắt năng lực</label>
              <textarea
                rows={4}
                value={candidate.summary}
                onChange={(e) => handleInputChange('summary', e.target.value)}
              />
            </div>
          </div>

          {/* Skills */}
          <div className="editor-section">
            <h4 className="section-title">
              <Code size={18} />
              Kỹ năng chuyên môn
            </h4>
            <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="Nhập kỹ năng mới (ví dụ: React, Python, Figma...)"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" className="add-item-btn" style={{ margin: 0, height: '40px' }}>
                <Plus size={16} />
                Thêm
              </button>
            </form>
            <div className="cv-skills-list">
              {candidate.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="cv-skill-badge"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 10px', fontSize: '12px', background: 'var(--background)' }}
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '10px' }}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="editor-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 className="section-title" style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>
                <Briefcase size={18} style={{ marginRight: '8px' }} />
                Kinh nghiệm làm việc
              </h4>
              <button type="button" className="add-item-btn" onClick={handleAddExperience} style={{ margin: 0 }}>
                <Plus size={14} /> Thêm kinh nghiệm
              </button>
            </div>
            
            {experiences.map((exp: ExperienceItem, idx: number) => (
              <div key={idx} className="array-item-row">
                <button
                  type="button"
                  className="remove-item-btn"
                  onClick={() => handleRemoveExperience(idx)}
                >
                  <Trash2 size={16} />
                </button>
                <div className="form-row">
                  <div className="form-group">
                    <label>Công ty / Tổ chức</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => handleExperienceChange(idx, 'company', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Vị trí đảm nhận</label>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => handleExperienceChange(idx, 'role', e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Thời gian</label>
                  <input
                    type="text"
                    value={exp.duration}
                    onChange={(e) => handleExperienceChange(idx, 'duration', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Mô tả chi tiết công việc</label>
                  <textarea
                    rows={3}
                    value={exp.description}
                    onChange={(e) => handleExperienceChange(idx, 'description', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="editor-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 className="section-title" style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>
                <GraduationCap size={18} style={{ marginRight: '8px' }} />
                Học vấn
              </h4>
              <button type="button" className="add-item-btn" onClick={handleAddEducation} style={{ margin: 0 }}>
                <Plus size={14} /> Thêm học vấn
              </button>
            </div>

            {educations.map((edu: EducationItem, idx: number) => (
              <div key={idx} className="array-item-row">
                <button
                  type="button"
                  className="remove-item-btn"
                  onClick={() => handleRemoveEducation(idx)}
                >
                  <Trash2 size={16} />
                </button>
                <div className="form-row">
                  <div className="form-group">
                    <label>Trường học / Học viện</label>
                    <input
                      type="text"
                      value={edu.school}
                      onChange={(e) => handleEducationChange(idx, 'school', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Bằng cấp / Ngành học</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(idx, 'degree', e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Thời gian</label>
                  <input
                    type="text"
                    value={edu.duration}
                    onChange={(e) => handleEducationChange(idx, 'duration', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Preview (Right Pane) */}
        <div className="cv-preview-container">
          <div className="cv-controls">
            <div className="theme-options">
              <button
                type="button"
                className={`theme-picker ${cvTheme === 'indigo' ? 'active' : ''}`}
                onClick={() => setCvTheme('indigo')}
              >
                Indigo Classic
              </button>
              <button
                type="button"
                className={`theme-picker ${cvTheme === 'emerald' ? 'active' : ''}`}
                onClick={() => setCvTheme('emerald')}
              >
                Emerald Tech
              </button>
              <button
                type="button"
                className={`theme-picker ${cvTheme === 'warm' ? 'active' : ''}`}
                onClick={() => setCvTheme('warm')}
              >
                Warm Minimalist
              </button>
            </div>
            <button type="button" className="print-cv-btn" onClick={handlePrint}>
              <Printer size={16} />
              Tải PDF / In CV
            </button>
          </div>

          {/* Rendered CV paper */}
          <div className={`cv-paper cv-theme-${cvTheme}`}>
            {/* CV Header */}
            <div className="cv-header" style={{ textAlign: cvTheme === 'warm' ? 'center' : 'left' }}>
              <div className="cv-name">{candidate.name || 'Họ và tên của bạn'}</div>
              <div className="cv-title">{candidate.title || 'Vị trí mong muốn'}</div>
              
              <div className="cv-contacts-grid" style={{ justifyContent: cvTheme === 'warm' ? 'center' : 'start' }}>
                <div>📧 {candidate.email || 'email@domain.com'}</div>
                <div>📞 {candidate.phone || '0987654321'}</div>
                <div>📍 {candidate.location || 'Hà Nội'}</div>
              </div>
            </div>

            <div className="cv-grid-two" style={{ gridTemplateColumns: cvTheme === 'indigo' ? '2fr 1fr' : '1fr' }}>
              <div>
                {/* CV Summary */}
                <div className="cv-section">
                  <div className="cv-section-title">Giới thiệu bản thân</div>
                  <p style={{ color: '#555555' }}>{candidate.summary || 'Tóm tắt ngắn gọn mục tiêu, thế mạnh nghề nghiệp...'}</p>
                </div>

                {/* CV Work Experience */}
                <div className="cv-section">
                  <div className="cv-section-title">Kinh nghiệm làm việc</div>
                  {experiences.length > 0 ? (
                    experiences.map((exp: ExperienceItem, idx: number) => (
                      <div key={idx} className="cv-experience-item">
                        <div className="cv-item-header">
                          <span>{exp.role}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{exp.duration}</span>
                        </div>
                        <div className="cv-item-company">{exp.company}</div>
                        <p className="cv-item-desc">{exp.description}</p>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Chưa có thông tin kinh nghiệm.</p>
                  )}
                </div>

                {/* CV Education */}
                <div className="cv-section">
                  <div className="cv-section-title">Học vấn</div>
                  {educations.length > 0 ? (
                    educations.map((edu: EducationItem, idx: number) => (
                      <div key={idx} className="cv-experience-item">
                        <div className="cv-item-header">
                          <span>{edu.degree}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{edu.duration}</span>
                        </div>
                        <div className="cv-item-company">{edu.school}</div>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Chưa có thông tin học vấn.</p>
                  )}
                </div>
              </div>

              {/* Sidebar column for Indigo layout */}
              {cvTheme === 'indigo' && (
                <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '20px' }}>
                  <div className="cv-section">
                    <div className="cv-section-title">Kỹ năng</div>
                    <div className="cv-skills-list">
                      {candidate.skills.map((skill, idx) => (
                        <span key={idx} className="cv-skill-badge">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Render skills in block if not indigo theme */}
            {cvTheme !== 'indigo' && (
              <div className="cv-section" style={{ marginTop: '16px' }}>
                <div className="cv-section-title">Kỹ năng chuyên môn</div>
                <div className="cv-skills-list">
                  {candidate.skills.map((skill, idx) => (
                    <span key={idx} className="cv-skill-badge" style={{ fontSize: '11px', padding: '4px 8px' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
