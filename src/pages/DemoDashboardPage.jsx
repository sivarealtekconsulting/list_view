import { useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Progress,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import {
  AppstoreOutlined,
  BellOutlined,
  CalendarOutlined,
  CarryOutOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
  FilterOutlined,
  FlagOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MoreOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  SettingOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from '@ant-design/icons';
import JobFilters from '../components/filters';
import StatusBadge from '../components/StatusBadge';
import '../styles/DemoDashboardPage.css';

const { Text, Title, Link } = Typography;
const { RangePicker } = DatePicker;

const navItems = [
  { label: 'Dashboard', icon: <AppstoreOutlined /> },
  { label: 'Jobs', icon: <CarryOutOutlined /> },
  { label: 'Candidates', icon: <TeamOutlined /> },
  { label: 'Clients', icon: <UserOutlined /> },
  { label: 'Interviews', icon: <BellOutlined /> },
  { label: 'Reports', icon: <UnorderedListOutlined /> },
  { label: 'Settings', icon: <SettingOutlined /> },
];

const metrics = [
  { label: 'Total Jobs', value: '1,697', trend: '12.5%', icon: <CarryOutOutlined />, tone: 'blue' },
  { label: 'Active Jobs', value: '1,685', trend: '11.3%', icon: <CheckCircleOutlined />, tone: 'green' },
  { label: 'My Jobs', value: '600', trend: '8.7%', icon: <UserOutlined />, tone: 'purple' },
  { label: 'Total Candidates', value: '2,458', trend: '9.4%', icon: <TeamOutlined />, tone: 'orange' },
];

const candidates = [
  { key: '1', candidateId: 'AUTO123456', name: 'KIRAN ERRAVALLA', jobId: '101528088 - 51779', stage: 'Po Not Initiated', status: 'Open', gross: 12, net: 2.8 },
  { key: '2', candidateId: 'AUTO549812', name: 'HARITHA YELLA', jobId: '765484511', stage: 'CFO Pending', status: 'Pipeline', gross: 10, net: -64.16 },
  { key: '3', candidateId: 'AUTO945121', name: 'ANDRIY KUDASHEV', jobId: '478494510', stage: 'Po Issued', status: 'Closed', gross: 8, net: 8 },
  { key: '4', candidateId: 'AUTO978451', name: 'REVATHI RAVI', jobId: '798464121', stage: 'Po Not Initiated', status: 'Open', gross: 8, net: -11.05 },
  { key: '5', candidateId: 'AUTO961214', name: 'VENKATESH', jobId: '974623017', stage: 'Po Not Initiated', status: 'Hold', gross: 6, net: 1.27 },
  { key: '6', candidateId: 'AUTO984671', name: 'ROHAN DHOYDA', jobId: '654715121', stage: 'Po Not Initiated', status: 'Open', gross: 6, net: 255.84 },
];

const calendarRows = [
  [29, 30, 31, 1, 2, 3, 4],
  [5, 6, 7, 8, 9, 10, 11],
  [12, 13, 14, 15, 16, 17, 18],
  [19, 20, 21, 22, 23, 24, 25],
  [26, 27, 28, 29, 30, 1, 2],
];

const calendarDots = {
  1: ['neutral', 'blue'],
  5: ['red'],
  7: ['blue'],
  8: ['orange', 'blue'],
  10: ['blue'],
  11: ['green'],
  12: ['blue'],
  13: ['red'],
  14: ['orange'],
  17: ['blue'],
};

const stageData = [
  { name: 'Po Not Initiated', value: 650, percent: 38.6, color: '#3b82f6' },
  { name: 'CFO Pending', value: 320, percent: 19, color: '#60a5fa' },
  { name: 'Po Issued', value: 280, percent: 16.6, color: '#22c55e' },
  { name: 'In Progress', value: 235, percent: 13.9, color: '#fb923c' },
  { name: 'On Hold', value: 120, percent: 7.1, color: '#f97316' },
  { name: 'Closed', value: 80, percent: 4.8, color: '#334155' },
];

const activity = [
  ['KIRAN ERRAVALLA', 'moved to Po Not Initiated', '10 mins ago', 'blue'],
  ['HARITHA YELLA', 'interview scheduled with Client', '1 hour ago', 'blue'],
  ['ANDRIY KUDASHEV', 'Po Issued', '2 hours ago', 'green'],
  ['REVATHI RAVI', 'exit process initiated', '3 hours ago', 'red'],
  ['New job added:', 'Senior Data Engineer', '5 hours ago', 'blue'],
];

const interviews = [
  ['APR', '08', 'KIRAN ERRAVALLA', 'UI Developer', '10:00 AM - 11:00 AM'],
  ['APR', '08', 'HARITHA YELLA', 'Business Analyst', '02:00 PM - 03:00 PM'],
  ['APR', '09', 'ROHAN DHOYDA', 'DevOps Engineer', '11:00 AM - 12:00 PM'],
];

const currency = (value) => `${value < 0 ? '-' : ''}$${Math.abs(value).toFixed(2)}`;

function MetricCard({ metric }) {
  return (
    <Card className="demo-metric-card">
      <div>
        <Text className="demo-card-label">{metric.label}</Text>
        <Title level={3}>{metric.value}</Title>
        <Text className="demo-trend">Up {metric.trend} <span>vs last month</span></Text>
      </div>
      <div className={`demo-metric-icon ${metric.tone}`}>{metric.icon}</div>
    </Card>
  );
}

function CalendarPanel() {
  return (
    <Card className="demo-panel demo-calendar-panel">
      <div className="demo-panel-head">
        <Title level={4}>Job Calendar</Title>
        <Space>
          <Button type="text" size="small">{'<'}</Button>
          <Text strong>April 2026</Text>
          <Button type="text" size="small">{'>'}</Button>
        </Space>
        <Select size="small" defaultValue="month" options={[{ label: 'Month', value: 'month' }]} />
      </div>
      <div className="demo-calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <Text key={day} className="demo-calendar-day">{day}</Text>
        ))}
        {calendarRows.flat().map((day, index) => {
          const muted = index < 3 || index > 32;
          return (
            <div key={`${day}-${index}`} className={`demo-calendar-cell ${day === 8 && !muted ? 'active' : ''} ${muted ? 'muted' : ''}`}>
              <span>{day}</span>
              <div>
                {(calendarDots[day] || []).map((tone) => <i key={tone} className={tone} />)}
              </div>
            </div>
          );
        })}
      </div>
      <Space wrap className="demo-legend">
        <span><i className="green" /> Onboarded</span>
        <span><i className="red" /> Exit</span>
        <span><i className="orange" /> To-do</span>
        <span><i className="blue" /> Interview</span>
      </Space>
    </Card>
  );
}

