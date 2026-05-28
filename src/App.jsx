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
import StickyNotesCard from './components/cards/StickyNotesCard';
import StudentDashboardPage from './pages/StudentDashboardPage';
import NaveenDashboardPage from './pages/NaveenDashboardPage';
import PugazhDashboard from './pages/pugazh-dashboard';
import PugazhListView from './pages/pugazh-listview';
import PugazhDetailListView from './pages/pugazh-detail-listview';
import VenkateshDetailViewPage from './pages/VenkateshDetailViewPage';
import PugalDetailedView from './pages/pugal-detail-view-page'
import PugazhEditJob from './pages/PugazhEditJob';

import SubhaDashboardPage from './pages/SubhaDashboardPage';
import SubhaJobDetailPage from './pages/SubhaJobDetailPage';
import SonyDashboard from './pages/SonyDashboard';
import SonyDetailedView from './pages/SonyDetailedView';

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

          <Route path="/new-dashboard" element={<NewDashboard />} />
          <Route path="/jobs/:jobId" element={<DetailPage />} />
          <Route path="/candidates" element={<CandidatesPage />} />
          <Route path="/naveen-dashboard" element={<NaveenDashboardPage />} />
          <Route path="/candidates/add" element={<AddCandidatePage />} />
          <Route path="/add" element={<UserForm />} />
          <Route path="/pugazh" element={<JobsPage />} />
          <Route path="/submissions" element={<SubmissionsPage />} />
          <Route path="/cmnlayout" element={<CmnLayout />} />
          <Route path="/sony-detailedview/:jobId" element={<SonyDetailedView />} />
          <Route path="/sony-dashboard" element={<SonyDashboard />} />

          <Route path="/add" element={<StickyNotesCard />} />
          <Route
            path="/student-dashboard"
            element={<StudentDashboardPage />}
          />
          <Route path="/pugazh-dashboard" element={<PugazhDashboard />} />
          <Route path="/pugazh-listview" element={<PugazhListView />} />
          <Route path="/pugazh-detail-listview" element={<PugazhDetailListView />} />
          <Route path="/pugazh-edit-job" element={<PugazhEditJob />} />
          <Route path="/sri-dashboard" element={<SridharDashboardPage />} />
          <Route path="/sri-detailview" element={<SridharDetailPage />} />
          <Route path="/sri-detailview/:jobId" element={<SridharDetailPage />} />
          <Route path="/gnanesh-dashboard" element={<GnaneshDashboard />} />
          <Route path="/gnanesh-detailed-view/:jobId" element={<GnaneshDetailedView />} />
          <Route path="/subha-detailview" element={<SubhaJobDetailPage />} />
          <Route path="/subha-dashboard" element={<SubhaDashboardPage />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}
