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

import { MOCK_JOBS } from '../data/jobs';

import StatusBadge from '../components/StatusBadge';

import StickyNotesCard from '../components/cards/StickyNotesCard';
import StatsCards from '../components/cards/StatsCards';

const { Title, Text, Paragraph } = Typography;

export default function DetailPages() {

    const navigate = useNavigate();

    const { jobId } = useParams();

    const job =
        MOCK_JOBS.find(
            (item) =>
                String(item.id) === String(jobId)
        ) ?? MOCK_JOBS[0];

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
                                {/* 
                                <Text type="secondary">
                                    Infosys • Job ID #JOB10245
                                </Text> */}
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
                                            <StatusBadge status="Applied" />
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
                                                            experience: '8+ Years',
                                                            location: 'Texas',
                                                            salary: '$85/hr',
                                                            noticePeriod: '30 Days',
                                                            employmentType: 'Full Time',
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
                                    <EnvironmentOutlined /> Texas
                                </Text>
                                <Text>
                                    <ClockCircleOutlined /> 8+ Years
                                </Text>
                                <Text>
                                    <BankOutlined /> Full Time
                                </Text>
                                <Text>
                                    <DollarOutlined /> $85/hr
                                </Text>
                            </Space>

                            <Paragraph type="secondary">
                                Looking for a senior React developer
                                with strong Node.js and cloud
                                deployment experience.
                            </Paragraph>

                            <Space wrap>
                                <Tag color="blue">
                                    React
                                </Tag>
                                <Tag color="green">
                                    Node.js
                                </Tag>
                                <Tag color="purple">
                                    AWS
                                </Tag>
                                <Tag color="orange">
                                    MongoDB
                                </Tag>
                                <Tag color="cyan">
                                    Docker
                                </Tag>
                                <Tag color="red">
                                    Kubernetes
                                </Tag>
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
                            We are seeking an experienced and highly motivated
                            React Developer with strong expertise in building
                            scalable, high-performance enterprise applications.
                            The ideal candidate should possess deep knowledge
                            of modern frontend technologies and best practices
                            for developing responsive and user-friendly web
                            applications.
                        </Paragraph>

                        <Paragraph>
                            The candidate must have hands-on experience with
                            React.js, Node.js, REST API integration, cloud
                            deployment, and microservices architecture.
                            Experience working with AWS services, Docker,
                            and modern DevOps workflows will be considered
                            an added advantage.
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
                            items={[
                                {
                                    color: 'green',
                                    children:
                                        'Application Submitted',
                                },
                                {
                                    color: 'blue',
                                    children:
                                        'Technical Screening',
                                },
                                {
                                    color: 'orange',
                                    children:
                                        'Manager Discussion',
                                },
                                {
                                    color: 'gray',
                                    children:
                                        'HR Round',
                                },
                            ]}
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
                                    8+ Years
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
                                    Full Time
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
                            <Text>
                                • Design and develop scalable React applications
                                for enterprise-level platforms.
                            </Text>

                            <Text>
                                • Create reusable and maintainable frontend
                                components with clean architecture.
                            </Text>

                            <Text>
                                • Integrate REST APIs, microservices, and
                                third-party services efficiently.
                            </Text>

                            <Text>
                                • Collaborate closely with UI/UX designers,
                                backend developers, and QA teams.
                            </Text>

                            <Text>
                                • Participate in code reviews and ensure
                                best coding practices are followed.
                            </Text>
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
                                        David Warner
                                    </Text>
                                    <br />
                                    <Text type="secondary">
                                        Senior Recruiter
                                    </Text>
                                </div>
                            </Space>

                            <Space>
                                <MailOutlined />
                                <Text>
                                    hiring@infosys.com
                                </Text>
                            </Space>

                            <Space>
                                <PhoneOutlined />
                                <Text>
                                    +1 9876543210
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
                            <Button
                                icon={<FilePdfOutlined />}
                                block
                            >
                                Resume.pdf
                            </Button>

                            <Button
                                icon={<FilePdfOutlined />}
                                block
                            >
                                CoverLetter.pdf
                            </Button>

                            <Button
                                icon={<FilePdfOutlined />}
                                block
                            >
                                Experience.pdf
                            </Button>
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