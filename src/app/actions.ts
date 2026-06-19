'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

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
    console.error('Failed to get jobs:', error);
    return [];
  }
}

export async function createJob(data: {
  title: string;
  company: string;
  location: string;
  salary: string;
  tags: string[];
  description: string;
}) {
  try {
    const job = await prisma.job.create({
      data: {
        title: data.title,
        company: data.company,
        location: data.location,
        salary: data.salary,
        tags: data.tags,
        description: data.description,
      },
    });
    revalidatePath('/');
    return { success: true, job };
  } catch (error) {
    console.error('Failed to create job:', error);
    return { success: false, error: 'Không thể tạo công việc' };
  }
}

// --- CANDIDATE PROFILE ACTIONS ---

export async function getCandidates() {
  try {
    return await prisma.candidate.findMany({
      orderBy: { id: 'asc' },
    });
  } catch (error) {
    console.error('Failed to get candidates:', error);
    return [];
  }
}

export async function getCandidateProfile() {
  try {
    // Return first candidate, or seed if missing
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
    console.error('Failed to get candidate profile:', error);
    return null;
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
}) {
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
    console.error('Failed to update candidate profile:', error);
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
    console.error('Failed to get applications:', error);
    return [];
  }
}

export async function applyToJob(jobId: number, candidateId: number) {
  try {
    // Check if already applied
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
    console.error('Failed to apply to job:', error);
    return { success: false, error: 'Không thể nộp đơn' };
  }
}

export async function updateApplicationStatus(id: number, status: string) {
  try {
    const application = await prisma.application.update({
      where: { id },
      data: { status },
    });
    revalidatePath('/');
    return { success: true, application };
  } catch (error) {
    console.error('Failed to update application status:', error);
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
    console.error('Failed to get posts:', error);
    return [];
  }
}

export async function createPost(data: {
  authorName: string;
  authorRole: string;
  content: string;
}) {
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
    console.error('Failed to create post:', error);
    return { success: false, error: 'Không thể tạo bài viết mới' };
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
    console.error('Failed to like post:', error);
    return { success: false };
  }
}

export async function addComment(data: {
  postId: number;
  authorName: string;
  content: string;
}) {
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
    console.error('Failed to add comment:', error);
    return { success: false, error: 'Không thể gửi bình luận' };
  }
}

// --- CHAT ACTIONS ---

export async function getChatMessages() {
  try {
    return await prisma.chatMessage.findMany({
      orderBy: { createdAt: 'asc' },
    });
  } catch (error) {
    console.error('Failed to get chat messages:', error);
    return [];
  }
}

export async function sendChatMessage(data: {
  sender: string;
  recipient: string;
  message: string;
}) {
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
    console.error('Failed to send chat message:', error);
    return { success: false, error: 'Không thể gửi tin nhắn' };
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
}) {
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
    console.error('Failed to create candidate:', error);
    return { success: false, error: 'Không thể tạo hồ sơ nhân sự mới' };
  }
}

