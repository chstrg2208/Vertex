'use client';

import React, { useState, useEffect } from 'react';
import { UserCheck, Users, Briefcase, Layers, Plus, Search, FileText, ChevronRight, Check, X, ShieldAlert, ArrowUpRight, CloudUpload, Play, Terminal, MessageSquare, Star, Settings, Award, Sparkles } from 'lucide-react';
import { createCandidate, createJob, updateApplicationStatus, updateCandidateTAInfo, applyToJob, createPartner, updateApplicationBilling, createAccount } from '@/app/actions';
import { useRouter } from 'next/navigation';
import ChatTab from '../ChatTab';
import BAPortalWorkspace from './BAPortalWorkspace';

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
  status: string;
  rating: number;
  internalNotes: string;
  englishLevel: string;
  salaryExpectation: string;
}

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  tags: string[];
  description: string;
  status?: string;
}

interface Partner {
  id: number;
  code: string;
  name: string;
  type: string;
  taxCode: string;
  repName: string;
  devsCount: number;
}

interface Application {
  id: number;
  jobId: number;
  candidateId: number;
  status: string;
  billingRate: number;
  developerSalary: number;
  createdAt: Date;
  job: Job;
  candidate: Candidate;
}

import { Locale } from '@/utils/translations';

interface Account {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
  createdAt: Date;
}

