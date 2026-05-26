import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Col,
  Flex,
  Input,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tabs,
  Typography,
} from 'antd';
import {
  CalendarOutlined,
  FilterOutlined,
  SearchOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import AssigneeAvatars from '../components/AssigneeAvatars';
import CustomPagination from '../components/CustomPagination';
import JobListView from '../components/JobListView';
import StatusBadge from '../components/StatusBadge';
import JobFilters from '../components/filters';
import CalendarCard from '../components/cards/CalendarCard';
import ClientDetailsCard from '../components/cards/ClientDetailsCard';
import ClientSubmissionCard from '../components/cards/ClientSubmissionCard';
import OnboardingCard from '../components/cards/OnboardingCard';
import StatsCards from '../components/cards/StatsCards';
import StickyNotesCard from '../components/cards/StickyNotesCard';
import { MOCK_JOBS } from '../data/jobs';

const { Text } = Typography;

const summaryCards = [
  { title: 'Active requisitions', value: 58, suffix: 'live' },
  { title: 'Profiles shared', value: 426, suffix: 'this quarter' },
  { title: 'Client screens', value: 91, suffix: 'planned' },
  { title: 'Aging jobs', value: 13, suffix: 'over 30 days' },
];

const pipelineRows = [
  {
    key: '1',
    job: 'Cloud Data Engineer',
    client: 'Vertex Analytics',
    location: 'Austin, TX',
    status: 'Open',
    submissions: '3 of 6',
    assignees: MOCK_JOBS[0].assignees,
    extraAssignees: 2,
  },
  {
    key: '2',
    job: 'QA Automation Lead',
    client: 'Summit Retail',
    location: 'Phoenix, AZ',
    status: 'Partially Fulfilled',
    submissions: '7 of 12',
    assignees: MOCK_JOBS[1].assignees,
    extraAssignees: 1,
  },
  {
    key: '3',
    job: 'Workday Integration Consultant',
    client: 'Harbor Health',
    location: 'Boston, MA',
    status: 'Fulfilled',
    submissions: '4 of 4',
    assignees: MOCK_JOBS[2].assignees,
    extraAssignees: 0,
  },
];

const activityItems = [
  '5 cloud profiles moved to technical review',
  'Client feedback received for QA Automation Lead',
  'Workday consultant offer package sent for approval',
  'New intake call completed for data platform role',
];

export default function JobCollapsePage() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);
  const [activeTab, setActiveTab] = useState('overview');

  const filteredJobs = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (q.length < 3) {
      return MOCK_JOBS;
    }

    return MOCK_JOBS.filter((job) => (
      job.title.toLowerCase().includes(q)
      || job.client.toLowerCase().includes(q)
      || job.location.toLowerCase().includes(q)
      || job.status.toLowerCase().includes(q)
    ));
  }, [search]);

  const compactRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredJobs.slice(start, start + pageSize);
  }, [filteredJobs, page, pageSize]);

  const pipelineColumns = [
    {
      title: 'Job',
      dataIndex: 'job',
      render: (job, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{job}</Text>
          <Text type="secondary">{record.client}</Text>
        </Space>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
    },
    {
      title: 'Assignee',
      dataIndex: 'assignees',
      render: (assignees, record) => (
        <AssigneeAvatars assignees={assignees} extraAssignees={record.extraAssignees} />
      ),
    },
    {
      title: 'Submissions',
      dataIndex: 'submissions',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => <StatusBadge status={status} />,
    },
  ];

  const compactColumns = [
    {
      title: 'Job',
      dataIndex: 'title',
      render: (title, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{title}</Text>
          <Text type="secondary">{record.client}</Text>
        </Space>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      render: (location, record) => (
        <Space direction="vertical" size={0}>
          <Text>{location}</Text>
          <Text type="secondary">{record.locationType}</Text>
        </Space>
      ),
    },
    {
      title: 'Assignee',
      dataIndex: 'assignees',
      render: (assignees, record) => (
        <AssigneeAvatars assignees={assignees} extraAssignees={record.extraAssignees} />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => <StatusBadge status={status} />,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
    },
  ];

  const tabItems = [
    {
      key: 'overview',
      label: 'Pipeline overview',
      children: (
        <Space direction="vertical" size={16}>
          <Card
            title="Priority pipeline"
            extra={<Badge count={pipelineRows.length} showZero />}
          >
            <Table
              columns={pipelineColumns}
              dataSource={pipelineRows}
              pagination={false}
              size="middle"
            />
          </Card>

          <Card title="Filtered jobs preview">
            <Table
              columns={compactColumns}
              dataSource={compactRows}
              pagination={false}
              size="middle"
            />
            <CustomPagination
              current={page}
              pageSize={pageSize}
              total={filteredJobs.length}
              onChange={setPage}
              onPageSizeChange={(nextSize) => {
                setPageSize(nextSize);
                setPage(1);
              }}
            />
          </Card>
        </Space>
      ),
    },
    {
      key: 'jobs',
      label: 'Full job list',
      children: <JobListView />,
    },
  ];

  return (
    <>
      <Space direction="vertical" size={16}>
        <Card
          title="Job Collapse Workspace"
          extra={(
            <Space>
              <Select
                defaultValue="all"
                size="small"
                options={[
                  { value: 'all', label: 'All jobs' },
                  { value: 'mine', label: 'My jobs' },
                  { value: 'team', label: 'Team jobs' },
                ]}
              />
              <Button icon={<FilterOutlined />} onClick={() => setFiltersOpen(true)}>
                Filters
              </Button>
            </Space>
          )}
        >
        </Card>

        <Row gutter={[16, 16]}>
          {summaryCards.map((item) => (
            <Col key={item.title} xs={24} lg={12}>
              <Card>
                <Statistic
                  title={item.title}
                  value={item.value}
                  suffix={<Text type="secondary">{item.suffix}</Text>}
                />
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} xl={12}>
            <Card title="Delivery activity">
              <Space direction="vertical" size={12}>
                {activityItems.map((item) => (
                  <Space key={item} align="start">
                    <CalendarOutlined />
                    <Text>{item}</Text>
                  </Space>
                ))}
              </Space>
            </Card>
            <StatsCards />

               <ClientDetailsCard />
       
          </Col>
          <Col xs={24} xl={12}>
            <CalendarCard />
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Card
              title={(
                <Space>
                  <TeamOutlined />
                  <Text strong>Jobs command center</Text>
                </Space>
              )}
            >
              <Tabs activeKey={activeTab} items={tabItems} onChange={setActiveTab} />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} xl={12}>
            <ClientSubmissionCard />
               <OnboardingCard />
          </Col>
          <Col xs={24} xl={12}>
            <StickyNotesCard />
          </Col>
        </Row>
      </Space>

      <JobFilters
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        onApply={() => setFiltersOpen(false)}
      />
    </>
  );
}
