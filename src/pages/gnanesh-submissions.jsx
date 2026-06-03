import {
  Breadcrumb,
  Layout,
  Typography,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import GnaneshSubmissionsListView from '../components/GnaneshSubmissionsListView';

const { Content } = Layout;
const { Text, Link } = Typography;

export default function SubmissionsPage() {
  const navigate = useNavigate();

  return (
    <Layout className="jobs-page-shell">
      <Layout className="jobs-page-layout">
        <Content className="jobs-page-content">

          <div
            className="jobs-page-breadcrumb-row"
            style={{ padding: '16px 24px 0' }}
          >
            <Breadcrumb
              items={[
                {
                  title: (
                    <Text
                      type="secondary"
                      className="jobs-page-breadcrumb-home"
                      onClick={() => navigate('/')}
                      style={{ cursor: 'pointer' }}
                    >
                      Home
                    </Text>
                  ),
                },
                {
                  title: (
                    <Text strong className="jobs-page-breadcrumb-active">
                      Submissions
                    </Text>
                  ),
                },
              ]}
            />
          </div>

          <div className="dashboard-wrapper">
            <GnaneshSubmissionsListView />
          </div>

        </Content>
      </Layout>
    </Layout>
  );
}