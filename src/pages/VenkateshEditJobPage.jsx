import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Affix,
  Breadcrumb,
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  Row,
  Select,
  Space,
  Typography,
  message,
} from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { PERSONALITIES } from '../data/personalities';
import { formatters, validationRules } from '../components/form/validation';

const { Text, Title } = Typography;

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

const priorityOptions = [
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
];

const assigneeOptions = [
  { value: 'Sarah Wilson', label: 'Sarah Wilson' },
  { value: 'Mike Brown', label: 'Mike Brown' },
  { value: 'Emily Davis', label: 'Emily Davis' },
  { value: 'David Wilson', label: 'David Wilson' },
];

export default function VenkateshEditJobPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const record = PERSONALITIES.find((item) => item.key === String(id));

  const initialValues = useMemo(() => {
    if (!record) return {};

    return {
      personalityName: record.name,
      code: record.code,
      category: record.category,
      role: record.role,
      status: record.status,
      priority: record.priority,
      assignedTo: record.assignedTo,
      dob: record.dob,
      department: record.department,
      completion: record.completion.replace('%', ''),
      email: record.email,
      phone: record.phone.replace(/\D/g, '').slice(-10),
      location: record.location,
      description: record.description,
      notes: record.notes,
    };
  }, [record]);

  if (!record) {
    return (
      <div className="dashboard-wrapper">
        <Card>
          <Empty description="Edit record not found">
            <Button type="primary" icon={<ArrowLeftOutlined />} onClick={() => navigate('/Venkatesh')}>
              Back to Venkatesh
            </Button>
          </Empty>
        </Card>
      </div>
    );
  }

  const handleUpdate = (values) => {
    console.log('Updated personality values:', {
      ...values,
      completion: `${values.completion}%`,
    });
    message.success('Personality details updated');
    navigate(`/Venkatesh-detailview/${record.key}`);
  };

  return (
    <div className="dashboard-wrapper">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              { title: <Text type="secondary" onClick={() => navigate('/Venkatesh')}>Venkatesh</Text> },
              { title: <Text type="secondary" onClick={() => navigate(`/Venkatesh-detailview/${record.key}`)}>{record.name}</Text> },
              { title: <Text strong>Edit Job</Text> },
            ]}
          />
        </Col>

        {/* <Col span={24}>
          <Card>
            <Space direction="vertical" size={4}>
              <Text type="secondary">Edit Job</Text>
              <Title level={4}>{record.name}</Title>
            </Space>
          </Card>
        </Col> */}

        <Col span={24}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form
                form={form}
                layout="vertical"
                initialValues={initialValues}
                onFinish={handleUpdate}
                autoComplete="off"
              >
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Card title="Basic Details">
                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} xl={8}>
                          <Form.Item
                            label="Personality ID"
                            name="code"
                            rules={[
                              validationRules.required('Personality ID'),
                              validationRules.candidateId('Personality ID'),
                            ]}
                          >
                            <Input
                              onChange={(event) => {
                                form.setFieldsValue({
                                  code: formatters.removeSpaces(event.target.value),
                                });
                              }}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} xl={8}>
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
                              onChange={(event) => {
                                form.setFieldsValue({
                                  personalityName: formatters.fullNameFormatter(event.target.value),
                                });
                              }}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} xl={8}>
                          <Form.Item
                            label="Category"
                            name="category"
                            rules={[validationRules.required('Category')]}
                          >
                            <Select options={categoryOptions} />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} xl={8}>
                          <Form.Item
                            label="Role"
                            name="role"
                            rules={[
                              validationRules.required('Role'),
                              validationRules.designation(),
                            ]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                  </Col>



                  <Col span={24}>
                    <Card title="Contact Details">
                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} xl={8}>
                          <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                              validationRules.required('Email'),
                              validationRules.email(),
                            ]}
                          >
                            <Input
                              onChange={(event) => {
                                form.setFieldsValue({
                                  email: formatters.removeSpaces(event.target.value),
                                });
                              }}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} xl={8}>
                          <Form.Item
                            label="Phone"
                            name="phone"
                            rules={[
                              validationRules.required('Phone'),
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

                        <Col xs={24} sm={12} xl={8}>
                          <Form.Item
                            label="Location"
                            name="location"
                            rules={[
                              validationRules.required('Location'),
                              validationRules.companyName(),
                            ]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                  </Col>

                  <Col span={24}>
                    <Card title="Assignment & Status">
                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} xl={8}>
                          <Form.Item
                            label="Status"
                            name="status"
                            rules={[validationRules.required('Status')]}
                          >
                            <Select options={statusOptions} />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} xl={8}>
                          <Form.Item
                            label="Priority"
                            name="priority"
                            rules={[validationRules.required('Priority')]}
                          >
                            <Select options={priorityOptions} />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} xl={8}>
                          <Form.Item label="Assigned To" name="assignedTo">
                            <Select options={assigneeOptions} />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} xl={8}>
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

                        <Col xs={24} sm={12} xl={8}>
                          <Form.Item
                            label="Department"
                            name="department"
                            rules={[
                              validationRules.required('Department'),
                              validationRules.companyName(),
                            ]}
                          >
                            <Input
                              onChange={(event) => {
                                form.setFieldsValue({
                                  department: formatters.removeExtraSpaces(event.target.value),
                                });
                              }}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} xl={8}>
                          <Form.Item
                            label="Completion"
                            name="completion"
                            rules={[
                              validationRules.required('Completion'),
                              validationRules.number(),
                            ]}
                          >
                            <Input
                              suffix="%"
                              onChange={(event) => {
                                form.setFieldsValue({
                                  completion: event.target.value.replace(/\D/g, '').slice(0, 3),
                                });
                              }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                  </Col>

                  <Col span={24}>
                    <Card title="Description & Notes">
                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} xl={8}>
                          <Form.Item
                            label="Description"
                            name="description"
                            rules={[
                              validationRules.remarks(),
                              validationRules.remarksMaxLength(),
                            ]}
                          >
                            <Input.TextArea rows={3} />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} xl={8}>
                          <Form.Item
                            label="Notes"
                            name="notes"
                            rules={[
                              validationRules.remarks(),
                              validationRules.remarksMaxLength(),
                            ]}
                          >
                            <Input.TextArea rows={3} />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>

                <Affix offsetBottom={0}>
                  <Card>
                    <Row justify="end" gutter={12}>
                      <Col>
                        <Button onClick={() => navigate(`/Venkatesh-detailview/${record.key}`)}>
                          Cancel
                        </Button>
                      </Col>
                      <Col>
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                          Update
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                </Affix>
              </Form>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
