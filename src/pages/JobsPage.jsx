import { useCallback, useEffect, useRef, useState } from 'react';
import { Row, Col, Space } from 'antd';

import StatsCards from '../components/cards/StatsCards';
import JobListView from '../components/ListView';
import CalendarCard from '../components/cards/CalendarCard';
import ClientSubmissionCard from '../components/cards/ClientSubmissionCard';
import ClientDetailsCard from '../components/cards/ClientDetailsCard';
import StickyNotesCard from '../components/cards/StickyNotesCard';
import OnboardingCard from '../components/cards/OnboardingCard';
import { getModuleDataList } from '../services/moduleDataApi';

const PAGE_SIZE = 20;

export default function JobsPage() {
  const [jobs, setJobs]         = useState([]);
  const [total, setTotal]       = useState(0);
  const [tabs, setTabs]         = useState([]);
  const [loading, setLoading]   = useState(false);

  // Server-side query state
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState('');
  const [sort, setSort]           = useState('');
  const [sortDir, setSortDir]     = useState('asc');
  const [filters, setFilters]     = useState([]);

  // Prevent stale responses from overwriting newer ones
  const reqRef = useRef(0);

  useEffect(() => {
    const reqId = ++reqRef.current;
    setLoading(true);

    getModuleDataList({
      module:   'jobs',
      limit:    PAGE_SIZE,
      offset:   (page - 1) * PAGE_SIZE,
      tabValue: activeTab === 'all' ? '' : activeTab,
      search,
      sort,
      sortDir,
      filters,
    })
      .then((result) => {
        if (reqRef.current !== reqId) return; // stale
        setJobs(result.data);
        setTotal(result.total);
        // Only update tab counts on the first (unfiltered) load
        if (result.tabs.length > 0 && !search && !filters.length) {
          setTabs(result.tabs);
        }
      })
      .catch((err) => console.error('Failed to load jobs:', err))
      .finally(() => { if (reqRef.current === reqId) setLoading(false); });
  }, [activeTab, page, search, sort, sortDir, filters]);

  const handleTabChange = useCallback((key) => {
    setActiveTab(key);
    setPage(1);
  }, []);

  const handleSearch = useCallback((text) => {
    setSearch(text);
    setPage(1);
  }, []);

  const handleSort = useCallback((field, dir) => {
    setSort(field);
    setSortDir(dir);
    setPage(1);
  }, []);

  const handleFilter = useCallback((conditions) => {
    setFilters(conditions);
    setPage(1);
  }, []);

  return (
    <div className="dashboard-wrapper">
      <Row gutter={[16, 16]} align="top">

        {/* LEFT — Stats + JobList */}
        <Col xs={20} lg={16}>
          <Space direction="vertical" size={12} className="jobs-page-left">
            <OnboardingCard />
            <StatsCards />
            <JobListView
              dataSource={jobs}
              loading={loading}
              tabs={tabs.length ? tabs : undefined}
              initialActiveTab="all"
              onTabChange={handleTabChange}
              serverSide
              total={total}
              currentPage={page}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
              onSearch={handleSearch}
              onSort={handleSort}
              onFilter={handleFilter}
            />
          </Space>
        </Col>

        {/* RIGHT — Calendar + Submission + Notes */}
        <Col xs={24} lg={8}>
          <Space direction="vertical" size={12} className="jobs-page-right">
            <CalendarCard />
            <ClientSubmissionCard />
            <StickyNotesCard />
          </Space>
        </Col>

      </Row>
      <ClientDetailsCard />
    </div>
  );
}
