import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  Row,
  Space,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import CalendarCard from '../components/cards/CalendarCard';
import ClientDetailsCard from '../components/cards/ClientDetailsCard';
import ClientSubmissionCard from '../components/cards/ClientSubmissionCard';
import OnboardingCard from '../components/cards/OnboardingCard';
import StatsCards from '../components/cards/StatsCards';
import StickyNotesCard from '../components/cards/StickyNotesCard';
import UserForm from '../components/form/forms';
import { formatters, validationRules } from '../components/form/validation';
import ParamListView from '../components/ParamListView';
import { MOCK_JOBS } from '../data/jobs';

const { Text, Title, Paragraph } = Typography;

const candidateRows = [
  {
    key: '1',
    candidate: 'Jayaprakash A',
    role: 'DevOps Engineer',
    location: 'San Jose, CA',
    experience: '6 years',
    status: 'Submitted',
    date: 'Mar 23, 2026',
  },
  {
    key: '2',
    candidate: 'Kiran Kumar',
    role: 'Full Stack Developer',
    location: 'Texas',
    experience: '5 years',
    status: 'Pipeline',
    date: 'Mar 20, 2026',
  },
  {
    key: '3',
    candidate: 'Sano S',
    role: 'Python Developer',
    location: 'Chennai',
    experience: '7 years',
    status: 'Shortlisted',
    date: 'Mar 18, 2026',
  },
  {
    key: '4',
    candidate: 'Haritha Yella',
    role: 'QA Automation Lead',
    location: 'Phoenix, AZ',
    experience: '8 years',
    status: 'Interview',
    date: 'Mar 16, 2026',
  },
  {
    key: '5',
    candidate: 'Revathi Ravi',
    role: 'Cloud Data Engineer',
    location: 'Austin, TX',
    experience: '6 years',
    status: 'Screening',
    date: 'Mar 14, 2026',
  },
];

const activityRows = [
  {
    key: '1',
    event: 'Candidate moved to pipeline',
    owner: 'admin_realtek',
    status: 'Shortlist',
    time: '07:39 PM',
  },
  {
    key: '2',
    event: 'Candidate submitted to client',
    owner: 'delivery_team',
    status: 'Submitted',
    time: '04:17 PM',
  },
  {
    key: '3',
    event: 'Client requested updated resume',
    owner: 'account_owner',
    status: 'Follow up',
    time: '01:24 PM',
  },
  {
    key: '4',
    event: 'Interview slot confirmed',
    owner: 'scheduler',
    status: 'Interview',
    time: '11:05 AM',
  },
];

const skills = ['React', 'Node.js', 'AWS', 'REST APIs', 'Agile delivery'];

const candidateFields = [
  { label: 'Candidate', value: 'candidate' },
  { label: 'Role', value: 'role' },
  { label: 'Location', value: 'location' },
  { label: 'Experience', value: 'experience' },
  { label: 'Status', value: 'status' },
  { label: 'Submitted', value: 'date' },
];

const activityFields = [
  { label: 'Activity', value: 'event' },
  { label: 'Owner', value: 'owner' },
  { label: 'Status', value: 'status' },
  { label: 'Time', value: 'time' },
];

function statusTag(status) {
  const colorByStatus = {
    Submitted: 'green',
    Pipeline: 'blue',
    Shortlisted: 'purple',
    Interview: 'cyan',
    Screening: 'orange',
    'Follow up': 'gold',
    Shortlist: 'geekblue',
  };

  return <Tag color={colorByStatus[status] || 'default'}>{status}</Tag>;
}

