import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  Col,
  Collapse,
  Divider,
  Empty,
  Flex,
  Row,
  Segmented,
  Space,
  Statistic,
  Tabs,
  Tag,
  Timeline,
  Typography,
} from 'antd';
import {
  BankOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  MoreOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MOCK_JOBS } from '../data/jobs';
import DynamicListView from '../components/DynamicListView';
import ParamListView from '../components/ParamListView';
import StatusBadge from '../components/StatusBadge';
import '../styles/SubhaJobDetailPage.css';

const { Text, Title, Link, Paragraph } = Typography;

const defaultDescription = [`
  We are seeking a highly skilled Senior React Developer to join our dynamic team in Texas. The ideal candidate will have a minimum of four years of hands-on experience in front-end development with React, complemented by a strong proficiency in Java, Spring Boot, HTML, and CSS. As a Senior React Developer, you will play a pivotal role in designing, developing, and implementing high-quality web applications that deliver exceptional user experiences. You will collaborate closely with cross-functional teams to translate business requirements into technical solutions and contribute to the continuous improvement of our development processes. Key Responsibilities: - Design, develop, and maintain scalable and robust web applications using React. - Collaborate with UI/UX designers and product managers to create seamless and responsive user interfaces. - Integrate front-end components with backend services using Java and Spring Boot. - Write clean, maintainable, and efficient code following best practices and coding standards. - Optimize applications for maximum speed, scalability, and accessibility. - Participate in code reviews, mentoring junior developers, and fostering a culture of continuous learning. - Troubleshoot, debug, and resolve technical issues across the full development stack. - Stay updated with emerging trends and technologies in front-end and back-end development. - Contribute to architectural decisions and participate in the planning and estimation of projects.
`];
const activityItems = [
  {
    color: 'blue',
    status: 'Shortlist',
    tagColor: 'blue',
    time: '07:39 PM',
    text: 'Move to Pipeline for ZNXTJOB24011527 lead by admin_realtek',
  },
  {
    color: 'blue',
    status: 'Shortlist',
    tagColor: 'blue',
    time: '07:39 PM',
    text: 'Move to Pipeline for ZNXTJOB24011525 Product Architect by admin_realtek',
  },
  {
    color: 'green',
    status: 'Submitted',
    tagColor: 'green',
    time: '04:17 PM',
    text: 'Candidate has been submitted to Job ID ZNXTJOB240011525',
  },
  {
    color: 'red',
    status: 'Rejected',
    tagColor: 'red',
    time: '07:39 PM',
    text: 'candidate submission status has been changed to re-submission for Job ID - ZNXTJOB2620532',
  },
];

const candidateFields = [
  { label: 'Candidate Name',    value: 'candidateName'      },
  { label: 'Designation',       value: 'designation'        },
  { label: 'Current Location',  value: 'currentLocation'    },
  { label: 'Experience',        value: 'experience'         },
  { label: 'Work Authorization',value: 'workAuthorization'  },
  { label: 'Submission Status', value: 'submissionStatus'   },
  { label: 'Submitted Date',    value: 'submittedDate'      },
];

const candidateRows = [
  {
    id: 1,
    candidateName: 'Jayaprakash A',
    designation: 'DevOps Engineer',
    currentLocation: 'San Jose, CA',
    experience: '6 years',
    workAuthorization: 'H1B',
    submissionStatus: 'Submitted',
    submittedDate: 'Mar 23, 2026',
  },
  {
    id: 2,
    candidateName: 'Kiran Kumar',
    designation: 'Software Developer',
    currentLocation: 'Texas',
    experience: '5 years',
    workAuthorization: 'GC EAD',
    submissionStatus: 'Pipeline',
    submittedDate: 'Mar 20, 2026',
  },
  {
    id: 3,
    candidateName: 'Sano S',
    designation: 'Java Developer',
    currentLocation: 'Chennai',
    experience: '7 years',
    workAuthorization: 'L2 EAD',
    submissionStatus: 'Shortlisted',
    submittedDate: 'Mar 18, 2026',
  },
];

function DetailField({ label, value }) {
  return (
    <div className="jdv-field">
      <Text className="jdv-field-label">{label}</Text>
      <Text className="jdv-field-value">{value || '-'}</Text>
    </div>
  );
}

function SectionCard({ title, icon, children, accentColor = '#0053A5', accentLight = 'rgba(0,83,165,0.08)' }) {
  return (
    <Card
      size="small"
      className="jdv-section-card"
      style={{ '--section-accent': accentColor, '--section-accent-light': accentLight }}
      title={
        <Space size={12}>
          <span className="jdv-section-icon-wrap">{icon}</span>
          <Text strong className="jdv-section-title">{title}</Text>
        </Space>
      }
    >
      {children}
    </Card>
  );
}

