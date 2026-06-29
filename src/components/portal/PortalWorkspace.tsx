'use client';

import React, { useState, useEffect } from 'react';
import { UserCheck, Users, Briefcase, Layers, Plus, Search, FileText, ChevronRight, Check, X, ShieldAlert, ArrowUpRight, CloudUpload, Play, Terminal, MessageSquare, Star, Settings, Award } from 'lucide-react';
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
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'talents' | 'add-talent' | 'requests' | 'partners' | 'chat' | 'pipeline' | 'accounts'>('overview');

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

  // CV Evaluation Tab states inside modal
  const [modalActiveTab, setModalActiveTab] = useState<'cv' | 'assessment'>('cv');
  const [taStatus, setTaStatus] = useState('AVAILABLE');
  const [taRating, setTaRating] = useState(5);
  const [taNotes, setTaNotes] = useState('');
  const [taEnglish, setTaEnglish] = useState('Intermediate');
  const [taSalary, setTaSalary] = useState('Negotiable');
  const [isSavingTAInfo, setIsSavingTAInfo] = useState(false);

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
    setTaRating(candidate.rating || 5);
    setTaNotes(candidate.internalNotes || '');
    setTaEnglish(candidate.englishLevel || 'Intermediate');
    setTaSalary(candidate.salaryExpectation || 'Negotiable');
  };

  // Determine tabs list dynamically based on role
  const sidebarTabs = isTA
    ? [
        { id: 'overview', label: pt.tabOverview, icon: <Layers size={16} /> },
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
    const result = await updateCandidateTAInfo({
      id: viewingCandidateCV.id,
      status: taStatus,
      rating: Number(taRating),
      internalNotes: taNotes,
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

  if (currentUser.role === 'ba') {
    return <BAPortalWorkspace locale={locale} currentUser={currentUser} />;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: 'calc(100vh - 180px)', gap: '24px' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-green {
          0% { transform: scale(0.95); opacity: 0.6; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          50% { transform: scale(1.15); opacity: 1; box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
          100% { transform: scale(0.95); opacity: 0.6; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        @keyframes pulse-amber {
          0% { transform: scale(0.95); opacity: 0.6; box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); }
          50% { transform: scale(1.15); opacity: 1; box-shadow: 0 0 0 8px rgba(245, 158, 11, 0); }
          100% { transform: scale(0.95); opacity: 0.6; box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
        }
        @keyframes pulse-blue {
          0% { transform: scale(0.95); opacity: 0.6; box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.4); }
          50% { transform: scale(1.15); opacity: 1; box-shadow: 0 0 0 8px rgba(14, 165, 233, 0); }
          100% { transform: scale(0.95); opacity: 0.6; box-shadow: 0 0 0 0 rgba(14, 165, 233, 0); }
        }
        @keyframes scanning {
          0% { top: 0%; opacity: 0.1; }
          50% { opacity: 0.7; }
          100% { top: 100%; opacity: 0.1; }
        }
        .bento-card {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          overflow: hidden;
          position: relative;
        }
        .bento-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md), var(--shadow-glow);
          border-color: var(--primary);
        }
        .bento-gradient-1 {
          background: linear-gradient(135deg, rgba(79, 70, 229, 0.04) 0%, rgba(14, 165, 233, 0.04) 100%);
        }
        .bento-gradient-2 {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.04) 0%, rgba(14, 165, 233, 0.04) 100%);
        }
        .bento-gradient-3 {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.04) 0%, rgba(239, 68, 68, 0.04) 100%);
        }
        .row-strip-hover {
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .row-strip-hover:hover {
          background-color: var(--surface-hover);
          transform: translateX(4px);
        }
        .tag-match {
          background: var(--success-bg);
          color: var(--success);
          border: 1px solid rgba(16, 185, 129, 0.15);
        }
        .tag-missing {
          background: rgba(239, 68, 68, 0.03);
          color: var(--danger);
          border: 1px solid rgba(239, 68, 68, 0.12);
        }
        .glass-column {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(8px);
          border: 1px solid var(--border);
        }
        [data-theme="dark"] .glass-column {
          background: rgba(16, 22, 38, 0.4);
        }
        .kanban-card {
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .kanban-card:hover {
          transform: translateY(-2px) scale(1.02);
          border-color: var(--primary) !important;
          box-shadow: var(--shadow-md);
        }
        .pulse-light-green {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--success);
          display: inline-block;
          animation: pulse-green 2s infinite;
        }
        .pulse-light-amber {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--warning);
          display: inline-block;
          animation: pulse-amber 2s infinite;
        }
        .pulse-light-blue {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--secondary);
          display: inline-block;
          animation: pulse-blue 2s infinite;
        }

        /* Portal custom sidebar nav tab styling (Aesthetic, no layout shifts) */
        .portal-nav-tab {
          width: 100% !important;
          justify-content: flex-start !important;
          margin: 0 !important;
          padding: 10px 14px !important;
          border-radius: 10px !important;
          font-size: 13.5px !important;
          font-weight: 600 !important;
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
          transition: all 0.2s ease !important;
          border: 1px solid transparent !important;
          background: transparent !important;
          color: var(--text-secondary) !important;
          cursor: pointer !important;
        }
        .portal-nav-tab:hover {
          background: var(--surface-hover) !important;
          color: var(--text-primary) !important;
          border-color: var(--border) !important;
        }
        .portal-nav-tab.active {
          background: rgba(99, 102, 241, 0.08) !important;
          color: var(--primary) !important;
          border-color: rgba(99, 102, 241, 0.2) !important;
          font-weight: 700 !important;
          box-shadow: 0 2px 4px rgba(99, 102, 241, 0.04) !important;
        }

        /* BA Portal theme overrides for Admin page */
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
      `}} />

      {/* Sidebar Navigation */}
      <aside className="card" style={{ 
        padding: '16px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '8px', 
        height: 'fit-content'
      }}>
        <h4 style={{ 
          fontSize: '12px', 
          color: 'var(--text-muted)', 
          textTransform: 'uppercase', 
          padding: '0 12px 8px 12px', 
          borderBottom: '1px solid var(--border)',
          fontWeight: 700,
          letterSpacing: '0.08em',
          marginBottom: '0px'
        }}>
          {currentUser.role === 'admin' ? (locale === 'vi' ? 'Hệ thống Admin Quản trị' : 'Admin System Manager') : isTA ? pt.sidebarHeaderTA : pt.sidebarHeaderBA}
        </h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {sidebarTabs.map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`portal-nav-tab ${isActive ? 'active' : ''}`}
                onClick={() => setActiveSubTab(tab.id as any)}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* User Profile Card in Sidebar */}
        <div style={{ 
          marginTop: '24px', 
          paddingTop: '16px', 
          borderTop: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser.name}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                {currentUser.role === 'admin' ? 'Administrator' : currentUser.role === 'ta' ? 'TA Staff' : 'BA Manager'}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--success)' }}>
            <span className="pulse-light-green"></span>
            <span>{locale === 'vi' ? 'Đã kết nối hệ thống' : 'Online'}</span>
          </div>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div className="tab-content" style={{ animation: 'fadeIn 0.25s ease' }}>
        
        {/* SUB-TAB 1: OVERVIEW */}
        {activeSubTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {isTA ? (
              /* TA Staff Overview - Premium Bento Grid */
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                
                {/* Card 1: Total Devs (Large Asymmetric Card) */}
                <div className="bento-card bento-gradient-1" style={{ gridColumn: 'span 2', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', justifySelf: 'stretch', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Users size={16} style={{ color: 'var(--primary)' }} />
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        {pt.statTotalDevs}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '4px' }}>
                      <span style={{ fontSize: '42px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                        {candidates.length + 15}
                      </span>
                      <span className="badge" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)', fontSize: '11.5px', padding: '4px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <ArrowUpRight size={12} />
                        {pt.statNewDevsMonth}
                      </span>
                    </div>
                    <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '300px' }}>
                      {locale === 'vi' ? 'Hệ thống vừa đồng bộ thêm hồ sơ ứng viên từ các kênh đối tác tuyển dụng liên kết.' : 'Synchronized new applicant CV profiles from partner agency networks.'}
                    </p>
                  </div>
                  
                  {/* Visual Growth Sparkline SVG */}
                  <div style={{ width: '140px', height: '80px', opacity: 0.85, marginRight: '10px' }}>
                    <svg viewBox="0 0 100 40" width="100%" height="100%">
                      <defs>
                        <linearGradient id="sparkline-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M 0 35 Q 20 20 40 30 T 80 10 T 100 5 L 100 40 L 0 40 Z" fill="url(#sparkline-grad)" />
                      <path d="M 0 35 Q 20 20 40 30 T 80 10 T 100 5" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx="100" cy="5" r="3.5" fill="var(--secondary)" />
                    </svg>
                  </div>
                </div>

                {/* Card 2: Available Engineers */}
                <div className="bento-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserCheck size={16} style={{ color: 'var(--success)' }} />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      {pt.statActiveVetted}
                    </span>
                  </div>
                  <div style={{ marginTop: '4px' }}>
                    <div style={{ fontSize: '42px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                      {candidates.filter(c => c.id % 2 === 0).length + 3}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)', marginTop: 'auto' }}>
                    <span className="pulse-light-green"></span>
                    <span>{pt.statReadyDevsSub}</span>
                  </div>
                </div>

                {/* Card 3: Placements (Engineers Hired) */}
                <div className="bento-card bento-gradient-2" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Briefcase size={16} style={{ color: 'var(--secondary)' }} />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      {pt.statActiveApps}
                    </span>
                  </div>
                  <div style={{ marginTop: '4px' }}>
                    <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {applications.length}
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 'auto' }}>
                    {applications.length} {pt.statActiveAppsSub}
                  </div>
                </div>

                {/* Card 4: Partner networks */}
                <div className="bento-card bento-gradient-3" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Layers size={16} style={{ color: 'var(--warning)' }} />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      {pt.statTotalPartners}
                    </span>
                  </div>
                  <div style={{ marginTop: '4px' }}>
                    <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)' }}>
                      4
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 'auto' }}>
                    {pt.statTotalPartnersSub}
                  </div>
                </div>

                {/* Card 5: Vetting Rate Progress */}
                <div className="bento-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Award size={16} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      {locale === 'vi' ? 'Tỉ Lệ Đạt Vetting' : 'Vetting Approval Rate'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                    <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)' }}>
                      76.8%
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ height: '6px', width: '100%', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '76.8%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: '3px' }}></div>
                    </div>
                    <span>{locale === 'vi' ? 'Chuẩn hóa chuyên môn hàng đầu' : 'Top specialized standards'}</span>
                  </div>
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
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginTop: '10px' }}>
              {/* Left Column: Recent Assignment Activity */}
              <div className="card" style={{ padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                  <Layers size={16} style={{ color: 'var(--primary)' }} />
                  {isTA ? pt.assignmentActivity : pt.recentRequestsActivity}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {applications.map((app) => {
                    const initials = app.candidate.name ? app.candidate.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'IT';
                    return (
                      <div key={app.id} className="row-strip-hover" style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '12px 16px', 
                        background: 'var(--surface-hover)', 
                        borderRadius: 'var(--radius-md)', 
                        border: '1px solid var(--border)',
                        transition: 'all var(--transition-fast)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'var(--primary-light)',
                            color: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '11px',
                            flexShrink: 0
                          }}>
                            {initials}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {app.candidate.name}
                            </div>
                            <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {locale === 'vi' ? 'Phái cử cho ' : 'Assigned to '} 
                              <strong style={{ color: 'var(--primary)' }}>{app.job.title}</strong> 
                              <span style={{ color: 'var(--text-muted)' }}> • {app.job.company}</span>
                            </div>
                          </div>
                        </div>
                        <span className="badge" style={{
                          backgroundColor: app.status === 'HIRED' ? 'var(--success-bg)' : 'var(--primary-light)',
                          color: app.status === 'HIRED' ? 'var(--success)' : 'var(--primary)',
                          borderRadius: '12px',
                          padding: '4px 10px',
                          fontSize: '11px',
                          fontWeight: 700
                        }}>
                          {app.status === 'HIRED' ? pt.hiredStatus : pt.appliedStatus}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Recruitment Funnel / Featured Talents */}
              <div className="card" style={{ padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                  <Award size={16} style={{ color: 'var(--warning)' }} />
                  {pt.featuredTalents}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  
                  {/* Item 1 */}
                  <div className="bento-card" style={{ 
                    padding: '14px 16px', 
                    background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.03) 0%, rgba(14, 165, 233, 0.03) 100%)', 
                    border: '1px solid var(--border)', 
                    borderRadius: 'var(--radius-md)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>Backend Spring Boot</div>
                      <span className="badge" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontSize: '10px', fontWeight: 700 }}>
                        Active
                      </span>
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span className="pulse-light-green"></span>
                      <span>3 {pt.featuredTalentsSub}</span>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="bento-card" style={{ 
                    padding: '14px 16px', 
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.03) 0%, rgba(14, 165, 233, 0.03) 100%)', 
                    border: '1px solid var(--border)', 
                    borderRadius: 'var(--radius-md)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>React/NextJS Frontend</div>
                      <span className="badge" style={{ backgroundColor: 'var(--secondary-light)', color: 'var(--secondary)', fontSize: '10px', fontWeight: 700 }}>
                        In Demand
                      </span>
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span className="pulse-light-blue"></span>
                      <span>5 {pt.featuredTalentsSub2}</span>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="bento-card" style={{ 
                    padding: '14px 16px', 
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.03) 0%, rgba(239, 68, 68, 0.03) 100%)', 
                    border: '1px solid var(--border)', 
                    borderRadius: 'var(--radius-md)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>DevOps Cloud AWS</div>
                      <span className="badge" style={{ backgroundColor: 'var(--warning-bg)', color: 'var(--warning)', fontSize: '10px', fontWeight: 700 }}>
                        Hot
                      </span>
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span className="pulse-light-amber"></span>
                      <span>2 {pt.featuredTalentsSub3}</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 2: TALENTS LIST */}
        {activeSubTab === 'talents' && (
          <div className="ba-tab-view ba-animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="ba-header-section">
              <div>
                <h1 className="ba-title">{locale === 'vi' ? 'Kho Hồ sơ Lập trình viên' : 'Developer Talent Repository'}</h1>
                <p className="ba-subtitle">{locale === 'vi' ? 'Quản lý thông tin kỹ năng, trình độ và theo dõi trạng thái dự án của các kỹ sư.' : 'Manage capabilities, English levels, and deployment status of engineers.'}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={16} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="ba-input"
                  style={{ paddingLeft: '38px', fontSize: '13.5px', height: '42px' }}
                  placeholder={pt.searchPlh}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Talents Card Table Grid */}
            <div className="ba-table-container">
              <div className="ba-table-header">
                <h3 className="ba-table-header-title">{locale === 'vi' ? 'Danh sách kỹ sư' : 'Engineers Directory'}</h3>
              </div>
              <table className="ba-table">
                <thead>
                  <tr>
                    <th>{pt.colName}</th>
                    <th>{pt.colRole}</th>
                    <th>{pt.colSkills}</th>
                    <th>{locale === 'vi' ? 'Đánh giá / TA' : 'Rating / English'}</th>
                    <th>{locale === 'vi' ? 'Trạng thái' : 'Status'}</th>
                    <th style={{ textAlign: 'right' }}>{pt.colActions}</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates
                    .filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.skills.join(',').toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((c) => (
                      <tr key={c.id}>
                        <td style={{ fontWeight: 'bold' }}>{c.name}</td>
                        <td style={{ color: 'var(--primary)', fontWeight: 600 }}>{c.title}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {c.skills.slice(0, 3).map((s, idx) => (
                              <span key={idx} className="ba-badge ba-badge-info" style={{ fontSize: '10px', textTransform: 'none', letterSpacing: 'normal' }}>
                                {s}
                              </span>
                            ))}
                            {c.skills.length > 3 && <span style={{ fontSize: '10px', color: 'var(--text-muted)', alignSelf: 'center', marginLeft: '2px' }}>+{c.skills.length - 3}</span>}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ffb100', fontWeight: 'bold' }}>
                              <Star size={12} fill="#ffb100" style={{ color: '#ffb100' }} />
                              <span>{c.rating !== undefined ? Number(c.rating).toFixed(1) : '5.0'}</span>
                            </div>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{c.englishLevel || 'Intermediate'}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`ba-badge ${
                            c.status === 'AVAILABLE' 
                              ? 'ba-badge-success' 
                              : c.status === 'PLACED' 
                              ? 'ba-badge-info' 
                              : 'ba-badge-warning'
                          }`}>
                            {c.status === 'AVAILABLE' ? (locale === 'vi' ? 'Trống dự án' : 'Available') : c.status === 'PLACED' ? (locale === 'vi' ? 'Đã phái cử' : 'Placed') : (locale === 'vi' ? 'Đang thẩm định' : 'Vetting')}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              className="ba-btn-secondary"
                              style={{ height: '32px', padding: '0 12px', fontSize: '12px' }}
                              onClick={() => handleOpenCVModal(c)}
                            >
                              {pt.btnViewCV}
                            </button>
                            <button
                              type="button"
                              className="ba-btn-primary"
                              style={{ height: '32px', padding: '0 12px', fontSize: '12px' }}
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
          </div>
        )}

        {/* SUB-TAB 3: ADD TALENT & AI CV PARSER */}
        {activeSubTab === 'add-talent' && (
          <div className="ba-tab-view ba-animate-fade-in" style={{ display: 'grid', gridTemplateColumns: parsedData ? '1.1fr 1.2fr' : '1fr', gap: '24px' }}>
            
            {/* Left box: Upload CV file */}
            <div className="ba-table-container" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifySelf: 'stretch', gap: '20px' }}>
              <div className="ba-table-header" style={{ margin: '-24px -24px 0 -24px', padding: '16px 20px' }}>
                <h3 className="ba-table-header-title">📤 {locale === 'vi' ? 'Tải CV lên hệ thống' : 'Upload CV Document'}</h3>
              </div>
              
              <div style={{ 
                border: '2px dashed var(--border)', 
                padding: '44px 20px', 
                borderRadius: 'var(--radius-md)', 
                background: 'rgba(79, 70, 229, 0.01)',
                textAlign: 'center',
                transition: 'all var(--transition-normal)'
              }}>
                <CloudUpload size={44} style={{ color: 'var(--primary)', marginBottom: '14px' }} />
                <h4 style={{ fontSize: '15px', fontWeight: 800 }}>{pt.uploadTitle}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px', marginBottom: '24px', lineHeight: 1.4, maxWidth: '340px', marginLeft: 'auto', marginRight: 'auto' }}>
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
                    className="ba-btn-primary"
                    style={{ 
                      padding: '10px 22px', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      fontWeight: 700
                    }}
                  >
                    {pt.btnUpload}
                  </label>

                  {isFileUploaded && (
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                      <span className="pulse-light-green"></span>
                      {pt.fileReceived} {fileName}
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  type="button"
                  className="ba-btn-primary"
                  style={{ background: 'var(--success)', borderColor: 'var(--success)' }}
                  onClick={triggerParsingSequence}
                  disabled={!isFileUploaded || isParsing}
                >
                  <Play size={15} />
                  {isParsing ? pt.btnExtracting : pt.btnExtract}
                </button>
                
                <button
                  type="button"
                  className="ba-btn-secondary"
                  onClick={runDemoParser}
                  disabled={isParsing}
                >
                  {pt.btnDemo}
                </button>
              </div>

              {/* Parser Output Logs (Holographic AI terminal) */}
              {(isParsing || parseSteps.length > 0) && (
                <div style={{
                  background: '#070a13',
                  color: '#38bdf8',
                  fontFamily: 'monospace',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'left',
                  fontSize: '12px',
                  lineHeight: '1.6',
                  maxHeight: '260px',
                  overflowY: 'auto',
                  border: '1px solid #1e293b',
                  boxShadow: 'inset 0 0 12px rgba(56, 189, 248, 0.08)',
                  position: 'relative'
                }}>
                  {/* Flashing scanner line overlay */}
                  {isParsing && (
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      width: '100%',
                      height: '2px',
                      background: 'rgba(56, 189, 248, 0.4)',
                      boxShadow: '0 0 10px rgba(56, 189, 248, 0.8)',
                      animation: 'scanning 2s infinite linear'
                    }} />
                  )}
                  
                  {/* Terminal Header dots */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '8px', marginBottom: '12px', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56', display: 'inline-block' }}></span>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }}></span>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f', display: 'inline-block' }}></span>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em' }}>{pt.terminalTitle}</span>
                  </div>
                  
                  {parseSteps.map((step, idx) => (
                    <div key={idx} style={{ marginBottom: '4px', display: 'flex', gap: '8px' }}>
                      <span style={{ color: '#64748b' }}>&gt;</span>
                      <span style={{ color: step.includes('✓') || step.includes('✨') ? 'var(--success)' : '#e2e8f0' }}>{step}</span>
                    </div>
                  ))}
                  {isParsing && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary)' }}>
                      <span>&gt;</span>
                      <span className="animate-pulse" style={{ animation: 'pulse 1s infinite' }}>{pt.terminalRunning}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right box: Extracted Fields (Forms) */}
            {parsedData && (
              <div className="ba-table-container" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.25s ease' }}>
                <div className="ba-table-header" style={{ margin: '-24px -24px 0 -24px', padding: '16px 20px' }}>
                  <h3 className="ba-table-header-title">✓ {pt.extractedTitle}</h3>
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  {pt.extractedSub}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '55vh', overflowY: 'auto', paddingRight: '4px' }}>
                  <div className="ba-form-group">
                    <label className="ba-form-label">{pt.fieldFullName}</label>
                    <input type="text" className="ba-input" value={newName} onChange={(e) => setNewName(e.target.value)} />
                  </div>

                  <div className="ba-form-group">
                    <label className="ba-form-label">{pt.fieldDesiredRole}</label>
                    <input type="text" className="ba-input" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="ba-form-group">
                      <label className="ba-form-label">{pt.fieldEmail}</label>
                      <input type="email" className="ba-input" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                    </div>
                    <div className="ba-form-group">
                      <label className="ba-form-label">{pt.fieldPhone}</label>
                      <input type="text" className="ba-input" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
                    </div>
                  </div>

                  <div className="ba-form-group">
                    <label className="ba-form-label">{pt.fieldLocation}</label>
                    <input type="text" className="ba-input" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} />
                  </div>

                  <div className="ba-form-group">
                    <label className="ba-form-label">{pt.fieldSkills}</label>
                    <input type="text" className="ba-input" value={newSkills} onChange={(e) => setNewSkills(e.target.value)} />
                  </div>

                  <div className="ba-form-group">
                    <label className="ba-form-label">{pt.fieldSummary}</label>
                    <textarea rows={3} className="ba-input" style={{ resize: 'vertical' }} value={newSummary} onChange={(e) => setNewSummary(e.target.value)} />
                  </div>
                </div>

                <button
                  type="button"
                  className="ba-btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
                  onClick={handleSaveParsedCandidate}
                >
                  {pt.btnSaveCandidate}
                </button>
              </div>
            )}
          </div>
        )}

        {/* SUB-TAB: PIPELINE & AI MATCHING */}
        {activeSubTab === 'pipeline' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header Switcher */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass-bg)', backdropFilter: 'blur(var(--glass-blur))', border: '1px solid var(--glass-border)', padding: '20px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {pipelineMode === 'kanban' ? '📊' : '⚡'}
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

              <div style={{ display: 'flex', gap: '4px', background: 'var(--background)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <button
                  type="button"
                  style={{
                    padding: '8px 16px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    background: pipelineMode === 'kanban' ? 'var(--primary)' : 'transparent',
                    color: pipelineMode === 'kanban' ? '#fff' : 'var(--text-secondary)',
                    transition: 'all var(--transition-fast)',
                    boxShadow: pipelineMode === 'kanban' ? 'var(--shadow-sm)' : 'none'
                  }}
                  onClick={() => setPipelineMode('kanban')}
                >
                  Kanban Board
                </button>
                <button
                  type="button"
                  style={{
                    padding: '8px 16px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    background: pipelineMode === 'matcher' ? 'var(--primary)' : 'transparent',
                    color: pipelineMode === 'matcher' ? '#fff' : 'var(--text-secondary)',
                    transition: 'all var(--transition-fast)',
                    boxShadow: pipelineMode === 'matcher' ? 'var(--shadow-sm)' : 'none'
                  }}
                  onClick={() => setPipelineMode('matcher')}
                >
                  AI Matcher
                </button>
              </div>
            </div>

            {/* Mode 1: KANBAN BOARD */}
            {pipelineMode === 'kanban' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '14px', overflowX: 'auto', paddingBottom: '16px', marginTop: '4px' }}>
                {(['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFERED', 'HIRED', 'REJECTED'] as const).map((stage) => {
                  const stageApps = applications.filter((app) => app.status === stage);
                  
                  const getStageTitle = (st: string) => {
                    switch (st) {
                      case 'APPLIED': return locale === 'vi' ? 'Nộp hồ sơ' : 'Applied';
                      case 'SCREENING': return locale === 'vi' ? 'Lọc hồ sơ' : 'Screening';
                      case 'INTERVIEW': return locale === 'vi' ? 'Phỏng vấn' : 'Interview';
                      case 'OFFERED': return locale === 'vi' ? 'Đề nghị' : 'Offered';
                      case 'HIRED': return locale === 'vi' ? 'Đã nhận' : 'Hired';
                      case 'REJECTED': return locale === 'vi' ? 'Từ chối' : 'Rejected';
                      default: return st;
                    }
                  };

                  const getStageColor = (st: string) => {
                    switch (st) {
                      case 'APPLIED': return 'var(--text-muted)';
                      case 'SCREENING': return 'var(--secondary)';
                      case 'INTERVIEW': return 'var(--primary)';
                      case 'OFFERED': return 'var(--warning)';
                      case 'HIRED': return 'var(--success)';
                      case 'REJECTED': return 'var(--danger)';
                      default: return 'gray';
                    }
                  };

                  return (
                    <div
                      key={stage}
                      className="glass-column"
                      style={{
                        borderRadius: 'var(--radius-lg)',
                        padding: '14px',
                        minHeight: '520px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        minWidth: '180px',
                        boxShadow: 'var(--shadow-sm)',
                        borderTop: `4px solid ${getStageColor(stage)}`
                      }}
                    >
                      {/* Column Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ fontWeight: 800, fontSize: '13px', color: getStageColor(stage), letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                          {getStageTitle(stage)}
                        </span>
                        <span style={{ fontSize: '11px', background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>
                          {stageApps.length}
                        </span>
                      </div>

                      {/* App cards list */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', flex: 1, paddingRight: '2px' }}>
                        {stageApps.map((app) => (
                          <div
                            key={app.id}
                            style={{
                              background: 'var(--surface)',
                              border: '1px solid var(--border)',
                              borderRadius: 'var(--radius-md)',
                              padding: '12px',
                              cursor: 'pointer',
                              position: 'relative',
                              boxShadow: 'var(--shadow-sm)'
                            }}
                            className="kanban-card"
                            onClick={() => handleOpenCVModal(app.candidate as any)}
                          >
                            <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                              {app.candidate.name}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--primary)', marginTop: '4px', fontWeight: 700 }}>
                              {app.candidate.title}
                            </div>
                            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '8px', borderTop: '1px solid var(--border)', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <span>🏢 {app.job.company}</span>
                              <span style={{ fontWeight: 600 }}>💼 {app.job.title}</span>
                            </div>

                            {/* Quick Transitions */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', marginTop: '12px' }} onClick={(e) => e.stopPropagation()}>
                              {stage !== 'APPLIED' && (
                                <button
                                  type="button"
                                  title="Move left"
                                  style={{ background: 'var(--surface-hover)', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '9px', fontWeight: 'bold' }}
                                  onClick={async () => {
                                    const stages = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFERED', 'HIRED', 'REJECTED'];
                                    const prevStage = stages[stages.indexOf(stage) - 1];
                                    await updateApplicationStatus(app.id, prevStage);
                                    router.refresh();
                                  }}
                                >
                                  ◀
                                </button>
                              )}
                              {stage !== 'REJECTED' && stage !== 'HIRED' && (
                                <button
                                  type="button"
                                  title="Move right"
                                  style={{ background: 'var(--surface-hover)', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '9px', fontWeight: 'bold' }}
                                  onClick={async () => {
                                    const stages = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFERED', 'HIRED', 'REJECTED'];
                                    const nextStage = stages[stages.indexOf(stage) + 1];
                                    await updateApplicationStatus(app.id, nextStage);
                                    router.refresh();
                                  }}
                                >
                                  ▶
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                        {stageApps.length === 0 && (
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', padding: '32px 0', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)', background: 'rgba(0,0,0,0.01)' }}>
                            {locale === 'vi' ? 'Trống' : 'Empty Column'}
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
                <div className="card" style={{ padding: '24px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(var(--glass-blur))', borderRadius: 'var(--radius-lg)' }}>
                  <label style={{ fontWeight: 800, fontSize: '13px', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)' }}>
                    {locale === 'vi' ? '1. Chọn Yêu cầu tuyển dụng để khớp nối:' : '1. Select Job Request to Match:'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', appearance: 'none', cursor: 'pointer', fontWeight: 600 }}
                      value={selectedJobId || ''}
                      onChange={(e) => setSelectedJobId(Number(e.target.value) || null)}
                    >
                      <option value="">-- {locale === 'vi' ? 'Chọn vị trí trống' : 'Select an open role'} --</option>
                      {jobs.map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.title} ({j.company}) - Tags: [{j.tags.join(', ')}]
                        </option>
                      ))}
                    </select>
                    <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}>
                      ▼
                    </div>
                  </div>
                </div>

                {selectedJobId && (() => {
                  const selectedJob = jobs.find((j) => j.id === selectedJobId);
                  if (!selectedJob) return null;

                  // Rank candidates based on skill match
                  const matchedCandidates = candidates.map((candidate) => {
                    const jobTagsLower = selectedJob.tags.map((t) => t.toLowerCase());
                    const matchedSkills = candidate.skills.filter((s) => jobTagsLower.includes(s.toLowerCase()));
                    const missingSkills = selectedJob.tags.filter((t) => !candidate.skills.some((s) => s.toLowerCase() === t.toLowerCase()));
                    
                    // Match score
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.25s ease' }}>
                      <div className="card bento-gradient-1" style={{ padding: '24px', borderLeft: '4px solid var(--primary)', borderRadius: 'var(--radius-lg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h4 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)' }}>🎯 {selectedJob.title}</h4>
                            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px', fontWeight: 600 }}>
                              🏢 {selectedJob.company} | 📍 {selectedJob.location} | 💰 {selectedJob.salary}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '14px' }}>
                          {selectedJob.tags.map((tag, idx) => (
                            <span key={idx} className="job-tag" style={{ fontSize: '11px', background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid rgba(79, 70, 229, 0.12)', padding: '4px 10px', borderRadius: '4px', fontWeight: 700 }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.02em', textTransform: 'uppercase', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                        {locale === 'vi' ? 'Kết quả khớp nối ứng viên:' : 'Candidate Match Results:'}
                      </h3>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {matchedCandidates.map(({ candidate, score, matchedSkills, missingSkills }) => {
                          const hasApplied = applications.some((app) => app.jobId === selectedJob.id && app.candidateId === candidate.id);
                          
                          // Score colors based on percentage
                          const scoreColor = score >= 75 ? 'var(--success)' : score >= 40 ? 'var(--warning)' : 'var(--danger)';
                          const scoreBg = score >= 75 ? 'var(--success-bg)' : score >= 40 ? 'var(--warning-bg)' : 'var(--danger-bg)';
                          
                          return (
                            <div
                              key={candidate.id}
                              className="bento-card"
                              style={{
                                padding: '24px',
                                display: 'grid',
                                gridTemplateColumns: '1fr auto',
                                gap: '24px',
                                alignItems: 'center',
                                border: '1px solid var(--border)',
                                background: 'var(--surface)'
                              }}
                            >
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <h4 style={{ fontWeight: 800, fontSize: '15px', color: 'var(--text-primary)', cursor: 'pointer' }} onClick={() => handleOpenCVModal(candidate)}>
                                    {candidate.name}
                                  </h4>
                                  <span className="badge" style={{
                                    backgroundColor: scoreBg,
                                    color: scoreColor,
                                    fontWeight: 800,
                                    fontSize: '11px',
                                    borderRadius: '12px',
                                    padding: '4px 10px',
                                    border: `1px solid ${scoreColor}20`
                                  }}>
                                    {score}% Match
                                  </span>
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700 }}>
                                  {candidate.title} (Rating: ★ {candidate.rating !== undefined ? Number(candidate.rating).toFixed(1) : '5.0'})
                                </div>

                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5, maxWidth: '600px' }}>
                                  {candidate.summary}
                                </p>

                                {/* Skill overlap report */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px', background: 'var(--background)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', fontSize: '11.5px' }}>
                                    <span style={{ color: 'var(--success)', fontWeight: 800, width: '90px', display: 'inline-block' }}>✓ {locale === 'vi' ? 'Trùng khớp:' : 'Matches:'}</span>
                                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                      {matchedSkills.length > 0 ? matchedSkills.map((s, idx) => (
                                        <span key={idx} className="tag-match" style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 600 }}>{s}</span>
                                      )) : <span style={{ color: 'var(--text-muted)' }}>None</span>}
                                    </div>
                                  </div>

                                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', fontSize: '11.5px', borderTop: '1px dashed var(--border)', paddingTop: '8px', marginTop: '4px' }}>
                                    <span style={{ color: 'var(--danger)', fontWeight: 800, width: '90px', display: 'inline-block' }}>✗ {locale === 'vi' ? 'Còn thiếu:' : 'Missing:'}</span>
                                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                      {missingSkills.length > 0 ? missingSkills.map((s, idx) => (
                                        <span key={idx} className="tag-missing" style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 600 }}>{s}</span>
                                      )) : <span style={{ color: 'var(--text-muted)' }}>None</span>}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'stretch', minWidth: '130px' }}>
                                {hasApplied ? (
                                  <button
                                    type="button"
                                    disabled
                                    style={{
                                      padding: '10px 14px',
                                      fontSize: '12.5px',
                                      fontWeight: 800,
                                      background: 'var(--background)',
                                      color: 'var(--text-muted)',
                                      border: '1px solid var(--border)',
                                      borderRadius: 'var(--radius-md)',
                                      textAlign: 'center'
                                    }}
                                  >
                                    ✓ {locale === 'vi' ? 'Đã phái cử' : 'Already Assigned'}
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    className="apply-btn"
                                    style={{ padding: '10px 14px', fontSize: '12.5px', fontWeight: 800, borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}
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
                                  style={{ margin: 0, padding: '10px 14px', fontSize: '12.5px', border: '1px solid var(--border)', background: 'var(--surface)', textAlign: 'center', borderRadius: 'var(--radius-md)', fontWeight: 700 }}
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

            {/* Custom styles override */}
            <style dangerouslySetInnerHTML={{__html: `
              .kanban-card:hover {
                transform: translateY(-2px);
                border-color: var(--primary) !important;
                box-shadow: var(--shadow-md);
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
          <div className="ba-tab-view ba-animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="ba-header-section">
              <div>
                <h1 className="ba-title">{locale === 'vi' ? 'Hệ thống Quản lý Tài khoản' : 'Account Management System'}</h1>
                <p className="ba-subtitle">{locale === 'vi' ? 'Admin cấp tài khoản truy cập hệ thống cho TA Staff và BA Manager.' : 'Admin provisions access accounts for TA Staff and BA Manager.'}</p>
              </div>
            </div>

            {/* Create Account Form */}
            <div className="ba-table-container" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="ba-table-header" style={{ margin: '-24px -24px 8px -24px', padding: '16px 20px' }}>
                <h3 className="ba-table-header-title">🔑 {locale === 'vi' ? 'Cấp tài khoản mới' : 'Provision New Account'}</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="ba-form-group">
                  <label className="ba-form-label">{locale === 'vi' ? 'Họ và tên *' : 'Full Name *'}</label>
                  <input
                    type="text"
                    className="ba-input"
                    placeholder="e.g. Nguyễn Văn A"
                    value={newAccName}
                    onChange={(e) => setNewAccName(e.target.value)}
                  />
                </div>
                <div className="ba-form-group">
                  <label className="ba-form-label">{locale === 'vi' ? 'Email đăng nhập *' : 'Login Email *'}</label>
                  <input
                    type="email"
                    className="ba-input"
                    placeholder="e.g. name@vertex.vn"
                    value={newAccEmail}
                    onChange={(e) => setNewAccEmail(e.target.value)}
                  />
                </div>
                <div className="ba-form-group">
                  <label className="ba-form-label">{locale === 'vi' ? 'Mật khẩu khởi tạo *' : 'Initial Password *'}</label>
                  <input
                    type="password"
                    className="ba-input"
                    placeholder="e.g. password"
                    value={newAccPassword}
                    onChange={(e) => setNewAccPassword(e.target.value)}
                  />
                </div>
                <div className="ba-form-group">
                  <label className="ba-form-label">{locale === 'vi' ? 'Vai trò truy cập *' : 'System Role *'}</label>
                  <select
                    className="ba-input"
                    value={newAccRole}
                    onChange={(e) => setNewAccRole(e.target.value)}
                  >
                    <option value="ta">{locale === 'vi' ? 'TA Staff (Tuyển dụng)' : 'TA Staff (Talent Acquisition)'}</option>
                    <option value="ba">{locale === 'vi' ? 'BA Manager (Kinh doanh / Margin)' : 'BA Manager (Business Analyst)'}</option>
                    <option value="admin">{locale === 'vi' ? 'Admin Quản trị' : 'Admin System Manager'}</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button
                  type="button"
                  className="ba-btn-primary"
                  onClick={handleCreateAccount}
                  disabled={isSavingAccount}
                >
                  {isSavingAccount ? (locale === 'vi' ? 'Đang cấp...' : 'Provisioning...') : (locale === 'vi' ? 'Cấp tài khoản' : 'Provision Account')}
                </button>
              </div>
            </div>

            {/* Accounts List Table */}
            <div className="ba-table-container">
              <div className="ba-table-header">
                <h3 className="ba-table-header-title">{locale === 'vi' ? 'Danh sách tài khoản hệ thống' : 'System Accounts Directory'}</h3>
              </div>
              <table className="ba-table">
                <thead>
                  <tr>
                    <th>{locale === 'vi' ? 'Họ và tên' : 'Full Name'}</th>
                    <th>{locale === 'vi' ? 'Email đăng nhập' : 'Login Email'}</th>
                    <th>{locale === 'vi' ? 'Vai trò' : 'System Role'}</th>
                    <th>{locale === 'vi' ? 'Ngày tạo' : 'Date Created'}</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((acc) => (
                    <tr key={acc.id}>
                      <td style={{ fontWeight: 'bold' }}>{acc.name}</td>
                      <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{acc.email}</td>
                      <td>
                        <span className={`ba-badge ${
                          acc.role === 'admin' 
                            ? 'ba-badge-danger' 
                            : acc.role === 'ta' 
                            ? 'ba-badge-info' 
                            : 'ba-badge-warning'
                        }`}>
                          {acc.role === 'admin' ? 'Admin' : acc.role === 'ta' ? 'TA Staff' : 'BA Manager'}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>
                        {new Date(acc.createdAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US')}
                      </td>
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
                <div style={{ display: 'flex', gap: '6px', background: 'var(--background)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginTop: '4px' }}>
                  <button
                    type="button"
                    style={{
                      padding: '8px 16px',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      background: modalActiveTab === 'cv' ? 'var(--primary)' : 'transparent',
                      color: modalActiveTab === 'cv' ? '#fff' : 'var(--text-secondary)',
                      transition: 'all var(--transition-fast)'
                    }}
                    onClick={() => setModalActiveTab('cv')}
                  >
                    📄 {locale === 'vi' ? 'Thông tin CV' : 'CV Profile'}
                  </button>
                  <button
                    type="button"
                    style={{
                      padding: '8px 16px',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      background: modalActiveTab === 'assessment' ? 'var(--primary)' : 'transparent',
                      color: modalActiveTab === 'assessment' ? '#fff' : 'var(--text-secondary)',
                      transition: 'all var(--transition-fast)'
                    }}
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.2s ease' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)' }}>{locale === 'vi' ? 'Trạng thái hoạt động' : 'Availability Status'}</label>
                      <div style={{ position: 'relative' }}>
                        <select
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none', appearance: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
                          value={taStatus}
                          onChange={(e) => setTaStatus(e.target.value)}
                        >
                          <option value="AVAILABLE">{locale === 'vi' ? 'Trống dự án (Available)' : 'Available'}</option>
                          <option value="VETTING">{locale === 'vi' ? 'Đang đánh giá (Vetting)' : 'Vetting'}</option>
                          <option value="PLACED">{locale === 'vi' ? 'Đã phái cử (Placed)' : 'Placed'}</option>
                          <option value="ON_LEAVE">{locale === 'vi' ? 'Nghỉ phép (On Leave)' : 'On Leave'}</option>
                        </select>
                        <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)', fontSize: '10px' }}>
                          ▼
                        </div>
                      </div>
                    </div>

                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)' }}>{locale === 'vi' ? 'Điểm đánh giá kỹ thuật' : 'Technical Rating (1-5)'}</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={22}
                            style={{ cursor: 'pointer', color: star <= taRating ? '#ffb100' : 'var(--border)' }}
                            fill={star <= taRating ? '#ffb100' : 'none'}
                            onClick={() => setTaRating(star)}
                          />
                        ))}
                        <span style={{ fontWeight: 'bold', fontSize: '14px', marginLeft: '6px' }}>{taRating.toFixed(1)} / 5.0</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)' }}>{locale === 'vi' ? 'Trình độ tiếng Anh' : 'English Level'}</label>
                      <input
                        type="text"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px' }}
                        placeholder="e.g. IELTS 6.5, TOEIC 850, B2"
                        value={taEnglish}
                        onChange={(e) => setTaEnglish(e.target.value)}
                      />
                    </div>

                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)' }}>{locale === 'vi' ? 'Mức lương kỳ vọng (Gross)' : 'Expected Salary (Gross)'}</label>
                      <input
                        type="text"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px' }}
                        placeholder="e.g. 35,000,000 VND / tháng"
                        value={taSalary}
                        onChange={(e) => setTaSalary(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)' }}>{locale === 'vi' ? 'Ghi chú phỏng vấn & Nhận xét nội bộ' : 'Interview & Vetting Notes'}</label>
                    <textarea
                      rows={5}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none', resize: 'vertical', fontFamily: 'inherit', fontSize: '13px' }}
                      placeholder={locale === 'vi' ? 'Nhập ghi chú chi tiết về ứng viên sau khi đánh giá...' : 'Enter candidate notes after assessment...'}
                      value={taNotes}
                      onChange={(e) => setTaNotes(e.target.value)}
                    />
                  </div>

                  <button
                    type="button"
                    className="apply-btn"
                    style={{ width: '100%', padding: '12px', background: 'var(--success)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 800, fontSize: '13.5px', marginTop: '8px', boxShadow: 'var(--shadow-sm)' }}
                    onClick={handleSaveTAInfo}
                    disabled={isSavingTAInfo}
                  >
                    {isSavingTAInfo ? (locale === 'vi' ? 'Đang lưu...' : 'Saving...') : (locale === 'vi' ? 'Lưu Đánh Giá Nhân Sự' : 'Save Internal Assessment')}
                  </button>
                </div>
              )}
            </div>

            <div className="modal-footer" style={{ borderTop: '1px solid var(--border)', paddingTop: '14px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ border: '1px solid var(--border)', margin: 0, padding: '8px 20px', borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '12.5px', background: 'var(--surface)' }}
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
