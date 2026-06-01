import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  Col,
  Collapse,
  Empty,
  Flex,
  Row,
  Segmented,
  Space,
  Spin,
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
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getJobById } from '../services/jobsApi';
import DynamicListView from '../components/DynamicListView';
import ParamListView from '../components/ParamListView';
import StatusBadge from '../components/StatusBadge';
import '../styles/SubhaJobDetailPage.css';

const { Text, Title, Link } = Typography;

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
  { label: 'Candidate Name',    value: 'candidateName'     },
  { label: 'Designation',       value: 'designation'       },
  { label: 'Current Location',  value: 'currentLocation'   },
  { label: 'Experience',        value: 'experience'        },
  { label: 'Work Authorization',value: 'workAuthorization' },
  { label: 'Submission Status', value: 'submissionStatus'  },
  { label: 'Submitted Date',    value: 'submittedDate'     },
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
    <div className="jdv-field">
      <Text className="jdv-field-label">{label}</Text>
      <Text className="jdv-field-value">{value || '-'}</Text>
    </div>
  );
}

function SectionCard({ title, icon, children, accentColor = '#0053A5', accentLight = 'rgba(0,83,165,0.08)' }) {
  return (
    <Card
      size="small"
      className="jdv-section-card"
      style={{ '--section-accent': accentColor, '--section-accent-light': accentLight }}
      title={
        <Space size={12}>
          <span className="jdv-section-icon-wrap">{icon}</span>
          <Text strong className="jdv-section-title">{title}</Text>
        </Space>
      }
    >
      {children}
    </Card>
  );
}

