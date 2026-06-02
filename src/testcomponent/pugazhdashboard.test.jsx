import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PugazhDashboard from '../pages/pugazh-dashboard';

import {
    PUG_DASHBOARD_MOCK_JOBS,
    PUG_DASHBOARD_STATS,
    PUG_DASHBOARD_JOB_LIST_SUMMARY,
    PUG_DASHBOARD_DASHBOARD_CARDS,
    PUG_DASHBOARD_DETAIL_DATA,
} from '../data/jobs';


vi.mock('../components/pugalistView', () => ({
    default: () => <div data-testid="job-list-view">Job List View</div>,
}));

vi.mock('../components/cards/StatsCards', () => ({
    default: () => <div data-testid="stats-cards">Stats Cards</div>,
}));

vi.mock('../components/cards/CalendarCard', () => ({
    default: () => <div data-testid="calendar-card">Calendar Card</div>,
}));

vi.mock('../components/cards/ClientSubmissionCard', () => ({
    default: () => <div data-testid="client-submission-card">Client Submission Card</div>,
}));

vi.mock('../components/cards/ClientDetailsCard', () => ({
    default: () => <div data-testid="client-details-card">Client Details Card</div>,
}));

vi.mock('../components/cards/StickyNotesCard', () => ({
    default: () => <div data-testid="sticky-notes-card">Sticky Notes Card</div>,
}));

vi.mock('../components/cards/OnboardingCard', () => ({
    default: () => <div data-testid="onboarding-card">Onboarding Card</div>,
}));

vi.mock('antd', async () => {
    const actual = await vi.importActual('antd');
    return {
        ...actual,
        Affix: ({ children }) => <div>{children}</div>,
        FloatButton: () => null,
    };
});


const renderPage = () =>
    render(
        <MemoryRouter>
            <PugazhDashboard />
        </MemoryRouter>
    );



