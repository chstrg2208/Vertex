'use client';

import React, { useState } from 'react';
import { UserCheck, Users, Briefcase, Layers, Plus, Search, FileText, ChevronRight, Check, X, ShieldAlert, ArrowUpRight, CloudUpload, Play, Terminal, MessageSquare } from 'lucide-react';
import { createCandidate, createJob, updateApplicationStatus } from '@/app/actions';
import { useRouter } from 'next/navigation';
import ChatTab from '../ChatTab';

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
  tags: string[];
  description: string;
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

import { Locale } from '@/utils/translations';

interface PortalWorkspaceProps {
  candidates: Candidate[];
  jobs: Job[];
  applications: Application[];
  messages: any[];
  currentUser: { name: string; role: 'ta' | 'ba' };
  onOpenChat: (contactName: string) => void;
  activeChatContactName: string | null;
  onSelectChatContactName: (name: string | null) => void;
  locale: Locale;
}

const portalTranslations = {
  vi: {
    sidebarHeaderTA: "Hệ thống TA Staff",
    sidebarHeaderBA: "Hệ thống BA Manager",
    tabOverview: "Tổng Quan",
    tabTalents: "Danh Sách Nhân Sự",
    tabAddTalent: "Trích Xuất & Thêm CV",
    tabRequests: "Yêu Cầu Tuyển Dụng",
    tabPartners: "Đối Tác",
    tabChat: "Trò Chuyện Tuyển Dụng",
    
    // Overview TA
    statTotalDevs: "Tổng số Developer",
    statActiveVetted: "Nhân sự Sẵn sàng",
    statReadyDevsSub: "Sẵn sàng nhận dự án",
    statActiveApps: "Dự án Đang Cho Thuê",
    statActiveAppsSub: "đang bàn giao",
    statNewDevsMonth: "+4 nhân sự tháng này",
    
    // Overview BA
    statTotalReqs: "Tổng số Yêu Cầu",
    statTotalReqsSub: "Yêu cầu từ startup/khách",
    statTotalPartners: "Công ty Đối tác",
    statTotalPartnersSub: "Đồng bộ pháp nhân",
    statActiveProjects: "Dự án Đang Hoạt Động",
    statActiveProjectsSub: "đang chạy dự án",

    // Panel Headers & Lists
    assignmentActivity: "Hoạt Động Phân Công Gần Đây",
    recentRequestsActivity: "Yêu Cầu Tuyển Dụng Gần Đây",
    hiredStatus: "ĐÃ NHẬN",
    appliedStatus: "NỘP ĐƠN",
    featuredTalents: "Mẫu Nhân Sự Nổi Bật",
    featuredTalentsSub: "experts sẵn sàng làm việc",
    featuredTalentsSub2: "developers đang cho thuê",
    featuredTalentsSub3: "experts đang hoạt động",
    
    // Talents List
    searchPlh: "Tìm kiếm tài năng theo tên, email hoặc kỹ năng...",
    colName: "Họ tên",
    colRole: "Vị trí chuyên môn",
    colSkills: "Kỹ năng nổi bật",
    colLocation: "Địa điểm",
    colActions: "Hành động",
    btnViewCV: "Xem CV",
    btnChat: "Chat",

    // Add CV Parser
    uploadTitle: "Tải lên CV PDF để bắt đầu phân tích tự động",
    uploadSub: "Hệ thống NLP/LLM của Vertex sẽ tự động trích xuất các kỹ năng, kinh nghiệm và thông tin cá nhân.",
    btnUpload: "Chọn tệp tin PDF",
    fileReceived: "✓ Đã nhận tệp:",
    btnExtract: "Trích xuất CV",
    btnExtracting: "Đang phân tích...",
    btnDemo: "Dùng CV mẫu thử nghiệm",
    terminalTitle: "Vertex AI Parser Engine v2.1",
    terminalRunning: "█ Đang phân tích dữ liệu...",
    extractedTitle: "Thông Tin CV Đã Trích Xuất",
    extractedSub: "Vui lòng kiểm tra lại thông tin và điều chỉnh trước khi xác nhận lưu vào database.",
    fieldFullName: "Họ và tên",
    fieldDesiredRole: "Vị trí mong muốn",
    fieldEmail: "Email",
    fieldPhone: "Số điện thoại",
    fieldLocation: "Địa điểm",
    fieldSkills: "Kỹ năng chuyên môn (cách nhau bằng dấu phẩy)",
    fieldSummary: "Tóm tắt năng lực",
    btnSaveCandidate: "Xác nhận và Tạo nhân sự IT",
    alertSaveSuccess: "Tạo nhân sự mới thành công và đồng bộ lên PostgreSQL!",
    alertSaveError: "Tạo nhân sự thất bại",
    alertFieldsMissing: "Vui lòng nhập đầy đủ tên, email và số điện thoại!",

    // Job Requests
    jobHeader: "Danh Sách Yêu Cầu Tuyển Dụng",
    jobSub: "Các vị trí IT mà khách hàng của Vertex đang đặt hàng.",
    clientLabel: "Khách hàng:",
    badgeRequest: "YC Tuyển Dụng",

    // Partners
    partnerHeader: "Mạng Lưới Đối Tác Cung Ứng & Freelancers",
    colPartnerCode: "Mã đối tác",
    colPartnerName: "Tên đối tác",
    colPartnerType: "Loại đối tác",
    colPartnerTax: "Mã số thuế",
    colPartnerRep: "Người đại diện",
    colPartnerTalents: "Số lượng Dev cung ứng",
    partnerCompany: "Công ty đối tác",
    partnerFreelancer: "Freelancer cá nhân",
    partnerDevsCount: "dev",

    // Chat
    chatHeader: "Hệ thống Chat Tuyển dụng",

    // CV Modal
    modalCvHeader: "Thông tin CV nhân sự IT:",
    modalSummaryHeader: "Tóm tắt bản thân",
    modalSkillsHeader: "Kỹ năng",
    modalExpHeader: "Kinh nghiệm làm việc",
    modalEduHeader: "Học vấn",
    modalBtnClose: "Đóng",

    // CV Parser logs
    log1: "🚀 Khởi động parser động cơ AI...",
    log2: "🔍 Đọc cấu trúc nhị phân PDF (PDF Text Extractor)...",
    log3: "📄 Tìm kiếm thực thể (NER: Name, Email, Phone)...",
    log4: "⚡ Phân tích cây kỹ năng kỹ thuật (React, TypeScript, Tailwind)...",
    log5: "💼 Phân tách phần lịch sử kinh nghiệm và thời gian học tập...",
    log6: "✨ Hoàn tất chuẩn hóa thông tin CV!"
  },
  en: {
    sidebarHeaderTA: "TA Staff System",
    sidebarHeaderBA: "BA Manager System",
    tabOverview: "Overview",
    tabTalents: "Talents List",
    tabAddTalent: "Extract & Add CV",
    tabRequests: "Job Requests",
    tabPartners: "Partners",
    tabChat: "Recruitment Chat",
    
    // Overview TA
    statTotalDevs: "Total Developers",
    statActiveVetted: "Available Engineers",
    statReadyDevsSub: "Ready for projects",
    statActiveApps: "Engineers Hired",
    statActiveAppsSub: "active placements",
    statNewDevsMonth: "+4 talent added this month",
    
    // Overview BA
    statTotalReqs: "Total Job Requests",
    statTotalReqsSub: "Client requisitions",
    statTotalPartners: "Partner Agencies",
    statTotalPartnersSub: "Vendor entities",
    statActiveProjects: "Active Deliveries",
    statActiveProjectsSub: "projects in delivery",

    // Panel Headers & Lists
    assignmentActivity: "Recent Assignment Activity",
    recentRequestsActivity: "Recent Job Requests",
    hiredStatus: "HIRED",
    appliedStatus: "APPLIED",
    featuredTalents: "Featured Talent Profiles",
    featuredTalentsSub: "experts ready to onboard",
    featuredTalentsSub2: "developers on billing",
    featuredTalentsSub3: "experts active",
    
    // Talents List
    searchPlh: "Search talent by name, email or skills...",
    colName: "Full Name",
    colRole: "Specialty / Role",
    colSkills: "Core Skills",
    colLocation: "Location",
    colActions: "Actions",
    btnViewCV: "View CV",
    btnChat: "Chat",

    // Add CV Parser
    uploadTitle: "Upload CV PDF for Auto AI Parsing",
    uploadSub: "Our NLP/LLM parser engine will automatically extract skills, work history, and contact details.",
    btnUpload: "Choose PDF File",
    fileReceived: "✓ Received file:",
    btnExtract: "Extract CV",
    btnExtracting: "Parsing...",
    btnDemo: "Use Demo CV Sandbox",
    terminalTitle: "Vertex AI Parser Engine v2.1",
    terminalRunning: "█ Parsing document data...",
    extractedTitle: "Extracted Candidate Profile",
    extractedSub: "Please review and edit the parsed information before committing to the database.",
    fieldFullName: "Full Name",
    fieldDesiredRole: "Desired Title",
    fieldEmail: "Email Address",
    fieldPhone: "Phone Number",
    fieldLocation: "Location",
    fieldSkills: "Core Skills (comma separated)",
    fieldSummary: "Professional Summary",
    btnSaveCandidate: "Verify and Save IT Talent",
    alertSaveSuccess: "New candidate profile created and synced to PostgreSQL!",
    alertSaveError: "Failed to create candidate",
    alertFieldsMissing: "Please enter name, email, and phone number!",

    // Job Requests
    jobHeader: "Client Staffing & Job Requests",
    jobSub: "Active requisitions placed by client businesses via Vertex.",
    clientLabel: "Client:",
    badgeRequest: "Job Request",

    // Partners
    partnerHeader: "Vendor & Freelancer Network",
    colPartnerCode: "Vendor ID",
    colPartnerName: "Entity Name",
    colPartnerType: "Classification",
    colPartnerTax: "Tax Code",
    colPartnerRep: "Representative",
    colPartnerTalents: "Talents Supplied",
    partnerCompany: "Partner Agency",
    partnerFreelancer: "Independent Freelancer",
    partnerDevsCount: "devs",

    // Chat
    chatHeader: "Recruitment Conversation Center",

    // CV Modal
    modalCvHeader: "IT Talent CV Profile:",
    modalSummaryHeader: "Summary",
    modalSkillsHeader: "Skills",
    modalExpHeader: "Work Experience",
    modalEduHeader: "Education",
    modalBtnClose: "Close",

    // CV Parser logs
    log1: "🚀 Initializing AI parser engine...",
    log2: "🔍 Extracting PDF binary schema...",
    log3: "📄 Scanning for entity tokens (NER)...",
    log4: "⚡ Mapping hard skills (React, TypeScript)...",
    log5: "💼 Parsing history and education scopes...",
    log6: "✨ Normalizing candidate properties!"
  }
};

