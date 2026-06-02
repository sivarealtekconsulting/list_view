import { useState } from 'react';
import { Space, Tag, Typography } from 'antd';
import '../styles/DescriptionBlock.css';

const { Text } = Typography;

export default function DescriptionBlock({ sections = [], meta = [] }) {
  const [expanded, setExpanded] = useState(false);
  const PREVIEW = 2;
  const visible = expanded ? sections : sections.slice(0, PREVIEW);
  const hasMore = sections.length > PREVIEW;

  if (!sections.length && !meta.length) {
    return <Text type="secondary">No description available.</Text>;
  }

  return (
    <div className="jdv-ats-desc">

      {meta.length > 0 && (
        <div className="jdv-ats-meta-grid">
          {meta.map(({ fieldKey, fieldLabel, value }) => (
            <div key={fieldKey} className="jdv-ats-meta-row">
              <span className="jdv-ats-meta-key">{fieldLabel}</span>
              <span className="jdv-ats-meta-val">{value}</span>
            </div>
          ))}
        </div>
      )}

      <div className="jdv-ats-sections">
        {visible.map(({ sectionKey, sectionTitle, renderType, content = [] }) => (
          <div key={sectionKey} className="jdv-ats-section">
            <div className="jdv-ats-section-hd"><span>{sectionTitle}</span></div>

            {renderType === 'chips' ? (
              <Space size={[6, 6]} wrap style={{ marginTop: 8 }}>
                {content.map((item, i) => (
                  <Tag key={i} className="jdv-skill-tag">{item}</Tag>
                ))}
              </Space>
            ) : (
              <ul className="jdv-ats-bullets">
                {content.map((item, i) => (
                  <li key={i} className="jdv-ats-bullet-item">{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {hasMore && (
        <span className="jdv-desc-toggle" onClick={() => setExpanded((p) => !p)}>
          {expanded ? 'Show less' : `Show more (${sections.length - PREVIEW} more sections)`}
        </span>
      )}
    </div>
  );
}
