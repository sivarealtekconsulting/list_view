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
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  MoreOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { MOCK_JOBS } from '../data/jobs';
import DynamicListView from '../components/DynamicListView';
import ParamListView from '../components/ParamListView';
import StatusBadge from '../components/StatusBadge';


const { Text, Title, Link, Paragraph } = Typography;

const skillStack = [
  'React JS',
  'JavaScript',
  'REST API',
  'Ant Design',
  'Frontend Architecture',
  'Performance Optimization',
];

const goodFitSignals = [
  'Strong frontend implementation experience',
  'Good understanding of reusable component structure',
  'Comfortable with dashboard and table-heavy UI',
  'Good exposure to validated forms and routing',
];

const defaultDescription = [
  'This requirement needs a candidate who can build clean, scalable and reusable frontend modules.',
  'The role focuses on dashboard layouts, list views, form validation, detail pages and component-based UI.',
  'Candidate should be comfortable working with Ant Design, React hooks, routing, table actions and responsive layouts.',
  'Priority should be given to profiles with hands-on experience in recruitment, CRM, ATS, LMS or dashboard-based products.',
];

const activityItems = [
  {
    color: 'blue',
    status: 'Skill Reviewed',
    tagColor: 'blue',
    time: '07:39 PM',
    text: 'Primary skills reviewed and mapped against frontend dashboard requirement.',
  },
  {
    color: 'green',
    status: 'Strong Match',
    tagColor: 'green',
    time: '06:20 PM',
    text: 'Candidate profile marked as strong match for React and Ant Design implementation.',
  },
  {
    color: 'blue',
    status: 'Shortlisted',
    tagColor: 'blue',
    time: '04:17 PM',
    text: 'Candidate moved to shortlist after skill and experience validation.',
  },
  {
    color: 'orange',
    status: 'Needs Review',
    tagColor: 'orange',
    time: '02:45 PM',
    text: 'Resume needs one more review for API integration and dashboard experience.',
  },
];

const candidateFields = [
  { label: 'Candidate Name', value: 'candidateName' },
  { label: 'Primary Skill', value: 'primarySkill' },
  { label: 'Match Level', value: 'matchLevel' },
  { label: 'Experience', value: 'experience' },
  { label: 'Work Authorization', value: 'workAuthorization' },
  { label: 'Submission Status', value: 'submissionStatus' },
  { label: 'Submitted Date', value: 'submittedDate' },
];

