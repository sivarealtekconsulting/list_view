import { Avatar, Button, Layout, Menu, Space, Typography } from 'antd';
import {
  AppstoreOutlined, AuditOutlined, BarChartOutlined, BankOutlined,
  CalendarOutlined, CaretDownOutlined, FileTextOutlined, MailOutlined,
  NotificationOutlined, SafetyCertificateOutlined, SendOutlined,
  ShareAltOutlined, TeamOutlined, UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import StatsCards  from '../components/cards/StatsCards';
import JobListView from '../components/JobListView';

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

const sideMenuItems = [
  
  { key: 'jobs',          icon: <FileTextOutlined />          },
  
];

export default function JobsPage() {
  const navigate = useNavigate();

  return (
    <Layout className="jobs-layout">
      {/* <Sider width={64} className="jobs-sider">
        <div className="jobs-sider-logo">
          <BankOutlined className="jobs-sider-logo-icon" />
        </div>
        <Menu
          mode="inline"
          selectedKeys={['jobs']}
          inlineCollapsed
          className="jobs-sider-menu"
          onClick={({ key }) => navigate(`/${key}`)}
          items={sideMenuItems.map(item => ({
            ...item,
            label: '',
            className: 'jobs-sider-menu-item',
          }))}
        />
      </Sider> */}

      <Layout>
        {/* <Header className="jobs-header">
          <Space size={8} align="center">
            <BankOutlined className="jobs-header-brand-icon" />
            <Text strong className="jobs-header-brand-text">
              Realtek Consulting LLC
            </Text>
          </Space>
          <Space size={16} align="center">
            <Button type="text" icon={<MailOutlined className="jobs-header-mail-icon" />} />
            <Space size={8} align="center">
              <Avatar size={32} icon={<UserOutlined />} className="jobs-header-avatar" />
              <Text strong className="jobs-header-username">Jayaprakash A</Text>
              <CaretDownOutlined className="jobs-header-caret" />
            </Space>
          </Space>
        </Header> */}

        <Content className="jobs-content">
          <StatsCards />
          <JobListView />
        </Content>
      </Layout>
    </Layout>
  );
}