function AddJobForm() {
  return (
    <Card className="demo-panel">
      <Title level={4}>Add New Job</Title>
      <Form layout="vertical" requiredMark={false}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="Client" required>
              <Select placeholder="Select Client" options={[{ label: 'Realtek Consulting LLC', value: 'realtek' }]} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Job Title" required>
              <Input placeholder="Enter job title" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Job ID">
              <Input placeholder="Auto generated" disabled />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Hiring Manager">
              <Select placeholder="Select hiring manager" options={[{ label: 'Sony Mathew', value: 'sony' }]} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Job Type">
              <Select placeholder="Select job type" options={[{ label: 'Contract', value: 'contract' }]} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Status">
              <Select defaultValue="active" options={[{ label: 'Active', value: 'active' }]} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="No. of Openings" required>
              <Input placeholder="Enter openings" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Priority">
              <Select
                placeholder="Select priority"
                suffixIcon={<FlagOutlined />}
                options={[{ label: 'High', value: 'high' }, { label: 'Medium', value: 'medium' }]}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Job Description">
              <Input.TextArea rows={3} placeholder="Enter job description" />
            </Form.Item>
          </Col>
        </Row>
        <div className="demo-form-actions">
          <Button>Cancel</Button>
          <Button type="primary">Save Job</Button>
        </div>
      </Form>
    </Card>
  );
}

