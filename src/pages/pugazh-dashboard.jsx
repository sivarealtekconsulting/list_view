import { useState } from 'react';
import { Row, Col, Space, Card, Form, Input, Button, Select, Affix, Breadcrumb } from 'antd';
import { validationRules, formatters } from '../components/form/validation';
import StatsCards from '../components/cards/StatsCards';
import JobListView from '../components/pugalistView';
import ListView from '../components/sridharListView';
import CalendarCard from '../components/cards/CalendarCard';
import ClientSubmissionCard from '../components/cards/ClientSubmissionCard';
import ClientDetailsCard from '../components/cards/ClientDetailsCard';
import StickyNotesCard from '../components/cards/StickyNotesCard';
import OnboardingCard from '../components/cards/OnboardingCard';
import {
  ONBOARDING_STATS,
  JOB_STATS,
  CLIENT_SUBMISSION_STATS,
  CALENDAR_EVENTS,
  CALENDAR_LEGEND,
  STICKY_NOTES,
  FORM_OPTIONS,
  MOCK_CLIENTS,
  SRIDHAR_DASHBOARD_STATS,
  PUG_DASHBOARD_STATS,
  PUG_DASHBOARD_DETAIL_DATA,
  PUG_DASHBOARD_DASHBOARD_CARDS,
  PUG_DASHBOARD_JOB_LIST_SUMMARY,
  PUG_DASHBOARD_MOCK_JOBS,
  PUG_DASHBOARD_JOBS_DATA
} from '../data/jobs';
import pugData from '../data/pug-data.json';
const { TextArea } = Input;

export default function PugazhDashboard() {
  const [form] = Form.useForm();

  const handleCandidateSubmit = (values) => {
    console.log('Candidate Values:', values);
  };

  return (
    <div className="dashboard-wrapper">
      <Breadcrumb
        items={[
          { title: 'Home' },
          { title: 'dashboard' },
        ]}
      />

      <Row gutter={[16, 16]} align="stretch">

        <Col xs={24} lg={16}>
          <Space direction="vertical" size={12} className="jobs-page-left">
            <OnboardingCard items={PUG_DASHBOARD_DASHBOARD_CARDS.onboarding } />
            <StatsCards stats={PUG_DASHBOARD_STATS} />
            <JobListView jobs={PUG_DASHBOARD_MOCK_JOBS} summary={PUG_DASHBOARD_JOB_LIST_SUMMARY} />
          </Space>
        </Col>

        <Col xs={24} lg={8}>
          <Space direction="vertical" size={12} className="jobs-page-right">
            <CalendarCard events={CALENDAR_EVENTS} legend={CALENDAR_LEGEND} />
            <ClientSubmissionCard data={CLIENT_SUBMISSION_STATS} />
            <StickyNotesCard notes={STICKY_NOTES} />
          </Space>
        </Col>

      </Row>

      <div style={{ marginTop: 16, marginBottom: 16 }} className="client-details-card">
        <ClientDetailsCard clients={MOCK_CLIENTS} />
      </div>

      <Card
        className="client-details-card candidate-registration-card"
        title="Candidate Registration"
        style={{ marginTop: 16 }}
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          onFinish={handleCandidateSubmit}
        >
          <Row gutter={[16, 8]}>

            <Col xs={24} md={8}>
              <Form.Item
                label="Candidate Name"
                name="candidateName"
                validateTrigger={['onBlur', 'onChange']}
                rules={[
                  validationRules.required('Candidate Name'),
                  validationRules.alphabets(),
                  validationRules.firstNameMinLength(),
                  validationRules.firstNameMaxLength(),
                ]}
              >
                <Input
                  placeholder="Enter candidate name"
                  onChange={(e) =>
                    form.setFieldsValue({
                      candidateName: formatters.fullNameFormatter(e.target.value),
                    })
                  }
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Email"
                name="email"
                validateTrigger={['onBlur', 'onChange']}
                rules={[validationRules.required('Email'), validationRules.email()]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Phone Number"
                name="phone"
                validateTrigger={['onBlur', 'onChange']}
                rules={[validationRules.required('Phone Number'), validationRules.phone()]}
              >
                <Input
                  maxLength={10}
                  placeholder="Enter phone number"
                  onChange={(e) =>
                    form.setFieldsValue({
                      phone: formatters.phoneFormatter(e.target.value),
                    })
                  }
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="MSP Req ID"
                name="mspReqId"
                validateTrigger={['onBlur', 'onChange']}
                rules={[
                  validationRules.required('MSP Req ID'),
                  validationRules.candidateId('MSP Req ID'),
                ]}
              >
                <Input
                  placeholder="Enter MSP Req ID"
                  onChange={(e) =>
                    form.setFieldsValue({
                      mspReqId: formatters.removeExtraSpaces(e.target.value),
                    })
                  }
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Job Title"
                name="jobTitle"
                validateTrigger={['onBlur', 'onChange']}
                rules={[validationRules.required('Job Title'), validationRules.alphanumeric()]}
              >
                <Input placeholder="Enter job title" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Primary Skill"
                name="primarySkill"
                validateTrigger={['onBlur', 'onChange']}
                rules={[validationRules.required('Primary Skill'), validationRules.alphabets()]}
              >
                <Input placeholder="Example: React JS, Java, Python" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Experience"
                name="experience"
                rules={[validationRules.required('Experience')]}
              >
                <Select
                  placeholder="Select experience"
                  allowClear
                  options={FORM_OPTIONS.experience}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Contract Type"
                name="contractType"
                rules={[validationRules.required('Contract Type')]}
              >
                <Select
                  placeholder="Select contract type"
                  allowClear
                  options={FORM_OPTIONS.contractType}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Skill Match Level"
                name="skillMatchLevel"
                rules={[validationRules.required('Skill Match Level')]}
              >
                <Select
                  placeholder="Select skill match level"
                  allowClear
                  options={FORM_OPTIONS.skillMatchLevel}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Work Authorization"
                name="workAuthorization"
                rules={[validationRules.required('Work Authorization')]}
              >
                <Select
                  placeholder="Select work authorization"
                  allowClear
                  options={FORM_OPTIONS.workAuthorization}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Current Location"
                name="currentLocation"
                validateTrigger={['onBlur', 'onChange']}
                rules={[
                  validationRules.required('Current Location'),
                  validationRules.alphabets(),
                ]}
              >
                <Input placeholder="Enter current location" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Notice Period"
                name="noticePeriod"
                rules={[validationRules.required('Notice Period')]}
              >
                <Select
                  placeholder="Select notice period"
                  allowClear
                  options={FORM_OPTIONS.noticePeriod}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Recruiter Skill Notes"
                name="remarks"
                validateTrigger={['onBlur', 'onChange']}
                rules={[
                  validationRules.required('Recruiter Skill Notes'),
                  validationRules.remarks(),
                  validationRules.remarksMinLength(),
                  validationRules.remarksMaxLength(),
                ]}
              >
                <TextArea rows={4} placeholder="Enter recruiter notes" />
              </Form.Item>
            </Col>

          </Row>

          <Affix offsetBottom={0}>
            <Card>
              <Row justify="end" gutter={12}>
                <Space>
                  <Button type="primary" htmlType="submit">
                    Submit Candidate
                  </Button>
                  <Button onClick={() => form.resetFields()}>
                    Reset
                  </Button>
                </Space>
              </Row>
            </Card>
          </Affix>

        </Form>
      </Card>

    </div>
  );
}