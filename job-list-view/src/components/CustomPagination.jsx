import { Button, Select, Typography, Tooltip } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const { Text } = Typography;

export default function CustomPagination({ current, pageSize, total, onChange, onPageSizeChange }) {
  const totalPages = Math.ceil(total / pageSize);
  const start = Math.min((current - 1) * pageSize + 1, total);
  const end   = Math.min(current * pageSize, total);

  const getPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = new Set([1, totalPages, current, current - 1, current + 1].filter(p => p >= 1 && p <= totalPages));
    const sorted = [...pages].sort((a, b) => a - b);
    const result = [];
    sorted.forEach((p, i) => {
      if (i > 0 && p - sorted[i - 1] > 1) result.push('...');
      result.push(p);
    });
    return result;
  };

  const PageBtn = ({ page }) => {
    const isActive = page === current;
    return (
      <Tooltip title={`Page ${page}`}>
        <Button
          type={isActive ? 'primary' : 'text'}
          size="small"
          onClick={() => onChange(page)}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            fontSize: 13,
            fontWeight: isActive ? 700 : 500,
            boxShadow: isActive ? '0 4px 12px rgba(22,119,255,0.35)' : 'none',
            transform: isActive ? 'translateY(-1px)' : 'none',
            transition: 'all 0.2s ease',
            background: isActive ? 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)' : undefined,
            border: 'none',
            padding: 0,
          }}
        >
          {page}
        </Button>
      </Tooltip>
    );
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 20px',
      borderTop: '1px solid #f0f0f0',
      background: 'linear-gradient(180deg, #fafbff 0%, #ffffff 100%)',
    }}>

      {/* Left: page size + result info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 13, color: '#8c8c8c', fontWeight: 400 }}>Rows per page</Text>
          <Select
            value={pageSize}
            size="small"
            style={{ width: 70, fontSize: 13, fontWeight: 600, borderRadius: 8 }}
            onChange={(val) => { onPageSizeChange(val); onChange(1); }}
            options={[
              { value: 7,  label: '7' },
              { value: 10, label: '10' },
              { value: 25, label: '25' },
              { value: 50, label: '50' },
            ]}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Text style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #1677ff, #0958d9)',
            color: '#fff', borderRadius: 6,
            fontSize: 11, fontWeight: 700,
            padding: '2px 8px', lineHeight: '18px',
          }}>
            {start}-{end}
          </Text>
          <Text style={{ fontSize: 13, color: '#8c8c8c' }}>of</Text>
          <Text strong style={{ fontSize: 13, color: '#262626' }}>{total.toLocaleString()}</Text>
          <Text style={{ fontSize: 13, color: '#8c8c8c' }}>results</Text>
        </div>
      </div>

      {/* Right: navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <Tooltip title="Previous page">
          <Button
            type="default"
            size="small"
            icon={<LeftOutlined />}
            disabled={current === 1}
            onClick={() => current > 1 && onChange(current - 1)}
            style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #e8e8e8' }}
          />
        </Tooltip>

        <div style={{ display: 'flex', alignItems: 'center', gap: 2, margin: '0 4px' }}>
          {getPages().map((p, i) =>
            p === '...'
              ? <Text key={`dot-${i}`} style={{ width: 28, textAlign: 'center', color: '#bfbfbf', fontSize: 14, letterSpacing: 1 }}>***</Text>
              : <PageBtn key={p} page={p} />
          )}
        </div>

        <Tooltip title="Next page">
          <Button
            type="default"
            size="small"
            icon={<RightOutlined />}
            disabled={current >= totalPages}
            onClick={() => current < totalPages && onChange(current + 1)}
            style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #e8e8e8' }}
          />
        </Tooltip>
      </div>

    </div>
  );
}