describe('PugazhDashboard', () => {

    it('fails if summary values are changed', () => {
        expect(PUG_DASHBOARD_JOB_LIST_SUMMARY.myJobsCount).toBe(8);
        expect(PUG_DASHBOARD_JOB_LIST_SUMMARY.allJobsCount).toBe(2468);
    });



    it('fails if stats labels are changed', () => {
        expect(PUG_DASHBOARD_STATS[0].label).toBe('Total Jobs');
        expect(PUG_DASHBOARD_STATS[1].label).toBe('Active Jobs');
        expect(PUG_DASHBOARD_STATS[2].label).toBe('My Jobs');
    });

    it('fails if stats values are changed', () => {
        expect(PUG_DASHBOARD_STATS[0].value).toBe('1666');
        expect(PUG_DASHBOARD_STATS[1].value).toBe(1397);
        expect(PUG_DASHBOARD_STATS[2].value).toBe(214);
    });

    it('fails if stats icons are changed', () => {
        expect(PUG_DASHBOARD_STATS[0].icon).toBe('fileText');
        expect(PUG_DASHBOARD_STATS[1].icon).toBe('checkCircle');
        expect(PUG_DASHBOARD_STATS[2].icon).toBe('user');
    });

    // ── String fields — empty check ───────────────────────────────

    it('should not have empty job titles', () => {
        const invalidJob = PUG_DASHBOARD_MOCK_JOBS.find(
            (job) => !job.title?.trim()
        );
        expect(
            invalidJob?.title?.trim(),
            invalidJob
                ? `Title is empty for Job ID: ${invalidJob.id}, Key: ${invalidJob.key}`
                : ''
        ).not.toBe('');
    });

    it('should not have empty job locations', () => {
        const invalidJob = PUG_DASHBOARD_MOCK_JOBS.find(
            (job) => !job.location?.trim()
        );
        expect(
            invalidJob?.location?.trim(),
            invalidJob
                ? `Location is empty for Job ID: ${invalidJob.id}, Key: ${invalidJob.key}`
                : ''
        ).not.toBe('');
    });

    it('should not have empty locationType', () => {
        const invalidJob = PUG_DASHBOARD_MOCK_JOBS.find(
            (job) => !job.locationType?.trim()
        );
        expect(
            invalidJob?.locationType?.trim(),
            invalidJob
                ? `LocationType is empty for Job ID: ${invalidJob.id}, Key: ${invalidJob.key}`
                : ''
        ).not.toBe('');
    });

    it('should not have empty experience', () => {
        const invalidJob = PUG_DASHBOARD_MOCK_JOBS.find(
            (job) => !job.experience?.trim()
        );
        expect(
            invalidJob?.experience?.trim(),
            invalidJob
                ? `Experience is empty for Job ID: ${invalidJob.id}, Key: ${invalidJob.key}`
                : ''
        ).not.toBe('');
    });

    it('should not have empty employmentType', () => {
        const invalidJob = PUG_DASHBOARD_MOCK_JOBS.find(
            (job) => !job.employmentType?.trim()
        );
        expect(
            invalidJob?.employmentType?.trim(),
            invalidJob
                ? `EmploymentType is empty for Job ID: ${invalidJob.id}, Key: ${invalidJob.key}`
                : ''
        ).not.toBe('');
    });

    it('should not have empty status', () => {
        const invalidJob = PUG_DASHBOARD_MOCK_JOBS.find(
            (job) => !job.status?.trim()
        );
        expect(
            invalidJob?.status?.trim(),
            invalidJob
                ? `Status is empty for Job ID: ${invalidJob.id}, Key: ${invalidJob.key}`
                : ''
        ).not.toBe('');
    });

    it('should not have empty client name', () => {
        const invalidJob = PUG_DASHBOARD_MOCK_JOBS.find(
            (job) => !job.client?.trim()
        );
        expect(
            invalidJob?.client?.trim(),
            invalidJob
                ? `Client is empty for Job ID: ${invalidJob.id}, Key: ${invalidJob.key}`
                : ''
        ).not.toBe('');
    });

    it('should not have empty createdAt', () => {
        const invalidJob = PUG_DASHBOARD_MOCK_JOBS.find(
            (job) => !job.createdAt?.trim()
        );
        expect(
            invalidJob?.createdAt?.trim(),
            invalidJob
                ? `CreatedAt is empty for Job ID: ${invalidJob.id}, Key: ${invalidJob.key}`
                : ''
        ).not.toBe('');
    });

    it('should not have empty createdAgo', () => {
        const invalidJob = PUG_DASHBOARD_MOCK_JOBS.find(
            (job) => !job.createdAgo?.trim()
        );
        expect(
            invalidJob?.createdAgo?.trim(),
            invalidJob
                ? `CreatedAgo is empty for Job ID: ${invalidJob.id}, Key: ${invalidJob.key}`
                : ''
        ).not.toBe('');
    });

    // ── Number fields — valid check ───────────────────────────────

    it('should not have invalid clientRate', () => {
        const invalidJob = PUG_DASHBOARD_MOCK_JOBS.find(
            (job) => typeof job.clientRate !== 'number' || job.clientRate <= 0
        );
        expect(
            invalidJob,
            invalidJob
                ? `ClientRate invalid for Job ID: ${invalidJob.id}, Key: ${invalidJob.key}`
                : ''
        ).toBeUndefined();
    });

    it('should not have invalid pipeline count', () => {
        const invalidJob = PUG_DASHBOARD_MOCK_JOBS.find(
            (job) => typeof job.pipeline !== 'number' || job.pipeline < 0
        );
        expect(
            invalidJob,
            invalidJob
                ? `Pipeline invalid for Job ID: ${invalidJob.id}, Key: ${invalidJob.key}`
                : ''
        ).toBeUndefined();
    });

    // ── Boolean fields — type check ───────────────────────────────

    it('should not have non-boolean hasBookmark', () => {
        const invalidJob = PUG_DASHBOARD_MOCK_JOBS.find(
            (job) => typeof job.hasBookmark !== 'boolean'
        );
        expect(
            invalidJob,
            invalidJob
                ? `hasBookmark is not boolean for Job ID: ${invalidJob.id}, Key: ${invalidJob.key}`
                : ''
        ).toBeUndefined();
    });

    it('should not have non-boolean hasLinkedIn', () => {
        const invalidJob = PUG_DASHBOARD_MOCK_JOBS.find(
            (job) => typeof job.hasLinkedIn !== 'boolean'
        );
        expect(
            invalidJob,
            invalidJob
                ? `hasLinkedIn is not boolean for Job ID: ${invalidJob.id}, Key: ${invalidJob.key}`
                : ''
        ).toBeUndefined();
    });

    // ── targetSub — integrity check ───────────────────────────────

    it('should not have invalid targetSub', () => {
        const invalidJob = PUG_DASHBOARD_MOCK_JOBS.find(
            (job) => !job.targetSub || job.targetSub.filled == null || job.targetSub.total == null
        );
        expect(
            invalidJob,
            invalidJob
                ? `targetSub missing for Job ID: ${invalidJob.id}, Key: ${invalidJob.key}`
                : ''
        ).toBeUndefined();
    });

    it('should not have targetSub filled greater than total', () => {
        const invalidJob = PUG_DASHBOARD_MOCK_JOBS.find(
            (job) => job.targetSub?.filled > job.targetSub?.total
        );
        expect(
            invalidJob,
            invalidJob
                ? `filled (${invalidJob.targetSub.filled}) > total (${invalidJob.targetSub.total}) for Job ID: ${invalidJob.id}, Key: ${invalidJob.key}`
                : ''
        ).toBeUndefined();
    });

    // ── Assignees — valid check ───────────────────────────────────

    it('should not have jobs with empty assignees', () => {
        const invalidJob = PUG_DASHBOARD_MOCK_JOBS.find(
            (job) => !Array.isArray(job.assignees) || job.assignees.length === 0
        );
        expect(
            invalidJob,
            invalidJob
                ? `Assignees empty for Job ID: ${invalidJob.id}, Key: ${invalidJob.key}`
                : ''
        ).toBeUndefined();
    });

    it('should not have assignees with empty initials', () => {
        const invalidJob = PUG_DASHBOARD_MOCK_JOBS.find(
            (job) => job.assignees?.some((a) => !a.initials?.trim())
        );
        expect(
            invalidJob,
            invalidJob
                ? `Assignee initials empty for Job ID: ${invalidJob.id}, Key: ${invalidJob.key}`
                : ''
        ).toBeUndefined();
    });

    it('should not have assignees with empty color', () => {
        const invalidJob = PUG_DASHBOARD_MOCK_JOBS.find(
            (job) => job.assignees?.some((a) => !a.color?.trim())
        );
        expect(
            invalidJob,
            invalidJob
                ? `Assignee color empty for Job ID: ${invalidJob.id}, Key: ${invalidJob.key}`
                : ''
        ).toBeUndefined();
    });

    // ── Duplicate key check ───────────────────────────────────────

    it('should not have duplicate job keys', () => {
        const keys = PUG_DASHBOARD_MOCK_JOBS.map((job) => job.key);
        const duplicate = keys.find((key, i) => keys.indexOf(key) !== i);
        expect(
            duplicate,
            duplicate ? `Duplicate key found: ${duplicate}` : ''
        ).toBeUndefined();
    });

    
});