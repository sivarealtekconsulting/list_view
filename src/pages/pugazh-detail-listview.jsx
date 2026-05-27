import { Row, Col, Space } from 'antd';
import ClientDetailsCard    from '../components/cards/ClientDetailsCard';
import ClientSubmissionCard from '../components/cards/ClientSubmissionCard';
import StickyNotesCard      from '../components/cards/StickyNotesCard';

export default function PugazhDetailListView() {
  return (
    <div className="dashboard-wrapper">
      <Row gutter={[16, 16]} align="top">
        <Col xs={24} lg={16}>
          <Space direction="vertical" size={12} className="jobs-page-left">
            <ClientDetailsCard />
          </Space>
        </Col>
        <Col xs={24} lg={8}>
          <Space direction="vertical" size={12} className="jobs-page-right">
            <ClientSubmissionCard />
            <StickyNotesCard />
          </Space>
        </Col>
      </Row>
    </div>
  );
}