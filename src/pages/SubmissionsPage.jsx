import {
  Avatar, Breadcrumb, Button, Layout, Menu, Space, Typography,
} from 'antd';
import {
  AppstoreOutlined, AuditOutlined, BarChartOutlined, BankOutlined,
  CalendarOutlined, CaretDownOutlined, FileTextOutlined, MailOutlined,
  NotificationOutlined, SafetyCertificateOutlined, SendOutlined,
  ShareAltOutlined, TeamOutlined, UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import StickyNotesCard      from '../components/cards/StickyNotesCard';
import ClientSubmissionCard from '../components/cards/ClientSubmissionCard';
import ClientDetailsCard    from '../components/cards/ClientDetailsCard';

const { Sider, Header, Content } = Layout;
const { Text, Link } = Typography;

const sideMenuItems = [
  { key: 'dashboard',     icon: <AppstoreOutlined />          },
  { key: 'jobs',          icon: <FileTextOutlined />          },
  { key: 'candidates',    icon: <TeamOutlined />              },
  { key: 'submissions',   icon: <SendOutlined />              },
  { key: 'reports',       icon: <BarChartOutlined />          },
  { key: 'social',        icon: <ShareAltOutlined />          },
  { key: 'notifications', icon: <NotificationOutlined />      },
  { key: 'calendar',      icon: <CalendarOutlined />          },
  { key: 'documents',     icon: <AuditOutlined />             },
  { key: 'compliance',    icon: <SafetyCertificateOutlined /> },
];

export default function SubmissionsPage() {
  const navigate = useNavigate();

  return (
    <Layout className="jobs-layout">

      {/* <Sider width={64} className="jobs-sider">
        <div className="jobs-sider-logo">
          <BankOutlined className="jobs-sider-logo-icon" />
        </div>
        <Menu
          mode="inline"
          selectedKeys={['submissions']}
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

          <div className="submission-breadcrumb-row">
            <Breadcrumb
              items={[
                { title: <Text type="secondary">Home</Text> },
                { title: <Text strong className="submission-breadcrumb-active">Submissions</Text> },
              ]}
            />
            <Link className="submission-view-summary">View Summary</Link>
          </div>

          <div className="submission-grid">
            <ClientSubmissionCard />
            <StickyNotesCard />
          </div>

          <ClientDetailsCard />

        </Content>
      </Layout>
    </Layout>
  );
}