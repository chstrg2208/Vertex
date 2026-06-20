# 🔷 Vertex — HR Tech Platform

<p align="center">
  <img src="./public/logo.png" alt="Vertex Logo" width="120"/>
</p>

<p align="center">
  <strong>Nền tảng quản lý nhân sự & tuyển dụng dành cho doanh nghiệp công nghệ</strong><br/>
  Kết nối ứng viên IT tài năng với các đối tác doanh nghiệp một cách thông minh và hiệu quả.
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16.2-black?logo=next.js"/>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript"/>
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma"/>
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql"/>
  <img alt="Docker" src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker"/>
</p>

---

## 📋 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng](#-tính-năng)
- [Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
- [Cơ sở dữ liệu](#-cơ-sở-dữ-liệu)
- [Phân quyền người dùng](#-phân-quyền-người-dùng)
- [Hướng dẫn cài đặt](#-hướng-dẫn-cài-đặt)
- [Tài khoản mặc định](#-tài-khoản-mặc-định)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Biến môi trường](#-biến-môi-trường)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)

---

## 🌟 Giới thiệu

**Vertex** là một nền tảng HR Tech toàn diện được xây dựng để số hóa quy trình tuyển dụng và quản lý nhân sự tại các công ty công nghệ. Hệ thống phục vụ hai vai trò nghiệp vụ chính:

- **TA (Talent Acquisition)** — Đội ngũ tuyển dụng, quản lý ứng viên và quy trình phỏng vấn
- **BA (Business Analyst / Business Development)** — Đội ngũ kinh doanh, quản lý đối tác và hợp đồng

Ngoài ra, hệ thống có **trang landing page** hướng tới ứng viên và khách hàng doanh nghiệp muốn tìm hiểu về dịch vụ của Vertex.

---

## ✨ Tính năng

### 🏠 Landing Page (Công khai)
- Trang chủ giới thiệu dịch vụ với thiết kế hiện đại, animation mượt mà
- Giới thiệu đội ngũ, giá trị cốt lõi và lợi thế cạnh tranh
- Danh sách **Job Openings** — các vị trí đang tuyển dụng
- **Technology Stack** — Showcase năng lực công nghệ của team
- Hỗ trợ **đa ngôn ngữ** (Tiếng Việt / English)
- Form liên hệ và đăng ký ứng tuyển

### 🔐 Hệ thống Xác thực
- Đăng nhập bằng **Email + Mật khẩu** (không dùng Google Login)
- Xác thực qua database, phân biệt vai trò rõ ràng
- Tất cả tài khoản **TA** và **BA** do **Admin** cấp phát
- Giao diện đăng nhập dạng FaceID/Portal hiện đại

### 👨‍💼 Cổng TA (Talent Acquisition Staff)

#### Quản lý Ứng viên
- Xem danh sách toàn bộ ứng viên với bộ lọc theo trạng thái
- Tạo hồ sơ ứng viên mới (tên, email, số điện thoại, vị trí, kỹ năng, kinh nghiệm, học vấn)
- Cập nhật trạng thái ứng viên: `AVAILABLE` → `VETTING` → `PLACED` → `ON_LEAVE`
- Đánh giá ứng viên bằng hệ thống **star rating**
- Ghi chú nội bộ (Internal Notes) riêng tư cho team TA
- Theo dõi trình độ tiếng Anh và mức lương kỳ vọng
- Xem chi tiết kinh nghiệm làm việc và bằng cấp học vấn

#### Quản lý Job
- Xem danh sách các vị trí đang tuyển từ các đối tác
- Tạo Job mới với mô tả, yêu cầu kỹ năng, mức lương, địa điểm
- Gắn tags kỹ năng cho từng vị trí

#### Quản lý Pipeline Tuyển dụng
- Apply ứng viên vào vị trí phù hợp
- Theo dõi trạng thái ứng tuyển: `APPLIED` → `SCREENING` → `INTERVIEW` → `OFFERED` → `HIRED` / `REJECTED`
- Xem tổng quan pipeline theo từng ứng viên và job

#### Giao tiếp Nội bộ
- **Chat** trực tiếp với team BA và các thành viên khác
- Giao diện chat real-time trong ứng dụng

### 💼 Cổng BA (Business Analyst / Business Development)

#### Quản lý Đối tác (Partners)
- Danh sách các công ty/freelancer đối tác
- Tạo hồ sơ đối tác mới: mã đối tác, tên, loại (Company/Freelancer), mã số thuế, người đại diện
- Theo dõi số lượng developers đang làm việc tại từng đối tác

#### Quản lý Job từ phía kinh doanh
- Xem các vị trí job đang mở từ đối tác
- Phối hợp với team TA để tuyển đúng profile

#### Quản lý Ứng tuyển & Billing
- Theo dõi ứng tuyển của ứng viên vào các job
- Cập nhật **Billing Rate** (mức thu của khách hàng) và **Developer Salary** (mức trả cho developer)
- Tính toán margin lợi nhuận

#### Giao tiếp Nội bộ
- **Chat** trực tiếp với team TA

### 🛡️ Cổng Admin

#### Quản lý Tài khoản
- Xem toàn bộ danh sách tài khoản trong hệ thống (Admin, TA, BA)
- **Tạo tài khoản mới** cho nhân viên TA hoặc BA với:
  - Email đăng nhập
  - Mật khẩu
  - Tên hiển thị
  - Vai trò (TA / BA)
- Quản lý tập trung, đảm bảo bảo mật

---

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────┐
│                   Next.js 16 App                    │
│                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │ Landing Page│  │  TA Portal  │  │  BA Portal  │ │
│  │  (Public)   │  │  (Private)  │  │  (Private)  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
│                         │                           │
│              ┌──────────────────────┐               │
│              │   Admin Portal       │               │
│              │   Account Mgmt       │               │
│              └──────────────────────┘               │
│                         │                           │
│              ┌──────────────────────┐               │
│              │   Server Actions     │               │
│              │   (Next.js actions)  │               │
│              └──────────────────────┘               │
│                         │                           │
│              ┌──────────────────────┐               │
│              │   Prisma ORM         │               │
│              └──────────────────────┘               │
└─────────────────────────────────────────────────────┘
                          │
              ┌──────────────────────┐
              │   PostgreSQL         │
              │   (Docker)           │
              └──────────────────────┘
```

---

## 🗄️ Cơ sở dữ liệu

Hệ thống sử dụng **PostgreSQL** với **Prisma ORM**. Các model chính:

| Model | Mô tả |
|---|---|
| `Account` | Tài khoản người dùng (admin, ta, ba) |
| `Candidate` | Hồ sơ ứng viên IT |
| `Job` | Vị trí tuyển dụng từ đối tác |
| `Application` | Liên kết ứng viên ↔ job, kèm trạng thái và billing |
| `Partner` | Đối tác doanh nghiệp / freelancer |
| `Post` | Bài đăng nội bộ |
| `Comment` | Bình luận trên bài đăng |
| `ChatMessage` | Tin nhắn nội bộ giữa các thành viên |

---

## 👥 Phân quyền người dùng

| Vai trò | Quyền hạn |
|---|---|
| **Admin** | Quản lý toàn bộ tài khoản; tạo/xóa tài khoản TA và BA |
| **TA** | Quản lý ứng viên, job, pipeline tuyển dụng; chat nội bộ |
| **BA** | Quản lý đối tác, billing, job; chat nội bộ |

> ⚠️ Tất cả tài khoản TA và BA phải được **Admin** cấp phát. Không có đăng ký tự do.

---

## 🚀 Hướng dẫn cài đặt

### Yêu cầu hệ thống
- [Node.js](https://nodejs.org/) >= 18.x
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (để chạy PostgreSQL)
- [Git](https://git-scm.com/)

### Bước 1 — Clone repository

```bash
git clone https://github.com/chstrg2208/Vertex.git
cd Vertex
```

### Bước 2 — Cài đặt dependencies

```bash
npm install
```

### Bước 3 — Cấu hình biến môi trường

Tạo file `.env` ở thư mục gốc:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/vertex_db"
```

### Bước 4 — Khởi động Database

```bash
docker-compose up -d
```

### Bước 5 — Khởi tạo Database & Seed dữ liệu mẫu

```bash
# Đồng bộ schema với database
npx prisma db push

# Tạo dữ liệu mẫu (bao gồm tài khoản mặc định)
npx prisma db seed
```

### Bước 6 — Chạy ứng dụng

```bash
npm run dev
```

Mở trình duyệt và truy cập: **http://localhost:3000**

---

## 🔑 Tài khoản mặc định

Sau khi seed, hệ thống sẽ có sẵn các tài khoản sau:

| Vai trò | Email | Mật khẩu |
|---|---|---|
| **Admin** | `admin@vertex.com` | `admin123` |
| **TA Staff** | `ta@vertex.com` | `ta123` |
| **BA Staff** | `ba@vertex.com` | `ba123` |

> 💡 Đăng nhập bằng tài khoản **Admin** để tạo thêm tài khoản TA/BA mới.

---

## 📁 Cấu trúc thư mục

```
Vertex/
├── prisma/
│   ├── schema.prisma          # Định nghĩa các model database
│   └── seed.ts                # Script tạo dữ liệu mẫu
├── public/                    # Static assets (ảnh, icons, logo)
├── src/
│   ├── app/
│   │   ├── actions.ts         # Server Actions (CRUD cho toàn bộ entities)
│   │   ├── page.tsx           # Entry point, fetch dữ liệu server-side
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── MainDashboard.tsx  # Router điều hướng vai trò sau đăng nhập
│   │   ├── ChatTab.tsx        # Component chat nội bộ
│   │   ├── portal/
│   │   │   ├── FaceIDLogin.tsx       # Giao diện & logic đăng nhập
│   │   │   └── PortalWorkspace.tsx   # Toàn bộ workspace TA / BA / Admin
│   │   └── landing/           # Các component cho Landing Page
│   └── utils/
│       └── translations.ts    # Hỗ trợ đa ngôn ngữ (vi/en)
├── docker-compose.yml         # Cấu hình PostgreSQL container
├── next.config.ts             # Cấu hình Next.js
└── tsconfig.json              # Cấu hình TypeScript
```

---

## ⚙️ Biến môi trường

| Biến | Mô tả | Ví dụ |
|---|---|---|
| `DATABASE_URL` | Chuỗi kết nối PostgreSQL | `postgresql://user:pass@localhost:5432/dbname` |

---

## 🛠️ Công nghệ sử dụng

| Công nghệ | Vai trò |
|---|---|
| **Next.js 16** | Full-stack React framework (App Router + Server Actions) |
| **TypeScript** | Kiểm tra kiểu tĩnh |
| **Prisma ORM** | Tương tác database an toàn kiểu |
| **PostgreSQL** | Cơ sở dữ liệu quan hệ |
| **Docker Compose** | Container hóa database để dev |
| **Lucide React** | Bộ icon hiện đại |
| **Vanilla CSS** | Styling không phụ thuộc framework |

---

## 📜 Scripts

```bash
npm run dev        # Chạy môi trường development (http://localhost:3000)
npm run build      # Build production bundle
npm run start      # Chạy production server
npm run lint       # Kiểm tra lỗi ESLint
npx prisma studio  # Giao diện quản lý database trực quan
```

---

## 👨‍💻 Tác giả

Được phát triển bởi nhóm **Vertex** — FPT University  
© 2026 Vertex HR Tech. All rights reserved.
