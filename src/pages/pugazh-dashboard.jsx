import { Row, Col, Space } from 'antd';

import StatsCards           from '../components/cards/StatsCards';
import CalendarCard         from '../components/cards/CalendarCard';
import ClientSubmissionCard from '../components/cards/ClientSubmissionCard';
import StickyNotesCard      from '../components/cards/StickyNotesCard';
import OnboardingCard       from '../components/cards/OnboardingCard';

export default function PugazhDashboard() {
  return (
    <div className="dashboard-wrapper">
      <Row gutter={[16, 16]} align="top">

        <Col xs={20} lg={16}>
          <Space direction="vertical" size={12} className="jobs-page-left">
            <OnboardingCard />
            <StatsCards />
          </Space>
        </Col>

        <Col xs={24} lg={8}>
          <Space direction="vertical" size={12} className="jobs-page-right">
            <CalendarCard />
            <ClientSubmissionCard />
            <StickyNotesCard />
          </Space>
        </Col>

      </Row>
    </div>
  );
}