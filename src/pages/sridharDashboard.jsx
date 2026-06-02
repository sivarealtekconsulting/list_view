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
import {
  SRIDHAR_DASHBOARD_CARDS,
  SRIDHAR_DASHBOARD_STATS,
  SRIDHAR_JOB_LIST_SUMMARY,
  SRIDHAR_MOCK_JOBS,
} from '../data/jobs';
import { useEffect, useState } from 'react';
import { getJobs, getDropdownFields } from '../services/dropdownApi';

const { Text } = Typography;

export default function SridharDashboardPage() {
  const [form] = Form.useForm();
  const [jobs, setJobs] = useState([]);
  const [dropdownFields, setDropdownFields] = useState([]);

  const handleQuickJobSubmit = (values) => {
    console.log('Quick job intake:', values);
    form.resetFields();
  };

useEffect(() => {
  const fetchData = async () => {
    try {
      const [jobsData, dropdownData] = await Promise.all([
        getJobs(),
        getDropdownFields('jobs'),
      ]);

      console.log('Fetched Jobs:', jobsData);
      console.log('Fetched Dropdown Fields:', dropdownData);

      setJobs(jobsData);
      setDropdownFields(dropdownData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();
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
              >bgf
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
              <ListView jobs={jobs.length > 0 ? jobs : SRIDHAR_MOCK_JOBS} dropdownFields={dropdownFields} summary={SRIDHAR_JOB_LIST_SUMMARY} />
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
