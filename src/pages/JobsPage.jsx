import { Avatar, Button, Layout, Menu, Space, Typography } from 'antd';
import {
  AppstoreOutlined, AuditOutlined, BarChartOutlined, BankOutlined,
  CalendarOutlined, CaretDownOutlined, FileTextOutlined, MailOutlined,
  NotificationOutlined, SafetyCertificateOutlined, SendOutlined,
  ShareAltOutlined, TeamOutlined, UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import StatsCards  from '../components/cards/StatsCards';
import ListView from '../components/ListView';

import StatsCards           from '../components/cards/StatsCards';
import JobListView          from '../components/JobListView';
import CalendarCard         from '../components/cards/CalendarCard';
import ClientSubmissionCard from '../components/cards/ClientSubmissionCard';
import ClientDetailsCard    from '../components/cards/ClientDetailsCard';
import StickyNotesCard      from '../components/cards/StickyNotesCard';
import OnboardingCard from '../components/cards/OnboardingCard';

export default function JobsPage() {
  return (
    <div className="dashboard-wrapper">
      <Row gutter={[16, 16]} align="top">

        {/* LEFT — Stats + JobList + ClientDetails */}
        <Col xs={20} lg={16}>
          <Space direction="vertical" size={12} className="jobs-page-left">
            <OnboardingCard />
            <StatsCards />
            {/* <OnboardingCard /> */}
            <JobListView />
            {/* <OnboardingCard /> */}
            {/* <ClientDetailsCard /> */}
          </Space>
        </Col>

        <Content className="jobs-content">
          <StatsCards />
          <ListView />
        </Content>
      </Layout>
    </Layout>
  );
}