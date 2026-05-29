import { useNavigate, useParams } from 'react-router-dom';
import {
  Badge,
  Breadcrumb,
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
import SridharListView from '../components/sridharListView';
import {
  SRIDHAR_DASHBOARD_CARDS,
  SRIDHAR_DASHBOARD_STATS,
  SRIDHAR_DETAIL_DATA,
  SRIDHAR_JOB_LIST_SUMMARY,
  SRIDHAR_MOCK_JOBS,
} from '../data/jobs';

const { Text, Title, Paragraph } = Typography;

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
  const job = SRIDHAR_MOCK_JOBS.find((item) => String(item.id) === String(jobId)) ?? SRIDHAR_MOCK_JOBS[0];
  const candidateRows = SRIDHAR_DETAIL_DATA.candidates;
  const activityRows = SRIDHAR_DETAIL_DATA.activity;
  const skills = SRIDHAR_DETAIL_DATA.skills;

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
    <Row gutter={[16, 16]} align="top">
      <Col xs={24} xl={16}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Card title="Job Summary">
            <Paragraph>
              {SRIDHAR_DETAIL_DATA.summaryText}
            </Paragraph>

            <Descriptions
              bordered
              size="small"
              column={{ xs: 1, sm: 1, md: 2 }}
            >
              <Descriptions.Item label="Job Title">
                {job.title}
              </Descriptions.Item>
              <Descriptions.Item label="Client">
                {job.client}
              </Descriptions.Item>
              <Descriptions.Item label="Location">
                {job.location}
              </Descriptions.Item>
              <Descriptions.Item label="Work Mode">
                {job.locationType}
              </Descriptions.Item>
              <Descriptions.Item label="Experience">
                {job.experience}
              </Descriptions.Item>
              <Descriptions.Item label="Employment Type">
                {job.employmentType}
              </Descriptions.Item>
              <Descriptions.Item label="Client Rate">
                {`$${job.clientRate}/hr`}
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {job.createdAt}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Skills">
            <Space wrap>
              {skills?.map((skill) => (
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
        <Space direction="vertical" size="middle" block>
          <CalendarCard
            data={SRIDHAR_DASHBOARD_CARDS.calendar}
          />
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
              <SridharListView jobs={SRIDHAR_MOCK_JOBS} summary={SRIDHAR_JOB_LIST_SUMMARY} />
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
              <ClientSubmissionCard data={SRIDHAR_DASHBOARD_CARDS.clientSubmission} />
              <StickyNotesCard notes={SRIDHAR_DASHBOARD_CARDS.stickyNotes} />
              </Space>
          </Col>
        <Col xs={24} xl={12}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <StatsCards stats={SRIDHAR_DASHBOARD_STATS} />
            </Col>
            <Col span={24}>
              <OnboardingCard items={SRIDHAR_DASHBOARD_CARDS.onboarding} />
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
      <Row>
        <Col span={24}>
          <Breadcrumb>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>
              <Text onClick={() => navigate('/sri-dashboard')}>
                Dashboard
              </Text>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Text strong>Detail View</Text>
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>

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
