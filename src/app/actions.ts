'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// --- IN-MEMORY FALLBACK STORE FOR OFFLINE / PROTOTYPE DEMO ---
const fallbackStore = {
  jobs: [] as any[],
  candidates: [] as any[],
  applications: [] as any[],
  partners: [] as any[],
  posts: [] as any[],
  comments: [] as any[],
  chatMessages: [] as any[],
  accounts: [] as any[],
  initialized: false
};

function initializeFallbackStore() {
  if (fallbackStore.initialized) return;

  // 1. Candidates
  fallbackStore.candidates = [
    {
      id: 1,
      name: 'Trần Minh Hoàng',
      title: 'Senior Backend Developer (Java/Spring Boot)',
      email: 'hoang.tm@scaleedge.asia',
      phone: '0912345678',
      location: 'Hà Nội',
      summary: 'Kỹ sư Backend với 6 năm kinh nghiệm lập trình Java, thiết kế hệ thống microservices chịu tải cao, thành thạo Spring Boot, Hibernate, Kafka và Redis.',
      skills: ['Java', 'Spring Boot', 'Microservices', 'PostgreSQL', 'Kafka', 'Redis', 'Docker'],
      status: 'PLACED',
      rating: 4.8,
      internalNotes: 'Chuyên môn Java cực tốt, giao tiếp lưu loát, đã phỏng vấn vòng 2 và đạt điểm cao.',
      englishLevel: 'IELTS 6.5',
      salaryExpectation: '40,000,000 VND / tháng',
      experience: [
        {
          company: 'VNG Corporation',
          role: 'Backend Technical Lead',
          duration: '2022 - Present',
          description: 'Kiến trúc lại luồng xử lý giao dịch giúp tăng tốc độ phản hồi API 25%. Quản lý đội ngũ phát triển 6 thành viên.'
        },
        {
          company: 'CMC Global',
          role: 'Senior Java Developer',
          duration: '2019 - 2022',
          description: 'Phát triển lõi ngân hàng số cho đối tác Singapore. Thiết kế cơ sở dữ liệu và tối ưu hóa truy vấn.'
        }
      ],
      education: [
        {
          school: 'Đại học Bách Khoa Hà Nội',
          degree: 'Kỹ sư Khoa học Máy tính',
          duration: '2014 - 2019'
        }
      ]
    },
    {
      id: 2,
      name: 'Lê Thị Thu Hương',
      title: 'Senior Frontend Developer (React/NextJS)',
      email: 'huong.ltt@scaleedge.asia',
      phone: '0987654321',
      location: 'TP. Hồ Chí Minh',
      summary: 'Lập trình viên Frontend đam mê tạo dựng trải nghiệm người dùng mượt mà, tối ưu hóa SEO và hiệu năng web ứng dụng React/Next.js sử dụng CSS linh hoạt và glassmorphism.',
      skills: ['React', 'Next.js', 'TypeScript', 'CSS/SCSS', 'Webpack', 'Tailwind', 'RESTful API'],
      status: 'AVAILABLE',
      rating: 4.9,
      internalNotes: 'Ứng viên xuất sắc về React/NextJS. Khả năng thiết kế UX rất tinh tế. Tiếng Anh tốt.',
      englishLevel: 'TOEIC 850',
      salaryExpectation: '35,000,000 VND / tháng',
      experience: [
        {
          company: 'FPT Software (Đối tác)',
          role: 'Frontend Architect',
          duration: '2023 - Present',
          description: 'Phát triển hệ thống Dashboard quản trị nội bộ cho tập đoàn tài chính. Tích hợp các biểu đồ phức tạp và luồng phê duyệt đa cấp.'
        },
        {
          company: 'Tiki Vietnam',
          role: 'Mid Frontend Developer',
          duration: '2021 - 2023',
          description: 'Phát triển các trang khuyến mãi cho chiến dịch lớn, đảm bảo độ chịu tải hàng triệu CCU.'
        }
      ],
      education: [
        {
          school: 'Đại học Công nghệ thông tin - ĐHQG TP.HCM',
          degree: 'Cử nhân Kỹ thuật Phần mềm',
          duration: '2017 - 2021'
        }
      ]
    },
    {
      id: 3,
      name: 'Nguyễn Hoàng Nam',
      title: 'Mid Mobile Developer (Flutter/iOS/Android)',
      email: 'nam.nh@scaleedge.asia',
      phone: '0909123456',
      location: 'Đà Nẵng (Remote)',
      summary: 'Lập trình viên di động đa nền tảng Flutter với 3 năm kinh nghiệm, xây dựng ứng dụng trung thực cao, tích hợp bản đồ, cổng thanh toán và camera SDK.',
      skills: ['Flutter', 'Dart', 'Android/Kotlin', 'iOS/Swift', 'RESTful API', 'Firebase', 'State Management (Bloc)'],
      status: 'AVAILABLE',
      rating: 4.2,
      internalNotes: 'Kỹ năng Flutter tốt, đã làm nhiều dự án outsource. Phản xạ nhanh.',
      englishLevel: 'Intermediate',
      salaryExpectation: '28,000,000 VND / tháng',
      experience: [
        {
          company: 'Freelancer chuyên nghiệp',
          role: 'Mobile Team Lead',
          duration: '2023 - Present',
          description: 'Thầu dự án ứng dụng đặt xe và giao thức ăn cho khách hàng châu Âu. Phát triển các tính năng real-time tracking.'
        },
        {
          company: 'Rikkeisoft (Đối tác)',
          role: 'Flutter Developer',
          duration: '2022 - 2023',
          description: 'Xây dựng app e-commerce đa nền tảng cho thị trường Nhật Bản.'
        }
      ],
      education: [
        {
          school: 'Đại học Bách Khoa - Đại học Đà Nẵng',
          degree: 'Kỹ sư Công nghệ Thông tin',
          duration: '2018 - 2022'
        }
      ]
    },
    {
      id: 4,
      name: 'Phạm Anh Đức',
      title: 'DevOps Platform Engineer (AWS/Docker)',
      email: 'duc.pa@scaleedge.asia',
      phone: '0933445566',
      location: 'Hà Nội',
      summary: 'Chuyên gia DevOps có chuyên môn sâu về hạ tầng đám mây AWS, tự động hóa CI/CD, Containerization bằng Docker/Kubernetes và giám sát log tập trung.',
      skills: ['DevOps', 'AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD (Jenkins/GitLab)', 'Linux'],
      status: 'AVAILABLE',
      rating: 4.7,
      internalNotes: 'Kiến thức AWS sâu rộng, chứng chỉ AWS DevOps Engineer Professional. Kinh nghiệm setup CI/CD tốt.',
      englishLevel: 'Professional',
      salaryExpectation: '48,000,000 VND / tháng',
      experience: [
        {
          company: 'ScaleEdge (Trực tiếp)',
          role: 'Lead Cloud Infrastructure',
          duration: '2024 - Present',
          description: 'Thiết lập toàn bộ hạ tầng bảo mật dữ liệu cấp phân tử và hệ sinh thái Microservices của hệ thống.'
        },
        {
          company: 'Viettel Network',
          role: 'DevOps Engineer',
          duration: '2021 - 2024',
          description: 'Vận hành hạ tầng viễn thông Cloud lớn, cấu hình Auto-scaling giúp tiết kiệm 20% chi phí server.'
        }
      ],
      education: [
        {
          school: 'Học viện Công nghệ Bưu chính Viễn thông',
          degree: 'Kỹ sư Điện tử Viễn thông',
          duration: '2016 - 2021'
        }
      ]
    }
  ];

  // 2. Jobs
  fallbackStore.jobs = [
    {
      id: 1,
      title: 'Cần thuê 3 Lập trình viên Java Senior',
      company: 'VinGroup (Khách hàng)',
      location: 'Hà Nội',
      salary: '35,000,000 - 45,000,000 VND / tháng',
      tags: ['Java', 'Spring Boot', 'Microservices'],
      description: 'Cần cung cấp khẩn cấp 3 nhân sự Java Senior phát triển dự án nâng cấp lõi hệ thống VinID. Thời gian dự kiến: 6 tháng làm việc trực tiếp tại văn phòng. Yêu cầu pass vòng phỏng vấn kỹ thuật của ScaleEdge.',
      status: 'Active',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: 2,
      title: 'Cần thuê 2 Dev ReactJS / NextJS',
      company: 'Viettel Software (Khách hàng)',
      location: 'Hà Nội (Hybrid)',
      salary: '25,000,000 - 32,000,000 VND / tháng',
      tags: ['React', 'Next.js', 'CSS/SCSS'],
      description: 'Dự án chuyển đổi số cổng thông tin nội bộ Viettel. Cần 2 Dev React cứng cáp về giao diện glassmorphic và chuyển động mượt mà. Thời gian dự án: 4 tháng.',
      status: 'Active',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    {
      id: 3,
      title: 'Cần 1 Kỹ sư DevOps AWS Platform',
      company: 'Techcombank (Khách hàng)',
      location: 'TP. Hồ Chí Minh',
      salary: '40,000,000 - 55,000,000 VND / tháng',
      tags: ['DevOps', 'AWS', 'Kubernetes'],
      description: 'Thiết kế hạ tầng bảo mật cấp cao trên AWS Cloud phục vụ ngân hàng số. Cần nhân sự DevOps tối thiểu 4 năm kinh nghiệm thực tế, sẵn sàng bắt đầu ngay.',
      status: 'Active',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    }
  ];

  // 3. Applications
  fallbackStore.applications = [
    {
      id: 1,
      jobId: 1,
      candidateId: 1,
      status: 'HIRED',
      billingRate: 55000000.0,
      developerSalary: 40000000.0,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: 2,
      jobId: 2,
      candidateId: 2,
      status: 'SCREENING',
      billingRate: 45000000.0,
      developerSalary: 32000000.0,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: 3,
      jobId: 3,
      candidateId: 4,
      status: 'INTERVIEW',
      billingRate: 60000000.0,
      developerSalary: 48000000.0,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }
  ];

  // 4. Partners
  fallbackStore.partners = [
    {
      id: 1,
      code: 'PT-01',
      name: 'FPT Software',
      taxCode: '0101248130',
      repName: 'Nguyễn Lâm Phương',
      type: 'COMPANY',
      devsCount: 12,
      createdAt: new Date()
    },
    {
      id: 2,
      code: 'PT-02',
      name: 'Rikkeisoft Joint Stock Company',
      taxCode: '0105898860',
      repName: 'Phan Thế Dũng',
      type: 'COMPANY',
      devsCount: 8,
      createdAt: new Date()
    },
    {
      id: 3,
      code: 'PT-03',
      name: 'CMC Global',
      taxCode: '0107849122',
      repName: 'Nguyễn Trung Chính',
      type: 'COMPANY',
      devsCount: 5,
      createdAt: new Date()
    },
    {
      id: 4,
      code: 'PT-04',
      name: 'Nguyễn Hoàng Long',
      taxCode: '8092837233',
      repName: 'Nguyễn Hoàng Long',
      type: 'FREELANCER',
      devsCount: 1,
      createdAt: new Date()
    }
  ];

  // 5. Posts
  fallbackStore.posts = [
    {
      id: 1,
      authorName: 'Hệ thống tự động',
      authorRole: 'recruiter',
      content: 'Nhân sự Trần Minh Hoàng đã được phân công thành công vào dự án "Cần thuê 3 Lập trình viên Java Senior" của VinGroup.',
      likesCount: 1,
      createdAt: new Date()
    }
  ];

  // 6. Comments
  fallbackStore.comments = [
    {
      id: 1,
      postId: 1,
      authorName: 'TA Staff (Hương)',
      content: 'Đã hoàn tất ký hợp đồng 3 bên.',
      createdAt: new Date()
    }
  ];

  // 7. Chat messages
  fallbackStore.chatMessages = [
    {
      id: 1,
      sender: 'recruiter',
      recipient: 'candidate',
      message: 'Chào Hoàng, bên VinGroup đã duyệt hồ sơ của em. Thứ 2 tuần sau 8h30 em lên văn phòng làm thủ tục Onboard nhé.',
      createdAt: new Date(Date.now() - 60000)
    },
    {
      id: 2,
      sender: 'candidate',
      recipient: 'recruiter',
      message: 'Dạ em cảm ơn anh/chị. Em đã nhận được thông báo và sẽ chuẩn bị đầy đủ hồ sơ giấy tờ ạ.',
      createdAt: new Date()
    }
  ];

  // 8. Accounts
  fallbackStore.accounts = [
    {
      email: 'admin@vertex.vn',
      password: 'password',
      name: 'Admin Vertex',
      role: 'admin'
    },
    {
      email: 'ta@vertex.vn',
      password: 'password',
      name: 'Hương (TA Staff)',
      role: 'ta'
    },
    {
      email: 'ba@vertex.vn',
      password: 'password',
      name: 'Dũng (BA Manager)',
      role: 'ba'
    }
  ];

  fallbackStore.initialized = true;
}

// --- JOBS ACTIONS ---

export async function getJobs() {
  try {
    return await prisma.job.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        applications: true,
      },
    });
  } catch (error) {
    console.warn('Prisma getJobs failed, falling back to mock store:', error);
    initializeFallbackStore();
    return fallbackStore.jobs.map(job => ({
      ...job,
      applications: fallbackStore.applications.filter(app => app.jobId === job.id)
    })).sort((a, b) => {
      const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
      const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
      return bTime - aTime;
    });
  }
}

