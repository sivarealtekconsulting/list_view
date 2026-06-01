import { Row, Col, Space, Card, Form, Input, Button, Select, Affix, Breadcrumb } from 'antd';
import { validationRules, formatters } from '../components/form/validation';
import StatsCards from '../components/cards/StatsCards';
import JobListView from '../components/pugalistView';
import CalendarCard from '../components/cards/CalendarCard';
import ClientSubmissionCard from '../components/cards/ClientSubmissionCard';
import ClientDetailsCard from '../components/cards/ClientDetailsCard';
import StickyNotesCard from '../components/cards/StickyNotesCard';
import OnboardingCard from '../components/cards/OnboardingCard';
const { TextArea } = Input;
import { FloatButton } from 'antd';

export default function JobsPage() {
  const [form] = Form.useForm();

  const handleCandidateSubmit = (values) => {
    console.log('Candidate Values:', values);
  };
  return (
    <div className="dashboard-wrapper">
      <Breadcrumb
      items={[
        { title: 'Home' },
        { title: 'dashboard' },
      ]}
    />
      <Row gutter={[16, 16]} align="stretch">

        <Col xs={24} lg={16}>
          <Space direction="vertical" size={12} className="jobs-page-left">
            <OnboardingCard />
            <StatsCards />
            <JobListView />
          </Space>
        </Col>

        <Col xs={24} lg={8}>
          <Space direction="vertical" size={12} className="jobs-page-right">
            <CalendarCard />
            <ClientSubmissionCard />
            <StickyNotesCard />
          </Space>
        </Col>

      </Row>

      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <ClientDetailsCard />
      </div>
      <Card
        className="client-details-card candidate-registration-card"
        title="Candidate Registration"
        style={{ marginTop: 16 }}
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          onFinish={handleCandidateSubmit}
        >
          <Row gutter={[16, 8]}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Candidate Name"
                name="candidateName"
                validateTrigger={['onBlur', 'onChange']}
                rules={[
                  validationRules.required('Candidate Name'),
                  validationRules.alphabets(),
                  validationRules.firstNameMinLength(),
                  validationRules.firstNameMaxLength(),
                ]}
              >
                <Input
                  placeholder="Enter candidate name"
                  onChange={(event) => {
                    form.setFieldsValue({
                      candidateName: formatters.fullNameFormatter(event.target.value),
                    });
                  }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Email"
                name="email"
                validateTrigger={['onBlur', 'onChange']}
                rules={[
                  validationRules.required('Email'),
                  validationRules.email(),
                ]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Phone Number"
                name="phone"
                validateTrigger={['onBlur', 'onChange']}
                rules={[
                  validationRules.required('Phone Number'),
                  validationRules.phone(),
                ]}
              >
                <Input
                  maxLength={10}
                  placeholder="Enter phone number"
                  onChange={(event) => {
                    form.setFieldsValue({
                      phone: formatters.phoneFormatter(event.target.value),
                    });
                  }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="MSP Req ID"
                name="mspReqId"
                validateTrigger={['onBlur', 'onChange']}
                rules={[
                  validationRules.required('MSP Req ID'),
                  validationRules.candidateId('MSP Req ID'),
                ]}
              >
                <Input
                  placeholder="Enter MSP Req ID"
                  onChange={(event) => {
                    form.setFieldsValue({
                      mspReqId: formatters.removeExtraSpaces(event.target.value),
                    });
                  }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Job Title"
                name="jobTitle"
                validateTrigger={['onBlur', 'onChange']}
                rules={[
                  validationRules.required('Job Title'),
                  validationRules.alphanumeric(),
                ]}
              >
                <Input placeholder="Enter job title" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Primary Skill"
                name="primarySkill"
                validateTrigger={['onBlur', 'onChange']}
                rules={[
                  validationRules.required('Primary Skill'),
                  validationRules.alphabets(),
                ]}
              >
                <Input placeholder="Example: React JS, Java, Python" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Experience"
                name="experience"
                rules={[
                  validationRules.required('Experience'),
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

            <Col xs={24} md={8}>
              <Form.Item
                label="Contract Type"
                name="contractType"
                rules={[
                  validationRules.required('Contract Type'),
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

            <Col xs={24} md={8}>
              <Form.Item
                label="Skill Match Level"
                name="skillMatchLevel"
                rules={[
                  validationRules.required('Skill Match Level'),
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

            <Col xs={24} md={8}>
              <Form.Item
                label="Work Authorization"
                name="workAuthorization"
                rules={[
                  validationRules.required('Work Authorization'),
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

            <Col xs={24} md={8}>
              <Form.Item
                label="Current Location"
                name="currentLocation"
                validateTrigger={['onBlur', 'onChange']}
                rules={[
                  validationRules.required('Current Location'),
                  validationRules.alphabets(),
                ]}
              >
                <Input placeholder="Enter current location" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Notice Period"
                name="noticePeriod"
                rules={[
                  validationRules.required('Notice Period'),
                ]}
              >
                <Select
                  placeholder="Select notice period"
                  allowClear
                  options={[
                    { value: 'Immediate', label: 'Immediate' },
                    { value: '15 Days', label: '15 Days' },
                    { value: '30 Days', label: '30 Days' },
                    { value: '60 Days', label: '60 Days' },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Recruiter Skill Notes"
                name="remarks"
                validateTrigger={['onBlur', 'onChange']}
                rules={[
                  validationRules.required('Recruiter Skill Notes'),
                  validationRules.remarks(),
                  validationRules.remarksMinLength(),
                  validationRules.remarksMaxLength(),
                ]}
              >
                <TextArea rows={4} placeholder="Enter recruiter notes" />
              </Form.Item>
            </Col>
            {/* 
            < Col xs={24}>
             
            </Col> */}
          </Row>
          <Affix offsetBottom={0}>
            <Card>
              <Row justify="end" gutter={12}>
                <Space>
                  <Button type="primary" htmlType="submit">
                    Submit Candidate
                  </Button>

                  <Button onClick={() => form.resetFields()}>
                    Reset
                  </Button>
                </Space>
              </Row>
            </Card>
          </Affix>
        </Form>

      </Card>

    </div>
  );
}