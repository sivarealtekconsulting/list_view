import {
  Avatar, Breadcrumb, Button, Dropdown, Input,
  Layout, Menu, Space, Table, Tag, Typography,
} from 'antd';
import {
  AppstoreOutlined,
  AuditOutlined,
  BarChartOutlined,
  BankOutlined,
  CalendarOutlined,
  CaretDownOutlined,
  ClockCircleOutlined,
  DownOutlined,
  FileTextOutlined,
  FilterOutlined,
  MailOutlined,
  NotificationOutlined,
  PlusOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  SendOutlined,
  ShareAltOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Sider, Header, Content } = Layout;
const { Text, Link } = Typography;

/* -- Mock data -- */
const candidates = [
  {
    key: '1',
    createdDate: '2 months ago',
    name: 'LOKE M SHAHID',
    hasNav: false,
    designation: 'Senior Software Engineer',
    location: 'California Gully, Australia',
    experience: '12 Years',
    skills: ['Java', 'Python', 'HTML', 'JIRA'],
    skillsExtra: 5,
    workAuth: 'L2 EAD',
    source: 'LinkedIn',
  },
  {
    key: '2',
    createdDate: '2 months ago',
    name: 'RAHUL DEV MOHAMED',
    hasNav: true,
    designation: 'Developer',
    location: 'Texas',
    experience: '10 Years',
    skills: ['SQL', 'Power BI', 'ETL Pipelines'],
    skillsExtra: 2,
    workAuth: 'H1B',
    source: 'Email',
  },
  {
    key: '3',
    createdDate: '2 months ago',
    name: 'VELUSAMY VENKATRAMAN',
    hasNav: true,
    designation: 'React Developer',
    location: 'Texas',
    experience: '10 Years',
    skills: ['Testing', 'JIRA'],
    skillsExtra: 0,
    workAuth: 'L2 EAD',
    source: 'LinkedIn',
  },
  {
    key: '4',
    createdDate: '2 months ago',
    name: 'KIRAN ERRAVALLA',
    hasNav: false,
    designation: 'Developer',
    location: 'California Gully, Australia',
    experience: '12 Years',
    skills: ['CSS', 'JavaScript', 'R', 'HTML'],
    skillsExtra: 5,
    workAuth: 'L2 EAD',
    source: 'Email',
  },
  {
    key: '5',
    createdDate: '2 months ago',
    name: 'SANO S',
    hasNav: false,
    designation: 'Principal User Interface Engineer',
    location: 'Texas',
    experience: '10 Years',
    skills: ['SQL', 'Power BI', 'ETL Pipelines'],
    skillsExtra: 2,
    workAuth: 'L2 EAD',
    source: 'LinkedIn',
  },
];

/* -- Table columns -- */
const columns = [
  {
    title: 'Created Date',
    dataIndex: 'createdDate',
    sorter: true,
    render: val => (
      <Space size={6}>
        <ClockCircleOutlined style={{ color: '#9ca3af' }} />
        <Text type="secondary">{val}</Text>
      </Space>
    ),
  },
  {
    title: 'Candidate Name',
    dataIndex: 'name',
    sorter: true,
    render: (name, record) => (
      <Space size={6}>
        <Link strong style={{ color: '#1d4ed8' }}>{name}</Link>
        {record.hasNav && <SendOutlined style={{ color: '#1d4ed8', fontSize: 13 }} />}
      </Space>
    ),
  },
  {
    title: 'Designation',
    dataIndex: 'designation',
    sorter: true,
    render: val => <Text type="secondary">{val}</Text>,
  },
  {
    title: 'Location / Exp',
    dataIndex: 'location',
    sorter: true,
    render: (_, record) => (
      <Space direction="vertical" size={0}>
        <Text>{record.location}</Text>
        <Text type="secondary" style={{ fontSize: 12 }}>{record.experience}</Text>
      </Space>
    ),
  },
  {
    title: 'Skills',
    dataIndex: 'skills',
    sorter: true,
    render: (skills, record) => (
      <Space size={[4, 4]} wrap>
        {skills.map(s => (
          <Tag key={s} color="default">{s}</Tag>
        ))}
        {record.skillsExtra > 0 && (
          <Tag color="blue">+{record.skillsExtra}</Tag>
        )}
      </Space>
    ),
  },
  {
    title: 'Work Auth',
    dataIndex: 'workAuth',
    sorter: true,
    render: val => <Text>{val}</Text>,
  },
  {
    title: 'Source',
    dataIndex: 'source',
    sorter: true,
    render: val => <Text type="secondary">{val}</Text>,
  },
];

