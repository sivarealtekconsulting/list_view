import { Button, Card, Row, Col, Statistic, Typography } from 'antd';
import '../../styles/OnboardingCard.css';

const { Title, Text } = Typography;

const items = [
  { label: 'Target Submissions',       value: 5, color: 'blue'   },
  { label: 'In Pipeline',             value: '-',  color: 'blue'  },
  { label: 'Created On', value: 'Nov 03, 2025 | 07:00PM', color: 'blue' },
];

export default function OnboardingCard() {
  return (
    <Card
      className="onboarding-card"
      title={<Title level={5}>Onboarding</Title>}
      extra={<Button type="link">View all</Button>}
    >
      <Row gutter={[12, 12]}>
        {items.map(it => (
          <Col key={it.label} xs={12} sm={6} md={6} lg={12} xl={12}>
            <div className={`onboarding-item ${it.color}`}>
              <Text className="onboarding-item-label">{it.label}</Text>
              <Statistic value={it.value} className="onboarding-stat" />
              <div className="onboarding-item-footer">
                <Text className="onboarding-item-sub">{it.sub}</Text>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Card>
  );
}