export async function createJob(data: {
  title: string;
  company: string;
  location: string;
  salary: string;
  tags: string[];
  description: string;
}): Promise<{ success: boolean; job?: any; error?: string }> {
  try {
    const job = await prisma.job.create({
      data: {
        title: data.title,
        company: data.company,
        location: data.location,
        salary: data.salary,
        tags: data.tags,
        description: data.description,
        status: 'Pending',
      },
    });
    revalidatePath('/');
    return { success: true, job };
  } catch (error) {
    console.warn('Prisma createJob failed, falling back to mock store:', error);
    initializeFallbackStore();
    const newJob = {
      id: fallbackStore.jobs.length + 1,
      ...data,
      status: 'Pending',
      createdAt: new Date()
    };
    fallbackStore.jobs.push(newJob);
    revalidatePath('/');
    return { success: true, job: newJob };
  }
}

export async function updateJobStatus(id: number, status: string): Promise<{ success: boolean; job?: any; error?: string }> {
  try {
    const job = await prisma.job.update({
      where: { id },
      data: { status },
    });
    revalidatePath('/');
    return { success: true, job };
  } catch (error) {
    console.warn('Prisma updateJobStatus failed, falling back to mock store:', error);
    initializeFallbackStore();
    const index = fallbackStore.jobs.findIndex(j => j.id === id);
    if (index !== -1) {
      fallbackStore.jobs[index].status = status;
      revalidatePath('/');
      return { success: true, job: fallbackStore.jobs[index] };
    }
    return { success: false, error: 'Không thể cập nhật trạng thái vị trí tuyển dụng' };
  }
}

