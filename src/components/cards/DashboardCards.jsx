import { Col, Row } from 'antd';
import StatsCards from './StatsCards';
import StickyNotesCard from './StickyNotesCard';
import CalendarCard from './CalendarCard';
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

        {/* Row 2: Sticky Notes */}
        <Col span={24}>
          <StickyNotesCard />
        </Col>

        {/* Row 3: Calendar */}
        <Col span={24}>
          <CalendarCard />
        </Col>

        {/* Row 4: Client Details - full width */}
        <Col span={24}>
          <ClientDetailsCard />
        </Col>

      </Row>
    </div>
  );
}
