import { Col, Row } from 'antd';
import StatsCards from './StatsCards';
import ClientSubmissionCard from './ClientSubmissionCard';
import StickyNotesCard from './StickyNotesCard';
import CalendarCard from './CalendarCard';
import OnboardingCard from './OnboardingCard';
import ClientDetailsCard from './ClientDetailsCard';
import '../../styles/DashboardCards.css';

export default function DashboardCards() {
  return (
    <div className="dashboard-wrapper">
      <Row gutter={[16, 16]}>

        {/* Row 1: Stats - full width */}
        <Col span={24}>
          <StatsCards />
        </Col>

        {/* Row 2: Client Submission + Sticky Notes */}
        <Col xs={24} md={12}>
          <ClientSubmissionCard />
        </Col>
        <Col xs={24} md={12}>
          <StickyNotesCard />
        </Col>

        {/* Row 3: Calendar + Onboarding */}
        <Col xs={24} md={12}>
          <CalendarCard />
        </Col>
        <Col xs={24} md={12}>
          <OnboardingCard />
        </Col>

        {/* Row 4: Client Details - full width */}
        <Col span={24}>
          <ClientDetailsCard />
        </Col>

      </Row>
    </div>
  );
}
