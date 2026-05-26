import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
  Row,
  Space,
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
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { MOCK_JOBS } from '../data/jobs';
import CandidateListView from '../components/CandidateListView';
import StatusBadge from '../components/StatusBadge';

const { Text, Title, Link, Paragraph } = Typography;

const pageStyle = {
  width: 1174,
  maxWidth: 'calc(100vw - 90px)',
  margin: '58px auto 0',
  paddingBottom: 32,
};

const cardStyle = {
  border: '1px solid #f5f8fb',
  borderRadius: 4,
  boxShadow: 'none',
};

const compactCardBody = {
  padding: 16,
};

const defaultDescription = [
  'Bill Rate: 60 - 80',
  'MSP Owner: William Bristol',
  'Location: ~LOUISVILLE~',
  'Duration: 6 months',
  'GbaMS ReqID: 10428045',
  'Consultant with GenAI',
  'Experience: 8-15 years in AI/ML, 3+ years in GCP and AI/ML',
  '',
  'Roles & Responsibilities',
  'Architect and implement AI/ML solutions on GCP using services like Vertex AI, BigQuery, Cloud Storage, Cloud Composer, and Dataflow.',
  'Develop and fine-tune Large Language Models and integrate them into enterprise applications.',
  'Build Generative AI pipelines using LangChain, Semantic Kernel, and Vector Databases for Retrieval-Augmented Generation.',
  'Collaborate with cross-functional teams to identify and prioritize GenAI use cases.',
  'Ensure compliance with Responsible AI principles and security standards.',
  'Optimize performance and scalability of AI models in production environments.',
  'Mentor junior engineers and contribute to best practices in AI engineering.',
  '',
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
    color: '#1677ff',
    status: 'Shortlist',
    tagColor: 'blue',
    time: '07:39 PM',
    text: 'Move to Pipeline for ZNXTJOB24011527 lead by admin_realtek',
  },
  {
    color: '#1677ff',
    status: 'Shortlist',
    tagColor: 'blue',
    time: '07:39 PM',
    text: 'Move to Pipeline for ZNXTJOB24011525 Product Architect by admin_realtek',
  },
  {
    color: '#52c41a',
    status: 'Submitted',
    tagColor: 'green',
    time: '04:17 PM',
    text: 'Candidate has been submitted to Job ID ZNXTJOB240011525',
  },
  {
    color: '#ff4d4f',
    status: 'Rejected',
    tagColor: 'red',
    time: '07:39 PM',
    text: 'candidate submission status has been changed to re-submission for Job ID - ZNXTJOB2620532',
  },
];

function DetailField({ label, value }) {
  return (
    <Space direction="vertical" size={2}>
      <Text type="secondary" style={{ fontSize: 12 }}>{label}</Text>
      <Text style={{ fontSize: 13 }}>{value || '-'}</Text>
    </Space>
  );
}

