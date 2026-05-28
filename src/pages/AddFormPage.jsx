import { useState } from 'react';
import {
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Space,
  TimePicker,
  Typography,
  Upload,
  DatePicker,
} from 'antd';
import {
  BankOutlined,
  CalendarOutlined,
  DeleteOutlined,
  DollarOutlined,
  DownOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  LinkedinOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  ReadOutlined,
  SolutionOutlined,
  TagsOutlined,
  UploadOutlined,
  UpOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { formatters, validationRules } from '../components/form/validation';
import '../styles/AddFormPage.css';

const { Text } = Typography;
const LBL = { style: { width: 160, textAlign: 'right' } };

function SectionTitle({ icon, title }) {
  return (
    <Space size={8}>
      {icon}
      <Text strong>{title}</Text>
    </Space>
  );
}

export default function AddFormPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [collapsed, setCollapsed] = useState({});

  const toggle = (key) => setCollapsed(prev => ({ ...prev, [key]: !prev[key] }));

  const collapseBtn = (key) => (
    <Button
      type="text"
      size="small"
      icon={collapsed[key] ? <DownOutlined /> : <UpOutlined />}
      onClick={(e) => { e.stopPropagation(); toggle(key); }}
    />
  );

  const updateListField = (listName, index, fieldName, value) => {
    const rows = [...(form.getFieldValue(listName) || [])];
    rows[index] = { ...rows[index], [fieldName]: value };
    form.setFieldsValue({ [listName]: rows });
  };

  return (
    <div className="add-form-page">
      <div className="add-form-page__inner">
        <Breadcrumb
          className="add-form-page__breadcrumb"
          items={[
            { title: <Text type="secondary" onClick={() => navigate('/')}>Home</Text> },
            { title: <Text type="secondary" onClick={() => navigate('/candidates')}>Candidates</Text> },
            { title: <Text strong>Add</Text> },
          ]}
        />

        <Form
              form={form}
              layout="horizontal"
              colon={false}
              requiredMark={false}
              className="add-form"
              initialValues={{
                documents: [
                  { fileType: 'Visa' },
                  { fileType: 'Driving License' },
                  { fileType: 'Passport / I94' },
                ],
              }}
              onFinish={(values) => {
                console.log('Candidate form values:', values);
              }}
            >
              {/* Personal Summary */}
              <Card
                className="add-form-card add-form-inner-card"
                title={<SectionTitle icon={<UserOutlined className="add-form-title-icon" />} title="Personal Summary" />}
                extra={
                  <Space size={8}>
                    <Text type="secondary" className="add-form-card-subtitle">Resume, basic information and contact details</Text>
                    {collapseBtn('personal')}
                  </Space>
                }
              >
                <div style={{ display: collapsed.personal ? 'none' : 'block' }}>
                  <Row gutter={[32, 0]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="*Resume"
                        labelCol={LBL}
                        name="resume"
                        valuePropName="fileList"
                        getValueFromEvent={(event) => Array.isArray(event) ? event : event?.fileList}
                        rules={[
                          validationRules.required('Resume'),
                          validationRules.singleFileUpload(),
                        ]}
                      >
                        <Upload.Dragger beforeUpload={() => false} maxCount={1} showUploadList={false} height={36}>
                          <Space size={6}>
                            <Text>Upload Resume</Text>
                            <UploadOutlined className="add-form-icon" />
                          </Space>
                        </Upload.Dragger>
                        <Text type="secondary">Supported: PDF, DOC, DOCX - Max 2 MB</Text>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item label="Gender" labelCol={LBL} name="gender">
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
                      <Form.Item
                        label="*First Name"
                        labelCol={LBL}
                        name="firstName"
                        rules={[
                          validationRules.required('First Name'),
                          validationRules.alphabets(),
                          validationRules.firstNameMinLength(),
                          validationRules.firstNameMaxLength(),
                        ]}
                      >
                        <Input
                          placeholder="Enter first name"
                          prefix={<UserOutlined className="add-form-icon" />}
                          onChange={(event) => {
                            form.setFieldsValue({
                              firstName: formatters.firstNameFormatter(event.target.value),
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="*Last Name"
                        labelCol={LBL}
                        name="lastName"
                        rules={[
                          validationRules.required('Last Name'),
                          validationRules.alphabets(),
                          validationRules.firstNameMinLength(),
                          validationRules.firstNameMaxLength(),
                        ]}
                      >
                        <Input
                          placeholder="Enter last name"
                          prefix={<UserOutlined className="add-form-icon" />}
                          onChange={(event) => {
                            form.setFieldsValue({
                              lastName: formatters.firstNameFormatter(event.target.value),
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[32, 0]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="*Email"
                        labelCol={LBL}
                        name="email"
                        rules={[
                          validationRules.required('Email'),
                          validationRules.email(),
                        ]}
                      >
                        <Input
                          placeholder="Enter email"
                          prefix={<MailOutlined className="add-form-icon" />}
                          onChange={(event) => {
                            form.setFieldsValue({
                              email: formatters.removeSpaces(event.target.value),
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item label="*Contact Number" labelCol={LBL} required>
                        <Row gutter={0}>
                          <Col span={6}>
                            <Form.Item name="countryCode" initialValue="+91" noStyle>
                              <Select className="add-form-doc-type">
                                <Select.Option value="+91">+91</Select.Option>
                                <Select.Option value="+1">+1</Select.Option>
                                <Select.Option value="+44">+44</Select.Option>
                              </Select>
                            </Form.Item>
                          </Col>

                          <Col span={18}>
                            <Form.Item
                              name="contactNumber"
                              rules={[
                                validationRules.required('Contact Number'),
                                validationRules.phone(),
                              ]}
                              validateTrigger={['onBlur', 'onChange']}
                              noStyle
                            >
                              <Input
                                placeholder="Enter contact number"
                                prefix={<PhoneOutlined className="add-form-icon" />}
                                maxLength={10}
                                onChange={(event) => {
                                  form.setFieldsValue({
                                    contactNumber: formatters.phoneFormatter(event.target.value),
                                  });
                                }}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[32, 0]}>
                    <Col xs={24} md={12}>
                      <Form.Item label="Nationality" labelCol={LBL} name="nationality">
                        <Select placeholder="Select nationality" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="DOB"
                        labelCol={LBL}
                        name="dob"
                      >
                        <DatePicker
                          placeholder="Select date of birth"
                          style={{ width: '100%' }}
                          suffixIcon={<CalendarOutlined />}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </Card>

              {/* Professional Summary */}
              <Card
                className="add-form-card add-form-inner-card"
                title={<SectionTitle icon={<SolutionOutlined className="add-form-title-icon" />} title="Professional Summary" />}
                extra={
                  <Space size={8}>
                    <Text type="secondary" className="add-form-card-subtitle">Role, experience and skills</Text>
                    {collapseBtn('professional')}
                  </Space>
                }
              >
                <div style={{ display: collapsed.professional ? 'none' : 'block' }}>
                  <Row gutter={[32, 0]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Designation"
                        labelCol={LBL}
                        name="designation"
                        rules={[
                          validationRules.required('Designation'),
                          validationRules.designation(),
                        ]}
                      >
                        <Select placeholder="Select designation" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Total Experience"
                        labelCol={LBL}
                        name="totalExperience"
                        rules={[
                          validationRules.required('Total Experience'),
                          validationRules.number(),
                        ]}
                      >
                        <Input placeholder="Enter total experience" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[32, 0]}>
                    <Col xs={24} md={12}>
                      <Form.Item label="Current Location" labelCol={LBL} name="currentLocation">
                        <Select placeholder="Select current location" suffixIcon={<EnvironmentOutlined />} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item label="Project Location" labelCol={LBL} name="projectLocation">
                        <Select placeholder="Select project location" suffixIcon={<EnvironmentOutlined />} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[32, 0]}>
                    <Col xs={24} md={12}>
                      <Form.Item label="Work Authorization" labelCol={LBL} name="workAuthorization">
                        <Select placeholder="Select work authorization" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item label="Willing to Relocate" labelCol={LBL} name="willingToRelocate">
                        <Radio.Group>
                          <Radio value="yes">Yes</Radio>
                          <Radio value="no">No</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[32, 0]}>
                    <Col xs={24} md={12}>
                      <Form.Item label="Contract Type" labelCol={LBL} name="contractType">
                        <Select placeholder="Select contract type" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Skills Tags"
                        labelCol={LBL}
                        name="skillsTags"
                        rules={[
                          validationRules.remarks(),
                          validationRules.remarksMaxLength(),
                        ]}
                      >
                        <Input placeholder="Add skills and press Enter" prefix={<TagsOutlined className="add-form-icon" />} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.List name="workExperience">
                    {(fields, { add, remove }) => (
                      <>
                        <Row gutter={[32, 0]}>
                          <Col xs={24} md={12}>
                            <Form.Item label="Work Experience" labelCol={LBL}>
                              <Button type="link" icon={<PlusOutlined />} onClick={() => add()}>
                                Add Experience
                              </Button>
                            </Form.Item>
                          </Col>
                        </Row>
                        {fields.map(({ key, name, ...restField }) => (
                          <Row key={key} gutter={[10, 0]} align="top" className="add-form-doc-row">
                            <Col xs={24} md={5}>
                              <Form.Item
                                {...restField}
                                name={[name, 'jobTitle']}
                                rules={[validationRules.designation()]}
                              >
                                <Input placeholder="Job Title" />
                              </Form.Item>
                            </Col>
                            <Col xs={24} md={5}>
                              <Form.Item
                                {...restField}
                                name={[name, 'companyName']}
                                rules={[validationRules.companyName()]}
                              >
                                <Input placeholder="Company Name" />
                              </Form.Item>
                            </Col>
                            <Col xs={24} md={5}>
                              <Form.Item {...restField} name={[name, 'projectLocation']}>
                                <Select placeholder="Project Location" suffixIcon={<EnvironmentOutlined />} />
                              </Form.Item>
                            </Col>
                            <Col xs={20} md={7}>
                              <Space.Compact style={{ width: '100%', marginBottom: 6 }}>
                                <Form.Item {...restField} name={[name, 'startDate']} noStyle>
                                  <DatePicker placeholder="Start Date" suffixIcon={<CalendarOutlined />} style={{ width: '50%' }} />
                                </Form.Item>
                                <Form.Item {...restField} name={[name, 'endDate']} noStyle>
                                  <DatePicker placeholder="End Date" suffixIcon={<CalendarOutlined />} style={{ width: '50%' }} />
                                </Form.Item>
                              </Space.Compact>
                              <Form.Item {...restField} name={[name, 'currentlyWorking']} valuePropName="checked" style={{ marginBottom: 0 }}>
                                <Checkbox>Currently working here</Checkbox>
                              </Form.Item>
                            </Col>
                            <Col xs={4} md={2} style={{ paddingTop: 4 }}>
                              <Button type="text" icon={<DeleteOutlined />} onClick={() => remove(name)} />
                            </Col>
                          </Row>
                        ))}
                      </>
                    )}
                  </Form.List>
                </div>
              </Card>

              {/* Employer Details */}
              <Form.List name="employerDetails">
                {(fields, { add, remove }) => (
                  <Card
                    className="add-form-card add-form-inner-card"
                    title={<SectionTitle icon={<BankOutlined className="add-form-title-icon" />} title="Employer Details" />}
                    extra={
                      <Space size={8}>
                        <Text type="secondary" className="add-form-card-subtitle">Current or Previous Employer Information</Text>
                        <Button type="text" icon={<PlusOutlined />} onClick={() => add()} />
                      </Space>
                    }
                  >
                    {fields.map(({ key, name, ...restField }) => (
                      <Row key={key} gutter={[10, 0]} align="top" className="add-form-doc-row">
                        <Col xs={24} md={5}>
                          <Form.Item {...restField} name={[name, 'currentEmployer']}>
                            <Input placeholder="Enter current employer" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={5}>
                          <Form.Item
                            {...restField}
                            name={[name, 'contactPerson']}
                            rules={[validationRules.alphabets()]}
                          >
                            <Input placeholder="Enter contact person" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={7}>
                          <div style={{ marginBottom: 14 }}>
                            <Space.Compact style={{ width: '100%' }}>
                              <Form.Item {...restField} name={[name, 'countryCode']} initialValue="+91" noStyle>
                                <Select style={{ width: 90 }}>
                                  <Select.Option value="+91">+91</Select.Option>
                                  <Select.Option value="+1">+1</Select.Option>
                                  <Select.Option value="+44">+44</Select.Option>
                                </Select>
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, 'contactNumber']}
                                rules={[validationRules.phone()]}
                                validateTrigger={['onBlur', 'onChange']}
                                noStyle
                              >
                                <Input
                                  placeholder="Enter number"
                                  prefix={<PhoneOutlined className="add-form-icon" />}
                                  maxLength={10}
                                  style={{ flex: 1 }}
                                  onChange={(event) => {
                                    updateListField(
                                      'employerDetails',
                                      name,
                                      'contactNumber',
                                      formatters.phoneFormatter(event.target.value),
                                    );
                                  }}
                                />
                              </Form.Item>
                            </Space.Compact>
                          </div>
                        </Col>
                        <Col xs={24} md={5}>
                          <Form.Item
                            {...restField}
                            name={[name, 'email']}
                            rules={[validationRules.email()]}
                          >
                            <Input
                              placeholder="Enter email"
                              prefix={<MailOutlined className="add-form-icon" />}
                              onChange={(event) => {
                                updateListField('employerDetails', name, 'email', formatters.removeSpaces(event.target.value));
                              }}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={4} md={2} style={{ paddingTop: 4 }}>
                          <Button type="text" icon={<DeleteOutlined />} onClick={() => remove(name)} />
                        </Col>
                      </Row>
                    ))}
                  </Card>
                )}
              </Form.List>

              {/* Education Details */}
              <Form.List name="educationDetails">
                {(fields, { add, remove }) => (
                  <Card
                    className="add-form-card add-form-inner-card"
                    title={<SectionTitle icon={<ReadOutlined className="add-form-title-icon" />} title="Education Details" />}
                    extra={
                      <Space size={8}>
                        <Text type="secondary" className="add-form-card-subtitle">Lowest & Highest Qualification or Institutions</Text>
                        <Button type="text" icon={<PlusOutlined />} onClick={() => add()} />
                      </Space>
                    }
                  >
                    {fields.map(({ key, name, ...restField }) => (
                      <Row key={key} gutter={[10, 0]} align="middle" className="add-form-doc-row">
                        <Col xs={24} md={5}>
                          <Form.Item {...restField} name={[name, 'highestQualification']}>
                            <Select placeholder="Select highest qualification" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={5}>
                          <Form.Item
                            {...restField}
                            name={[name, 'universityCollege']}
                            rules={[validationRules.companyName()]}
                          >
                            <Input placeholder="Enter university or college" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={5}>
                          <Form.Item
                            {...restField}
                            name={[name, 'specialization']}
                            rules={[validationRules.designation()]}
                          >
                            <Input placeholder="Enter specialization" />
                          </Form.Item>
                        </Col>
                        <Col xs={20} md={7}>
                          <Form.Item {...restField} name={[name, 'yearOfPassing']}>
                            <DatePicker
                              picker="year"
                              placeholder="Select year"
                              style={{ width: '100%' }}
                              suffixIcon={<CalendarOutlined />}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={4} md={2}>
                          <Button type="text" icon={<DeleteOutlined />} onClick={() => remove(name)} />
                        </Col>
                      </Row>
                    ))}
                  </Card>
                )}
              </Form.List>

              {/* Interview Availability */}
              <Card
                className="add-form-card add-form-inner-card"
                title={<SectionTitle icon={<CalendarOutlined className="add-form-title-icon" />} title="Interview Availability" />}
                extra={collapseBtn('interview')}
              >
                <div style={{ display: collapsed.interview ? 'none' : 'block' }}>
                  <Row gutter={[24, 0]} className="add-form-interview-row">
                    <Col xs={24} md={6}>
                      <Form.Item
                        label="*Interview Date"
                        name="interviewDate"
                        rules={[validationRules.required('Interview Date')]}
                      >
                        <DatePicker
                          placeholder="Select interview date"
                          style={{ width: '100%' }}
                          suffixIcon={<CalendarOutlined />}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                      <Form.Item label="Start Time" name="startTime">
                        <TimePicker
                          placeholder="Select start time"
                          style={{ width: '100%' }}
                          use12Hours
                          format="h:mm a"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                      <Form.Item label="End Time" name="endTime">
                        <TimePicker
                          placeholder="Select end time"
                          style={{ width: '100%' }}
                          use12Hours
                          format="h:mm a"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                      <Form.Item
                        label="*Time Zone"
                        name="timeZone"
                        rules={[validationRules.required('Time Zone')]}
                      >
                        <Select placeholder="Select time zone" />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </Card>

              {/* Rate Details */}
              <Card
                className="add-form-card add-form-inner-card"
                title={<SectionTitle icon={<DollarOutlined className="add-form-title-icon" />} title="Rate Details" />}
                extra={collapseBtn('rate')}
              >
                <div style={{ display: collapsed.rate ? 'none' : 'block' }}>
                  <Row gutter={[32, 0]}>
                    <Col xs={24} md={12}>
                      <Form.Item label="*Candidate Rate" labelCol={LBL} required>
                        <Space.Compact>
                          <Form.Item
                            name="candidateRate"
                            rules={[
                              validationRules.required('Candidate Rate'),
                              validationRules.number(),
                            ]}
                            noStyle
                          >
                            <Input placeholder="Enter rate" />
                          </Form.Item>
                          <Form.Item name="rateCurrency" initialValue="USD" noStyle>
                            <Select>
                              <Select.Option value="USD">$ USD</Select.Option>
                              <Select.Option value="INR">INR</Select.Option>
                            </Select>
                          </Form.Item>
                          <Form.Item name="ratePeriod" initialValue="Hour" noStyle>
                            <Select>
                              <Select.Option value="Hour">Hour</Select.Option>
                              <Select.Option value="Day">Day</Select.Option>
                            </Select>
                          </Form.Item>
                        </Space.Compact>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item label="*Proposed Rate" labelCol={LBL} required>
                        <Space.Compact>
                          <Form.Item
                            name="proposedRate"
                            rules={[
                              validationRules.required('Proposed Rate'),
                              validationRules.number(),
                            ]}
                            noStyle
                          >
                            <Input placeholder="Enter rate" />
                          </Form.Item>
                          <Form.Item name="proposedRateCurrency" initialValue="USD" noStyle>
                            <Select>
                              <Select.Option value="USD">$ USD</Select.Option>
                              <Select.Option value="INR">INR</Select.Option>
                            </Select>
                          </Form.Item>
                          <Form.Item name="proposedRatePeriod" initialValue="Hour" noStyle>
                            <Select>
                              <Select.Option value="Hour">Hour</Select.Option>
                              <Select.Option value="Day">Day</Select.Option>
                            </Select>
                          </Form.Item>
                        </Space.Compact>
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </Card>

              {/* Additional Details */}
              <Card
                className="add-form-card add-form-inner-card"
                title={<SectionTitle icon={<InfoCircleOutlined className="add-form-title-icon" />} title="Additional Details" />}
                extra={
                  <Space size={8}>
                    <Text type="secondary" className="add-form-card-subtitle">Source and LinkedIn Profile</Text>
                    {collapseBtn('additional')}
                  </Space>
                }
              >
                <div style={{ display: collapsed.additional ? 'none' : 'block' }}>
                  <Row gutter={[32, 0]}>
                    <Col xs={24} md={12}>
                      <Form.Item label="Former Employee" labelCol={LBL} name="formerEmployee">
                        <Radio.Group>
                          <Radio value="yes">Yes</Radio>
                          <Radio value="no">No</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item label="Former BA" labelCol={LBL} name="formerBA">
                        <Radio.Group>
                          <Radio value="yes">Yes</Radio>
                          <Radio value="no">No</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[32, 0]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Source"
                        labelCol={LBL}
                        name="source"
                        rules={[
                          validationRules.required('Source'),
                          validationRules.alphabets(),
                        ]}
                      >
                        <Select placeholder="Select source" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Linkedin"
                        labelCol={LBL}
                        name="linkedin"
                        rules={[
                          validationRules.required('Linkedin'),
                          validationRules.url(),
                        ]}
                      >
                        <Input
                          placeholder="Enter linkedin profile URL"
                          prefix={<LinkedinOutlined className="add-form-icon" />}
                          onChange={(event) => {
                            form.setFieldsValue({
                              linkedin: formatters.removeSpaces(event.target.value),
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[32, 0]}>
                    <Col xs={24}>
                      <Form.Item label="Language Known" labelCol={LBL} name="languageKnown">
                        <Space size={8} wrap>
                          <Select defaultValue="English" className="add-form-doc-type" placeholder="Select language">
                            <Select.Option value="English">English</Select.Option>
                            <Select.Option value="Hindi">Hindi</Select.Option>
                          </Select>
                          <Checkbox defaultChecked>S</Checkbox>
                          <Checkbox defaultChecked>R</Checkbox>
                          <Checkbox defaultChecked>W</Checkbox>
                          <Button type="text" icon={<PlusOutlined />} />
                        </Space>
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </Card>

              {/* Documents */}
              <Form.List name="documents">
                {(fields, { add, remove }) => (
                  <Card
                    className="add-form-card add-form-inner-card"
                    title={<SectionTitle icon={<FileTextOutlined className="add-form-title-icon" />} title="Documents" />}
                    extra={
                      <Button type="link" icon={<PlusOutlined />} onClick={() => add()}>
                        Add Document
                      </Button>
                    }
                  >
                    <Row gutter={[10, 0]} className="add-form-doc-header">
                      <Col xs={24} md={9}>
                        <Text type="secondary" className="add-form-doc-col-label">File Type</Text>
                      </Col>
                      <Col xs={24} md={7}>
                        <Text type="secondary" className="add-form-doc-col-label">Doc. No</Text>
                      </Col>
                      <Col xs={20} md={6}>
                        <Text type="secondary" className="add-form-doc-col-label">Expiry Date</Text>
                      </Col>
                      <Col xs={4} md={2}>
                        <Text type="secondary" className="add-form-doc-col-label">Action</Text>
                      </Col>
                    </Row>
                    {fields.map(({ key, name, ...restField }) => (
                      <Row key={key} gutter={[10, 0]} align="middle" className="add-form-doc-row">
                        <Col xs={24} md={9}>
                          <Form.Item {...restField} name={[name, 'fileType']}>
                            <Select placeholder="File Type">
                              <Select.Option value="Visa">Visa</Select.Option>
                              <Select.Option value="Driving License">Driving License</Select.Option>
                              <Select.Option value="Passport / I94">Passport / I94</Select.Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={7}>
                          <Form.Item
                            {...restField}
                            name={[name, 'docNo']}
                            rules={[validationRules.candidateId('Document No')]}
                          >
                            <Input placeholder="Enter document number" />
                          </Form.Item>
                        </Col>
                        <Col xs={20} md={6}>
                          <Form.Item {...restField} name={[name, 'expiryDate']}>
                            <DatePicker
                              placeholder="Select expiry date"
                              style={{ width: '100%' }}
                              suffixIcon={<CalendarOutlined />}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={4} md={2}>
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => remove(name)}
                          />
                        </Col>
                      </Row>
                    ))}
                    <Text type="secondary">
                      Disclaimer: Documents you upload are securely stored in our cloud environment and used exclusively for verification.
                    </Text>
                  </Card>
                )}
              </Form.List>

            </Form>
      </div>

      <div className="add-form-footer">
        <Text type="secondary">All Unsaved Changes will be lost if you cancel and reload.</Text>
        <Space size={12}>
          <Button onClick={() => navigate('/candidates')}>Cancel</Button>
          <Button type="primary" onClick={() => form.submit()}>Create Candidate</Button>
        </Space>
      </div>
    </div>
  );
}
