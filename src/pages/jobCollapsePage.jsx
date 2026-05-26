import { useState } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Statistic,
  Typography,
} from 'antd';
import {
  CalendarOutlined,
  FilterOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import JobListView from '../components/JobListView';
import JobFilters from '../components/filters';
import CalendarCard from '../components/cards/CalendarCard';
import ClientDetailsCard from '../components/cards/ClientDetailsCard';
import ClientSubmissionCard from '../components/cards/ClientSubmissionCard';
import OnboardingCard from '../components/cards/OnboardingCard';
import StatsCards from '../components/cards/StatsCards';
import StickyNotesCard from '../components/cards/StickyNotesCard';
import { formatters, validationRules } from '../components/form/validation';

const { Text } = Typography;

const summaryCards = [
  { title: 'Active requisitions', value: 58, suffix: 'live' },
  { title: 'Profiles shared', value: 426, suffix: 'this quarter' },
  { title: 'Client screens', value: 91, suffix: 'planned' },
  { title: 'Aging jobs', value: 13, suffix: 'over 30 days' },
];

const activityItems = [
  '5 cloud profiles moved to technical review',
  'Client feedback received for QA Automation Lead',
  'Workday consultant offer package sent for approval',
  'New intake call completed for data platform role',
];

export default function JobCollapsePage() {
  const [form] = Form.useForm();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleQuickJobSubmit = (values) => {
    console.log('Quick job intake:', values);
    form.resetFields();
  };

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
                  <Text strong>Jobs List</Text>
                </Space>
              )}
            >
              <JobListView />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} xl={12}>
            <ClientSubmissionCard />
               <OnboardingCard />
          </Col>
          <Col xs={24} xl={12}>
            <Space direction="vertical" size={16}>
              <StickyNotesCard />
             
            </Space>
          </Col>
        </Row>
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
      </Space>

      <JobFilters
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        onApply={() => setFiltersOpen(false)}
      />
    </>
  );
}
