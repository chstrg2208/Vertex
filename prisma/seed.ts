import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database for ScaleEdge structure...');
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.application.deleteMany({});
  await prisma.job.deleteMany({});
  await prisma.candidate.deleteMany({});
  await prisma.chatMessage.deleteMany({});
  await prisma.partner.deleteMany({});
  await prisma.account.deleteMany({});

  console.log('Seeding IT Talents (Developers)...');
  const dev1 = await prisma.candidate.create({
    data: {
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
    }
  });

  const dev2 = await prisma.candidate.create({
    data: {
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
    }
  });

  const dev3 = await prisma.candidate.create({
    data: {
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
    }
  });

  const dev4 = await prisma.candidate.create({
    data: {
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
  });

  console.log('Seeding Job Requests (Yêu Cầu Tuyển Dụng)...');
  const request1 = await prisma.job.create({
    data: {
      title: 'Cần thuê 3 Lập trình viên Java Senior',
      company: 'VinGroup (Khách hàng)',
      location: 'Hà Nội',
      salary: '35,000,000 - 45,000,000 VND / tháng',
      tags: ['Java', 'Spring Boot', 'Microservices'],
      description: 'Cần cung cấp khẩn cấp 3 nhân sự Java Senior phát triển dự án nâng cấp lõi hệ thống VinID. Thời gian dự kiến: 6 tháng làm việc trực tiếp tại văn phòng. Yêu cầu pass vòng phỏng vấn kỹ thuật của ScaleEdge.'
    }
  });

  const request2 = await prisma.job.create({
    data: {
      title: 'Cần thuê 2 Dev ReactJS / NextJS',
      company: 'Viettel Software (Khách hàng)',
      location: 'Hà Nội (Hybrid)',
      salary: '25,000,000 - 32,000,000 VND / tháng',
      tags: ['React', 'Next.js', 'CSS/SCSS'],
      description: 'Dự án chuyển đổi số cổng thông tin nội bộ Viettel. Cần 2 Dev React cứng cáp về giao diện glassmorphic và chuyển động mượt mà. Thời gian dự án: 4 tháng.'
    }
  });

  const request3 = await prisma.job.create({
    data: {
      title: 'Cần 1 Kỹ sư DevOps AWS Platform',
      company: 'Techcombank (Khách hàng)',
      location: 'TP. Hồ Chí Minh',
      salary: '40,000,000 - 55,000,000 VND / tháng',
      tags: ['DevOps', 'AWS', 'Kubernetes'],
      description: 'Thiết kế hạ tầng bảo mật cấp cao trên AWS Cloud phục vụ ngân hàng số. Cần nhân sự DevOps tối thiểu 4 năm kinh nghiệm thực tế, sẵn sàng bắt đầu ngay.'
    }
  });

  console.log('Seeding Placements (Ứng Tuyển & Phân Công)...');
  await prisma.application.create({
    data: {
      jobId: request1.id,
      candidateId: dev1.id,
      status: 'HIRED', // Đã duyệt dự án
      billingRate: 55000000.0,
      developerSalary: 40000000.0,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    }
  });

  await prisma.application.create({
    data: {
      jobId: request2.id,
      candidateId: dev2.id,
      status: 'SCREENING', // Đang thẩm định hồ sơ
      billingRate: 45000000.0,
      developerSalary: 32000000.0,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    }
  });

  await prisma.application.create({
    data: {
      jobId: request3.id,
      candidateId: dev4.id,
      status: 'INTERVIEW', // Đang lên lịch phỏng vấn với ngân hàng
      billingRate: 60000000.0,
      developerSalary: 48000000.0,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }
  });

  console.log('Seeding Supply Partners...');
  await prisma.partner.create({
    data: {
      code: 'PT-01',
      name: 'FPT Software',
      taxCode: '0101248130',
      repName: 'Nguyễn Lâm Phương',
      type: 'COMPANY',
      devsCount: 12
    }
  });

  await prisma.partner.create({
    data: {
      code: 'PT-02',
      name: 'Rikkeisoft Joint Stock Company',
      taxCode: '0105898860',
      repName: 'Phan Thế Dũng',
      type: 'COMPANY',
      devsCount: 8
    }
  });

  await prisma.partner.create({
    data: {
      code: 'PT-03',
      name: 'CMC Global',
      taxCode: '0107849122',
      repName: 'Nguyễn Trung Chính',
      type: 'COMPANY',
      devsCount: 5
    }
  });

  await prisma.partner.create({
    data: {
      code: 'PT-04',
      name: 'Nguyễn Hoàng Long',
      taxCode: '8092837233',
      repName: 'Nguyễn Hoàng Long',
      type: 'FREELANCER',
      devsCount: 1
    }
  });

  console.log('Seeding system notifications & logs...');
  const post1 = await prisma.post.create({
    data: {
      authorName: 'Hệ thống tự động',
      authorRole: 'recruiter',
      content: 'Nhân sự Trần Minh Hoàng đã được phân công thành công vào dự án "Cần thuê 3 Lập trình viên Java Senior" của VinGroup.',
      likesCount: 1
    }
  });

  await prisma.comment.create({
    data: {
      postId: post1.id,
      authorName: 'TA Staff (Hương)',
      content: 'Đã hoàn tất ký hợp đồng 3 bên.'
    }
  });

  console.log('Seeding chat messages...');
  await prisma.chatMessage.create({
    data: {
      sender: 'recruiter',
      recipient: 'candidate',
      message: 'Chào Hoàng, bên VinGroup đã duyệt hồ sơ của em. Thứ 2 tuần sau 8h30 em lên văn phòng làm thủ tục Onboard nhé.'
    }
  });

  await prisma.chatMessage.create({
    data: {
      sender: 'candidate',
      recipient: 'recruiter',
      message: 'Dạ em cảm ơn anh/chị. Em đã nhận được thông báo và sẽ chuẩn bị đầy đủ hồ sơ giấy tờ ạ.'
    }
  });

  console.log('Seeding Default Accounts...');
  await prisma.account.create({
    data: {
      email: 'admin@vertex.vn',
      password: 'password',
      name: 'Admin Vertex',
      role: 'admin'
    }
  });

  await prisma.account.create({
    data: {
      email: 'ta@vertex.vn',
      password: 'password',
      name: 'Hương (TA Staff)',
      role: 'ta'
    }
  });

  await prisma.account.create({
    data: {
      email: 'ba@vertex.vn',
      password: 'password',
      name: 'Dũng (BA Manager)',
      role: 'ba'
    }
  });

  console.log('ScaleEdge Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
