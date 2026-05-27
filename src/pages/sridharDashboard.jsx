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
import ListView from '../components/sridharListView';
import CalendarCard from '../components/cards/CalendarCard';
import ClientDetailsCard from '../components/cards/ClientDetailsCard';
import ClientSubmissionCard from '../components/cards/ClientSubmissionCard';
import OnboardingCard from '../components/cards/OnboardingCard';
import StatsCards from '../components/cards/StatsCards';
import StickyNotesCard from '../components/cards/StickyNotesCard';
import { formatters, validationRules } from '../components/form/validation';

const { Text } = Typography;

export default function SridharDashboardPage() {
  const [form] = Form.useForm();

  const handleQuickJobSubmit = (values) => {
    console.log('Quick job intake:', values);
    form.resetFields();
  };

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
            <StatsCards />
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
            <CalendarCard />
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
              <ListView />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} align="top">
          <Col xs={24} xl={8}>
            <Space direction="vertical" size={16}>
              <ClientSubmissionCard />
              <OnboardingCard />
            </Space>
          </Col>

          <Col xs={24} xl={16}>
            <Space direction="vertical" size={16}>
              <StickyNotesCard />
              <ClientDetailsCard />
            </Space>
          </Col>
        </Row>
      </Space>
    </div>
  );
}
