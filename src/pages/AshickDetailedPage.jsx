import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    CalendarOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    EnvironmentOutlined,
    FileSearchOutlined,
    FileTextOutlined,
    InfoCircleOutlined,
    MoreOutlined,
    TeamOutlined,
} from '@ant-design/icons';

import { ASHICK_DETAILED_DATA } from '../data/jobs';
import DynamicListView from '../components/DynamicListView';
import ParamListView from '../components/ParamListView';
import StatusBadge from '../components/StatusBadge';

const { Text, Title, Link, Paragraph } = Typography;

const defaultDescription = `Job Title

Children's Nurse


Role Summary

Watson-Gutierrez seeks an experienced Children's Nurse to join our team in West Phillipville. The ideal candidate will provide high-quality care and collaborate effectively with colleagues.


Responsibilities

- Deliver nursing care to pediatric patients.

- Administer medications and monitor patient progress.

- Communicate with families regarding patient needs.

- Maintain accurate patient records.

- Collaborate with healthcare team members.


Required Skills

- Registered Nurse with valid license.

- Minimum 6 years of pediatric nursing experience.

- Strong communication and teamwork skills.

- Proficient in patient documentation.

- Ability to work in a fast-paced environment.


Preferred Skills

- Experience in pediatric specialty care.

- Advanced life support certification.

- Familiarity with electronic health records.`;

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
    {
        label: 'Submission Status',
        value: 'submissionStatus',
        render: (status) => {
            const statusColor = {
                Submitted: 'green',
                Pipeline: 'blue',
                Shortlisted: 'blue',
            };

            return <Tag color={statusColor[status] || 'default'}>{status}</Tag>;
        },
    },
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
        designation: 'Full Stack Developer',
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
            title={
                <Space size={6}>
                    {icon}
                    <Text strong>{title}</Text>
                </Space>
            }
            extra={<Button type="text" />}
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