// ── Description parser ────────────────────────────────────────
// Normalises both structured (string[]) and prose (single block) into
// { metadata: [{key,value}], sections: [{title, items[]}] }

const KNOWN_META_PREFIXES = [
  'bill rate', 'msp owner', 'location', 'duration', 'gbams reqid',
  'experience', 'client rate', 'pay rate', 'notice period', 'start date',
];

const PROSE_META_RX = [
  { key: 'Bill Rate',   rx: /bill rate[^.]*?(?:is\s+)?([\d$–\-][^.;,]+)/i },
  // Location – "based in" OR "team/office in [City]"
  { key: 'Location',    rx: /(?:position is based|based)\s+in\s+([A-Z][a-zA-Z\s]+?)(?=\s+and\s|\s+for\s|[.,])/i },
  { key: 'Location',    rx: /\b(?:team|office)\s+in\s+([A-Z][a-zA-Z\s,]+?)(?=[.,]|$)/i },
  { key: 'Duration',    rx: /(?:offered for a duration of|duration of)\s+([^.,;]+)/i },
  // Experience – digit range, digit+, or written-out number
  { key: 'Experience',  rx: /(\d+[–\-]\d+\s+years[^.,;]+)/i },
  { key: 'Experience',  rx: /(\d+\+?\s*years?)\s+of\s+(?:\S+\s+)?experience/i },
  { key: 'Experience',  rx: /(?:minimum\s+of\s+)?((?:one|two|three|four|five|six|seven|eight|nine|ten)\s+years?)\s+of\s+(?:\S+\s+)?experience/i },
  { key: 'MSP Owner',   rx: /MSP Owner[^.]*?is\s+([A-Z][a-zA-Z\s]+?)(?=\s+and\s|[.,])/i },
  { key: 'GbaMS ReqID', rx: /GbaMS ReqID[^.]*?is\s+(\d+)/i },
  // Role – "seeking/looking for a [Role Title] to join..."
  { key: 'Role',        rx: /(?:seeking|looking\s+for)\s+a?\s*(?:highly\s+skilled\s+|experienced\s+|talented\s+)?([A-Z][a-zA-Z\s]+?)\s+to\s+join/i },
];

// Inline section boundaries that can appear mid-paragraph (e.g. "Key Responsibilities: - ...")
const INLINE_SECTION_BOUNDARIES = [
  { rx: /\bKey\s+Responsibilities\s*:/i,  label: 'Key Responsibilities'      },
  { rx: /\bResponsibilities\s*:/i,         label: 'Roles & Responsibilities'  },
  { rx: /\bRequired\s+Skills\s*:/i,        label: 'Required Skills'           },
  { rx: /\bPreferred\s+Skills\s*:/i,       label: 'Preferred Skills'          },
  { rx: /\bQualifications\s*:/i,            label: 'Qualifications'            },
  { rx: /\bNice\s+to\s+Have\s*:/i,         label: 'Nice to Have'              },
];

const PROSE_SECTION_RX = [
  { title: 'Roles & Responsibilities', rx: /will be responsible|candidate will|consultant will|role involves/i },
  { title: 'Required Skills',          rx: /ideal candidate should|should possess|expertise in|proficiency in/i },
  { title: 'Additional Requirements',  rx: /nice to have|preferred|bonus|additionally/i },
];

// Sentences that just restate metadata already shown in the table
const META_SENTENCE_RX = [
  /\bbill rate\b/i, /\bposition is based\b/i, /\bbased in\b/i,
  /\bduration of\b/i, /\bmsp owner\b/i, /\bgbams reqid\b/i,
  /\boffered for a duration\b/i,
];

function parseStructured(lines) {
  const metadata = [];
  const sections = [];
  let current = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    const ci = line.indexOf(':');
    const isMetaKv =
      ci > 0 && ci <= 30 &&
      KNOWN_META_PREFIXES.some((p) => line.toLowerCase().startsWith(p));

    if (isMetaKv) {
      metadata.push({ key: line.slice(0, ci).trim(), value: line.slice(ci + 1).trim() });
      continue;
    }

    const isHeading =
      !line.endsWith('.') &&
      line.length < 60 &&
      !line.startsWith('-') &&
      line.split(' ').every((w) => w.length <= 3 || /^[A-Z&]/.test(w));

    if (isHeading) {
      current = { title: line, items: [] };
      sections.push(current);
      continue;
    }

    if (!current) { current = { title: 'Overview', items: [] }; sections.push(current); }
    current.items.push(line.replace(/^[-•·*]\s*/, ''));
  }

  return { metadata, sections };
}

