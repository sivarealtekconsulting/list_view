import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  Col,
  Collapse,
  Divider,
  Empty,
  Flex,
  Row,
  Segmented,
  Space,
  Statistic,
  Tabs,
  Tag,
  Timeline,
  Typography,
} from 'antd';
import {
  BankOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  MoreOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MOCK_JOBS } from '../data/jobs';
import DynamicListView from '../components/DynamicListView';
import ParamListView from '../components/ParamListView';
import StatusBadge from '../components/StatusBadge';
import StickyNotesCard from '../components/cards/StickyNotesCard';
import '../styles/OnboardingCard.css';

const { Text, Title, Link, Paragraph } = Typography;

const defaultDescription = [
  'Bill Rate: 60 - 80',
  'MSP Owner: William Bristol',
  'Location: ~LOUISVILLE~',
  'Duration: 6 months',
  'GbaMS ReqID: 10428045',
  'Consultant with GenAI',
  'Experience: 8-15 years in AI/ML, 3+ years in GCP and AI/ML',
  'Roles & Responsibilities',
  'Architect and implement AI/ML solutions on GCP using services like Vertex AI, BigQuery, Cloud Storage, Cloud Composer, and Dataflow.',
  'Develop and fine-tune Large Language Models and integrate them into enterprise applications.',
  'Build Generative AI pipelines using LangChain, Semantic Kernel, and Vector Databases for Retrieval-Augmented Generation.',
  'Collaborate with cross-functional teams to identify and prioritize GenAI use cases.',
  'Ensure compliance with Responsible AI principles and security standards.',
  'Optimize performance and scalability of AI models in production environments.',
  'Mentor junior engineers and contribute to best practices in AI engineering.',
  'Required Skills',
  'Strong proficiency in GCP services: Vertex AI, BigQuery, Cloud Spanner, Cloud Functions, Pub/Sub.',
  'Expertise in Python, Java, and AI/ML frameworks.',
  'Hands-on experience with Prompt Engineering, Zero-shot, Few-shot, Chain-of-Thought.',
  'Knowledge of LangChain, Azure/OpenAI APIs, and Vector DBs.',
  'Familiarity with CI/CD pipelines, Docker, and Kubernetes.',
  'Understanding of Responsible AI, data privacy, and model governance.',
];

const activityItems = [
  {
    color: 'blue',
    status: 'Shortlist',
    tagColor: 'blue',
    time: '07:39 PM',
    text: 'Move to Pipeline for ZNXTJOB24011527 lead by admin_realtek',
  },
  {
    color: 'blue',
    status: 'Shortlist',
    tagColor: 'blue',
    time: '07:39 PM',
    text: 'Move to Pipeline for ZNXTJOB24011525 Product Architect by admin_realtek',
  },
  {
    color: 'green',
    status: 'Submitted',
    tagColor: 'green',
    time: '04:17 PM',
    text: 'Candidate has been submitted to Job ID ZNXTJOB240011525',
  },
  {
    color: 'red',
    status: 'Rejected',
    tagColor: 'red',
    time: '07:39 PM',
    text: 'candidate submission status has been changed to re-submission for Job ID - ZNXTJOB2620532',
  },
];

const candidateFields = [
  { label: 'Candidate Name', value: 'candidateName' },
  { label: 'Designation', value: 'designation' },
  { label: 'Current Location', value: 'currentLocation' },
  { label: 'Experience', value: 'experience' },
  { label: 'Work Authorization', value: 'workAuthorization' },
  { label: 'Submission Status', value: 'submissionStatus' },
  { label: 'Submitted Date', value: 'submittedDate' },
];

const candidateRows = [
  {
    id: 1,
    candidateName: 'Jayaprakash A',
    designation: 'DevOps Engineer',
    currentLocation: 'San Jose, CA',
    experience: '6 years',
    workAuthorization: 'H1B',
    submissionStatus: 'Submitted',
    submittedDate: 'Mar 23, 2026',
  },
  {
    id: 2,
    candidateName: 'Kiran Kumar',
    designation: 'Software Developer',
    currentLocation: 'Texas',
    experience: '5 years',
    workAuthorization: 'GC EAD',
    submissionStatus: 'Pipeline',
    submittedDate: 'Mar 20, 2026',
  },
  {
    id: 3,
    candidateName: 'Sano S',
    designation: 'Java Developer',
    currentLocation: 'Chennai',
    experience: '7 years',
    workAuthorization: 'L2 EAD',
    submissionStatus: 'Shortlisted',
    submittedDate: 'Mar 18, 2026',
  },
];

