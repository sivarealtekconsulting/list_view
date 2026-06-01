import { Card, Form, Input, Button, Row, Col, Select, Space, Affix, Breadcrumb } from 'antd';
import { useNavigate } from 'react-router-dom';
import { validationRules, formatters } from '../components/form/validation';
const { TextArea } = Input;

export default function PugazhEditJob() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const handleUpdate = (values) => {
        console.log('Updated Job:', values);
    };

    return (
        <div className="dashboard-wrapper">

            <Breadcrumb
                items={[
                    { title: <a href="/">Home</a> },
                    { title: <a href="/pugazh-dashboard">dashboard</a> },
                    { title: <a href="/pugazh-detail-listview">Detailed View</a> },
                    { title: "Edit-Job-Details" },
                ]}
            />


            <Form
                form={form}
                layout="vertical"
                onFinish={handleUpdate}
                initialValues={{
                    clientName: 'Cognizant Technology Solutions',
                    mspId: '40123789',
                    jobTitle: 'Full Stack Developer',
                    experience: '3 Years Experience',
                    jobId: '38975',
                    status: 'Fulfilled',
                    location: 'North Davidfurt',
                    jobType: 'Full-time',
                    workMode: 'On-site',
                    clientRate: '$78/hr',
                    contactPerson: 'Kavitha Sundaram',
                    contactEmail: 'kavitha.sundaram@cognizant.com',
                    phoneNumber: '9827363281',
                    primarySkills: 'React, Node.js, TypeScript, GraphQL, AWS',
                    secondarySkills: 'Docker, Kubernetes, Redis',
                    competencies: 'System Design, Agile, Leadership',
                    noticePeriod: '30 Days',
                    businessUnit: 'Cognizant Digital Business',
                    jobDescription: `Bill Rate: 90 - 115
MSP Owner: Suresh Pillai
Location: CHENNAI / REMOTE
Duration: 12 months
GbaMS ReqID: 40123001

Experience: 6-10 years in Full Stack Development

Roles & Responsibilities
- Build scalable web applications using React and Node.js.
- Design RESTful and GraphQL APIs for enterprise applications.
- Collaborate with UX designers to implement responsive UI.
- Optimize application performance and scalability.
- Lead code reviews and mentor junior developers.

Required Skills
- Strong proficiency in React, TypeScript, and Node.js.
- Hands-on experience with GraphQL and REST APIs.
- Knowledge of AWS services: EC2, S3, Lambda, RDS.
- Familiarity with Docker and Kubernetes.
- Experience with CI/CD pipelines and Git workflows.`,
                }}
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24}>
                        <Card size="small" title="Job Information">
                            <Row gutter={[16, 8]}>
                                <Col xs={24} md={8}>
                                    <Form.Item label="Client Name" name="clientName" validateTrigger={['onBlur', 'onChange']} rules={[validationRules.required('Client Name'), validationRules.companyName()]}>
                                        <Input />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Form.Item label="MSP ID" name="mspId" validateTrigger={['onBlur', 'onChange']} rules={[validationRules.required('MSP ID'), validationRules.candidateId('MSP ID')]}>
                                        <Input />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Form.Item label="Job Title" name="jobTitle" validateTrigger={['onBlur', 'onChange']} rules={[validationRules.required('Job Title'), validationRules.alphanumeric()]}>
                                        <Input />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Form.Item label="Experience" name="experience" rules={[validationRules.required('Experience')]}>
                                        <Input />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Form.Item label="Job ID" name="jobId" validateTrigger={['onBlur', 'onChange']} rules={[validationRules.required('Job ID'), validationRules.candidateId('Job ID')]}>
                                        <Input />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Form.Item label="Status" name="status" rules={[validationRules.required('Status')]}>
                                        <Select options={[
                                            { value: 'Open', label: 'Open' },
                                            { value: 'Fulfilled', label: 'Fulfilled' },
                                            { value: 'Closed', label: 'Closed' },
                                        ]} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col xs={24}>
                        <Card size="small" title="Work Details">
                            <Row gutter={[16, 8]}>
                                <Col xs={24} md={8}>
                                    <Form.Item label="Location" name="location" validateTrigger={['onBlur', 'onChange']} rules={[validationRules.required('Location'), validationRules.alphabets()]}>
                                        <Input />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Form.Item label="Job Type" name="jobType" rules={[validationRules.required('Job Type')]}>
                                        <Select options={[
                                            { value: 'Full-time', label: 'Full-time' },
                                            { value: 'Contract', label: 'Contract' },
                                            { value: 'Part-time', label: 'Part-time' },
                                        ]} />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Form.Item label="Work Mode" name="workMode" rules={[validationRules.required('Work Mode')]}>
                                        <Select options={[
                                            { value: 'On-site', label: 'On-site' },
                                            { value: 'Remote', label: 'Remote' },
                                            { value: 'Hybrid', label: 'Hybrid' },
                                        ]} />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Form.Item label="Client Rate" name="clientRate" rules={[validationRules.required('Client Rate')]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col xs={24}>
                        <Card size="small" title="Client Contact Details">
                            <Row gutter={[16, 8]}>
                                <Col xs={24} md={8}>
                                    <Form.Item label="Contact Person" name="contactPerson" validateTrigger={['onBlur', 'onChange']} rules={[validationRules.required('Contact Person'), validationRules.alphabets()]}>
                                        <Input />
                                    </Form.Item>
                                </Col>


                                <Col xs={24} md={8}>
                                    <Form.Item label="Contact Email" name="contactEmail" validateTrigger={['onBlur', 'onChange']} rules={[validationRules.required('Contact Email'), validationRules.email()]}>
                                        <Input />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Form.Item label="Phone Number" name="phoneNumber" validateTrigger={['onBlur', 'onChange']} rules={[validationRules.required('Phone Number'), validationRules.phone()]}>
                                        <Input
                                            maxLength={10}
                                            onChange={(event) => {
                                                form.setFieldsValue({
                                                    phoneNumber: formatters.phoneFormatter(event.target.value),
                                                });
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col xs={24}>
                        <Card size="small" title="Skills & Business Details">
                            <Row gutter={[16, 8]}>
                                <Col xs={24} md={8}>
                                    <Form.Item label="Primary Skills" name="primarySkills" rules={[validationRules.required('Primary Skills')]}>
                                        <Input />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Form.Item label="Secondary Skills" name="secondarySkills">
                                        <Input />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Form.Item label="Competencies" name="competencies">
                                        <Input />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Form.Item label="Notice Period" name="noticePeriod">
                                        <Input />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Form.Item label="Business Unit" name="businessUnit" validateTrigger={['onBlur', 'onChange']} rules={[validationRules.companyName()]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col xs={24}>
                        <Card size="small" title="Job Description">
                                                            <Col xs={24} md={8}>

                            <Form.Item
                                label="Job Description"
                                name="jobDescription"
                                validateTrigger={['onBlur', 'onChange']}
                                rules={[
                                    validationRules.required('Job Description'),
                                    { min: 20, message: 'Job Description must be at least 20 characters.' },
                                    { max: 3000, message: 'Job Description must not exceed 3000 characters.' },
                                ]}
                            >
                                <TextArea rows={4} />
                            </Form.Item>
                            </Col>
                            </Card>
                    </Col>
                </Row>


                <Affix offsetBottom={0}>
                    <Card>
                        <Row justify="end" gutter={12}>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    Update Job
                                </Button>

                                <Button onClick={() => navigate('/pugazh-detail-listview')}>
                                    Cancel
                                </Button>
                            </Space>
                        </Row>
                    </Card>
                </Affix>

            </Form>

        </div>
    );
}