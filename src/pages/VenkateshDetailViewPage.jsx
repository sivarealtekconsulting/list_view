import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Row,
  Space,
  Tabs,
  Tag,
  Timeline,
  Typography,
} from 'antd';
import {
  CalendarOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  MoreOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Text, Title, Paragraph } = Typography;

const personalities = [
  { key: '1', name: 'John Doe', category: 'Type A', status: 'Active', assignedTo: 'Sarah Wilson', date: '15 May 2024', description: 'Senior personality profile with active engagement.' },
  { key: '2', name: 'Jane Smith', category: 'Type B', status: 'Pending', assignedTo: 'Mike Brown', date: '14 May 2024', description: 'Pending review with profile details in progress.' },
  { key: '3', name: 'Robert Johnson', category: 'Type C', status: 'Inactive', assignedTo: 'Emily Davis', date: '13 May 2024', description: 'Inactive profile retained for history.' },
  { key: '4', name: 'Michael Lee', category: 'Type A', status: 'Active', assignedTo: 'David Wilson', date: '12 May 2024', description: 'Active profile assigned for follow-up.' },
  { key: '5', name: 'Sophia Martinez', category: 'Type B', status: 'Pending', assignedTo: 'Sarah Wilson', date: '11 May 2024', description: 'Pending approval from assigned owner.' },
];

const statusColors = {
  Active: 'success',
  Pending: 'warning',
  Inactive: 'error',
};

const activityItems = [
  {
    color: 'blue',
    status: 'Created',
    tagColor: 'blue',
    text: 'Personality profile was created by Super Admin.',
  },
  {
    color: 'green',
    status: 'Assigned',
    tagColor: 'green',
    text: 'Profile owner was assigned for follow-up.',
  },
  {
    color: 'orange',
    status: 'Updated',
    tagColor: 'orange',
    text: 'Category and status information was updated.',
  },
];

function tabLabel(label, count) {
  return (
    <Space size={6}>
      <span>{label}</span>
      <Badge count={count} overflowCount={9999} />
    </Space>
  );
}

function SectionCard({ title, icon, children }) {
  return (
    <Card
      size="small"
      className="client-details-card"
      title={<Space size={6}>{icon}<Text strong>{title}</Text></Space>}
    >
      {children}
    </Card>
  );
}

export default function VenkateshDetailViewPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('details');
  const record = personalities.find((item) => item.key === String(id)) ?? personalities[0];

  return (
    <div className="dashboard-wrapper">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              { title: <Text type="secondary" onClick={() => navigate('/Venkatesh')}>Venkatesh</Text> },
              { title: <Text strong>Detail View</Text> },
            ]}
          />
        </Col>

        <Col span={24}>
          <Card size="small" className="client-details-card">
            <Row justify="space-between" gutter={[16, 16]}>
              <Col xs={24} lg={16}>
                <Space direction="vertical" size={8}>
                  <Text type="secondary">Personality ID #{record.key}</Text>
                  <Space size={8} wrap>
                    <Title level={4}>{record.name}</Title>
                    <Tag color={statusColors[record.status]}>{record.status}</Tag>
                  </Space>
                  <Space size={12} wrap>
                    <Text type="secondary"><UserOutlined /> {record.category}</Text>
                    <Text type="secondary"><TeamOutlined /> {record.assignedTo}</Text>
                    <Text type="secondary"><CalendarOutlined /> {record.date}</Text>
                  </Space>
                  <Tabs
                    size="small"
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={[
                      { key: 'details', label: tabLabel('Details', 1) },
                      { key: 'activity', label: tabLabel('Activity', activityItems.length) },
                    ]}
                  />
                </Space>
              </Col>
              <Col xs={24} lg={8}>
                <Row justify="end">
                  <Col>
                    <Space>
                      <Button type="link" icon={<TeamOutlined />}>Assign User</Button>
                      <Button type="text" icon={<MoreOutlined />} />
                    </Space>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Col>

        {activeTab === 'activity' ? (
          <Col span={24}>
            <SectionCard title="Activity" icon={<InfoCircleOutlined />}>
              <Timeline
                items={activityItems.map((item) => ({
                  color: item.color,
                  children: (
                    <Card size="small">
                      <Space direction="vertical" size={4}>
                        <Tag color={item.tagColor}>{item.status}</Tag>
                        <Text type="secondary">{item.text}</Text>
                      </Space>
                    </Card>
                  ),
                }))}
              />
            </SectionCard>
          </Col>
        ) : (
          <>
            <Col xs={24} lg={15}>
              <Space direction="vertical" size={12}>
                <SectionCard title="Basic Details" icon={<UserOutlined />}>
                  <Descriptions
                    bordered
                    column={{ xs: 1, md: 2 }}
                    items={[
                      { key: 'name', label: 'Personality Name', children: record.name },
                      { key: 'category', label: 'Category', children: record.category },
                      { key: 'status', label: 'Status', children: <Tag color={statusColors[record.status]}>{record.status}</Tag> },
                      { key: 'assignedTo', label: 'Assigned To', children: record.assignedTo },
                      { key: 'date', label: 'Date', children: record.date },
                    ]}
                  />
                </SectionCard>

                <SectionCard title="Description" icon={<FileTextOutlined />}>
                  <Paragraph>{record.description}</Paragraph>
                </SectionCard>
              </Space>
            </Col>

            <Col xs={24} lg={9}>
              <SectionCard title="Summary" icon={<InfoCircleOutlined />}>
                <Space direction="vertical" size={10}>
                  <Text type="secondary">Current Status</Text>
                  <Tag color={statusColors[record.status]}>{record.status}</Tag>
                  <Divider />
                  <Text type="secondary">Owner</Text>
                  <Text>{record.assignedTo}</Text>
                </Space>
              </SectionCard>
            </Col>
          </>
        )}
      </Row>
    </div>
  );
}
