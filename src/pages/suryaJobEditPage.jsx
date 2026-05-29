import {
    Button,
    Card,
    Col,
    Form,
    Input,
    Row,
    Select,
    Typography,
    Breadcrumb,
    DatePicker,
    Space,
    Affix,
    Tag,
    Alert,
    Divider,
    Tooltip,
    Statistic,
} from 'antd';

import {
    useNavigate,
    useLocation,
} from 'react-router-dom';

import {
    validationRules,
    formatters,
} from '../components/form/validation';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function JobEditPage() {

    const navigate = useNavigate();

    const location = useLocation();

    const jobData = location.state?.jobData;

    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log(values);
    };

    return (

        <div className="dashboard-wrapper">

            <Row gutter={[20, 20]}>

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
                                        onClick={() => navigate(-1)}
                                    >
                                        Detail View
                                    </Text>
                                ),
                            },
                            {
                                title: (
                                    <Text strong>
                                        Edit Job
                                    </Text>
                                ),
                            },
                        ]}
                    />

                </Col>

                {/* HEADER */}

                <Col span={24}>

                    <Card>

                        <Row
                            justify="space-between"
                            align="middle"
                        >

                            <Col>

                                <Space
                                    direction="vertical"
                                    size={0}
                                >

                                    <Title level={2}>
                                        Edit Job Details
                                    </Title>

                                    <Text type="secondary">
                                        Update job information and requirements
                                    </Text>

                                </Space>

                            </Col>

                            <Col>

                                <Tooltip title="Current Job Status">

                                    <Tag color="green">
                                        Active Job
                                    </Tag>

                                </Tooltip>

                            </Col>

                        </Row>

                        <Divider />

                        <Alert
                            message="Update the job details carefully before saving changes."
                            type="info"
                            showIcon
                            closable
                        />

                    </Card>

                </Col>

               

                {/* FORM */}

                <Col span={24}>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{
                            jobTitle: jobData?.jobTitle,
                            companyName: jobData?.companyName,
                            experience: jobData?.experience,
                            location: jobData?.location,
                            salary: jobData?.salary,
                            noticePeriod: jobData?.noticePeriod,
                            employmentType: jobData?.employmentType,
                            workMode: jobData?.workMode,
                            skills: jobData?.skills,
                            description: jobData?.description,
                        }}
                    >

                        <Row gutter={[20, 20]}>

                            {/* BASIC INFORMATION */}

                            <Col span={24}>

                                <Card
                                    title="Basic Information"
                                    extra={
                                        <Tag color="blue">
                                            Primary
                                        </Tag>
                                    }
                                >

                                    <Row gutter={[16, 16]}>

                                        <Col xs={24} md={8}>

                                            <Form.Item
                                                label="Job Title"
                                                name="jobTitle"
                                                rules={[
                                                    validationRules.required('Job Title'),
                                                    validationRules.designation(),
                                                ]}
                                            >

                                                <Input
                                                    placeholder="Full Stack Developer"
                                                    onChange={(e) => {

                                                        form.setFieldsValue({
                                                            jobTitle:
                                                                formatters.capitalizeWords(
                                                                    e.target.value
                                                                ),
                                                        });
                                                    }}
                                                />

                                            </Form.Item>

                                        </Col>

                                        <Col xs={24} md={8}>

                                            <Form.Item
                                                label="Company Name"
                                                name="companyName"
                                                rules={[
                                                    validationRules.required('Company Name'),
                                                    validationRules.companyName(),
                                                ]}
                                            >

                                                <Input
                                                    placeholder="Infosys"
                                                    onChange={(e) => {

                                                        form.setFieldsValue({
                                                            companyName:
                                                                formatters.capitalizeWords(
                                                                    e.target.value
                                                                ),
                                                        });
                                                    }}
                                                />

                                            </Form.Item>

                                        </Col>

                                        <Col xs={24} md={8}>

                                            <Form.Item
                                                label="Experience"
                                                name="experience"
                                                rules={[
                                                    validationRules.required('Experience'),
                                                    validationRules.alphanumeric(),
                                                ]}
                                            >

                                                <Input placeholder="8+ Years" />

                                            </Form.Item>

                                        </Col>

                                    </Row>

                                </Card>

                            </Col>

                            {/* JOB INFORMATION */}

                            <Col span={24}>

                                <Card
                                    title="Job Information"
                                    extra={
                                        <Tag color="purple">
                                            Details
                                        </Tag>
                                    }
                                >

                                    <Row gutter={[16, 16]}>

                                        <Col xs={24} md={8}>

                                            <Form.Item
                                                label="Location"
                                                name="location"
                                                rules={[
                                                    validationRules.required('Location'),
                                                ]}
                                            >

                                                <Input placeholder="Texas" />

                                            </Form.Item>

                                        </Col>

                                        <Col xs={24} md={8}>

                                            <Form.Item
                                                label="Salary"
                                                name="salary"
                                                rules={[
                                                    validationRules.required('Salary'),
                                                    validationRules.alphanumeric(),
                                                ]}
                                            >

                                                <Input placeholder="$85/hr" />

                                            </Form.Item>

                                        </Col>

                                        <Col xs={24} md={8}>

                                            <Form.Item
                                                label="Notice Period"
                                                name="noticePeriod"
                                                rules={[
                                                    validationRules.required('Notice Period'),
                                                    validationRules.alphanumeric(),
                                                ]}
                                            >

                                                <Input placeholder="30 Days" />

                                            </Form.Item>

                                        </Col>

                                        <Col xs={24} md={8}>

                                            <Form.Item
                                                label="Employment Type"
                                                name="employmentType"
                                                rules={[
                                                    validationRules.required('Employment Type'),
                                                ]}
                                            >

                                                <Select
                                                    placeholder="Select Employment Type"
                                                    options={[
                                                        {
                                                            label: 'Full Time',
                                                            value: 'Full Time',
                                                        },
                                                        {
                                                            label: 'Part Time',
                                                            value: 'Part Time',
                                                        },
                                                        {
                                                            label: 'Contract',
                                                            value: 'Contract',
                                                        },
                                                    ]}
                                                />

                                            </Form.Item>

                                        </Col>

                                        <Col xs={24} md={8}>

                                            <Form.Item
                                                label="Work Mode"
                                                name="workMode"
                                                rules={[
                                                    validationRules.required('Work Mode'),
                                                ]}
                                            >

                                                <Select
                                                    placeholder="Select Work Mode"
                                                    options={[
                                                        {
                                                            label: 'Remote',
                                                            value: 'Remote',
                                                        },
                                                        {
                                                            label: 'Hybrid',
                                                            value: 'Hybrid',
                                                        },
                                                        {
                                                            label: 'Work From Office',
                                                            value: 'WFO',
                                                        },
                                                    ]}
                                                />

                                            </Form.Item>

                                        </Col>

                                        <Col xs={24} md={8}>

                                            <Form.Item
                                                label="Last Date"
                                                name="lastDate"
                                            >

                                                <DatePicker className="w-full" />

                                            </Form.Item>

                                        </Col>

                                    </Row>

                                </Card>

                            </Col>

                            {/* SKILLS CARD */}

                            <Col xs={24} lg={12}>

                                <Card
                                    title="Skills Required"
                                    extra={
                                        <Tag color="cyan">
                                            Technical
                                        </Tag>
                                    }
                                >

                                    <Space
                                        direction="vertical"
                                        size="large"
                                        className="w-full"
                                    >

                                        <Alert
                                            message="Required Technical Skills"
                                            type="info"
                                            showIcon
                                        />

                                        <Form.Item
                                            label="Primary Skills"
                                            name="skills"
                                            rules={[
                                                validationRules.required('Skills'),
                                            ]}
                                        >

                                            <Select
                                                mode="tags"
                                                size="large"
                                                placeholder="Add Skills"
                                                tokenSeparators={[',']}
                                            />

                                        </Form.Item>

                                            {/* <Divider orientation="left">
                                                Tech Stack
                                            </Divider>

                                            <Space wrap size="middle">

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

                                            <Row gutter={[12, 12]}>

                                                <Col span={12}>

                                                    <Card size="small">

                                                        <Statistic
                                                            title="Skills"
                                                            value={6}
                                                        />

                                                    </Card>

                                                </Col>

                                                <Col span={12}>

                                                    <Card size="small">

                                                        <Statistic
                                                            title="Priority"
                                                            value="High"
                                                        />

                                                    </Card>

                                                </Col>

                                            </Row> */}

                                    </Space>

                                </Card>

                            </Col>

                            {/* DESCRIPTION CARD */}

                            <Col xs={24} lg={12}>

                                <Card
                                    title="Job Description"
                                    extra={
                                        <Tag color="gold">
                                            Overview
                                        </Tag>
                                    }
                                >

                                    <Space
                                        direction="vertical"
                                        size="large"
                                        className="w-full"
                                    >

                                        <Alert
                                            message="Role Responsibilities & Expectations"
                                            type="warning"
                                            showIcon
                                        />

                                        <Card size="small">

                                            <Text type="secondary">

                                                Add project responsibilities,
                                                requirements,
                                                technical expectations,
                                                and candidate responsibilities.

                                            </Text>

                                        </Card>

                                        <Form.Item
                                            name="description"
                                            rules={[
                                                validationRules.required('Job Description'),
                                                validationRules.remarks(),
                                            ]}
                                        >

                                            <TextArea
                                                rows={14}
                                                placeholder="Describe job responsibilities, requirements, expectations, and additional details..."
                                            />

                                        </Form.Item>

                                        {/* <Divider orientation="left">
                                            Quick Overview
                                        </Divider> */}

                                        {/* <Row gutter={[16, 16]}>

                                            <Col xs={24} md={8}>

                                                <Card size="small">

                                                    <Statistic
                                                        title="Experience"
                                                        value="8+ Years"
                                                    />

                                                </Card>

                                            </Col>

                                            <Col xs={24} md={8}>

                                                <Card size="small">

                                                    <Statistic
                                                        title="Openings"
                                                        value={4}
                                                    />

                                                </Card>

                                            </Col>

                                            <Col xs={24} md={8}>

                                                <Card size="small">

                                                    <Statistic
                                                        title="Mode"
                                                        value="Remote"
                                                    />

                                                </Card>

                                            </Col>

                                        </Row> */}

                                    </Space>

                                </Card>

                            </Col>

                            {/* FOOTER */}

                            <Col span={24}>

                                <Affix offsetBottom={0}>

                                    <Card>

                                        <Row
                                            justify="space-between"
                                            align="middle"
                                        >

                                            <Col>

                                                <Text type="secondary">
                                                    Update job information and save changes
                                                </Text>

                                            </Col>

                                            <Col>

                                                <Space>

                                                    <Button
                                                        size="large"
                                                        onClick={() => {
                                                            form.resetFields();
                                                            navigate(-1);
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>

                                                    <Button
                                                        type="primary"
                                                        htmlType="submit"
                                                        size="large"
                                                    >
                                                        Save Changes
                                                    </Button>

                                                </Space>

                                            </Col>

                                        </Row>

                                    </Card>

                                </Affix>

                            </Col>

                        </Row>

                    </Form>

                </Col>

            </Row>

        </div>
    );
}