const candidateRows = [
  {
    id: 1,
    candidateName: 'Jayaprakash A',
    primarySkill: 'React JS',
    matchLevel: 'Excellent Match',
    experience: '6 years',
    workAuthorization: 'H1B',
    submissionStatus: 'Ready to Submit',
    submittedDate: 'Mar 23, 2026',
  },
  {
    id: 2,
    candidateName: 'Kiran Kumar',
    primarySkill: 'Frontend Architecture',
    matchLevel: 'Good Match',
    experience: '5 years',
    workAuthorization: 'GC EAD',
    submissionStatus: 'Pipeline',
    submittedDate: 'Mar 20, 2026',
  },
  {
    id: 3,
    candidateName: 'Sano S',
    primarySkill: 'JavaScript',
    matchLevel: 'Needs Review',
    experience: '7 years',
    workAuthorization: 'L2 EAD',
    submissionStatus: 'Skill Review',
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

export default function GnaneshDetailedView() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const job = MOCK_JOBS.find((item) => String(item.id) === String(jobId)) ?? MOCK_JOBS[0];

  const [activeDetailTab, setActiveDetailTab] = useState('details');
  const [activeActivityTab, setActiveActivityTab] = useState('activity');

  return (
    <div className="dashboard-wrapper">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                title: (
                  <Text type="secondary" onClick={() => navigate('/gnanesh-dashboard')}>
                    Gnanesh Dashboard
                  </Text>
                ),
              },
              {
                title: (
                  <Text strong>
                    {job.title}
                  </Text>
                ),
              },
            ]}
          />
        </Col>

        <Col span={24}>
          <Card size="small" className="client-details-card">
            <Row justify="space-between" gutter={[16, 16]}>
              <Col xs={24} lg={15}>
                <Space direction="vertical" size={6}>
                  <Text type="secondary">TCS - MSP ID 10432419</Text>

                  <Space size={8} wrap>
                    <Title level={4}>{job.title} - </Title>
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
                      { key: 'details', label: tabLabel('Skill Insights', 1) },
                      { key: 'candidates-api', label: tabLabel('Candidates API', 0) },
                      { key: 'candidate', label: tabLabel('Matched Candidates', candidateRows.length) },
                    ]}
                  />
                </Space>
              </Col>

              <Col xs={24} lg={9}>
                <Card size="small" className="client-details-card">
                  <Space direction="vertical" size={12}>
                    <Space>
                      <UsergroupAddOutlined />
                      <Text strong>Source Candidate Control</Text>
                    </Space>

                    <Space wrap>
                      <Button type="primary" icon={<TeamOutlined />}>
                        Source Candidates
                      </Button>
                      <Button icon={<SafetyCertificateOutlined />}>
                        View Matched Profiles
                      </Button>
                      <Button type="text" icon={<MoreOutlined />} />
                    </Space>

                    <Row gutter={[16, 16]}>
                      <Col span={8}><DetailField label="Ready" value="12" /></Col>
                      <Col span={8}><DetailField label="Strong Match" value="4" /></Col>
                      <Col span={8}><DetailField label="Review" value="0" /></Col>
                      
                    </Row>

                    <Text type="secondary">Created on Nov 03, 2025 | 07:00PM</Text>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>

        {activeDetailTab === 'candidates-api' ? (
          <Col span={24}>
            <DynamicListView moduleName="candidates" />
          </Col>
        ) : activeDetailTab === 'candidate' ? (
          <>
            <Col span={24}>
              <SectionCard title="Matched Candidate Summary" icon={<TeamOutlined />}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={6}>
                    <DetailField label="Total Matches" value={candidateRows.length} />
                  </Col>
                  <Col xs={24} md={6}>
                    <DetailField label="Excellent Match" value="1" />
                  </Col>
                  <Col xs={24} md={6}>
                    <DetailField label="Good Match" value="1" />
                  </Col>
                  <Col xs={24} md={6}>
                    <DetailField label="Needs Review" value="1" />
                  </Col>
                </Row>
              </SectionCard>
            </Col>

            <Col xs={24} lg={14}>
              <SectionCard title="Skill Coverage" icon={<SafetyCertificateOutlined />}>
                <Space size={[6, 6]} wrap>
                  {['React JS', 'Frontend Architecture', 'JavaScript', 'REST API'].map((skill) => (
                    <Tag key={skill} color="blue">{skill}</Tag>
                  ))}
                </Space>
              </SectionCard>
            </Col>

            <Col xs={24} lg={10}>
              <SectionCard title="Submission Focus" icon={<ThunderboltOutlined />}>
                <Space direction="vertical" size={6}>
                  <Text type="secondary">Prioritize excellent and good match profiles first.</Text>
                  <Text type="secondary">Review missing API/dashboard exposure before submission.</Text>
                </Space>
              </SectionCard>
            </Col>

            <Col span={24}>
              <ParamListView
                listName="matched candidate"
                fields={candidateFields}
                dataSource={candidateRows}
              />
            </Col>
          </>
        ) : (
          <>
            <Col span={24}>
              <SectionCard title="Skill Match Overview" icon={<ThunderboltOutlined />}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={8}><DetailField label="Match Score" value="86%" /></Col>
                  <Col xs={24} md={8}><DetailField label="Priority Skill" value="React JS" /></Col>
                  <Col xs={24} md={8}><DetailField label="Submission Readiness" value="High" /></Col>
                </Row>
              </SectionCard>
            </Col>

            <Col xs={24} lg={14}>
              <SectionCard title="Required Skill Stack" icon={<InfoCircleOutlined />}>
                <Space size={[6, 6]} wrap>
                  {skillStack.map((skill) => (
                    <Tag key={skill} color="blue">{skill}</Tag>
                  ))}
                </Space>
              </SectionCard>
            </Col>

            <Col xs={24} lg={10}>
              <SectionCard title="Candidate Pipeline Snapshot" icon={<TeamOutlined />}>
                <Row gutter={[16, 16]}>
                  <Col span={8}><DetailField label="Ready" value="12" /></Col>
                  <Col span={8}><DetailField label="Strong Match" value="4" /></Col>
                  <Col span={8}><DetailField label="Review" value="0" /></Col>
                </Row>
              </SectionCard>
            </Col>

            <Col xs={24} lg={14}>
              <SectionCard title="Candidate Fit Signals" icon={<CheckCircleOutlined />}>
                <Space direction="vertical" size={8}>
                  {goodFitSignals.map((signal) => (
                    <Text key={signal}>• {signal}</Text>
                  ))}
                </Space>
              </SectionCard>
            </Col>

            <Col xs={24} lg={10}>
              <SectionCard title="Recruiter Notes" icon={<FileTextOutlined />}>
                <Space direction="vertical" size={8}>
                  <Text type="secondary">
                    Prioritize candidates with React + Ant Design dashboard experience.
                  </Text>
                  <Text type="secondary">
                    Check API integration exposure before client submission.
                  </Text>
                </Space>
              </SectionCard>
            </Col>

            <Col xs={24} lg={14}>
              <SectionCard title="Client Snapshot" icon={<FileSearchOutlined />}>
                <Row gutter={[32, 16]}>
                  <Col xs={24} md={8}>
                    <DetailField label="Contact Person" value="Jayaprakash A" />
                  </Col>
                  <Col xs={24} md={8}>
                    <DetailField label="Email" value={<Link>jayaprakash123@gmail.com</Link>} />
                  </Col>
                  <Col xs={24} md={8}>
                    <DetailField label="Phone Number" value={<Link>+91 (999) 469 - 4028</Link>} />
                  </Col>
                </Row>
              </SectionCard>
            </Col>

            <Col xs={24} lg={10}>
              <SectionCard title="Submission Notes" icon={<InfoCircleOutlined />}>
                <Row gutter={[16, 16]}>
                  <Col span={8}><DetailField label="Target" value={job.targetSub?.total} /></Col>
                  <Col span={8}><DetailField label="Pipeline" value={job.pipeline || '-'} /></Col>
                  <Col span={8}><DetailField label="Unit" value="Realtek" /></Col>
                </Row>
              </SectionCard>
            </Col>

            <Col xs={24} lg={14}>
              <SectionCard title="Requirement Brief" icon={<FileTextOutlined />}>
                <Space direction="vertical">
                  {defaultDescription.map((line) => (
                    <Paragraph key={line}>{line}</Paragraph>
                  ))}
                </Space>
              </SectionCard>
            </Col>

            <Col xs={24} lg={10}>
              <Card size="small" className="client-details-card">
                <Tabs
                  size="small"
                  activeKey={activeActivityTab}
                  onChange={setActiveActivityTab}
                  items={[
                    {
                      key: 'activity',
                      label: tabLabel('Skill Activity', 4),
                      children: (
                        <Space direction="vertical" size={14}>
                          <Title level={5}>Mar 23, 2026</Title>
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

                          <Divider />

                          <Title level={5}>Mar 20, 2026</Title>
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
                        </Space>
                      ),
                    },
                    {
                      key: 'notes',
                      label: tabLabel('Recruiter Notes', 2),
                      children: (
                        <Space direction="vertical" size={8}>
                          <Text type="secondary">
                            Prioritize candidates with React + Ant Design dashboard experience.
                          </Text>
                          <Text type="secondary">
                            Check API integration exposure before client submission.
                          </Text>
                        </Space>
                      ),
                    },
                  ]}
                />
              </Card>
            </Col>
          </>
        )}
      </Row>
    </div>
  );
}