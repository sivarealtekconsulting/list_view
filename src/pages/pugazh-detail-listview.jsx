import { useState } from "react";
import {
  Row, Col, Space, Tabs, Tag, Typography,
  Card, Breadcrumb, Button, Divider, Table, Avatar, Badge,
} from "antd";
import {
  EnvironmentOutlined, ClockCircleOutlined, BankOutlined,
  DollarOutlined, UserAddOutlined, FileTextOutlined,
  InfoCircleOutlined, TeamOutlined, CalendarOutlined,
  MailOutlined, PhoneOutlined, TrophyOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { MOCK_JOBS } from "../data/jobs";
import StatusBadge from "../components/StatusBadge";
import ClientSubmissionCard from "../components/cards/ClientSubmissionCard";
import StickyNotesCard from "../components/cards/StickyNotesCard";

const { Text, Title } = Typography;

const STATIC = {
  clientId: "Cognizant Technology Solutions - MSP ID 40123789",
  createdOn: "Mar 10, 2026 | 09:00AM",
  targetSubmissions: 12,
  inPipeline: 7,
  client: {
    contactPerson: "Kavitha Sundaram",
    email: "kavitha.sundaram@cognizant.com",
    phone: "9827363281",
  },
  primarySkills: ["React", "Node.js", "TypeScript", "GraphQL", "AWS"],
  secondarySkills: ["Docker", "Kubernetes", "Redis"],
  competencies: ["System Design", "Agile", "Leadership"],
  description: `Bill Rate: 90 - 115
MSP Owner: Suresh Pillai
Location: CHENNAI / REMOTE
Duration: 12 months
GbaMS ReqID: 40123001

Experience: 6-10 years in Full Stack Development

Roles & Responsibilities
- Build scalable web applications using React and Node.js.
- Design RESTful and GraphQL APIs for enterprise applications.
- Collaborate with UX designers to implement responsive UI.
- Optimize application performance and scalability.
- Lead code reviews and mentor junior developers.

Required Skills
- Strong proficiency in React, TypeScript, and Node.js.
- Hands-on experience with GraphQL and REST APIs.
- Knowledge of AWS services: EC2, S3, Lambda, RDS.
- Familiarity with Docker and Kubernetes.
- Experience with CI/CD pipelines and Git workflows.`,
  additionalDetails: {
    noticePeriod: "30 Days",
    businessUnit: "Cognizant Digital Business",
  },
  activities: [
    {
      date: "May 20, 2026",
      items: [
        { type: "Shortlist", color: "blue", time: "10:30 AM", text: "Move to Pipeline for CGJOB26052001 lead by recruiter_cog" },
        { type: "Shortlist", color: "blue", time: "02:00 PM", text: "Move to Pipeline for CGJOB26052002 Tech Lead by recruiter_cog" },
      ],
    },
    {
      date: "May 17, 2026",
      items: [
        { type: "Submitted", color: "green", time: "04:00 PM", text: "Candidate submitted to Job ID CGJOB26052001" },
        { type: "Rejected", color: "red", time: "06:30 PM", text: "Submission status changed to re-submission for CGJOB26040123" },
      ],
    },
  ],
};

const candidateColumns = [
  {
    title: "Candidate",
    dataIndex: "name",
    key: "name",
    render: (v, r) => (
      <Space>
        <Avatar className="detail-avatar">{v.charAt(0)}</Avatar>
        <Space direction="vertical" size={0}>
          <Text strong>{v}</Text>
          <Text type="secondary">{r.designation}</Text>
        </Space>
      </Space>
    ),
  },
  {
    title: "Location",
    dataIndex: "location",
    key: "location",
    render: (v) => (
      <Space size={4}>
        <EnvironmentOutlined />
        <Text>{v}</Text>
      </Space>
    ),
  },
  {
    title: "Experience",
    dataIndex: "experience",
    key: "experience",
    render: (v) => <Tag color="blue">{v}</Tag>,
  },
  {
    title: "Work Auth",
    dataIndex: "workAuth",
    key: "workAuth",
    render: (v) => <Tag>{v}</Tag>,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (v) => (
      <Tag color={
        v === "Submitted" ? "green" :
          v === "Pipeline" ? "blue" :
            v === "Shortlisted" ? "orange" : "default"
      }>
        {v}
      </Tag>
    ),
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: (v) => (
      <Space size={4}>
        <CalendarOutlined />
        <Text type="secondary">{v}</Text>
      </Space>
    ),
  },
];

const candidateData = [
  { key: 1, name: "Karthik Rajan", designation: "Java Backend Engineer", location: "Bangalore", experience: "8 years", workAuth: "Indian", status: "Submitted", date: "May 15, 2026" },
  { key: 2, name: "Preethi Sharma", designation: "Microservices Developer", location: "Hyderabad", experience: "6 years", workAuth: "Indian", status: "Pipeline", date: "May 13, 2026" },
  { key: 3, name: "Arjun Pillai", designation: "Kafka Engineer", location: "Pune", experience: "10 years", workAuth: "H1B", status: "Shortlisted", date: "May 11, 2026" },
  { key: 4, name: "Sneha Kulkarni", designation: "Spring Boot Developer", location: "Chennai", experience: "7 years", workAuth: "L2 EAD", status: "Submitted", date: "May 10, 2026" },
  { key: 5, name: "Rahul Chatterjee", designation: "Senior Backend Engineer", location: "Mumbai", experience: "9 years", workAuth: "GC EAD", status: "Pipeline", date: "May 09, 2026" },
];

export default function PugazhDetailListview() {
  const navigate = useNavigate();
  const { jobId, id } = useParams();
  const resolvedId = jobId || id;
  const job = MOCK_JOBS.find((j) => String(j.key) === String(resolvedId)) ?? MOCK_JOBS[0];
  const [activeRight, setActiveRight] = useState("activity");

  const detailsContent = (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card size="small" className="client-details-card"
          title={<Space><TeamOutlined /><Text strong>Client Information</Text></Space>}
        >
          <Row gutter={[32, 16]}>
            <Col xs={24} md={8}>
              <Space direction="vertical" size={4}>
                <Text type="secondary">Contact Person</Text>
                <Space>
                  <Avatar className="detail-avatar-sm">{STATIC.client.contactPerson.charAt(0)}</Avatar>
                  <Text strong>{STATIC.client.contactPerson}</Text>
                </Space>
              </Space>
            </Col>
            <Col xs={24} md={8}>
              <Space direction="vertical" size={4}>
                <Text type="secondary">Email</Text>
                <Space size={4}>
                  <MailOutlined />
                  <a href={`mailto:${STATIC.client.email}`}>{STATIC.client.email}</a>
                </Space>
              </Space>
            </Col>
            <Col xs={24} md={8}>
              <Space direction="vertical" size={4}>
                <Text type="secondary">Phone Number</Text>
                <Space size={4}>
                  <PhoneOutlined />
                  <a href={`tel:${STATIC.client.phone}`}>{STATIC.client.phone}</a>
                </Space>
              </Space>
            </Col>
          </Row>
        </Card>
      </Col>

      <Col span={24}>
        <Card size="small" className="client-details-card"
          title={<Space><TrophyOutlined /><Text strong>Skills & Competencies</Text></Space>}
        >
          <Row gutter={[32, 16]}>
            <Col xs={24} md={8}>
              <Space direction="vertical" size={6}>
                <Text type="secondary">Primary Skills</Text>
                <Space wrap size={[6, 6]}>
                  {STATIC.primarySkills.map((s) => <Tag key={s} color="blue">{s}</Tag>)}
                </Space>
              </Space>
            </Col>
            <Col xs={24} md={8}>
              <Space direction="vertical" size={6}>
                <Text type="secondary">Secondary Skills</Text>
                <Space wrap size={[6, 6]}>
                  {STATIC.secondarySkills.map((s) => <Tag key={s} color="purple">{s}</Tag>)}
                </Space>
              </Space>
            </Col>
            <Col xs={24} md={8}>
              <Space direction="vertical" size={6}>
                <Text type="secondary">Competencies</Text>
                <Space wrap size={[6, 6]}>
                  {STATIC.competencies.map((s) => <Tag key={s} color="green">{s}</Tag>)}
                </Space>
              </Space>
            </Col>
          </Row>
        </Card>
      </Col>

      <Col span={24}>
        <Card size="small" className="client-details-card"
          title={<Space><FileTextOutlined /><Text strong>Job Description</Text></Space>}
        >
          <Space direction="vertical" size={4} className="detail-full-width">
            {STATIC.description.split("\n").map((line, i) => (
              <Text key={i}>{line || <br />}</Text>
            ))}
          </Space>
        </Card>
      </Col>

      <Col span={24}>
        <Card size="small" className="client-details-card"
          title={<Space><InfoCircleOutlined /><Text strong>Additional Details</Text></Space>}
        >
          <Row gutter={[32, 16]}>
            <Col xs={24} md={8}>
              <Space direction="vertical" size={4}>
                <Text type="secondary">Notice Period</Text>
                <Tag color="orange">{STATIC.additionalDetails.noticePeriod}</Tag>
              </Space>
            </Col>
            <Col xs={24} md={8}>
              <Space direction="vertical" size={4}>
                <Text type="secondary">Business Unit</Text>
                <Text strong>{STATIC.additionalDetails.businessUnit}</Text>
              </Space>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );

  const tabItems = [
    {
      key: "details",
      label: <Space size={4}>Details<Badge count={1} size="small" /></Space>,
      children: detailsContent,
    },
    {
      key: "candidate",
      label: <Space size={4}>Candidate<Badge count={candidateData.length} size="small" color="red" /></Space>,
      children: (
        <Table
          columns={candidateColumns}
          dataSource={candidateData}
          size="middle"
          pagination={false}
        />
      ),
    },
  ];

  return (
    <div className="dashboard-wrapper">

      <Breadcrumb
        items={[
          { title: <a href="/">Home</a> },
          { title: <a href="/pugazh-dashboard">dashboard</a> },
          { title: "Detailed View" },
        ]}
      />

      <Row gutter={[16, 16]} className="detail-margin-top">

        {/* ── Left Card — info + tabs ── */}
        <Col xs={24} lg={16}>
          <Card className="client-details-card">
            <Space direction="vertical" size={12} className="detail-full-width">
              <Text type="secondary">{STATIC.clientId}</Text>
              <Row justify="space-between" align="middle">
                <Col>
                  <Space align="center" wrap size={10}>
                    <Title level={4}>{job.title} - 38975</Title>
                    <StatusBadge status={job.status} />
                  </Space>
                </Col>

                <Col>
                  <Button type="primary" onClick={() => navigate("/pugazh-edit-job")}>
                    Edit
                  </Button>
                </Col>
              </Row>
              <Space wrap size={20}>
                <Text type="secondary"><EnvironmentOutlined /> {job.location}</Text>
                <Text type="secondary"><ClockCircleOutlined /> {job.experience}</Text>
                <Text type="secondary"><BankOutlined /> {job.employmentType} · {job.locationType}</Text>
                <Text type="secondary"><DollarOutlined /> Client rate: ${job.clientRate}/hr</Text>
              </Space>
              <Tabs defaultActiveKey="details" items={tabItems} />
            </Space>
          </Card>
        </Col>

        {/* ── Right Col ── */}
        <Col xs={24} lg={8}>
          <Space direction="vertical" size={16} className="detail-full-width">

            {/* Stats Card */}
            <Card className="client-details-card">
              <Row justify="space-between" align="middle">
                <Col>
                  <Row gutter={[40, 0]}>
                    <Col>
                      <Space direction="vertical" size={2} align="center">
                        <Text type="secondary">Target</Text>
                        <Title level={2} className="detail-stat-blue">{STATIC.targetSubmissions}</Title>
                        <Text type="secondary">submissions</Text>
                      </Space>
                    </Col>
                    <Col>
                      <Space direction="vertical" size={2} align="center">
                        <Text type="secondary">In pipeline</Text>
                        <Title level={2} className="detail-stat-green">{STATIC.inPipeline}</Title>
                        <Text type="secondary">candidates</Text>
                      </Space>
                    </Col>
                  </Row>
                  <Text type="secondary">
                    <CalendarOutlined /> Created on {STATIC.createdOn}
                  </Text>
                </Col>
                <Col>
                  <Space direction="vertical" size={12} align="end">
                    <Button type="primary" icon={<UserAddOutlined />}>
                      Source Candidates
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Card>

            {/* Activity Card */}
            <Card
              className="client-details-card"
              tabList={[
                { key: "activity", label: <Space size={4}>Activity<Badge count={2} size="small" color="red" /></Space> },
                { key: "notes", label: "Notes" },
              ]}
              activeTabKey={activeRight}
              onTabChange={setActiveRight}
            >
              {activeRight === "activity" && (
                <Space direction="vertical" size={16} className="detail-full-width">
                  {STATIC.activities.map((group, gi) => (
                    <div key={gi}>
                      <Space size={6}>
                        <CalendarOutlined />
                        <Text strong>{group.date}</Text>
                      </Space>
                      <Space direction="vertical" size={8} className="detail-full-width">
                        {group.items.map((item, ii) => (
                          <Card key={ii} size="small" className="client-details-card">
                            <Space direction="vertical" size={4}>
                              <Space>
                                <Tag color={item.color}>{item.type}</Tag>
                                <Text type="secondary">{item.time}</Text>
                              </Space>
                              <Text type="secondary">{item.text}</Text>
                            </Space>
                          </Card>
                        ))}
                      </Space>
                      {gi < STATIC.activities.length - 1 && <Divider />}
                    </div>
                  ))}
                </Space>
              )}
              {activeRight === "notes" && (
                <Space direction="vertical" align="center" className="detail-full-width">
                  <FileTextOutlined />
                  <Text type="secondary">No notes added yet.</Text>
                </Space>
              )}
              <ClientSubmissionCard />
              <StickyNotesCard />
            </Card>

          </Space>
        </Col>

      </Row>
    </div>
  );
}