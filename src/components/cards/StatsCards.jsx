import { Card, Row, Col, Statistic, Typography, Space, Tooltip, Button } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, UserOutlined, FilterOutlined } from '@ant-design/icons';
import '../../styles/StatsCards.css';
import { useState } from 'react';

const { Text } = Typography;

const stats = [
  { label: 'Total Jobs',  value: 1697, icon: <FileTextOutlined /> },
  { label: 'Active Jobs', value: 1685, icon: <CheckCircleOutlined /> },
  { label: 'My Jobs',     value: 600,  icon: <UserOutlined /> },
];

export default function StatsCards() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  return (
    <Card>
      <Row gutter={[12, 12]}>
        {stats.map(s => (
          <Col key={s.label} xs={24} sm={24} md={8} lg={8} xl={8}>
            <Card className="stats-inner-card">
              <Space align="center">
                {s.icon}
                <Text>{s.label}</Text>
              </Space>
              <Statistic value={s.value} />
            </Card>
          </Col>
        ))}
      </Row>
     
            
    </Card>
  );
}