export default function PortalWorkspace({
  candidates,
  jobs,
  applications,
  messages,
  currentUser,
  onOpenChat,
  activeChatContactName,
  onSelectChatContactName,
  locale,
}: PortalWorkspaceProps) {
  const router = useRouter();
  const pt = portalTranslations[locale];
  const isTA = currentUser.role === 'ta';

  // State management
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'talents' | 'add-talent' | 'requests' | 'partners' | 'chat'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewingCandidateCV, setViewingCandidateCV] = useState<Candidate | null>(null);

  // CV Parser Simulation State
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parseSteps, setParseSteps] = useState<string[]>([]);
  const [parsedData, setParsedData] = useState<Partial<Candidate> | null>(null);

  // Form inputs for editing parsed data before submitting
  const [newName, setNewName] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newLocation, setNewLocation] = useState('Hà Nội');
  const [newSkills, setNewSkills] = useState('');
  const [newSummary, setNewSummary] = useState('');

  // Determine tabs list dynamically based on role
  const sidebarTabs = isTA
    ? [
        { id: 'overview', label: pt.tabOverview, icon: <Layers size={16} /> },
        { id: 'talents', label: pt.tabTalents, icon: <Users size={16} /> },
        { id: 'add-talent', label: pt.tabAddTalent, icon: <Plus size={16} /> },
        { id: 'chat', label: pt.tabChat, icon: <MessageSquare size={16} /> },
      ]
    : [
        { id: 'overview', label: pt.tabOverview, icon: <Layers size={16} /> },
        { id: 'requests', label: pt.tabRequests, icon: <Briefcase size={16} /> },
        { id: 'partners', label: pt.tabPartners, icon: <UserCheck size={16} /> },
        { id: 'chat', label: pt.tabChat, icon: <MessageSquare size={16} /> },
      ];

  // -------------------------------------------------------------
  // CV PARSER SCANNER SIMULATION ENGINE
  // -------------------------------------------------------------
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setIsFileUploaded(true);
    setParsedData(null);
  };

  const runDemoParser = () => {
    setFileName('CV_Nguyen_Hoang_Son_Frontend.pdf');
    setIsFileUploaded(true);
    setParsedData(null);
    triggerParsingSequence();
  };

  const triggerParsingSequence = () => {
    if (isParsing) return;
    setIsParsing(true);
    setParseSteps([]);

    const steps = [
      pt.log1,
      pt.log2,
      pt.log3,
      pt.log4,
      pt.log5,
      pt.log6
    ];

    let currentStepIdx = 0;
    const interval = setInterval(() => {
      if (currentStepIdx < steps.length) {
        setParseSteps((prev) => [...prev, steps[currentStepIdx]]);
        currentStepIdx++;
      } else {
        clearInterval(interval);
        // Load data mockup
        const extracted: Partial<Candidate> = {
          name: 'Nguyễn Hoàng Sơn',
          title: 'Frontend React Developer (Mid Level)',
          email: 'son.nh@gmail.com',
          phone: '0908889999',
          location: 'Hà Nội (Hybrid)',
          summary: locale === 'vi' 
            ? 'Lập trình viên Frontend có 3 năm kinh nghiệm phát triển ứng dụng giao diện web phản hồi nhanh, am hiểu các thư viện UI động và API Restful.'
            : 'Frontend developer with 3 years of experience developing responsive web interfaces, proficient in dynamic UI libraries and RESTful APIs.',
          skills: ['React', 'TypeScript', 'CSS', 'Tailwind', 'RESTful API', 'Git'],
          experience: [
            { company: 'CMC Global', role: 'Frontend Developer', duration: '2023 - Present', description: 'Phát triển dự án Outsource web sàn giao dịch bất động sản.' }
          ],
          education: [
            { school: 'Đại học Bách Khoa Hà Nội', degree: 'Cử nhân CNTT', duration: '2019 - 2023' }
          ]
        };

        setParsedData(extracted);
        // Pre-fill forms
        setNewName(extracted.name || '');
        setNewTitle(extracted.title || '');
        setNewEmail(extracted.email || '');
        setNewPhone(extracted.phone || '');
        setNewLocation(locale === 'vi' ? 'Hà Nội' : 'Hanoi');
        setNewSkills(extracted.skills?.join(', ') || '');
        setNewSummary(extracted.summary || '');
        setIsParsing(false);
      }
    }, 800);
  };

  const handleSaveParsedCandidate = async () => {
    if (!newName || !newEmail || !newPhone) {
      alert(pt.alertFieldsMissing);
      return;
    }

    const skillsArray = newSkills
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const result = await createCandidate({
      name: newName,
      title: newTitle,
      email: newEmail,
      phone: newPhone,
      location: newLocation,
      summary: newSummary,
      skills: skillsArray,
      experience: parsedData?.experience || [],
      education: parsedData?.education || [],
    });

    if (result.success) {
      alert(pt.alertSaveSuccess);
      setParsedData(null);
      setIsFileUploaded(false);
      setFileName('');
      setActiveSubTab('talents');
      router.refresh();
    } else {
      alert(result.error || pt.alertSaveError);
    }
  };

  // -------------------------------------------------------------
  // PARTNERS MOCK DATA
  // -------------------------------------------------------------
  const partners = [
    { code: 'PT-01', name: 'FPT Software', taxCode: '0101248130', rep: 'Nguyễn Lâm Phương', type: 'Công ty đối tác', talents: 12 },
    { code: 'PT-02', name: 'Rikkeisoft Joint Stock Company', taxCode: '0105898860', rep: 'Phan Thế Dũng', type: 'Công ty đối tác', talents: 8 },
    { code: 'PT-03', name: 'CMC Global', taxCode: '0107849122', rep: 'Nguyễn Trung Chính', type: 'Công ty đối tác', talents: 5 },
    { code: 'PT-04', name: 'Nguyễn Hoàng Long', taxCode: '8092837233', rep: 'Nguyễn Hoàng Long', type: 'Freelancer cá nhân', talents: 1 },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 'calc(100vh - 180px)', gap: '24px' }}>
      {/* Sidebar Navigation */}
      <aside className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', height: 'fit-content' }}>
        <h4 style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0 12px 8px 12px', borderBottom: '1px solid var(--border)' }}>
          {isTA ? pt.sidebarHeaderTA : pt.sidebarHeaderBA}
        </h4>
        {sidebarTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`nav-tab ${activeSubTab === tab.id ? 'active' : ''}`}
            style={{ width: '100%', justifyContent: 'flex-start', margin: 0 }}
            onClick={() => setActiveSubTab(tab.id as any)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </aside>

      {/* Main Workspace Frame */}
      <div className="tab-content" style={{ animation: 'fadeIn 0.25s ease' }}>
        
        {/* SUB-TAB 1: OVERVIEW */}
        {activeSubTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {isTA ? (
              /* TA Staff Overview */
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                <div className="card" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{pt.statTotalDevs}</div>
                  <div style={{ fontSize: '28px', fontWeight: 800, marginTop: '8px' }}>{candidates.length + 15}</div>
                  <div style={{ fontSize: '11px', color: 'var(--success)', marginTop: '4px' }}>{pt.statNewDevsMonth}</div>
                </div>
                <div className="card" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{pt.statActiveVetted}</div>
                  <div style={{ fontSize: '28px', fontWeight: 800, marginTop: '8px' }}>{candidates.filter(c => c.id % 2 === 0).length + 3}</div>
                  <div style={{ fontSize: '11px', color: 'var(--secondary)', marginTop: '4px' }}>{pt.statReadyDevsSub}</div>
                </div>
                <div className="card" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{pt.statActiveApps}</div>
                  <div style={{ fontSize: '28px', fontWeight: 800, marginTop: '8px' }}>{applications.length}</div>
                  <div style={{ fontSize: '11px', color: 'var(--primary)', marginTop: '4px' }}>{applications.length} {pt.statActiveAppsSub}</div>
                </div>
                <div className="card" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{pt.statTotalPartners}</div>
                  <div style={{ fontSize: '28px', fontWeight: 800, marginTop: '8px' }}>4 {locale === 'vi' ? 'đối tác' : 'partners'}</div>
                  <div style={{ fontSize: '11px', color: 'var(--success)', marginTop: '4px' }}>{pt.statTotalPartnersSub}</div>
                </div>
              </div>
            ) : (
              /* BA Manager Overview */
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                <div className="card" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{pt.statTotalReqs}</div>
                  <div style={{ fontSize: '28px', fontWeight: 800, marginTop: '8px' }}>{jobs.length}</div>
                  <div style={{ fontSize: '11px', color: 'var(--primary)', marginTop: '4px' }}>{pt.statTotalReqsSub}</div>
                </div>
                <div className="card" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{pt.statActiveProjects}</div>
                  <div style={{ fontSize: '28px', fontWeight: 800, marginTop: '8px' }}>{applications.length}</div>
                  <div style={{ fontSize: '11px', color: 'var(--success)', marginTop: '4px' }}>{applications.length} {pt.statActiveProjectsSub}</div>
                </div>
                <div className="card" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{pt.statTotalPartners}</div>
                  <div style={{ fontSize: '28px', fontWeight: 800, marginTop: '8px' }}>4 {locale === 'vi' ? 'đối tác' : 'partners'}</div>
                  <div style={{ fontSize: '11px', color: 'var(--success)', marginTop: '4px' }}>{pt.statTotalPartnersSub}</div>
                </div>
                <div className="card" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{pt.statTotalDevs}</div>
                  <div style={{ fontSize: '28px', fontWeight: 800, marginTop: '8px' }}>{candidates.length + 15}</div>
                  <div style={{ fontSize: '11px', color: 'var(--success)', marginTop: '4px' }}>{pt.statNewDevsMonth}</div>
                </div>
              </div>
            )}

            {/* Funnels & Feeds */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
              <div className="card" style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>
                  {isTA ? pt.assignmentActivity : pt.recentRequestsActivity}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {applications.map((app) => (
                    <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'var(--background)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                      <div>
                        <strong>{app.candidate.name}</strong> {locale === 'vi' ? 'được phái cử cho' : 'assigned to'} <strong>{app.job.title}</strong>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{pt.clientLabel} {app.job.company}</div>
                      </div>
                      <span className="badge" style={{
                        backgroundColor: app.status === 'HIRED' ? 'var(--success-bg)' : 'var(--primary-light)',
                        color: app.status === 'HIRED' ? 'var(--success)' : 'var(--primary)',
                      }}>
                        {app.status === 'HIRED' ? pt.hiredStatus : pt.appliedStatus}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recruitment Funnel stats */}
              <div className="card" style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>{pt.featuredTalents}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ padding: '10px', background: 'var(--background)', borderRadius: '6px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '13px' }}>Backend Spring Boot</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>3 {pt.featuredTalentsSub}</div>
                  </div>
                  <div style={{ padding: '10px', background: 'var(--background)', borderRadius: '6px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '13px' }}>React/NextJS Frontend</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>5 {pt.featuredTalentsSub2}</div>
                  </div>
                  <div style={{ padding: '10px', background: 'var(--background)', borderRadius: '6px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '13px' }}>DevOps Cloud AWS</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>2 {pt.featuredTalentsSub3}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 2: TALENTS LIST */}
        {activeSubTab === 'talents' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div className="search-input-wrapper" style={{ flex: 1 }}>
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder={pt.searchPlh}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Talents Table Grid */}
            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                <thead>
                  <tr style={{ background: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '14px 16px' }}>{pt.colName}</th>
                    <th style={{ padding: '14px 16px' }}>{pt.colRole}</th>
                    <th style={{ padding: '14px 16px' }}>{pt.colSkills}</th>
                    <th style={{ padding: '14px 16px' }}>{pt.colLocation}</th>
                    <th style={{ padding: '14px 16px' }}>{pt.colActions}</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates
                    .filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.skills.join(',').toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((c) => (
                      <tr key={c.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="table-row-hover">
                        <td style={{ padding: '14px 16px', fontWeight: 'bold' }}>{c.name}</td>
                        <td style={{ padding: '14px 16px', color: 'var(--primary)', fontWeight: 600 }}>{c.title}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {c.skills.slice(0, 3).map((s, idx) => (
                              <span key={idx} className="cv-skill-badge" style={{ fontSize: '10px' }}>{s}</span>
                            ))}
                            {c.skills.length > 3 && <span style={{ fontSize: '9px', opacity: 0.7 }}>+{c.skills.length - 3}</span>}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>{c.location}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              className="nav-tab"
                              style={{ padding: '4px 8px', fontSize: '11px', margin: 0, border: '1px solid var(--border)', background: 'var(--surface)' }}
                              onClick={() => setViewingCandidateCV(c)}
                            >
                              {pt.btnViewCV}
                            </button>
                            <button
                              type="button"
                              className="apply-btn"
                              style={{ padding: '4px 8px', fontSize: '11px', flex: 'none' }}
                              onClick={() => onOpenChat(c.name)}
                            >
                              {pt.btnChat}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Custom table css */}
            <style dangerouslySetInnerHTML={{__html: `
              .table-row-hover:hover {
                background-color: var(--surface-hover);
              }
            `}} />
          </div>
        )}

        {/* SUB-TAB 3: ADD TALENT & AI CV PARSER */}
        {activeSubTab === 'add-talent' && (
          <div style={{ display: 'grid', gridTemplateColumns: parsedData ? '1fr 1fr' : '1fr', gap: '24px' }}>
            
            {/* Left box: Upload CV file */}
            <div className="card" style={{ padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifySelf: 'stretch', gap: '20px' }}>
              <div style={{ border: '2px dashed var(--border)', padding: '40px 20px', borderRadius: '12px', background: 'rgba(79, 70, 229, 0.02)' }}>
                <CloudUpload size={48} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
                <h4>{pt.uploadTitle}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px', marginBottom: '24px' }}>
                  {pt.uploadSub}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="file"
                    accept=".pdf"
                    id="cv-file-upload"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                  />
                  <label
                    htmlFor="cv-file-upload"
                    className="apply-btn"
                    style={{ padding: '10px 20px', fontSize: '13.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    {pt.btnUpload}
                  </label>

                  {isFileUploaded && (
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--success)' }}>
                      {pt.fileReceived} {fileName}
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  type="button"
                  className="apply-btn"
                  style={{ background: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px' }}
                  onClick={triggerParsingSequence}
                  disabled={!isFileUploaded || isParsing}
                >
                  <Play size={16} />
                  {isParsing ? pt.btnExtracting : pt.btnExtract}
                </button>
                
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid var(--border)' }}
                  onClick={runDemoParser}
                  disabled={isParsing}
                >
                  {pt.btnDemo}
                </button>
              </div>

              {/* Parser Output Logs (Terminal style) */}
              {isParsing || parseSteps.length > 0 ? (
                <div style={{
                  background: '#0d1117',
                  color: '#39d353',
                  fontFamily: 'monospace',
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'left',
                  fontSize: '11.5px',
                  lineHeight: '1.5',
                  maxHeight: '220px',
                  overflowY: 'auto'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid #21262d', paddingBottom: '6px', marginBottom: '8px', color: '#8b949e' }}>
                    <Terminal size={14} />
                    <span>{pt.terminalTitle}</span>
                  </div>
                  {parseSteps.map((step, idx) => (
                    <div key={idx} style={{ marginBottom: '4px' }}>
                      {step}
                    </div>
                  ))}
                  {isParsing && (
                    <div className="animate-pulse" style={{ animation: 'pulse 1s infinite' }}>{pt.terminalRunning}</div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Right box: Extracted Fields (Forms) */}
            {parsedData && (
              <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', animation: 'slideLeft 0.3s ease' }}>
                <h3 style={{ fontSize: '16px', color: 'var(--success)' }}>{pt.extractedTitle}</h3>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '-8px' }}>
                  {pt.extractedSub}
                </p>

                <div className="form-group">
                  <label>{pt.fieldFullName}</label>
                  <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} />
                </div>

                <div className="form-group">
                  <label>{pt.fieldDesiredRole}</label>
                  <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>{pt.fieldEmail}</label>
                    <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>{pt.fieldPhone}</label>
                    <input type="text" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label>{pt.fieldLocation}</label>
                  <input type="text" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} />
                </div>

                <div className="form-group">
                  <label>{pt.fieldSkills}</label>
                  <input type="text" value={newSkills} onChange={(e) => setNewSkills(e.target.value)} />
                </div>

                <div className="form-group">
                  <label>{pt.fieldSummary}</label>
                  <textarea rows={3} value={newSummary} onChange={(e) => setNewSummary(e.target.value)} />
                </div>

                <button
                  type="button"
                  className="apply-btn"
                  style={{ background: 'var(--success)', width: '100%', padding: '12px' }}
                  onClick={handleSaveParsedCandidate}
                >
                  {pt.btnSaveCandidate}
                </button>
              </div>
            )}
          </div>
        )}

        {/* SUB-TAB 4: JOB REQUESTS */}
        {activeSubTab === 'requests' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {jobs.map((job) => (
                <div key={job.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontSize: '16px' }}>{job.title}</h3>
                    <span className="badge" style={{ backgroundColor: 'var(--secondary-light)', color: 'var(--secondary)' }}>
                      {pt.badgeRequest}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                    {pt.clientLabel} {job.company}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    📍 {job.location} | 💰 {job.salary}
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, minHeight: '60px' }}>
                    {job.description}
                  </p>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {job.tags.map((tag, idx) => (
                      <span key={idx} className="job-tag" style={{ fontSize: '11px' }}>{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-TAB 5: PARTNERS LIST */}
        {activeSubTab === 'partners' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                <thead>
                  <tr style={{ background: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '14px 16px' }}>{pt.colPartnerCode}</th>
                    <th style={{ padding: '14px 16px' }}>{pt.colPartnerName}</th>
                    <th style={{ padding: '14px 16px' }}>{pt.colPartnerType}</th>
                    <th style={{ padding: '14px 16px' }}>{pt.colPartnerTax}</th>
                    <th style={{ padding: '14px 16px' }}>{pt.colPartnerRep}</th>
                    <th style={{ padding: '14px 16px' }}>{pt.colPartnerTalents}</th>
                  </tr>
                </thead>
                <tbody>
                  {partners.map((p) => (
                    <tr key={p.code} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 'bold', color: 'var(--primary)' }}>{p.code}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 600 }}>{p.name}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className="badge" style={{
                          backgroundColor: p.type.includes('công ty') || p.type.includes('Company') || p.type.includes('Agency') || p.type.includes('đối tác') ? 'var(--secondary-light)' : 'var(--success-bg)',
                          color: p.type.includes('công ty') || p.type.includes('Company') || p.type.includes('Agency') || p.type.includes('đối tác') ? 'var(--secondary)' : 'var(--success)'
                        }}>
                          {p.type.includes('công ty') || p.type.includes('đối tác') ? pt.partnerCompany : pt.partnerFreelancer}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontFamily: 'monospace' }}>{p.taxCode}</td>
                      <td style={{ padding: '14px 16px' }}>{p.rep}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 700 }}>{p.talents} {pt.partnerDevsCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB-TAB 6: CHAT */}
        {activeSubTab === 'chat' && (
          <div style={{ animation: 'fadeIn 0.2s ease' }}>
            <ChatTab
              messages={messages}
              currentUser={{ name: currentUser.name, role: 'employer' }}
              activeContactName={activeChatContactName}
              onSelectContactName={onSelectChatContactName}
              locale={locale}
            />
          </div>
        )}

      </div>

      {/* DETAILED CV MODAL POPUP */}
      {viewingCandidateCV && (
        <div className="modal-backdrop" onClick={() => setViewingCandidateCV(null)}>
          <div className="modal-content" style={{ maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="flex-center" style={{ gap: '8px' }}>
                <FileText size={18} style={{ color: 'var(--primary)' }} />
                {pt.modalCvHeader} {viewingCandidateCV.name}
              </h3>
              <button type="button" className="close-btn" onClick={() => setViewingCandidateCV(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ overflowY: 'auto', maxHeight: '70vh' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '15px' }}>{viewingCandidateCV.title}</h4>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', gap: '12px' }}>
                    <span>📧 {viewingCandidateCV.email}</span>
                    <span>📞 {viewingCandidateCV.phone}</span>
                    <span>📍 {viewingCandidateCV.location}</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                  <h5 style={{ fontSize: '13px', color: 'var(--primary)' }}>{pt.modalSummaryHeader}</h5>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.5 }}>
                    {viewingCandidateCV.summary}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                  <h5 style={{ fontSize: '13px', color: 'var(--primary)', marginBottom: '8px' }}>{pt.modalSkillsHeader}</h5>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {viewingCandidateCV.skills.map((skill, idx) => (
                      <span key={idx} style={{ fontSize: '11px', background: 'var(--background)', color: 'var(--text-secondary)', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                  <h5 style={{ fontSize: '13px', color: 'var(--primary)', marginBottom: '8px' }}>{pt.modalExpHeader}</h5>
                  {Array.isArray(viewingCandidateCV.experience) && viewingCandidateCV.experience.map((exp: any, idx: number) => (
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
                  <h5 style={{ fontSize: '13px', color: 'var(--primary)', marginBottom: '8px' }}>{pt.modalEduHeader}</h5>
                  {Array.isArray(viewingCandidateCV.education) && viewingCandidateCV.education.map((edu: any, idx: number) => (
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
                onClick={() => setViewingCandidateCV(null)}
              >
                {pt.modalBtnClose}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
