import { ConfigProvider } from 'antd';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DashboardCards from './components/cards/DashboardCards';
import JobListView from './components/JobListView';
import CandidatesPage from './pages/CandidatesPage';
import AddCandidatePage from './pages/AddCandidatePage';
import DashboardPage from './pages/DashboardPage';
import JobsPage from './pages/JobsPage';  
import SubmissionsPage from './pages/SubmissionsPage'; 
import DemoSamplePage from './pages/DemoSamplePage';
import JobDetailPage from './pages/JobDetailPage';
import UserForm from './components/form/forms';
import CmnLayout from './pages/cmnLayout';
import NewDashboard from './components/cards/NewDashboard';
import JobCollapsePage from './pages/jobCollapsePage';
import NewDemoPageNash from './pages/NewDemoPageNash';
import StickyNotesCard from './components/cards/StickyNotesCard';
import StudentDashboardPage from './pages/StudentDashboardPage';
import NaveenDashboardPage from './pages/NaveenDashboardPage';

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
                <JobListView />
              </div>
            }
          />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/demosample" element={<DemoSamplePage />} />
          <Route path="/new-dashboard" element={<NewDashboard />} />
          <Route path="/jobs/:jobId" element={<JobDetailPage />} />
          <Route path="/candidates" element={<CandidatesPage />} />
          <Route path="/naveen-dashboard" element={<NaveenDashboardPage />} />
          <Route path="/candidates/add" element={<AddCandidatePage />} />
          <Route path="/add" element={<UserForm />} />
          <Route path="/pugazh"element={<JobsPage />}         />  
          <Route path="/submissions" element={<SubmissionsPage />} /> 
          <Route path="/cmnlayout" element={<CmnLayout />} />
          <Route path="/add" element={<StickyNotesCard />} />
          <Route
            path="/surya-dashboard"
            element={<StudentDashboardPage />}
          />


          <Route path="/jobs" element={<JobCollapsePage />} />
          <Route path="/nash" element={<NewDemoPageNash />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}
