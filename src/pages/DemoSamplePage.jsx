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
  Table,
  Tag,
  Typography,
} from 'antd';
import {
  BellOutlined,
  CalendarOutlined,
  ColumnHeightOutlined,
  DownloadOutlined,
  FilterOutlined,
  MenuOutlined,
  MoreOutlined,
  SearchOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import StatsCards from '../components/cards/StatsCards';
import CalendarCard from '../components/cards/CalendarCard';
import CustomPagination from '../components/CustomPagination';
import { formatters, validationRules } from '../components/form/validation';
import StickyNotesCard from '../components/cards/StickyNotesCard';
import ClientSubmissionCard from '../components/cards/ClientSubmissionCard';
import JobFilters from '../components/filters';
import JobListView from '../components/JobListView';
import OnboardingCard from '../components/cards/OnboardingCard';

const { Text, Title } = Typography;

const people = [
  { key: '1', name: 'John Doe', category: 'Type A', status: 'Active', assignedTo: 'Sarah Wilson', date: '15 May 2024' },
  { key: '2', name: 'Jane Smith', category: 'Type B', status: 'Pending', assignedTo: 'Mike Brown', date: '14 May 2024' },
  { key: '3', name: 'Robert Johnson', category: 'Type C', status: 'Inactive', assignedTo: 'Emily Davis', date: '13 May 2024' },
  { key: '4', name: 'Michael Lee', category: 'Type A', status: 'Active', assignedTo: 'David Wilson', date: '12 May 2024' },
  { key: '5', name: 'Sophia Martinez', category: 'Type B', status: 'Pending', assignedTo: 'Sarah Wilson', date: '11 May 2024' },
];

const statusColors = {
  Active: 'success',
  Pending: 'warning',
  Inactive: 'error',
};

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

  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const handleSubmit = (values) => {
    console.log('Demo sample form values:', values);
  };

  const columns = [
    {
      title: ' S.no',
      dataIndex: 'key',
      width: 70,
      sorter: (a, b) => Number(a.key) - Number(b.key),
    },
    {
      title: 'Personality Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status) => <Tag color={statusColors[status]}>{status}</Tag>,
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      sorter: (a, b) => a.assignedTo.localeCompare(b.assignedTo),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: () => <Button type="text" icon={<MoreOutlined />} />,
    },
  ];

  return (
    <>
      <Card>

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
          <Col >
            {/* <Card
              title={<Space><FilterOutlined />Filters</Space>}
              extra={<Button type="link">Reset</Button>}
            >
              <Form layout="vertical">
                <Form.Item label="Date Range">
                  <Input value="01 May 2024 - 31 May 2024" readOnly suffix={<CalendarOutlined />} />
                </Form.Item>
                <Form.Item label="Personality" name="filterPersonality">
                  <Select placeholder="Select Personality" options={people.map(({ name }) => ({ value: name, label: name }))} />
                </Form.Item>
                <Form.Item label="Status" name="filterStatus">
                  <Select placeholder="Select Status" options={statusOptions} />
                </Form.Item>
                <Form.Item label="Category" name="filterCategory">
                  <Select placeholder="Select Category" options={categoryOptions} />
                </Form.Item>
                <Form.Item label="Assigned To" name="filterAssignedTo">
                  <Select placeholder="Select User" options={assigneeOptions} />
                </Form.Item>
                <Row gutter={12}>
                  <Col span={12}><Button block>Clear</Button></Col>
                  <Col span={12}><Button block type="primary">Apply</Button></Col>
                </Row>
              </Form>
            </Card> */}
            <StickyNotesCard />

          </Col>


        </Row>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <OnboardingCard />
          </Col>

          <Col xs={24} md={12}>
            <ClientSubmissionCard />
          </Col>
        </Row>
        {/* <Card>
          <Flex align="center" justify="space-between">
            <Text>Total 128 Results</Text>
            <Space>
              <Button icon={<ColumnHeightOutlined />}></Button>
              <Button icon={<DownloadOutlined />}></Button>
            </Space>
          </Flex>
        </Card>

        <Table
          rowSelection={{}}
          columns={columns}
          dataSource={people}
          size="middle"
          showSorterTooltip={false}
          tableLayout="fixed"
          pagination={false}
          scroll={{ x: '100%' }}
        />
        <CustomPagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={128}
          onChange={(page) => setPagination((current) => ({ ...current, current: page }))}
          onPageSizeChange={(pageSize) => setPagination({ current: 1, pageSize })}
        /> */}

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


        <JobFilters
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          onApply={() => setFiltersOpen(false)}
        />
      </Card>
    </>
  );
}
