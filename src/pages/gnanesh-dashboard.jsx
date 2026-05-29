import { useState } from 'react';
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Collapse,
  Form,
  Input,
  Layout,
  Row,
  Select,
  Space,
  Typography,
  Upload,
  message,
} from 'antd';
import {
  InboxOutlined,
} from '@ant-design/icons';

import StatsCards from '../components/cards/StatsCards';
import CalendarCard from '../components/cards/CalendarCard';
import ClientSubmissionCard from '../components/cards/ClientSubmissionCard';
import StickyNotesCard from '../components/cards/StickyNotesCard';
import OnboardingCard from '../components/cards/OnboardingCard';
import GnaneshListView from '../components/GnaneshListView';

const { Content } = Layout;
const { Text } = Typography;
const { TextArea } = Input;

const uploadValidation = {
  beforeUpload: (file) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'application/pdf',
    ];

    const isValidType = allowedTypes.includes(file.type);

    if (!isValidType) {
      message.error('Only JPG, PNG and PDF files are allowed.');
      return Upload.LIST_IGNORE;
    }

    const isValidSize = file.size / 1024 / 1024 <= 2;

    if (!isValidSize) {
      message.error('File upload must be 2 MB or below.');
      return Upload.LIST_IGNORE;
    }

    return false;
  },
};

