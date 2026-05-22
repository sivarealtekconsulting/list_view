import { useState } from 'react';
import { Button, Card, Col, Row, Typography, Tooltip } from 'antd';
import { CalendarOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import '../../styles/CalendarCard.css';

const { Title, Text } = Typography;

const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const DOT = { green: '#22c55e', red: '#ef4444', orange: '#f97316', blue: '#3b82f6' };

const EVENTS = {
  '3-2':  [DOT.blue],
  '3-4':  [DOT.orange],
  '3-7':  [DOT.green],
  '3-8':  [DOT.orange, DOT.blue],
  '3-10': [DOT.blue],
  '3-14': [DOT.orange],
  '3-16': [DOT.green],
  '3-18': [DOT.red],
  '3-21': [DOT.orange, DOT.blue],
  '3-24': [DOT.blue],
  '3-28': [DOT.green],
  '3-30': [DOT.orange],
};

const LEGEND = [
  { label: 'Onboarded date',      color: DOT.green  },
  { label: 'Exit date',           color: DOT.red    },
  { label: 'To-do mentioned',     color: DOT.orange },
  { label: 'Interview scheduled', color: DOT.blue   },
];

function buildCells(year, month) {
  const first       = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays    = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = first - 1; i >= 0; i--)  cells.push({ day: prevDays - i, cur: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, cur: true });
  while (cells.length % 7 !== 0)         cells.push({ day: cells.length - daysInMonth - first + 1, cur: false });
  return cells;
}

/* Split flat array into rows of `size` */
function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default function CalendarCard() {
  const today = new Date();
  const [view, setView] = useState({ year: 2026, month: 3 });

  const weeks = chunk(buildCells(view.year, view.month), 7);
  const prev  = () => setView(v => v.month === 0  ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 });
  const next  = () => setView(v => v.month === 11 ? { year: v.year + 1, month: 0  } : { ...v, month: v.month + 1 });

  return (
    <Card
      className="calendar-card"
      title={
        <div className="calendar-header-title">
          <CalendarOutlined />
          <Title level={5}>{MONTHS[view.month]} {view.year}</Title>
        </div>
      }
      extra={
        <div className="calendar-nav">
          <Tooltip title="Previous month">
            <Button type="text" icon={<LeftOutlined />} size="small" onClick={prev} />
          </Tooltip>
          <Tooltip title="Next month">
            <Button type="text" icon={<RightOutlined />} size="small" onClick={next} />
          </Tooltip>
        </div>
      }
    >
      {/* Day name headers - antd Row + Col flex="1" = 7 equal columns, no CSS grid needed */}
      <Row gutter={[6, 0]} className="calendar-day-names">
        {DAYS.map(d => (
          <Col key={d} flex="1" className="calendar-day-name">{d}</Col>
        ))}
      </Row>

      {/* Week rows - CSS gap handles vertical spacing, antd gutter handles horizontal */}
      <div className="calendar-weeks">
        {weeks.map((week, wi) => (
          <Row key={wi} gutter={[6, 0]} align="top" className="calendar-week-row">
            {week.map((c, i) => {
              const key     = `${view.month}-${c.day}`;
              const dots    = c.cur ? (EVENTS[key] || []) : [];
              const isToday = c.cur
                && c.day   === today.getDate()
                && view.month === today.getMonth()
                && view.year  === today.getFullYear();
              return (
                <Col key={i} flex="1">
                  <div className={`calendar-cell${isToday ? ' today' : ''}${!c.cur ? ' faded' : ''}`}>
                    <div className="calendar-cell-inner">
                      <Text className="calendar-cell-number">{c.day}</Text>
                      {dots.length > 0 && (
                        <div className="calendar-cell-dots">
                          {dots.map((col, j) => (
                            <span key={j} className="calendar-dot" style={{ background: col }} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        ))}
      </div>

      {/* Legend */}
      <div className="calendar-legend">
        {LEGEND.map(({ label, color }) => (
          <div key={label} className="calendar-legend-item">
            <span className="calendar-legend-dot" style={{ background: color }} />
            <Text>{label}</Text>
          </div>
        ))}
      </div>
    </Card>
  );
}
