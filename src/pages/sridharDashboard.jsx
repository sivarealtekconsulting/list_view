import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Space,
  Typography,
} from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import ListView from '../components/ListView';
import CalendarCard from '../components/cards/CalendarCard';
import ClientDetailsCard from '../components/cards/ClientDetailsCard';
import ClientSubmissionCard from '../components/cards/ClientSubmissionCard';
import OnboardingCard from '../components/cards/OnboardingCard';
import StatsCards from '../components/cards/StatsCards';
import StickyNotesCard from '../components/cards/StickyNotesCard';
import { formatters, validationRules } from '../components/form/validation';
import {
  SRIDHAR_DASHBOARD_CARDS,
  SRIDHAR_DASHBOARD_STATS,
  SRIDHAR_JOB_LIST_SUMMARY,
  SRIDHAR_MOCK_JOBS,
} from '../data/jobs';
import { useEffect, useState } from 'react';
import { getHeaderFields, getJobs } from '../services/dropdownApi';

const { Text } = Typography;

const FALLBACK_JOB_HEADER_FIELDS = [
  { label: 'Created date', value: 'createdAt' },
  { label: 'Jobs', value: 'jobs' },
  { label: 'Location', value: 'location' },
  { label: 'Experience', value: 'experience' },
  { label: 'Client Rate', value: 'clientRate' },
  { label: 'Status', value: 'status' },
  { label: 'Priority', value: 'priority' },
  { label: 'Pipeline', value: 'pipeline' },
];

const HEADER_USER_ID = 2;
const HEADER_ROLE_ID = 5;
const HEADER_MODULE = 'jobs';

function firstArray(...values) {
  return values.find(Array.isArray) ?? [];
}

function firstValue(record, keys, fallback) {
  return keys.map((key) => record?.[key]).find((value) => value !== undefined && value !== null && value !== '') ?? fallback;
}

function canonicalHeaderValue(label, value) {
  const normalizedLabel = String(label).trim().toLowerCase();
  const normalizedValue = String(value).trim();

  const labelMap = {
    'created date': 'createdAt',
    'created at': 'createdAt',
    jobs: 'jobs',
    job: 'jobs',
    location: 'location',
    experience: 'experience',
    'client rate': 'clientRate',
    status: 'status',
    priority: 'priority',
    pipeline: 'pipeline',
  };

  return labelMap[normalizedLabel] ?? normalizedValue;
}

function normalizeHeaderField(field, index) {
  const label = firstValue(
    field,
    ['label', 'Label', 'fieldName', 'field_name', 'name', 'fieldLabel', 'displayName', 'display_name', 'headerName'],
    `Field ${index + 1}`
  );
  const value = firstValue(
    field,
    ['value', 'field', 'Field', 'fieldKey', 'field_key', 'key', 'accessor', 'dataIndex', 'fieldName', 'name'],
    label
  );
  const visibleValue = firstValue(field, ['isVisible', 'is_visible', 'visible', 'show', 'isShow', 'enabled'], true);
  const isVisible = typeof visibleValue === 'string'
    ? !['false', '0', 'hide', 'hidden', 'no'].includes(visibleValue.toLowerCase())
    : Boolean(visibleValue);

  return {
    ...field,
    label,
    value: canonicalHeaderValue(label, value),
    isVisible,
  };
}

function normalizeHeaderFields(response) {
  const fields = firstArray(
    response,
    response?.fields,
    response?.visibleFields,
    response?.headers,
    response?.columns,
    response?.items,
    response?.rows,
    response?.data,
    response?.data?.fields,
    response?.data?.visibleFields,
    response?.data?.headers,
    response?.data?.columns
  );

  const normalizedFields = fields
    .map(normalizeHeaderField)
    .filter((field) => field.isVisible && field.value);

  return normalizedFields.length > 0 ? normalizedFields : FALLBACK_JOB_HEADER_FIELDS;
}

function normalizeJobsResponse(response) {
  const jobs = firstArray(response?.joblist, response?.jobs, response?.records, response);
  const tabs = firstArray(response?.tabs, response?.data?.tabs);
  const myJobsTab = tabs.find((tab) => String(tab.title).toLowerCase() === 'my jobs');
  const allJobsTab = tabs.find((tab) => String(tab.title).toLowerCase() === 'all jobs');

  return {
    jobs,
    tabs,
    total: response?.count ?? response?.total ?? response?.totalCount ?? jobs.length,
    summary: {
      myJobsCount: myJobsTab?.count ?? jobs.length,
      allJobsCount: allJobsTab?.count ?? response?.count ?? jobs.length,
    },
  };
}

function jobStatusForTab(tabKey) {
  return String(tabKey) === '4' ? 'all' : 'active';
}

