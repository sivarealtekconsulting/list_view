import { Card, Col, Row, Typography, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import '../../styles/ClientSubmissionCard.css';

const { Text } = Typography;

const TOTAL = 1324;
const rows = [
  { label: 'Submitted', value: 534, barColor: '#1d4ed8', accentColor: '#f97316', showInfo: true  },
  { label: 'Rejected',  value: 87,  barColor: '#ef4444', accentColor: null,      showInfo: false },
];

export default function ClientSubmissionCard() {
  return (
    <Card className="submission-card">

      <Row justify="space-between" align="middle" className="submission-header">
        <Col>
          <Text className="submission-title">Total Client Submission:</Text>
        </Col>
        <Col>
          <Text className="submission-total">{TOTAL.toLocaleString()}</Text>
        </Col>
      </Row>

      <div className="submission-rows">
        {rows.map(r => (
          <div key={r.label}>

            <Row justify="space-between" align="middle" className="submission-row-header">
              <Col>
                <Row align="middle" gutter={6}>
                  <Col>
                    <Text className="submission-row-label">{r.label}</Text>
                  </Col>
                  {r.showInfo && (
                    <Col>
                      <Tooltip title="Submitted to client pipeline">
                        <InfoCircleOutlined className="submission-info-icon" />
                      </Tooltip>
                    </Col>
                  )}
                </Row>
              </Col>
              <Col>
                <Text className="submission-row-value" style={{ color: r.barColor }}>
                  {r.value}
                </Text>
              </Col>
            </Row>

            <div className="submission-bar-track">
              {r.accentColor && (
                <div className="submission-bar-accent" style={{ background: r.accentColor }} />
              )}
              <div
                className="submission-bar-fill"
                style={{
                  left: r.accentColor ? '12%' : '0',
                  width: r.accentColor
                    ? `${(r.value / TOTAL) * 100 - 12}%`
                    : `${(r.value / TOTAL) * 100}%`,
                  background: r.barColor,
                }}
              />
            </div>

          </div>
        ))}
      </div>

    </Card>
  );
}
