'use client';

import React, { useState } from 'react';
import { Plus, Briefcase, User, MessageCircle, FileText, Check, X, ArrowRight, UserX } from 'lucide-react';
import { createJob, updateApplicationStatus } from '@/app/actions';
import { useRouter } from 'next/navigation';

interface Candidate {
  id: number;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  experience: any;
  education: any;
}

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
}

interface Application {
  id: number;
  jobId: number;
  candidateId: number;
  status: string;
  createdAt: Date;
  job: Job;
  candidate: Candidate;
}

interface EmployerTabProps {
  applications: Application[];
  jobs: Job[];
  onOpenChat: (recipient: string) => void;
}

export default function EmployerTab({ applications, jobs, onOpenChat }: EmployerTabProps) {
  const router = useRouter();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const [selectedCandidateForCV, setSelectedCandidateForCV] = useState<Candidate | null>(null);

  // New Job Form State
  const [jobTitle, setJobTitle] = useState('');
  const [jobCompany, setJobCompany] = useState('');
  const [jobLocation, setJobLocation] = useState('Hà Nội');
  const [jobSalary, setJobSalary] = useState('');
  const [jobTags, setJobTags] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !jobCompany || !jobSalary || !jobDesc || isSubmitting) return;

    setIsSubmitting(true);
    const tagsArray = jobTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const result = await createJob({
      title: jobTitle,
      company: jobCompany,
      location: jobLocation,
      salary: jobSalary,
      tags: tagsArray.length > 0 ? tagsArray : ['IT'],
      description: jobDesc,
    });

    if (result.success) {
      // Clear inputs
      setJobTitle('');
      setJobCompany('');
      setJobSalary('');
      setJobTags('');
      setJobDesc('');
      setIsPostModalOpen(false);
      router.refresh();
    } else {
      alert(result.error || 'Đăng tin tuyển dụng thất bại!');
    }
    setIsSubmitting(false);
  };

  const handleMoveStatus = async (appId: number, currentStatus: string) => {
    let nextStatus = '';
    switch (currentStatus) {
      case 'APPLIED':
        nextStatus = 'SCREENING';
        break;
      case 'SCREENING':
        nextStatus = 'INTERVIEW';
        break;
      case 'INTERVIEW':
        nextStatus = 'OFFERED';
        break;
      case 'OFFERED':
        nextStatus = 'HIRED';
        break;
      default:
        return;
    }

    const result = await updateApplicationStatus(appId, nextStatus);
    if (result.success) {
      router.refresh();
    }
  };

  const handleReject = async (appId: number) => {
    const result = await updateApplicationStatus(appId, 'REJECTED');
    if (result.success) {
      router.refresh();
    }
  };

  // Group applications by Kanban Column Status
  const columns = [
    { key: 'APPLIED', title: 'Mới nộp', color: 'var(--text-muted)' },
    { key: 'SCREENING', title: 'Lọc hồ sơ', color: 'var(--secondary)' },
    { key: 'INTERVIEW', title: 'Phỏng vấn', color: 'purple' },
    { key: 'OFFERED', title: 'Mời nhận việc', color: 'orange' },
    { key: 'HIRED', title: 'Đã tuyển dụng', color: 'var(--success)' },
  ];

  const getAppsForColumn = (statusKey: string) => {
    return applications.filter((app) => app.status === statusKey);
  };

  const handleViewCV = (candidate: Candidate) => {
    setSelectedCandidateForCV(candidate);
    setIsCVModalOpen(true);
  };

  return (
    <div className="container">
      {/* Top Banner and Quick Add */}
      <div className="employer-header-bar">
        <div>
          <h2 style={{ fontSize: '20px' }}>Hệ thống quản lý ứng viên (ATS)</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Theo dõi tiến độ, đánh giá hồ sơ và phỏng vấn ứng viên theo dự án.
          </p>
        </div>
        <button
          type="button"
          className="post-job-btn"
          onClick={() => setIsPostModalOpen(true)}
        >
          <Plus size={16} />
          Đăng tin tuyển dụng
        </button>
      </div>

      <div className="employer-layout">
        {/* Kanban Board */}
        <div className="kanban-board-wrapper">
          <div className="kanban-board">
            {columns.map((col) => {
              const colApps = getAppsForColumn(col.key);
              return (
                <div key={col.key} className="kanban-column">
                  <div className="kanban-column-header" style={{ borderTop: `4px solid ${col.color}` }}>
                    <span>{col.title}</span>
                    <span className="column-badge">{colApps.length}</span>
                  </div>

                  <div className="column-cards-container">
                    {colApps.map((app) => (
                      <div key={app.id} className="kanban-card">
                        <div className="k-card-name">{app.candidate.name}</div>
                        <div className="k-card-title">{app.candidate.title}</div>
                        <div className="k-card-job">{app.job.title}</div>
                        
                        <div className="k-card-actions">
                          <button
                            type="button"
                            className="k-action-btn"
                            onClick={() => handleViewCV(app.candidate)}
                          >
                            <FileText size={12} />
                            Hồ sơ
                          </button>
                          <button
                            type="button"
                            className="k-action-btn"
                            onClick={() => onOpenChat(app.candidate.name)}
                          >
                            <MessageCircle size={12} />
                            Chat
                          </button>
                        </div>

                        {col.key !== 'HIRED' && (
                          <div style={{ display: 'flex', gap: '4px', marginTop: '10px' }}>
                            <button
                              type="button"
                              className="k-next-status-btn"
                              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                              onClick={() => handleMoveStatus(app.id, app.status)}
                            >
                              Tiếp tục <ArrowRight size={10} />
                            </button>
                            <button
                              type="button"
                              className="k-next-status-btn"
                              style={{ background: 'var(--danger-bg)', color: 'var(--danger)', width: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              onClick={() => handleReject(app.id)}
                              title="Từ chối hồ sơ"
                            >
                              <UserX size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rejected candidates info (summary) */}
        {applications.some((app) => app.status === 'REJECTED') && (
          <div className="card" style={{ padding: '16px' }}>
            <h4 style={{ fontSize: '14px', color: 'var(--danger)' }}>Hồ sơ đã loại ({applications.filter((a) => a.status === 'REJECTED').length})</h4>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
              {applications.filter((a) => a.status === 'REJECTED').map((app) => (
                <div key={app.id} style={{ fontSize: '12px', background: 'var(--background)', padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                  <strong>{app.candidate.name}</strong> - {app.job.title}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: POST JOB FORM */}
      {isPostModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsPostModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="flex-center" style={{ gap: '8px' }}>
                <Briefcase size={18} style={{ color: 'var(--secondary)' }} />
                Đăng tin tuyển dụng mới
              </h3>
              <button
                type="button"
                className="close-btn"
                onClick={() => setIsPostModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePostJob}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Tiêu đề công việc</label>
                  <input
                    type="text"
                    required
                    placeholder="ví dụ: Senior React Developer, DevOps Engineer..."
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Công ty</label>
                    <input
                      type="text"
                      required
                      placeholder="ví dụ: FPT Software, Momo..."
                      value={jobCompany}
                      onChange={(e) => setJobCompany(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Địa điểm</label>
                    <select
                      className="filter-select"
                      style={{ width: '100%', height: '40px' }}
                      value={jobLocation}
                      onChange={(e) => setJobLocation(e.target.value)}
                    >
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="Hà Nội (Hybrid)">Hà Nội (Hybrid)</option>
                      <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                      <option value="TP. Hồ Chí Minh (Hybrid)">TP. Hồ Chí Minh (Hybrid)</option>
                      <option value="Đà Nẵng">Đà Nẵng</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Mức lương</label>
                    <input
                      type="text"
                      required
                      placeholder="ví dụ: 20,000,000 - 30,000,000 VND"
                      value={jobSalary}
                      onChange={(e) => setJobSalary(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Kỹ năng yêu cầu (ngăn cách bằng dấu phẩy)</label>
                    <input
                      type="text"
                      placeholder="React, Nodejs, TypeScript"
                      value={jobTags}
                      onChange={(e) => setJobTags(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Mô tả chi tiết công việc</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Nhập mô tả nhiệm vụ, yêu cầu chuyên môn, quyền lợi tại công ty..."
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsPostModalOpen(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="post-job-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Đang tạo...' : 'Tạo và đăng tuyển'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: VIEW CANDIDATE CV PROFILE */}
      {isCVModalOpen && selectedCandidateForCV && (
        <div className="modal-backdrop" onClick={() => setIsCVModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '750px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="flex-center" style={{ gap: '8px' }}>
                <User size={18} style={{ color: 'var(--primary)' }} />
                Hồ sơ ứng viên: {selectedCandidateForCV.name}
              </h3>
              <button
                type="button"
                className="close-btn"
                onClick={() => setIsCVModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ overflowY: 'auto', maxHeight: '70vh' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '15px' }}>{selectedCandidateForCV.title}</h4>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', gap: '12px' }}>
                    <span>📧 {selectedCandidateForCV.email}</span>
                    <span>📞 {selectedCandidateForCV.phone}</span>
                    <span>📍 {selectedCandidateForCV.location}</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                  <h5 style={{ fontSize: '13px', color: 'var(--primary)' }}>Tóm tắt bản thân</h5>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.5 }}>
                    {selectedCandidateForCV.summary}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                  <h5 style={{ fontSize: '13px', color: 'var(--primary)', marginBottom: '8px' }}>Kỹ năng</h5>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {selectedCandidateForCV.skills.map((skill, idx) => (
                      <span key={idx} style={{ fontSize: '11px', background: 'var(--background)', color: 'var(--text-secondary)', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                  <h5 style={{ fontSize: '13px', color: 'var(--primary)', marginBottom: '8px' }}>Kinh nghiệm làm việc</h5>
                  {Array.isArray(selectedCandidateForCV.experience) && selectedCandidateForCV.experience.map((exp: any, idx: number) => (
                    <div key={idx} style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '12px' }}>
                        <span>{exp.role}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{exp.duration}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>{exp.company}</div>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', whiteSpace: 'pre-wrap' }}>{exp.description}</p>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                  <h5 style={{ fontSize: '13px', color: 'var(--primary)', marginBottom: '8px' }}>Học vấn</h5>
                  {Array.isArray(selectedCandidateForCV.education) && selectedCandidateForCV.education.map((edu: any, idx: number) => (
                    <div key={idx} style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '12px' }}>
                        <span>{edu.degree}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{edu.duration}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{edu.school}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="post-job-btn"
                onClick={() => setIsCVModalOpen(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
