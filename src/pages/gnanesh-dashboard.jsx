import { useState } from 'react';
import {
  Breadcrumb,
  Layout,
  Row,
  Col,
  Typography,
} from 'antd';

import StatsCards from '../components/cards/StatsCards';
import CalendarCard from '../components/cards/CalendarCard';
import DynamicFieldFilter from '../components/filters/DynamicFieldFilter';
import GnaneshListView from '../components/GnaneshListView';

const { Content } = Layout;
const { Text } = Typography;

export default function GnaneshDashboard() {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <Layout className="jobs-page-shell">
      <Layout className="jobs-page-layout">
        <Content className="jobs-page-content">
          <div className="jobs-page-breadcrumb-row">
            <Breadcrumb
              items={[
                {
                  title: (
                    <Text type="secondary" className="jobs-page-breadcrumb-home">
                      Home
                    </Text>
                  ),
                },
                {
                  title: (
                    <Text strong className="jobs-page-breadcrumb-active">
                      Jobs
                    </Text>
                  ),
                },
              ]}
            />
          </div>

          <Row className="jobs-page-stats-row">
            <Col span={24}>
              <StatsCards />
            </Col>
          </Row>

          <Row gutter={[16, 16]} className="jobs-page-main-row">
            <Col span={6} className="jobs-page-calendar-col">
              <CalendarCard />
            </Col>

            <Col span={18} className="jobs-page-list-col">
              <GnaneshListView />
            </Col>
          </Row>
        </Content>
      </Layout>

      <DynamicFieldFilter
        moduleName="jobs"
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        onApply={(result) => {
          console.log('Job filters applied:', result);
          setFiltersOpen(false);
        }}
      />
    </Layout>
  );
}