import { Col, Row } from 'antd';
import StatsCards from '../components/cards/StatsCards';
import ClientSubmissionCard from '../components/cards/ClientSubmissionCard';
import StickyNotesCard from '../components/cards/StickyNotesCard';
import CalendarCard from '../components/cards/CalendarCard';
import OnboardingCard from '../components/cards/OnboardingCard';
import ClientDetailsCard from '../components/cards/ClientDetailsCard';
// import ListView from '../components/ListView';
import ListViews from '../components/suryaListView';
// import '../../styles/DashboardCards.css';

export default function NaveenDashboardPage() {
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
        {/* <Col span={24}>
          <ClientDetailsCard />
        </Col> */}
        <Col span={24}>
          <ListViews />
        </Col>

      </Row>
    </div>
  );
}
