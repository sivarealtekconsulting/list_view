import { useState } from 'react';
import {
  Card,
  Col,
  Row,
  Space,
  Button,
  Statistic,
} from 'antd';

import CalendarCard from '../components/cards/CalendarCard';
import StickyNotesCard from '../components/cards/StickyNotesCard';
import JobListView from '../components/JobListView';
import JobFilters from '../components/filters/filters';
import UserForm from '../components/form/forms';

export default function StudentDashboardPage() {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div
      style={{
        padding: 16,
        width: '100%',
      }}
    >
      {/* Header */}
      <Row style={{ marginBottom: 16 }}>
        <Col span={24}>My Page</Col>
      </Row>

      {/* Top Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={12}>
          <Card>
            <Space direction="vertical">
              <div>Total Candidates</div>
              <Statistic value={350} />
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card>
            <Space direction="vertical">
              <div>Total Onboarded</div>
              <Statistic value={210} />
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Main Layout */}
      <Row gutter={[16, 16]} align="top">
        {/* Left Side */}
        <Col xs={24} lg={7}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <CalendarCard />
            </Col>

            <Col span={24}>
              <Card title="Quick Form">
                <UserForm />
              </Card>
            </Col>
          </Row>
        </Col>

        {/* Right Side */}
        <Col xs={24} lg={17}>
          <Row gutter={[16, 16]}>
            {/* Filters */}
            <Col span={24}>
              <Card title="Filters">
                <Button
                  type="primary"
                  block
                  onClick={() => setFilterOpen(true)}
                >
                  Open Filters
                </Button>

                <JobFilters
                  open={filterOpen}
                  onClose={() => setFilterOpen(false)}
                  onApply={(data) => console.log(data)}
                />
              </Card>
            </Col>

            {/* Notes */}
            <Col span={24}>
              <Card title="Quick Notes">
                <StickyNotesCard />
              </Card>
            </Col>

            {/* Job List */}
            <Col span={24}>
              <Card bodyStyle={{ padding: 0 }}>
                <div
                  style={{
                    width: '100%',
                    overflowX: 'auto',
                  }}
                >
                  <JobListView />
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}