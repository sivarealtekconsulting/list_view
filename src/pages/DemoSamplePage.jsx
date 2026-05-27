import { useState } from 'react';
import {
  Button,
  Card,
  Col,
  Flex,
  Form,
  Input,
  Row,
  Select,
  Space,
  Typography,
} from 'antd';
import {
  FilterOutlined,
  PlusOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import StatsCards from '../components/cards/StatsCards';
import CalendarCard from '../components/cards/CalendarCard';
import { formatters, validationRules } from '../components/form/validation';
import StickyNotesCard from '../components/cards/StickyNotesCard';
import ClientSubmissionCard from '../components/cards/ClientSubmissionCard';
import OnboardingCard from '../components/cards/OnboardingCard';
import VenkateshListView from '../components/venkatListView';

const { Text } = Typography;

const categoryOptions = [
  { value: 'Type A', label: 'Type A' },
  { value: 'Type B', label: 'Type B' },
  { value: 'Type C', label: 'Type C' },
];

const statusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Inactive', label: 'Inactive' },
];

const assigneeOptions = [
  { value: 'Sarah Wilson', label: 'Sarah Wilson' },
  { value: 'Mike Brown', label: 'Mike Brown' },
  { value: 'Emily Davis', label: 'Emily Davis' },
  { value: 'David Wilson', label: 'David Wilson' },
];

export default function DemoSamplePage() {
  const [form] = Form.useForm();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleSubmit = (values) => {
    console.log('Demo sample form values:', values);
  };
  return (
    <div className="dashboard-wrapper">

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={24}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <StatsCards />

            </Col>

            <Col xs={24} xl={10}>
              <CalendarCard />
            </Col>
            <Col xs={24} xl={14}>
              <Card title="Add / Edit Personality">
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Personality Name"
                        name="personalityName"
                        rules={[
                          validationRules.required('Personality Name'),
                          validationRules.alphabets(),
                          validationRules.firstNameMinLength(),
                          validationRules.firstNameMaxLength(),
                        ]}
                      >
                        <Input
                          placeholder="Enter personality name"
                          onChange={(event) => {
                            form.setFieldsValue({
                              personalityName: formatters.fullNameFormatter(event.target.value),
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Description"
                        name="description"
                        rules={[
                          validationRules.remarks(),
                          validationRules.remarksMaxLength(),
                        ]}
                      >
                        <Input.TextArea placeholder="Enter description" rows={3} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Category"
                        name="category"
                        rules={[validationRules.required('Category')]}
                      >
                        <Select placeholder="Select category" options={categoryOptions} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Assigned To"
                        name="assignedTo"
                      >
                        <Select placeholder="Select user" options={assigneeOptions} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Status"
                        name="status"
                        rules={[validationRules.required('Status')]}
                      >
                        <Select placeholder="Select status" options={statusOptions} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Date of Birth"
                        name="dob"
                        rules={[validationRules.dob(false)]}
                      >
                        <Input
                          placeholder="MM/DD/YYYY"
                          maxLength={10}
                          onChange={(event) => {
                            form.setFieldsValue({
                              dob: formatters.dobFormatter(event.target.value),
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row justify="end" gutter={12}>
                    <Col><Button onClick={() => form.resetFields()}>Cancel</Button></Col>
                    <Col><Button type="primary" htmlType="submit">Save</Button></Col>
                  </Row>
                </Form>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col>
          <StickyNotesCard />
        </Col>
        <Col xs={24} md={12}>
          <OnboardingCard />
        </Col>

        <Col xs={24} md={12}>
          <ClientSubmissionCard />
        </Col>

        <Col xs={24} md={24}>
          <Card
            title={(
              <Flex align="center" justify="space-between">
                <Space>
                  <TeamOutlined />
                  <Text strong>Personality List</Text>
                </Space>
                {/* <Space>
                  <Button type="text"  icon={<FilterOutlined />} onClick={() => setFiltersOpen(true)} />
                  <Button icon={<PlusOutlined />} />
                </Space> */}
              </Flex>
            )}
          >
            <VenkateshListView
              filtersOpen={filtersOpen}
              onCloseFilters={() => setFiltersOpen(false)}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
