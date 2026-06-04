import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Tabs,
  Table,
  Tag,
  Avatar,
  Dropdown,
  Button,
  Typography,
  Space,
  Checkbox,
  Card,
  Row,
  Col,
  Flex,
  message,
} from "antd";

import {
  AppstoreOutlined,
  TeamOutlined,
  SendOutlined,
  ShareAltOutlined,
  NotificationOutlined,
  CalendarOutlined,
  FileTextOutlined,
  SafetyOutlined,
  MoreOutlined,
  GlobalOutlined,
  DeploymentUnitOutlined,
  UsergroupAddOutlined,
  ProfileOutlined,
  BellOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  BankOutlined,
  UserOutlined,
  DownOutlined,
  SunOutlined,
  MoonOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import "antd/dist/reset.css";
import "../styles/mode-theme.css";
import SonyListView from "../components/SonyListView";
import DetailedViewContent from "./DetailPageLayout";
import DetailPageLayout from "./DetailPageLayout";
import SectionCard from "../components/cards/SectionCard";
import { candidateSections } from "../../candidate.config";
import CalendarCard from "../components/cards/CalendarCard";
import SonyListViewMode from "../components/sonyListViewMode";
import { getJobDetailedView } from "../services/jobsApi";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const menu = {
  items: [
    { key: "1", label: "Quick Submit" },
    { key: "2", label: "Tag to another Job" },
    { key: "3", label: "Move to Pipeline" },
    {
      key: "4",
      danger: true,
      label: "Remove from Shortlist",
    },
  ],
};

const data = [
  {
    key: 1,
    candidate: "Dheeraj Komerelly",
    role: "Sr.Java Full Stack Developer",
    email: "dheer123@gmail.com",
    phone: "+1 (943)-854-353",
    location: "California Gully, Australia",
    exp: "12 Years",
    auth: "H1B",
    skills: ["Java", "Python", "HTML", "JIRA"],
    jobs: "02",
    no: "04",
  },
  {
    key: 2,
    candidate: "Tarun Kumar Singh",
    role: "Sr.Java Full Stack Developer",
    email: "tarunkumarsingh1211@gmail.com",
    phone: "+1 (995)-844-313",
    location: "Texas",
    exp: "10 Years",
    auth: "H1B",
    skills: ["SQL", "Power BI", "ETL Pipelines"],
    jobs: "02",
    no: "05",
  },
];


export default function App() {
  const [tabContent, setTabContent] = useState("");
  const [theme, setTheme] = useState("theme-light");
  const [activeTab, setActiveTab] = useState("jobs");
  const [detailedView, setDetailedView] = useState([]);
  const [loading, setLoading] = useState(false);



  const fetchDetailedView = async (module) => {
    try {
      setLoading(true);

      const response = await getJobDetailedView(module);
      console.log("module", module);
      console.log("API Response", response);

      if (module === "jobs") {
        setDetailedView(response.data.jobDetailedView || []);
      } else if (module === "candidates") {
        setDetailedView(response.data.candidateDetailedView || []);
      } else if (module === "submission") {
        setDetailedView(response.data.submissionDetailedView || []);
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDetailedView(activeTab);
  }, [activeTab]);

  const items = [
    {
      key: '1',
      label: (
        <div
          onClick={() =>
            setTheme("theme-light")
          }
        >
          <SunOutlined /> Light mode
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div onClick={() =>
          setTheme("theme-dark")
        }
        >
          <MoonOutlined /> Dark mode
        </div>
      ),
    }
  ];

  return (
    <div className={`dashboard-wrapper ${theme} app-theme`} >
      <Flex vertical align="flex-end" style={{ padding: "20px 00px" }}>
        <Dropdown menu={{ items }} placement="bottomRight" arrow>
          <Button><SettingOutlined /> Settings</Button>
        </Dropdown>
      </Flex>
      <Content className="content-wrap ">
        {/* JOB CARD */}

        <Card>
          {/* <Row gutter={[12, 12]} lg={24}> */}
          <Flex align="space-between">
            <Col lg={19}>
              <div>
                <div className="job-id">
                  TCS - MSP ID 10432419
                </div>

                <div className="job-title-row">
                  <h2>
                    DevOps Engineer - 38975
                  </h2>

                  <Tag color="green">
                    Open
                  </Tag>
                </div>

                <Space
                  size={12}
                  className="job-meta"
                >
                  <span>
                    <EnvironmentOutlined /> San Jose,
                    CA
                  </span>

                  <span>
                    <ClockCircleOutlined /> 4 - 6
                    years
                  </span>

                  <span>
                    <BankOutlined /> Full Time ·
                    Onsite
                  </span>

                  <span>
                    <DollarOutlined /> Client rate:
                    $80/hr
                  </span>
                </Space>
              </div>
              <div>
                <Tabs
                  defaultActiveKey="1"
                  className="custom-tabs"
                  activeKey={activeTab}
                  onChange={setActiveTab}
                  items={[
                    {
                      key: "jobs",
                      label: (
                        <div className="tab-label">
                          <GlobalOutlined />
                          Job
                        </div>
                      ),
                    },

                    {
                      key: "candidates",
                      label: (
                        <div className="tab-label">
                          <DeploymentUnitOutlined />
                          Candidates
                        </div>
                      ),
                    },
                    {
                      key: "submission",
                      label: (
                        <div className="tab-label">
                          <DeploymentUnitOutlined />
                          Submission
                        </div>
                      ),
                    }
                  ]}
                />
              </div>
            </Col>
            <Col lg={5}>
              <Flex align="flex-end" vertical>
                <Dropdown menu={{ items }} placement="bottomRight" arrow={{ pointAtCenter: true }}>
                  <Button className="more-actionsButton">
                    <MoreOutlined className="more-actionsIcon" />
                  </Button>
                </Dropdown>
              </Flex>
              <Flex align="flex-end" vertical>
                <div className="job-stats">
                  <div>
                    <div className="totalSubmissionLabel">
                      Target submissions
                    </div>
                    <strong className="totalSubmissionLabel_Count">12</strong>
                  </div>

                  <div>
                    <div className="totalSubmissionLabel">
                      In pipeline
                    </div>

                    <strong className="totalSubmissionLabel_Count">8</strong>
                  </div>
                </div>
              </Flex>
              <Flex align="flex-end" vertical>
                <div className="createdOndata">
                  Created on Nov 03, 2025 | 07:00PM
                </div>
              </Flex>
            </Col>
          </Flex>
          {/* </Row> */}
        </Card>
        <div style={{ marginTop: "10px" }}>
         <DetailPageLayout
            leftContent={
              <>
                <Row gutter={[16, 16]}>
                  {Array.isArray(detailedView) &&
                    detailedView.map((section) => {
                      console.log("section", section);
                      return (
                        <Col span={24} key={section.header}>
                          <Card>
                            <div className="sectionHeader">
                              {section.header}
                            </div>

                            <Row gutter={[16, 16]}>
                              {section.items.map((item) => (
                                <SectionCard
                                  key={item.title}
                                  title={item.title}
                                >
                                  {item.value}
                                </SectionCard>
                              ))}
                            </Row>
                          </Card>
                        </Col>
                      )
                    })
                  }
                </Row>
              </>
            }
            rightContent={
              <>
                <Card>
                  <CalendarCard />
                </Card>

              </>
            }
            // fullcontent={
            //   <div style={{ marginTop: "10px" }}>
            //     <SonyListViewMode />
            //   </div>
            // }
          />
        </div>
      </Content>
    </div>
  );
}