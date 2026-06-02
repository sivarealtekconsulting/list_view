import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Typography,
  Upload,
} from 'antd';

import {
  PlusOutlined,
  MinusOutlined,
  InboxOutlined,
} from '@ant-design/icons';

import {
  useNavigate,
} from 'react-router-dom';

import { useState } from 'react';

import CalendarCard from '../components/cards/CalendarCard';
import ClientDetailsCard from '../components/cards/ClientDetailsCard';
import ClientSubmissionCard from '../components/cards/ClientSubmissionCard';
import StatsCards from '../components/cards/StatsCards';
import StickyNotesCard from '../components/cards/StickyNotesCard';
import UserForm from '../components/form/forms';

import ListViews from '../components/suryaListView';

import {
  validationRules,
  formatters,
} from '../components/form/validation';

const { Text } = Typography;
const { TextArea } = Input;

export default function NewDashboard() {

  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);

  return (

    <div className="dashboard-wrapper">

      <Row gutter={[16, 16]}>

        {/* BREADCRUMB */}
        <Col span={24}>

          <Breadcrumb
            items={[
              {
                title: (
                  <Text
                    type="secondary"
                    onClick={() => navigate('/')}
                  >
                    Home
                  </Text>
                ),
              },
              {
                title: (
                  <Text strong>
                    Dashboard
                  </Text>
                ),
              },
            ]}
          />

        </Col>

        {/* ROW 1 */}
        <Col span={24}>
          <StatsCards />
        </Col>

        {/* ROW 2 */}
        <Col xs={24} md={12}>
          <ClientSubmissionCard />
        </Col>

        <Col xs={24} md={12}>
          <ClientDetailsCard />
        </Col>

        {/* ROW 3 */}
        <Col xs={24} md={12}>
          <StickyNotesCard />
        </Col>

        <Col xs={24} md={12}>
          <CalendarCard />
        </Col>

        {/* FORM BUTTON */}
        <Col span={24}>

          <Card className="dashboard-card">

            <Row justify="space-between" align="middle">

              <Col>

                <Text strong>
                  Candidate Management
                </Text>

              </Col>

              <Col>

                <Button
                  type="primary"
                  icon={
                    showForm
                      ? <MinusOutlined />
                      : <PlusOutlined />
                  }
                  onClick={() =>
                    setShowForm(!showForm)
                  }
                >

                  {
                    showForm
                      ? 'Close Candidate Form'
                      : 'Open Candidate Form'
                  }

                </Button>

              </Col>

            </Row>

          </Card>

        </Col>

        {/* FORM */}
        {
          showForm && (
            <Col span={24}>
              <Card
                title="Candidate Form"
                className="dashboard-card"
              >
                <UserForm />
              </Card>
            </Col>
          )
        }

        {/* LIST VIEW */}
        <Col span={24}>
          <ListViews />
        </Col>

      </Row>

    </div>
  );
}