export default function GnaneshDashboard() {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleCandidateSubmit = (values) => {
    setSubmitting(true);

    console.log('Gnanesh dashboard candidate form:', values);

    message.success('Candidate submission details saved successfully.');
    form.resetFields();
    setSubmitting(false);
  };

  return (
    <Layout className="jobs-page-shell">
      <Layout className="jobs-page-layout">
        <Content className="jobs-page-content">
          <div
            className="jobs-page-breadcrumb-row"
            style={{ padding: "16px 24px 0" }}
          >
            <Breadcrumb
              items={[
                {
                  title: (
                    <Text type="secondary" className="jobs-page-breadcrumb-home">
                      Home
                    </Text>
                  ),
                },
                {
                  title: (
                    <Text strong className="jobs-page-breadcrumb-active">
                      Gnanesh Dashboard
                    </Text>
                  ),
                },
              ]}
            />
          </div>

          <div className="dashboard-wrapper">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <StatsCards />
              </Col>

              <Col xs={24} xl={12}>
                <CalendarCard />
              </Col>

              <Col xs={24} xl={12}>
                <ClientSubmissionCard />
              </Col>

              <Col xs={24} xl={12}>
                <StickyNotesCard />
              </Col>

              <Col xs={24} xl={12}>
                <OnboardingCard />
              </Col>

              <Col span={24}>
                <GnaneshListView />
              </Col>

              <Col span={24}>
                <Card
                  id="gnanesh-candidate-form"
                  className="client-details-card"
                  title={
                    <Space direction="vertical" size={0}>
                      <Text strong>Candidate Skill Submission</Text>
                      <Text type="secondary">
                        Add candidate details, skill strength, work authorization and resume in one validated flow.
                      </Text>
                    </Space>
                  }
                >
                  <Collapse
                    ghost
                    defaultActiveKey={[]}
                    items={[
                      {
                        key: 'candidate-form',
                        label: 'Add skill-matched candidate',
                        children: (
                          <Form
                            form={form}
                            layout="vertical"
                            autoComplete="off"
                            onFinish={handleCandidateSubmit}
                          >
                            <Row gutter={[16, 8]}>
                              <Col xs={24} md={12}>
                                <Form.Item
                                  label="Candidate Name"
                                  name="candidateName"
                                  rules={[
                                    { required: true, message: 'Candidate name is required' },
                                    {
                                      pattern: /^[A-Za-z\s]+$/,
                                      message: 'Candidate name should contain only alphabets',
                                    },
                                    {
                                      min: 3,
                                      message: 'Candidate name should be at least 3 characters',
                                    },
                                  ]}
                                >
                                  <Input placeholder="Enter candidate name" />
                                </Form.Item>
                              </Col>

                              <Col xs={24} md={12}>
                                <Form.Item
                                  label="Email"
                                  name="email"
                                  rules={[
                                    { required: true, message: 'Email is required' },
                                    { type: 'email', message: 'Enter a valid email address' },
                                  ]}
                                >
                                  <Input placeholder="Enter email address" />
                                </Form.Item>
                              </Col>

                              <Col xs={24} md={12}>
                                <Form.Item
                                  label="Phone Number"
                                  name="phone"
                                  rules={[
                                    { required: true, message: 'Phone number is required' },
                                    {
                                      pattern: /^[0-9]{10}$/,
                                      message: 'Phone number must be 10 digits',
                                    },
                                  ]}
                                >
                                  <Input
                                    maxLength={10}
                                    placeholder="Enter phone number"
                                  />
                                </Form.Item>
                              </Col>

                              <Col xs={24} md={12}>
                                <Form.Item
                                  label="MSP Req ID"
                                  name="mspReqId"
                                  rules={[
                                    { required: true, message: 'MSP Req ID is required' },
                                    {
                                      pattern: /^[A-Za-z0-9-]+$/,
                                      message: 'MSP Req ID can contain only letters, numbers and hyphen',
                                    },
                                  ]}
                                >
                                  <Input placeholder="Enter MSP Req ID" />
                                </Form.Item>
                              </Col>

                              <Col xs={24} md={12}>
                                <Form.Item
                                  label="Job Title"
                                  name="jobTitle"
                                  rules={[
                                    { required: true, message: 'Job title is required' },
                                  ]}
                                >
                                  <Input placeholder="Enter job title" />
                                </Form.Item>
                              </Col>

                              <Col xs={24} md={12}>
                                <Form.Item
                                  label="Primary Skill"
                                  name="primarySkill"
                                  rules={[
                                    { required: true, message: 'Primary skill is required' },
                                  ]}
                                >
                                  <Input placeholder="Example: React JS, Java, Python" />
                                </Form.Item>
                              </Col>

                              <Col xs={24} md={12}>
                                <Form.Item
                                  label="Experience"
                                  name="experience"
                                  rules={[
                                    { required: true, message: 'Experience is required' },
                                  ]}
                                >
                                  <Select
                                    placeholder="Select experience"
                                    allowClear
                                    options={[
                                      { value: '0-2 years', label: '0-2 years' },
                                      { value: '3-5 years', label: '3-5 years' },
                                      { value: '6-8 years', label: '6-8 years' },
                                      { value: '9+ years', label: '9+ years' },
                                    ]}
                                  />
                                </Form.Item>
                              </Col>

                              <Col xs={24} md={12}>
                                <Form.Item
                                  label="Contract Type"
                                  name="contractType"
                                  rules={[
                                    { required: true, message: 'Contract type is required' },
                                  ]}
                                >
                                  <Select
                                    placeholder="Select contract type"
                                    allowClear
                                    options={[
                                      { value: 'C2C', label: 'C2C' },
                                      { value: 'W2-Contract', label: 'W2-Contract' },
                                      { value: 'W2-Fulltime', label: 'W2-Fulltime' },
                                      { value: '1099', label: '1099' },
                                    ]}
                                  />
                                </Form.Item>
                              </Col>

                              <Col xs={24} md={12}>
                                <Form.Item
                                  label="Skill Match Level"
                                  name="skillMatchLevel"
                                  rules={[
                                    { required: true, message: 'Skill match level is required' },
                                  ]}
                                >
                                  <Select
                                    placeholder="Select skill match level"
                                    allowClear
                                    options={[
                                      { value: 'Excellent Match', label: 'Excellent Match' },
                                      { value: 'Good Match', label: 'Good Match' },
                                      { value: 'Partial Match', label: 'Partial Match' },
                                      { value: 'Needs Review', label: 'Needs Review' },
                                    ]}
                                  />
                                </Form.Item>
                              </Col>

                              <Col xs={24} md={12}>
                                <Form.Item
                                  label="Work Authorization"
                                  name="workAuthorization"
                                  rules={[
                                    { required: true, message: 'Work authorization is required' },
                                  ]}
                                >
                                  <Select
                                    placeholder="Select work authorization"
                                    allowClear
                                    options={[
                                      { value: 'H1B', label: 'H1B' },
                                      { value: 'GC', label: 'GC' },
                                      { value: 'GC EAD', label: 'GC EAD' },
                                      { value: 'US Citizen', label: 'US Citizen' },
                                      { value: 'L2 EAD', label: 'L2 EAD' },
                                      { value: 'OPT', label: 'OPT' },
                                    ]}
                                  />
                                </Form.Item>
                              </Col>

                              <Col xs={24} md={12}>
                                <Form.Item
                                  label="Resume"
                                  name="resume"
                                  valuePropName="fileList"
                                  getValueFromEvent={(event) => event?.fileList}
                                  rules={[
                                    { required: true, message: 'Resume is required' },
                                  ]}
                                >
                                  <Upload
                                    maxCount={1}
                                    beforeUpload={uploadValidation.beforeUpload}
                                  >
                                    <Button icon={<InboxOutlined />}>
                                      Upload Resume
                                    </Button>
                                  </Upload>
                                </Form.Item>
                              </Col>

                              <Col span={24}>
                                <Form.Item
                                  label="Recruiter Skill Notes"
                                  name="remarks"
                                  rules={[
                                    { required: true, message: 'Remarks are required' },
                                    {
                                      min: 10,
                                      message: 'Remarks should be at least 10 characters',
                                    },
                                    {
                                      max: 300,
                                      message: 'Remarks should not exceed 300 characters',
                                    },
                                  ]}
                                >
                                  <TextArea
                                    rows={4}
                                    placeholder="Example: Strong React and API integration profile. Good fit for frontend-heavy client requirement."
                                  />
                                </Form.Item>
                              </Col>

                              <Col span={24}>
                                <Space>
                                  <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={submitting}
                                  >
                                    Submit Candidate
                                  </Button>

                                  <Button onClick={() => form.resetFields()}>
                                    Reset
                                  </Button>
                                </Space>
                              </Col>
                            </Row>
                          </Form>
                        ),
                      },
                    ]}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}