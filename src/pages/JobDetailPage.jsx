import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  ClockCircleOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  MoreOutlined,
  ProfileOutlined,
  SearchOutlined,
  SolutionOutlined,
  TagsOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Empty,
  Flex,
  Row,
  Space,
  Statistic,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import StatusBadge from '../components/StatusBadge';
import { MOCK_JOBS } from '../data/jobs';
import '../styles/JobDetailPage.css';

const { Text, Title } = Typography;

const primarySkills = ['Salesforce', 'Administration', 'Process Builder', 'Flows', 'User training'];

const activityItems = [
  {
    date: 'Today - Dec 01, 2025',
    title: 'Onsite interview scheduled',
    description: '09:15 AM - Job Moved to Partially Fulfilled - by Sony Sandya Sebastian',
  },
  {
    date: 'Yesterday - Nov 30, 2025',
    title: 'Onsite interview scheduled',
    description: '1:28 AM - ZNXTCAN121100 - Balamunireddy Lingala has been internally submitted by Ashok Chahar - by Sony Sandya Sebastian',
  },
];

const responsibilities = [
  'Architect and implement AI/ML solutions on GCP using services like Vertex AI, BigQuery, Cloud Storage, Cloud Composer, and Dataflow.',
  'Develop and fine-tune Large Language Models and integrate them into enterprise applications.',
  'Build Generative AI pipelines using frameworks such as LangChain, Semantic Kernel, and Vector Databases for Retrieval-Augmented Generation.',
  'Collaborate with cross-functional teams to identify and prioritize GenAI use cases.',
  'Ensure compliance with Responsible AI principles and security standards.',
  'Optimize performance and scalability of AI models in production environments.',
];

const requiredSkills = [
  'Strong proficiency in GCP services: Vertex AI, BigQuery, Cloud Spanner, Cloud Functions, Pub/Sub.',
  'Expertise in Python, Java, and AI/ML frameworks.',
  'Hands-on experience with Prompt Engineering.',
  'Knowledge of LangChain, Azure/OpenAI APIs, and Vector DBs.',
  'Understanding of Responsible AI, data privacy, and model governance.',
];

function SectionCard({ icon, title, children, className = '' }) {
  return (
    <Card
      className={`detail-card ${className}`}
      title={(
        <Space size={8}>
          {icon}
          <span>{title}</span>
        </Space>
      )}
    >
      {children}
    </Card>
  );
}

function DetailField({ label, value, href }) {
  return (
    <Flex vertical gap={4} className="detail-field">
      <Text type="secondary">{label}</Text>
      {href ? <a href={href}>{value}</a> : <Text strong>{value}</Text>}
    </Flex>
  );
}