// --- CANDIDATE PROFILE ACTIONS ---

export async function getCandidates() {
  try {
    return await prisma.candidate.findMany({
      orderBy: { id: 'asc' },
    });
  } catch (error) {
    console.warn('Prisma getCandidates failed, falling back to mock store:', error);
    initializeFallbackStore();
    return fallbackStore.candidates;
  }
}

export async function getCandidateProfile() {
  try {
    let candidate = await prisma.candidate.findFirst();
    if (!candidate) {
      candidate = await prisma.candidate.create({
        data: {
          name: 'Nguyễn Văn A',
          title: 'Senior Full Stack Developer',
          email: 'nguyenvana@gmail.com',
          phone: '0987654321',
          location: 'Hà Nội',
          summary: 'Kỹ sư Full Stack với hơn 5 năm kinh nghiệm.',
          skills: ['React', 'Node.js', 'PostgreSQL'],
          experience: [],
          education: [],
        },
      });
    }
    return candidate;
  } catch (error) {
    console.warn('Prisma getCandidateProfile failed, falling back to mock store:', error);
    initializeFallbackStore();
    return fallbackStore.candidates[0] || null;
  }
}

export async function updateCandidateProfile(data: {
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
}): Promise<{ success: boolean; candidate?: any; error?: string }> {
  try {
    const candidate = await prisma.candidate.update({
      where: { id: data.id },
      data: {
        name: data.name,
        title: data.title,
        email: data.email,
        phone: data.phone,
        location: data.location,
        summary: data.summary,
        skills: data.skills,
        experience: data.experience,
        education: data.education,
      },
    });
    revalidatePath('/');
    return { success: true, candidate };
  } catch (error) {
    console.warn('Prisma updateCandidateProfile failed, falling back to mock store:', error);
    initializeFallbackStore();
    const index = fallbackStore.candidates.findIndex(c => c.id === data.id);
    if (index !== -1) {
      fallbackStore.candidates[index] = {
        ...fallbackStore.candidates[index],
        ...data
      };
      revalidatePath('/');
      return { success: true, candidate: fallbackStore.candidates[index] };
    }
    return { success: false, error: 'Không thể cập nhật hồ sơ' };
  }
}

