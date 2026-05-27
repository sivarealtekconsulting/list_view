import { Row, Col, Space } from 'antd';
import StatsCards   from '../components/cards/StatsCards';
import JobListView from '../components/ListView';

export default function PugazhListView() {
  return (
    <div className="dashboard-wrapper">
      <Row gutter={[16, 16]} align="top">
        <Col xs={24}>
          <Space direction="vertical" size={12} className="jobs-page-left">
            <StatsCards />
            <JobListView />
          </Space>
        </Col>
      </Row>
    </div>
  );
}