// ── Description renderer — reads pre-structured data from DB ──
function DescriptionBlock({ sections = [], meta = [] }) {
  const [expanded, setExpanded] = useState(false);
  const PREVIEW = 2;
  const visible = expanded ? sections : sections.slice(0, PREVIEW);
  const hasMore = sections.length > PREVIEW;

  if (!sections.length && !meta.length) {
    return <Text type="secondary">No description available.</Text>;
  }

  return (
    <div className="jdv-ats-desc">

      {/* Metadata grid — Bill Rate, Location, Duration, etc. */}
      {meta.length > 0 && (
        <div className="jdv-ats-meta-grid">
          {meta.map(({ fieldKey, fieldLabel, value }) => (
            <div key={fieldKey} className="jdv-ats-meta-row">
              <span className="jdv-ats-meta-key">{fieldLabel}</span>
              <span className="jdv-ats-meta-val">{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Content sections — Key Responsibilities, Required Skills, etc. */}
      <div className="jdv-ats-sections">
        {visible.map(({ sectionKey, sectionTitle, renderType, content = [] }) => (
          <div key={sectionKey} className="jdv-ats-section">
            <div className="jdv-ats-section-hd"><span>{sectionTitle}</span></div>

            {renderType === 'chips' ? (
              <Space size={[6, 6]} wrap style={{ marginTop: 8 }}>
                {content.map((item, i) => (
                  <Tag key={i} className="jdv-skill-tag">{item}</Tag>
                ))}
              </Space>
            ) : (
              <ul className="jdv-ats-bullets">
                {content.map((item, i) => (
                  <li key={i} className="jdv-ats-bullet-item">{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {hasMore && (
        <span className="jdv-desc-toggle" onClick={() => setExpanded((p) => !p)}>
          {expanded ? 'Show less' : `Show more (${sections.length - PREVIEW} more sections)`}
        </span>
      )}
    </div>
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

  const [job, setJob]                               = useState(null);
  const [loading, setLoading]                       = useState(true);
  const [activeDetailTab, setActiveDetailTab]       = useState('details');
  const [activeActivityTab, setActiveActivityTab]   = useState('activity');

  useEffect(() => {
    setLoading(true);
    getJobById(jobId)
      .then((data) => setJob(data))
      .catch(() => setJob(null))
      .finally(() => setLoading(false));
  }, [jobId]);

  if (loading) {
    return (
      <div className="dashboard-wrapper jdv" style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="dashboard-wrapper jdv">
        <Empty description="Job not found" />
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper jdv">
      <Row gutter={[16, 16]}>

        {/* ── Breadcrumb ── */}
        <Col span={24}>
          <Breadcrumb
            className="jdv-breadcrumb"
            items={[
              {
                title: (
                  <span className="jdv-breadcrumb-link" onClick={() => navigate('/')}>
                    Home
                  </span>
                ),
              },
              {
                title: (
                  <span className="jdv-breadcrumb-link" onClick={() => navigate('/')}>
                    Jobs
                  </span>
                ),
              },
              {
                title: <span className="jdv-breadcrumb-active">Detailed View</span>,
              },
            ]}
          />
        </Col>

        {/* ── Hero card ── */}
        <Col span={24}>
          <Card size="small" className="jdv-hero-card">
            <Row justify="space-between" align="middle" gutter={[16, 16]}>
              <Col xs={24} lg={16}>
                <Space direction="vertical" size={5}>
                  <span className="jdv-client-code">{job.client}</span>
                  <Space size={8} wrap>
                    <Title level={4} className="jdv-job-title">
                      {job.title}
                    </Title>
                    <StatusBadge status={job.status} />
                  </Space>
                  <Space size={12} wrap>
                    <span className="jdv-meta-item"><EnvironmentOutlined /> {job.location}</span>
                    <span className="jdv-meta-item"><ClockCircleOutlined /> {job.experience}</span>
                    <span className="jdv-meta-item"><BankOutlined /> {job.employmentType}</span>
                    <span className="jdv-meta-item">{job.locationType}</span>
                    <span className="jdv-meta-item"><DollarOutlined /> Client rate: ${job.clientRate}/hr</span>
                  </Space>
                </Space>
              </Col>
              <Col xs={24} lg={8}>
                <Space direction="vertical" size={6} style={{ width: '100%' }}>
                  <div className="jdv-stats-box">
                    <div className="jdv-stat-col">
                      <span className="jdv-stat-label">Target Submissions</span>
                      <Statistic value={job.targetSub?.total ?? '-'} />
                    </div>
                    <div className="jdv-stat-divider" />
                    <div className="jdv-stat-col">
                      <span className="jdv-stat-label">In Pipeline</span>
                      <Statistic value={job.pipeline ?? '-'} />
                    </div>
                  </div>
                  <DetailField label="Created On" value={job.createdAt} />
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* ── Tabs toolbar ── */}
        <Col span={24}>
          <Card className="jdv-toolbar-card">
            <Flex align="center" justify="space-between" gap={12} wrap>
              <Tabs
                activeKey={activeDetailTab}
                onChange={setActiveDetailTab}
                items={[
                  { key: 'details',        label: tabLabel('Details', 0) },
                  { key: 'candidates-api', label: tabLabel('Candidates API', 0) },
                  { key: 'candidate',      label: tabLabel('Candidate', candidateRows.length) },
                ]}
              />
              <Flex align="center" gap={8}>
                <Button type="primary" className="jdv-action-btn" icon={<TeamOutlined />}>
                  Source Candidates
                </Button>
                <Button className="jdv-more-btn" icon={<MoreOutlined />} />
              </Flex>
            </Flex>
          </Card>
        </Col>

        {/* ── Tab content ── */}
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
            {/* ── Left: detail sections ── */}
            <Col xs={24} lg={17}>
              <Space direction="vertical" size={12} style={{ width: '100%', display: 'flex' }}>

                <SectionCard title="Client" icon={<FileSearchOutlined />}>
                  <Row gutter={[32, 16]}>
                    <Col xs={24} md={8}>
                      <DetailField label="Contact Person" value="Subha Seline" />
                    </Col>
                    <Col xs={24} md={8}>
                      <DetailField label="Email" value={<Link>seline@gmail.com</Link>} />
                    </Col>
                    <Col xs={24} md={8}>
                      <DetailField label="Phone Number" value={<Link>+91 (999) 469 - 4028</Link>} />
                    </Col>
                  </Row>
                </SectionCard>

                <SectionCard title="Skills & Competencies" icon={<InfoCircleOutlined />}>
                  <Space direction="vertical" size={12}>
                    <DetailField
                      label="Primary Skills"
                      value={
                        <div className="jdv-skills-group">
                          <Space size={[6, 6]} wrap>
                            {['Salesforce', 'Administration', 'Process Builder', 'Flows', 'User training', 'PHP', 'Python', 'Django', 'Flask', 'FastAPI', 'GO', 'RDBMS', 'Python Selenium', 'Java', 'MongoDB'].map((skill) => (
                              <Tag key={skill} className="jdv-skill-tag">{skill}</Tag>
                            ))}
                          </Space>
                        </div>
                      }
                    />
                    <DetailField label="Secondary Skills" value="-" />
                    <DetailField label="Competencies"     value="-" />
                  </Space>
                </SectionCard>

                {/* Description — rendered directly from DB data, no parsing needed */}
                <SectionCard title="Description" icon={<FileTextOutlined />}>
                  <DescriptionBlock
                    sections={job.descriptionSections}
                    meta={(job.descriptionMeta ?? []).map(item => {
                      switch (item.fieldKey) {
                        case 'location':   return { ...item, value: job.location };
                        case 'experience': return { ...item, value: job.experience };
                        case 'bill_rate':  return { ...item, value: `$${job.clientRate}/hr` };
                        default:           return item;
                      }
                    })}
                  />
                </SectionCard>

                <SectionCard title="Additional Details" icon={<InfoCircleOutlined />}>
                  <Row gutter={[32, 16]}>
                    <Col xs={24} md={6}>
                      <DetailField label="Notice Period"  value="-" />
                    </Col>
                    <Col xs={24} md={10}>
                      <DetailField label="Business Unit" value="Realtek Consulting LLC" />
                    </Col>
                  </Row>
                </SectionCard>

              </Space>
            </Col>

            {/* ── Right: Activity & Notes ── */}
            <Col xs={24} lg={7}>
              <Card size="small" className="jdv-activity-card" style={{ height: '100%' }}>
                <Space direction="vertical" style={{ width: '100%' }} size={12}>

                  <Segmented
                    block
                    className="jdv-activity-switcher"
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
                      className="jdv-date-collapse"
                      defaultActiveKey={['mar-23']}
                      items={[
                        {
                          key: 'mar-23',
                          label: (
                            <Space size={6}>
                              <span className="jdv-date-label">Mar 23, 2026</span>
                              <Badge count={2} />
                            </Space>
                          ),
                          children: (
                            <Timeline
                              items={activityItems.slice(0, 2).map((item) => ({
                                color: item.color,
                                children: (
                                  <Card size="small" className="jdv-timeline-card">
                                    <Space direction="vertical" size={4}>
                                      <Space>
                                        <Tag color={item.tagColor} className="jdv-activity-tag">
                                          {item.status}
                                        </Tag>
                                        <span className="jdv-activity-time">{item.time}</span>
                                      </Space>
                                      <span className="jdv-activity-text">{item.text}</span>
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
                              <span className="jdv-date-label">Mar 20, 2026</span>
                              <Badge count={2} />
                            </Space>
                          ),
                          children: (
                            <Timeline
                              items={activityItems.slice(2).map((item) => ({
                                color: item.color,
                                children: (
                                  <Card size="small" className="jdv-timeline-card">
                                    <Space direction="vertical" size={4}>
                                      <Space>
                                        <Tag color={item.tagColor} className="jdv-activity-tag">
                                          {item.status}
                                        </Tag>
                                        <span className="jdv-activity-time">{item.time}</span>
                                      </Space>
                                      <span className="jdv-activity-text">{item.text}</span>
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
