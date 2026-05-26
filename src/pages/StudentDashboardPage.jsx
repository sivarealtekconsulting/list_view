import { useState } from 'react';
import {
  Card,
  Col,
  Row,
  Typography,
  Space,
  Button,
  Statistic,
} from 'antd';

import CalendarCard from '../components/cards/CalendarCard';
import StickyNotesCard from '../components/cards/StickyNotesCard';
import DynamicFieldFilter from '../components/filters/DynamicFieldFilter';
import JobListView from '../components/JobListView';

const { Title, Text } = Typography;

export default function StudentDashboardPage() {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <>
      {/* Page Header */}
      <Row>
        <Col span={24}>
          <Title level={3}>My Page</Title>
        </Col>
      </Row>

      {/* Top Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Space direction="vertical">
              <Text type="secondary">Total Candidates</Text>
              <Statistic value={350} />
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card>
            <Space direction="vertical">
              <Text type="secondary">Total Onboarded</Text>
              <Statistic value={210} />
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Calendar | Filter | Form */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <CalendarCard />
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Filters">
            <Button
              type="primary"
              block
              onClick={() => setFilterOpen(true)}
            >
              Open Filters
            </Button>

            <DynamicFieldFilter
              moduleName="jobs"
              open={filterOpen}
              onClose={() => setFilterOpen(false)}
              onApply={(data) => console.log(data)}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Quick Form">
            <StickyNotesCard />
          </Card>
        </Col>
      </Row>

      {/* List View */}
      <Row>
        <Col span={24}>
          <JobListView />
        </Col>
      </Row>
    </>
  );
}