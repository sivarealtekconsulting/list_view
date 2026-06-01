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
  DeleteOutlined,
  EditOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import personalitiesData from '../data/personalities.json';
import venkateshDetailMockData from '../data/venkateshDetailMockData.json';

const { Text, Title, Paragraph } = Typography;
const PERSONALITIES = personalitiesData.personalities;
const PERSONALITY_STATUS_COLORS = personalitiesData.statusColors;
const EMPTY_VALUE = '-';

function displayValue(value) {
  if (value === null || value === undefined) return EMPTY_VALUE;
  if (typeof value === 'string' && value.trim() === '') return EMPTY_VALUE;
  return value;
}

function getTextValue(value) {
  const displayed = displayValue(value);
  return displayed === EMPTY_VALUE ? '' : String(displayed);
}

function DisplayText({ value, type }) {
  return <Text type={type}>{displayValue(value)}</Text>;
}

function IconValue({ icon, value, type = 'secondary' }) {
  if (displayValue(value) === EMPTY_VALUE) {
    return <DisplayText value={value} type={type} />;
  }

  return <Text type={type}>{icon} {displayValue(value)}</Text>;
}

function InlineIconValue({ icon, value }) {
  if (displayValue(value) === EMPTY_VALUE) {
    return EMPTY_VALUE;
  }

  return (
    <Space wrap>
      {icon}
      <DisplayText value={value} />
    </Space>
  );
}

function DataTag({ value, color }) {
  const displayed = displayValue(value);
  return displayed === EMPTY_VALUE ? EMPTY_VALUE : <Tag color={color}>{displayed}</Tag>;
}

const candidateStatusColors = {
  Submitted: 'blue',
  Shortlisted: 'green',
  Pipeline: 'gold',
};