export default function JobDetailPage() {
  const { jobId } = useParams();
  const job = MOCK_JOBS.find((item) => String(item.id) === jobId);

  if (!job) {
    return (
      <Flex vertical align="center" justify="center" gap={16} className="detail-empty">
        <Empty description="Job not found" />
        <RouterLink to="/">Back to jobs</RouterLink>
      </Flex>
    );
  }

  const clientCode = job.client?.replace(' - ', ' - MSP ID ') || 'TCS - MSP ID 104322419';

  return (
    <main className="detail-page">
      <Breadcrumb
        className="detail-breadcrumb"
        items={[
          { title: <RouterLink to="/">Home</RouterLink> },
          { title: <RouterLink to="/">Jobs</RouterLink> },
          { title: 'Detailed View' },
        ]}
      />

      <Card className="detail-card detail-hero-card">
        <Row gutter={[24, 18]} align="middle">
          <Col xs={24} lg={17}>
            <Flex vertical gap={8}>
              <Text type="secondary" className="detail-client-code">{clientCode}</Text>
              <Flex align="center" gap={12} wrap="wrap">
                <Title level={2} className="detail-title">{job.title}</Title>
                <StatusBadge status={job.status} />
              </Flex>
              <Space size={[18, 8]} wrap className="detail-meta">
                <span><EnvironmentOutlined /> {job.location}</span>
                <span><ClockCircleOutlined /> {job.experience}</span>
                <span><SolutionOutlined /> {job.employmentType} - {job.locationType}</span>
                <span><DollarOutlined /> Client rate: ${job.clientRate}/hr</span>
              </Space>
              <Tabs
                className="detail-tabs"
                activeKey="details"
                items={[
                  { key: 'details', label: <span><ProfileOutlined /> Details</span> },
                  { key: 'candidates', label: <span><UserOutlined /> Candidates</span> },
                ]}
              />
            </Flex>
          </Col>

          <Col xs={24} lg={7}>
            <Flex vertical gap={18} align="flex-end" className="detail-summary">
              <Space>
                <Button type="primary" icon={<SearchOutlined />}>Source Candidates</Button>
                <Button icon={<MoreOutlined />} />
              </Space>
              <Row gutter={22} className="detail-stat-row">
                <Col>
                  <Statistic title="Target submissions" value={job.targetSub?.total ?? 0} />
                </Col>
                <Col>
                  <Statistic title="In pipeline" value={job.pipeline} />
                </Col>
              </Row>
              <Text type="secondary">Created on {job.createdAt} | 07:00PM</Text>
            </Flex>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]} align="stretch">
        <Col xs={24} xl={15}>
          <Flex vertical gap={16}>
            <SectionCard icon={<SolutionOutlined />} title="Client">
              <Row gutter={[32, 16]}>
                <Col xs={24} md={8}>
                  <DetailField label="Contact Person" value="Jayaprakash A" />
                </Col>
                <Col xs={24} md={8}>
                  <DetailField label="Email" value="jayaprakash123@gmail.com" href="mailto:jayaprakash123@gmail.com" />
                </Col>
                <Col xs={24} md={8}>
                  <DetailField label="Phone Number" value="+91 (999) 469 - 4028" href="tel:+919994694028" />
                </Col>
              </Row>
            </SectionCard>

            <SectionCard icon={<TagsOutlined />} title="Skills & Competencies">
              <Flex vertical gap={16}>
                <Flex vertical gap={8}>
                  <Text type="secondary">Primary Skills</Text>
                  <Space size={[8, 8]} wrap>
                    {primarySkills.map((skill) => (
                      <Tag className="detail-skill-tag" key={skill}>{skill}</Tag>
                    ))}
                  </Space>
                </Flex>
                <DetailField label="Secondary Skills" value="-" />
                <DetailField label="Competencies" value="-" />
              </Flex>
            </SectionCard>

            <SectionCard icon={<FileTextOutlined />} title="Description" className="detail-description">
              <p>Bill Rate: 60 - 80</p>
              <p>MSP Owner: William Bristol</p>
              <p>Location: ~{job.location.toUpperCase()}~</p>
              <p>Duration: 6 months</p>
              <p>GBaMS ReqID: 10428045</p>
              <p>Consultant with GenAI</p>
              <p>Experience: 8-15 years in AI/ML, 3+ years in GCP and AI/ML</p>
              <p>Roles & Responsibilities</p>
              <ul>{responsibilities.map((item) => <li key={item}>{item}</li>)}</ul>
              <p>Required Skills</p>
              <ul>{requiredSkills.map((item) => <li key={item}>{item}</li>)}</ul>
            </SectionCard>

            <SectionCard icon={<InfoCircleOutlined />} title="Additional Details">
              <Row gutter={[32, 16]}>
                <Col xs={24} md={6}>
                  <DetailField label="Notice Period" value="-" />
                </Col>
                <Col xs={24} md={10}>
                  <DetailField label="Business Unit" value="Realtek Consulting LLC" />
                </Col>
              </Row>
            </SectionCard>
          </Flex>
        </Col>

        <Col xs={24} xl={9}>
          <Card className="detail-card detail-activity-card">
            <Tabs
              activeKey="activity"
              items={[
                {
                  key: 'activity',
                  label: <span><ClockCircleOutlined /> Activity(02)</span>,
                  children: (
                    <Flex vertical gap={18} className="detail-timeline">
                      {activityItems.map((item) => (
                        <article key={item.description}>
                          <Text type="secondary">{item.date}</Text>
                          <Title level={5}>{item.title}</Title>
                          <p>{item.description}</p>
                        </article>
                      ))}
                    </Flex>
                  ),
                },
                {
                  key: 'notes',
                  label: <span><FileTextOutlined /> Notes(0)</span>,
                  children: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No notes" />,
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </main>
  );
}
