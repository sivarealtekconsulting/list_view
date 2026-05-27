import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Flex,
  Grid,
  Progress,
  Row,
  Space,
  Table,
  Tabs,
  Tag,
  Timeline,
  Typography,
} from 'antd';
import {
  ArrowLeftOutlined,
  AuditOutlined,
  CalendarOutlined,
  EditOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { PERSONALITIES, PERSONALITY_STATUS_COLORS } from '../data/personalities';

const { Text, Title, Paragraph } = Typography;

const candidateRows = [
  {
    key: '1',
    candidateId: 'CAND-001',
    name: 'Arun Kumar',
    role: 'Business Analyst',
    experience: '6 years',
    location: 'Dallas, TX',
    status: 'Submitted',
    submittedDate: '21 May 2024',
  },
  {
    key: '2',
    candidateId: 'CAND-002',
    name: 'Meera Iyer',
    role: 'Product Consultant',
    experience: '5 years',
    location: 'Austin, TX',
    status: 'Shortlisted',
    submittedDate: '20 May 2024',
  },
  {
    key: '3',
    candidateId: 'CAND-003',
    name: 'Rahul Sharma',
    role: 'Customer Success Lead',
    experience: '7 years',
    location: 'Chicago, IL',
    status: 'Pipeline',
    submittedDate: '18 May 2024',
  },
];

const candidateStatusColors = {
  Submitted: 'blue',
  Shortlisted: 'green',
  Pipeline: 'gold',
};

const candidateColumns = [
  {
    title: 'Candidate ID',
    dataIndex: 'candidateId',
    sorter: (a, b) => a.candidateId.localeCompare(b.candidateId),
  },
  {
    title: 'Candidate Name',
    dataIndex: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: 'Role',
    dataIndex: 'role',
    sorter: (a, b) => a.role.localeCompare(b.role),
  },
  {
    title: 'Experience',
    dataIndex: 'experience',
    sorter: (a, b) => a.experience.localeCompare(b.experience),
  },
  {
    title: 'Location',
    dataIndex: 'location',
    sorter: (a, b) => a.location.localeCompare(b.location),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    sorter: (a, b) => a.status.localeCompare(b.status),
    render: (status) => <Tag color={candidateStatusColors[status]}>{status}</Tag>,
  },
  {
    title: 'Submitted Date',
    dataIndex: 'submittedDate',
    sorter: (a, b) => new Date(a.submittedDate) - new Date(b.submittedDate),
  },
];
const { useBreakpoint } = Grid;

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

function DetailItem({ label, children }) {
  return (
    <Space direction="vertical" size={2}>
      <Text type="secondary">{label}</Text>
      <Text>{children || '-'}</Text>
    </Space>
  );
}

function buildActivity(record) {
  return [
    {
      color: 'blue',
      status: 'Created',
      tagColor: 'blue',
      text: `${record.name} profile was created on ${record.date}.`,
    },
    {
      color: 'green',
      status: 'Assigned',
      tagColor: 'green',
      text: `Assigned to ${record.assignedTo} for ownership and follow-up.`,
    },
    {
      color: 'orange',
      status: 'Updated',
      tagColor: 'orange',
      text: `Profile status is ${record.status} and was last updated on ${record.lastUpdated}.`,
    },
  ];
}

export default function VenkateshDetailViewPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const screens = useBreakpoint();
  const [activeTab, setActiveTab] = useState('details');
  const record = PERSONALITIES.find((item) => item.key === String(id));
  const isMobile = !screens.md;

  if (!record) {
    return (
      <div className="dashboard-wrapper">
        <Card>
          <Empty description="Personality record not found">
            <Button type="primary" icon={<ArrowLeftOutlined />} onClick={() => navigate('/Venkatesh')}>
              Back to Venkatesh
            </Button>
          </Empty>
        </Card>
      </div>
    );
  }

  const activityItems = buildActivity(record);
  const completionValue = Number(record.completion.replace('%', ''));

  return (
    <div className="dashboard-wrapper">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              { title: <Text type="secondary" onClick={() => navigate('/Venkatesh')}>Venkatesh</Text> },
              { title: <Text strong>{record.name}</Text> },
            ]}
          />
        </Col>

        <Col span={24}>
          <Card size="small" className="client-details-card">
            <Row justify="space-between" gutter={[16, 16]}>
              <Col xs={24} lg={16}>
                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                  <Text type="secondary">Personality ID #{record.key}</Text>
                  <Space size={8} wrap>
                    <Title level={4} style={{ margin: 0 }}>{record.name}</Title>
                    <Tag color={PERSONALITY_STATUS_COLORS[record.status]}>{record.status}</Tag>
                    <Tag color={record.priority === 'High' ? 'red' : record.priority === 'Medium' ? 'gold' : 'default'}>
                      {record.priority} Priority
                    </Tag>
                  </Space>
                  <Space size={12} wrap>
                    <Text type="secondary"><AuditOutlined /> {record.code}</Text>
                    <Text type="secondary"><UserOutlined /> {record.category}</Text>
                    <Text type="secondary"><InfoCircleOutlined /> {record.role}</Text>
                    <Text type="secondary"><TeamOutlined /> {record.assignedTo}</Text>
                    <Text type="secondary"><CalendarOutlined /> {record.date}</Text>
                  </Space>
                  <Tabs
                    size="small"
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    tabPosition="top"
                    items={[
                      { key: 'details', label: tabLabel('Details', 1) },
                      { key: 'activity', label: tabLabel('Activity', activityItems.length) },
                      { key: 'candidates', label: tabLabel('Candidates', candidateRows.length) },
                    ]}
                  />
                </Space>
              </Col>
              <Col xs={24} lg={8}>
                <Flex
                  wrap
                  gap={8}
                  justify={isMobile ? 'flex-start' : 'flex-end'}
                >
                  <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/Venkatesh')}>
                    Back
                  </Button>
                  <Button type="primary" icon={<EditOutlined />}>
                    Edit
                  </Button>
                </Flex>
              </Col>
            </Row>
          </Card>

        </Col>


        {activeTab === 'candidates' ? (
          <Col span={24}>
            <SectionCard title="Candidates" icon={<TeamOutlined />}>
            <div className="antd">
              <Table
                className="job-list-table"
                columns={candidateColumns}
                dataSource={candidateRows}
                pagination={false}
                showSorterTooltip={false}
                tableLayout="fixed"
                scroll={{ x: '100%' }}
              />
              </div> 
            </SectionCard>
          </Col>
        ) : activeTab === 'activity' ? (
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
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <SectionCard title="Personality Details" icon={<UserOutlined />}>
                  <Row gutter={[24, 18]}>
                    <Col xs={24} sm={12} xl={8}>
                      <DetailItem label="Personality ID">{record.code}</DetailItem>
                    </Col>
                    <Col xs={24} sm={12} xl={8}>
                      <DetailItem label="Personality Name">{record.name}</DetailItem>
                    </Col>
                    <Col xs={24} sm={12} xl={8}>
                      <DetailItem label="Category">{record.category}</DetailItem>
                    </Col>
                    <Col xs={24} sm={12} xl={8}>
                      <DetailItem label="Role">{record.role}</DetailItem>
                    </Col>
                    <Col xs={24} sm={12} xl={8}>
                      <DetailItem label="Status">
                        <Tag color={PERSONALITY_STATUS_COLORS[record.status]}>{record.status}</Tag>
                      </DetailItem>
                    </Col>
                    <Col xs={24} sm={12} xl={8}>
                      <DetailItem label="Priority">{record.priority}</DetailItem>
                    </Col>
                    <Col xs={24} sm={12} xl={8}>
                      <DetailItem label="Assigned To">{record.assignedTo}</DetailItem>
                    </Col>
                    <Col xs={24} sm={12} xl={8}>
                      <DetailItem label="Date of Birth">{record.dob}</DetailItem>
                    </Col>
                    <Col xs={24} sm={12} xl={8}>
                      <DetailItem label="Department">{record.department}</DetailItem>
                    </Col>
                    <Col xs={24} sm={12} xl={8}>
                      <DetailItem label="Completion">{record.completion}</DetailItem>
                    </Col>
                  </Row>
                </SectionCard>

                <SectionCard title="Contact Details" icon={<MailOutlined />}>
                  <Row gutter={[24, 18]}>
                    <Col xs={24} sm={12}>
                      <DetailItem label="Email">
                        <Space wrap>
                          <MailOutlined />
                          <Text>{record.email}</Text>
                        </Space>
                      </DetailItem>
                    </Col>
                    <Col xs={24} sm={12}>
                      <DetailItem label="Phone">
                        <Space wrap>
                          <PhoneOutlined />
                          <Text>{record.phone}</Text>
                        </Space>
                      </DetailItem>
                    </Col>
                    <Col xs={24} sm={12}>
                      <DetailItem label="Location">
                        <Space wrap>
                          <EnvironmentOutlined />
                          <Text>{record.location}</Text>
                        </Space>
                      </DetailItem>
                    </Col>
                    <Col xs={24} sm={12}>
                      <DetailItem label="Created Date">{record.date}</DetailItem>
                    </Col>
                    <Col xs={24} sm={12}>
                      <DetailItem label="Last Updated">{record.lastUpdated}</DetailItem>
                    </Col>
                  </Row>
                </SectionCard>

                <SectionCard title="Description" icon={<FileTextOutlined />}>
                  <Paragraph>{record.description}</Paragraph>
                </SectionCard>

                <SectionCard title="Tags" icon={<InfoCircleOutlined />}>
                  <Space wrap>
                    {record.tags.map((tag) => (
                      <Tag color="blue" key={tag}>{tag}</Tag>
                    ))}
                  </Space>
                </SectionCard>
              </Space>
            </Col>

            <Col xs={24} lg={9}>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <SectionCard title="Summary" icon={<InfoCircleOutlined />}>
                  <Space direction="vertical" size={10}>
                    <Text type="secondary">Current Status</Text>
                    <Tag color={PERSONALITY_STATUS_COLORS[record.status]}>{record.status}</Tag>
                    <Divider />
                    <Text type="secondary">Completion</Text>
                    <Progress percent={completionValue} />
                    <Divider />
                    <Text type="secondary">Owner</Text>
                    <Text>{record.assignedTo}</Text>
                    <Divider />
                    <Text type="secondary">Notes</Text>
                    <Text>{record.notes}</Text>
                  </Space>
                </SectionCard>

                <SectionCard title="Timeline" icon={<CalendarOutlined />}>
                  <Space direction="vertical" size={12}>
                    <DetailItem label="Created">{record.date}</DetailItem>
                    <DetailItem label="Updated">{record.lastUpdated}</DetailItem>
                    <DetailItem label="Assigned To">{record.assignedTo}</DetailItem>
                  </Space>
                </SectionCard>
              </Space>
            </Col>
          </>
        )}
      </Row>
    </div>
  );
}