const candidateColumns = [
  {
    title: 'Candidate ID',
    dataIndex: 'candidateId',
    sorter: (a, b) => getTextValue(a.candidateId).localeCompare(getTextValue(b.candidateId)),
    render: (value) => displayValue(value),
  },
  {
    title: 'Candidate Name',
    dataIndex: 'name',
    sorter: (a, b) => getTextValue(a.name).localeCompare(getTextValue(b.name)),
    render: (value) => displayValue(value),
  },
  {
    title: 'Role',
    dataIndex: 'role',
    sorter: (a, b) => getTextValue(a.role).localeCompare(getTextValue(b.role)),
    render: (value) => displayValue(value),
  },
  {
    title: 'Experience',
    dataIndex: 'experience',
    sorter: (a, b) => getTextValue(a.experience).localeCompare(getTextValue(b.experience)),
    render: (value) => displayValue(value),
  },
  {
    title: 'Location',
    dataIndex: 'location',
    sorter: (a, b) => getTextValue(a.location).localeCompare(getTextValue(b.location)),
    render: (value) => displayValue(value),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    sorter: (a, b) => getTextValue(a.status).localeCompare(getTextValue(b.status)),
    render: (status) => <DataTag value={status} color={candidateStatusColors[status]} />,
  },
  {
    title: 'Submitted Date',
    dataIndex: 'submittedDate',
    sorter: (a, b) => new Date(a.submittedDate) - new Date(b.submittedDate),
    render: (value) => displayValue(value),
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

function CompactTimelineContent({ title, children }) {
  return (
    <Space direction="vertical" size={0}>
      <Text strong>{title}</Text>
      <Text type="secondary">{children}</Text>
    </Space>
  );
}

function DetailItem({ label, children }) {
  return (
    <Space direction="vertical" size={2}>
      <Text type="secondary">{label}</Text>
      <Text>{displayValue(children)}</Text>
    </Space>
  );
}

function buildActivity(record) {
  const name = displayValue(record.name);
  const date = displayValue(record.date);
  const assignedTo = displayValue(record.assignedTo);
  const status = displayValue(record.status);
  const lastUpdated = displayValue(record.lastUpdated);

  return [
    {
      color: 'blue',
      status: 'Created',
      tagColor: 'blue',
      text: `${name} profile was created on ${date}.`,
    },
    {
      color: 'green',
      status: 'Assigned',
      tagColor: 'green',
      text: `Assigned to ${assignedTo} for ownership and follow-up.`,
    },
    {
      color: 'orange',
      status: 'Updated',
      tagColor: 'orange',
      text: `Profile status is ${status} and was last updated on ${lastUpdated}.`,
    },
  ];
}

export default function VenkateshDetailViewPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const screens = useBreakpoint();
  const [activeTab, setActiveTab] = useState('details');
  const [candidates, setCandidates] = useState(venkateshDetailMockData.candidateRows);
  const [selectedCandidateKeys, setSelectedCandidateKeys] = useState([]);
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
  const completionValue = Number(String(record.completion || '0%').replace('%', '')) || 0;
  const tags = Array.isArray(record.tags) ? record.tags : [];
  const candidateRowSelection = {
    type: 'checkbox',
    selectedRowKeys: selectedCandidateKeys,
    onChange: setSelectedCandidateKeys,
  };

  const handleDeleteCandidates = () => {
    setCandidates((current) => (
      current.filter((candidate) => !selectedCandidateKeys.includes(candidate.key))
    ));
    setSelectedCandidateKeys([]);
  };

  return (
    <div className="dashboard-wrapper">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              { title: <Text type="secondary" onClick={() => navigate('/Venkatesh')}>Venkatesh</Text> },
              { title: <Text strong>{displayValue(record.name)}</Text> },
            ]}
          />
        </Col>

        <Col span={24}>
          <Card size="small" className="client-details-card">
            <Row justify="space-between" gutter={[16, 16]}>
              <Col xs={24} lg={16}>
                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                  <Text type="secondary">Personality ID #{displayValue(record.key)}</Text>
                  <Space size={8} wrap>
                    <Title level={4} style={{ margin: 0 }}>{displayValue(record.name)}</Title>
                    <DataTag value={record.status} color={PERSONALITY_STATUS_COLORS[record.status]} />
                    {displayValue(record.priority) === EMPTY_VALUE ? (
                      EMPTY_VALUE
                    ) : (
                      <Tag color={record.priority === 'High' ? 'red' : record.priority === 'Medium' ? 'gold' : 'default'}>
                        {record.priority} Priority
                      </Tag>
                    )}
                  </Space>
                  <Space size={12} wrap>
                    <IconValue icon={<AuditOutlined />} value={record.code} />
                    <IconValue icon={<UserOutlined />} value={record.category} />
                    <IconValue icon={<InfoCircleOutlined />} value={record.role} />
                    <IconValue icon={<TeamOutlined />} value={record.assignedTo} />
                    <IconValue icon={<CalendarOutlined />} value={record.date} />
                  </Space>
                  <Tabs
                    size="small"
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    tabPosition="top"
                    items={[
                      { key: 'details', label: tabLabel('Details', 1) },
                      { key: 'activity', label: tabLabel('Activity', activityItems.length) },
                      { key: 'candidates', label: tabLabel('Candidates', candidates.length) },
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
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => navigate(`/Venkatesh-detailview/${record.key}/edit-job`)}
                  >
                    Edit
                  </Button>
                </Flex>
              </Col>
            </Row>
          </Card>

        </Col>


        {activeTab === 'candidates' ? (
          <Col span={24}>
            <Card
              size="small"
              className="client-details-card"
              title={<Space size={6}><TeamOutlined /><Text strong>Candidates</Text></Space>}
              extra={(
                <Space>
                  {selectedCandidateKeys.length > 0 && (
                    <Text type="secondary">Selected ({selectedCandidateKeys.length})</Text>
                  )}
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    disabled={selectedCandidateKeys.length === 0}
                    onClick={handleDeleteCandidates}
                  >
                    Delete
                  </Button>
                </Space>
              )}
            >
              <div className="antd">
                <Table
                  className="job-list-table"
                  rowSelection={candidateRowSelection}
                  columns={candidateColumns}
                  dataSource={candidates}
                  pagination={false}
                  showSorterTooltip={false}
                  tableLayout="fixed"
                  scroll={{ x: '100%' }}
                />
              </div>
            </Card>
          </Col>
        ) : activeTab === 'activity' ? (
          <>
            <Col xs={24} xl={15}>
              <SectionCard title="Activity Feed" icon={<InfoCircleOutlined />}>
                <Timeline
                  mode="left"
                  items={activityItems.map((item) => ({
                    color: item.color,
                    children: (
                      <Space direction="vertical" size={4}>
                        <Space wrap>
                          <Tag color={item.tagColor}>{item.status}</Tag>
                          <Text type="secondary">{displayValue(record.lastUpdated)}</Text>
                        </Space>
                        <Text>{item.text}</Text>
                      </Space>
                    ),
                  }))}
                />
              </SectionCard>
            </Col>

            <Col xs={24} xl={9}>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <SectionCard title="Activity Snapshot" icon={<AuditOutlined />}>
                  <Row gutter={[16, 16]}>
                    <Col xs={12}>
                      <DetailItem label="Events">{activityItems.length}</DetailItem>
                    </Col>
                    <Col xs={12}>
                      <DetailItem label="Latest">{record.lastUpdated}</DetailItem>
                    </Col>
                    <Col xs={12}>
                      <DetailItem label="Owner">{record.assignedTo}</DetailItem>
                    </Col>
                    <Col xs={12}>
                      <DetailItem label="Status">
                        <DataTag value={record.status} color={PERSONALITY_STATUS_COLORS[record.status]} />
                      </DetailItem>
                    </Col>

                    <Col span={24}>
                      <Space direction="vertical" size={6}>
                        <Text type="secondary">Profile completion</Text>
                        <Progress percent={completionValue} size="small" />
                      </Space>
                    </Col>
                  </Row>
                </SectionCard>

                <SectionCard title="Next Step" icon={<CalendarOutlined />}>
                  <Space direction="vertical" size={6}>
                    <Text strong>Review candidate activity</Text>
                    <Text type="secondary">Check candidate submissions before updating this profile.</Text>
                    <Button type="primary" onClick={() => setActiveTab('candidates')}>
                      View Candidates
                    </Button>
                  </Space>
                </SectionCard>
              </Space>
            </Col>
          </>
        ) : (
          <>
            <Col xs={24} lg={15}>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <SectionCard title="Personality Details" icon={<UserOutlined />}>
                  <Row gutter={[24, 18]}>
                    <Col xs={24} sm={12} xl={6}>
                      <DetailItem label="Personality ID">{record.code}</DetailItem>
                    </Col>
                    <Col xs={24} sm={12} xl={6}>
                      <DetailItem label="Personality Name">{record.name}</DetailItem>
                    </Col>
                    <Col xs={24} sm={12} xl={6}>
                      <DetailItem label="Category">{record.category}</DetailItem>
                    </Col>
                    <Col xs={24} sm={12} xl={6}>
                      <DetailItem label="Role">{record.role}</DetailItem>
                    </Col>
                    <Col xs={24} sm={12} xl={6}>
                      <DetailItem label="Status">
                        <DataTag value={record.status} color={PERSONALITY_STATUS_COLORS[record.status]} />
                      </DetailItem>
                    </Col>
                    <Col xs={24} sm={12} xl={6}>
                      <DetailItem label="Priority">
                        <DataTag
                          value={record.priority}
                          color={record.priority === 'High' ? 'red' : record.priority === 'Medium' ? 'gold' : 'default'}
                        />
                      </DetailItem>
                    </Col>
                    <Col xs={24} sm={12} xl={6}>
                      <DetailItem label="Assigned To">{record.assignedTo}</DetailItem>
                    </Col>
                    <Col xs={24} sm={12} xl={6}>
                      <DetailItem label="Date of Birth">{record.dob}</DetailItem>
                    </Col>
                    <Col xs={24} sm={12} xl={6}>
                      <DetailItem label="Department">{record.department}</DetailItem>
                    </Col>
                    <Col xs={24} sm={12} xl={6}>
                      <DetailItem label="Completion">{record.completion}</DetailItem>
                    </Col>
                  </Row>
                </SectionCard>

                <SectionCard title="Contact Details" icon={<MailOutlined />}>
                  <Row gutter={[24, 18]}>
                    <Col xs={24} sm={12} xl={8}>
                      <DetailItem label="Email">
                        <InlineIconValue icon={<MailOutlined />} value={record.email} />
                      </DetailItem>
                    </Col>
                    <Col xs={24} sm={12} xl={8}>
                      <DetailItem label="Phone">
                        <InlineIconValue icon={<PhoneOutlined />} value={record.phone} />
                      </DetailItem>
                    </Col>
                    <Col xs={24} sm={12} xl={8}>
                      <DetailItem label="Location">
                        <InlineIconValue icon={<EnvironmentOutlined />} value={record.location} />
                      </DetailItem>
                    </Col>
                    <Col xs={24} sm={12} xl={8}>
                      <DetailItem label="Created Date">{record.date}</DetailItem>
                    </Col>
                    <Col xs={24} sm={12}>
                      <DetailItem label="Last Updated">{record.lastUpdated}</DetailItem>
                    </Col>
                  </Row>
                </SectionCard>

                <SectionCard title="Description" icon={<FileTextOutlined />}>
                  <Paragraph>{displayValue(record.description)}</Paragraph>
                </SectionCard>

                <SectionCard title="Tags" icon={<InfoCircleOutlined />}>
                  <Space wrap>
                    {tags.length === 0 ? EMPTY_VALUE : tags.map((tag) => (
                      <Tag color="blue" key={tag}>{tag}</Tag>
                    ))}
                  </Space>
                </SectionCard>
              </Space>
            </Col>

            <Col xs={24} lg={9}>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <SectionCard title="Summary" icon={<InfoCircleOutlined />}>
                  <Space direction="vertical" size={12}>
                    <Space wrap>
                      {/* <Col xs={24} sm={24}>
                        <DetailItem label="Status">
                          <Tag color={PERSONALITY_STATUS_COLORS[record.status]}>{record.status}</Tag>
                        </DetailItem>
                      </Col>
                      <Col xs={24} sm={24}>
                        <DetailItem label="Priority">
                          <Tag color={record.priority === 'High' ? 'red' : record.priority === 'Medium' ? 'gold' : 'default'}>
                            {record.priority}
                          </Tag>
                        </DetailItem>
                      </Col> */}
                    </Space>
                    <Paragraph>
                      {displayValue(record.name)} is a {displayValue(record.role)} in the {displayValue(record.department)} department.
                      The profile is currently assigned to {displayValue(record.assignedTo)} and is {displayValue(record.completion)} complete.
                    </Paragraph>
                    <Progress percent={completionValue} size="small" />
                    <Paragraph type="secondary">
                      {displayValue(record.notes)}
                    </Paragraph>
                  </Space>
                </SectionCard>

                <SectionCard title="Timeline" icon={<CalendarOutlined />}>
                  <Timeline
                    mode="left"
                    items={[
                      {
                        color: 'blue',
                        children: (
                          <CompactTimelineContent title="Created">
                            {displayValue(record.date)}
                          </CompactTimelineContent>
                        ),
                      },
                      {
                        color: 'green',
                        children: (
                          <CompactTimelineContent title="Updated">
                            {displayValue(record.lastUpdated)}
                          </CompactTimelineContent>
                        ),
                      },
                      {
                        color: 'orange',
                        children: (
                          <CompactTimelineContent title="Assigned">
                            {displayValue(record.assignedTo)}
                          </CompactTimelineContent>
                        ),
                      },
                    ]}
                  />
                </SectionCard>
              </Space>
            </Col>
          </>
        )}
      </Row>
    </div>
  );
}
