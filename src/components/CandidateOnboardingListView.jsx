import { useMemo } from 'react';
import {
  Badge,
  Button,
  Space,
  Tooltip,
} from 'antd';
import {
  ArrowUpOutlined,
  FilterOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import ListView from './ListView';
import OnboardingStageCard from './cards/OnboardingStageCard';
import { ONBOARDING_CANDIDATES } from '../data/onboardingList';

function tabLabel(label, count) {
  return (
    <Space size={6}>
      <span>{label}</span>
      <Badge count={count} overflowCount={9999} />
    </Space>
  );
}

function sorterTitle(title) {
  return (
    <span className="candidate-onboarding__sort-title">
      {title}
      <span className="candidate-onboarding__sort-arrows" aria-hidden="true">
        <span />
        <span />
      </span>
    </span>
  );
}

export default function CandidateOnboardingListView({ dataSource = ONBOARDING_CANDIDATES }) {
  const columns = useMemo(() => [
    {
      title: sorterTitle('Candidate Details'),
      dataIndex: 'candidate',
      key: 'candidate',
      width: 255,
      sorter: (a, b) => a.candidate.name.localeCompare(b.candidate.name),
      render: (candidate) => (
        <div className="candidate-onboarding__candidate">
          <a className="candidate-onboarding__candidate-name" href={`/candidates/${candidate.name.toLowerCase().replace(/\s+/g, '-')}`}>
            {candidate.name}
          </a>
          <span className="candidate-onboarding__muted">{candidate.email}</span>
        </div>
      ),
    },
    {
      title: sorterTitle('Job'),
      dataIndex: 'job',
      key: 'job',
      width: 275,
      sorter: (a, b) => a.job.title.localeCompare(b.job.title),
      render: (job) => (
        <dl className="candidate-onboarding__job">
          <div>
            <dt>Client Job ID</dt>
            <dd>{job.clientJobId}</dd>
          </div>
          <div>
            <dt>Title</dt>
            <dd>{job.title}</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{job.location}</dd>
          </div>
        </dl>
      ),
    },
    {
      title: 'Onboarding Stages',
      dataIndex: 'stages',
      key: 'stages',
      render: (stages) => <OnboardingStageCard stages={stages} />,
    },
  ], []);

  const tabs = useMemo(() => [
    { key: 'in-progress', label: tabLabel('In Progress', 6) },
    { key: 'archive', label: tabLabel('Archive', 2) },
  ], []);

  const toolbarActions = (
    <>
      <Tooltip title="Upload">
        <Button className="candidate-onboarding__icon-button" icon={<ArrowUpOutlined />} />
      </Tooltip>
      <Tooltip title="Filter">
        <Button className="candidate-onboarding__icon-button" icon={<FilterOutlined />} />
      </Tooltip>
      <Tooltip title="Add">
        <Button className="candidate-onboarding__icon-button" icon={<PlusOutlined />} />
      </Tooltip>
    </>
  );

  return (
    <ListView
      className="antd candidate-onboarding"
      dataSource={dataSource}
      columns={columns}
      tabs={tabs}
      initialActiveTab="in-progress"
      initialPageSize={6}
      toolbarActions={toolbarActions}
      showActionsToolbar={false}
      showColumnVisibility={false}
      topToolbarClassName="candidate-onboarding__toolbar"
      toolbarActionsClassName="candidate-onboarding__actions"
      searchInputClassName="candidate-onboarding__search"
      searchIconClassName="candidate-onboarding__search-icon"
      tableClassName="candidate-onboarding__table"
      tableScroll={{ x: 920 }}
      tableLayout="fixed"
      rowKey="id"
      rowSelectionProps={{
        columnWidth: 34,
        renderCell: (checked, record, index, originNode) => (
          <span className="candidate-onboarding__checkbox-wrap">{originNode}</span>
        ),
      }}
      searchPredicate={(record, q) => (
        [
          record.candidate.name,
          record.candidate.email,
          record.job.clientJobId,
          record.job.title,
          record.job.location,
          ...record.stages.map((stage) => stage.status),
        ].some((value) => value.toLowerCase().includes(q))
      )}
    />
  );
}
