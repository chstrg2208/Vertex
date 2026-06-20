import { getJobs, getCandidates, getCandidateProfile, getApplications, getPosts, getChatMessages, getPartners, getAccounts } from './actions';
import MainDashboard from '@/components/MainDashboard';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch initial data in parallel from PostgreSQL
  const [jobs, candidates, profile, applications, posts, messages, partners, accounts] = await Promise.all([
    getJobs(),
    getCandidates(),
    getCandidateProfile(),
    getApplications(),
    getPosts(),
    getChatMessages(),
    getPartners(),
    getAccounts(),
  ]);

  return (
    <MainDashboard
      initialJobs={jobs}
      initialCandidates={candidates}
      initialProfile={profile}
      initialApplications={applications}
      initialPosts={posts}
      initialMessages={messages}
      initialPartners={partners}
      initialAccounts={accounts}
    />
  );
}
