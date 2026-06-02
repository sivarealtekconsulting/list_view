import {
    Avatar,
    Breadcrumb,
    Button,
    Card,
    Col,
    Row,
    Space,
    Tag,
    Timeline,
    Typography,
} from 'antd';

import {
    BankOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    EnvironmentOutlined,
    FilePdfOutlined,
    MailOutlined,
    PhoneOutlined,
    UserOutlined,
} from '@ant-design/icons';

import {
    useNavigate,
    useParams,
} from 'react-router-dom';

// import { MOCK_JOBS } from '../data/jobs';
import jobsData from '../data/suryaJobs.json';
import detailData from '../data/suryaDetailsView.json';

import StatusBadge from '../components/StatusBadge';

import StickyNotesCard from '../components/cards/StickyNotesCard';
import StatsCards from '../components/cards/StatsCards';

const JOBS = jobsData.jobs;
const DETAILS = detailData.job;

const { Title, Text, Paragraph } = Typography;

export default function DetailPages() {

    const navigate = useNavigate();

    const { jobId } = useParams();

    const job =
        JOBS.find(
            (item) =>
                String(item.id) === String(jobId)
        ) ?? JOBS[0];

    const detailJob =
        DETAILS.find(
            (item) =>
                String(item.id) === String(jobId)
        ) ?? DETAILS[0];

    return (

        <div className="dashboard-wrapper">
            <Row gutter={[16, 16]}>
                {/* BREADCRUMB */}
                <Col span={24}>
                    <Breadcrumb
                        items={[
                            {
                                title: (
                                    <Text
                                        type="secondary"
                                        onClick={() => navigate('/')}
                                    >
                                        Home
                                    </Text>
                                ),
                            },
                            {
                                title: (
                                    <Text
                                        type="secondary"
                                        onClick={() => navigate('/')}
                                    >
                                        Jobs
                                    </Text>
                                ),
                            },
                            {
                                title: (
                                    <Text strong>
                                        Detailed View
                                    </Text>
                                ),
                            },
                        ]}
                    />
                </Col>

                {/* ROW 1 */}
                <Col span={24}>
                    <StatsCards />
                </Col>

                {/* ROW 2 */}
                <Col xs={24} md={16}>
                    <Card className="dashboard-card">
                        <div>
                            <div>

                                <Text type="secondary">
                                    {job.client}
                                </Text>
                                <Row
                                    justify="space-between"
                                    align="middle"
                                >
                                    <Col>
                                        <Space
                                            wrap
                                            align="center"
                                        >
                                            <Title level={3}>
                                                {job.title}
                                            </Title>
                                            <StatusBadge status={job.status} />
                                        </Space>
                                    </Col>

                                    <Col>
                                        <Button
                                            type="primary"
                                            onClick={() =>
                                                navigate('/Surya-job-edit', {
                                                    state: {
                                                        jobData: {
                                                            jobTitle: job.title,
                                                            companyName: 'Infosys',
                                                            experience: job.experience,
                                                            location: 'Texas',
                                                            salary: `$${job.clientRate}/hr`,
                                                            noticePeriod: '30 Days',
                                                            employmentType: job.employmentType,
                                                            workMode: 'Remote',
                                                            skills:
                                                                'React, Node.js, AWS, MongoDB, Docker, Kubernetes',
                                                            description:
                                                                'Looking for a senior React developer with strong Node.js and cloud deployment experience.',
                                                        },
                                                    },
                                                })
                                            }
                                        >
                                            Edit
                                        </Button>
                                    </Col>
                                </Row>
                            </div>

                            <Space wrap>
                                <Text>
                                    <EnvironmentOutlined /> {job.location}
                                </Text>
                                <Text>
                                    <ClockCircleOutlined /> {job.experience}
                                </Text>
                                <Text>
                                    <BankOutlined /> {job.employmentType}
                                </Text>
                                <Text>
                                    <DollarOutlined /> ${job.clientRate}/hr
                                </Text>
                            </Space>

                            <Paragraph type="secondary">
                                {detailJob.description}
                            </Paragraph>

                            <Space wrap>
                                {detailJob.skills?.map((skill) => (
                                    <Tag key={skill}>
                                        {skill}
                                    </Tag>
                                ))}
                            </Space>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} md={8}>
                    <Card className="dashboard-card">
                        <Space direction="vertical">
                            <StatusBadge status="Shortlisted" />
                            <Text type="secondary">
                                Your profile has been shortlisted
                                for the next interview round.
                            </Text>

                            <Button
                                type="primary"
                                block
                            >
                                Track Application
                            </Button>
                        </Space>
                    </Card>
                </Col>

                {/* ROW 3 */}
                <Col xs={24} md={12}>
                    <Card
                        title="About this Role"
                        className="dashboard-card"
                    >
                        <Paragraph>
                            {detailJob.aboutRole.summary1}
                        </Paragraph>

                        <Paragraph>
                            {detailJob.aboutRole.summary2}
                        </Paragraph>
                    </Card>
                </Col>

                {/* ROW 4 */}
                <Col xs={24} md={6}>
                    <Card
                        title="Interview Process"
                        className="dashboard-card"
                    >
                        <Timeline
                            items={
                                detailJob.interviewProcess?.map((item) => ({
                                    children: item,
                                }))
                            }
                        />
                    </Card>
                </Col>

                <Col xs={24} md={6}>
                    <Card
                        title="Job Summary"
                        className="dashboard-card"
                    >
                        <Space
                            direction="vertical"
                            size="middle"
                        >
                            <Row justify="space-between">
                                <Text type="secondary">
                                    Experience
                                </Text>
                                <Text strong>
                                    {job.experience}
                                </Text>
                            </Row>

                            <Row justify="space-between">
                                <Text type="secondary">
                                    Work Mode
                                </Text>
                                <Text strong>
                                    Remote
                                </Text>
                            </Row>

                            <Row justify="space-between">
                                <Text type="secondary">
                                    Employment
                                </Text>
                                <Text strong>
                                    {job.employmentType}
                                </Text>
                            </Row>

                            <Row justify="space-between">
                                <Text type="secondary">
                                    Notice Period
                                </Text>
                                <Text strong>
                                    Immediate
                                </Text>
                            </Row>
                        </Space>
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card
                        title="Responsibilities"
                        className="dashboard-card"
                    >
                        <Space direction="vertical">
                            {detailJob.responsibilities?.map((skill) => (
                                <Tag key={skill}>
                                    {skill}
                                </Tag>
                            ))}
                        </Space>
                    </Card>
                </Col>

                <Col xs={24} md={6}>
                    <Card
                        title="Recruiter"
                        className="dashboard-card"
                    >
                        <Space direction="vertical">
                            <Space align="center">
                                <Avatar
                                    icon={<UserOutlined />}
                                />
                                <div>
                                    <Text strong>
                                        {detailJob.recruiter.name}
                                    </Text>
                                    <br />
                                    <Text type="secondary">
                                        {detailJob.recruiter.designation}
                                    </Text>
                                </div>
                            </Space>

                            <Space>
                                <MailOutlined />
                                <Text>
                                    {detailJob.recruiter.email}
                                </Text>
                            </Space>

                            <Space>
                                <PhoneOutlined />
                                <Text>
                                    {detailJob.recruiter.phone}
                                </Text>
                            </Space>
                        </Space>
                    </Card>
                </Col>

                <Col xs={24} md={6}>
                    <Card
                        title="Documents"
                        className="dashboard-card"
                    >
                        <Space direction="vertical">
                            {detailJob.documents?.map((doc, index) => (
                                <Button
                                    key={index}
                                    icon={<FilePdfOutlined />}
                                    block
                                >
                                    {doc}
                                </Button>
                            ))}
                        </Space>
                    </Card>
                </Col>

                {/* ROW 5
                    <Col span={24}>
                        <StickyNotesCard />
                    </Col> */}
            </Row>
        </div>
    );
}