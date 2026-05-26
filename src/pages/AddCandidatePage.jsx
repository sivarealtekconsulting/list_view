import {
  Avatar, Breadcrumb, Button, Card, Checkbox, Col, DatePicker,
  Form, Input, Layout, Menu, Radio, Row, Select, Space, Switch,
  Typography, Upload,
} from 'antd';
import {
  AppstoreOutlined, AuditOutlined, BarChartOutlined, BankOutlined,
  CalendarOutlined, CaretDownOutlined, DollarOutlined, EnvironmentOutlined,
  FileOutlined, FileTextOutlined, InfoCircleOutlined, LinkOutlined,
  MailOutlined, NotificationOutlined, PlusOutlined, ReadOutlined,
  SafetyCertificateOutlined, SendOutlined, ShareAltOutlined, SolutionOutlined,
  TagsOutlined, TeamOutlined, UploadOutlined, UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

const sideMenuItems = [
  { key: 'dashboard',     icon: <AppstoreOutlined /> },
  { key: 'jobs',          icon: <FileTextOutlined /> },
  { key: 'candidates',    icon: <TeamOutlined /> },
  { key: 'submissions',   icon: <SendOutlined /> },
  { key: 'reports',       icon: <BarChartOutlined /> },
  { key: 'social',        icon: <ShareAltOutlined /> },
  { key: 'notifications', icon: <NotificationOutlined /> },
  { key: 'calendar',      icon: <CalendarOutlined /> },
  { key: 'documents',     icon: <AuditOutlined /> },
  { key: 'compliance',    icon: <SafetyCertificateOutlined /> },
];

const LBL = { style: { width: 160, textAlign: 'right' } };

export default function AddCandidatePage() {
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: '100vh' }}>

      {/* Sidebar */}
      <Sider width={64} style={{ background: '#1a237e', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ padding: '18px 0', display: 'flex', justifyContent: 'center' }}>
          <BankOutlined style={{ fontSize: 24, color: '#ffffff' }} />
        </div>
        <Menu
          mode="inline"
          selectedKeys={['candidates']}
          inlineCollapsed
          style={{ background: 'transparent', border: 'none', flex: 1 }}
          items={sideMenuItems.map(item => ({
            ...item,
            label: '',
            style: { color: '#ffffffaa', padding: '0 20px' },
          }))}
        />
      </Sider>

      <Layout>

        {/* Header */}
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

        <Content style={{ background: '#f5f6fa', padding: '0 24px 100px' }}>

          {/* Breadcrumb */}
          <div style={{ padding: '12px 0' }}>
            <Breadcrumb
              items={[
                { title: <Text type="secondary" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Home</Text> },
                { title: <Text style={{ cursor: 'pointer', color: '#1d4ed8' }} onClick={() => navigate('/candidates')}>Candidates</Text> },
                { title: <Text strong style={{ color: '#1d4ed8' }}>Add</Text> },
              ]}
            />
          </div>

          <Form layout="horizontal" colon={false}>

            {/* ── Personal Summary ── */}
            <Card
              style={{ marginBottom: 16 }}
              title={<Space size={8}><UserOutlined style={{ color: '#1d4ed8' }} /><Text strong>Personal Summary</Text></Space>}
              extra={<Text type="secondary" style={{ fontSize: 13 }}>Resume, basic information and contact details</Text>}
            >
              <Row gutter={[32, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item label="*Resume" labelCol={LBL}>
                    <Upload.Dragger showUploadList={false} height={60}>
                      <Space direction="vertical" size={2} align="center">
                        <Space size={6}>
                          <UploadOutlined />
                          <Text>Upload Resume</Text>
                        </Space>
                        <Text type="secondary" style={{ fontSize: 11 }}>Supported: PDF, DOC, DOCX - Max 2 MB</Text>
                      </Space>
                    </Upload.Dragger>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Gender" labelCol={LBL}>
                    <Radio.Group>
                      <Radio value="male">Male</Radio>
                      <Radio value="female">Female</Radio>
                      <Radio value="others">Others</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[32, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item label="*First Name" labelCol={LBL}>
                    <Input prefix={<UserOutlined style={{ color: '#d1d5db' }} />} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="*Last Name" labelCol={LBL}>
                    <Input prefix={<UserOutlined style={{ color: '#d1d5db' }} />} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[32, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item label="*Email" labelCol={LBL}>
                    <Input prefix={<MailOutlined style={{ color: '#d1d5db' }} />} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="*Contact Number" labelCol={LBL}>
                    <Space.Compact style={{ width: '100%' }}>
                      <Select defaultValue="+91" style={{ width: 80 }}>
                        <Select.Option value="+91">+91</Select.Option>
                        <Select.Option value="+1">+1</Select.Option>
                        <Select.Option value="+44">+44</Select.Option>
                      </Select>
                      <Input style={{ flex: 1 }} />
                    </Space.Compact>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[32, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item label="Nationality" labelCol={LBL}>
                    <Select style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="DOB" labelCol={LBL}>
                    <DatePicker style={{ width: '100%' }} suffixIcon={<CalendarOutlined />} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* ── Professional Summary ── */}
            <Card
              style={{ marginBottom: 16 }}
              title={<Space size={8}><SolutionOutlined style={{ color: '#1d4ed8' }} /><Text strong>Professional Summary</Text></Space>}
              extra={<Text type="secondary" style={{ fontSize: 13 }}>Role, experience and skills</Text>}
            >
              <Row gutter={[32, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item label="Designation" labelCol={LBL}>
                    <Select style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Total Experience" labelCol={LBL}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[32, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item label="Current Location" labelCol={LBL}>
                    <Input prefix={<EnvironmentOutlined style={{ color: '#d1d5db' }} />} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Project Location" labelCol={LBL}>
                    <Input prefix={<EnvironmentOutlined style={{ color: '#d1d5db' }} />} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[32, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item label="Work Authorization" labelCol={LBL}>
                    <Select style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Willing to Relocate" labelCol={LBL}>
                    <Checkbox />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[32, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item label="Contract Type" labelCol={LBL}>
                    <Select style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Skills Tags" labelCol={LBL}>
                    <Input prefix={<TagsOutlined style={{ color: '#d1d5db' }} />} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[32, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item label="Work Experience" labelCol={LBL}>
                    <Space size={8} align="center">
                      <Button type="link" icon={<PlusOutlined />} style={{ padding: 0 }}>Fresher</Button>
                      <Switch size="small" />
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* ── Employer Details ── */}
            <Card
              style={{ marginBottom: 16 }}
              title={<Space size={8}><BankOutlined style={{ color: '#1d4ed8' }} /><Text strong>Employer Details</Text></Space>}
              extra={
                <Space size={8}>
                  <Text type="secondary" style={{ fontSize: 13 }}>Current or Previous Employer Information</Text>
                  <Button type="text" icon={<PlusOutlined />} size="small" />
                </Space>
              }
            />

            {/* ── Education Details ── */}
            <Card
              style={{ marginBottom: 16 }}
              title={<Space size={8}><ReadOutlined style={{ color: '#1d4ed8' }} /><Text strong>Education Details</Text></Space>}
              extra={
                <Space size={8}>
                  <Text type="secondary" style={{ fontSize: 13 }}>Lowest & Highest Qualification or Institutions</Text>
                  <Button type="text" icon={<PlusOutlined />} size="small" />
                </Space>
              }
            />

            {/* ── Rate Details ── */}
            <Card
              style={{ marginBottom: 16 }}
              title={<Space size={8}><DollarOutlined style={{ color: '#1d4ed8' }} /><Text strong>Rate Details</Text></Space>}
            >
              <Form.Item label="Candidate Rate" labelCol={LBL}>
                <Space.Compact>
                  <Input style={{ width: 120 }} />
                  <Select defaultValue="USD" style={{ width: 110 }}>
                    <Select.Option value="USD">$ USD</Select.Option>
                    <Select.Option value="INR">INR</Select.Option>
                    <Select.Option value="GBP">GBP</Select.Option>
                  </Select>
                  <Select defaultValue="Hour" style={{ width: 100 }}>
                    <Select.Option value="Hour">Hour</Select.Option>
                    <Select.Option value="Day">Day</Select.Option>
                    <Select.Option value="Month">Month</Select.Option>
                    <Select.Option value="Year">Year</Select.Option>
                  </Select>
                </Space.Compact>
              </Form.Item>
            </Card>

            {/* ── Additional Details ── */}
            <Card
              style={{ marginBottom: 16 }}
              title={<Space size={8}><InfoCircleOutlined style={{ color: '#1d4ed8' }} /><Text strong>Additional Details</Text></Space>}
              extra={<Text type="secondary" style={{ fontSize: 13 }}>Source and LinkedIn Profile</Text>}
            >
              <Row gutter={[32, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item label="Source" labelCol={LBL}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Linkedin" labelCol={LBL}>
                    <Input prefix={<LinkOutlined style={{ color: '#d1d5db' }} />} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[32, 0]}>
                <Col xs={24}>
                  <Form.Item label="Language Known" labelCol={LBL}>
                    <Space size={8} wrap align="center">
                      <Select defaultValue="English" style={{ width: 120 }}>
                        <Select.Option value="English">English</Select.Option>
                        <Select.Option value="Hindi">Hindi</Select.Option>
                        <Select.Option value="Tamil">Tamil</Select.Option>
                      </Select>
                      <Checkbox defaultChecked>S</Checkbox>
                      <Checkbox defaultChecked>R</Checkbox>
                      <Checkbox defaultChecked>W</Checkbox>
                      <Button type="text" icon={<PlusOutlined />} size="small" />
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* ── Documents ── */}
            <Card
              style={{ marginBottom: 16 }}
              title={<Space size={8}><FileTextOutlined style={{ color: '#1d4ed8' }} /><Text strong>Documents</Text></Space>}
              extra={<Button type="text" icon={<PlusOutlined />} size="small" />}
            >
              {/* Passport row */}
              <Row gutter={[12, 0]} align="middle" style={{ marginBottom: 12 }}>
                <Col style={{ width: 80 }}>
                  <Text>Passport</Text>
                </Col>
                <Col>
                  <Button icon={<UploadOutlined />} size="small" />
                </Col>
                <Col flex="auto">
                  <Input placeholder="File" prefix={<FileOutlined style={{ color: '#d1d5db' }} />} />
                </Col>
                <Col flex="200px">
                  <Input placeholder="Passport Number" />
                </Col>
                <Col flex="180px">
                  <DatePicker placeholder="Expiry Date" style={{ width: '100%' }} />
                </Col>
              </Row>

              {/* Visa row */}
              <Row gutter={[12, 0]} align="middle" style={{ marginBottom: 24 }}>
                <Col style={{ width: 80 }}>
                  <Text>Visa</Text>
                </Col>
                <Col>
                  <Button icon={<UploadOutlined />} size="small" />
                </Col>
                <Col flex="auto">
                  <Input placeholder="File" prefix={<FileOutlined style={{ color: '#d1d5db' }} />} />
                </Col>
                <Col flex="200px">
                  <Input placeholder="Visa Number" />
                </Col>
                <Col flex="180px">
                  <DatePicker placeholder="Expiry Date" style={{ width: '100%' }} />
                </Col>
              </Row>

              <Text type="secondary" style={{ fontSize: 12 }}>
                Disclaimer: Documents you upload are securely stored in our cloud environment and used exclusively for verification.
              </Text>
            </Card>

          </Form>
        </Content>

        {/* Fixed footer bar */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 64,
          right: 0,
          background: '#ffffff',
          borderTop: '1px solid #f0f0f0',
          padding: '14px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 100,
        }}>
          <Text type="secondary" style={{ fontSize: 13 }}>
            All Unsaved Changes will be lost if you cancel and reload.
          </Text>
          <Space size={12}>
            <Button onClick={() => navigate('/candidates')}>Cancel</Button>
            <Button type="primary">Create</Button>
          </Space>
        </div>

      </Layout>
    </Layout>
  );
}
