import { useState } from 'react';
import {
  Breadcrumb, Button, Card, Checkbox, Col, Form, Radio, Row, Select,
  Space, TimePicker, Typography, Upload, DatePicker,
} from 'antd';
import {
  BankOutlined, CalendarOutlined, CloudUploadOutlined, DeleteOutlined,
  DollarOutlined, DownOutlined, EnvironmentOutlined, FileTextOutlined,
  InfoCircleOutlined, LinkedinOutlined, MailOutlined, PhoneOutlined,
  PlusOutlined, ProfileOutlined, ReadOutlined, SolutionOutlined,
  TagsOutlined, UpOutlined, UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { formatters, validationRules } from '../components/form/validation';
import '../styles/CandidateAddFormV3.css';

const { Text, Link } = Typography;

// ── Floating text input (effect-16 animation) ────────────────────────────────
// NOTE: label must come after input in DOM for CSS sibling selector (~) to work
function FloatingInput({ label, icon, value, onChange, ...rest }) {
  return (
    <div className={`v3-input-wrap${icon ? ' has-icon' : ''}`}>
      {icon && <span className="v3-prefix-icon">{icon}</span>}
      <input
        className="v3-effect-16"
        placeholder=" "
        value={value ?? ''}
        onChange={onChange}
        {...rest}
      />
      <label className="v3-float-label">{label}</label>
      <span className="v3-focus-line"></span>
    </div>
  );
}

// ── Floating select (Ant Design Select stripped to bottom-border style) ───────
function FloatingSelect({ label, value, onChange, children, ...rest }) {
  const hasValue = value !== undefined && value !== null && value !== '';
  return (
    <div className={`v3-select-wrap${hasValue ? ' has-value' : ''}`}>
      <label className="v3-select-label">{label}</label>
      <Select
        value={value || undefined}
        onChange={onChange}
        className="v3-ant-select"
        placeholder=" "
        variant="borderless"
        {...rest}
      >
        {children}
      </Select>
      <span className="v3-sel-focus-line"></span>
    </div>
  );
}

// ── Floating DatePicker ───────────────────────────────────────────────────────
function FloatingDatePicker({ label, value, onChange, picker, ...rest }) {
  const hasValue = value !== null && value !== undefined;
  return (
    <div className={`v3-date-wrap${hasValue ? ' has-value' : ''}`}>
      <label className="v3-date-label">{label}</label>
      <DatePicker
        value={value}
        onChange={onChange}
        picker={picker}
        placeholder=" "
        suffixIcon={<CalendarOutlined />}
        className="v3-ant-datepicker"
        variant="borderless"
        {...rest}
      />
      <span className="v3-date-focus-line"></span>
    </div>
  );
}

// ── Floating TimePicker ───────────────────────────────────────────────────────
function FloatingTimePicker({ label, value, onChange, ...rest }) {
  const hasValue = value !== null && value !== undefined;
  return (
    <div className={`v3-time-wrap${hasValue ? ' has-value' : ''}`}>
      <label className="v3-time-label">{label}</label>
      <TimePicker
        value={value}
        onChange={onChange}
        placeholder=" "
        use12Hours
        format="h:mm a"
        className="v3-ant-timepicker"
        variant="borderless"
        {...rest}
      />
      <span className="v3-time-focus-line"></span>
    </div>
  );
}

// ── Section card title ────────────────────────────────────────────────────────
function SectionTitle({ icon, title }) {
  return (
    <Space size={10} align="center">
      <div className="v3-section-icon">{icon}</div>
      <Text strong className="v3-section-label">{title}</Text>
    </Space>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function CandidateAddFormV3() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [collapsed, setCollapsed] = useState({});

  const toggle = (key) => setCollapsed((p) => ({ ...p, [key]: !p[key] }));

  const collapseBtn = (key) => (
    <Button
      type="text"
      size="small"
      icon={collapsed[key] ? <DownOutlined /> : <UpOutlined />}
      onClick={(e) => { e.stopPropagation(); toggle(key); }}
    />
  );

  return (
    <div className="v3-page">
      <div className="v3-page-inner">

        <Breadcrumb
          className="v3-breadcrumb"
          items={[
            { title: <Text type="secondary" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Home</Text> },
            { title: <Text type="secondary" style={{ cursor: 'pointer' }} onClick={() => navigate('/candidates')}>Candidates</Text> },
            { title: <Text strong>Add</Text> },
          ]}
        />

        <div className="v3-page-header">
          <Space align="center" size={10}>
            <ProfileOutlined className="v3-header-icon" />
            <div>
              <Text strong style={{ fontSize: 16 }}>Add Candidate</Text>
              <div><Text type="secondary" style={{ fontSize: 12 }}>Enter candidate details to create a new profile</Text></div>
            </div>
          </Space>
        </div>

        <Form
          form={form}
          layout="vertical"
          colon={false}
          className="v3-form"
          initialValues={{
            countryCode: '+91',
            rateCurrency: 'USD',
            ratePeriod: 'Hour',
            proposedRateCurrency: 'USD',
            proposedRatePeriod: 'Hour',
            documents: [
              { fileType: 'Visa' },
              { fileType: 'Driving License' },
              { fileType: 'Passport / I94' },
            ],
          }}
          onFinish={(values) => console.log('V3 form values:', values)}
        >

          {/* ── 1. Personal Summary ─────────────────────────────────────── */}
          <Card
            className="v3-card"
            title={<SectionTitle icon={<UserOutlined />} title="Personal Summary" />}
            extra={
              <Space size={8}>
                <Text type="secondary" className="v3-card-sub">Resume, basic information and contact details</Text>
                {collapseBtn('personal')}
              </Space>
            }
          >
            <div style={{ display: collapsed.personal ? 'none' : 'block' }}>
              <Row gutter={[24, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="resume"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
                    rules={[validationRules.required('Resume'), validationRules.singleFileUpload()]}
                  >
                    <Upload.Dragger beforeUpload={() => false} maxCount={1} showUploadList={false} className="v3-dragger">
                      <div className="v3-dragger-inner">
                        <CloudUploadOutlined className="v3-upload-icon" />
                        <p className="v3-upload-text">Drag & drop your resume here</p>
                        <p className="v3-upload-sub">or <Link>Browse Files</Link></p>
                        <p className="v3-upload-hint">PDF, DOC, DOCX &bull; Max 2 MB</p>
                      </div>
                    </Upload.Dragger>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="gender" style={{ marginBottom: 12 }}>
                    <div>
                      <div className="v3-group-label" style={{ marginBottom: 8 }}>Gender</div>
                      <Radio.Group
                        value={form.getFieldValue('gender')}
                        onChange={(e) => form.setFieldsValue({ gender: e.target.value })}
                        className="v3-gender-group"
                      >
                        <Radio value="male">Male</Radio>
                        <Radio value="female">Female</Radio>
                        <Radio value="others">Others</Radio>
                      </Radio.Group>
                    </div>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[24, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="firstName"
                    rules={[validationRules.required('First Name'), validationRules.alphabets()]}
                  >
                    <FloatingInput
                      label="First Name"
                      icon={<UserOutlined />}
                      onChange={(e) => form.setFieldsValue({ firstName: formatters.firstNameFormatter(e.target.value) })}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="lastName"
                    rules={[validationRules.required('Last Name'), validationRules.alphabets()]}
                  >
                    <FloatingInput
                      label="Last Name"
                      icon={<UserOutlined />}
                      onChange={(e) => form.setFieldsValue({ lastName: formatters.firstNameFormatter(e.target.value) })}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[24, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="email"
                    rules={[validationRules.required('Email'), validationRules.email()]}
                  >
                    <FloatingInput
                      label="Email"
                      icon={<MailOutlined />}
                      onChange={(e) => form.setFieldsValue({ email: formatters.removeSpaces(e.target.value) })}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item style={{ marginBottom: 32 }}>
                    <div className="v3-phone-row">
                      <div className="v3-code-wrap">
                        <Form.Item name="countryCode" noStyle>
                          <Select className="v3-code-select" variant="borderless">
                            <Select.Option value="+91">+91</Select.Option>
                            <Select.Option value="+1">+1</Select.Option>
                            <Select.Option value="+44">+44</Select.Option>
                          </Select>
                        </Form.Item>
                      </div>
                      <div className="v3-phone-input-wrap">
                        <Form.Item
                          name="contactNumber"
                          rules={[validationRules.required('Contact Number'), validationRules.phone()]}
                          noStyle
                        >
                          <FloatingInput
                            label="Contact Number"
                            icon={<PhoneOutlined />}
                            maxLength={10}
                            onChange={(e) => form.setFieldsValue({ contactNumber: formatters.phoneFormatter(e.target.value) })}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[24, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item name="nationality">
                    <FloatingSelect label="Nationality" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="dob">
                    <FloatingDatePicker label="Date of Birth" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Card>

          {/* ── 2. Professional Summary ──────────────────────────────────── */}
          <Card
            className="v3-card"
            title={<SectionTitle icon={<SolutionOutlined />} title="Professional Summary" />}
            extra={
              <Space size={8}>
                <Text type="secondary" className="v3-card-sub">Role, experience and skills</Text>
                {collapseBtn('professional')}
              </Space>
            }
          >
            <div style={{ display: collapsed.professional ? 'none' : 'block' }}>
              <Row gutter={[24, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item name="designation" rules={[validationRules.required('Designation')]}>
                    <FloatingSelect label="Designation" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="totalExperience" rules={[validationRules.required('Total Experience'), validationRules.number()]}>
                    <FloatingInput label="Total Experience (years)" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[24, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item name="currentLocation">
                    <FloatingSelect label="Current Location">
                      <Select.Option value="remote">Remote</Select.Option>
                    </FloatingSelect>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="projectLocation">
                    <FloatingSelect label="Project Location">
                      <Select.Option value="remote">Remote</Select.Option>
                    </FloatingSelect>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[24, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item name="workAuthorization">
                    <FloatingSelect label="Work Authorization" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="willingToRelocate" style={{ marginBottom: 32 }}>
                    <div>
                      <div className="v3-group-label" style={{ marginBottom: 8 }}>Willing to Relocate</div>
                      <Radio.Group
                        value={form.getFieldValue('willingToRelocate')}
                        onChange={(e) => form.setFieldsValue({ willingToRelocate: e.target.value })}
                      >
                        <Radio value="yes">Yes</Radio>
                        <Radio value="no">No</Radio>
                      </Radio.Group>
                    </div>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[24, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item name="contractType">
                    <FloatingSelect label="Contract Type" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="skillsTags">
                    <FloatingInput label="Add skills and press Enter" icon={<TagsOutlined />} />
                  </Form.Item>
                </Col>
              </Row>

              {/* Work Experience List */}
              <Form.List name="workExperience">
                {(fields, { add, remove }) => (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                      <Text strong style={{ fontSize: 13 }}>Work Experience</Text>
                      <Button
                        type="link"
                        icon={<PlusOutlined />}
                        className="v3-add-btn"
                        style={{ marginLeft: 8 }}
                        onClick={() => add()}
                      >
                        Add Experience
                      </Button>
                    </div>
                    {fields.map(({ key, name, ...restField }) => (
                      <Row key={key} gutter={[10, 0]} align="top" className="v3-list-row">
                        <Col xs={24} md={5}>
                          <Form.Item {...restField} name={[name, 'jobTitle']}>
                            <FloatingInput label="Job Title" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={4}>
                          <Form.Item {...restField} name={[name, 'companyName']}>
                            <FloatingInput label="Company Name" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={4}>
                          <Form.Item {...restField} name={[name, 'projectLocation']}>
                            <FloatingSelect label="Location" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={4}>
                          <Form.Item {...restField} name={[name, 'startDate']}>
                            <FloatingDatePicker label="Start Date" style={{ width: '100%' }} />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={4}>
                          <Form.Item {...restField} name={[name, 'endDate']}>
                            <FloatingDatePicker label="End Date" style={{ width: '100%' }} />
                          </Form.Item>
                        </Col>
                        <Col xs={20} md={2} style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 8 }}>
                          <Button type="text" icon={<DeleteOutlined />} onClick={() => remove(name)} />
                        </Col>
                        <Col xs={24}>
                          <Form.Item {...restField} name={[name, 'currentlyWorking']} valuePropName="checked" style={{ marginTop: -16 }}>
                            <Checkbox>Currently working here</Checkbox>
                          </Form.Item>
                        </Col>
                      </Row>
                    ))}
                  </>
                )}
              </Form.List>
            </div>
          </Card>

          {/* ── 3. Employer Details ──────────────────────────────────────── */}
          <Form.List name="employerDetails">
            {(fields, { add, remove }) => (
              <Card
                className="v3-card"
                title={<SectionTitle icon={<BankOutlined />} title="Employer Details" />}
                extra={
                  <Space size={8}>
                    <Text type="secondary" className="v3-card-sub">Current or previous employer information</Text>
                    <Button type="text" icon={<PlusOutlined />} className="v3-add-btn" onClick={() => add()} />
                  </Space>
                }
              >
                {fields.length > 0 && (
                  <Row gutter={[10, 0]} className="v3-col-header-row">
                    <Col md={5}><Text className="v3-col-header">Employer Name</Text></Col>
                    <Col md={5}><Text className="v3-col-header">Contact Person</Text></Col>
                    <Col md={7}><Text className="v3-col-header">Contact Number</Text></Col>
                    <Col md={5}><Text className="v3-col-header">Email</Text></Col>
                    <Col md={2} />
                  </Row>
                )}
                {fields.map(({ key, name, ...restField }) => (
                  <Row key={key} gutter={[10, 0]} align="top" className="v3-list-row">
                    <Col xs={24} md={5}>
                      <Form.Item {...restField} name={[name, 'currentEmployer']}>
                        <FloatingInput label="Employer Name" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={5}>
                      <Form.Item {...restField} name={[name, 'contactPerson']} rules={[validationRules.alphabets()]}>
                        <FloatingInput label="Contact Person" icon={<UserOutlined />} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={7}>
                      <Form.Item style={{ marginBottom: 12 }}>
                        <div className="v3-phone-row">
                          <div className="v3-code-wrap">
                            <Form.Item {...restField} name={[name, 'countryCode']} initialValue="+91" noStyle>
                              <Select className="v3-code-select" variant="borderless">
                                <Select.Option value="+91">+91</Select.Option>
                                <Select.Option value="+1">+1</Select.Option>
                                <Select.Option value="+44">+44</Select.Option>
                              </Select>
                            </Form.Item>
                          </div>
                          <div className="v3-phone-input-wrap">
                            <Form.Item {...restField} name={[name, 'contactNumber']} rules={[validationRules.phone()]} noStyle>
                              <FloatingInput label="Number" icon={<PhoneOutlined />} maxLength={10} />
                            </Form.Item>
                          </div>
                        </div>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={5}>
                      <Form.Item {...restField} name={[name, 'email']} rules={[validationRules.email()]}>
                        <FloatingInput label="Email" icon={<MailOutlined />} />
                      </Form.Item>
                    </Col>
                    <Col xs={4} md={2} style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 8 }}>
                      <Button type="text" icon={<DeleteOutlined />} onClick={() => remove(name)} />
                    </Col>
                  </Row>
                ))}
              </Card>
            )}
          </Form.List>

          {/* ── 4. Education Details ─────────────────────────────────────── */}
          <Form.List name="educationDetails">
            {(fields, { add, remove }) => (
              <Card
                className="v3-card"
                title={<SectionTitle icon={<ReadOutlined />} title="Education Details" />}
                extra={
                  <Space size={8}>
                    <Text type="secondary" className="v3-card-sub">Qualifications and institutions</Text>
                    <Button type="text" icon={<PlusOutlined />} className="v3-add-btn" onClick={() => add()} />
                  </Space>
                }
              >
                {fields.length > 0 && (
                  <Row gutter={[10, 0]} className="v3-col-header-row">
                    <Col md={5}><Text className="v3-col-header">Highest Qualification</Text></Col>
                    <Col md={5}><Text className="v3-col-header">University / College</Text></Col>
                    <Col md={5}><Text className="v3-col-header">Specialization</Text></Col>
                    <Col md={7}><Text className="v3-col-header">Year</Text></Col>
                    <Col md={2} />
                  </Row>
                )}
                {fields.map(({ key, name, ...restField }) => (
                  <Row key={key} gutter={[10, 0]} align="middle" className="v3-list-row">
                    <Col xs={24} md={5}>
                      <Form.Item {...restField} name={[name, 'highestQualification']}>
                        <FloatingSelect label="Qualification" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={5}>
                      <Form.Item {...restField} name={[name, 'universityCollege']}>
                        <FloatingInput label="University / College" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={5}>
                      <Form.Item {...restField} name={[name, 'specialization']}>
                        <FloatingInput label="Specialization" />
                      </Form.Item>
                    </Col>
                    <Col xs={20} md={7}>
                      <Form.Item {...restField} name={[name, 'yearOfPassing']}>
                        <FloatingDatePicker label="Year" picker="year" style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={4} md={2} style={{ display: 'flex', alignItems: 'center' }}>
                      <Button type="text" icon={<DeleteOutlined />} onClick={() => remove(name)} />
                    </Col>
                  </Row>
                ))}
              </Card>
            )}
          </Form.List>

          {/* ── 5. Interview Availability ────────────────────────────────── */}
          <Card
            className="v3-card"
            title={<SectionTitle icon={<CalendarOutlined />} title="Interview Availability" />}
            extra={collapseBtn('interview')}
          >
            <div style={{ display: collapsed.interview ? 'none' : 'block' }}>
              <Row gutter={[24, 0]}>
                <Col xs={24} md={6}>
                  <Form.Item name="interviewDate" rules={[validationRules.required('Interview Date')]}>
                    <FloatingDatePicker label="Interview Date" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item name="startTime">
                    <FloatingTimePicker label="Start Time" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item name="endTime">
                    <FloatingTimePicker label="End Time" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item name="timeZone" rules={[validationRules.required('Time Zone')]}>
                    <FloatingSelect label="Time Zone" />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Card>

          {/* ── 6. Rate Details ──────────────────────────────────────────── */}
          <Card
            className="v3-card"
            title={<SectionTitle icon={<DollarOutlined />} title="Rate Details" />}
            extra={collapseBtn('rate')}
          >
            <div style={{ display: collapsed.rate ? 'none' : 'block' }}>
              <Row gutter={[24, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item label={<span className="v3-group-label">Candidate Rate</span>} required style={{ marginBottom: 32 }}>
                    <div className="v3-rate-row">
                      <div className="v3-rate-input-wrap">
                        <Form.Item name="candidateRate" rules={[validationRules.required('Candidate Rate'), validationRules.number()]} noStyle>
                          <FloatingInput label="Enter rate" />
                        </Form.Item>
                      </div>
                      <div className="v3-rate-currency-wrap">
                        <Form.Item name="rateCurrency" noStyle>
                          <Select className="v3-rate-select" variant="borderless">
                            <Select.Option value="USD">$ USD</Select.Option>
                            <Select.Option value="INR">INR</Select.Option>
                          </Select>
                        </Form.Item>
                      </div>
                      <div className="v3-rate-period-wrap">
                        <Form.Item name="ratePeriod" noStyle>
                          <Select className="v3-rate-select" variant="borderless">
                            <Select.Option value="Hour">Hour</Select.Option>
                            <Select.Option value="Day">Day</Select.Option>
                          </Select>
                        </Form.Item>
                      </div>
                    </div>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label={<span className="v3-group-label">Proposed Rate</span>} required style={{ marginBottom: 32 }}>
                    <div className="v3-rate-row">
                      <div className="v3-rate-input-wrap">
                        <Form.Item name="proposedRate" rules={[validationRules.required('Proposed Rate'), validationRules.number()]} noStyle>
                          <FloatingInput label="Enter rate" />
                        </Form.Item>
                      </div>
                      <div className="v3-rate-currency-wrap">
                        <Form.Item name="proposedRateCurrency" noStyle>
                          <Select className="v3-rate-select" variant="borderless">
                            <Select.Option value="USD">$ USD</Select.Option>
                            <Select.Option value="INR">INR</Select.Option>
                          </Select>
                        </Form.Item>
                      </div>
                      <div className="v3-rate-period-wrap">
                        <Form.Item name="proposedRatePeriod" noStyle>
                          <Select className="v3-rate-select" variant="borderless">
                            <Select.Option value="Hour">Hour</Select.Option>
                            <Select.Option value="Day">Day</Select.Option>
                          </Select>
                        </Form.Item>
                      </div>
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Card>

          {/* ── 7. Additional Details ────────────────────────────────────── */}
          <Card
            className="v3-card"
            title={<SectionTitle icon={<InfoCircleOutlined />} title="Additional Details" />}
            extra={
              <Space size={8}>
                <Text type="secondary" className="v3-card-sub">Source and LinkedIn profile</Text>
                {collapseBtn('additional')}
              </Space>
            }
          >
            <div style={{ display: collapsed.additional ? 'none' : 'block' }}>
              <Row gutter={[24, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item name="formerEmployee" style={{ marginBottom: 24 }}>
                    <div>
                      <div className="v3-group-label" style={{ marginBottom: 8 }}>Former Employee?</div>
                      <Radio.Group
                        value={form.getFieldValue('formerEmployee')}
                        onChange={(e) => form.setFieldsValue({ formerEmployee: e.target.value })}
                      >
                        <Radio value="yes">Yes</Radio>
                        <Radio value="no">No</Radio>
                      </Radio.Group>
                    </div>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="formerBA" style={{ marginBottom: 24 }}>
                    <div>
                      <div className="v3-group-label" style={{ marginBottom: 8 }}>Former BA?</div>
                      <Radio.Group
                        value={form.getFieldValue('formerBA')}
                        onChange={(e) => form.setFieldsValue({ formerBA: e.target.value })}
                      >
                        <Radio value="yes">Yes</Radio>
                        <Radio value="no">No</Radio>
                      </Radio.Group>
                    </div>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[24, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item name="source" rules={[validationRules.required('Source')]}>
                    <FloatingSelect label="Source" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="linkedin" rules={[validationRules.required('LinkedIn'), validationRules.url()]}>
                    <FloatingInput
                      label="LinkedIn Profile URL"
                      icon={<LinkedinOutlined />}
                      onChange={(e) => form.setFieldsValue({ linkedin: formatters.removeSpaces(e.target.value) })}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[24, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item name="languageKnown" style={{ marginBottom: 24 }}>
                    <div>
                      <div className="v3-group-label" style={{ marginBottom: 8 }}>Languages Known</div>
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
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Card>

          {/* ── 8. Documents ─────────────────────────────────────────────── */}
          <Form.List name="documents">
            {(fields, { add, remove }) => (
              <Card
                className="v3-card"
                title={<SectionTitle icon={<FileTextOutlined />} title="Documents" />}
                extra={
                  <Button type="link" icon={<PlusOutlined />} className="v3-add-btn" onClick={() => add()}>
                    Add Document
                  </Button>
                }
              >
                <Row gutter={[10, 0]} className="v3-col-header-row">
                  <Col md={9}><Text className="v3-col-header">File Type</Text></Col>
                  <Col md={7}><Text className="v3-col-header">Document Number</Text></Col>
                  <Col md={6}><Text className="v3-col-header">Expiry Date</Text></Col>
                  <Col md={2}><Text className="v3-col-header">Action</Text></Col>
                </Row>
                {fields.map(({ key, name, ...restField }) => (
                  <Row key={key} gutter={[10, 0]} align="middle" className="v3-list-row">
                    <Col xs={24} md={9}>
                      <Form.Item {...restField} name={[name, 'fileType']}>
                        <Select className="v3-doc-select" variant="borderless" placeholder="Select file type">
                          <Select.Option value="Visa">Visa</Select.Option>
                          <Select.Option value="Driving License">Driving License</Select.Option>
                          <Select.Option value="Passport / I94">Passport / I94</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={7}>
                      <Form.Item {...restField} name={[name, 'docNo']}>
                        <FloatingInput label="Document Number" />
                      </Form.Item>
                    </Col>
                    <Col xs={20} md={6}>
                      <Form.Item {...restField} name={[name, 'expiryDate']}>
                        <FloatingDatePicker label="Expiry Date" style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={4} md={2} style={{ display: 'flex', alignItems: 'center' }}>
                      <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                    </Col>
                  </Row>
                ))}
                <Text type="secondary" className="v3-disclaimer">
                  All data is secure and will be used for verification purposes only.
                </Text>
              </Card>
            )}
          </Form.List>

        </Form>
      </div>

      <div className="v3-footer">
        <Text type="secondary">All unsaved changes will be lost if you cancel.</Text>
        <Space size={12}>
          <Button onClick={() => navigate('/candidates')}>Cancel</Button>
          <Button type="primary" onClick={() => form.submit()}>Create Candidate</Button>
        </Space>
      </div>
    </div>
  );
}