// --- APPLICATIONS ACTIONS ---

export async function getApplications() {
  try {
    return await prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        job: true,
        candidate: true,
      },
    });
  } catch (error) {
    console.warn('Prisma getApplications failed, falling back to mock store:', error);
    initializeFallbackStore();
    return fallbackStore.applications.map(app => {
      const job = fallbackStore.jobs.find(j => j.id === app.jobId);
      const candidate = fallbackStore.candidates.find(c => c.id === app.candidateId);
      return {
        ...app,
        job,
        candidate
      };
    }).sort((a, b) => {
      const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
      const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
      return bTime - aTime;
    });
  }
}

export async function applyToJob(jobId: number, candidateId: number): Promise<{ success: boolean; application?: any; error?: string }> {
  try {
    const existing = await prisma.application.findFirst({
      where: { jobId, candidateId },
    });

    if (existing) {
      return { success: false, error: 'Bạn đã nộp đơn cho công việc này rồi!' };
    }

    const application = await prisma.application.create({
      data: {
        jobId,
        candidateId,
        status: 'APPLIED',
      },
    });
    revalidatePath('/');
    return { success: true, application };
  } catch (error) {
    console.warn('Prisma applyToJob failed, falling back to mock store:', error);
    initializeFallbackStore();
    const existing = fallbackStore.applications.find(app => app.jobId === jobId && app.candidateId === candidateId);
    if (existing) {
      return { success: false, error: 'Bạn đã nộp đơn cho công việc này rồi!' };
    }
    const newApp = {
      id: fallbackStore.applications.length + 1,
      jobId,
      candidateId,
      status: 'APPLIED',
      billingRate: 45000000.0,
      developerSalary: 35000000.0,
      createdAt: new Date()
    };
    fallbackStore.applications.push(newApp);
    revalidatePath('/');
    return { success: true, application: newApp };
  }
}