export default function SridharDashboardPage() {
  const [form] = Form.useForm();
  const [jobs, setJobs] = useState([]);
  const [dropdownFields, setDropdownFields] = useState(FALLBACK_JOB_HEADER_FIELDS);
  const [jobTabs, setJobTabs] = useState([]);
  const [jobSummary, setJobSummary] = useState(SRIDHAR_JOB_LIST_SUMMARY);
  const [activeJobTab, setActiveJobTab] = useState('1');
  const [jobsPagination, setJobsPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const handleQuickJobSubmit = (values) => {
    console.log('Quick job intake:', values);
    form.resetFields();
  };

  const jobPage = jobsPagination.current;
  const jobPageSize = jobsPagination.pageSize;

  useEffect(() => {
    const fetchJobsData = async () => {
      try {
        const response = await getJobs({
          jobStatus: jobStatusForTab(activeJobTab),
          limit: jobPageSize,
          offset: (jobPage - 1) * jobPageSize,
        });
        const normalizedResponse = normalizeJobsResponse(response);

        console.log('Fetched Jobs:', response);
        setJobs(normalizedResponse.jobs);
        setJobTabs(normalizedResponse.tabs);
        setJobSummary(normalizedResponse.summary);
        setJobsPagination((current) => ({ ...current, total: normalizedResponse.total }));
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobsData();
  }, [activeJobTab, jobPage, jobPageSize]);

  useEffect(() => {
    const fetchHeaderFields = async () => {
      try {
        const headerData = await getHeaderFields(HEADER_USER_ID, HEADER_ROLE_ID, HEADER_MODULE);

        console.log('Fetched Header Fields:', headerData);
        setDropdownFields(normalizeHeaderFields(headerData));
      } catch (error) {
        console.error('Error fetching header fields:', error);
        setDropdownFields(FALLBACK_JOB_HEADER_FIELDS);
      }
    };

    fetchHeaderFields();
  }, []);

  return (
    <div className='dashboard-wrapper'>
      <Space direction="vertical" size={24}>
        <Row>
          <Col span={24}>
            <Breadcrumb>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>
                <Text strong>Dashboard</Text>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <StatsCards stats={SRIDHAR_DASHBOARD_STATS} />
          </Col>
        </Row>

        <Row gutter={[16, 16]} align="top">
          <Col xs={24} xl={12}>
            <Card title="Quick job intake">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleQuickJobSubmit}
                autoComplete="off"
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Job Title"
                      name="jobTitle"
                      rules={[
                        validationRules.required('Job Title'),
                        validationRules.startsWithCapital(),
                      ]}
                    >
                      <Input
                        onChange={(event) => {
                          form.setFieldsValue({
                            jobTitle: formatters.capitalizeFirstLetter(event.target.value),
                          });
                        }}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Client Company"
                      name="clientCompany"
                      rules={[
                        validationRules.required('Client Company'),
                        validationRules.companyName(),
                      ]}
                    >
                      <Input
                        onChange={(event) => {
                          form.setFieldsValue({
                            clientCompany: formatters.removeExtraSpaces(event.target.value),
                          });
                        }}
                      />
                    </Form.Item>
                  </Col>

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
                        Submit
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

          <Col xs={24} xl={12}>
            <CalendarCard data={SRIDHAR_DASHBOARD_CARDS.calendar} />
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Card
              title={(
                <Space>
                  <TeamOutlined />
                  <Text strong>Jobs List</Text>
                </Space>
              )}
            >
              <ListView
                jobs={jobs.length > 0 ? jobs : SRIDHAR_MOCK_JOBS}
                dropdownFields={dropdownFields.length > 0 ? dropdownFields : FALLBACK_JOB_HEADER_FIELDS}
                summary={jobSummary}
                tabs={jobTabs}
                activeTab={activeJobTab}
                current={jobsPagination.current}
                pageSize={jobsPagination.pageSize}
                total={jobsPagination.total}
                onTabChange={(tabKey) => {
                  setActiveJobTab(tabKey);
                  setJobsPagination((current) => ({ ...current, current: 1 }));
                }}
                onPageChange={(page) => {
                  setJobsPagination((current) => ({ ...current, current: page }));
                }}
                onPageSizeChange={(size) => {
                  setJobsPagination((current) => ({ ...current, current: 1, pageSize: size }));
                }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} align="top">
          <Col xs={24} xl={8}>
            <Space direction="vertical" size={16}>
              <ClientSubmissionCard data={SRIDHAR_DASHBOARD_CARDS.clientSubmission} />
              <OnboardingCard items={SRIDHAR_DASHBOARD_CARDS.onboarding} />
            </Space>
          </Col>

          <Col xs={24} xl={16}>
            <Space direction="vertical" size={16}>
              <StickyNotesCard notes={SRIDHAR_DASHBOARD_CARDS.stickyNotes} />
              <ClientDetailsCard data={SRIDHAR_DASHBOARD_CARDS.clientDetails} />
            </Space>
          </Col>
        </Row>
      </Space>
    </div>
  );
}
