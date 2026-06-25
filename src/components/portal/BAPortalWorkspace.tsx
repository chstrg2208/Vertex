'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Briefcase, 
  Ticket as TicketIcon, 
  CreditCard, 
  ChevronRight, 
  Plus, 
  X, 
  Mail,
  User,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Edit2
} from 'lucide-react';

// --- DATA MODEL INTERFACES ---
export interface StartupLead {
  id: string;
  name: string;
  founderName: string;
  status: 'contacted' | 'negotiation' | 'partnered' | 'inactive';
  lastContact: string;
  email: string;
  revenue: number;
}

export interface JobSpec {
  id: string;
  startup: string;
  title: string;
  budget: string;
  status: 'Pending' | 'Active' | 'Closed';
  tags: string[];
  description: string;
}

export interface Ticket {
  id: string;
  startup: string;
  title: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
}

interface BAPortalWorkspaceProps {
  locale: 'vi' | 'en';
  currentUser: { name: string; role: 'ta' | 'ba' | 'admin' };
}

export default function BAPortalWorkspace({ locale, currentUser }: BAPortalWorkspaceProps) {
  // Tab states
  const [activeTab, setActiveTab] = useState<'pipeline' | 'jobs' | 'tickets' | 'billing'>('pipeline');

  // MOCK STATE - Pipeline leads (Tab 1)
  const [leads, setLeads] = useState<StartupLead[]>([
    { id: '1', name: 'AlphaTech AI', founderName: 'Alex Mercer', status: 'partnered', lastContact: '2026-06-22', email: 'alex@alphatech.ai', revenue: 45000000 },
    { id: '2', name: 'Zeta Health', founderName: 'Sarah Jenkins', status: 'negotiation', lastContact: '2026-06-23', email: 'sarah@zetahealth.co', revenue: 0 },
    { id: '3', name: 'Quantum Ledger', founderName: 'Devon Vance', status: 'contacted', lastContact: '2026-06-20', email: 'devon@quantumledger.io', revenue: 0 },
    { id: '4', name: 'Optima Commerce', founderName: 'Elena Rostova', status: 'partnered', lastContact: '2026-06-24', email: 'elena@optima.shop', revenue: 32000000 },
    { id: '5', name: 'NeoLogistics', founderName: 'Marcus Aurel', status: 'inactive', lastContact: '2026-06-10', email: 'marcus@neolog.net', revenue: 0 },
  ]);

  // MOCK STATE - Job specs (Tab 2)
  const [jobSpecs, setJobSpecs] = useState<JobSpec[]>([
    { id: 'J-001', startup: 'AlphaTech AI', title: 'Senior Backend Engineer (Python/FastAPI)', budget: '45,000,000 VND / month', status: 'Active', tags: ['Python', 'FastAPI', 'AWS'], description: 'Looking for a backend specialist to build serverless endpoints for LLM orchestration.' },
    { id: 'J-002', startup: 'Zeta Health', title: 'Lead Full Stack React Native Developer', budget: '55,000,000 VND / month', status: 'Pending', tags: ['React Native', 'TypeScript', 'Node.js'], description: 'Required 4+ years of cross-platform app scaling and HIPAA compliance implementation.' },
    { id: 'J-003', startup: 'Optima Commerce', title: 'UI/UX Designer & Tailwind Expert', budget: '35,000,000 VND / month', status: 'Active', tags: ['Tailwind CSS', 'Figma', 'React'], description: 'Designing premium glassmorphic commerce dashboards and micro-interactions.' },
    { id: 'J-004', startup: 'NeoLogistics', title: 'DevOps Engineer (Docker/K8s)', budget: '50,000,000 VND / month', status: 'Closed', tags: ['Docker', 'Kubernetes', 'CI/CD'], description: 'Setup automation pipelines and microservices deployments on local environment.' }
  ]);

  // MOCK STATE - Tickets (Tab 3)
  const [tickets, setTickets] = useState<Ticket[]>([
    { id: 'TKT-101', startup: 'AlphaTech AI', title: 'Billing Adjustment Request for June Placements', priority: 'Medium', status: 'In Progress', createdAt: '2026-06-22 09:30' },
    { id: 'TKT-102', startup: 'Zeta Health', title: 'Urgent: Candidate Onboarding Agreement Sign-off', priority: 'High', status: 'Open', createdAt: '2026-06-24 14:15' },
    { id: 'TKT-103', startup: 'Quantum Ledger', title: 'Inquiry regarding Developer English Vetting criteria', priority: 'Low', status: 'Resolved', createdAt: '2026-06-18 11:00' },
    { id: 'TKT-104', startup: 'Optima Commerce', title: 'Tax Code synchronization error in billing dashboard', priority: 'High', status: 'Open', createdAt: '2026-06-24 16:45' }
  ]);

  // Sheet / Drawer Edit State (Tab 2)
  const [selectedJobSpec, setSelectedJobSpec] = useState<JobSpec | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editStartup, setEditStartup] = useState('');
  const [editBudget, setEditBudget] = useState('');
  const [editStatus, setEditStatus] = useState<'Pending' | 'Active' | 'Closed'>('Pending');
  const [editTags, setEditTags] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // Kanban interaction: Add startup lead modal
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadFounder, setNewLeadFounder] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadStatus, setNewLeadStatus] = useState<'contacted' | 'negotiation' | 'partnered'>('contacted');

  const handleOpenEditSheet = (job: JobSpec) => {
    setSelectedJobSpec(job);
    setEditTitle(job.title);
    setEditStartup(job.startup);
    setEditBudget(job.budget);
    setEditStatus(job.status);
    setEditTags(job.tags.join(', '));
    setEditDesc(job.description || '');
    setIsSheetOpen(true);
  };

  const handleSaveJobSpec = () => {
    if (!selectedJobSpec) return;
    const updated = jobSpecs.map(j => {
      if (j.id === selectedJobSpec.id) {
        return {
          ...j,
          title: editTitle,
          startup: editStartup,
          budget: editBudget,
          status: editStatus,
          tags: editTags.split(',').map(t => t.trim()).filter(t => t.length > 0),
          description: editDesc
        };
      }
      return j;
    });
    setJobSpecs(updated);
    setIsSheetOpen(false);
    setSelectedJobSpec(null);
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newLeadFounder || !newLeadEmail) return;
    const newLead: StartupLead = {
      id: (leads.length + 1).toString(),
      name: newLeadName,
      founderName: newLeadFounder,
      email: newLeadEmail,
      status: newLeadStatus,
      lastContact: new Date().toISOString().split('T')[0],
      revenue: newLeadStatus === 'partnered' ? 25000000 : 0
    };
    setLeads([...leads, newLead]);
    setIsLeadModalOpen(false);
    setNewLeadName('');
    setNewLeadFounder('');
    setNewLeadEmail('');
    setNewLeadStatus('contacted');
  };

  const updateLeadStatus = (id: string, newStatus: 'contacted' | 'negotiation' | 'partnered' | 'inactive') => {
    setLeads(leads.map(lead => lead.id === id ? { 
      ...lead, 
      status: newStatus,
      revenue: newStatus === 'partnered' ? 30000000 : lead.revenue 
    } : lead));
  };

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 'calc(100vh - 180px)', gap: '24px' }}>
      {/* Sidebar Navigation */}
      <aside className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', height: 'fit-content' }}>
        <h4 style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0 12px 8px 12px', borderBottom: '1px solid var(--border)' }}>
          {locale === 'vi' ? 'Hệ thống BA Manager' : 'BA Manager System'}
        </h4>

        <button
          type="button"
          onClick={() => setActiveTab('pipeline')}
          className={`nav-tab ${activeTab === 'pipeline' ? 'active' : ''}`}
          style={{ width: '100%', justifyContent: 'flex-start', margin: 0 }}
        >
          <Building2 size={16} />
          {locale === 'vi' ? 'Quy trình Startup' : 'Startup Pipeline'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('jobs')}
          className={`nav-tab ${activeTab === 'jobs' ? 'active' : ''}`}
          style={{ width: '100%', justifyContent: 'flex-start', margin: 0 }}
        >
          <Briefcase size={16} />
          {locale === 'vi' ? 'Yêu cầu Tuyển dụng' : 'Job Spec Monitor'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tickets')}
          className={`nav-tab ${activeTab === 'tickets' ? 'active' : ''}`}
          style={{ width: '100%', justifyContent: 'flex-start', margin: 0 }}
        >
          <TicketIcon size={16} />
          {locale === 'vi' ? 'Hỗ trợ khách hàng' : 'Client Ticket Hub'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('billing')}
          className={`nav-tab ${activeTab === 'billing' ? 'active' : ''}`}
          style={{ width: '100%', justifyContent: 'flex-start', margin: 0 }}
        >
          <CreditCard size={16} />
          {locale === 'vi' ? 'Biểu phí & Hợp đồng' : 'Billing & Revenue'}
        </button>
      </aside>

      {/* Main Workspace Frame */}
      <div className="tab-content" style={{ animation: 'fadeIn 0.25s ease' }}>

          {/* TAB 1: STARTUP PIPELINE BOARD (KANBAN) */}
          {activeTab === 'pipeline' && (
            <div className="ba-tab-view ba-animate-fade-in">
              <div className="ba-header-section">
                <div>
                  <h1 className="ba-title">{locale === 'vi' ? 'Quy trình Tiếp cận Startup' : 'Startup Pipeline Board'}</h1>
                  <p className="ba-subtitle">{locale === 'vi' ? 'Quản lý phễu đối tác doanh nghiệp và thương lượng hợp đồng tuyển dụng.' : 'Manage client startup onboarding phases and agency recruitment contract states.'}</p>
                </div>
                
                <button
                  type="button"
                  onClick={() => setIsLeadModalOpen(true)}
                  className="ba-btn-primary"
                >
                  <Plus size={16} />
                  {locale === 'vi' ? 'Thêm Startup Lead' : 'Add Startup Lead'}
                </button>
              </div>

              {/* Kanban Column Groups */}
              <div className="ba-kanban-grid">
                
                {/* Column 1: Contacted */}
                <div className="ba-kanban-column">
                  <div className="ba-kanban-column-header">
                    <span className="ba-column-title">{locale === 'vi' ? 'Đã liên hệ' : 'Contacted'}</span>
                    <span className="ba-column-count">
                      {leads.filter(l => l.status === 'contacted').length}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {leads.filter(l => l.status === 'contacted').map((lead) => (
                      <div key={lead.id} className="ba-kanban-card group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h4 className="ba-card-name">{lead.name}</h4>
                          <span className="ba-card-id">#{lead.id}</span>
                        </div>
                        <div className="ba-card-meta">
                          <span className="ba-card-meta-item"><User size={12} /> {lead.founderName}</span>
                          <span className="ba-card-meta-item"><Mail size={12} /> {lead.email}</span>
                        </div>
                        <div className="ba-card-footer">
                          <span>Contact: {lead.lastContact}</span>
                          <button
                            type="button"
                            onClick={() => updateLeadStatus(lead.id, 'negotiation')}
                            className="ba-card-action-btn"
                          >
                            {locale === 'vi' ? 'Thương lượng' : 'Negotiate'} <ChevronRight size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 2: Negotiation */}
                <div className="ba-kanban-column">
                  <div className="ba-kanban-column-header">
                    <span className="ba-column-title" style={{ color: '#b45309' }}>{locale === 'vi' ? 'Đang thương lượng' : 'Negotiation'}</span>
                    <span className="ba-column-count" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
                      {leads.filter(l => l.status === 'negotiation').length}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {leads.filter(l => l.status === 'negotiation').map((lead) => (
                      <div key={lead.id} className="ba-kanban-card group" style={{ borderColor: '#fef3c7' }}>
                        <h4 className="ba-card-name">{lead.name}</h4>
                        <div className="ba-card-meta">
                          <span className="ba-card-meta-item"><User size={12} /> {lead.founderName}</span>
                          <span className="ba-card-meta-item"><Mail size={12} /> {lead.email}</span>
                        </div>
                        <div className="ba-card-footer">
                          <span>Contact: {lead.lastContact}</span>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => updateLeadStatus(lead.id, 'inactive')}
                              className="ba-card-action-btn ba-card-action-drop"
                            >
                              {locale === 'vi' ? 'Bỏ' : 'Drop'}
                            </button>
                            <button
                              type="button"
                              onClick={() => updateLeadStatus(lead.id, 'partnered')}
                              className="ba-card-action-btn"
                            >
                              {locale === 'vi' ? 'Ký HĐ' : 'Partner'} <ChevronRight size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 3: Partnered */}
                <div className="ba-kanban-column">
                  <div className="ba-kanban-column-header">
                    <span className="ba-column-title" style={{ color: '#15803d' }}>{locale === 'vi' ? 'Đã ký hợp tác' : 'Partnered'}</span>
                    <span className="ba-column-count" style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>
                      {leads.filter(l => l.status === 'partnered').length}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {leads.filter(l => l.status === 'partnered').map((lead) => (
                      <div key={lead.id} className="ba-kanban-card group" style={{ borderColor: '#dcfce7' }}>
                        <h4 className="ba-card-name">{lead.name}</h4>
                        <div className="ba-card-meta">
                          <span className="ba-card-meta-item"><User size={12} /> {lead.founderName}</span>
                          <span className="ba-card-meta-item"><Mail size={12} /> {lead.email}</span>
                        </div>
                        <div className="ba-card-footer">
                          <span style={{ color: '#15803d', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <ShieldCheck size={12} /> Active
                          </span>
                          <button
                            type="button"
                            onClick={() => updateLeadStatus(lead.id, 'inactive')}
                            className="ba-card-action-btn ba-card-action-drop"
                          >
                            {locale === 'vi' ? 'Đóng HĐ' : 'Deactivate'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 4: Inactive */}
                <div className="ba-kanban-column">
                  <div className="ba-kanban-column-header">
                    <span className="ba-column-title">{locale === 'vi' ? 'Ngưng hợp tác' : 'Inactive'}</span>
                    <span className="ba-column-count">
                      {leads.filter(l => l.status === 'inactive').length}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {leads.filter(l => l.status === 'inactive').map((lead) => (
                      <div key={lead.id} className="ba-kanban-card group" style={{ opacity: 0.65 }}>
                        <h4 className="ba-card-name">{lead.name}</h4>
                        <div className="ba-card-meta">
                          <span className="ba-card-meta-item"><User size={12} /> {lead.founderName}</span>
                        </div>
                        <div className="ba-card-footer">
                          <span>Dropped</span>
                          <button
                            type="button"
                            onClick={() => updateLeadStatus(lead.id, 'contacted')}
                            className="ba-card-action-btn"
                          >
                            {locale === 'vi' ? 'Mở lại' : 'Reactivate'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: CLIENT JOB SPEC MONITOR */}
          {activeTab === 'jobs' && (
            <div className="ba-tab-view ba-animate-fade-in">
              <div className="ba-header-section">
                <div>
                  <h1 className="ba-title">{locale === 'vi' ? 'Quản lý Bản mô tả Công việc' : 'Client Job Spec Monitor'}</h1>
                  <p className="ba-subtitle">{locale === 'vi' ? 'Theo dõi, đánh giá và duyệt các vị trí trống được gửi lên bởi startup.' : 'Monitor, evaluate, and approve technical job vacancies submitted by startup partners.'}</p>
                </div>
              </div>

              {/* Job Spec Data Table */}
              <div className="ba-table-container">
                <table className="ba-table">
                  <thead>
                    <tr>
                      <th>{locale === 'vi' ? 'Startup' : 'Startup Client'}</th>
                      <th>{locale === 'vi' ? 'Vị trí công việc' : 'Job Title'}</th>
                      <th>{locale === 'vi' ? 'Mức ngân sách' : 'Budget'}</th>
                      <th>{locale === 'vi' ? 'Yêu cầu kỹ năng' : 'Tags'}</th>
                      <th>{locale === 'vi' ? 'Trạng thái' : 'Status'}</th>
                      <th style={{ textAlign: 'right' }}>{locale === 'vi' ? 'Hành động' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobSpecs.map((job) => (
                      <tr key={job.id}>
                        <td style={{ fontWeight: '600', color: '#0f172a' }}>{job.startup}</td>
                        <td style={{ fontWeight: '500', color: '#334155' }}>{job.title}</td>
                        <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{job.budget}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {job.tags.map((tag, idx) => (
                              <span key={idx} className="ba-tag-badge">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <span className={`ba-badge ${
                            job.status === 'Active' 
                              ? 'ba-badge-success' 
                              : job.status === 'Pending' 
                              ? 'ba-badge-warning ba-pulse-light' 
                              : 'ba-badge-neutral'
                          }`}>
                            {job.status === 'Active' ? (
                              <><CheckCircle2 size={10} /> Active</>
                            ) : job.status === 'Pending' ? (
                              <><Clock size={10} /> Pending</>
                            ) : (
                              <><AlertCircle size={10} /> Closed</>
                            )}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEditSheet(job)}
                            className="ba-action-link"
                          >
                            <Edit2 size={12} />
                            {job.status === 'Pending' ? (locale === 'vi' ? 'Duyệt & Sửa' : 'Review & Approve') : (locale === 'vi' ? 'Sửa' : 'Edit')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CLIENT TICKET/SUPPORT HUB */}
          {activeTab === 'tickets' && (
            <div className="ba-tab-view ba-animate-fade-in">
              <div className="ba-header-section">
                <div>
                  <h1 className="ba-title">{locale === 'vi' ? 'Hỗ trợ khách hàng (Tickets)' : 'Client Ticket Hub'}</h1>
                  <p className="ba-subtitle">{locale === 'vi' ? 'Giải quyết thắc mắc về hợp đồng, thanh toán và xử lý sự cố dịch vụ của các startup.' : 'Resolve billing inquiries, placement feedback, and operational tickets raised by client startups.'}</p>
                </div>
              </div>

              {/* Tickets list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="ba-ticket-card">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div className="ba-ticket-header-meta">
                        <span className="ba-ticket-id">{ticket.id}</span>
                        <span className="ba-ticket-divider">|</span>
                        <span className="ba-ticket-client">{ticket.startup}</span>
                        <span className={`ba-priority-badge ${
                          ticket.priority === 'High' 
                            ? 'high' 
                            : ticket.priority === 'Medium' 
                            ? 'medium' 
                            : 'low'
                        }`}>
                          {ticket.priority} Priority
                        </span>
                      </div>
                      
                      <h3 className="ba-ticket-title">{ticket.title}</h3>
                      <span className="ba-ticket-date">Created: {ticket.createdAt}</span>
                    </div>

                    <div className="ba-ticket-actions">
                      <span className={`ba-badge ${
                        ticket.status === 'Resolved' 
                          ? 'ba-badge-success' 
                          : ticket.status === 'In Progress' 
                          ? 'ba-badge-info' 
                          : 'ba-badge-danger'
                      }`}>
                        {ticket.status}
                      </span>

                      {ticket.status !== 'Resolved' && (
                        <button
                          type="button"
                          onClick={() => {
                            alert(locale === 'vi' ? `Xác nhận xử lý ticket ${ticket.id}` : `Opening ticket workspace response for ${ticket.id}`);
                          }}
                          className="ba-btn-primary"
                          style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '8px' }}
                        >
                          {locale === 'vi' ? 'Xử lý' : 'Resolve'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CLIENT BILLINGS & REVENUE */}
          {activeTab === 'billing' && (
            <div className="ba-tab-view ba-animate-fade-in">
              <div className="ba-header-section">
                <div>
                  <h1 className="ba-title">{locale === 'vi' ? 'Biểu phí & Hợp đồng tài chính' : 'Client Billings & Revenue'}</h1>
                  <p className="ba-subtitle">{locale === 'vi' ? 'Theo dõi tổng quan tài chính, doanh số và hợp đồng từ đối tác startup.' : 'Review gross billing accounts, monthly recurring revenue (MRR) metrics, and partner invoice summaries.'}</p>
                </div>
              </div>

              {/* Financial KPI metrics summary */}
              <div className="ba-stats-grid">
                {/* Metric 1 */}
                <div className="ba-stat-card">
                  <div className="ba-stat-content">
                    <span className="ba-stat-label">{locale === 'vi' ? 'Hợp đồng Partnered' : 'Active Contracts'}</span>
                    <span className="ba-stat-value">
                      {leads.filter(l => l.status === 'partnered').length}
                    </span>
                    <span className="ba-stat-desc">Startups utilizing staff augmentation</span>
                  </div>
                  <div className="ba-stat-icon-wrapper">
                    <Building2 size={22} />
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="ba-stat-card">
                  <div className="ba-stat-content">
                    <span className="ba-stat-label">{locale === 'vi' ? 'Ước tính Doanh thu/tháng' : 'Total Portal MRR'}</span>
                    <span className="ba-stat-value" style={{ color: '#4f46e5' }}>
                      {formatCurrency(leads.reduce((sum, l) => sum + l.revenue, 0))}
                    </span>
                    <span className="ba-stat-desc" style={{ color: '#16a34a', fontWeight: '600' }}>↑ +14.5% vs last month</span>
                  </div>
                  <div className="ba-stat-icon-wrapper" style={{ backgroundColor: '#ecfdf5', color: '#16a34a' }}>
                    <TrendingUp size={22} />
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="ba-stat-card">
                  <div className="ba-stat-content">
                    <span className="ba-stat-label">{locale === 'vi' ? 'Mức Hợp đồng trung bình' : 'Avg Startup Billing'}</span>
                    <span className="ba-stat-value">
                      {formatCurrency(38500000)}
                    </span>
                    <span className="ba-stat-desc">Per active startup profile</span>
                  </div>
                  <div className="ba-stat-icon-wrapper" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
                    <CreditCard size={22} />
                  </div>
                </div>
              </div>

              {/* Startup invoices / billings ledger (NO DEV DETAILS) */}
              <div className="ba-table-container" style={{ marginTop: '24px' }}>
                <div className="ba-table-header">
                  <h3 className="ba-table-header-title">{locale === 'vi' ? 'Hợp đồng tài chính Startup' : 'Startup Client Ledger'}</h3>
                </div>
                <table className="ba-table">
                  <thead>
                    <tr>
                      <th>{locale === 'vi' ? 'Startup' : 'Startup Lead'}</th>
                      <th>{locale === 'vi' ? 'Người đại diện' : 'Representative'}</th>
                      <th>{locale === 'vi' ? 'Doanh thu HĐ / tháng' : 'Contract MRR'}</th>
                      <th>{locale === 'vi' ? 'Kỳ thanh toán' : 'Cycle'}</th>
                      <th>{locale === 'vi' ? 'Trạng thái pháp nhân' : 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.filter(l => l.status === 'partnered').map((lead) => (
                      <tr key={lead.id}>
                        <td style={{ fontWeight: '600', color: '#0f172a' }}>{lead.name}</td>
                        <td style={{ color: '#64748b' }}>{lead.founderName} ({lead.email})</td>
                        <td style={{ fontWeight: '700', color: '#334155', fontFamily: 'monospace' }}>{formatCurrency(lead.revenue)}</td>
                        <td style={{ color: '#64748b' }}>Monthly Net 15</td>
                        <td>
                          <span className="ba-badge ba-badge-success" style={{ borderRadius: '4px' }}>
                            Active Agency
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

      </div>

      {/* 4. SHEET / SLIDING DRAWER COMPONENT (TAB 2: EDIT JOB SPEC) */}
      {isSheetOpen && selectedJobSpec && (
        <div className="ba-sheet-backdrop">
          {/* Clickable Backdrop */}
          <div onClick={() => setIsSheetOpen(false)} style={{ position: 'absolute', inset: 0 }}></div>

          {/* Sheet Panel */}
          <div className="ba-sheet-panel">
            <div>
              {/* Sheet header */}
              <div className="ba-sheet-header">
                <div>
                  <span className="ba-sheet-mono">{selectedJobSpec.id}</span>
                  <h3 className="ba-sheet-title">{locale === 'vi' ? 'Duyệt & Sửa Job Spec' : 'Edit Client Job Spec'}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSheetOpen(false)}
                  className="ba-close-btn"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Sheet Form */}
              <div className="ba-sheet-body">
                <div className="ba-form-group">
                  <label className="ba-form-label">{locale === 'vi' ? 'Tiêu đề vị trí tuyển dụng' : 'Job Title'}</label>
                  <input
                    type="text"
                    className="ba-input"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                </div>

                <div className="ba-form-group">
                  <label className="ba-form-label">{locale === 'vi' ? 'Doanh nghiệp Startup' : 'Startup Client'}</label>
                  <input
                    type="text"
                    className="ba-input"
                    value={editStartup}
                    onChange={(e) => setEditStartup(e.target.value)}
                  />
                </div>

                <div className="ba-form-group">
                  <label className="ba-form-label">{locale === 'vi' ? 'Ngân sách tuyển dụng' : 'Budget'}</label>
                  <input
                    type="text"
                    className="ba-input"
                    value={editBudget}
                    onChange={(e) => setEditBudget(e.target.value)}
                  />
                </div>

                <div className="ba-form-group">
                  <label className="ba-form-label">{locale === 'vi' ? 'Trạng thái hoạt động' : 'Status'}</label>
                  <select
                    className="ba-input"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                  >
                    <option value="Pending">Pending Approval</option>
                    <option value="Active">Active / Hiring</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div className="ba-form-group">
                  <label className="ba-form-label">{locale === 'vi' ? 'Kỹ năng (cách nhau bởi dấu phẩy)' : 'Required Tags (comma-separated)'}</label>
                  <input
                    type="text"
                    className="ba-input"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                  />
                </div>

                <div className="ba-form-group">
                  <label className="ba-form-label">{locale === 'vi' ? 'Mô tả công việc' : 'Description'}</label>
                  <textarea
                    rows={4}
                    className="ba-input"
                    style={{ resize: 'none', fontFamily: 'inherit' }}
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Sheet footer CTA buttons */}
            <div className="ba-sheet-footer">
              <button
                type="button"
                onClick={() => setIsSheetOpen(false)}
                className="ba-btn-secondary"
                style={{ flex: 1 }}
              >
                {locale === 'vi' ? 'Hủy bỏ' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleSaveJobSpec}
                className="ba-btn-primary"
                style={{ flex: 1 }}
              >
                {locale === 'vi' ? 'Lưu & Duyệt' : 'Approve & Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. DIALOG / MODAL POPUP (TAB 1: ADD STARTUP LEAD) */}
      {isLeadModalOpen && (
        <div className="ba-dialog-backdrop">
          {/* Clickable Backdrop */}
          <div onClick={() => setIsLeadModalOpen(false)} style={{ position: 'absolute', inset: 0 }}></div>

          {/* Modal Panel Container */}
          <form 
            onSubmit={handleAddLead}
            className="ba-dialog-panel"
          >
            <div className="ba-dialog-header">
              <h3 className="ba-dialog-title">{locale === 'vi' ? 'Đăng ký Startup Lead mới' : 'Add New Startup Lead'}</h3>
              <button
                type="button"
                onClick={() => setIsLeadModalOpen(false)}
                className="ba-close-btn"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form inputs */}
            <div className="ba-dialog-body">
              <div className="ba-form-group">
                <label className="ba-form-label">{locale === 'vi' ? 'Tên doanh nghiệp / Startup *' : 'Startup Company Name *'}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lambda AI"
                  className="ba-input"
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                />
              </div>

              <div className="ba-form-group">
                <label className="ba-form-label">{locale === 'vi' ? 'Người sáng lập / Đại diện *' : 'Founder / Representative *'}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  className="ba-input"
                  value={newLeadFounder}
                  onChange={(e) => setNewLeadFounder(e.target.value)}
                />
              </div>

              <div className="ba-form-group">
                <label className="ba-form-label">{locale === 'vi' ? 'Email liên hệ *' : 'Contact Email *'}</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. founder@lambda.ai"
                  className="ba-input"
                  value={newLeadEmail}
                  onChange={(e) => setNewLeadEmail(e.target.value)}
                />
              </div>

              <div className="ba-form-group">
                <label className="ba-form-label">{locale === 'vi' ? 'Giai đoạn tiếp cận' : 'Pipeline Phase'}</label>
                <select
                  className="ba-input"
                  value={newLeadStatus}
                  onChange={(e) => setNewLeadStatus(e.target.value as any)}
                >
                  <option value="contacted">Contacted</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="partnered">Partnered</option>
                </select>
              </div>
            </div>

            {/* CTAs */}
            <div className="ba-dialog-footer">
              <button
                type="button"
                onClick={() => setIsLeadModalOpen(false)}
                className="ba-btn-secondary"
                style={{ flex: 1 }}
              >
                {locale === 'vi' ? 'Hủy' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="ba-btn-primary"
                style={{ flex: 1 }}
              >
                {locale === 'vi' ? 'Đăng ký Lead' : 'Register Lead'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Global CSS Style Injections */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Unified Theme variables for BAPortal */
        .ba-title {
          font-size: 22px !important;
          font-weight: 700 !important;
          color: var(--text-primary) !important;
          letter-spacing: -0.02em !important;
          margin: 0 !important;
        }

        .ba-subtitle {
          font-size: 13px !important;
          color: var(--text-secondary) !important;
          margin: 4px 0 0 0 !important;
        }

        .ba-header-section {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          margin-bottom: 24px !important;
        }

        /* Buttons */
        .ba-btn-primary {
          background-color: var(--primary) !important;
          color: #ffffff !important;
          font-size: 12.5px !important;
          font-weight: 600 !important;
          padding: 8px 16px !important;
          border-radius: 10px !important;
          border: none !important;
          cursor: pointer !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 6px !important;
          box-shadow: 0 1px 2px 0 rgba(79, 70, 229, 0.1) !important;
          transition: all 0.15s !important;
        }

        .ba-btn-primary:hover {
          background-color: var(--primary-hover) !important;
          transform: translateY(-0.5px);
        }

        .ba-btn-primary:active {
          transform: translateY(0);
        }

        .ba-btn-secondary {
          background-color: var(--surface) !important;
          color: var(--text-secondary) !important;
          border: 1px solid var(--border) !important;
          font-size: 12.5px !important;
          font-weight: 600 !important;
          padding: 8px 16px !important;
          border-radius: 10px !important;
          cursor: pointer !important;
          transition: all 0.15s !important;
        }

        .ba-btn-secondary:hover {
          background-color: var(--surface-hover) !important;
          border-color: var(--text-muted) !important;
        }

        /* Kanban board layout */
        .ba-kanban-grid {
          display: grid !important;
          grid-template-columns: repeat(4, 1fr) !important;
          gap: 20px !important;
          margin-top: 16px !important;
        }

        @media (max-width: 1024px) {
          .ba-kanban-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 640px) {
          .ba-kanban-grid {
            grid-template-columns: 1fr !important;
          }
        }

        .ba-kanban-column {
          background-color: var(--surface-hover) !important;
          border: 1px solid var(--border) !important;
          border-radius: 16px !important;
          padding: 16px !important;
          min-height: 520px !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 12px !important;
        }

        .ba-kanban-column-header {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          padding-bottom: 8px !important;
          border-bottom: 1px solid var(--border) !important;
          margin-bottom: 4px !important;
        }

        .ba-column-title {
          font-size: 11px !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          color: var(--text-secondary) !important;
        }

        .ba-column-count {
          font-size: 10px !important;
          font-weight: 700 !important;
          background-color: var(--border) !important;
          color: var(--text-secondary) !important;
          padding: 2px 6px !important;
          border-radius: 9999px !important;
        }

        .ba-kanban-card {
          background-color: var(--surface) !important;
          border: 1px solid var(--border) !important;
          border-radius: 12px !important;
          padding: 16px !important;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04) !important;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        .ba-kanban-card:hover {
          transform: translateY(-2px) !important;
          box-shadow: var(--shadow-md) !important;
          border-color: var(--text-muted) !important;
        }

        .ba-card-name {
          font-size: 13.5px !important;
          font-weight: 600 !important;
          color: var(--text-primary) !important;
          margin: 0 !important;
        }

        .ba-card-id {
          font-size: 10px !important;
          color: var(--text-muted) !important;
          font-family: monospace !important;
        }

        .ba-card-meta {
          font-size: 11.5px !important;
          color: var(--text-secondary) !important;
          margin-top: 8px !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 4px !important;
        }

        .ba-card-meta-item {
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
        }

        .ba-card-meta-item svg {
          color: var(--text-muted) !important;
        }

        .ba-card-footer {
          margin-top: 12px !important;
          padding-top: 10px !important;
          border-top: 1px solid var(--border) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          font-size: 10.5px !important;
          color: var(--text-muted) !important;
        }

        .ba-card-action-btn {
          background: transparent !important;
          border: none !important;
          color: var(--primary) !important;
          font-size: 10.5px !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          gap: 2px !important;
          padding: 2px 4px !important;
          border-radius: 4px !important;
        }

        .ba-card-action-btn:hover {
          color: var(--primary-hover) !important;
          background-color: var(--surface-hover) !important;
        }

        .ba-card-action-drop {
          color: var(--danger) !important;
        }

        .ba-card-action-drop:hover {
          color: var(--danger) !important;
          opacity: 0.8 !important;
        }

        /* Tables list styles */
        .ba-table-container {
          background-color: var(--surface) !important;
          border: 1px solid var(--border) !important;
          border-radius: 16px !important;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04) !important;
          overflow: hidden !important;
        }

        .ba-table {
          width: 100% !important;
          border-collapse: collapse !important;
          text-align: left !important;
        }

        .ba-table th {
          background-color: var(--surface-hover) !important;
          border-bottom: 1px solid var(--border) !important;
          padding: 14px 20px !important;
          font-size: 11.5px !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          color: var(--text-secondary) !important;
        }

        .ba-table td {
          padding: 14px 20px !important;
          border-bottom: 1px solid var(--border) !important;
          font-size: 13.5px !important;
          color: var(--text-primary) !important;
        }

        .ba-table tr:last-child td {
          border-bottom: none !important;
        }

        .ba-table tr:hover td {
          background-color: var(--surface-hover) !important;
        }

        .ba-tag-badge {
          background-color: var(--primary-light) !important;
          border: 1px solid var(--primary-light) !important;
          color: var(--primary) !important;
          font-size: 10.5px !important;
          font-weight: 600 !important;
          padding: 2px 6px !important;
          border-radius: 6px !important;
        }

        .ba-action-link {
          background: transparent !important;
          border: none !important;
          color: var(--primary) !important;
          font-size: 12px !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 4px !important;
          padding: 6px 12px !important;
          border-radius: 8px !important;
          transition: all 0.2s !important;
        }

        .ba-action-link:hover {
          color: var(--primary-hover) !important;
          background-color: var(--surface-hover) !important;
        }

        /* Badges */
        .ba-badge {
          display: inline-flex !important;
          align-items: center !important;
          gap: 4px !important;
          font-size: 11px !important;
          font-weight: 700 !important;
          padding: 3px 8px !important;
          border-radius: 9999px !important;
          line-height: 1.2 !important;
        }

        .ba-badge-success {
          background-color: var(--success-bg) !important;
          color: var(--success) !important;
        }

        .ba-badge-warning {
          background-color: var(--warning-bg) !important;
          color: var(--warning) !important;
        }

        .ba-badge-info {
          background-color: var(--primary-light) !important;
          color: var(--primary) !important;
        }

        .ba-badge-danger {
          background-color: var(--danger-bg) !important;
          color: var(--danger) !important;
        }

        .ba-badge-neutral {
          background-color: var(--border) !important;
          color: var(--text-secondary) !important;
        }

        /* Support Tickets styles */
        .ba-ticket-card {
          background-color: var(--surface) !important;
          border: 1px solid var(--border) !important;
          border-radius: 16px !important;
          padding: 20px !important;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04) !important;
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          gap: 16px !important;
        }

        @media (max-width: 768px) {
          .ba-ticket-card {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }

        .ba-ticket-header-meta {
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
        }

        .ba-ticket-id {
          font-family: monospace !important;
          font-weight: 700 !important;
          color: var(--primary) !important;
          font-size: 11.5px !important;
        }

        .ba-ticket-divider {
          color: var(--border) !important;
        }

        .ba-ticket-client {
          font-size: 11.5px !important;
          color: var(--text-secondary) !important;
          font-weight: 600 !important;
          background-color: var(--background) !important;
          padding: 2px 6px !important;
          border-radius: 4px !important;
        }

        .ba-priority-badge {
          font-size: 9.5px !important;
          font-weight: 800 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          padding: 2px 6px !important;
          border-radius: 4px !important;
          border: 1px solid transparent !important;
        }

        .ba-priority-badge.high {
          background-color: var(--danger-bg) !important;
          color: var(--danger) !important;
          border-color: var(--danger-bg) !important;
        }

        .ba-priority-badge.medium {
          background-color: var(--warning-bg) !important;
          color: var(--warning) !important;
          border-color: var(--warning-bg) !important;
        }

        .ba-priority-badge.low {
          background-color: var(--surface-hover) !important;
          color: var(--text-secondary) !important;
          border-color: var(--border) !important;
        }

        .ba-ticket-title {
          font-size: 15px !important;
          font-weight: 600 !important;
          color: var(--text-primary) !important;
          margin: 6px 0 !important;
        }

        .ba-ticket-date {
          font-size: 11px !important;
          color: var(--text-muted) !important;
        }

        .ba-ticket-actions {
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
        }

        /* Billing MRR Analytics Stats Grid */
        .ba-stats-grid {
          display: grid !important;
          grid-template-columns: repeat(3, 1fr) !important;
          gap: 20px !important;
        }

        @media (max-width: 768px) {
          .ba-stats-grid {
            grid-template-columns: 1fr !important;
          }
        }

        .ba-stat-card {
          background-color: var(--surface) !important;
          border: 1px solid var(--border) !important;
          border-radius: 16px !important;
          padding: 20px !important;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04) !important;
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
        }

        .ba-stat-content {
          display: flex !important;
          flex-direction: column !important;
          gap: 4px !important;
        }

        .ba-stat-label {
          font-size: 11px !important;
          font-weight: 700 !important;
          color: var(--text-muted) !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
        }

        .ba-stat-value {
          font-size: 22px !important;
          font-weight: 800 !important;
          color: var(--text-primary) !important;
        }

        .ba-stat-desc {
          font-size: 10px !important;
          color: var(--text-muted) !important;
        }

        .ba-stat-icon-wrapper {
          width: 44px !important;
          height: 44px !important;
          border-radius: 12px !important;
          background-color: var(--primary-light) !important;
          color: var(--primary) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .ba-table-header {
          padding: 16px 20px !important;
          border-bottom: 1px solid var(--border) !important;
          background-color: var(--surface-hover) !important;
        }

        .ba-table-header-title {
          font-size: 14px !important;
          font-weight: 700 !important;
          color: var(--text-primary) !important;
          margin: 0 !important;
        }

        /* Slide sheet styles */
        .ba-sheet-backdrop {
          position: fixed !important;
          inset: 0 !important;
          background-color: rgba(15, 23, 42, 0.4) !important;
          backdrop-filter: blur(2px) !important;
          -webkit-backdrop-filter: blur(2px) !important;
          z-index: 9999 !important;
          display: flex !important;
          justify-content: flex-end !important;
        }

        .ba-sheet-panel {
          width: 100% !important;
          max-width: 420px !important;
          background-color: var(--surface) !important;
          height: 100% !important;
          box-shadow: -10px 0 25px -5px rgba(0, 0, 0, 0.08) !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: space-between !important;
          padding: 24px !important;
          border-left: 1px solid var(--border) !important;
          z-index: 10000 !important;
          animation: baSlideLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
        }

        .ba-sheet-header {
          display: flex !important;
          justify-content: space-between !important;
          align-items: flex-start !important;
          padding-bottom: 16px !important;
          border-bottom: 1px solid var(--border) !important;
        }

        .ba-sheet-mono {
          font-size: 11px !important;
          font-weight: 700 !important;
          color: var(--primary) !important;
          font-family: monospace !important;
          text-transform: uppercase !important;
        }

        .ba-sheet-title {
          font-size: 17px !important;
          font-weight: 700 !important;
          color: var(--text-primary) !important;
          margin: 2px 0 0 0 !important;
        }

        .ba-close-btn {
          background: transparent !important;
          border: none !important;
          color: var(--text-muted) !important;
          cursor: pointer !important;
          padding: 4px !important;
          border-radius: 6px !important;
          display: flex !important;
          align-items: center;
          justify-content: center;
        }

        .ba-close-btn:hover {
          color: var(--text-primary) !important;
          background-color: var(--surface-hover) !important;
        }

        .ba-sheet-body {
          display: flex !important;
          flex-direction: column !important;
          gap: 16px !important;
          margin-top: 20px !important;
          overflow-y: auto !important;
          max-height: 70vh !important;
          padding-right: 2px !important;
        }

        .ba-form-group {
          display: flex !important;
          flex-direction: column !important;
          gap: 6px !important;
        }

        .ba-form-label {
          font-size: 10px !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          color: var(--text-secondary) !important;
          letter-spacing: 0.05em !important;
        }

        .ba-input {
          width: 100% !important;
          background-color: var(--background) !important;
          border: 1px solid var(--border) !important;
          border-radius: 10px !important;
          padding: 8px 12px !important;
          font-size: 13.5px !important;
          color: var(--text-primary) !important;
          transition: all 0.15s !important;
        }

        .ba-input:focus {
          outline: none !important;
          border-color: var(--primary) !important;
          background-color: var(--surface) !important;
          box-shadow: 0 0 0 3px var(--primary-light) !important;
        }

        .ba-sheet-footer {
          display: flex !important;
          gap: 12px !important;
          padding-top: 16px !important;
          border-top: 1px solid var(--border) !important;
        }

        /* Modal Dialog styles */
        .ba-dialog-backdrop {
          position: fixed !important;
          inset: 0 !important;
          background-color: rgba(15, 23, 42, 0.4) !important;
          backdrop-filter: blur(2px) !important;
          -webkit-backdrop-filter: blur(2px) !important;
          z-index: 9999 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 16px !important;
        }

        .ba-dialog-panel {
          width: 100% !important;
          max-width: 400px !important;
          background-color: var(--surface) !important;
          border-radius: 16px !important;
          border: 1px solid var(--border) !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.06), 0 10px 10px -5px rgba(0, 0, 0, 0.03) !important;
          padding: 20px !important;
          display: flex !important;
          flex-direction: column !important;
          z-index: 10000 !important;
          animation: baZoomIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
        }

        .ba-dialog-header {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          padding-bottom: 12px !important;
          border-bottom: 1px solid var(--border) !important;
        }

        .ba-dialog-title {
          font-size: 15px !important;
          font-weight: 700 !important;
          color: var(--text-primary) !important;
          margin: 0 !important;
        }

        .ba-dialog-body {
          display: flex !important;
          flex-direction: column !important;
          gap: 14px !important;
          margin-top: 16px !important;
        }

        .ba-dialog-footer {
          display: flex !important;
          gap: 12px !important;
          margin-top: 20px !important;
          padding-top: 12px !important;
          border-top: 1px solid var(--border) !important;
        }

        /* Animations */
        @keyframes baSlideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        @keyframes baZoomIn {
          from { transform: scale(0.96); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .ba-animate-fade-in {
          animation: baFadeIn 0.2s ease-out forwards !important;
        }

        @keyframes baFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .ba-pulse-light {
          animation: baPulseLight 2s infinite !important;
        }

        @keyframes baPulseLight {
          0% { opacity: 0.8; }
          50% { opacity: 1; }
          100% { opacity: 0.8; }
        }
      `}} />
    </div>
  );
}