export async function updateApplicationStatus(id: number, status: string): Promise<{ success: boolean; application?: any; error?: string }> {
  try {
    const application = await prisma.application.update({
      where: { id },
      data: { status },
    });
    revalidatePath('/');
    return { success: true, application };
  } catch (error) {
    console.warn('Prisma updateApplicationStatus failed, falling back to mock store:', error);
    initializeFallbackStore();
    const index = fallbackStore.applications.findIndex(app => app.id === id);
    if (index !== -1) {
      fallbackStore.applications[index].status = status;
      revalidatePath('/');
      return { success: true, application: fallbackStore.applications[index] };
    }
    return { success: false, error: 'Không thể cập nhật trạng thái tuyển dụng' };
  }
}

// --- FEED ACTIONS ---

export async function getPosts() {
  try {
    return await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        comments: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  } catch (error) {
    console.warn('Prisma getPosts failed, falling back to mock store:', error);
    initializeFallbackStore();
    return fallbackStore.posts.map(post => ({
      ...post,
      comments: fallbackStore.comments
        .filter(c => c.postId === post.id)
        .sort((a, b) => {
          const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
          const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
          return aTime - bTime;
        })
    })).sort((a, b) => {
      const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
      const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
      return bTime - aTime;
    });
  }
}

export async function createPost(data: {
  authorName: string;
  authorRole: string;
  content: string;
}): Promise<{ success: boolean; post?: any; error?: string }> {
  try {
    const post = await prisma.post.create({
      data: {
        authorName: data.authorName,
        authorRole: data.authorRole,
        content: data.content,
        likesCount: 0,
      },
    });
    revalidatePath('/');
    return { success: true, post };
  } catch (error) {
    console.warn('Prisma createPost failed, falling back to mock store:', error);
    initializeFallbackStore();
    const newPost = {
      id: fallbackStore.posts.length + 1,
      ...data,
      likesCount: 0,
      createdAt: new Date()
    };
    fallbackStore.posts.push(newPost);
    revalidatePath('/');
    return { success: true, post: newPost };
  }
}

