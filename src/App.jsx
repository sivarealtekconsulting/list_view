import { ConfigProvider } from 'antd';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DashboardCards from './components/cards/DashboardCards';
import ListView from './components/ListView';
import CandidatesPage from './pages/CandidatesPage';
import AddCandidatePage from './pages/AddCandidatePage';
import DashboardPage from './pages/DashboardPage';
import JobsPage from './pages/JobsPage';
import SubmissionsPage from './pages/SubmissionsPage';
import DemoSamplePage from './pages/DemoSamplePage';
import DetailPage from './pages/DetailePage';
import UserForm from './components/form/forms';
import CmnLayout from './pages/SonyDashboard';
import NewDashboard from './components/cards/NewDashboard';
import SridharDashboardPage from './pages/sridharDashboard';
import SridharDetailPage from './pages/sridharDetailePage';
import GnaneshDashboard from './pages/gnanesh-dashboard';
import GnaneshDetailedView from './pages/gnanesh-detailed-view';
import GnaneshSubmissionsPage from './pages/gnanesh-submissions';
import StickyNotesCard from './components/cards/StickyNotesCard';
import StudentDashboardPage from './pages/suryaDashboardPage';
import NaveenDashboardPage from './pages/NaveenDashboardPage';
import PugazhDashboard from './pages/pugazh-dashboard';
import PugazhListView from './pages/pugazh-listview';
import PugazhDetailListView from './pages/pugazh-detail-listview';
import VenkateshDetailViewPage from './pages/VenkateshDetailViewPage';
import CandidateAddForm from './pages/AddFormPage';
import CandidateAddFormV1 from './pages/CandidateAddFormV1';
import CandidateAddFormV3 from './pages/CandidateAddFormV3';
import VenkateshEditJobPage from './pages/VenkateshEditJobPage';
import PugalDetailedView from './pages/pugal-detail-view-page';
import PugazhEditJob from './pages/PugazhEditJob';
import SubhaDashboardPage from './pages/SubhaDashboardPage';
import SubhaJobDetailPage from './pages/SubhaJobDetailPage';
import SonyDashboard from './pages/SonyDashboard';
import SonyDetailedView from './pages/SonyDetailedView';
import CandidateOnboardingListView from './components/CandidateOnboardingListView';
import DetailPages from './pages/suryaDetailview';
import JobEditPage from './pages/suryaJobEditPage';
import ZinnextDetailedView from './pages/zinnext-detailedView';
import UsersListPage from './pages/UsersListPage';
import RolesListPage from './pages/RolesListPage';
import TeamsListPage from './pages/TeamsListPage';
import AdminSetupPage from './pages/AdminSetupPage';

export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 8,
          fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <div style={{ background: '#f5f6fa', minHeight: '100vh', paddingTop: 24, paddingBottom: 24 }}>
                <DashboardCards />
                <ListView />
              </div>
            }
          />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/Venkatesh" element={<DemoSamplePage />} />
          <Route path="/Venkatesh-detailview/:id" element={<VenkateshDetailViewPage />} />
          <Route path="/Venkatesh-detailview/:id/edit-job" element={<VenkateshEditJobPage />} />

          <Route path="/new-dashboard" element={<NewDashboard />} />
          <Route path="/jobs/:jobId" element={<DetailPage />} />
          <Route path="/candidates" element={<CandidatesPage />} />
          <Route path="/admin" element={<AdminSetupPage />} />
          <Route path="/users" element={<UsersListPage />} />
          <Route path="/roles" element={<RolesListPage />} />
          <Route path="/teams" element={<TeamsListPage />} />
          <Route path="/naveen-dashboard" element={<NaveenDashboardPage />} />
          <Route path="/candidates/add" element={<AddCandidatePage />} />
          <Route path="/add" element={<UserForm />} />
          <Route path="/pugazh" element={<JobsPage />} />
          <Route path="/submissions" element={<SubmissionsPage />} />
          <Route path="/cmnlayout" element={<CmnLayout />} />
          <Route path="/sony-detailedview/:jobId" element={<SonyDetailedView />} />
          <Route path="/sony-dashboard" element={<SonyDashboard />} />
          <Route path="/candidate-add" element={<CandidateAddForm />} />
          <Route path="/candidate-add/v1" element={<CandidateAddFormV1 />} />
          <Route path="/candidate-add/v3" element={<CandidateAddFormV3 />} />

          <Route path="/add" element={<StickyNotesCard />} />
          <Route path="/pugazh-dashboard" element={<PugazhDashboard />} />
          <Route path="/Surya-dashboard" element={<StudentDashboardPage />} />
          <Route path="/Surya-detailview/:jobId" element={<DetailPages />} />
          <Route path="/Surya-job-edit" element={<JobEditPage />} />

          <Route path="/pugazh-listview" element={<PugazhListView />} />
          <Route path="/pugazh-detail-listview" element={<PugazhDetailListView />} />
          <Route path="/pugazh-edit-job" element={<PugazhEditJob />} />
          <Route path="/sri-dashboard" element={<SridharDashboardPage />} />
          <Route path="/sri-detailview" element={<SridharDetailPage />} />
          <Route path="/sri-detailview/:jobId" element={<SridharDetailPage />} />
          <Route path="/gnanesh-dashboard" element={<GnaneshDashboard />} />
          <Route path="/gnanesh-detailed-view/:jobId" element={<GnaneshDetailedView />} />
          <Route path="/gnanesh-submissions" element={<GnaneshSubmissionsPage />} />
          <Route path="/subha-detailview/:jobId" element={<SubhaJobDetailPage />} />
          <Route path="/subha-dashboard" element={<SubhaDashboardPage />} />
          <Route
            path="/candidate-onboarding"
            element={<CandidateOnboardingListView />}
          />
          <Route path="/zinnext-DetailedView" element={<ZinnextDetailedView />} />

        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}