export default function AshickDetailedView() {
    const navigate = useNavigate();
    const { jobId } = useParams();

    const job = ASHICK_DETAILED_DATA.find((item) => String(item.id) === String(jobId)) ?? ASHICK_DETAILED_DATA[0];

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
                                    <Text type="secondary" onClick={() => navigate('/ask-dashboard')}>
                                        Home
                                    </Text>
                                ),
                            },
                            {
                                title: (
                                    <Text type="secondary" onClick={() => navigate('/ask-dashboard')}>
                                        Jobs
                                    </Text>
                                ),
                            },
                            {
                                title: <Text strong>Detailed View</Text>,
                            },
                        ]}
                    />
                </Col>

                <Col span={24}>
                    <Card size="small" className="client-details-card">
                        <Row justify="space-between" align="middle" gutter={[24, 16]}>
                            <Col xs={24} lg={17}>
                                <Space direction="vertical" size={8}>
                                    <Text type="secondary">TCS - MSP ID 10432419</Text>

                                    <Space size={8} wrap>
                                        <Title level={4}>
                                            {job.title} - 38975
                                        </Title>
                                        <StatusBadge status={job.status || 'Fulfilled'} />
                                    </Space>

                                    <Space size={14} wrap>
                                        <Text type="secondary">
                                            <EnvironmentOutlined /> {job.location}
                                        </Text>
                                        <Text type="secondary">
                                            <ClockCircleOutlined /> {job.experience}
                                        </Text>
                                        <Text type="secondary">
                                            <BankOutlined /> {job.employmentType}
                                        </Text>
                                        <Text type="secondary">{job.locationType}</Text>
                                        <Text type="secondary">
                                            <DollarOutlined /> Client rate: ${job.clientRate}/hr
                                        </Text>
                                    </Space>

                                    <Tabs
                                        size="small"
                                        activeKey={activeDetailTab}
                                        onChange={setActiveDetailTab}
                                        items={[
                                            { key: 'details', label: tabLabel('Details', 1) },
                                            { key: 'candidates-api', label: 'Candidates API' },
                                            { key: 'candidate', label: tabLabel('Candidate', candidateRows.length) },
                                        ]}
                                    />
                                </Space>
                            </Col>

                            <Col xs={24} lg={7}>
                                <Card size="small" className="client-details-card">
                                    <Space direction="vertical" size={14}>
                                        <Row align="middle" justify="space-between">
                                            <Col>
                                                <Button type="link" icon={<TeamOutlined />}>
                                                    Source Candidates
                                                </Button>
                                            </Col>
                                            <Col>
                                                <Button type="text" icon={<MoreOutlined />} />
                                            </Col>
                                        </Row>

                                        <Row gutter={[24, 12]}>
                                            <Col span={12}>
                                                <DetailField
                                                    label="Target submissions"
                                                    value={job.targetSub?.total || 5}
                                                />
                                            </Col>
                                            <Col span={12}>
                                                <DetailField
                                                    label="In pipeline"
                                                    value={job.pipeline || '-'}
                                                />
                                            </Col>
                                        </Row>

                                        <Text type="secondary">
                                            <CalendarOutlined /> Created on Nov 03, 2025 | 07:00PM
                                        </Text>
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
                    <Col span={24}>
                        <ParamListView
                            listName="Candidates"
                            fields={candidateFields}
                            dataSource={candidateRows}
                        />
                    </Col>
                ) : (
                    <>
                        <Col xs={24} lg={12}>
                            <Space direction="vertical" size={12}>
                                <SectionCard title="Client Details" icon={<FileSearchOutlined />}>
                                    <Row gutter={[32, 16]}>
                                        <Col xs={24} md={8}>
                                            <DetailField label="Contact Person" value="Abdul Ashick" />
                                        </Col>
                                        <Col xs={24} md={8}>
                                            <DetailField
                                                label="Email"
                                                value={<Link>abdul@realtekconsulting.net</Link>}
                                            />
                                        </Col>
                                        <Col xs={24} md={8}>
                                            <DetailField
                                                label="Phone Number"
                                                value={<Link>+91 (872) 534 - 2206</Link>}
                                            />
                                        </Col>
                                    </Row>
                                </SectionCard>

                                <SectionCard title="Skills & Competencies" icon={<InfoCircleOutlined />}>
                                    <Space direction="vertical" size={12}>
                                        <DetailField
                                            label="Primary Skills"
                                            value={
                                                <Space size={[6, 6]} wrap>
                                                    {[
                                                        'Salesforce',
                                                        'Administration',
                                                        'Process Builder',
                                                        'Flows',
                                                        'User training',
                                                    ].map((skill) => (
                                                        <Tag key={skill} color="blue">
                                                            {skill}
                                                        </Tag>
                                                    ))}
                                                </Space>
                                            }
                                        />
                                        <DetailField label="Secondary Skills" value="-" />
                                        <DetailField label="Competencies" value="-" />
                                    </Space>
                                </SectionCard>

                                <SectionCard title="Decription" icon={<FileTextOutlined />}>
                                    <Text
                                        style={{
                                            whiteSpace: 'pre-line',
                                            display: 'block',
                                            lineHeight: 1,
                                            color: '#000',
                                        }}
                                    >
                                        {defaultDescription}
                                    </Text>
                                </SectionCard>
                            </Space>
                        </Col>

                        <Col xs={24} lg={12}>
                            <Card size="small" className="client-details-card">
                                <Tabs
                                    size="small"
                                    activeKey={activeActivityTab}
                                    onChange={setActiveActivityTab}
                                    items={[
                                        {
                                            key: 'activity',
                                            label: tabLabel('Activity', 2),
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
                                            label: 'Notes',
                                            children: <Text type="secondary">No notes found</Text>,
                                        },
                                    ]}
                                />
                            </Card>
                        </Col>

                        {/* <Col span={24}>
                            <ParamListView
                                listName="Candidates"
                                fields={candidateFields}
                                dataSource={candidateRows}
                            />
                        </Col> */}
                    </>
                )}
            </Row>
        </div>
    );
}