export async function likePost(postId: number) {
  try {
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        likesCount: { increment: 1 },
      },
    });
    revalidatePath('/');
    return { success: true, post };
  } catch (error) {
    console.warn('Prisma likePost failed, falling back to mock store:', error);
    initializeFallbackStore();
    const post = fallbackStore.posts.find(p => p.id === postId);
    if (post) {
      post.likesCount += 1;
      revalidatePath('/');
      return { success: true, post };
    }
    return { success: false };
  }
}

export async function addComment(data: {
  postId: number;
  authorName: string;
  content: string;
}): Promise<{ success: boolean; comment?: any; error?: string }> {
  try {
    const comment = await prisma.comment.create({
      data: {
        postId: data.postId,
        authorName: data.authorName,
        content: data.content,
      },
    });
    revalidatePath('/');
    return { success: true, comment };
  } catch (error) {
    console.warn('Prisma addComment failed, falling back to mock store:', error);
    initializeFallbackStore();
    const newComment = {
      id: fallbackStore.comments.length + 1,
      ...data,
      createdAt: new Date()
    };
    fallbackStore.comments.push(newComment);
    revalidatePath('/');
    return { success: true, comment: newComment };
  }
}

// --- CHAT ACTIONS ---

export async function getChatMessages() {
  try {
    return await prisma.chatMessage.findMany({
      orderBy: { createdAt: 'asc' },
    });
  } catch (error) {
    console.warn('Prisma getChatMessages failed, falling back to mock store:', error);
    initializeFallbackStore();
    return fallbackStore.chatMessages.sort((a, b) => {
      const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
      const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
      return aTime - bTime;
    });
  }
}

export async function sendChatMessage(data: {
  sender: string;
  recipient: string;
  message: string;
}): Promise<{ success: boolean; chat?: any; error?: string }> {
  try {
    const chat = await prisma.chatMessage.create({
      data: {
        sender: data.sender,
        recipient: data.recipient,
        message: data.message,
      },
    });
    revalidatePath('/');
    return { success: true, chat };
  } catch (error) {
    console.warn('Prisma sendChatMessage failed, falling back to mock store:', error);
    initializeFallbackStore();
    const newChat = {
      id: fallbackStore.chatMessages.length + 1,
      ...data,
      createdAt: new Date()
    };
    fallbackStore.chatMessages.push(newChat);
    revalidatePath('/');
    return { success: true, chat: newChat };
  }
}

// --- CREATE CANDIDATE ACTION ---

export async function createCandidate(data: {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  experience: any;
  education: any;
}): Promise<{ success: boolean; candidate?: any; error?: string }> {
  try {
    const candidate = await prisma.candidate.create({
      data: {
        name: data.name,
        title: data.title,
        email: data.email,
        phone: data.phone,
        location: data.location,
        summary: data.summary,
        skills: data.skills,
        experience: data.experience,
        education: data.education,
      },
    });
    revalidatePath('/');
    return { success: true, candidate };
  } catch (error) {
    console.warn('Prisma createCandidate failed, falling back to mock store:', error);
    initializeFallbackStore();
    const newCandidate = {
      id: fallbackStore.candidates.length + 1,
      ...data,
      status: 'AVAILABLE',
      rating: 5.0,
      internalNotes: '',
      englishLevel: 'Intermediate',
      salaryExpectation: 'Negotiable'
    };
    fallbackStore.candidates.push(newCandidate);
    revalidatePath('/');
    return { success: true, candidate: newCandidate };
  }
}

export async function updateCandidateTAInfo(data: {
  id: number;
  status: string;
  rating: number;
  internalNotes: string;
  englishLevel: string;
  salaryExpectation: string;
}): Promise<{ success: boolean; candidate?: any; error?: string }> {
  try {
    const candidate = await prisma.candidate.update({
      where: { id: data.id },
      data: {
        status: data.status,
        rating: data.rating,
        internalNotes: data.internalNotes,
        englishLevel: data.englishLevel,
        salaryExpectation: data.salaryExpectation,
      },
    });
    revalidatePath('/');
    return { success: true, candidate };
  } catch (error) {
    console.warn('Prisma updateCandidateTAInfo failed, falling back to mock store:', error);
    initializeFallbackStore();
    const index = fallbackStore.candidates.findIndex(c => c.id === data.id);
    if (index !== -1) {
      fallbackStore.candidates[index] = {
        ...fallbackStore.candidates[index],
        ...data
      };
      revalidatePath('/');
      return { success: true, candidate: fallbackStore.candidates[index] };
    }
    return { success: false, error: 'Không thể cập nhật đánh giá nhân sự' };
  }
}