export default function SridharDetailPage() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [form] = Form.useForm();
  const job = MOCK_JOBS.find((item) => String(item.id) === String(jobId)) ?? MOCK_JOBS[0];

  const handleNoteSubmit = (values) => {
    console.log('Detail note:', values);
    form.resetFields();
  };

  const detailTabs = [
    {
      key: 'overview',
      label: (
        <Space>
          <FileTextOutlined />
          <span>Overview</span>
        </Space>
      ),
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} xl={16}>
            <Space direction="vertical" size={16}>
              <Card title="Job Summary">
                <Paragraph>
                  This detail view brings together the job context, candidate activity,
                  submissions, notes, onboarding, and client information in one place.
                </Paragraph>
                <Descriptions bordered size="small" column={{ xs: 1, md: 2 }}>
                  <Descriptions.Item label="Job Title">{job.title}</Descriptions.Item>
                  <Descriptions.Item label="Client">{job.client}</Descriptions.Item>
                  <Descriptions.Item label="Location">{job.location}</Descriptions.Item>
                  <Descriptions.Item label="Work Mode">{job.locationType}</Descriptions.Item>
                  <Descriptions.Item label="Experience">{job.experience}</Descriptions.Item>
                  <Descriptions.Item label="Employment Type">{job.employmentType}</Descriptions.Item>
                  <Descriptions.Item label="Client Rate">{`$${job.clientRate}/hr`}</Descriptions.Item>
                  <Descriptions.Item label="Created">{job.createdAt}</Descriptions.Item>
                </Descriptions>
              </Card>

              <Card title="Skills">
                <Space wrap>
                  {skills.map((skill) => (
                    <Tag key={skill}>{skill}</Tag>
                  ))}
                </Space>
              </Card>

              <ParamListView
                listName="Activity"
                fields={activityFields}
                dataSource={activityRows}
              />
            </Space>
          </Col>

          <Col xs={24} xl={8}>
            <Space direction="vertical" size={16}>
              {/* <ClientDetailsCard /> */}
              <CalendarCard />
            </Space>
          </Col>
        </Row>
      ),
    },
    {
      key: 'candidates',
      label: (
        <Space>
          <TeamOutlined />
          <span>Candidates</span>
          <Badge count={candidateRows.length} />
        </Space>
      ),
      children: (
        <Row>
          <Col span={24}>
            <Card title="Submitted Candidates">
              <ParamListView
                listName="Candidates"
                fields={candidateFields}
                dataSource={candidateRows}
              />
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'submission',
      label: 'Submission',
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} xl={12}>
          <Space direction="vertical">
              <ClientSubmissionCard />
              <StickyNotesCard />
              </Space>
          </Col>
        <Col xs={24} xl={12}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <StatsCards />
            </Col>
            <Col span={24}>
              <OnboardingCard />
            </Col>
          </Row>
          </Col>
        </Row>
      ),
    },
    {
      key: 'note',
      label: 'Add Note',
      children: (
        <Row>
          <Col span={24}>
            <Card title="Validated Detail Note">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleNoteSubmit}
                autoComplete="off"
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Contact Email"
                      name="contactEmail"
                      rules={[
                        validationRules.required('Contact Email'),
                        validationRules.email(),
                      ]}
                    >
                      <Input
                        onChange={(event) => {
                          form.setFieldsValue({
                            contactEmail: formatters.removeSpaces(event.target.value),
                          });
                        }}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Phone Number"
                      name="phone"
                      rules={[
                        validationRules.required('Phone Number'),
                        validationRules.phone(),
                      ]}
                      validateTrigger={['onBlur', 'onChange']}
                    >
                      <Input
                        maxLength={10}
                        onChange={(event) => {
                          form.setFieldsValue({
                            phone: formatters.phoneFormatter(event.target.value),
                          });
                        }}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item
                      label="Remarks"
                      name="remarks"
                      rules={[
                        validationRules.required('Remarks'),
                        validationRules.remarks(),
                        validationRules.remarksMinLength(),
                        validationRules.remarksMaxLength(),
                      ]}
                    >
                      <Input.TextArea rows={4} />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Space>
                      <Button type="primary" htmlType="submit">
                        Save Note
                      </Button>
                      <Button htmlType="button" onClick={() => form.resetFields()}>
                        Reset
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'forms',
      label: 'Full Form',
      children: (
        <Row>
          <Col span={24}>
            <Card title="Full Validated Form">
              <UserForm />
            </Card>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <div className="dashboard-wrapper">
      <Space direction="vertical" size={16}>
      <Card>
        <Row gutter={[16, 16]}>
          <Col xs={24} xl={16}>
            <Space align="center">
              {/* <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/sri-dashboard')}
              /> */}
              <Space direction="vertical" size={0}>
                <Title level={4}>{job.title}</Title>
                <Text type="secondary">{job.client}</Text>
              </Space>
            </Space>
          </Col>

          <Col xs={24} xl={8}>
            <Row justify="end">
              <Col>
                <Space wrap>
                  {statusTag(job.status)}
                  <Tag icon={<ClockCircleOutlined />}>{job.createdAgo}</Tag>
                  <Tag icon={<CheckCircleOutlined />}>
                    {`${job.targetSub.filled} of ${job.targetSub.total} target sub`}
                  </Tag>
                </Space>
              </Col>
            </Row>
          </Col>

          <Col xs={24} md={6}>
            <Card size="small">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Location">{job.location}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col xs={24} md={6}>
            <Card size="small">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Experience">{job.experience}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col xs={24} md={6}>
            <Card size="small">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Client Rate">{`$${job.clientRate}/hr`}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col xs={24} md={6}>
            <Card size="small">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Pipeline">{job.pipeline}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>
      </Card>

      <Row>
          <Col span={24}>
            <Card>
              <Tabs items={detailTabs} defaultActiveKey="overview" />
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  );
}