interface PortalWorkspaceProps {
  candidates: Candidate[];
  jobs: Job[];
  applications: Application[];
  messages: any[];
  partners: Partner[];
  accounts: Account[];
  currentUser: { name: string; role: 'ta' | 'ba' | 'admin' };
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
  partners,
  accounts,
  currentUser,
  onOpenChat,
  activeChatContactName,
  onSelectChatContactName,
  locale,
}: PortalWorkspaceProps) {
  const router = useRouter();
  const pt = portalTranslations[locale];
  const isTA = currentUser.role === 'ta';

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(val);
  };

  const hiredApps = applications.filter(app => app.status === 'HIRED');
  const totalBilling = hiredApps.reduce((sum, app) => sum + (app.billingRate || 0), 0);
  const totalCost = hiredApps.reduce((sum, app) => sum + (app.developerSalary || 0), 0);
  const averageMargin = totalBilling > 0 ? ((totalBilling - totalCost) / totalBilling) * 100 : 0;

  // State management
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'projects' | 'talents' | 'add-talent' | 'requests' | 'partners' | 'chat' | 'pipeline' | 'accounts'>('overview');

  useEffect(() => {
    if (currentUser.role === 'admin') {
      setActiveSubTab('accounts');
    } else {
      setActiveSubTab('overview');
    }
  }, [currentUser.role]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewingCandidateCV, setViewingCandidateCV] = useState<Candidate | null>(null);

  // TA Project Management & Matcher states
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [projectSearchTerm, setProjectSearchTerm] = useState('');
  const [projectStatusFilter, setProjectStatusFilter] = useState<'all' | 'Active' | 'Pending'>('all');
  
  // Custom interactive filter states for matching dev
  const [filterSkills, setFilterSkills] = useState<string[]>([]);
  const [filterLocation, setFilterLocation] = useState('');
  const [filterMinRating, setFilterMinRating] = useState<number>(4.0);
  const [filterMinEnglish, setFilterMinEnglish] = useState<string>('Any');
  const [filterMaxSalary, setFilterMaxSalary] = useState<string>('');

  useEffect(() => {
    if (selectedProjectId) {
      const selectedProj = jobs.find(j => j.id === selectedProjectId);
      if (selectedProj) {
        setFilterSkills(selectedProj.tags || []);
        const cleanLoc = selectedProj.location ? selectedProj.location.split('(')[0].trim() : '';
        setFilterLocation(cleanLoc);
        setFilterMaxSalary('');
        setFilterMinRating(4.0);
        setFilterMinEnglish('Any');
      }
    } else {
      setFilterSkills([]);
      setFilterLocation('');
      setFilterMinRating(4.0);
      setFilterMinEnglish('Any');
      setFilterMaxSalary('');
    }
  }, [selectedProjectId, jobs]);

  // CV Evaluation Tab states inside modal
  const [modalActiveTab, setModalActiveTab] = useState<'cv' | 'assessment'>('cv');
  const [taStatus, setTaStatus] = useState('AVAILABLE');
  const [taRating, setTaRating] = useState(5);
  const [taNotes, setTaNotes] = useState('');
  const [taEnglish, setTaEnglish] = useState('Intermediate');
  const [taSalary, setTaSalary] = useState('Negotiable');
  const [isSavingTAInfo, setIsSavingTAInfo] = useState(false);

  // Advanced Vetting Scorecard & Drag-and-Drop States
  const [checklistCV, setChecklistCV] = useState(false);
  const [checklistInterview, setChecklistInterview] = useState(false);
  const [checklistTech, setChecklistTech] = useState(false);
  const [checklistCulture, setChecklistCulture] = useState(false);
  
  const [algoScore, setAlgoScore] = useState(5);
  const [archScore, setArchScore] = useState(5);
  const [commScore, setCommScore] = useState(5);
  const [taNotesRaw, setTaNotesRaw] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // AI Matcher State
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [isAssigningJobId, setIsAssigningJobId] = useState<number | null>(null);
  const [pipelineMode, setPipelineMode] = useState<'kanban' | 'matcher'>('kanban');

  // BA Manager Job Request Form State
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobCompany, setNewJobCompany] = useState('');
  const [newJobLocation, setNewJobLocation] = useState('');
  const [newJobSalary, setNewJobSalary] = useState('');
  const [newJobTags, setNewJobTags] = useState('');
  const [newJobDesc, setNewJobDesc] = useState('');
  const [isSavingJob, setIsSavingJob] = useState(false);

  // BA Manager Partner Form State
  const [isAddPartnerOpen, setIsAddPartnerOpen] = useState(false);
  const [newPartnerCode, setNewPartnerCode] = useState('');
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerType, setNewPartnerType] = useState('COMPANY');
  const [newPartnerTaxCode, setNewPartnerTaxCode] = useState('');
  const [newPartnerRep, setNewPartnerRep] = useState('');
  const [newPartnerDevsCount, setNewPartnerDevsCount] = useState(0);
  const [isSavingPartner, setIsSavingPartner] = useState(false);

  // BA Manager Placements Rate Adjustment State
  const [adjustingBillingApp, setAdjustingBillingApp] = useState<Application | null>(null);
  const [inputBillingRate, setInputBillingRate] = useState('');
  const [inputDeveloperSalary, setInputDeveloperSalary] = useState('');
  const [isSavingBilling, setIsSavingBilling] = useState(false);

  // Admin Account Form State
  const [newAccEmail, setNewAccEmail] = useState('');
  const [newAccPassword, setNewAccPassword] = useState('');
  const [newAccName, setNewAccName] = useState('');
  const [newAccRole, setNewAccRole] = useState('ta');
  const [isSavingAccount, setIsSavingAccount] = useState(false);

  // Admin Permission Matrix State
  const [permissions, setPermissions] = useState({
    ta: { view: true, edit: true, delete: false },
    ba: { view: true, edit: true, delete: false },
    admin: { view: true, edit: true, delete: true }
  });

  // Admin Confirmation Modal & Danger Zone State
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<{ type: 'user' | 'contract'; id: string; name: string } | null>(null);
  const [isExecutingDestruction, setIsExecutingDestruction] = useState(false);

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

  const handleOpenCVModal = (candidate: Candidate) => {
    setViewingCandidateCV(candidate);
    setModalActiveTab('cv');
    setTaStatus(candidate.status || 'AVAILABLE');
    
    // Parse checklist from notes
    const notes = candidate.internalNotes || '';
    setChecklistCV(notes.includes('[✓] CV Screening'));
    setChecklistInterview(notes.includes('[✓] Initial Interview'));
    setChecklistTech(notes.includes('[✓] Technical Assessment'));
    setChecklistCulture(notes.includes('[✓] Cultural Fit'));

    // Parse subscores from notes
    const algoMatch = notes.match(/- Algorithm & Coding: (\d)/);
    const archMatch = notes.match(/- Architecture & System Design: (\d)/);
    const commMatch = notes.match(/- Communication & Teamwork: (\d)/);

    const initialAlgo = algoMatch ? Number(algoMatch[1]) : 5;
    const initialArch = archMatch ? Number(archMatch[1]) : 5;
    const initialComm = commMatch ? Number(commMatch[1]) : 5;

    setAlgoScore(initialAlgo);
    setArchScore(initialArch);
    setCommScore(initialComm);
    setTaRating(Math.round((initialAlgo + initialArch + initialComm) / 3));

    // Extract raw notes (anything after ADDITIONAL NOTES:)
    const rawNotesIndex = notes.indexOf('ADDITIONAL NOTES:\n');
    const parsedRawNotes = rawNotesIndex !== -1 
      ? notes.substring(rawNotesIndex + 'ADDITIONAL NOTES:\n'.length) 
      : notes;
    setTaNotesRaw(parsedRawNotes);

    setTaEnglish(candidate.englishLevel || 'Intermediate');
    setTaSalary(candidate.salaryExpectation || 'Negotiable');
  };

  // Determine tabs list dynamically based on role
  const sidebarTabs = isTA
    ? [
        { id: 'overview', label: pt.tabOverview, icon: <Layers size={16} /> },
        { id: 'projects', label: locale === 'vi' ? 'Quản lý Dự án' : 'Project Management', icon: <Briefcase size={16} /> },
        { id: 'talents', label: pt.tabTalents, icon: <Users size={16} /> },
        { id: 'pipeline', label: locale === 'vi' ? 'Quy trình & Khớp nối AI' : 'Pipeline & AI Matcher', icon: <UserCheck size={16} /> },
        { id: 'add-talent', label: pt.tabAddTalent, icon: <Plus size={16} /> },
        { id: 'chat', label: pt.tabChat, icon: <MessageSquare size={16} /> },
      ]
    : currentUser.role === 'admin'
    ? [
        { id: 'accounts', label: locale === 'vi' ? 'Quản lý Tài khoản' : 'Manage Accounts', icon: <Users size={16} /> },
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

  const handleSaveTAInfo = async () => {
    if (!viewingCandidateCV) return;
    setIsSavingTAInfo(true);
    
    const calculatedRating = Number(((algoScore + archScore + commScore) / 3).toFixed(1));
    const formattedNotes = `VETTING CHECKLIST:
[${checklistCV ? '✓' : ' '}] CV Screening
[${checklistInterview ? '✓' : ' '}] Initial Interview
[${checklistTech ? '✓' : ' '}] Technical Assessment
[${checklistCulture ? '✓' : ' '}] Cultural Fit

TECHNICAL DETAILED RATINGS:
- Algorithm & Coding: ${algoScore} / 5
- Architecture & System Design: ${archScore} / 5
- Communication & Teamwork: ${commScore} / 5

ADDITIONAL NOTES:
${taNotesRaw}`;

    const result = await updateCandidateTAInfo({
      id: viewingCandidateCV.id,
      status: taStatus,
      rating: calculatedRating,
      internalNotes: formattedNotes,
      englishLevel: taEnglish,
      salaryExpectation: taSalary
    });
    setIsSavingTAInfo(false);
    if (result.success) {
      alert(locale === 'vi' ? 'Đã lưu đánh giá thành công!' : 'Internal assessment saved successfully!');
      setViewingCandidateCV(null);
      router.refresh();
    } else {
      alert(result.error || (locale === 'vi' ? 'Không thể lưu đánh giá.' : 'Failed to save assessment.'));
    }
  };

  const handleCreateJob = async () => {
    if (!newJobTitle || !newJobCompany || !newJobLocation || !newJobSalary) {
      alert(locale === 'vi' ? 'Vui lòng nhập đầy đủ các trường thông tin chính!' : 'Please fill in all core fields!');
      return;
    }
    setIsSavingJob(true);
    const tagsArray = newJobTags.split(',').map(t => t.trim()).filter(t => t.length > 0);
    const result = await createJob({
      title: newJobTitle,
      company: newJobCompany,
      location: newJobLocation,
      salary: newJobSalary,
      tags: tagsArray,
      description: newJobDesc
    });
    setIsSavingJob(false);
    if (result.success) {
      alert(locale === 'vi' ? 'Đã tạo yêu cầu tuyển dụng thành công!' : 'Job request created successfully!');
      setIsCreateJobOpen(false);
      setNewJobTitle('');
      setNewJobCompany('');
      setNewJobLocation('');
      setNewJobSalary('');
      setNewJobTags('');
      setNewJobDesc('');
      router.refresh();
    } else {
      alert(result.error || 'Failed');
    }
  };

  const handleCreatePartner = async () => {
    if (!newPartnerCode || !newPartnerName || !newPartnerTaxCode || !newPartnerRep) {
      alert(locale === 'vi' ? 'Vui lòng nhập đầy đủ các trường thông tin chính!' : 'Please fill in all core fields!');
      return;
    }
    setIsSavingPartner(true);
    const result = await createPartner({
      code: newPartnerCode,
      name: newPartnerName,
      type: newPartnerType,
      taxCode: newPartnerTaxCode,
      repName: newPartnerRep,
      devsCount: Number(newPartnerDevsCount) || 0
    });
    setIsSavingPartner(false);
    if (result.success) {
      alert(locale === 'vi' ? 'Đăng ký đối tác thành công!' : 'Partner registered successfully!');
      setIsAddPartnerOpen(false);
      setNewPartnerCode('');
      setNewPartnerName('');
      setNewPartnerTaxCode('');
      setNewPartnerRep('');
      setNewPartnerDevsCount(0);
      router.refresh();
    } else {
      alert(result.error || 'Failed');
    }
  };

  const handleCreateAccount = async () => {
    if (!newAccEmail || !newAccPassword || !newAccName) {
      alert(locale === 'vi' ? 'Vui lòng nhập đầy đủ các trường!' : 'Please fill in all fields!');
      return;
    }
    setIsSavingAccount(true);
    const result = await createAccount({
      email: newAccEmail,
      password: newAccPassword,
      name: newAccName,
      role: newAccRole,
    });
    setIsSavingAccount(false);
    if (result.success) {
      alert(locale === 'vi' ? 'Đã tạo tài khoản thành công!' : 'Account created successfully!');
      setNewAccEmail('');
      setNewAccPassword('');
      setNewAccName('');
      setNewAccRole('ta');
      router.refresh();
    } else {
      alert(result.error || 'Failed to create account');
    }
  };

  const togglePermission = (role: 'ta' | 'ba' | 'admin', type: 'view' | 'edit' | 'delete') => {
    setPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [type]: !prev[role][type]
      }
    }));
  };

  const handleOpenConfirmModal = (type: 'user' | 'contract', id: string, name: string) => {
    setConfirmTarget({ type, id, name });
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDestruction = async () => {
    if (!confirmTarget) return;
    setIsExecutingDestruction(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsExecutingDestruction(false);
    setIsConfirmModalOpen(false);
    
    if (confirmTarget.type === 'user') {
      alert(locale === 'vi' 
        ? `Đã xóa vĩnh viễn tài khoản người dùng: ${confirmTarget.name}` 
        : `Permanently deleted user account: ${confirmTarget.name}`
      );
    } else {
      alert(locale === 'vi' 
        ? `Đã hủy bỏ hợp đồng pháp nhân của đối tác: ${confirmTarget.name}` 
        : `Successfully cancelled entity contract for partner: ${confirmTarget.name}`
      );
    }
    setConfirmTarget(null);
    router.refresh();
  };

  if (currentUser.role === 'ba') {
    return <BAPortalWorkspace locale={locale} currentUser={currentUser} jobs={jobs} />;
  }

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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* BA Manager Financial Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                  <div className="card" style={{ padding: '20px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {locale === 'vi' ? 'Ước tính Doanh thu/tháng' : 'Est. Monthly Revenue'}
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: 800, marginTop: '8px', color: 'var(--primary)' }}>
                      {formatCurrency(totalBilling)}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {locale === 'vi' ? 'Tổng biểu phí thuê nhân sự' : 'Total active rental billing'}
                    </div>
                  </div>
                  <div className="card" style={{ padding: '20px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {locale === 'vi' ? 'Chi phí Nhân sự/tháng' : 'Personnel Costs'}
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: 800, marginTop: '8px', color: 'var(--secondary)' }}>
                      {formatCurrency(totalCost)}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {locale === 'vi' ? 'Tổng lương trả cho lập trình viên' : 'Total developer salary costs'}
                    </div>
                  </div>
                  <div className="card" style={{ padding: '20px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {locale === 'vi' ? 'Biên lợi nhuận gộp' : 'Gross Margin'}
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: 800, marginTop: '8px', color: 'var(--success)' }}>
                      {averageMargin.toFixed(1)}%
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {locale === 'vi' ? 'Tỷ suất lợi nhuận trung bình' : 'Average profit margin rate'}
                    </div>
                  </div>
                  <div className="card" style={{ padding: '20px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{pt.statTotalReqs}</div>
                    <div style={{ fontSize: '22px', fontWeight: 800, marginTop: '8px' }}>{jobs.length}</div>
                    <div style={{ fontSize: '11px', color: 'var(--primary)', marginTop: '4px' }}>{pt.statTotalReqsSub}</div>
                  </div>
                </div>

                {/* Placements Financials Table */}
                <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>
                      {locale === 'vi' ? 'Chi tiết Biểu phí & Lương Placements' : 'Placements & IT Rental Contracts'}
                    </h3>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                      <thead>
                        <tr style={{ background: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
                          <th style={{ padding: '12px 14px' }}>{locale === 'vi' ? 'Nhân sự / Dev' : 'IT Talent'}</th>
                          <th style={{ padding: '12px 14px' }}>{locale === 'vi' ? 'Công ty khách hàng' : 'Client / Project'}</th>
                          <th style={{ padding: '12px 14px' }}>{locale === 'vi' ? 'Biểu phí khách trả' : 'Billing Rate'}</th>
                          <th style={{ padding: '12px 14px' }}>{locale === 'vi' ? 'Lương chi trả' : 'Developer Salary'}</th>
                          <th style={{ padding: '12px 14px' }}>{locale === 'vi' ? 'Biên lợi nhuận' : 'Margin'}</th>
                          <th style={{ padding: '12px 14px' }}>{locale === 'vi' ? 'Hành động' : 'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hiredApps.length === 0 ? (
                          <tr>
                            <td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                              {locale === 'vi' ? 'Chưa có hợp đồng placement nào được kích hoạt.' : 'No active placement contracts found.'}
                            </td>
                          </tr>
                        ) : (
                          hiredApps.map((app) => {
                            const margin = app.billingRate > 0 ? ((app.billingRate - app.developerSalary) / app.billingRate * 100) : 0;
                            return (
                              <tr key={app.id} style={{ borderBottom: '1px solid var(--border)' }} className="table-row-hover">
                                <td style={{ padding: '12px 14px', fontWeight: 'bold' }}>{app.candidate.name}</td>
                                <td style={{ padding: '12px 14px' }}>{app.job.company} - {app.job.title}</td>
                                <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>{formatCurrency(app.billingRate)}</td>
                                <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>{formatCurrency(app.developerSalary)}</td>
                                <td style={{ padding: '12px 14px' }}>
                                  <span className="badge" style={{
                                    backgroundColor: margin >= 20 ? 'var(--success-bg)' : 'var(--warning-bg)',
                                    color: margin >= 20 ? 'var(--success)' : 'var(--warning)',
                                    fontWeight: 'bold'
                                  }}>
                                    {margin.toFixed(1)}%
                                  </span>
                                </td>
                                <td style={{ padding: '12px 14px' }}>
                                  <button
                                    type="button"
                                    className="role-btn"
                                    style={{
                                      padding: '4px 8px',
                                      fontSize: '11px',
                                      backgroundColor: 'var(--primary-light)',
                                      color: 'var(--primary)',
                                      border: '1px solid var(--primary)',
                                      borderRadius: '4px'
                                    }}
                                    onClick={() => {
                                      setAdjustingBillingApp(app);
                                      setInputBillingRate(app.billingRate.toString());
                                      setInputDeveloperSalary(app.developerSalary.toString());
                                    }}
                                  >
                                    {locale === 'vi' ? 'Sửa biểu phí' : 'Adjust Rates'}
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
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

        {/* SUB-TAB: PROJECT MANAGEMENT & DEV MATCHING */}
        {activeSubTab === 'projects' && (
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', animation: 'fadeIn 0.25s ease' }}>
            
            {/* Left Column: Project Selector List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 'bold' }}>
                  {locale === 'vi' ? 'Danh sách dự án của BA' : 'BA Projects List'}
                </h3>
                
                {/* Search projects */}
                <div className="search-input-wrapper">
                  <Search size={14} className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder={locale === 'vi' ? 'Tìm kiếm dự án, công ty...' : 'Search projects, companies...'}
                    value={projectSearchTerm}
                    onChange={(e) => setProjectSearchTerm(e.target.value)}
                    style={{ fontSize: '12px', paddingLeft: '30px' }}
                  />
                </div>

                {/* Status filter */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  {(['all', 'Active', 'Pending'] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      style={{
                        flex: 1,
                        padding: '6px 0',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        border: '1px solid var(--border)',
                        borderRadius: '4px',
                        background: projectStatusFilter === status ? 'var(--primary)' : 'var(--background)',
                        color: projectStatusFilter === status ? '#fff' : 'var(--text-muted)',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                      onClick={() => setProjectStatusFilter(status)}
                    >
                      {status === 'all' ? (locale === 'vi' ? 'Tất cả' : 'All') : status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Projects List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '600px', overflowY: 'auto' }}>
                {jobs
                  .filter((job) => {
                    const matchesSearch = job.title.toLowerCase().includes(projectSearchTerm.toLowerCase()) ||
                      job.company.toLowerCase().includes(projectSearchTerm.toLowerCase());
                    const matchesStatus = projectStatusFilter === 'all' || job.status === projectStatusFilter;
                    return matchesSearch && matchesStatus;
                  })
                  .map((job) => {
                    const isSelected = selectedProjectId === job.id;
                    const assignedCount = applications.filter(app => app.jobId === job.id).length;
                    
                    return (
                      <div
                        key={job.id}
                        onClick={() => setSelectedProjectId(job.id)}
                        className="card"
                        style={{
                          padding: '14px',
                          cursor: 'pointer',
                          border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                          background: isSelected ? 'rgba(79, 70, 229, 0.04)' : 'var(--surface)',
                          transition: 'all 0.2s',
                          boxShadow: isSelected ? '0 4px 12px rgba(79, 70, 229, 0.1)' : 'none'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>{job.company}</span>
                          <span className="badge" style={{
                            fontSize: '9px',
                            backgroundColor: job.status === 'Active' ? 'var(--success-bg)' : 'var(--warning-bg)',
                            color: job.status === 'Active' ? 'var(--success)' : 'var(--warning)',
                          }}>
                            {job.status || 'Active'}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '13.5px', fontWeight: 'bold', marginTop: '6px', color: isSelected ? 'var(--primary)' : 'var(--text-main)' }}>
                          {job.title}
                        </h4>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          📍 {job.location}
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            💰 {job.salary}
                          </span>
                          <span style={{ fontSize: '10.5px', color: 'var(--primary)', fontWeight: 'bold' }}>
                            👥 {assignedCount} {locale === 'vi' ? 'đã phái cử' : 'assigned'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Right Column: Selected Project Detail & Dev Sourcing Console */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {!selectedProjectId ? (
                /* Unselected State Placeholder */
                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '80px 24px', textAlign: 'center', minHeight: '400px' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(79, 70, 229, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '8px' }}>
                    <Briefcase size={32} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    {locale === 'vi' ? 'Chưa Chọn Dự Án' : 'No Project Selected'}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '420px', lineHeight: 1.5 }}>
                    {locale === 'vi' ? 'Vui lòng nhấp chọn một dự án từ danh sách do BA nhận từ khách hàng ở cột bên trái để phân tích yêu cầu tuyển dụng và tự động khớp nối nhân sự phù hợp.' : 'Select a project received by BA from the left list to review recruitment details and match developers automatically.'}
                  </p>
                </div>
              ) : (() => {
                const selectedProj = jobs.find(j => j.id === selectedProjectId);
                if (!selectedProj) return null;

                const parseSalary = (salaryStr: string) => {
                  if (!salaryStr) return 0;
                  const cleanStr = salaryStr.replace(/[^0-9]/g, '');
                  const num = parseFloat(cleanStr);
                  return isNaN(num) ? 0 : num;
                };

                // Matched Candidates Calculations
                const matchedDevs = candidates
                  .filter((c) => {
                    // Only show AVAILABLE devs
                    if (c.status !== 'AVAILABLE') return false;

                    // Filter by Rating
                    const rating = c.rating !== undefined ? Number(c.rating) : 5.0;
                    if (rating < filterMinRating) return false;

                    // Filter by Location
                    if (filterLocation) {
                      const cleanLoc = filterLocation.toLowerCase().trim();
                      const devLoc = c.location ? c.location.toLowerCase() : '';
                      if (!devLoc.includes(cleanLoc) && !cleanLoc.includes('remote') && !devLoc.includes('remote')) {
                        return false;
                      }
                    }

                    // Filter by English Level
                    if (filterMinEnglish !== 'Any') {
                      const cleanEng = filterMinEnglish.split(' ')[0].toLowerCase(); // e.g. "b1", "b2"
                      const devEng = c.englishLevel ? c.englishLevel.toLowerCase() : '';
                      
                      // Simple priority rank check
                      const getEnglishRank = (level: string) => {
                        if (level.includes('c2') || level.includes('native')) return 5;
                        if (level.includes('c1') || level.includes('advanced')) return 4;
                        if (level.includes('b2') || level.includes('upper')) return 3;
                        if (level.includes('b1') || level.includes('intermediate')) return 2;
                        if (level.includes('a2') || level.includes('elementary')) return 1;
                        return 0;
                      };

                      if (getEnglishRank(devEng) < getEnglishRank(cleanEng)) {
                        return false;
                      }
                    }

                    // Filter by Salary
                    if (filterMaxSalary) {
                      const maxSal = parseFloat(filterMaxSalary.replace(/[^0-9]/g, ''));
                      const devSal = parseSalary(c.salaryExpectation);
                      if (maxSal > 0 && devSal > 0 && devSal > maxSal) {
                        return false;
                      }
                    }

                    return true;
                  })
                  .map((candidate) => {
                    // Match score algorithm
                    let score = 40; // Base score
                    
                    // 1. Skill overlap (45% weight)
                    const jobTagsLower = filterSkills.map(t => t.toLowerCase());
                    const matchedSkills = candidate.skills.filter(s => jobTagsLower.includes(s.toLowerCase()));
                    const missingSkills = filterSkills.filter(t => !candidate.skills.some(s => s.toLowerCase() === t.toLowerCase()));
                    
                    if (filterSkills.length > 0) {
                      score += Math.round((matchedSkills.length / filterSkills.length) * 45);
                    } else {
                      score += 45; // If no tags filtered, give full skill score
                    }

                    // 2. Location match (10% weight)
                    const projLocClean = selectedProj.location ? selectedProj.location.toLowerCase() : '';
                    const devLocClean = candidate.location ? candidate.location.toLowerCase() : '';
                    if (devLocClean.includes(projLocClean) || projLocClean.includes(devLocClean)) {
                      score += 10;
                    } else if (devLocClean.includes('remote') || projLocClean.includes('remote') || devLocClean.includes('hybrid') || projLocClean.includes('hybrid')) {
                      score += 5;
                    }

                    // 3. Rating score (5% weight)
                    const rating = candidate.rating !== undefined ? Number(candidate.rating) : 5.0;
                    score += Math.round((rating / 5) * 5);

                    // Bound to [10, 100]
                    score = Math.min(100, Math.max(10, score));

                    return {
                      candidate,
                      score,
                      matchedSkills,
                      missingSkills
                    };
                  })
                  .sort((a, b) => b.score - a.score);

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* 1. Project Requirements Details Header */}
                    <div className="card" style={{ padding: '24px', borderLeft: '4px solid var(--primary)', background: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                            {locale === 'vi' ? 'Chi tiết yêu cầu dự án' : 'Project Requirements'}
                          </span>
                          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '4px' }}>
                            {selectedProj.title}
                          </h2>
                          <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', gap: '16px' }}>
                            <span>🏢 <strong>{selectedProj.company}</strong></span>
                            <span>📍 {selectedProj.location}</span>
                            <span>💰 {selectedProj.salary}</span>
                          </div>
                        </div>
                        <span className="badge" style={{
                          backgroundColor: selectedProj.status === 'Active' ? 'var(--success-bg)' : 'var(--warning-bg)',
                          color: selectedProj.status === 'Active' ? 'var(--success)' : 'var(--warning)',
                          fontWeight: 'bold',
                          padding: '6px 12px'
                        }}>
                          {selectedProj.status || 'Active'}
                        </span>
                      </div>

                      <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '8px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                        {selectedProj.description}
                      </p>

                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                        {selectedProj.tags.map((tag, idx) => (
                          <span key={idx} className="job-tag" style={{ background: 'rgba(79, 70, 229, 0.08)', color: 'var(--primary)', fontSize: '11px', padding: '4px 10px' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 2. Developer AI Filter Console */}
                    <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--surface-hover)' }}>
                      <h3 style={{ fontSize: '14.5px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
                        <Sparkles size={16} fill="var(--primary)" />
                        {locale === 'vi' ? 'Bộ lọc tìm kiếm ứng viên tương thích' : 'Interactive Candidate Matcher'}
                      </h3>

                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
                        {/* Skills interactive tagging */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                            {locale === 'vi' ? 'Bộ kỹ năng yêu cầu (Nhấp để xóa, nhấn Enter để thêm):' : 'Required Technical Skills (Click to remove, Enter to add):'}
                          </label>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', minHeight: '38px', padding: '6px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--background)' }}>
                            {filterSkills.map((skill, idx) => (
                              <span
                                key={idx}
                                onClick={() => setFilterSkills(filterSkills.filter(s => s !== skill))}
                                style={{
                                  fontSize: '11px',
                                  background: 'var(--primary)',
                                  color: '#fff',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                                title="Click to remove"
                              >
                                {skill} ✕
                              </span>
                            ))}
                            <input
                              type="text"
                              placeholder={filterSkills.length === 0 ? (locale === 'vi' ? 'Thêm kỹ năng...' : 'Add skill...') : ''}
                              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '12px', color: 'var(--text-main)', flex: 1, minWidth: '80px' }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const val = e.currentTarget.value.trim();
                                  if (val && !filterSkills.some(s => s.toLowerCase() === val.toLowerCase())) {
                                    setFilterSkills([...filterSkills, val]);
                                    e.currentTarget.value = '';
                                  }
                                }
                              }}
                            />
                          </div>

                          {/* Quick suggestions from original job tags */}
                          {selectedProj.tags.some(tag => !filterSkills.includes(tag)) && (
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center', marginTop: '4px' }}>
                              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                                {locale === 'vi' ? 'Gợi ý từ BA:' : 'Sourced from BA:'}
                              </span>
                              {selectedProj.tags
                                .filter(tag => !filterSkills.includes(tag))
                                .map((tag, idx) => (
                                  <span
                                    key={idx}
                                    onClick={() => setFilterSkills([...filterSkills, tag])}
                                    style={{
                                      fontSize: '10px',
                                      background: 'var(--background)',
                                      color: 'var(--text-secondary)',
                                      border: '1px dashed var(--border)',
                                      padding: '1px 6px',
                                      borderRadius: '3px',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    + {tag}
                                  </span>
                                ))}
                            </div>
                          )}
                        </div>

                        {/* Location match */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                            {locale === 'vi' ? 'Khu vực địa lý (Ví dụ: Hà Nội, TP. HCM):' : 'Work Location (e.g. Hanoi, HCMC):'}
                          </label>
                          <input
                            type="text"
                            className="search-input"
                            style={{ width: '100%', padding: '10px' }}
                            placeholder={locale === 'vi' ? 'Nhập địa điểm làm việc...' : 'Enter target location...'}
                            value={filterLocation}
                            onChange={(e) => setFilterLocation(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Line 2: Multi-sliders and values */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '8px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                        
                        {/* Rating slider */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>{locale === 'vi' ? 'Đánh giá tối thiểu:' : 'Min Rating:'}</span>
                            <span style={{ color: '#ffb100' }}>★ {filterMinRating.toFixed(1)}</span>
                          </div>
                          <input
                            type="range"
                            min="1.0"
                            max="5.0"
                            step="0.1"
                            value={filterMinRating}
                            onChange={(e) => setFilterMinRating(parseFloat(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--primary)' }}
                          />
                        </div>

                        {/* English Selector */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                            {locale === 'vi' ? 'Tiếng Anh tối thiểu:' : 'Min English Level:'}
                          </label>
                          <select
                            style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text-main)', fontSize: '12px', outline: 'none' }}
                            value={filterMinEnglish}
                            onChange={(e) => setFilterMinEnglish(e.target.value)}
                          >
                            <option value="Any">{locale === 'vi' ? 'Không yêu cầu' : 'Any Level'}</option>
                            <option value="B1 (Intermediate)">B1 (Intermediate) +</option>
                            <option value="B2 (Upper-Intermediate)">B2 (Upper) +</option>
                            <option value="C1 (Advanced)">C1 (Advanced) +</option>
                          </select>
                        </div>

                        {/* Salary limit threshold */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                            {locale === 'vi' ? 'Lương kỳ vọng tối đa:' : 'Max Expected Salary:'}
                          </label>
                          <input
                            type="text"
                            className="search-input"
                            style={{ width: '100%', padding: '8px', fontSize: '12px' }}
                            placeholder="e.g. 40,000,000"
                            value={filterMaxSalary}
                            onChange={(e) => setFilterMaxSalary(e.target.value)}
                          />
                          {filterMaxSalary && !isNaN(parseFloat(filterMaxSalary.replace(/[^0-9]/g, ''))) && (
                            <div style={{ fontSize: '10px', color: 'var(--primary)', marginTop: '-4px', fontWeight: 'bold' }}>
                              {formatCurrency(parseFloat(filterMaxSalary.replace(/[^0-9]/g, '')))}
                            </div>
                          )}
                        </div>

                      </div>
                    </div>

                    {/* 3. Matched Developers List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 'bold' }}>
                          {locale === 'vi' ? 'Kết quả khớp nối ứng viên sẵn sàng (AVAILABLE):' : 'Matching Available Developers:'}
                        </h3>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {locale === 'vi' ? `Tìm thấy ${matchedDevs.length} ứng viên` : `Found ${matchedDevs.length} matches`}
                        </span>
                      </div>

                      {matchedDevs.length === 0 ? (
                        <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                          {locale === 'vi' ? 'Không tìm thấy lập trình viên AVAILABLE nào phù hợp với bộ lọc hiện tại.' : 'No available developers matched the current filter conditions.'}
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {matchedDevs.map(({ candidate, score, matchedSkills, missingSkills }) => {
                            const isAssigned = applications.some((app) => app.jobId === selectedProj.id && app.candidateId === candidate.id);
                            
                            return (
                              <div
                                key={candidate.id}
                                className="card"
                                style={{
                                  padding: '20px',
                                  display: 'grid',
                                  gridTemplateColumns: '1fr 180px',
                                  gap: '24px',
                                  alignItems: 'center',
                                  border: '1px solid var(--border)',
                                  background: 'var(--surface)',
                                  transition: 'border-color 0.2s',
                                }}
                              >
                                <div>
                                  {/* Candidate Header */}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <h4
                                      style={{ fontWeight: 'bold', fontSize: '15px', color: 'var(--text-main)', cursor: 'pointer' }}
                                      onClick={() => handleOpenCVModal(candidate)}
                                      className="hover-underline"
                                    >
                                      {candidate.name}
                                    </h4>
                                    
                                    {/* Gradient Match Score Badge */}
                                    <span style={{
                                      fontSize: '11px',
                                      fontWeight: 'bold',
                                      background: score >= 80 ? 'linear-gradient(135deg, #10b981, #059669)' : score >= 50 ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'linear-gradient(135deg, #ef4444, #dc2626)',
                                      color: '#fff',
                                      padding: '2px 8px',
                                      borderRadius: '20px',
                                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                                    }}>
                                      {score}% Match
                                    </span>
                                  </div>

                                  <div style={{ fontSize: '12.5px', color: 'var(--primary)', fontWeight: 600, marginTop: '2px' }}>
                                    {candidate.title}
                                  </div>

                                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.4 }}>
                                    {candidate.summary}
                                  </p>

                                  {/* Dynamic tags split: green for match, gray/red for missing */}
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center', fontSize: '11px' }}>
                                      <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓ {locale === 'vi' ? 'Kỹ năng trùng khớp:' : 'Matched:'}</span>
                                      {matchedSkills.length > 0 ? matchedSkills.map((s, idx) => (
                                        <span key={idx} style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>{s}</span>
                                      )) : <span style={{ color: 'var(--text-muted)' }}>None</span>}
                                    </div>

                                    {missingSkills.length > 0 && (
                                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center', fontSize: '11px' }}>
                                        <span style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>✗ {locale === 'vi' ? 'Yêu cầu còn thiếu:' : 'Missing Requirements:'}</span>
                                        {missingSkills.map((s, idx) => (
                                          <span key={idx} style={{ background: 'rgba(255, 255, 255, 0.04)', color: 'var(--text-muted)', border: '1px dashed var(--border)', padding: '1px 6px', borderRadius: '4px', fontSize: '10px' }}>{s}</span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Dev Stats & Matching Action Panels */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderLeft: '1px solid var(--border)', paddingLeft: '24px', alignItems: 'stretch' }}>
                                  
                                  {/* Stats details */}
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                      <Star size={12} fill="#ffb100" style={{ color: '#ffb100' }} />
                                      <strong>Rating: {candidate.rating !== undefined ? Number(candidate.rating).toFixed(1) : '5.0'}</strong>
                                    </div>
                                    <div>🌐 EN: <strong>{candidate.englishLevel || 'Intermediate'}</strong></div>
                                    <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                      💵 {candidate.salaryExpectation || 'Negotiable'}
                                    </div>
                                  </div>

                                  {isAssigned ? (
                                    <button
                                      type="button"
                                      disabled
                                      style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        background: 'var(--surface-hover)',
                                        color: 'var(--text-muted)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '6px',
                                        textAlign: 'center'
                                      }}
                                    >
                                      ✓ {locale === 'vi' ? 'Đã phái cử' : 'Already Assigned'}
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      className="apply-btn"
                                      style={{ width: '100%', padding: '8px 12px', fontSize: '12px', fontWeight: 'bold' }}
                                      onClick={async () => {
                                        setIsAssigningJobId(candidate.id);
                                        const res = await applyToJob(selectedProj.id, candidate.id);
                                        setIsAssigningJobId(null);
                                        if (res.success) {
                                          alert(locale === 'vi' ? `✓ Phái cử thành công ${candidate.name} vào dự án ${selectedProj.title}!` : `✓ Successfully assigned ${candidate.name} to ${selectedProj.title}!`);
                                          router.refresh();
                                        } else {
                                          alert(res.error || 'Failed to assign candidate');
                                        }
                                      }}
                                      disabled={isAssigningJobId === candidate.id}
                                    >
                                      {isAssigningJobId === candidate.id ? '...' : (locale === 'vi' ? 'Phái cử ngay' : 'Assign to Project')}
                                    </button>
                                  )}
                                  
                                  <button
                                    type="button"
                                    className="nav-tab"
                                    style={{ margin: 0, width: '100%', padding: '8px 12px', fontSize: '12px', border: '1px solid var(--border)', background: 'var(--surface)', textAlign: 'center' }}
                                    onClick={() => onOpenChat(candidate.name)}
                                  >
                                    💬 {locale === 'vi' ? 'Trò chuyện' : 'Chat'}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
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
                    <th style={{ padding: '14px 16px' }}>{locale === 'vi' ? 'Đánh giá / TA' : 'Rating / English'}</th>
                    <th style={{ padding: '14px 16px' }}>{locale === 'vi' ? 'Trạng thái' : 'Status'}</th>
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
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ffb100', fontWeight: 'bold' }}>
                              <Star size={12} fill="#ffb100" />
                              <span>{c.rating !== undefined ? Number(c.rating).toFixed(1) : '5.0'}</span>
                            </div>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.englishLevel || 'Intermediate'}</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span className="badge" style={{
                            backgroundColor: c.status === 'AVAILABLE' ? 'var(--success-bg)' : c.status === 'PLACED' ? 'var(--primary-light)' : 'var(--danger-bg)',
                            color: c.status === 'AVAILABLE' ? 'var(--success)' : c.status === 'PLACED' ? 'var(--primary)' : 'var(--danger)'
                          }}>
                            {c.status === 'AVAILABLE' ? (locale === 'vi' ? 'Trống dự án' : 'Available') : c.status === 'PLACED' ? (locale === 'vi' ? 'Đã phái cử' : 'Placed') : (locale === 'vi' ? 'Đang thẩm định' : 'Vetting')}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              className="nav-tab"
                              style={{ padding: '4px 8px', fontSize: '11px', margin: 0, border: '1px solid var(--border)', background: 'var(--surface)' }}
                              onClick={() => handleOpenCVModal(c)}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes scanLaser {
                0% { top: 0%; opacity: 0.8; }
                50% { top: 100%; opacity: 0.8; }
                100% { top: 0%; opacity: 0.8; }
              }
              .laser-bar {
                position: absolute;
                left: 0;
                width: 100%;
                height: 4px;
                background: linear-gradient(90deg, transparent, #4f46e5, #10b981, #4f46e5, transparent);
                box-shadow: 0 0 10px #4f46e5, 0 0 20px #10b981;
                animation: scanLaser 3s infinite linear;
                z-index: 5;
              }
              .drag-zone {
                transition: all 0.3s ease;
                border: 2px dashed var(--border);
                background: rgba(79, 70, 229, 0.01);
              }
              .drag-zone.dragging {
                border-color: var(--primary);
                background: rgba(79, 70, 229, 0.06);
                box-shadow: 0 0 15px rgba(79, 70, 229, 0.15);
                transform: scale(1.01);
              }
              .ocr-badge {
                position: absolute;
                font-size: 9px;
                padding: 1px 4px;
                border-radius: 3px;
                font-weight: bold;
                top: -15px;
                left: 0;
                line-height: 1;
              }
            `}} />

            <div style={{ display: 'grid', gridTemplateColumns: (isParsing || parsedData) ? '1fr 1.2fr' : '1fr', gap: '24px' }}>
              
              {/* Left Column: Upload Zone or PDF Laser Scan Viewer */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* 1. Drag and Drop Uploader */}
                <div 
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file && file.type === 'application/pdf') {
                      setFileName(file.name);
                      setIsFileUploaded(true);
                      setParsedData(null);
                    } else {
                      alert(locale === 'vi' ? 'Vui lòng tải lên file định dạng PDF!' : 'Please upload a PDF file!');
                    }
                  }}
                  className={`card drag-zone ${isDragging ? 'dragging' : ''}`}
                  style={{ padding: '32px', textAlign: 'center' }}
                >
                  <input
                    type="file"
                    accept=".pdf"
                    id="cv-file-upload-input"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="cv-file-upload-input" style={{ cursor: 'pointer', display: 'block' }}>
                    <CloudUpload size={48} style={{ color: 'var(--primary)', marginBottom: '16px', transition: 'transform 0.2s' }} />
                    <h4 style={{ fontWeight: 'bold' }}>{pt.uploadTitle}</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px', marginBottom: '20px' }}>
                      {pt.uploadSub}
                    </p>
                    <span className="apply-btn" style={{ display: 'inline-flex', padding: '10px 20px', fontSize: '13px', alignItems: 'center', gap: '6px' }}>
                      {pt.btnUpload}
                    </span>
                  </label>

                  {isFileUploaded && (
                    <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', background: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      <FileText size={16} style={{ color: 'var(--primary)' }} />
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--success)' }}>
                        {fileName}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          setIsFileUploaded(false);
                          setFileName('');
                          setParsedData(null);
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                      >
                        [✕]
                      </button>
                    </div>
                  )}
                </div>

                {/* Parsing trigger and sandbox demo */}
                <div className="card" style={{ padding: '20px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button
                    type="button"
                    className="apply-btn"
                    style={{ background: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px', opacity: isFileUploaded ? 1 : 0.6 }}
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

                {/* PDF Laser Scanning Screen */}
                {isParsing && (
                  <div className="card" style={{ padding: '24px', position: 'relative', overflow: 'hidden', minHeight: '360px', background: 'var(--surface-hover)', display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid var(--border)' }}>
                    <div className="laser-bar" />
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={14} className="animate-spin" /> AI ENGINE SCANNING DOCUMENT
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Page 1 of 1</span>
                    </div>

                    {/* Simulating document contents being scanned */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', opacity: 0.4 }}>
                      <div style={{ width: '40%', height: '16px', background: 'var(--text-muted)', borderRadius: '4px' }} />
                      <div style={{ width: '25%', height: '10px', background: 'var(--text-muted)', borderRadius: '4px' }} />
                      <div style={{ width: '90%', height: '8px', background: 'var(--text-muted)', borderRadius: '4px', marginTop: '10px' }} />
                      <div style={{ width: '85%', height: '8px', background: 'var(--text-muted)', borderRadius: '4px' }} />
                      
                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                        <div style={{ width: '60px', height: '20px', background: 'var(--text-muted)', borderRadius: '10px' }} />
                        <div style={{ width: '80px', height: '20px', background: 'var(--text-muted)', borderRadius: '10px' }} />
                        <div style={{ width: '50px', height: '20px', background: 'var(--text-muted)', borderRadius: '10px' }} />
                      </div>

                      <div style={{ width: '30%', height: '12px', background: 'var(--text-muted)', borderRadius: '4px', marginTop: '15px' }} />
                      <div style={{ width: '70%', height: '8px', background: 'var(--text-muted)', borderRadius: '4px' }} />
                      <div style={{ width: '60%', height: '8px', background: 'var(--text-muted)', borderRadius: '4px' }} />
                    </div>
                  </div>
                )}

                {/* Scanned Highlights Viewer (OCR view) */}
                {parsedData && !isParsing && (
                  <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid var(--border)', background: 'var(--surface-hover)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        ✓ NLP ANALYZER HIGHLIGHTED MATCHES
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Page 1 of 1</span>
                    </div>

                    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '24px', padding: '16px', background: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      
                      {/* Name highlight */}
                      <div style={{ position: 'relative', border: '1px solid #10b981', padding: '8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.03)' }}>
                        <span className="ocr-badge" style={{ backgroundColor: '#10b981', color: '#fff' }}>[NER] FullName</span>
                        <strong style={{ fontSize: '15px' }}>{newName}</strong>
                      </div>

                      {/* Title highlight */}
                      <div style={{ position: 'relative', border: '1px solid var(--primary)', padding: '8px', borderRadius: '4px', background: 'rgba(79, 70, 229, 0.03)' }}>
                        <span className="ocr-badge" style={{ backgroundColor: 'var(--primary)', color: '#fff' }}>[CLASSIFIER] Target Title</span>
                        <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--primary)' }}>{newTitle}</div>
                      </div>

                      {/* Contact row highlight */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ position: 'relative', border: '1px solid #3b82f6', padding: '8px', borderRadius: '4px', background: 'rgba(59, 130, 246, 0.03)' }}>
                          <span className="ocr-badge" style={{ backgroundColor: '#3b82f6', color: '#fff' }}>[REGEX] Email</span>
                          <span style={{ fontSize: '12px', fontFamily: 'monospace' }}>{newEmail}</span>
                        </div>
                        <div style={{ position: 'relative', border: '1px solid #eab308', padding: '8px', borderRadius: '4px', background: 'rgba(234, 179, 8, 0.03)' }}>
                          <span className="ocr-badge" style={{ backgroundColor: '#eab308', color: '#fff' }}>[REGEX] Phone</span>
                          <span style={{ fontSize: '12px', fontFamily: 'monospace' }}>{newPhone}</span>
                        </div>
                      </div>

                      {/* Skills highlight */}
                      <div style={{ position: 'relative', border: '1px solid #a855f7', padding: '12px 8px 8px 8px', borderRadius: '4px', background: 'rgba(168, 85, 247, 0.03)' }}>
                        <span className="ocr-badge" style={{ backgroundColor: '#a855f7', color: '#fff' }}>[KEYWORD] Skill Tree</span>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
                          {newSkills.split(',').map((s) => s.trim()).filter(s => s.length > 0).map((skill, idx) => (
                            <span key={idx} className="cv-skill-badge" style={{ fontSize: '10px', background: '#a855f7', color: '#fff' }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: AI Terminal and Extracted Forms Editor */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* 1. Terminal logs */}
                {(isParsing || parseSteps.length > 0) && (
                  <div className="card" style={{
                    background: '#0d1117',
                    color: '#39d353',
                    fontFamily: 'monospace',
                    padding: '16px',
                    borderRadius: '12px',
                    textAlign: 'left',
                    fontSize: '11.5px',
                    lineHeight: '1.6',
                    maxHeight: '150px',
                    overflowY: 'auto',
                    border: '1px solid #21262d'
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
                      <div className="animate-pulse" style={{ color: '#58a6ff' }}>{pt.terminalRunning}</div>
                    )}
                  </div>
                )}

                {/* 2. Extracted Fields Editor */}
                {parsedData && (
                  <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', animation: 'slideLeft 0.3s ease' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--success)' }}>{pt.extractedTitle}</h3>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '-8px' }}>
                      {pt.extractedSub}
                    </p>

                    <div className="form-group">
                      <label style={{ fontWeight: 600 }}>{pt.fieldFullName}</label>
                      <input type="text" className="search-input" style={{ width: '100%' }} value={newName} onChange={(e) => setNewName(e.target.value)} />
                    </div>

                    <div className="form-group">
                      <label style={{ fontWeight: 600 }}>{pt.fieldDesiredRole}</label>
                      <input type="text" className="search-input" style={{ width: '100%' }} value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label style={{ fontWeight: 600 }}>{pt.fieldEmail}</label>
                        <input type="email" className="search-input" style={{ width: '100%' }} value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label style={{ fontWeight: 600 }}>{pt.fieldPhone}</label>
                        <input type="text" className="search-input" style={{ width: '100%' }} value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
                      </div>
                    </div>

                    <div className="form-group">
                      <label style={{ fontWeight: 600 }}>{pt.fieldLocation}</label>
                      <input type="text" className="search-input" style={{ width: '100%' }} value={newLocation} onChange={(e) => setNewLocation(e.target.value)} />
                    </div>

                    <div className="form-group">
                      <label style={{ fontWeight: 600 }}>{pt.fieldSkills}</label>
                      <input type="text" className="search-input" style={{ width: '100%' }} value={newSkills} onChange={(e) => setNewSkills(e.target.value)} />
                    </div>

                    <div className="form-group">
                      <label style={{ fontWeight: 600 }}>{pt.fieldSummary}</label>
                      <textarea rows={3} className="search-input" style={{ width: '100%', fontFamily: 'inherit', padding: '10px' }} value={newSummary} onChange={(e) => setNewSummary(e.target.value)} />
                    </div>

                    <button
                      type="button"
                      className="apply-btn"
                      style={{ background: 'var(--success)', width: '100%', padding: '12px', fontWeight: 'bold' }}
                      onClick={handleSaveParsedCandidate}
                    >
                      {pt.btnSaveCandidate}
                    </button>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB: PIPELINE & AI MATCHING */}
        {activeSubTab === 'pipeline' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header Switcher */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  {pipelineMode === 'kanban' 
                    ? (locale === 'vi' ? 'Quy trình Tuyển dụng (Kanban)' : 'Recruitment Pipeline (Kanban)') 
                    : (locale === 'vi' ? 'Bộ gợi ý Khớp nối AI' : 'AI Matchmaker Engine')}
                </h2>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {pipelineMode === 'kanban'
                    ? (locale === 'vi' ? 'Theo dõi trạng thái của ứng viên qua các vòng phỏng vấn & thử việc.' : 'Track applicant statuses through interviewing, offering, and hiring.')
                    : (locale === 'vi' ? 'Phân tích tự động cơ so khớp kỹ năng giữa Developer và yêu cầu tuyển dụng.' : 'Algorithmic matching of IT talent to open client requisitions.')}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', background: 'var(--background)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <button
                  type="button"
                  style={{
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    background: pipelineMode === 'kanban' ? 'var(--primary)' : 'transparent',
                    color: pipelineMode === 'kanban' ? '#fff' : 'var(--text-secondary)',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => setPipelineMode('kanban')}
                >
                  📊 Kanban Board
                </button>
                <button
                  type="button"
                  style={{
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    background: pipelineMode === 'matcher' ? 'var(--primary)' : 'transparent',
                    color: pipelineMode === 'matcher' ? '#fff' : 'var(--text-secondary)',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => setPipelineMode('matcher')}
                >
                  ⚡ AI Matcher
                </button>
              </div>
            </div>

            {/* Mode 1: KANBAN BOARD */}
            {pipelineMode === 'kanban' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', paddingBottom: '16px' }}>
                {(['TECHNICAL', 'COMMUNICATION', 'MINDSET', 'COMMITMENT'] as const).map((stage, sIdx, sArr) => {
                  // Group applications by stage
                  const stageApps = applications.filter((app) => {
                    const status = app.status;
                    if (stage === 'TECHNICAL') {
                      return status === 'TECHNICAL' || status === 'APPLIED' || status === 'SCREENING';
                    }
                    if (stage === 'COMMUNICATION') {
                      return status === 'COMMUNICATION';
                    }
                    if (stage === 'MINDSET') {
                      return status === 'MINDSET' || status === 'INTERVIEW';
                    }
                    if (stage === 'COMMITMENT') {
                      return status === 'COMMITMENT' || status === 'OFFERED' || status === 'HIRED' || status === 'REJECTED';
                    }
                    return false;
                  });
                  
                  const getStageTitle = (st: string) => {
                    switch (st) {
                      case 'TECHNICAL': return locale === 'vi' ? '1. Đánh giá Kỹ thuật' : '1. Technical Vetting';
                      case 'COMMUNICATION': return locale === 'vi' ? '2. Giao tiếp & Ngoại ngữ' : '2. Communication Layer';
                      case 'MINDSET': return locale === 'vi' ? '3. Tư duy & Logic' : '3. Mindset & Logic';
                      case 'COMMITMENT': return locale === 'vi' ? '4. Cam kết & Phái cử' : '4. Commitment & Offer';
                      default: return st;
                    }
                  };

                  const getStageColor = (st: string) => {
                    switch (st) {
                      case 'TECHNICAL': return 'var(--primary)';
                      case 'COMMUNICATION': return 'var(--secondary)';
                      case 'MINDSET': return '#fbbf24'; // Amber/Gold
                      case 'COMMITMENT': return 'var(--success)';
                      default: return 'var(--text-muted)';
                    }
                  };

                  return (
                    <div
                      key={stage}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={async (e) => {
                        e.preventDefault();
                        const appIdStr = e.dataTransfer.getData('text/plain');
                        if (appIdStr) {
                          const appId = Number(appIdStr);
                          await updateApplicationStatus(appId, stage);
                          router.refresh();
                        }
                      }}
                      style={{
                        background: 'var(--surface)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                        padding: '16px',
                        minHeight: '520px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {/* Column Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid ' + getStageColor(stage), paddingBottom: '10px' }}>
                        <span style={{ fontWeight: '800', fontSize: '13px', color: 'var(--text-primary)' }}>
                          {getStageTitle(stage)}
                        </span>
                        <span style={{ fontSize: '11px', background: 'var(--background)', color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold', border: '1px solid var(--border)' }}>
                          {stageApps.length}
                        </span>
                      </div>

                      {/* App cards list */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', flex: 1, maxHeight: '60vh', paddingRight: '2px' }}>
                        {stageApps.map((app) => {
                          const rating = app.candidate.rating !== undefined ? Number(app.candidate.rating) : 5.0;
                          
                          // Determine status badge (Pass / Fail / Pending)
                          let badgeText = locale === 'vi' ? 'Đang chờ' : 'Pending';
                          let badgeColorClass = 'ba-badge-warning';
                          let badgeStyles = { color: 'var(--warning)', backgroundColor: 'var(--warning-bg)' };

                          if (app.status === 'REJECTED') {
                            badgeText = locale === 'vi' ? 'Từ chối' : 'Fail';
                            badgeColorClass = 'ba-badge-danger';
                            badgeStyles = { color: 'var(--danger)', backgroundColor: 'var(--danger-bg)' };
                          } else if (rating >= 4.5) {
                            badgeText = locale === 'vi' ? 'Đạt' : 'Pass';
                            badgeColorClass = 'ba-badge-success';
                            badgeStyles = { color: 'var(--success)', backgroundColor: 'var(--success-bg)' };
                          } else if (rating < 3.0) {
                            badgeText = locale === 'vi' ? 'Không đạt' : 'Fail';
                            badgeColorClass = 'ba-badge-danger';
                            badgeStyles = { color: 'var(--danger)', backgroundColor: 'var(--danger-bg)' };
                          }

                          return (
                            <div
                              key={app.id}
                              draggable
                              onDragStart={(e) => {
                                e.dataTransfer.setData('text/plain', app.id.toString());
                                e.dataTransfer.effectAllowed = 'move';
                              }}
                              style={{
                                background: 'var(--background)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-sm)',
                                padding: '14px',
                                cursor: 'grab',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                                transition: 'all 0.2s ease',
                              }}
                              className="kanban-card-hover"
                              onClick={() => handleOpenCVModal(app.candidate as any)}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                                <h4 style={{ fontWeight: 'bold', fontSize: '13px', color: 'var(--text-primary)', margin: 0 }}>
                                  {app.candidate.name}
                                </h4>
                                <span className={`badge ${badgeColorClass}`} style={{ fontSize: '9px', padding: '2px 6px', fontWeight: 'bold', ...badgeStyles }}>
                                  {badgeText}
                                </span>
                              </div>
                              
                              <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 700 }}>
                                {app.candidate.title}
                              </div>

                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', borderTop: '1px solid var(--border)', paddingTop: '8px', fontSize: '11px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ffb100', fontWeight: 'bold' }}>
                                  <Star size={12} fill="#ffb100" style={{ color: '#ffb100' }} />
                                  <span>{rating.toFixed(1)}</span>
                                </div>
                                <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                                  🏢 {app.job.company}
                                </span>
                              </div>

                              {/* Quick Transitions */}
                              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', marginTop: '4px' }} onClick={(e) => e.stopPropagation()}>
                                {sIdx > 0 && (
                                  <button
                                    type="button"
                                    title="Move left"
                                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '2px 6px', borderRadius: '4px', cursor: 'pointer', fontSize: '10px', transition: 'all 0.1s' }}
                                    onClick={async () => {
                                      const prevStage = sArr[sIdx - 1];
                                      await updateApplicationStatus(app.id, prevStage);
                                      router.refresh();
                                    }}
                                  >
                                    ◀
                                  </button>
                                )}
                                {sIdx < sArr.length - 1 && (
                                  <button
                                    type="button"
                                    title="Move right"
                                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '2px 6px', borderRadius: '4px', cursor: 'pointer', fontSize: '10px', transition: 'all 0.1s' }}
                                    onClick={async () => {
                                      const nextStage = sArr[sIdx + 1];
                                      await updateApplicationStatus(app.id, nextStage);
                                      router.refresh();
                                    }}
                                  >
                                    ▶
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        {stageApps.length === 0 && (
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', padding: '32px 0', border: '1px dashed var(--border)', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.01)' }}>
                            {locale === 'vi' ? 'Trống' : 'Empty'}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Mode 2: AI MATCHMAKER */}
            {pipelineMode === 'matcher' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="card" style={{ padding: '20px' }}>
                  <label style={{ fontWeight: 'bold', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                    {locale === 'vi' ? '1. Chọn Yêu cầu tuyển dụng để khớp nối:' : '1. Select Job Request to Match:'}
                  </label>
                  <select
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--surface-hover)', border: '1px solid var(--border)', color: 'var(--text-main)', fontSize: '13.5px', outline: 'none' }}
                    value={selectedJobId || ''}
                    onChange={(e) => setSelectedJobId(Number(e.target.value) || null)}
                  >
                    <option value="">-- {locale === 'vi' ? 'Chọn vị trí trống' : 'Select an open role'} --</option>
                    {jobs.filter(j => j.status === 'Active').map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.title} ({j.company}) - Tag: [{j.tags.join(', ')}]
                      </option>
                    ))}
                  </select>
                </div>

                {selectedJobId && (() => {
                  const selectedJob = jobs.find((j) => j.id === selectedJobId);
                  if (!selectedJob) return null;

                  // Rank AVAILABLE candidates based on skill match
                  const matchedCandidates = candidates
                    .filter((c) => c.status === 'AVAILABLE')
                    .map((candidate) => {
                      const jobTagsLower = selectedJob.tags.map((t) => t.toLowerCase());
                      const matchedSkills = candidate.skills.filter((s) => jobTagsLower.includes(s.toLowerCase()));
                      const missingSkills = selectedJob.tags.filter((t) => !candidate.skills.some((s) => s.toLowerCase() === t.toLowerCase()));
                      
                      // Match score: percent of required skills covered
                      const score = selectedJob.tags.length > 0 
                        ? Math.round((matchedSkills.length / selectedJob.tags.length) * 100)
                        : 50;

                      return {
                        candidate,
                        score,
                        matchedSkills,
                        missingSkills,
                      };
                    }).sort((a, b) => b.score - a.score);

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.25s ease' }}>
                      <div className="card" style={{ padding: '20px', borderLeft: '4px solid var(--primary)', background: 'var(--surface)' }}>
                        <h4 style={{ fontSize: '15px', fontWeight: 'bold' }}>🎯 {selectedJob.title}</h4>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          🏢 {selectedJob.company} | 📍 {selectedJob.location} | 💰 {selectedJob.salary}
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                          {selectedJob.tags.map((tag, idx) => (
                            <span key={idx} className="job-tag" style={{ fontSize: '11px', background: 'rgba(79, 70, 229, 0.08)', color: 'var(--primary)' }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginTop: '8px' }}>
                        {locale === 'vi' ? 'Kết quả khớp nối ứng viên:' : 'Candidate Match Results:'}
                      </h3>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {matchedCandidates.map(({ candidate, score, matchedSkills, missingSkills }) => {
                          const hasApplied = applications.some((app) => app.jobId === selectedJob.id && app.candidateId === candidate.id);
                          
                          return (
                            <div
                              key={candidate.id}
                              className="card"
                              style={{
                                padding: '20px',
                                display: 'grid',
                                gridTemplateColumns: '1fr auto',
                                gap: '20px',
                                alignItems: 'center',
                                border: '1px solid var(--border)',
                                background: 'var(--surface)'
                              }}
                            >
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <h4 style={{ fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }} onClick={() => handleOpenCVModal(candidate)}>
                                    {candidate.name}
                                  </h4>
                                  <span className="badge" style={{
                                    backgroundColor: score >= 75 ? 'var(--success-bg)' : score >= 40 ? 'var(--secondary-light)' : 'rgba(255,0,0,0.05)',
                                    color: score >= 75 ? 'var(--success)' : score >= 40 ? 'var(--secondary)' : 'var(--danger)',
                                    fontWeight: 'bold'
                                  }}>
                                    {score}% Match
                                  </span>
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600, marginTop: '2px' }}>
                                  {candidate.title} (Rating: ★ {candidate.rating !== undefined ? Number(candidate.rating).toFixed(1) : '5.0'})
                                </div>

                                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.4 }}>
                                  {candidate.summary}
                                </p>

                                {/* Skill overlap report */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '12px' }}>
                                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center', fontSize: '11.5px' }}>
                                    <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓ {locale === 'vi' ? 'Trùng khớp:' : 'Matches:'}</span>
                                    {matchedSkills.length > 0 ? matchedSkills.map((s, idx) => (
                                      <span key={idx} style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '2px 6px', borderRadius: '4px', fontSize: '10.5px' }}>{s}</span>
                                    )) : <span style={{ color: 'var(--text-muted)' }}>None</span>}
                                  </div>

                                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center', fontSize: '11.5px' }}>
                                    <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>✗ {locale === 'vi' ? 'Còn thiếu:' : 'Missing:'}</span>
                                    {missingSkills.length > 0 ? missingSkills.map((s, idx) => (
                                      <span key={idx} style={{ background: 'rgba(255,0,0,0.05)', color: 'var(--danger)', padding: '2px 6px', borderRadius: '4px', fontSize: '10.5px' }}>{s}</span>
                                    )) : <span style={{ color: 'var(--text-muted)' }}>None</span>}
                                  </div>
                                </div>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'stretch', minWidth: '120px' }}>
                                {hasApplied ? (
                                  <button
                                    type="button"
                                    disabled
                                    style={{
                                      padding: '8px 12px',
                                      fontSize: '12px',
                                      fontWeight: 'bold',
                                      background: 'var(--surface-hover)',
                                      color: 'var(--text-muted)',
                                      border: '1px solid var(--border)',
                                      borderRadius: '6px',
                                      textAlign: 'center'
                                    }}
                                  >
                                    ✓ {locale === 'vi' ? 'Đã phái cử' : 'Already Assigned'}
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    className="apply-btn"
                                    style={{ padding: '8px 12px', fontSize: '12px' }}
                                    onClick={async () => {
                                      setIsAssigningJobId(candidate.id);
                                      const res = await applyToJob(selectedJob.id, candidate.id);
                                      setIsAssigningJobId(null);
                                      if (res.success) {
                                        alert(locale === 'vi' ? 'Phái cử nhân sự ứng tuyển thành công!' : 'Assigned candidate to job successfully!');
                                        router.refresh();
                                      } else {
                                        alert(res.error || 'Failed');
                                      }
                                    }}
                                    disabled={isAssigningJobId === candidate.id}
                                  >
                                    {isAssigningJobId === candidate.id ? '...' : (locale === 'vi' ? 'Phái cử ngay' : 'Assign Role')}
                                  </button>
                                )}
                                <button
                                  type="button"
                                  className="nav-tab"
                                  style={{ margin: 0, padding: '8px 12px', fontSize: '12px', border: '1px solid var(--border)', background: 'var(--surface)', textAlign: 'center' }}
                                  onClick={() => onOpenChat(candidate.name)}
                                >
                                  💬 {locale === 'vi' ? 'Trò chuyện' : 'Chat'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Custom css styles for Kanban */}
            <style dangerouslySetInnerHTML={{__html: `
              .kanban-card-hover {
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
              }
              .kanban-card-hover:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                border-color: var(--primary) !important;
              }
            `}} />
          </div>
        )}

        {/* SUB-TAB 4: JOB REQUESTS */}
        {activeSubTab === 'requests' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>{pt.jobHeader}</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{pt.jobSub}</p>
              </div>
              <button
                type="button"
                className="btn-solid-orange"
                style={{ height: '40px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
                onClick={() => setIsCreateJobOpen(true)}
              >
                <Plus size={16} />
                {locale === 'vi' ? 'Tạo yêu cầu mới' : 'Create Job Request'}
              </button>
            </div>

            {isCreateJobOpen && (
              <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid var(--primary)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>{locale === 'vi' ? 'Thêm Yêu Cầu Tuyển Dụng Mới' : 'Add New Job Request'}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{locale === 'vi' ? 'Tiêu đề vị trí tuyển dụng *' : 'Job Title *'}</label>
                    <input
                      type="text"
                      className="search-input"
                      style={{ width: '100%' }}
                      placeholder="e.g. Senior React Developer"
                      value={newJobTitle}
                      onChange={(e) => setNewJobTitle(e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{locale === 'vi' ? 'Khách hàng / Công ty *' : 'Client Company *'}</label>
                    <input
                      type="text"
                      className="search-input"
                      style={{ width: '100%' }}
                      placeholder="e.g. VinGroup"
                      value={newJobCompany}
                      onChange={(e) => setNewJobCompany(e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{locale === 'vi' ? 'Địa điểm *' : 'Location *'}</label>
                    <input
                      type="text"
                      className="search-input"
                      style={{ width: '100%' }}
                      placeholder="e.g. Hà Nội (Hybrid)"
                      value={newJobLocation}
                      onChange={(e) => setNewJobLocation(e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{locale === 'vi' ? 'Mức lương hiển thị *' : 'Salary Display *'}</label>
                    <input
                      type="text"
                      className="search-input"
                      style={{ width: '100%' }}
                      placeholder="e.g. 30,000,000 - 45,000,000 VND"
                      value={newJobSalary}
                      onChange={(e) => setNewJobSalary(e.target.value)}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{locale === 'vi' ? 'Kỹ năng yêu cầu (cách nhau bởi dấu phẩy)' : 'Required Skills (comma-separated)'}</label>
                  <input
                    type="text"
                    className="search-input"
                    style={{ width: '100%' }}
                    placeholder="React, TypeScript, CSS"
                    value={newJobTags}
                    onChange={(e) => setNewJobTags(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{locale === 'vi' ? 'Mô tả chi tiết yêu cầu tuyển dụng' : 'Detailed Job Description'}</label>
                  <textarea
                    className="search-input"
                    style={{ width: '100%', minHeight: '100px', resize: 'vertical', fontFamily: 'inherit', padding: '10px' }}
                    placeholder={locale === 'vi' ? 'Nhập mô tả dự án và các tiêu chí tuyển chọn...' : 'Enter project description and criteria...'}
                    value={newJobDesc}
                    onChange={(e) => setNewJobDesc(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="role-btn"
                    style={{ backgroundColor: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' }}
                    onClick={() => setIsCreateJobOpen(false)}
                  >
                    {locale === 'vi' ? 'Hủy' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    className="btn-solid-orange"
                    style={{ height: '38px', padding: '0 16px' }}
                    onClick={handleCreateJob}
                    disabled={isSavingJob}
                  >
                    {isSavingJob ? (locale === 'vi' ? 'Đang tạo...' : 'Creating...') : (locale === 'vi' ? 'Tạo yêu cầu' : 'Create Request')}
                  </button>
                </div>
              </div>
            )}

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>{pt.partnerHeader}</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{locale === 'vi' ? 'Quản lý mạng lưới đối tác cung ứng và freelancers.' : 'Manage supplier partners and freelancer registry.'}</p>
              </div>
              <button
                type="button"
                className="btn-solid-orange"
                style={{ height: '40px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
                onClick={() => setIsAddPartnerOpen(true)}
              >
                <Plus size={16} />
                {locale === 'vi' ? 'Đăng ký đối tác' : 'Register Partner'}
              </button>
            </div>

            {isAddPartnerOpen && (
              <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid var(--primary)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>{locale === 'vi' ? 'Đăng ký Đối tác / Freelancer mới' : 'Register New Partner / Freelancer'}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{locale === 'vi' ? 'Mã đối tác (Viết tắt) *' : 'Partner Code *'}</label>
                    <input
                      type="text"
                      className="search-input"
                      style={{ width: '100%' }}
                      placeholder="e.g. FSOFT, RIKKEI, HWL"
                      value={newPartnerCode}
                      onChange={(e) => setNewPartnerCode(e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{locale === 'vi' ? 'Tên đối tác / Pháp nhân *' : 'Entity Name *'}</label>
                    <input
                      type="text"
                      className="search-input"
                      style={{ width: '100%' }}
                      placeholder="e.g. FPT Software Co., Ltd"
                      value={newPartnerName}
                      onChange={(e) => setNewPartnerName(e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{locale === 'vi' ? 'Loại hình đối tác *' : 'Classification *'}</label>
                    <select
                      className="search-input"
                      style={{ width: '100%', background: 'var(--background)', color: 'var(--text)' }}
                      value={newPartnerType}
                      onChange={(e) => setNewPartnerType(e.target.value)}
                    >
                      <option value="COMPANY">{locale === 'vi' ? 'Doanh nghiệp / Agency' : 'Company / Agency'}</option>
                      <option value="FREELANCER">{locale === 'vi' ? 'Freelancer tự do' : 'Freelancer'}</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{locale === 'vi' ? 'Mã số thuế *' : 'Tax Code *'}</label>
                    <input
                      type="text"
                      className="search-input"
                      style={{ width: '100%' }}
                      placeholder="e.g. 0101234567"
                      value={newPartnerTaxCode}
                      onChange={(e) => setNewPartnerTaxCode(e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{locale === 'vi' ? 'Người đại diện pháp lý *' : 'Legal Representative *'}</label>
                    <input
                      type="text"
                      className="search-input"
                      style={{ width: '100%' }}
                      placeholder="e.g. Nguyễn Văn A"
                      value={newPartnerRep}
                      onChange={(e) => setNewPartnerRep(e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{locale === 'vi' ? 'Số lượng Dev có thể cung cấp' : 'Initial Supplied Devs'}</label>
                    <input
                      type="number"
                      className="search-input"
                      style={{ width: '100%' }}
                      placeholder="0"
                      value={newPartnerDevsCount}
                      onChange={(e) => setNewPartnerDevsCount(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="role-btn"
                    style={{ backgroundColor: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' }}
                    onClick={() => setIsAddPartnerOpen(false)}
                  >
                    {locale === 'vi' ? 'Hủy' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    className="btn-solid-orange"
                    style={{ height: '38px', padding: '0 16px' }}
                    onClick={handleCreatePartner}
                    disabled={isSavingPartner}
                  >
                    {isSavingPartner ? (locale === 'vi' ? 'Đang lưu...' : 'Saving...') : (locale === 'vi' ? 'Đăng ký đối tác' : 'Register Partner')}
                  </button>
                </div>
              </div>
            )}

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
                          backgroundColor: p.type === 'COMPANY' ? 'var(--secondary-light)' : 'var(--success-bg)',
                          color: p.type === 'COMPANY' ? 'var(--secondary)' : 'var(--success)'
                        }}>
                          {p.type === 'COMPANY' ? pt.partnerCompany : pt.partnerFreelancer}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontFamily: 'monospace' }}>{p.taxCode}</td>
                      <td style={{ padding: '14px 16px' }}>{p.repName}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 700 }}>{p.devsCount} {pt.partnerDevsCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB-TAB: ACCOUNTS MANAGEMENT (ADMIN ONLY) */}
        {activeSubTab === 'accounts' && currentUser.role === 'admin' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>
                  {locale === 'vi' ? 'Hệ thống Quản lý Tài khoản' : 'Account Management System'}
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  {locale === 'vi' ? 'Admin cấp tài khoản truy cập hệ thống cho TA Staff và BA Manager.' : 'Admin provisions access accounts for TA Staff and BA Manager.'}
                </p>
              </div>
            </div>

            {/* Create Account Form */}
            <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid var(--primary)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>
                {locale === 'vi' ? 'Cấp tài khoản mới' : 'Provision New Account'}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{locale === 'vi' ? 'Họ và tên *' : 'Full Name *'}</label>
                  <input
                    type="text"
                    className="search-input"
                    style={{ width: '100%' }}
                    placeholder="e.g. Nguyễn Văn A"
                    value={newAccName}
                    onChange={(e) => setNewAccName(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{locale === 'vi' ? 'Email đăng nhập *' : 'Login Email *'}</label>
                  <input
                    type="email"
                    className="search-input"
                    style={{ width: '100%' }}
                    placeholder="e.g. name@vertex.vn"
                    value={newAccEmail}
                    onChange={(e) => setNewAccEmail(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{locale === 'vi' ? 'Mật khẩu khởi tạo *' : 'Initial Password *'}</label>
                  <input
                    type="password"
                    className="search-input"
                    style={{ width: '100%' }}
                    placeholder="e.g. password"
                    value={newAccPassword}
                    onChange={(e) => setNewAccPassword(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{locale === 'vi' ? 'Vai trò truy cập *' : 'System Role *'}</label>
                  <select
                    className="search-input"
                    style={{ width: '100%', background: 'var(--background)', color: 'var(--text)' }}
                    value={newAccRole}
                    onChange={(e) => setNewAccRole(e.target.value)}
                  >
                    <option value="ta">{locale === 'vi' ? 'TA Staff (Tuyển dụng)' : 'TA Staff (Talent Acquisition)'}</option>
                    <option value="ba">{locale === 'vi' ? 'BA Manager (Kinh doanh / Margin)' : 'BA Manager (Business Analyst)'}</option>
                    <option value="admin">{locale === 'vi' ? 'Admin Quản trị' : 'Admin System Manager'}</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn-solid-orange"
                  style={{ height: '38px', padding: '0 16px' }}
                  onClick={handleCreateAccount}
                  disabled={isSavingAccount}
                >
                  {isSavingAccount ? (locale === 'vi' ? 'Đang cấp...' : 'Provisioning...') : (locale === 'vi' ? 'Cấp tài khoản' : 'Provision Account')}
                </button>
              </div>
            </div>

            {/* Accounts List Table */}
            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                <thead>
                  <tr style={{ background: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '14px 16px' }}>{locale === 'vi' ? 'Họ và tên' : 'Full Name'}</th>
                    <th style={{ padding: '14px 16px' }}>{locale === 'vi' ? 'Email đăng nhập' : 'Login Email'}</th>
                    <th style={{ padding: '14px 16px' }}>{locale === 'vi' ? 'Vai trò' : 'System Role'}</th>
                    <th style={{ padding: '14px 16px' }}>{locale === 'vi' ? 'Ngày tạo' : 'Date Created'}</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((acc) => (
                    <tr key={acc.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 'bold' }}>{acc.name}</td>
                      <td style={{ padding: '14px 16px', fontFamily: 'monospace' }}>{acc.email}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className="badge" style={{
                          backgroundColor: acc.role === 'admin' ? 'var(--danger-bg)' : acc.role === 'ta' ? 'var(--primary-light)' : 'var(--secondary-light)',
                          color: acc.role === 'admin' ? 'var(--danger)' : acc.role === 'ta' ? 'var(--primary)' : 'var(--secondary)',
                          textTransform: 'uppercase',
                          fontWeight: 'bold'
                        }}>
                          {acc.role === 'admin' ? 'Admin' : acc.role === 'ta' ? 'TA Staff' : 'BA Manager'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                        {new Date(acc.createdAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Permission Matrix Table */}
            <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold' }}>
                🔑 {locale === 'vi' ? 'Ma trận Quyền hạn (Permission Matrix)' : 'System Permission Matrix'}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '-8px' }}>
                {locale === 'vi' ? 'Cấu hình quyền hạn đọc/ghi/xóa dữ liệu hệ thống cho từng phân quyền.' : 'Manage granular system access permissions (View, Edit, Delete) per role.'}
              </p>
              
              <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '12px 16px', fontWeight: 'bold' }}>{locale === 'vi' ? 'Vai trò truy cập' : 'System Role'}</th>
                      <th style={{ padding: '12px 16px', fontWeight: 'bold', textAlign: 'center' }}>{locale === 'vi' ? 'Đọc dữ liệu (View)' : 'View Data'}</th>
                      <th style={{ padding: '12px 16px', fontWeight: 'bold', textAlign: 'center' }}>{locale === 'vi' ? 'Chỉnh sửa (Edit)' : 'Edit Data'}</th>
                      <th style={{ padding: '12px 16px', fontWeight: 'bold', textAlign: 'center' }}>{locale === 'vi' ? 'Xóa dữ liệu (Delete)' : 'Delete Data'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(['ta', 'ba', 'admin'] as const).map((role) => (
                      <tr key={role} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                          {role === 'ta' ? 'TA Staff' : role === 'ba' ? 'BA Manager' : 'Admin'}
                        </td>
                        {/* View Switch */}
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', position: 'relative' }}>
                            <input
                              type="checkbox"
                              checked={permissions[role].view}
                              onChange={() => togglePermission(role, 'view')}
                              style={{ display: 'none' }}
                            />
                            <div style={{
                              width: '34px',
                              height: '18px',
                              backgroundColor: permissions[role].view ? 'var(--primary)' : 'var(--border)',
                              borderRadius: '9px',
                              position: 'relative',
                              transition: 'background-color 0.2s',
                            }}>
                              <div style={{
                                width: '14px',
                                height: '14px',
                                backgroundColor: '#fff',
                                borderRadius: '50%',
                                position: 'absolute',
                                top: '2px',
                                left: permissions[role].view ? '18px' : '2px',
                                transition: 'left 0.2s',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                              }} />
                            </div>
                          </label>
                        </td>
                        {/* Edit Switch */}
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', position: 'relative' }}>
                            <input
                              type="checkbox"
                              checked={permissions[role].edit}
                              onChange={() => togglePermission(role, 'edit')}
                              style={{ display: 'none' }}
                            />
                            <div style={{
                              width: '34px',
                              height: '18px',
                              backgroundColor: permissions[role].edit ? 'var(--primary)' : 'var(--border)',
                              borderRadius: '9px',
                              position: 'relative',
                              transition: 'background-color 0.2s',
                            }}>
                              <div style={{
                                width: '14px',
                                height: '14px',
                                backgroundColor: '#fff',
                                borderRadius: '50%',
                                position: 'absolute',
                                top: '2px',
                                left: permissions[role].edit ? '18px' : '2px',
                                transition: 'left 0.2s',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                              }} />
                            </div>
                          </label>
                        </td>
                        {/* Delete Switch */}
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', position: 'relative' }}>
                            <input
                              type="checkbox"
                              checked={permissions[role].delete}
                              onChange={() => togglePermission(role, 'delete')}
                              style={{ display: 'none' }}
                            />
                            <div style={{
                              width: '34px',
                              height: '18px',
                              backgroundColor: permissions[role].delete ? 'var(--primary)' : 'var(--border)',
                              borderRadius: '9px',
                              position: 'relative',
                              transition: 'background-color 0.2s',
                            }}>
                              <div style={{
                                width: '14px',
                                height: '14px',
                                backgroundColor: '#fff',
                                borderRadius: '50%',
                                position: 'absolute',
                                top: '2px',
                                left: permissions[role].delete ? '18px' : '2px',
                                transition: 'left 0.2s',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                              }} />
                            </div>
                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Danger Zone Safeguard UX */}
            <div className="card" style={{ padding: '20px', border: '1px dashed var(--danger)', background: 'var(--danger-bg)', borderRadius: 'var(--radius-md)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--danger)' }}>
                ⚠️ {locale === 'vi' ? 'Vùng Nguy Hiểm (Danger Zone)' : 'Danger Zone'}
              </h3>
              <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '4px', marginBottom: '16px' }}>
                {locale === 'vi' 
                  ? 'Những hành động sau đây sẽ phá hủy vĩnh viễn dữ liệu và không thể hoàn tác. Vui lòng xác nhận kỹ lưỡng.' 
                  : 'Destructive system operations. These actions permanently erase configurations and are irreversible.'}
              </p>
              
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {/* Action 1: Delete User */}
                <div style={{ background: 'var(--surface)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold' }}>
                    {locale === 'vi' ? 'Xóa tài khoản người dùng' : 'Delete User Account'}
                  </span>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                    {locale === 'vi' ? 'Xóa vĩnh viễn quyền truy cập và dữ liệu lịch sử.' : 'Revoke system access and purge historic activities.'}
                  </span>
                  <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '4px' }}>
                    <button
                      type="button"
                      style={{ padding: '6px 12px', fontSize: '11px', fontWeight: 'bold', color: '#fff', background: 'var(--danger)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      onClick={() => handleOpenConfirmModal('user', 'ta-1', 'Nguyễn Văn TA')}
                    >
                      {locale === 'vi' ? 'Xóa Người Dùng' : 'Purge User Account'}
                    </button>
                  </div>
                </div>

                {/* Action 2: Cancel Contract */}
                <div style={{ background: 'var(--surface)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold' }}>
                    {locale === 'vi' ? 'Hủy hợp đồng Startup' : 'Cancel Partner Contract'}
                  </span>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                    {locale === 'vi' ? 'Chấm dứt thỏa thuận phái cử và đóng tất cả pipeline.' : 'De-authorize developer supply agreements immediately.'}
                  </span>
                  <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '4px' }}>
                    <button
                      type="button"
                      style={{ padding: '6px 12px', fontSize: '11px', fontWeight: 'bold', color: 'var(--danger)', background: 'transparent', border: '1px solid var(--danger)', borderRadius: '4px', cursor: 'pointer' }}
                      onClick={() => handleOpenConfirmModal('contract', 'p-1', 'AlphaTech AI Corporation')}
                    >
                      {locale === 'vi' ? 'Hủy Hợp Đồng' : 'Terminate Contract'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone Confirmation Modal */}
            {isConfirmModalOpen && confirmTarget && (
              <div className="modal-backdrop" style={{ zIndex: 10000, background: 'rgba(0,0,0,0.6)' }}>
                <div className="modal-content" style={{ maxWidth: '450px', border: '1px solid var(--danger)', padding: '24px' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ padding: '10px', borderRadius: '50%', background: 'var(--danger-bg)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ShieldAlert size={24} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>
                        {locale === 'vi' ? 'Xác nhận Hành động Nguy hiểm?' : 'Confirm Destructive Action?'}
                      </h3>
                      <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {confirmTarget.type === 'user' ? (
                          locale === 'vi' 
                            ? <>Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản của <strong>{confirmTarget.name}</strong>? Dữ liệu này không thể được khôi phục.</>
                            : <>Are you absolutely sure you want to permanently delete the user account of <strong>{confirmTarget.name}</strong>? This action is irreversible.</>
                        ) : (
                          locale === 'vi'
                            ? <>Bạn có chắc chắn muốn chấm dứt hợp đồng pháp nhân với <strong>{confirmTarget.name}</strong>? Mọi thông tin thanh toán sẽ được khóa ngay lập tức.</>
                            : <>Are you absolutely sure you want to terminate the business contract with <strong>{confirmTarget.name}</strong>? Active payroll lines will freeze instantly.</>
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}>
                        <button
                          type="button"
                          style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer' }}
                          onClick={() => {
                            setIsConfirmModalOpen(false);
                            setConfirmTarget(null);
                          }}
                          disabled={isExecutingDestruction}
                        >
                          {locale === 'vi' ? 'Hủy bỏ' : 'Cancel'}
                        </button>
                        <button
                          type="button"
                          style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 'bold', color: '#fff', background: 'var(--danger)', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                          onClick={handleConfirmDestruction}
                          disabled={isExecutingDestruction}
                        >
                          {isExecutingDestruction ? (locale === 'vi' ? 'Đang thực thi...' : 'Executing...') : (locale === 'vi' ? 'Xác nhận thực hiện' : 'Confirm Execution')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
              candidates={candidates}
              partners={partners}
              jobs={jobs}
            />
          </div>
        )}

      </div>

      {/* DETAILED CV MODAL POPUP */}
      {viewingCandidateCV && (
        <div className="modal-backdrop" onClick={() => setViewingCandidateCV(null)}>
          <div className="modal-content" style={{ maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <h3 className="flex-center" style={{ gap: '8px' }}>
                  <FileText size={18} style={{ color: 'var(--primary)' }} />
                  {pt.modalCvHeader} {viewingCandidateCV.name}
                </h3>
                <button type="button" className="close-btn" onClick={() => setViewingCandidateCV(null)}>
                  <X size={20} />
                </button>
              </div>

              {/* Modal tabs for TA Staff */}
              {isTA && (
                <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', width: '100%', paddingBottom: '8px' }}>
                  <button
                    type="button"
                    className={`nav-tab-modern ${modalActiveTab === 'cv' ? 'active' : ''}`}
                    style={{ margin: 0, padding: '6px 14px', fontSize: '12.5px', background: modalActiveTab === 'cv' ? 'var(--surface-hover)' : 'transparent', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                    onClick={() => setModalActiveTab('cv')}
                  >
                    📄 {locale === 'vi' ? 'Thông tin CV' : 'CV Profile'}
                  </button>
                  <button
                    type="button"
                    className={`nav-tab-modern ${modalActiveTab === 'assessment' ? 'active' : ''}`}
                    style={{ margin: 0, padding: '6px 14px', fontSize: '12.5px', background: modalActiveTab === 'assessment' ? 'var(--surface-hover)' : 'transparent', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                    onClick={() => setModalActiveTab('assessment')}
                  >
                    ⭐ {locale === 'vi' ? 'Đánh giá nội bộ' : 'TA Assessment'}
                  </button>
                </div>
              )}
            </div>

            <div className="modal-body" style={{ overflowY: 'auto', maxHeight: '60vh', padding: '20px' }}>
              {modalActiveTab === 'cv' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 'bold' }}>{viewingCandidateCV.title}</h4>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <span>📧 {viewingCandidateCV.email}</span>
                      <span>📞 {viewingCandidateCV.phone}</span>
                      <span>📍 {viewingCandidateCV.location}</span>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                    <h5 style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 'bold' }}>{pt.modalSummaryHeader}</h5>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.5 }}>
                      {viewingCandidateCV.summary}
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                    <h5 style={{ fontSize: '13px', color: 'var(--primary)', marginBottom: '8px', fontWeight: 'bold' }}>{pt.modalSkillsHeader}</h5>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {viewingCandidateCV.skills.map((skill, idx) => (
                        <span key={idx} style={{ fontSize: '11px', background: 'var(--background)', color: 'var(--text-secondary)', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {viewingCandidateCV.internalNotes && (
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', background: 'rgba(255, 177, 0, 0.03)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255, 177, 0, 0.15)' }}>
                      <h5 style={{ fontSize: '13px', color: '#ffb100', marginBottom: '4px', fontWeight: 'bold' }}>⚠️ {locale === 'vi' ? 'Ghi chú đánh giá nội bộ' : 'TA Internal Assessment notes'}</h5>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>
                        {viewingCandidateCV.internalNotes}
                      </p>
                    </div>
                  )}

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                    <h5 style={{ fontSize: '13px', color: 'var(--primary)', marginBottom: '8px', fontWeight: 'bold' }}>{pt.modalExpHeader}</h5>
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
                    <h5 style={{ fontSize: '13px', color: 'var(--primary)', marginBottom: '8px', fontWeight: 'bold' }}>{pt.modalEduHeader}</h5>
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
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.2s ease' }}>
                  
                  {/* 1. Vetting Checklist */}
                  <div className="card" style={{ padding: '16px', background: 'var(--surface-hover)', display: 'flex', flexDirection: 'column', gap: '10px', border: '1px solid var(--border)' }}>
                    <h5 style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '6px', margin: 0 }}>
                      📋 {locale === 'vi' ? 'Quy trình kiểm tra (Checklist)' : 'Vetting Checklist'}
                    </h5>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '6px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={checklistCV} onChange={(e) => setChecklistCV(e.target.checked)} />
                        <span>CV Screening</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={checklistInterview} onChange={(e) => setChecklistInterview(e.target.checked)} />
                        <span>Initial Interview</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={checklistTech} onChange={(e) => setChecklistTech(e.target.checked)} />
                        <span>Technical Assessment</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={checklistCulture} onChange={(e) => setChecklistCulture(e.target.checked)} />
                        <span>Cultural Fit & English</span>
                      </label>
                    </div>
                  </div>

                  {/* 2. Technical Scorecard Subscores */}
                  <div className="card" style={{ padding: '16px', background: 'var(--surface-hover)', display: 'flex', flexDirection: 'column', gap: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
                      <h5 style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--primary)', margin: 0 }}>
                        ⭐ {locale === 'vi' ? 'Tiêu chí đánh giá chuyên môn' : 'Technical Evaluation Criteria'}
                      </h5>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#ffb100' }}>
                        Avg: ★ {((algoScore + archScore + commScore) / 3).toFixed(1)} / 5.0
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
                      {/* Subscore 1: Coding & Algo */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12.5px' }}>{locale === 'vi' ? '1. Thuật toán & Tư duy Code:' : '1. Algorithm & Clean Code:'}</span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              style={{ cursor: 'pointer', color: star <= algoScore ? '#ffb100' : 'var(--border)' }}
                              fill={star <= algoScore ? '#ffb100' : 'none'}
                              onClick={() => setAlgoScore(star)}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Subscore 2: Architecture & Design */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12.5px' }}>{locale === 'vi' ? '2. Kiến trúc & Hệ thống:' : '2. Architecture & Systems:'}</span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              style={{ cursor: 'pointer', color: star <= archScore ? '#ffb100' : 'var(--border)' }}
                              fill={star <= archScore ? '#ffb100' : 'none'}
                              onClick={() => setArchScore(star)}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Subscore 3: Soft Skills & Teamwork */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12.5px' }}>{locale === 'vi' ? '3. Kỹ năng mềm & Giao tiếp:' : '3. Communication & Teamwork:'}</span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              style={{ cursor: 'pointer', color: star <= commScore ? '#ffb100' : 'var(--border)' }}
                              fill={star <= commScore ? '#ffb100' : 'none'}
                              onClick={() => setCommScore(star)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Availability and Expected Salary */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontWeight: 'bold', fontSize: '12.5px' }}>{locale === 'vi' ? 'Trạng thái hoạt động' : 'Availability Status'}</label>
                      <select
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--surface-hover)', border: '1px solid var(--border)', color: 'var(--text-main)', outline: 'none' }}
                        value={taStatus}
                        onChange={(e) => setTaStatus(e.target.value)}
                      >
                        <option value="AVAILABLE">{locale === 'vi' ? 'Trống dự án (AVAILABLE)' : 'Available'}</option>
                        <option value="VETTING">{locale === 'vi' ? 'Đang đánh giá (VETTING)' : 'Vetting'}</option>
                        <option value="PLACED">{locale === 'vi' ? 'Đã phái cử (PLACED)' : 'Placed'}</option>
                        <option value="ON_LEAVE">{locale === 'vi' ? 'Nghỉ phép (ON_LEAVE)' : 'On Leave'}</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontWeight: 'bold', fontSize: '12.5px' }}>{locale === 'vi' ? 'Mức lương kỳ vọng (Gross)' : 'Expected Salary (Gross)'}</label>
                      <input
                        type="text"
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--surface-hover)', border: '1px solid var(--border)', color: 'var(--text-main)', outline: 'none' }}
                        placeholder="e.g. 35,000,000"
                        value={taSalary}
                        onChange={(e) => setTaSalary(e.target.value)}
                      />
                      {/* Live format salary preview */}
                      {!isNaN(parseFloat(taSalary.replace(/[^0-9]/g, ''))) && (
                        <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 'bold', marginTop: '2px' }}>
                          💵 {formatCurrency(parseFloat(taSalary.replace(/[^0-9]/g, '')))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 4. English Level Presets */}
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontWeight: 'bold', fontSize: '12.5px' }}>{locale === 'vi' ? 'Trình độ tiếng Anh' : 'English Level'}</label>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                      {['A1 (Beginner)', 'A2 (Elementary)', 'B1 (Intermediate)', 'B2 (Upper-Intermediate)', 'C1 (Advanced)', 'C2 (Native)', 'IELTS 6.5', 'TOEIC 850'].map((preset) => (
                        <span
                          key={preset}
                          onClick={() => setTaEnglish(preset)}
                          style={{
                            fontSize: '11px',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            background: taEnglish === preset ? 'var(--primary-light)' : 'var(--background)',
                            color: taEnglish === preset ? 'var(--primary)' : 'var(--text-secondary)',
                            border: taEnglish === preset ? '1px solid var(--primary)' : '1px solid var(--border)',
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                        >
                          {preset}
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--surface-hover)', border: '1px solid var(--border)', color: 'var(--text-main)', outline: 'none' }}
                      placeholder="e.g. IELTS 6.5, Custom Level"
                      value={taEnglish}
                      onChange={(e) => setTaEnglish(e.target.value)}
                    />
                  </div>

                  {/* 5. Vetting & Interview notes */}
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontWeight: 'bold', fontSize: '12.5px' }}>{locale === 'vi' ? 'Ghi chú phỏng vấn & Nhận xét nội bộ' : 'Interview & Vetting Notes'}</label>
                    <textarea
                      rows={4}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--surface-hover)', border: '1px solid var(--border)', color: 'var(--text-main)', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                      placeholder={locale === 'vi' ? 'Nhập ghi chú chi tiết về ứng viên sau khi đánh giá...' : 'Enter candidate notes after assessment...'}
                      value={taNotesRaw}
                      onChange={(e) => setTaNotesRaw(e.target.value)}
                    />
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                    {/* Approve Shortcut */}
                    <button
                      type="button"
                      className="apply-btn"
                      style={{
                        flex: 1.2,
                        padding: '12px',
                        background: 'var(--success)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '13.5px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 0 10px rgba(16, 185, 129, 0.2)'
                      }}
                      onClick={async () => {
                        setChecklistCV(true);
                        setChecklistInterview(true);
                        setChecklistTech(true);
                        setChecklistCulture(true);
                        setTaStatus('AVAILABLE');
                        
                        setTimeout(async () => {
                          setIsSavingTAInfo(true);
                          const calculatedRating = Number(((algoScore + archScore + commScore) / 3).toFixed(1));
                          const formattedNotes = `VETTING CHECKLIST:
[✓] CV Screening
[✓] Initial Interview
[✓] Technical Assessment
[✓] Cultural Fit

TECHNICAL DETAILED RATINGS:
- Algorithm & Coding: ${algoScore} / 5
- Architecture & System Design: ${archScore} / 5
- Communication & Teamwork: ${commScore} / 5

ADDITIONAL NOTES:
${taNotesRaw || (locale === 'vi' ? 'Đã phỏng vấn đạt yêu cầu chuyên môn và tiếng Anh.' : 'Pass technical vetting and English requirements.')}`;

                          const result = await updateCandidateTAInfo({
                            id: viewingCandidateCV.id,
                            status: 'AVAILABLE',
                            rating: calculatedRating,
                            internalNotes: formattedNotes,
                            englishLevel: taEnglish,
                            salaryExpectation: taSalary
                          });
                          setIsSavingTAInfo(false);
                          if (result.success) {
                            alert(locale === 'vi' ? '✓ Đã duyệt ứng viên AVAILABLE thành công!' : '✓ Candidate approved & set to AVAILABLE!');
                            setViewingCandidateCV(null);
                            router.refresh();
                          } else {
                            alert(result.error || 'Error');
                          }
                        }, 100);
                      }}
                      disabled={isSavingTAInfo}
                    >
                      🚀 {locale === 'vi' ? 'Phê duyệt nhanh (AVAILABLE)' : 'Approve Candidate (AVAILABLE)'}
                    </button>

                    {/* Standard Save */}
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: 'transparent',
                        border: '1px solid var(--border)',
                        color: 'var(--text)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '13.5px'
                      }}
                      onClick={handleSaveTAInfo}
                      disabled={isSavingTAInfo}
                    >
                      {isSavingTAInfo ? '...' : (locale === 'vi' ? 'Lưu Đánh Giá' : 'Save Scorecard')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer" style={{ borderTop: '1px solid var(--border)', paddingTop: '14px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="nav-tab"
                style={{ border: '1px solid var(--border)', margin: 0, padding: '8px 18px' }}
                onClick={() => setViewingCandidateCV(null)}
              >
                {pt.modalBtnClose}
              </button>
            </div>
          </div>
        </div>
      )}

      {adjustingBillingApp && (
        <div className="modal-backdrop" onClick={() => setAdjustingBillingApp(null)}>
          <div className="modal-content" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="flex-center" style={{ gap: '8px' }}>
                <Settings size={18} style={{ color: 'var(--primary)' }} />
                {locale === 'vi' ? 'Điều chỉnh Biểu phí Placements' : 'Adjust Placement Rates'}
              </h3>
              <button type="button" className="close-btn" onClick={() => setAdjustingBillingApp(null)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px 0' }}>
              <div style={{ padding: '12px', background: 'var(--background)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{adjustingBillingApp.candidate.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{adjustingBillingApp.job.title} @ {adjustingBillingApp.job.company}</div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                  {locale === 'vi' ? 'Biểu phí khách hàng (VND/tháng)' : 'Client Billing Rate (VND/month)'}
                </label>
                <input
                  type="number"
                  className="search-input"
                  style={{ width: '100%' }}
                  value={inputBillingRate}
                  onChange={(e) => setInputBillingRate(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                  {locale === 'vi' ? 'Lương Developer (VND/tháng)' : 'Developer Salary (VND/month)'}
                </label>
                <input
                  type="number"
                  className="search-input"
                  style={{ width: '100%' }}
                  value={inputDeveloperSalary}
                  onChange={(e) => setInputDeveloperSalary(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-footer" style={{ borderTop: '1px solid var(--border)', paddingTop: '14px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="nav-tab"
                style={{ border: '1px solid var(--border)', margin: 0, padding: '8px 18px' }}
                onClick={() => setAdjustingBillingApp(null)}
              >
                {locale === 'vi' ? 'Hủy' : 'Cancel'}
              </button>
              <button
                type="button"
                className="btn-solid-orange"
                style={{ height: '38px', padding: '0 16px' }}
                onClick={async () => {
                  if (!inputBillingRate || !inputDeveloperSalary) {
                    alert(locale === 'vi' ? 'Vui lòng nhập đầy đủ biểu phí và lương!' : 'Please enter billing rate and developer salary!');
                    return;
                  }
                  setIsSavingBilling(true);
                  const result = await updateApplicationBilling({
                    id: adjustingBillingApp.id,
                    billingRate: parseFloat(inputBillingRate) || 0,
                    developerSalary: parseFloat(inputDeveloperSalary) || 0,
                  });
                  setIsSavingBilling(false);
                  if (result.success) {
                    alert(locale === 'vi' ? 'Cập nhật biểu phí thành công!' : 'Rates adjusted successfully!');
                    setAdjustingBillingApp(null);
                    router.refresh();
                  } else {
                    alert(result.error || 'Failed to update rates');
                  }
                }}
                disabled={isSavingBilling}
              >
                {isSavingBilling ? (locale === 'vi' ? 'Đang lưu...' : 'Saving...') : (locale === 'vi' ? 'Lưu thay đổi' : 'Save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
