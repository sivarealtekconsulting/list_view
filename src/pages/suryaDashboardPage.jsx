import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Typography,
  Upload,
} from 'antd';

import {
  PlusOutlined,
  MinusOutlined,
  InboxOutlined,
} from '@ant-design/icons';

import {
  useNavigate,
} from 'react-router-dom';

import { useState } from 'react';

import CalendarCard from '../components/cards/CalendarCard';
import ClientDetailsCard from '../components/cards/ClientDetailsCard';
import ClientSubmissionCard from '../components/cards/ClientSubmissionCard';
import StatsCards from '../components/cards/StatsCards';
import StickyNotesCard from '../components/cards/StickyNotesCard';

import ListViews from '../components/suryaListView';

import {
  validationRules,
  formatters,
} from '../components/form/validation';

const { Text } = Typography;
const { TextArea } = Input;

export default function NewDashboard() {

  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);

  const [form] = Form.useForm();

  const [submitting, setSubmitting] = useState(false);

  const handleCandidateSubmit = (values) => {

    setSubmitting(true);

    console.log('Candidate Values:', values);

    setTimeout(() => {

      setSubmitting(false);

      form.resetFields();

    }, 1000);
  };

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
                  <Text strong>
                    Dashboard
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
        <Col xs={24} md={12}>
          <ClientSubmissionCard />
        </Col>

        <Col xs={24} md={12}>
          <ClientDetailsCard />
        </Col>

        {/* ROW 3 */}
        <Col xs={24} md={12}>
          <StickyNotesCard />
        </Col>

        <Col xs={24} md={12}>
          <CalendarCard />
        </Col>

        {/* FORM BUTTON */}
        <Col span={24}>

          <Card className="dashboard-card">

            <Row justify="space-between" align="middle">

              <Col>

                <Text strong>
                  Candidate Management
                </Text>

              </Col>

              <Col>

                <Button
                  type="primary"
                  icon={
                    showForm
                      ? <MinusOutlined />
                      : <PlusOutlined />
                  }
                  onClick={() =>
                    setShowForm(!showForm)
                  }
                >

                  {
                    showForm
                      ? 'Close Candidate Form'
                      : 'Open Candidate Form'
                  }

                </Button>

              </Col>

            </Row>

          </Card>

        </Col>

        {/* FORM */}
        {
          showForm && (

            <Col span={24}>

              <Card
                title="Candidate Form"
                className="dashboard-card"
              >

                <Form
                  form={form}
                  layout="vertical"
                  autoComplete="off"
                  onFinish={handleCandidateSubmit}
                >

                  <Row gutter={[16, 8]}>

                    {/* CANDIDATE NAME */}
                    <Col xs={24} md={8}>

                      <Form.Item
                        label="Candidate Name"
                        name="candidateName"
                        rules={[
                          validationRules.required(
                            'Candidate Name'
                          ),
                          validationRules.fullName(),
                          validationRules.firstNameMinLength(),
                        ]}
                      >

                        <Input
                          placeholder="Enter candidate name"
                          onChange={(e) => {
                            form.setFieldsValue({
                              candidateName:
                                formatters.fullNameFormatter(
                                  e.target.value
                                ),
                            });
                          }}
                        />

                      </Form.Item>

                    </Col>

                    {/* EMAIL */}
                    <Col xs={24} md={8}>

                      <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                          validationRules.required(
                            'Email'
                          ),
                          validationRules.email(),
                        ]}
                      >

                        <Input
                          placeholder="Enter email address"
                        />

                      </Form.Item>

                    </Col>

                    {/* PHONE */}
                    <Col xs={24} md={8}>

                      <Form.Item
                        label="Phone Number"
                        name="phone"
                        rules={[
                          validationRules.required(
                            'Phone Number'
                          ),
                          validationRules.phone(),
                        ]}
                      >

                        <Input
                          maxLength={10}
                          placeholder="Enter phone number"
                          onChange={(e) => {
                            form.setFieldsValue({
                              phone:
                                formatters.phoneFormatter(
                                  e.target.value
                                ),
                            });
                          }}
                        />

                      </Form.Item>

                    </Col>

                    {/* MSP REQ ID */}
                    <Col xs={24} md={8}>

                      <Form.Item
                        label="MSP Req ID"
                        name="mspReqId"
                        rules={[
                          validationRules.required(
                            'MSP Req ID'
                          ),
                          validationRules.candidateId(
                            'MSP Req ID'
                          ),
                        ]}
                      >

                        <Input
                          placeholder="Enter MSP Req ID"
                        />

                      </Form.Item>

                    </Col>

                    {/* JOB TITLE */}
                    <Col xs={24} md={8}>

                      <Form.Item
                        label="Job Title"
                        name="jobTitle"
                        rules={[
                          validationRules.required(
                            'Job Title'
                          ),
                        ]}
                      >

                        <Input
                          placeholder="Enter job title"
                        />

                      </Form.Item>

                    </Col>

                    {/* PRIMARY SKILL */}
                    <Col xs={24} md={8}>

                      <Form.Item
                        label="Primary Skill"
                        name="primarySkill"
                        rules={[
                          validationRules.required(
                            'Primary Skill'
                          ),
                        ]}
                      >

                        <Input
                          placeholder="Example: React JS, Java, Python"
                        />

                      </Form.Item>

                    </Col>

                    {/* EXPERIENCE */}
                    <Col xs={24} md={8}>

                      <Form.Item
                        label="Experience"
                        name="experience"
                        rules={[
                          validationRules.required(
                            'Experience'
                          ),
                        ]}
                      >

                        <Select
                          placeholder="Select experience"
                          allowClear
                          options={[
                            {
                              value: '0-2 years',
                              label: '0-2 years',
                            },
                            {
                              value: '3-5 years',
                              label: '3-5 years',
                            },
                            {
                              value: '6-8 years',
                              label: '6-8 years',
                            },
                            {
                              value: '9+ years',
                              label: '9+ years',
                            },
                          ]}
                        />

                      </Form.Item>

                    </Col>

                    {/* CONTRACT TYPE */}
                    <Col xs={24} md={8}>

                      <Form.Item
                        label="Contract Type"
                        name="contractType"
                        rules={[
                          validationRules.required(
                            'Contract Type'
                          ),
                        ]}
                      >

                        <Select
                          placeholder="Select contract type"
                          allowClear
                          options={[
                            {
                              value: 'C2C',
                              label: 'C2C',
                            },
                            {
                              value: 'W2-Contract',
                              label: 'W2-Contract',
                            },
                            {
                              value: 'W2-Fulltime',
                              label: 'W2-Fulltime',
                            },
                            {
                              value: '1099',
                              label: '1099',
                            },
                          ]}
                        />

                      </Form.Item>

                    </Col>

                    {/* SKILL MATCH */}
                    <Col xs={24} md={8}>

                      <Form.Item
                        label="Skill Match Level"
                        name="skillMatchLevel"
                        rules={[
                          validationRules.required(
                            'Skill Match Level'
                          ),
                        ]}
                      >

                        <Select
                          placeholder="Select skill match level"
                          allowClear
                          options={[
                            {
                              value: 'Excellent Match',
                              label: 'Excellent Match',
                            },
                            {
                              value: 'Good Match',
                              label: 'Good Match',
                            },
                            {
                              value: 'Partial Match',
                              label: 'Partial Match',
                            },
                            {
                              value: 'Needs Review',
                              label: 'Needs Review',
                            },
                          ]}
                        />

                      </Form.Item>

                    </Col>

                    {/* WORK AUTH */}
                    <Col xs={24} md={12}>

                      <Form.Item
                        label="Work Authorization"
                        name="workAuthorization"
                        rules={[
                          validationRules.required(
                            'Work Authorization'
                          ),
                        ]}
                      >

                        <Select
                          placeholder="Select work authorization"
                          allowClear
                          options={[
                            {
                              value: 'H1B',
                              label: 'H1B',
                            },
                            {
                              value: 'GC',
                              label: 'GC',
                            },
                            {
                              value: 'GC EAD',
                              label: 'GC EAD',
                            },
                            {
                              value: 'US Citizen',
                              label: 'US Citizen',
                            },
                            {
                              value: 'L2 EAD',
                              label: 'L2 EAD',
                            },
                            {
                              value: 'OPT',
                              label: 'OPT',
                            },
                          ]}
                        />

                      </Form.Item>

                    </Col>

                    {/* RESUME */}
                    <Col xs={24} md={12}>

                      <Form.Item
                        label="Resume"
                        name="resume"
                        valuePropName="fileList"
                        getValueFromEvent={(event) =>
                          event?.fileList
                        }
                        rules={[
                          validationRules.singleFileUpload(),
                        ]}
                      >

                        <Upload
                          maxCount={1}
                          beforeUpload={() => false}
                        >

                          <Button
                            icon={<InboxOutlined />}
                          >
                            Upload Resume
                          </Button>

                        </Upload>

                      </Form.Item>

                    </Col>

                    {/* REMARKS */}
                    <Col span={24}>

                      <Form.Item
                        label="Recruiter Skill Notes"
                        name="remarks"
                        rules={[
                          validationRules.required(
                            'Remarks'
                          ),
                          validationRules.remarks(),
                          validationRules.remarksMinLength(),
                          validationRules.remarksMaxLength(),
                        ]}
                      >

                        <TextArea
                          rows={4}
                          placeholder="Example: Strong React and API integration profile."
                        />

                      </Form.Item>

                    </Col>

                    {/* BUTTONS */}
                    <Col span={24}>

                      <Space>

                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={submitting}
                        >
                          Submit Candidate
                        </Button>

                        <Button
                          onClick={() =>
                            form.resetFields()
                          }
                        >
                          Reset
                        </Button>

                      </Space>

                    </Col>

                  </Row>

                </Form>

              </Card>

            </Col>
          )
        }

        {/* LIST VIEW */}
        <Col span={24}>
          <ListViews />
        </Col>

      </Row>

    </div>
  );
}