import { Button, Card, Col, Form, Input, Row, Space, Typography } from 'antd';
import { FilterOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';

import StatsCards from '../components/cards/StatsCards';
import ListView from '../components/ListView'
import ClientSubmissionCard from '../components/cards/ClientSubmissionCard';
import OnboardingCard from '../components/cards/OnboardingCard';
import CalendarCard from '../components/cards/CalendarCard';
import UserForm from '../components/form/forms';
import '../styles/DashboardCards.css';
import { validationRules } from '../components/form/validation';
import AshickListView from '../components/AshickListView'

const { Title, Text } = Typography;

export default function AshickDashboard() {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log("Form Values:", values);
    };
    return (
        <div className="dashboard-wrapper">
            <Space orientation="vertical" size={16} style={{ display: 'flex' }}>
                <Card>
                    <Row gutter={[16, 16]} justify="space-between" align="middle">
                        <Col xs={24} lg={10}>
                            <Title level={2} style={{ marginBottom: 4 }}>
                                Recruitment Analytics Dashboard
                            </Title>
                        </Col>
                    </Row>
                </Card>

                <StatsCards />

                <Card title="Jobs List View" extra={<Text type="secondary"></Text>}>
                    {/* <ListView /> */}
                    <AshickListView />
                </Card>

                <Row gutter={[16, 16]} align="stretch">
                    <Col xs={24} lg={12} xl={8}>
                        <ClientSubmissionCard />
                    </Col>

                    <Col xs={24} lg={12} xl={8}>
                        <OnboardingCard />
                    </Col>

                    <Col xs={24} xl={8}>
                        <CalendarCard />
                    </Col>
                </Row>

                <Card title="Candidate Form" extra={<Text type="secondary"></Text>}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Row gutter={16}>
                            {/* EMAIL */}
                            <Col span={8}>
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[
                                        validationRules.required("Email"),
                                        validationRules.email(),
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>

                            {/* PHONE */}
                            <Col span={8}>
                                <Form.Item
                                    label="Phone Number"
                                    name="phone"
                                    rules={[
                                        validationRules.required("Phone Number"),
                                        validationRules.phone(),
                                    ]}
                                    validateTrigger={["onBlur", "onChange"]}
                                >
                                    <Input
                                        maxLength={10}
                                        onChange={(e) => {
                                            form.setFieldsValue({
                                                phone: formatters.phoneFormatter(
                                                    e.target.value
                                                ),
                                            });
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="Full Name"
                                    name="fullName"
                                    rules={[
                                        validationRules.required("Full Name"),
                                        validationRules.alphabets(),
                                        validationRules.firstNameMinLength(),
                                        validationRules.firstNameMaxLength(),
                                    ]}
                                >
                                    <Input
                                        onChange={(e) => {
                                            form.setFieldsValue({
                                                fullName: formatters.firstNameFormatter(
                                                    e.target.value
                                                ),
                                            });
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            {/* USERNAME */}
                            <Col span={8}>
                                <Form.Item
                                    label="Username"
                                    name="username"
                                    rules={[
                                        validationRules.required("Username"),
                                        validationRules.alphanumeric(),
                                    ]}
                                >
                                    <Input
                                        onChange={(e) => {
                                            form.setFieldsValue({
                                                username:
                                                    formatters.removeExtraSpaces(
                                                        e.target.value
                                                    ),
                                            });
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            {/* PASSWORD */}
                            <Col span={8}>
                                <Form.Item
                                    label="Password"
                                    name="password"
                                    rules={[
                                        validationRules.required("Password"),
                                        validationRules.password(),
                                    ]}
                                >
                                    <Input.Password />
                                </Form.Item>
                            </Col>
                            {/* REMARKS */}
                            <Col span={8}>
                                <Form.Item
                                    label="Remarks"
                                    name="remarks"
                                    rules={[
                                        validationRules.required("Remarks"),
                                        validationRules.remarks(),
                                        validationRules.remarksMinLength(),
                                        validationRules.remarksMaxLength(),
                                    ]}
                                >
                                    <Input.TextArea
                                        rows={4}
                                    />
                                </Form.Item>
                            </Col>
                            {/* DESIGNATION */}
                            <Col span={8}>
                                <Form.Item
                                    label="Designation"
                                    name="designation"
                                    rules={[
                                        validationRules.required("Designation"),
                                        validationRules.designation(),
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>

                            {/* DOB */}
                            <Col span={8}>
                                <Form.Item
                                    label="Date of Birth"
                                    name="dob"
                                    rules={[validationRules.dob()]}
                                >
                                    <Input
                                        placeholder="MM/DD/YYYY"
                                        maxLength={10}
                                        onChange={(e) => {
                                            form.setFieldsValue({
                                                dob: formatters.dobFormatter(
                                                    e.target.value
                                                ),
                                            });
                                        }}
                                    />
                                </Form.Item>
                            </Col>

                            {/* COMPANY NAME */}
                            <Col span={8}>
                                <Form.Item
                                    label="Company Name"
                                    name="companyName"
                                    rules={[
                                        validationRules.required("Company Name"),
                                        validationRules.companyName(),
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>

                        </Row>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>

                            <Button
                                style={{ marginLeft: 10 }}
                                onClick={() => form.resetFields()}
                            >
                                Reset
                            </Button>
                        </Form.Item>
                    </Form>

                </Card>
            </Space>
        </div>
    );
}
