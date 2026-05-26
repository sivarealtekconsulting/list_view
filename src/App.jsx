import { ConfigProvider } from 'antd';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DashboardCards from './components/cards/DashboardCards';
import JobListView from './components/JobListView';
import CandidatesPage from './pages/CandidatesPage';
import AddCandidatePage from './pages/AddCandidatePage';
import DashboardPage from './pages/DashboardPage';
import UserForm from './components/form/forms';
import NewDashboard from './components/cards/NewDashboard';

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
          <Route path="/new-dashboard" element={<NewDashboard />} />
          <Route path="/candidates" element={<CandidatesPage />} />
          <Route path="/candidates/add" element={<AddCandidatePage />} />
          <Route path="/add" element={<UserForm />} />

        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}