export default function DemoDashboardPage() {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const columns = [
    { title: 'Candidate ID', dataIndex: 'candidateId', render: (value) => <Text>{value}</Text> },
    { title: 'Name', dataIndex: 'name', render: (value) => <Link>{value}</Link> },
    { title: 'Client Job ID', dataIndex: 'jobId' },
    { title: 'Stage', dataIndex: 'stage', render: (value) => <Tag className="demo-stage-tag">{value}</Tag> },
    { title: 'Status', dataIndex: 'status', render: (value) => <StatusBadge status={value} /> },
    { title: 'Gross Margin', dataIndex: 'gross', render: (value) => currency(value) },
    {
      title: 'Net Margin',
      dataIndex: 'net',
      render: (value) => <Text className={value < 0 ? 'demo-negative' : 'demo-positive'}>{currency(value)}</Text>,
    },
    { title: 'Actions', key: 'actions', align: 'center', render: () => <Button type="text" icon={<MoreOutlined />} /> },
  ];

  return (
    <div className="demo-dashboard">
      <aside className="demo-sidebar">
        <div className="demo-logo">R</div>
        {navItems.map((item) => (
          <Tooltip key={item.label} title={item.label} placement="right">
            <button className={item.label === 'Dashboard' ? 'active' : ''} type="button">
              {item.icon}
              <span>{item.label}</span>
            </button>
          </Tooltip>
        ))}
      </aside>

      <main className="demo-main">
        <header className="demo-topbar">
          <Space>
            <CarryOutOutlined />
            <Text strong>Realtek Consulting LLC</Text>
          </Space>
          <Space size={22}>
            <Badge count={3}><MailOutlined /></Badge>
            <Badge count={6}><BellOutlined /></Badge>
            <Avatar src="https://i.pravatar.cc/80?img=32" />
            <Text>Subha Seline</Text>
          </Space>
        </header>

        <div className="demo-titlebar">
          <Title level={3}>Dashboard</Title>
          <Button type="primary" icon={<PlusOutlined />}>Add Job</Button>
        </div>

        <section className="demo-content">
          {/* <Card className="demo-filter-strip">
            <Row gutter={[16, 12]} align="bottom">
              <Col xs={24} md={8} xl={5}>
                <Text>Date Range</Text>
                <RangePicker className="demo-full" suffixIcon={<CalendarOutlined />} />
              </Col>
              <Col xs={24} md={8} xl={5}>
                <Text>Client</Text>
                <Select className="demo-full" defaultValue="all" options={[{ label: 'All Clients', value: 'all' }]} />
              </Col>
              <Col xs={24} md={8} xl={5}>
                <Text>Job Status</Text>
                <Select className="demo-full" defaultValue="all" options={[{ label: 'All Status', value: 'all' }]} />
              </Col>
              <Col xs={24} md={8} xl={5}>
                <Text>Stage</Text>
                <Select className="demo-full" defaultValue="all" options={[{ label: 'All Stages', value: 'all' }]} />
              </Col>
              <Col xs={24} md={8} xl={4}>
                {/* <Space>
                  <Button icon={<FilterOutlined />} onClick={() => setFiltersOpen(true)}>More Filters</Button>
                  <Button icon={<ReloadOutlined />}>Reset</Button>
                </Space> */}
              {/* </Col> */}
            {/* </Row> */}
          {/* </Card> */}

          <Row gutter={[16, 16]}>
            {metrics.map((metric) => (
              <Col key={metric.label} xs={24} sm={12} xl={6}>
                <MetricCard metric={metric} />
              </Col>
            ))}
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} xl={12}><CalendarPanel /></Col>
            <Col xs={24} xl={12}><AddJobForm /></Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={6}>
              <Card className="demo-panel demo-side-filter">
                <div className="demo-filter-head">
                  <Title level={5}>Filters</Title>
                  <Button type="link" size="small">Clear All</Button>
                </div>
                <Space direction="vertical" size={12} className="demo-full">
                  <Input prefix={<SearchOutlined />} placeholder="Search by name, ID, email..." />
                  <Select placeholder="All Stages" className="demo-full" />
                  <Select placeholder="All Status" className="demo-full" />
                  <RangePicker className="demo-full" />
                  <Select placeholder="Work Authorization" className="demo-full" />
                  <Select placeholder="Select skills" className="demo-full" />
                  <Button type="primary" ghost>Apply Filters (0)</Button>
                </Space>
              </Card>
            </Col>
            <Col xs={24} lg={18}>
              <Card className="demo-panel demo-table-card">
                <div className="demo-table-head">
                  <Tabs
                    defaultActiveKey="list"
                    items={[
                      { key: 'list', label: 'Candidate List' },
                      { key: 'cards', label: 'Candidate Cards' },
                    ]}
                  />
                  <Space>
                    <Button icon={<MenuFoldOutlined />} />
                    <Button icon={<AppstoreOutlined />} />
                    <Button icon={<DownloadOutlined />}>Export</Button>
                  </Space>
                </div>
                <Table
                  columns={columns}
                  dataSource={candidates}
                  pagination={{ pageSize: 6, showSizeChanger: false }}
                  scroll={{ x: 900 }}
                  size="middle"
                />
              </Card>
            </Col>
          </Row>

          {/* <Row gutter={[16, 16]}>
            <Col xs={24} lg={8}>
              <Card className="demo-panel">
                <Title level={5}>Jobs by Stage</Title>
                <div className="demo-stage-card">
                  <Progress type="circle" percent={100} format={() => <><Text>Total</Text><strong>1,685</strong></>} strokeColor={stageData.reduce((acc, item) => ({ ...acc, [item.percent]: item.color }), {})} />
                  <div className="demo-stage-list">
                    {stageData.map((item) => (
                      <span key={item.name}><i style={{ background: item.color }} /> {item.name} <b>{item.value}</b> ({item.percent}%)</span>
                    ))}
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card className="demo-panel">
                <Title level={5}>Recent Activity</Title>
                <Space direction="vertical" size={12} className="demo-full">
                  {activity.map(([name, text, time, tone]) => (
                    <div className="demo-activity" key={`${name}-${time}`}>
                      <CheckCircleOutlined className={tone} />
                      <Text><Link>{name}</Link> {text}<small>{time}</small></Text>
                    </div>
                  ))}
                </Space>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card className="demo-panel">
                <div className="demo-filter-head">
                  <Title level={5}>Upcoming Interviews</Title>
                  <Button type="link" size="small">View All</Button>
                </div>
                <Space direction="vertical" size={12} className="demo-full">
                  {interviews.map(([month, day, name, role, time]) => (
                    <div className="demo-interview" key={`${name}-${time}`}>
                      <div><span>{month}</span><strong>{day}</strong></div>
                      <Text><Link>{name}</Link>{role}<small>{time}</small></Text>
                      <Button size="small" icon={<PlusOutlined />}>Meet</Button>
                    </div>
                  ))}
                </Space>
              </Card>
            </Col>
          </Row> */}
        </section>
      </main>

      <JobFilters open={filtersOpen} onClose={() => setFiltersOpen(false)} onApply={() => setFiltersOpen(false)} />
    </div>
  );
}
