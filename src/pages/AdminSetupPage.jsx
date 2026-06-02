import { Card, Col, Row, Space, Typography } from 'antd';
import {
  ApartmentOutlined,
  SafetyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;

const SECTIONS = [
  {
    key: 'users',
    path: '/users',
    icon: <UserOutlined style={{ fontSize: 28, color: '#1677ff' }} />,
    title: 'Users',
    description: 'Manage field visibility configurations for individual users.',
  },
  {
    key: 'teams',
    path: '/teams',
    icon: <ApartmentOutlined style={{ fontSize: 28, color: '#52c41a' }} />,
    title: 'Teams',
    description: 'Configure module fields for teams — propagates to all members.',
  },
  {
    key: 'roles',
    path: '/roles',
    icon: <SafetyOutlined style={{ fontSize: 28, color: '#722ed1' }} />,
    title: 'Roles',
    description: 'Set default field visibility per role for all assigned users.',
  },
];

export default function AdminSetupPage() {
  const navigate = useNavigate();

  return (
    <main style={{ minHeight: '100vh', padding: 18, background: '#f3f5f8' }}>
      <Title level={4} style={{ marginBottom: 20 }}>Admin Setup</Title>

      <Row gutter={[16, 16]}>
        {SECTIONS.map(({ key, path, icon, title, description }) => (
          <Col key={key} xs={24} sm={24} md={8}>
            <Card hoverable onClick={() => navigate(path)} style={{ height: '100%' }}>
              <Space direction="vertical" size={8}>
                {icon}
                <Title level={5} style={{ margin: 0 }}>{title}</Title>
                <Text type="secondary">{description}</Text>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </main>
  );
}