function DetailField({ label, value }) {
  return (
    <Space direction="vertical" size={2}>
      <Text type="secondary">{label}</Text>
      <Text>{value || '-'}</Text>
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

function tabLabel(label, count) {
  return (
    <Space size={6}>
      <span>{label}</span>
      <Badge count={count} overflowCount={9999} />
    </Space>
  );
}

export default function JobDetailPage() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const job = MOCK_JOBS.find((item) => String(item.id) === String(jobId)) ?? MOCK_JOBS[0];
  const [activeDetailTab, setActiveDetailTab] = useState('details');
  const [activeActivityTab, setActiveActivityTab] = useState('activity');
  const [descExpanded, setDescExpanded] = useState(false);

  return (
    <div className="dashboard-wrapper">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                title: (
                  <Text style={{ color: '#586888', cursor: 'pointer' }} onClick={() => navigate('/')}>
                    Home
                  </Text>
                ),
              },
              {
                title: (
                  <Text style={{ color: '#586888', cursor: 'pointer' }} onClick={() => navigate('/')}>
                    Jobs
                  </Text>
                ),
              },
              {
                title: <Text style={{ color: '#0053A5' }} strong>Detailed View</Text>,
              },
            ]}
          />

        </Col>

        <Col span={24}>
          <Card size="small" className="client-details-card">
            <Row justify="space-between" gutter={[16, 16]}>
              <Col xs={24} lg={16}>
                <Space direction="vertical" size={5}>
                  <Text type="secondary">TCS - MSP ID 10432419</Text>
                  <Space size={8} wrap>
                    <Title level={4}>{job.title} - 38975</Title>
                    <StatusBadge status={job.status} />
                  </Space>
                  <Space size={12} wrap>
                    <Text type="secondary"><EnvironmentOutlined /> {job.location}</Text>
                    <Text type="secondary"><ClockCircleOutlined /> {job.experience}</Text>
                    <Text type="secondary"><BankOutlined /> {job.employmentType}</Text>
                    <Text type="secondary">{job.locationType}</Text>
                    <Text type="secondary"><DollarOutlined /> Client rate: ${job.clientRate}/hr</Text>
                  </Space>
                </Space>
              </Col>
              <Col xs={24} lg={8}>
                <Space direction="vertical" size={6} style={{ width: '100%' }}>
                  <div className="onboarding-item blue" style={{ flexDirection: 'row', alignItems: 'center', gap: 0 }}>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <Text className="onboarding-item-label">Target Submissions</Text>
                      <Statistic value={job.targetSub?.total ?? '-'} className="onboarding-stat" />
                    </div>
                    <div style={{ width: 1, background: 'rgba(0,0,0,0.08)', alignSelf: 'stretch', margin: '0 12px' }} />
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <Text className="onboarding-item-label">In Pipeline</Text>
                      <Statistic value={job.pipeline ?? '-'} className="onboarding-stat" />
                    </div>
                  </div>
                  <DetailField label="Created On" value="Nov 03, 2025 | 07:00PM" />
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <div className="antd">
            <Card>
              <Flex align="center" justify="space-between" gap={12} wrap>
                <Tabs
                  activeKey={activeDetailTab}
                  onChange={setActiveDetailTab}
                  items={[
                    { key: 'details', label: tabLabel('Details', 0) },
                    { key: 'candidates-api', label: tabLabel('Candidates API', 0) },
                    { key: 'candidate', label: tabLabel('Candidate', candidateRows.length) },
                  ]}
                />
                <Flex align="center" gap={8}>
                  <Button type="primary" className="job-summary-button" icon={<TeamOutlined />}>
                    Source Candidates
                  </Button>
                  <Button className="job-toolbar-icon-button" icon={<MoreOutlined />} />
                </Flex>
              </Flex>
            </Card>
          </div>
        </Col>

        {activeDetailTab === 'candidates-api' ? (
          <Col span={24}>
            <DynamicListView moduleName="candidates" />
          </Col>
        ) : activeDetailTab === 'candidate' ? (
          <Col span={24}>
            <ParamListView
              listName="candidate"
              fields={candidateFields}
              dataSource={candidateRows}
            />
          </Col>
        ) : (
          <>
            <Col xs={24} lg={17}>
              <Space direction="vertical" size={12}>
                <SectionCard title="Client" icon={<FileSearchOutlined />}>
                  <Row gutter={[32, 16]}>
                    <Col xs={24} md={8}><DetailField label="Contact Person" value="Subha Seline" /></Col>
                    <Col xs={24} md={8}><DetailField label="Email" value={<Link>seline@gmail.com</Link>} /></Col>
                    <Col xs={24} md={8}><DetailField label="Phone Number" value={<Link>+91 (999) 469 - 4028</Link>} /></Col>
                  </Row>
                </SectionCard>

                <SectionCard title="Skills & Competencies" icon={<InfoCircleOutlined />}>
                  <Space direction="vertical" size={12}>
                    <DetailField
                      label="Primary Skills"
                      value={(
                        <Space size={[6, 6]} wrap>
                          {['Salesforce', 'Administration', 'Process Builder', 'Flows', 'User training'].map((skill) => (
                            <Tag key={skill} color="blue">{skill}</Tag>
                          ))}
                        </Space>
                      )}
                    />
                    <DetailField label="Secondary Skills" value="-" />
                    <DetailField label="Competencies" value="-" />
                  </Space>
                </SectionCard>

                <SectionCard title="Description" icon={<FileTextOutlined />}>
                  <Space direction="vertical">
                    {(descExpanded ? defaultDescription : defaultDescription.slice(0, 10)).map((line) => (
                      <Paragraph key={line}>{line}</Paragraph>
                    ))}
                  </Space>
                  {defaultDescription.length > 10 && (
                    <Link onClick={() => setDescExpanded((prev) => !prev)}>
                      {descExpanded ? 'Show less' : 'Show more'}
                    </Link>
                  )}
                </SectionCard>

                <SectionCard title="Additional Details" icon={<InfoCircleOutlined />}>
                  <Row gutter={[32, 16]}>
                    <Col xs={24} md={6}><DetailField label="Notice Period" value="-" /></Col>
                    <Col xs={24} md={10}><DetailField label="Business Unit" value="Realtek Consulting LLC" /></Col>
                  </Row>
                </SectionCard>
              </Space>
            </Col>

            <Col xs={24} lg={7}>
              <Card size="small" className="client-details-card">
                <Space direction="vertical" style={{ width: '100%' }} size={12}>
                  <Segmented
                    block
                    options={[
                      { label: tabLabel('Activity', 2), value: 'activity' },
                      { label: tabLabel('Notes', 0),    value: 'notes'    },
                    ]}
                    value={activeActivityTab}
                    onChange={setActiveActivityTab}
                  />
                  {activeActivityTab === 'activity' ? (
                    <Collapse
                      accordion
                      defaultActiveKey={['mar-23']}
                      items={[
                        {
                          key: 'mar-23',
                          label: (
                            <Space size={6}>
                              <Text strong>Mar 23, 2026</Text>
                              <Badge count={2} />
                            </Space>
                          ),
                          children: (
                            <Timeline
                              items={activityItems.slice(0, 2).map((item) => ({
                                color: item.color,
                                children: (
                                  <Card size="small">
                                    <Space direction="vertical" size={4}>
                                      <Space>
                                        <Tag color={item.tagColor}>{item.status}</Tag>
                                        <Text type="secondary">{item.time}</Text>
                                      </Space>
                                      <Text type="secondary">{item.text}</Text>
                                    </Space>
                                  </Card>
                                ),
                              }))}
                            />
                          ),
                        },
                        {
                          key: 'mar-20',
                          label: (
                            <Space size={6}>
                              <Text strong>Mar 20, 2026</Text>
                              <Badge count={2} />
                            </Space>
                          ),
                          children: (
                            <Timeline
                              items={activityItems.slice(2).map((item) => ({
                                color: item.color,
                                children: (
                                  <Card size="small">
                                    <Space direction="vertical" size={4}>
                                      <Space>
                                        <Tag color={item.tagColor}>{item.status}</Tag>
                                        <Text type="secondary">{item.time}</Text>
                                      </Space>
                                      <Text type="secondary">{item.text}</Text>
                                    </Space>
                                  </Card>
                                ),
                              }))}
                            />
                          ),
                        },
                      ]}
                    />
                  ) : (
                    <Empty description="No data" />
                  )}
                </Space>
              </Card>
            </Col>
          </>
        )}
      </Row>
    </div>
  );
}
