import { useState } from 'react';
import { Select } from 'antd';

export default function CustomPagination({ current, pageSize, total, onChange, onPageSizeChange }) {
  const [hoveredPage, setHoveredPage] = useState(null);
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
    const isActive  = page === current;
    const isHovered = hoveredPage === page;
    return (
      <button
        onClick={() => onChange(page)}
        onMouseEnter={() => setHoveredPage(page)}
        onMouseLeave={() => setHoveredPage(null)}
        style={{
          width: 36, height: 36,
          borderRadius: 10,
          border: 'none',
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: isActive ? 700 : 500,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s ease',
          position: 'relative',
          background: isActive
            ? 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)'
            : isHovered ? '#f0f5ff' : 'transparent',
          color: isActive ? '#fff' : isHovered ? '#1677ff' : '#595959',
          boxShadow: isActive
            ? '0 4px 12px rgba(22,119,255,0.35)'
            : 'none',
          transform: isActive ? 'translateY(-1px)' : 'translateY(0)',
        }}
      >
        {page}
      </button>
    );
  };

  const ArrowBtn = ({ direction, disabled, onClick }) => {
    const [hov, setHov] = useState(false);
    const isPrev = direction === 'prev';
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          width: 36, height: 36,
          borderRadius: 10,
          border: `1px solid ${disabled ? '#f0f0f0' : hov ? '#1677ff' : '#e8e8e8'}`,
          background: disabled ? '#fafafa' : hov ? '#f0f5ff' : '#fff',
          color: disabled ? '#d9d9d9' : hov ? '#1677ff' : '#8c8c8c',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s ease',
          fontSize: 13,
          boxShadow: !disabled && hov ? '0 2px 8px rgba(22,119,255,0.15)' : 'none',
        }}
      >
        {isPrev
          ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
          : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
        }
      </button>
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
          <span style={{ fontSize: 13, color: '#8c8c8c', fontWeight: 400, letterSpacing: 0.1 }}>
            Rows per page
          </span>
          <Select
            value={pageSize}
            size="small"
            style={{
              width: 70,
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 8,
            }}
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
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #1677ff, #0958d9)',
            color: '#fff', borderRadius: 6,
            fontSize: 11, fontWeight: 700,
            padding: '2px 8px', lineHeight: '18px',
          }}>
            {start}–{end}
          </span>
          <span style={{ fontSize: 13, color: '#8c8c8c' }}>of</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#262626' }}>{total.toLocaleString()}</span>
          <span style={{ fontSize: 13, color: '#8c8c8c' }}>results</span>
        </div>
      </div>

      {/* Right: navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <ArrowBtn
          direction="prev"
          disabled={current === 1}
          onClick={() => current > 1 && onChange(current - 1)}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 2, margin: '0 4px' }}>
          {getPages().map((p, i) =>
            p === '...'
              ? <span key={`dot-${i}`} style={{ width: 28, textAlign: 'center', color: '#bfbfbf', fontSize: 14, letterSpacing: 1 }}>•••</span>
              : <PageBtn key={p} page={p} />
          )}
        </div>

        <ArrowBtn
          direction="next"
          disabled={current >= totalPages}
          onClick={() => current < totalPages && onChange(current + 1)}
        />
      </div>

    </div>
  );
}