function parseProse(raw) {
  const text = Array.isArray(raw) ? raw[0] : raw;
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter((p) => p.length > 20);

  const metadata = [];
  const sectionMap = new Map();

  paragraphs.forEach((para, idx) => {
    // Extract metadata from the full paragraph text (before any boundary split)
    PROSE_META_RX.forEach(({ key, rx }) => {
      if (metadata.find((m) => m.key === key)) return;
      const m = para.match(rx);
      if (m) metadata.push({ key, value: m[1].replace(/\s+/g, ' ').trim() });
    });

    // Detect embedded section boundaries mid-paragraph (e.g. "Key Responsibilities: - ...")
    // Split off the bullet section so it gets its own named section
    let mainPara = para;
    for (const { rx, label: boundaryLabel } of INLINE_SECTION_BOUNDARIES) {
      const matchIdx = para.search(rx);
      if (matchIdx === -1) continue;

      mainPara = para.slice(0, matchIdx).trim();
      const rawContent = para.slice(matchIdx).replace(rx, '').replace(/^\s*:\s*/, '').trim();
      const bulletItems = rawContent
        .replace(/^-\s+/, '')
        .split(/\.-\s+/)
        .map((s) => s.replace(/\.$/, '').trim())
        .filter((s) => s.length > 4);

      if (bulletItems.length > 0) {
        const existing = sectionMap.get(boundaryLabel);
        if (existing) existing.push(...bulletItems);
        else sectionMap.set(boundaryLabel, bulletItems);
      }
      break;
    }

    if (!mainPara) return; // nothing before the boundary — all content already handled

    // Determine section label for the remaining prose
    let label = idx === 0 ? 'Overview' : 'Details';
    for (const { title, rx } of PROSE_SECTION_RX) {
      if (rx.test(mainPara)) { label = title; break; }
    }

    const bullets = mainPara
      .split(/(?<=[.!?])\s+(?=[A-Z"'])/g)
      .map((s) => s.trim())
      .filter((s) => s.length > 15);

    if (sectionMap.has(label)) sectionMap.get(label).push(...bullets);
    else sectionMap.set(label, bullets);
  });

  // For candidate/professional-summary format: extract Role + Experience from first sentence
  // when nothing was matched by the job-posting patterns above
  if (metadata.length === 0 && paragraphs.length > 0) {
    const firstSentence = paragraphs[0].split(/(?<=[.!?])\s+/)[0];
    const expMatch = firstSentence.match(/(\d+\+?\s*years?)\s+of\s+experience/i);
    if (expMatch) metadata.push({ key: 'Experience', value: expMatch[1].trim() });
    const roleMatch = firstSentence.match(/^([A-Z][a-zA-Z\s\/\(\)]+?)\s+with\s+\d/);
    if (roleMatch) metadata.push({ key: 'Role', value: roleMatch[1].trim() });
  }

  // Split range-style Experience value into individual bullet points (e.g. "8–15 years ... and 3+ years...")
  const expMeta = metadata.find((m) => m.key === 'Experience');
  if (expMeta) {
    const parts = expMeta.value.split(/\s+and\s+(?=at\s+least|\d)/i).map((s) => s.trim()).filter(Boolean);
    if (parts.length > 1) expMeta.bullets = parts;
  }

  // Determine if this is a job posting or a candidate/role summary
  const isJobPosting = metadata.some((m) =>
    ['Bill Rate', 'MSP Owner', 'GbaMS ReqID', 'Duration'].includes(m.key)
  );

  if (sectionMap.has('Overview')) {
    if (isJobPosting) {
      // Filter out sentences that just restate metadata already shown in the table
      const kept = sectionMap.get('Overview').filter(
        (b) => !META_SENTENCE_RX.some((rx) => rx.test(b))
      );
      sectionMap.delete('Overview');
      if (kept.length > 0) sectionMap.set('Overview', kept);
    } else {
      // Candidate summary or generic prose → rename to Professional Summary
      const items = sectionMap.get('Overview');
      sectionMap.delete('Overview');
      sectionMap.set('Professional Summary', items);
    }
  }

  return {
    metadata,
    sections: [...sectionMap.entries()].map(([title, items]) => ({ title, items })),
  };
}

// ── Inline-concatenated parser ────────────────────────────────
// Handles descriptions like:
//   "Job TitleFull Stack Developer...Role SummaryWe are seeking...Responsibilities- Design..."
// Section labels are embedded with no line breaks; bullets use "- " separators.

const INLINE_SECTION_MAP = [
  { rx: /^Job\s*Title/i,          label: null,                      type: 'jobtitle' },
  { rx: /^Role\s*Summary/i,       label: 'Role Summary',            type: 'prose'    },
  { rx: /^About\s*the\s*Role/i,   label: 'Role Summary',            type: 'prose'    },
  { rx: /^Responsibilities/i,     label: 'Roles & Responsibilities', type: 'bullets'  },
  { rx: /^What\s*You\s*Will\s*Do/i, label: 'Roles & Responsibilities', type: 'bullets' },
  { rx: /^Required\s*Skills/i,    label: 'Required Skills',         type: 'bullets'  },
  { rx: /^Preferred\s*Skills/i,   label: 'Preferred Skills',        type: 'bullets'  },
  { rx: /^Nice\s*to\s*Have/i,     label: 'Nice to Have',            type: 'bullets'  },
  { rx: /^Qualifications/i,       label: 'Qualifications',          type: 'bullets'  },
  { rx: /^Benefits/i,             label: 'Benefits',                type: 'bullets'  },
];

function splitBullets(content) {
  return content
    .replace(/^-\s+/, '')        // strip leading "- "
    .split(/\.-\s+/)             // split on ".- " (end of one bullet, start of next)
    .map((s) => s.replace(/\.$/, '').trim())
    .filter((s) => s.length > 4);
}

function parseInlineConcat(text) {
  // Build a regex that splits at the START of each known section label
  const labelAlts = INLINE_SECTION_MAP.map((s) => s.rx.source.replace('^', '')).join('|');
  const chunks = text.split(new RegExp(`(?=${labelAlts})`, 'i')).filter(Boolean);

  const metadata = [];
  const sections  = [];

  chunks.forEach((chunk) => {
    const def = INLINE_SECTION_MAP.find(({ rx }) => rx.test(chunk));
    if (!def) return;

    // Strip the label text from the front of the chunk
    const content = chunk.replace(new RegExp(def.rx.source.replace('^', ''), 'i'), '').trim();

    if (def.type === 'jobtitle') {
      // e.g. "Full Stack Developer (3 Years Experience) – Chennai"
      const expMatch = content.match(/\((\d+\s+years?\s+experience)\)/i);
      if (expMatch) metadata.push({ key: 'Experience', value: expMatch[1] });

      const locMatch = content.match(/[–\-]\s*([A-Z][a-zA-Z\s,]+)$/);
      if (locMatch) metadata.push({ key: 'Location', value: locMatch[1].trim() });

      const titleVal = content
        .replace(/\([^)]*\)/g, '')   // remove parens
        .replace(/[–\-]\s*[A-Z].*$/, '') // remove "– Location" suffix
        .trim();
      if (titleVal) metadata.push({ key: 'Job Title', value: titleVal });
      return;
    }

    if (def.type === 'bullets') {
      sections.push({ title: def.label, items: splitBullets(content) });
      return;
    }

    if (def.type === 'prose') {
      const items = content
        .split(/(?<=[.!?])\s+(?=[A-Z"'])/g)
        .map((s) => s.trim())
        .filter((s) => s.length > 15);
      // Merge into existing section with same label if any
      const existing = sections.find((s) => s.title === def.label);
      if (existing) existing.items.push(...items);
      else sections.push({ title: def.label, items });
    }
  });

  return { metadata, sections };
}

// ── Inline KV parser ─────────────────────────────────────────
// Handles: "Bill Rate: $85 MSP Owner: Mya Riecke Location: TX Duration: 6 months
//           Descriptions: "• Bullet one. • Bullet two." Skills: React~Node"
// All fields are on ONE line; no line breaks; bullets use • separator.

const INLINE_KV_META_KEYS = [
  'Bill Rate', 'MSP Owner', 'Location', 'Duration',
  'GBaMS ReqID', 'GbaMS ReqID', 'Role', 'Experience Required',
];

// Compound labels MUST appear before their shorter suffixes so the scanner
// prefers "Essential Skills" over bare "Skills" when both could match.
const INLINE_KV_ALL_KEYS = [
  ...INLINE_KV_META_KEYS,
  'Role Descriptions', 'Role Description',
  'Essential Skills', 'Desirable Skills', 'Required Skills', 'Preferred Skills',
  'Descriptions', 'Description',
  'Skills',
];

// Maps normalised KV section-key names → canonical display section titles
const INLINE_KV_SECTION_MAP = {
  'role description':  'Roles & Responsibilities',
  'role descriptions': 'Roles & Responsibilities',
  'essential skills':  'Required Skills',
  'desirable skills':  'Nice to Have',
  'required skills':   'Required Skills',
  'preferred skills':  'Preferred Skills',
  'description':       'Job Description',
  'descriptions':      'Job Description',
};

// Character-by-character split that prefers the LONGEST matching key at each position,
// preventing "Skills:" from matching inside "Essential Skills:".
function splitKvChunks(text, keys) {
  const sorted = [...keys].sort((a, b) => b.length - a.length);
  const splitPositions = [];
  let i = 0;
  while (i < text.length) {
    let advance = 1;
    for (const k of sorted) {
      const rx = new RegExp(`^${k.replace(/\s+/g, '[\\s]+')}[\\s]*:`, 'i');
      const m = text.slice(i).match(rx);
      if (m) { splitPositions.push(i); advance = m[0].length; break; }
    }
    i += advance;
  }
  return splitPositions
    .map((pos, j) =>
      text.slice(pos, j + 1 < splitPositions.length ? splitPositions[j + 1] : text.length).trim()
    )
    .filter(Boolean);
}

function parseInlineKv(text) {
  const metadata = [];
  const sections  = [];

  const chunks = splitKvChunks(text, INLINE_KV_ALL_KEYS);

  chunks.forEach((chunk) => {
    const ci = chunk.indexOf(':');
    if (ci === -1) return;

    const key      = chunk.slice(0, ci).trim();
    const rawValue = chunk.slice(ci + 1).trim();
    const keyLower = key.toLowerCase();

    // Skip unrecognised keys (preamble / noise)
    const isKnownKey = INLINE_KV_ALL_KEYS.some((k) =>
      new RegExp(`^${k.replace(/\s+/g, '\\s+')}$`, 'i').test(key)
    );
    if (!isKnownKey) return;

    // ── Section-producing keys (Descriptions, Role Descriptions, Essential Skills, …) ──
    const sectionTitle = INLINE_KV_SECTION_MAP[keyLower];
    if (sectionTitle) {
      const groups = rawValue
        .split(/["""'']\s*["""'']/)
        .map((g) => g.replace(/^["""''\s•]+|["""''\s]+$/g, '').trim())
        .filter(Boolean);

      if (sectionTitle === 'Job Description' && groups.length > 1) {
        const multiLabels = ['Roles & Responsibilities', 'Requirements'];
        groups.forEach((g, i) => {
          const items = g.split(/•\s*/).map((s) => s.trim()).filter((s) => s.length > 10);
          if (items.length > 0) sections.push({ title: multiLabels[i] || 'Additional', items });
        });
      } else {
        const content = groups.join(' ');
        const items = content.includes('•')
          ? content.split(/•\s*/).map((s) => s.trim()).filter((s) => s.length > 10)
          : content
              .replace(/\s*\|\s*/g, '. ')
              .split(/(?<=[.!?])\s+(?=[A-Z"'])/)
              .map((s) => s.trim())
              .filter((s) => s.length > 15);
        if (items.length > 0) sections.push({ title: sectionTitle, items });
      }
      return;
    }

    // ── Skills → chip list ──
    if (keyLower === 'skills') {
      const items = rawValue.split(/[~,]\s*/).map((s) => s.trim()).filter((s) => s.length > 1);
      if (items.length > 0) sections.push({ title: 'Skills', items });
      return;
    }

    // ── General metadata field ──
    const cleanValue = rawValue
      .replace(/\bPTN_[A-Z0-9_]+/gi, '')
      .replace(/\bi\.e\.?\s*/gi, '')
      .replace(/_{3,}/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const bulletIdx = cleanValue.indexOf('•');
    if (bulletIdx !== -1) {
      const preValue      = cleanValue.slice(0, bulletIdx).trim();
      const bulletContent = cleanValue.slice(bulletIdx);

      if (preValue) {
        const numAndText = preValue.match(/^(\d+(?:\.\d+)?)\s+(.+)$/);
        if (numAndText) {
          const afterNum = numAndText[2];
          // "6 months Business Analyst…" — preserve "6 months" as value, extract role from rest
          const timeUnit = afterNum.match(/^(months?|weeks?|years?|days?)\s*(.*)/i);
          if (timeUnit) {
            metadata.push({ key, value: `${numAndText[1]} ${timeUnit[1]}` });
            const role = timeUnit[2].trim();
            if (role && !metadata.find((m) => m.key === 'Role'))
              metadata.push({ key: 'Role', value: role });
          } else {
            metadata.push({ key, value: numAndText[1] });
            if (!metadata.find((m) => m.key === 'Role'))
              metadata.push({ key: 'Role', value: afterNum.trim() });
          }
        } else {
          metadata.push({ key, value: preValue });
        }
      }

      const items = bulletContent.split(/•\s*/).map((s) => s.trim()).filter((s) => s.length > 10);
      if (items.length > 0) {
        const existing = sections.find((s) => s.title === 'Job Description');
        if (existing) existing.items.push(...items);
        else sections.push({ title: 'Job Description', items });
      }
    } else {
      if (cleanValue) metadata.push({ key, value: cleanValue });
    }
  });

  // Step 1 — merge sections with the same title
  const merged = [];
  sections.forEach(({ title, items }) => {
    const existing = merged.find((s) => s.title === title);
    if (existing) existing.items.push(...items.filter((item) => !existing.items.includes(item)));
    else merged.push({ title, items: [...items] });
  });

  // Step 2 — cross-section deduplication:
  // strip punctuation, then skip any item whose text is already covered by an earlier section
  const normText = (s) => s.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
  const seenTexts = [];

  const finalSections = merged
    .map(({ title, items }) => {
      const unique = items.filter((item) => {
        const norm = normText(item);
        const duplicate = seenTexts.some(
          (seen) => seen.includes(norm) || norm.includes(seen)
        );
        if (!duplicate) seenTexts.push(norm);
        return !duplicate;
      });
      return { title, items: unique };
    })
    .filter(({ items }) => items.length > 0); // drop sections that became empty

  return { metadata, sections: finalSections };
}

function parseDescription(raw) {
  const text = Array.isArray(raw) ? raw[0] : raw;

  // Structured array: multiple short strings (no embedded newlines)
  if (Array.isArray(raw) && raw.length > 1 && raw.every((s) => !s.includes('\n') && s.length < 400)) {
    return parseStructured(raw);
  }

  const hasParagraphBreaks = /\n{2,}/.test(text);

  // Inline KV: 3+ known KV fields on one line (e.g. "Bill Rate: $85 MSP Owner: Xyz Location:...")
  const inlineKvCount = INLINE_KV_ALL_KEYS.filter((k) =>
    new RegExp(`\\b${k.replace(/\s+/g, '\\s+')}\\s*:`, 'i').test(text)
  ).length;
  if (inlineKvCount >= 3 && !hasParagraphBreaks) {
    return parseInlineKv(text);
  }

  // Inline-concatenated: embedded section labels with "- " bullets
  const hasInlineLabels = /Responsibilities(?:\s*-)|Required\s*Skills(?:\s*-)|Preferred\s*Skills(?:\s*-)/.test(text);
  if (hasInlineLabels && !hasParagraphBreaks) {
    return parseInlineConcat(text);
  }

  // Prose with paragraph breaks (or fallback)
  return parseProse(raw);
}

// ── ATS-style description renderer ────────────────────────────
function DescriptionBlock({ raw }) {
  const [expanded, setExpanded] = useState(false);
  const { metadata, sections } = useMemo(() => parseDescription(raw), [raw]);
  const PREVIEW = 2;
  const visible  = expanded ? sections : sections.slice(0, PREVIEW);
  const hasMore  = sections.length > PREVIEW;

  return (
    <div className="jdv-ats-desc">
      {metadata.length > 0 && (
        <div className="jdv-ats-meta-grid">
          {metadata.map(({ key, value, bullets }) => (
            <div key={key} className="jdv-ats-meta-row">
              <span className="jdv-ats-meta-key">{key}</span>
              {bullets && bullets.length > 1 ? (
                <ul className="jdv-ats-meta-bullet-list">
                  {bullets.map((b, i) => (
                    <li key={i} className="jdv-ats-meta-bullet">{b}</li>
                  ))}
                </ul>
              ) : (
                <span className="jdv-ats-meta-val">{value}</span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="jdv-ats-sections">
        {visible.map(({ title, items }) => (
          <div key={title} className="jdv-ats-section">
            <div className="jdv-ats-section-hd"><span>{title}</span></div>
            <ul className="jdv-ats-bullets">
              {items.map((item, i) => (
                <li key={i} className="jdv-ats-bullet-item">{item}</li>
              ))}
            </ul>
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

function tabLabel(label, count) {
  return (
    <Space size={6}>
      <span>{label}</span>
      <Badge count={count} overflowCount={9999} />
    </Space>
  );
}

export default function JobDetailPage() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const job = MOCK_JOBS.find((item) => String(item.id) === String(jobId)) ?? MOCK_JOBS[0];
  const [activeDetailTab, setActiveDetailTab]     = useState('details');
  const [activeActivityTab, setActiveActivityTab] = useState('activity');

  return (
    <div className="dashboard-wrapper jdv">
      <Row gutter={[16, 16]}>

        {/* ── Breadcrumb ── */}
        <Col span={24}>
          <Breadcrumb
            className="jdv-breadcrumb"
            items={[
              {
                title: (
                  <span className="jdv-breadcrumb-link" onClick={() => navigate('/')}>
                    Home
                  </span>
                ),
              },
              {
                title: (
                  <span className="jdv-breadcrumb-link" onClick={() => navigate('/')}>
                    Jobs
                  </span>
                ),
              },
              {
                title: <span className="jdv-breadcrumb-active">Detailed View</span>,
              },
            ]}
          />
        </Col>

        {/* ── Hero card ── */}
        <Col span={24}>
          <Card size="small" className="jdv-hero-card">
            <Row justify="space-between" align="middle" gutter={[16, 16]}>
              <Col xs={24} lg={16}>
                <Space direction="vertical" size={5}>
                  <span className="jdv-client-code">TCS - MSP ID 10432419</span>
                  <Space size={8} wrap>
                    <Title level={4} className="jdv-job-title">
                      {job.title} - 38975
                    </Title>
                    <StatusBadge status={job.status} />
                  </Space>
                  <Space size={12} wrap>
                    <span className="jdv-meta-item"><EnvironmentOutlined /> {job.location}</span>
                    <span className="jdv-meta-item"><ClockCircleOutlined /> {job.experience}</span>
                    <span className="jdv-meta-item"><BankOutlined /> {job.employmentType}</span>
                    <span className="jdv-meta-item">{job.locationType}</span>
                    <span className="jdv-meta-item"><DollarOutlined /> Client rate: ${job.clientRate}/hr</span>
                  </Space>
                </Space>
              </Col>
              <Col xs={24} lg={8}>
                <Space direction="vertical" size={6} style={{ width: '100%' }}>
                  <div className="jdv-stats-box">
                    <div className="jdv-stat-col">
                      <span className="jdv-stat-label">Target Submissions</span>
                      <Statistic value={job.targetSub?.total ?? '-'} />
                    </div>
                    <div className="jdv-stat-divider" />
                    <div className="jdv-stat-col">
                      <span className="jdv-stat-label">In Pipeline</span>
                      <Statistic value={job.pipeline ?? '-'} />
                    </div>
                  </div>
                  <DetailField label="Created On" value="Nov 03, 2025 | 07:00PM" />
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* ── Tabs toolbar ── */}
        <Col span={24}>
          <Card className="jdv-toolbar-card">
            <Flex align="center" justify="space-between" gap={12} wrap>
              <Tabs
                activeKey={activeDetailTab}
                onChange={setActiveDetailTab}
                items={[
                  { key: 'details',        label: tabLabel('Details', 0) },
                  // { key: 'candidates-api', label: tabLabel('Candidates API', 0) },
                  // { key: 'candidate',      label: tabLabel('Candidate', candidateRows.length) },
                ]}
              />
              <Flex align="center" gap={8}>
                <Button type="primary" className="jdv-action-btn" icon={<TeamOutlined />}>
                  Source Candidates
                </Button>
                <Button className="jdv-more-btn" icon={<MoreOutlined />} />
              </Flex>
            </Flex>
          </Card>
        </Col>

        {/* ── Tab content ── */}
        {activeDetailTab === 'candidates-api' ? (
          <Col span={24}>
            <DynamicListView moduleName="candidates" />
          </Col>
        ) : activeDetailTab === 'candidate' ? (
          <Col span={24}>
            <ParamListView
              listName="candidate"
              fields={candidateFields}
              dataSource={candidateRows}
            />
          </Col>
        ) : (
          <>
            {/* ── Left: detail sections ── */}
            <Col xs={24} lg={17}>
              <Space direction="vertical" size={12} style={{ width: '100%', display: 'flex' }}>

                <SectionCard title="Client" icon={<FileSearchOutlined />} accentColor="#0053A5" accentLight="rgba(0,83,165,0.08)">
                  <Row gutter={[32, 16]}>
                    <Col xs={24} md={8}>
                      <DetailField label="Contact Person" value="Subha Seline" />
                    </Col>
                    <Col xs={24} md={8}>
                      <DetailField label="Email" value={<Link>seline@gmail.com</Link>} />
                    </Col>
                    <Col xs={24} md={8}>
                      <DetailField label="Phone Number" value={<Link>+91 (999) 469 - 4028</Link>} />
                    </Col>
                  </Row>
                </SectionCard>

                <SectionCard title="Skills & Competencies" icon={<InfoCircleOutlined />} accentColor="#0053A5" accentLight="rgba(0,83,165,0.08)">
                  <Space direction="vertical" size={12}>
                    <DetailField
                      label="Primary Skills"
                      value={
                        <div className="jdv-skills-group">
                          <Space size={[6, 6]} wrap>
                            {['Salesforce', 'Administration', 'Process Builder', 'Flows', 'User training', 'PHP', 'Python', 'Django', 'Flask', 'FastAPI', 'GO', 'RDBMS', 'Python Selenium', 'Java', 'MongoDB'].map((skill) => (
                              <Tag key={skill} className="jdv-skill-tag">{skill}</Tag>
                            ))}
                          </Space>
                        </div>
                      }
                    />
                    <DetailField label="Secondary Skills" value="-" />
                    <DetailField label="Competencies"     value="-" />
                  </Space>
                </SectionCard>

                <SectionCard title="Description" icon={<FileTextOutlined />} accentColor="#0053A5" accentLight="rgba(0,83,165,0.08)">
                  <DescriptionBlock raw={defaultDescription} />
                </SectionCard>

                <SectionCard title="Additional Details" icon={<InfoCircleOutlined />} accentColor="#0053A5" accentLight="rgba(0,83,165,0.08)">
                  <Row gutter={[32, 16]}>
                    <Col xs={24} md={6}>
                      <DetailField label="Notice Period"  value="-" />
                    </Col>
                    <Col xs={24} md={10}>
                      <DetailField label="Business Unit" value="Realtek Consulting LLC" />
                    </Col>
                  </Row>
                </SectionCard>

              </Space>
            </Col>

            {/* ── Right: Activity & Notes ── */}
            <Col xs={24} lg={7}>
              <Card size="small" className="jdv-activity-card" style={{ height: '100%' }}>
                <Space direction="vertical" style={{ width: '100%' }} size={12}>

                  <Segmented
                    block
                    className="jdv-activity-switcher"
                    options={[
                      { label: tabLabel('Activity', 2), value: 'activity' },
                      { label: tabLabel('Notes', 0),    value: 'notes'    },
                    ]}
                    value={activeActivityTab}
                    onChange={setActiveActivityTab}
                  />

                  {activeActivityTab === 'activity' ? (
                    <Collapse
                      accordion
                      className="jdv-date-collapse"
                      defaultActiveKey={['mar-23']}
                      items={[
                        {
                          key: 'mar-23',
                          label: (
                            <Space size={6}>
                              <span className="jdv-date-label">Mar 23, 2026</span>
                              <Badge count={2} />
                            </Space>
                          ),
                          children: (
                            <Timeline
                              items={activityItems.slice(0, 2).map((item) => ({
                                color: item.color,
                                children: (
                                  <Card size="small" className="jdv-timeline-card">
                                    <Space direction="vertical" size={4}>
                                      <Space>
                                        <Tag color={item.tagColor} className="jdv-activity-tag">
                                          {item.status}
                                        </Tag>
                                        <span className="jdv-activity-time">{item.time}</span>
                                      </Space>
                                      <span className="jdv-activity-text">{item.text}</span>
                                    </Space>
                                  </Card>
                                ),
                              }))}
                            />
                          ),
                        },
                        {
                          key: 'mar-20',
                          label: (
                            <Space size={6}>
                              <span className="jdv-date-label">Mar 20, 2026</span>
                              <Badge count={2} />
                            </Space>
                          ),
                          children: (
                            <Timeline
                              items={activityItems.slice(2).map((item) => ({
                                color: item.color,
                                children: (
                                  <Card size="small" className="jdv-timeline-card">
                                    <Space direction="vertical" size={4}>
                                      <Space>
                                        <Tag color={item.tagColor} className="jdv-activity-tag">
                                          {item.status}
                                        </Tag>
                                        <span className="jdv-activity-time">{item.time}</span>
                                      </Space>
                                      <span className="jdv-activity-text">{item.text}</span>
                                    </Space>
                                  </Card>
                                ),
                              }))}
                            />
                          ),
                        },
                      ]}
                    />
                  ) : (
                    <Empty description="No data" />
                  )}

                </Space>
              </Card>
            </Col>

          </>
        )}

      </Row>
    </div>
  );
}
