'use client';

import React, { useState } from 'react';
import { Search, MapPin, DollarSign, Clock, X, Briefcase, FileText, Check } from 'lucide-react';
import { applyToJob } from '@/app/actions';
import { useRouter } from 'next/navigation';

interface Application {
  id: number;
  jobId: number;
  candidateId: number;
  status: string;
}

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  tags: string[];
  description: string;
  createdAt: Date;
  applications: Application[];
}

interface JobTabProps {
  jobs: Job[];
  candidateId: number;
}

export default function JobTab({ jobs, candidateId }: JobTabProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  // Filter jobs based on search term and location
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation =
      selectedLocation === 'all' ||
      job.location.toLowerCase().includes(selectedLocation.toLowerCase());

    return matchesSearch && matchesLocation;
  });

  const handleApply = async (jobId: number) => {
    if (isApplying) return;
    setIsApplying(true);

    const result = await applyToJob(jobId, candidateId);

    if (result.success) {
      // Update selectedJob state locally to show immediate feedback in the drawer
      if (selectedJob && selectedJob.id === jobId) {
        setSelectedJob({
          ...selectedJob,
          applications: [
            ...selectedJob.applications,
            { id: 0, jobId, candidateId, status: 'APPLIED' }
          ]
        });
      }
      router.refresh();
    } else {
      alert(result.error || 'Nộp hồ sơ thất bại. Vui lòng thử lại!');
    }
    setIsApplying(false);
  };

  const hasApplied = (job: Job) => {
    return job.applications.some((app) => app.candidateId === candidateId);
  };

  return (
    <div className="container">
      {/* Search and Filters */}
      <div className="job-search-bar">
        <div className="search-input-wrapper">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm công việc, công ty, kỹ năng (ví dụ: React, Nodejs, VNG...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="filter-select"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="all">Tất cả địa điểm</option>
          <option value="Hà Nội">Hà Nội</option>
          <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
          <option value="Remote">Remote</option>
        </select>
      </div>

      {/* Jobs Grid */}
      <div className="jobs-grid">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="card job-card"
              onClick={() => setSelectedJob(job)}
            >
              <div className="job-header">
                <div>
                  <h3 className="job-title">{job.title}</h3>
                  <div className="job-company">
                    <Briefcase size={14} style={{ color: 'var(--text-muted)' }} />
                    {job.company}
                  </div>
                </div>
                {hasApplied(job) && (
                  <span className="badge" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>
                    Đã ứng tuyển
                  </span>
                )}
              </div>

              <div className="job-details-meta">
                <div className="meta-item">
                  <MapPin size={14} />
                  {job.location}
                </div>
                <div className="meta-item">
                  <DollarSign size={14} />
                  <span className="job-salary">{job.salary}</span>
                </div>
              </div>

              <div className="job-tags">
                {job.tags.map((tag, idx) => (
                  <span key={idx} className="job-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="card" style={{ gridColumn: 'span 2', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Không tìm thấy công việc nào phù hợp với tìm kiếm của bạn.
          </div>
        )}
      </div>

      {/* Job Details Drawer */}
      {selectedJob && (
        <div className="drawer-backdrop" onClick={() => setSelectedJob(null)}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h2 className="flex-center" style={{ gap: '8px', fontSize: '18px' }}>
                <Briefcase size={20} style={{ color: 'var(--primary)' }} />
                Chi tiết công việc
              </h2>
              <button
                type="button"
                className="close-btn"
                onClick={() => setSelectedJob(null)}
              >
                <X size={24} />
              </button>
            </div>

            <div className="drawer-body">
              <div>
                <h1 className="drawer-title">{selectedJob.title}</h1>
                <div className="job-company" style={{ fontSize: '15px', marginTop: '6px' }}>
                  {selectedJob.company}
                </div>
              </div>

              <div className="job-details-meta" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
                <div className="meta-item">
                  <MapPin size={16} />
                  {selectedJob.location}
                </div>
                <div className="meta-item">
                  <DollarSign size={16} />
                  <span className="job-salary" style={{ fontSize: '16px' }}>{selectedJob.salary}</span>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '15px', marginBottom: '8px' }}>Yêu cầu công việc</h3>
                <div className="job-tags" style={{ marginBottom: '16px' }}>
                  {selectedJob.tags.map((tag, idx) => (
                    <span key={idx} className="job-tag" style={{ fontSize: '13px', padding: '6px 12px' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '15px', marginBottom: '8px' }}>Mô tả công việc</h3>
                <div className="drawer-desc">{selectedJob.description}</div>
              </div>
            </div>

            <div className="drawer-footer">
              {hasApplied(selectedJob) ? (
                <div className="applied-badge-big">
                  <Check size={18} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                  Bạn đã nộp đơn ứng tuyển thành công
                </div>
              ) : (
                <button
                  type="button"
                  className="apply-btn"
                  onClick={() => handleApply(selectedJob.id)}
                  disabled={isApplying}
                >
                  <FileText size={18} />
                  {isApplying ? 'Đang gửi hồ sơ...' : 'Nộp đơn ứng tuyển ngay'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
