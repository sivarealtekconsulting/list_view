import { useState } from 'react';
import { Button, Input, message, Space, Tag, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { getJobById, updateJobDescription } from '../services/jobsApi';
import '../styles/DescriptionBlock.css';

const { Text } = Typography;
const PREVIEW = 2;

export default function DescriptionBlock({ jobId, sections = [], meta = [], rawDescription = '', onSaved }) {
  const [expanded, setExpanded]   = useState(false);
  const [editing, setEditing]     = useState(false);
  const [rawDesc, setRawDesc]     = useState('');
  const [saving, setSaving]       = useState(false);

  const sorted  = [...sections].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  const visible  = expanded ? sorted : sorted.slice(0, PREVIEW);
  const hasMore  = sorted.length > PREVIEW;

  function startEdit() {
    setRawDesc(rawDescription);
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setRawDesc('');
  }

  async function handleSave() {
    if (!rawDesc.trim()) {
      message.warning('Please enter a job description');
      return;
    }
    setSaving(true);
    try {
      await updateJobDescription(jobId, rawDesc.trim());
      const updated = await getJobById(jobId);
      onSaved?.(updated);
      setEditing(false);
      setRawDesc('');
      message.success('Description updated successfully');
    } catch {
      message.error('Failed to update description');
    } finally {
      setSaving(false);
    }
  }

  if (editing) {
    return (
      <Space direction="vertical" style={{ width: '100%' }} size={8}>
        <Input.TextArea
          rows={10}
          value={rawDesc}
          onChange={(e) => setRawDesc(e.target.value)}
          placeholder="Paste raw job description here..."
        />
        <Space>
          <Button type="primary" loading={saving} onClick={handleSave}>
            Save & Parse
          </Button>
          <Button onClick={cancelEdit}>Cancel</Button>
        </Space>
      </Space>
    );
  }

  return (
    <div className="desc-block">
      <div className="desc-block-toolbar">
        <EditOutlined className="desc-edit-icon" onClick={startEdit} />
      </div>

      {!sections.length && !meta.length ? (
        <Text type="secondary">No description available.</Text>
      ) : (
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
            {visible.map(({ sectionKey, sectionTitle, renderType, content = [] }) =>
              renderType === 'education' ? (
                /* ── Education: green accent card at the bottom ── */
                <div key={sectionKey} className="education-block">
                  <div className="education-header">
                    <span>🎓</span>
                    <span>{sectionTitle}</span>
                  </div>
                  <ul className="education-list">
                    {content.map((item, i) => (
                      <li key={i} className="education-list-item">{item}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                /* ── Regular section ── */
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
              )
            )}
          </div>

          {hasMore && (
            <span className="jdv-desc-toggle" onClick={() => setExpanded((p) => !p)}>
              {expanded ? 'Show less' : `Show more (${sections.length - PREVIEW} more sections)`}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