function SectionCard({ title, icon, children }) {
  return (
    <Card
      size="small"
      style={cardStyle}
      bodyStyle={compactCardBody}
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

  return (
    <div style={{ minHeight: '100vh', background: '#f3f8fb', padding: '1px 0 32px' }}>
      <div style={pageStyle}>
        <Breadcrumb
          style={{ marginBottom: 12 }}
          items={[
            { title: <Text type="secondary" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Home</Text> },
            { title: <Text type="secondary" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Jobs</Text> },
            { title: <Text strong style={{ color: '#075c95' }}>Detailed View</Text> },
          ]}
        />

        <Card size="small" style={{ ...cardStyle, marginBottom: 12 }} bodyStyle={compactCardBody}>
          <Row justify="space-between" gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Space direction="vertical" size={5}>
                <Text type="secondary" style={{ fontSize: 12 }}>TCS - MSP ID 10432419</Text>
                <Space size={8} wrap>
                  <Title level={4} style={{ margin: 0, fontSize: 18 }}>{job.title} - 38975</Title>
                  <StatusBadge status={job.status} />
                </Space>
                <Space size={12} wrap>
                  <Text type="secondary"><EnvironmentOutlined /> {job.location}</Text>
                  <Text type="secondary"><ClockCircleOutlined /> {job.experience}</Text>
                  <Text type="secondary"><BankOutlined /> {job.employmentType}</Text>
                  <Text type="secondary">{job.locationType}</Text>
                  <Text type="secondary"><DollarOutlined /> Client rate: ${job.clientRate}/hr</Text>
                </Space>
                <Tabs
                  size="small"
                  activeKey={activeDetailTab}
                  onChange={setActiveDetailTab}
                  items={[
                    { key: 'details', label: tabLabel('Details', 1) },
                    { key: 'candidates', label: tabLabel('Candidates', 0) },
                  ]}
                />
              </Space>
            </Col>
            <Col xs={24} lg={8}>
              <Space direction="vertical" size={8} style={{ width: '100%', alignItems: 'flex-end' }}>
                <Space>
                  <Button type="link" icon={<TeamOutlined />}>Source Candidates</Button>
                  <Button type="text" icon={<MoreOutlined />} />
                </Space>
                <Space size={32}>
                  <DetailField label="Target submissions" value={job.targetSub?.total} />
                  <DetailField label="In pipeline" value={job.pipeline} />
                </Space>
                <Text type="secondary" style={{ fontSize: 12 }}>Created on Nov 03, 2025 | 07:00PM</Text>
              </Space>
            </Col>
          </Row>
        </Card>

        {activeDetailTab === 'candidates' ? (
          <CandidateListView />
        ) : (
          <Row gutter={[12, 12]} align="stretch">
            <Col xs={24} lg={15}>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <SectionCard title="Client" icon={<FileSearchOutlined />}>
                  <Row gutter={[32, 16]}>
                    <Col xs={24} md={8}><DetailField label="Contact Person" value="Jayaprakash A" /></Col>
                    <Col xs={24} md={8}><DetailField label="Email" value={<Link>jayaprakash123@gmail.com</Link>} /></Col>
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
                  <Paragraph style={{ whiteSpace: 'pre-line', marginBottom: 0, color: '#6b7280', fontSize: 13 }}>
                    {defaultDescription.join('\n')}
                  </Paragraph>
                </SectionCard>

                <SectionCard title="Additional Details" icon={<InfoCircleOutlined />}>
                  <Row gutter={[32, 16]}>
                    <Col xs={24} md={6}><DetailField label="Notice Period" value="-" /></Col>
                    <Col xs={24} md={10}><DetailField label="Business Unit" value="Realtek Consulting LLC" /></Col>
                  </Row>
                </SectionCard>
              </Space>
            </Col>

            <Col xs={24} lg={9}>
              <Card size="small" style={{ ...cardStyle, height: '100%' }} bodyStyle={compactCardBody}>
                <Tabs
                  size="small"
                  activeKey={activeActivityTab}
                  onChange={setActiveActivityTab}
                  items={[
                    {
                      key: 'activity',
                      label: tabLabel('Activity', 2),
                      children: (
                        <Space direction="vertical" size={14} style={{ width: '100%' }}>
                          <Title level={5} style={{ margin: 0, fontSize: 15 }}>Mar 23, 2026</Title>
                          <Timeline
                            items={activityItems.slice(0, 2).map((item) => ({
                              color: item.color,
                              children: (
                                <Card size="small" style={cardStyle} bodyStyle={{ padding: 10 }}>
                                  <Space direction="vertical" size={4} style={{ width: '100%' }}>
                                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                      <Tag color={item.tagColor}>{item.status}</Tag>
                                      <Text type="secondary" style={{ fontSize: 11 }}>{item.time}</Text>
                                    </Space>
                                    <Text type="secondary" style={{ fontSize: 12 }}>{item.text}</Text>
                                  </Space>
                                </Card>
                              ),
                            }))}
                          />
                          <Divider style={{ margin: 0 }} />
                          <Title level={5} style={{ margin: 0, fontSize: 15 }}>Mar 20, 2026</Title>
                          <Timeline
                            items={activityItems.slice(2).map((item) => ({
                              color: item.color,
                              children: (
                                <Card size="small" style={cardStyle} bodyStyle={{ padding: 10 }}>
                                  <Space direction="vertical" size={4} style={{ width: '100%' }}>
                                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                      <Tag color={item.tagColor}>{item.status}</Tag>
                                      <Text type="secondary" style={{ fontSize: 11 }}>{item.time}</Text>
                                    </Space>
                                    <Text type="secondary" style={{ fontSize: 12 }}>{item.text}</Text>
                                  </Space>
                                </Card>
                              ),
                            }))}
                          />
                        </Space>
                      ),
                    },
                    { key: 'notes', label: tabLabel('Notes', 0), children: <Text type="secondary">No notes found</Text> },
                  ]}
                />
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
}
