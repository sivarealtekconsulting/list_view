import { useState } from 'react';
import {
  Button, Card, Col, Row, Select,
  Space, Table, Typography,
} from 'antd';
import {
  CheckCircleOutlined, ClockCircleOutlined, CloseOutlined,
} from '@ant-design/icons';
import StatsCards from '../components/cards/StatsCards';
import StickyNotesCard from '../components/cards/StickyNotesCard';
import CalendarCard from '../components/cards/CalendarCard';

const { Text, Link } = Typography;

/* ---- Table data ---- */
const tableData = [
  { key: '1', candidateId: 'AUTO123456', name: 'Seline',  jobId: '101528088 - 51779', gross: 12.00, net:   2.80, stage: 'Po Not Initiated' },
  { key: '2', candidateId: 'AUTO549812', name: 'Yebella',    jobId: '765484511',          gross: 10.00, net: -64.16, stage: 'CFO Pending'      },
  { key: '3', candidateId: 'AUTO945121', name: 'Kribiz',  jobId: '478494510',          gross:  8.00, net:   8.00, stage: 'Po Issued'        },
  { key: '4', candidateId: 'AUTO978451', name: 'Rebexa',     jobId: '798464121',          gross:  8.00, net: -11.05, stage: 'Po Not Initiated' },
  { key: '5', candidateId: 'AUTO961214', name: 'Yovenk',        jobId: '974623017',          gross:  6.00, net:   1.27, stage: 'Po Not Initiated' },
  { key: '6', candidateId: 'AUTO984671', name: 'Duplix',     jobId: '654715121',          gross:  6.00, net: 255.84, stage: 'Po Not Initiated' },
];

const netColor = (v) => (v < 0 ? '#ef4444' : v < 5 ? '#f97316' : '#16a34a');

const stageIcon = (stage) => {
  if (stage === 'Po Issued')    return <CheckCircleOutlined style={{ color: '#16a34a', marginRight: 4 }} />;
  if (stage === 'CFO Pending')  return <ClockCircleOutlined style={{ color: '#3b82f6', marginRight: 4 }} />;
  return <ClockCircleOutlined style={{ color: '#9ca3af', marginRight: 4 }} />;
};

const columns = [
  {
    title: 'Candidate ID',
    dataIndex: 'candidateId',
    sorter: true,
    render: (v) => <Text style={{ fontSize: 13 }}>{v}</Text>,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: true,
    render: (v) => <Link style={{ color: '#1d4ed8', fontSize: 13 }}>{v}</Link>,
  },
  {
    title: 'Client Job ID',
    dataIndex: 'jobId',
    sorter: true,
    render: (v) => <Text style={{ fontSize: 13 }}>{v}</Text>,
  },
  {
    title: 'Gross Margin',
    dataIndex: 'gross',
    sorter: true,
    render: (v) => <Text style={{ fontSize: 13 }}>${v.toFixed(2)}</Text>,
  },
  {
    title: 'Net Margin',
    dataIndex: 'net',
    sorter: true,
    render: (v) => (
      <Text strong style={{ color: netColor(v), fontSize: 13 }}>
        {v < 0 ? `-$${Math.abs(v).toFixed(2)}` : `$${v.toFixed(2)}`}
      </Text>
    ),
  },
  {
    title: 'Stage',
    dataIndex: 'stage',
    sorter: true,
    render: (v) => (
      <Text style={{ fontSize: 13 }}>
        {stageIcon(v)}{v}
      </Text>
    ),
  },
];

export default function DashboardPage() {
  const [showTable, setShowTable] = useState(true);

  return (
    <div style={{ minHeight: '100vh', background: '#f5f6fa' }}>

          {/* ── Sub-header bar ── */}
          <Row
            justify="space-between"
            align="middle"
            style={{ background: '#ffffff', padding: '10px 24px', borderBottom: '1px solid #f0f0f0' }}
          >
            <Col>
              <Text strong style={{ fontSize: 14, color: '#1a1a2e' }}>Dashboard</Text>
            </Col>
            <Col>
              <Select defaultValue="all" size="small" style={{ width: 100 }} variant="borderless">
                <Select.Option value="all">All</Select.Option>
                <Select.Option value="mine">Mine</Select.Option>
                <Select.Option value="team">Team</Select.Option>
              </Select>
            </Col>
          </Row>

          {/* ── Main two-column content ── */}
          <div style={{ padding: '16px 24px 0' }}>
            <Row>

              {/* Left column */}
              <Col>
                <CalendarCard />
                <StickyNotesCard />
              </Col>

            </Row>

            {/* ── Full-width table ── */}
            {showTable && (
              <Card
                style={{ marginTop: 16, marginBottom: 0 }}
                styles={{ body: { padding: 0 } }}
                extra={
                  <Button
                    type="text"
                    icon={<CloseOutlined />}
                    size="small"
                    onClick={() => setShowTable(false)}
                  />
                }
              >
                <Table
                  columns={columns}
                  dataSource={tableData}
                  size="middle"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50'],
                    showTotal: (total, range) =>
                      `Showing of ${range[0]} - ${range[1]} of ${total}`,
                    position: ['bottomRight'],
                  }}
                  summary={() => (
                    <Table.Summary fixed>
                      <Table.Summary.Row style={{ background: '#fafafa' }}>
                        <Table.Summary.Cell index={0} colSpan={3} />
                        <Table.Summary.Cell index={3} colSpan={3} align="right">
                          <Space size={24} style={{ paddingRight: 16 }}>
                            <Text>
                              Total Gross Margin:{' '}
                              <Text strong style={{ color: '#1d4ed8' }}>$24.00</Text>
                            </Text>
                            <Text>
                              Total Net Margin:{' '}
                              <Text strong style={{ color: '#16a34a' }}>$24.00</Text>
                            </Text>
                          </Space>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    </Table.Summary>
                  )}
                />
              </Card>
            )}
          </div>

    </div>
  );
}