/* -- Sidebar menu items -- */
const sideMenuItems = [
  { key: 'dashboard',      icon: <AppstoreOutlined />,          label: '' },
  { key: 'jobs',           icon: <FileTextOutlined />,           label: '' },
  { key: 'candidates',     icon: <TeamOutlined />,               label: '' },
  { key: 'submissions',    icon: <SendOutlined />,               label: '' },
  { key: 'reports',        icon: <BarChartOutlined />,           label: '' },
  { key: 'social',         icon: <ShareAltOutlined />,           label: '' },
  { key: 'notifications',  icon: <NotificationOutlined />,       label: '' },
  { key: 'calendar',       icon: <CalendarOutlined />,           label: '' },
  { key: 'documents',      icon: <AuditOutlined />,              label: '' },
  { key: 'compliance',     icon: <SafetyCertificateOutlined />,  label: '' },
];

const actionsMenu = {
  items: [
    { key: 'export', label: 'Export' },
    { key: 'import', label: 'Import' },
    { key: 'delete', label: 'Delete Selected' },
  ],
};

export default function CandidatesPage() {
  const navigate = useNavigate();
  return (
    <Layout style={{ minHeight: '100vh' }}>

      {/* -- Left Sidebar -- */}
      <Sider
        width={64}
        style={{ background: '#1a237e', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        {/* Brand icon */}
        <div style={{ padding: '18px 0', display: 'flex', justifyContent: 'center' }}>
          <BankOutlined style={{ fontSize: 24, color: '#ffffff' }} />
        </div>

        <Menu
          mode="inline"
          selectedKeys={['candidates']}
          style={{ background: 'transparent', border: 'none', flex: 1 }}
          inlineCollapsed
          items={sideMenuItems.map(item => ({
            ...item,
            style: { color: '#ffffffaa', padding: '0 20px' },
          }))}
        />
      </Sider>

      <Layout>

        {/* -- Top Header -- */}
        <Header style={{ background: '#ffffff', padding: '0 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Space size={8} align="center">
            <BankOutlined style={{ fontSize: 16, color: '#374151' }} />
            <Text strong style={{ fontSize: 15, color: '#1a1a2e' }}>Realtek Consulting LLC</Text>
          </Space>
          <Space size={16} align="center">
            <Button type="text" icon={<MailOutlined style={{ fontSize: 18 }} />} />
            <Space size={8} align="center">
              <Avatar size={32} icon={<UserOutlined />} style={{ background: '#1d4ed8' }} />
              <Text strong style={{ fontSize: 13 }}>Jayaprakash A</Text>
              <CaretDownOutlined style={{ fontSize: 11, color: '#9ca3af' }} />
            </Space>
          </Space>
        </Header>

        <Content style={{ background: '#f5f6fa', padding: '0 24px 24px' }}>

          {/* -- Breadcrumb row -- */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
            <Breadcrumb
              items={[
                { title: <Text type="secondary">Home</Text> },
                { title: <Text strong style={{ color: '#1d4ed8' }}>Candidates</Text> },
              ]}
            />
            <Link style={{ color: '#1d4ed8', fontWeight: 600 }}>View Summary</Link>
          </div>

          {/* -- Search / filter bar -- */}
          <div style={{ background: '#ffffff', borderRadius: 8, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <Space size={8} align="center">
              <SearchOutlined style={{ color: '#1d4ed8', fontSize: 16 }} />
              <Text strong style={{ color: '#1d4ed8', fontSize: 14 }}>All Candidate (06)</Text>
            </Space>
            <Space size={8}>
              <Input
                placeholder="Search by candidate, source, job title, location…"
                prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
                style={{ width: 340 }}
                variant="borderless"
              />
              <Button type="text" icon={<PlusOutlined style={{ color: '#1d4ed8' }} />} onClick={() => navigate('/candidates/add')} />
              <Button type="text" icon={<FilterOutlined style={{ color: '#1d4ed8' }} />} />
            </Space>
          </div>

          {/* -- Table toolbar -- */}
          <div style={{ background: '#ffffff', borderRadius: '8px 8px 0 0', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #f0f0f0' }}>
            <Button type="text" icon={<UnorderedListOutlined />} size="small" />
            <Dropdown menu={actionsMenu}>
              <Button type="text" size="small">
                <Space size={4}>
                  Actions
                  <DownOutlined style={{ fontSize: 10 }} />
                </Space>
              </Button>
            </Dropdown>
          </div>

          {/* -- Candidates Table -- */}
          <Table
            rowSelection={{ type: 'checkbox' }}
            columns={columns}
            dataSource={candidates}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) => `Showing of ${range[0]} - ${range[1]} of ${total}`,
              pageSizeOptions: ['10', '20', '50'],
            }}
            style={{ background: '#ffffff', borderRadius: '0 0 8px 8px' }}
            size="middle"
          />

        </Content>
      </Layout>
    </Layout>
  );
}