export async function getPartners() {
  try {
    return await prisma.partner.findMany({
      orderBy: { code: 'asc' },
    });
  } catch (error) {
    console.warn('Prisma getPartners failed, falling back to mock store:', error);
    initializeFallbackStore();
    return fallbackStore.partners;
  }
}

export async function createPartner(data: {
  code: string;
  name: string;
  type: string;
  taxCode: string;
  repName: string;
  devsCount: number;
}): Promise<{ success: boolean; partner?: any; error?: string }> {
  try {
    const partner = await prisma.partner.create({
      data: {
        code: data.code,
        name: data.name,
        type: data.type,
        taxCode: data.taxCode,
        repName: data.repName,
        devsCount: data.devsCount,
      },
    });
    revalidatePath('/');
    return { success: true, partner };
  } catch (error) {
    console.warn('Prisma createPartner failed, falling back to mock store:', error);
    initializeFallbackStore();
    const newPartner = {
      id: fallbackStore.partners.length + 1,
      ...data,
      createdAt: new Date()
    };
    fallbackStore.partners.push(newPartner);
    revalidatePath('/');
    return { success: true, partner: newPartner };
  }
}

export async function updateApplicationBilling(data: {
  id: number;
  billingRate: number;
  developerSalary: number;
}): Promise<{ success: boolean; application?: any; error?: string }> {
  try {
    const application = await prisma.application.update({
      where: { id: data.id },
      data: {
        billingRate: data.billingRate,
        developerSalary: data.developerSalary,
      },
    });
    revalidatePath('/');
    return { success: true, application };
  } catch (error) {
    console.warn('Prisma updateApplicationBilling failed, falling back to mock store:', error);
    initializeFallbackStore();
    const index = fallbackStore.applications.findIndex(app => app.id === data.id);
    if (index !== -1) {
      fallbackStore.applications[index].billingRate = data.billingRate;
      fallbackStore.applications[index].developerSalary = data.developerSalary;
      revalidatePath('/');
      return { success: true, application: fallbackStore.applications[index] };
    }
    return { success: false, error: 'Không thể cập nhật biểu phí hợp đồng' };
  }
}

// --- ACCOUNT ACTIONS ---

export async function getAccounts() {
  try {
    return await prisma.account.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.warn('Prisma getAccounts failed, falling back to mock store:', error);
    initializeFallbackStore();
    return fallbackStore.accounts;
  }
}

export async function createAccount(data: {
  email: string;
  password: string;
  name: string;
  role: string;
}): Promise<{ success: boolean; account?: any; error?: string }> {
  try {
    const existing = await prisma.account.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      return { success: false, error: 'Email đã tồn tại trên hệ thống!' };
    }

    const account = await prisma.account.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
      },
    });
    revalidatePath('/');
    return { success: true, account };
  } catch (error) {
    console.warn('Prisma createAccount failed, falling back to mock store:', error);
    initializeFallbackStore();
    const existing = fallbackStore.accounts.find(acc => acc.email === data.email);
    if (existing) {
      return { success: false, error: 'Email đã tồn tại trên hệ thống!' };
    }
    const newAccount = {
      id: fallbackStore.accounts.length + 1,
      ...data,
      createdAt: new Date()
    };
    fallbackStore.accounts.push(newAccount);
    revalidatePath('/');
    return { success: true, account: newAccount };
  }
}

export async function authenticateAccount(email: string, password: string): Promise<{ success: boolean; user?: any; error?: string }> {
  try {
    const account = await prisma.account.findUnique({
      where: { email },
    });
    if (!account || account.password !== password) {
      return { success: false, error: 'Email hoặc mật khẩu không chính xác!' };
    }
    return {
      success: true,
      user: {
        name: account.name,
        role: account.role,
      },
    };
  } catch (error) {
    console.warn('Prisma authenticateAccount failed, falling back to mock store:', error);
    initializeFallbackStore();
    const account = fallbackStore.accounts.find(acc => acc.email === email);
    if (!account || account.password !== password) {
      return { success: false, error: 'Email hoặc mật khẩu không chính xác!' };
    }
    return {
      success: true,
      user: {
        name: account.name,
        role: account.role,
      },
    };
  }
}
