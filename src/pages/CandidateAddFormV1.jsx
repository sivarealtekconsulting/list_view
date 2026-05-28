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
  CloudUploadOutlined,
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
  ProfileOutlined,
  ReadOutlined,
  SolutionOutlined,
  TagsOutlined,
  UpOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { formatters, validationRules } from '../components/form/validation';
import '../styles/CandidateAddFormV1.css';

const { Text, Link } = Typography;

function SectionTitle({ icon, title }) {
  return (
    <Space size={10} align="center">
      <div className="v1-section-icon-box">{icon}</div>
      <Text strong className="v1-section-label">{title}</Text>
    </Space>
  );
}

export default function CandidateAddFormV1() {
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
    <div className="v1-page">
      <div className="v1-page-inner">
        <Breadcrumb
          className="v1-breadcrumb"
          items={[
            { title: <Text type="secondary" onClick={() => navigate('/')}>Home</Text> },
            { title: <Text type="secondary" onClick={() => navigate('/candidates')}>Candidates</Text> },
            { title: <Text strong>Add</Text> },
          ]}
        />

        <div className="v1-page-header">
          <Space align="center" size={10}>
            <ProfileOutlined className="v1-outer-icon" />
            <div>
              <Text strong style={{ fontSize: 16 }}>Add Candidate</Text>
              <div>
                <Text type="secondary" className="v1-outer-subtitle">
                  Enter candidate details to create a new profile
                </Text>
              </div>
            </div>
          </Space>
        </div>

        <Form
              form={form}
              layout="vertical"
              colon={false}
              className="v1-form"
              requiredMark={(label, { required }) => (
                <>
                  {label}
                  {required && <span className="v1-required-mark"> *</span>}
                </>
              )}
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
              {/* 1. Personal Summary */}
              <Card
                className="v1-card"
                title={<SectionTitle icon={<UserOutlined />} title="Personal Summary" />}
                extra={
                  <Space size={8}>
                    <Text type="secondary" className="v1-card-subtitle">Resume, basic information and contact details</Text>
                    {collapseBtn('personal')}
                  </Space>
                }
              >
                <div style={{ display: collapsed.personal ? 'none' : 'block' }}>
                  <Row gutter={[24, 0]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Resume"
                        name="resume"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
                        rules={[
                          validationRules.required('Resume'),
                          validationRules.singleFileUpload(),
                        ]}
                      >
                        <Upload.Dragger
                          beforeUpload={() => false}
                          maxCount={1}
                          showUploadList={false}
                          className="v1-resume-dragger"
                        >
                          <div className="v1-dragger-content">
                            <CloudUploadOutlined className="v1-upload-icon" />
                            <p className="v1-upload-text">Drag & drop your resume here</p>
                            <p className="v1-upload-browse">or <Link>Browse Files</Link></p>
                            <p className="v1-upload-hint">Supported: PDF, DOC, DOCX &bull; Max 2 MB</p>
                          </div>
                        </Upload.Dragger>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item label="Gender" name="gender">
                        <Radio.Group className="v1-gender-group">
                          <Radio value="male"><UserOutlined /> Male</Radio>
                          <Radio value="female"><UserOutlined /> Female</Radio>
                          <Radio value="others"><UserOutlined /> Others</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[24, 0]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="First Name"
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
                          prefix={<UserOutlined className="v1-input-icon" />}
                          onChange={(e) => form.setFieldsValue({ firstName: formatters.firstNameFormatter(e.target.value) })}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Last Name"
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
                          prefix={<UserOutlined className="v1-input-icon" />}
                          onChange={(e) => form.setFieldsValue({ lastName: formatters.firstNameFormatter(e.target.value) })}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[24, 0]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                          validationRules.required('Email'),
                          validationRules.email(),
                        ]}
                      >
                        <Input
                          placeholder="Enter email"
                          prefix={<MailOutlined className="v1-input-icon" />}
                          onChange={(e) => form.setFieldsValue({ email: formatters.removeSpaces(e.target.value) })}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item label="Contact Number" required>
                        <Space.Compact style={{ width: '100%' }}>
                          <Form.Item name="countryCode" initialValue="+91" noStyle>
                            <Select style={{ width: 90 }}>
                              <Select.Option value="+91">+91</Select.Option>
                              <Select.Option value="+1">+1</Select.Option>
                              <Select.Option value="+44">+44</Select.Option>
                            </Select>
                          </Form.Item>
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
                              prefix={<PhoneOutlined className="v1-input-icon" />}
                              maxLength={10}
                              onChange={(e) => form.setFieldsValue({ contactNumber: formatters.phoneFormatter(e.target.value) })}
                            />
                          </Form.Item>
                        </Space.Compact>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[24, 0]}>
                    <Col xs={24} md={12}>
                      <Form.Item label="Nationality" name="nationality">
                        <Select placeholder="Select nationality" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item label="DOB" name="dob">
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

              {/* 2. Professional Summary */}
              <Card
                className="v1-card"
                title={<SectionTitle icon={<SolutionOutlined />} title="Professional Summary" />}
                extra={
                  <Space size={8}>
                    <Text type="secondary" className="v1-card-subtitle">Role, experience and skills</Text>
                    {collapseBtn('professional')}
                  </Space>
                }
              >
                <div style={{ display: collapsed.professional ? 'none' : 'block' }}>
                  <Row gutter={[24, 0]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Designation"
                        name="designation"
                        rules={[validationRules.required('Designation'), validationRules.designation()]}
                      >
                        <Select placeholder="Select designation" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Total Experience"
                        name="totalExperience"
                        rules={[validationRules.required('Total Experience'), validationRules.number()]}
                      >
                        <Input placeholder="Enter total experience" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[24, 0]}>
                    <Col xs={24} md={12}>
                      <Form.Item label="Current Location" name="currentLocation">
                        <Select placeholder="Select current location" suffixIcon={<EnvironmentOutlined />} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item label="Project Location" name="projectLocation">
                        <Select placeholder="Select project location" suffixIcon={<EnvironmentOutlined />} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[24, 0]}>
                    <Col xs={24} md={12}>
                      <Form.Item label="Work Authorization" name="workAuthorization">
                        <Select placeholder="Select work authorization" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item label="Willing to Relocate" name="willingToRelocate">
                        <Radio.Group>
                          <Radio value="yes">Yes</Radio>
                          <Radio value="no">No</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[24, 0]}>
                    <Col xs={24} md={12}>
                      <Form.Item label="Contract Type" name="contractType">
                        <Select placeholder="Select contract type" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Skills Tags"
                        name="skillsTags"
                        rules={[validationRules.remarks(), validationRules.remarksMaxLength()]}
                      >
                        <Input placeholder="Add skills and press Enter" prefix={<TagsOutlined className="v1-input-icon" />} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.List name="workExperience">
                    {(fields, { add, remove }) => (
                      <>
                        <Row gutter={[24, 0]}>
                          <Col xs={24}>
                            <Form.Item label="Work Experience">
                              <Button type="link" icon={<PlusOutlined />} onClick={() => add()}>
                                Add Experience
                              </Button>
                            </Form.Item>
                          </Col>
                        </Row>
                        {fields.map(({ key, name, ...restField }) => (
                          <Row key={key} gutter={[10, 0]} align="top" className="v1-list-row">
                            <Col xs={24} md={5}>
                              <Form.Item {...restField} name={[name, 'jobTitle']} rules={[validationRules.designation()]}>
                                <Input placeholder="Job Title" />
                              </Form.Item>
                            </Col>
                            <Col xs={24} md={4}>
                              <Form.Item {...restField} name={[name, 'companyName']} rules={[validationRules.companyName()]}>
                                <Input placeholder="Company Name" />
                              </Form.Item>
                            </Col>
                            <Col xs={24} md={4}>
                              <Form.Item {...restField} name={[name, 'projectLocation']}>
                                <Select placeholder="Project Location" suffixIcon={<EnvironmentOutlined />} />
                              </Form.Item>
                            </Col>
                            <Col xs={20} md={9}>
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

              {/* 3. Employer Details */}
              <Form.List name="employerDetails">
                {(fields, { add, remove }) => (
                  <Card
                    className="v1-card"
                    title={<SectionTitle icon={<BankOutlined />} title="Employer Details" />}
                    extra={
                      <Space size={8}>
                        <Text type="secondary" className="v1-card-subtitle">Current or Previous Employer Information</Text>
                        <Button type="text" icon={<PlusOutlined />} onClick={() => add()} />
                      </Space>
                    }
                  >
                    {fields.length > 0 && (
                      <Row gutter={[10, 0]} className="v1-col-header-row">
                        <Col md={5}><Text className="v1-col-header">Employer Name</Text></Col>
                        <Col md={5}><Text className="v1-col-header">Contact Person</Text></Col>
                        <Col md={7}><Text className="v1-col-header">Contact Number</Text></Col>
                        <Col md={5}><Text className="v1-col-header">Email</Text></Col>
                        <Col md={2} />
                      </Row>
                    )}
                    {fields.map(({ key, name, ...restField }) => (
                      <Row key={key} gutter={[10, 0]} align="top" className="v1-list-row">
                        <Col xs={24} md={5}>
                          <Form.Item {...restField} name={[name, 'currentEmployer']}>
                            <Input placeholder="Enter current employer" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={5}>
                          <Form.Item {...restField} name={[name, 'contactPerson']} rules={[validationRules.alphabets()]}>
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
                                  prefix={<PhoneOutlined className="v1-input-icon" />}
                                  maxLength={10}
                                  style={{ flex: 1 }}
                                  onChange={(e) => updateListField('employerDetails', name, 'contactNumber', formatters.phoneFormatter(e.target.value))}
                                />
                              </Form.Item>
                            </Space.Compact>
                          </div>
                        </Col>
                        <Col xs={24} md={5}>
                          <Form.Item {...restField} name={[name, 'email']} rules={[validationRules.email()]}>
                            <Input
                              placeholder="Enter email"
                              prefix={<MailOutlined className="v1-input-icon" />}
                              onChange={(e) => updateListField('employerDetails', name, 'email', formatters.removeSpaces(e.target.value))}
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

              {/* 4. Education Details */}
              <Form.List name="educationDetails">
                {(fields, { add, remove }) => (
                  <Card
                    className="v1-card"
                    title={<SectionTitle icon={<ReadOutlined />} title="Education Details" />}
                    extra={
                      <Space size={8}>
                        <Text type="secondary" className="v1-card-subtitle">Lowest & Highest Qualification or Institutions</Text>
                        <Button type="text" icon={<PlusOutlined />} onClick={() => add()} />
                      </Space>
                    }
                  >
                    {fields.length > 0 && (
                      <Row gutter={[10, 0]} className="v1-col-header-row">
                        <Col md={5}><Text className="v1-col-header">Highest Qualification</Text></Col>
                        <Col md={5}><Text className="v1-col-header">University / College</Text></Col>
                        <Col md={5}><Text className="v1-col-header">Specialization</Text></Col>
                        <Col md={7}><Text className="v1-col-header">Year</Text></Col>
                        <Col md={2} />
                      </Row>
                    )}
                    {fields.map(({ key, name, ...restField }) => (
                      <Row key={key} gutter={[10, 0]} align="middle" className="v1-list-row">
                        <Col xs={24} md={5}>
                          <Form.Item {...restField} name={[name, 'highestQualification']}>
                            <Select placeholder="Select highest qualification" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={5}>
                          <Form.Item {...restField} name={[name, 'universityCollege']} rules={[validationRules.companyName()]}>
                            <Input placeholder="Enter university or college" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={5}>
                          <Form.Item {...restField} name={[name, 'specialization']} rules={[validationRules.designation()]}>
                            <Input placeholder="Enter specialization" />
                          </Form.Item>
                        </Col>
                        <Col xs={20} md={7}>
                          <Form.Item {...restField} name={[name, 'yearOfPassing']}>
                            <DatePicker picker="year" placeholder="Select year" style={{ width: '100%' }} suffixIcon={<CalendarOutlined />} />
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

              {/* 5. Interview Availability */}
              <Card
                className="v1-card"
                title={<SectionTitle icon={<CalendarOutlined />} title="Interview Availability" />}
                extra={collapseBtn('interview')}
              >
                <div style={{ display: collapsed.interview ? 'none' : 'block' }}>
                  <Row gutter={[24, 0]}>
                    <Col xs={24} md={6}>
                      <Form.Item
                        label="Interview Date"
                        name="interviewDate"
                        rules={[validationRules.required('Interview Date')]}
                      >
                        <DatePicker placeholder="Select interview date" style={{ width: '100%' }} suffixIcon={<CalendarOutlined />} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                      <Form.Item label="Start Time" name="startTime">
                        <TimePicker placeholder="Select start time" style={{ width: '100%' }} use12Hours format="h:mm a" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                      <Form.Item label="End Time" name="endTime">
                        <TimePicker placeholder="Select end time" style={{ width: '100%' }} use12Hours format="h:mm a" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                      <Form.Item
                        label="Time Zone"
                        name="timeZone"
                        rules={[validationRules.required('Time Zone')]}
                      >
                        <Select placeholder="Select time zone" />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </Card>

              {/* 6. Rate Details */}
              <Card
                className="v1-card"
                title={<SectionTitle icon={<DollarOutlined />} title="Rate Details" />}
                extra={collapseBtn('rate')}
              >
                <div style={{ display: collapsed.rate ? 'none' : 'block' }}>
                  <Row gutter={[24, 0]}>
                    <Col xs={24} md={12}>
                      <Form.Item label="Candidate Rate" required>
                        <Space.Compact style={{ width: '100%' }}>
                          <Form.Item
                            name="candidateRate"
                            rules={[validationRules.required('Candidate Rate'), validationRules.number()]}
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
                      <Form.Item label="Proposed Rate" required>
                        <Space.Compact style={{ width: '100%' }}>
                          <Form.Item
                            name="proposedRate"
                            rules={[validationRules.required('Proposed Rate'), validationRules.number()]}
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

              {/* 7. Additional Details */}
              <Card
                className="v1-card"
                title={<SectionTitle icon={<InfoCircleOutlined />} title="Additional Details" />}
                extra={
                  <Space size={8}>
                    <Text type="secondary" className="v1-card-subtitle">Source and LinkedIn Profile</Text>
                    {collapseBtn('additional')}
                  </Space>
                }
              >
                <div style={{ display: collapsed.additional ? 'none' : 'block' }}>
                  <Row gutter={[24, 0]}>
                    <Col xs={24} md={12}>
                      <Form.Item label="Former Employee" name="formerEmployee">
                        <Radio.Group>
                          <Radio value="yes">Yes</Radio>
                          <Radio value="no">No</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item label="Former BA" name="formerBA">
                        <Radio.Group>
                          <Radio value="yes">Yes</Radio>
                          <Radio value="no">No</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[24, 0]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Source"
                        name="source"
                        rules={[validationRules.required('Source'), validationRules.alphabets()]}
                      >
                        <Select placeholder="Select source" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Linkedin"
                        name="linkedin"
                        rules={[validationRules.required('Linkedin'), validationRules.url()]}
                      >
                        <Input
                          placeholder="Enter linkedin profile URL"
                          prefix={<LinkedinOutlined className="v1-input-icon" />}
                          onChange={(e) => form.setFieldsValue({ linkedin: formatters.removeSpaces(e.target.value) })}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[24, 0]}>
                    <Col xs={24}>
                      <Form.Item label="Language Known" name="languageKnown">
                        <Space size={8} wrap>
                          <Select defaultValue="English" style={{ minWidth: 120 }}>
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

              {/* 8. Documents */}
              <Form.List name="documents">
                {(fields, { add, remove }) => (
                  <Card
                    className="v1-card"
                    title={<SectionTitle icon={<FileTextOutlined />} title="Documents" />}
                    extra={
                      <Button type="link" icon={<PlusOutlined />} onClick={() => add()}>
                        Add Document
                      </Button>
                    }
                  >
                    <Row gutter={[10, 0]} className="v1-col-header-row">
                      <Col md={9}><Text className="v1-col-header">File Type</Text></Col>
                      <Col md={7}><Text className="v1-col-header">Doc. No</Text></Col>
                      <Col md={6}><Text className="v1-col-header">Expiry Date</Text></Col>
                      <Col md={2}><Text className="v1-col-header">Action</Text></Col>
                    </Row>
                    {fields.map(({ key, name, ...restField }) => (
                      <Row key={key} gutter={[10, 0]} align="middle" className="v1-list-row">
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
                          <Form.Item {...restField} name={[name, 'docNo']} rules={[validationRules.candidateId('Document No')]}>
                            <Input placeholder="Enter document number" />
                          </Form.Item>
                        </Col>
                        <Col xs={20} md={6}>
                          <Form.Item {...restField} name={[name, 'expiryDate']}>
                            <DatePicker placeholder="Select expiry date" style={{ width: '100%' }} suffixIcon={<CalendarOutlined />} />
                          </Form.Item>
                        </Col>
                        <Col xs={4} md={2}>
                          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                        </Col>
                      </Row>
                    ))}
                    <Text type="secondary" className="v1-disclaimer">
                      Disclaimer: Documents you upload are securely stored in our cloud environment and used exclusively for verification.
                    </Text>
                  </Card>
                )}
              </Form.List>

            </Form>
      </div>

      <div className="v1-footer">
        <Text type="secondary">All Unsaved Changes will be lost if you cancel and reload.</Text>
        <Space size={12}>
          <Button onClick={() => navigate('/candidates')}>Cancel</Button>
          <Button type="primary" onClick={() => form.submit()}>Create Candidate</Button>
        </Space>
      </div>
    </div>
  );
}
