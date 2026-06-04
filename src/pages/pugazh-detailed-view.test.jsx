// pugazh-detailed-view.test.jsx

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PugazhDetailListview from './pugazh-detail-listview';

vi.mock('../data/jobs', () => ({
    MOCK_JOBS: [
        {
            key: 1,
            title: 'Full Stack Developer',
            status: 'Active',
            location: 'Chennai',
            experience: '6-10 years',
            employmentType: 'Contract',
            locationType: 'Remote',
            clientRate: 115,
        },
    ],
}));

vi.mock('../components/StatusBadge', () => ({
    default: ({ status }) => <span data-testid="status-badge">{status}</span>,
}));

vi.mock('../components/cards/ClientSubmissionCard', () => ({
    default: () => <div data-testid="client-submission-card">Client Submission Card</div>,
}));

vi.mock('../components/cards/StickyNotesCard', () => ({
    default: () => <div data-testid="sticky-notes-card">Sticky Notes Card</div>,
}));

const renderPage = () =>
    render(
        <MemoryRouter initialEntries={['/pugazh-detail/1']}>
            <PugazhDetailListview />
        </MemoryRouter>
    );

describe('PugazhDetailListview', () => {
    it('renders detailed view page without crashing', () => {
        renderPage();

        expect(screen.getByText(/Detailed View/i)).toBeInTheDocument();
    });

    it('renders job title and status badge', () => {
        renderPage();

        expect(screen.getByText(/Full Stack Developer/i)).toBeInTheDocument();
        expect(screen.getByTestId('status-badge')).toBeInTheDocument();
    });

    it('renders breadcrumb items', () => {
        renderPage();

        expect(screen.getByText(/Home/i)).toBeInTheDocument();
        expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
        expect(screen.getByText(/Detailed View/i)).toBeInTheDocument();
    });

    it('renders client information section', () => {
        renderPage();

        expect(screen.getByText(/Client Information/i)).toBeInTheDocument();
        expect(screen.getByText(/Kavitha Sundaram/i)).toBeInTheDocument();
        expect(screen.getByText(/kavitha.sundaram@cognizant.com/i)).toBeInTheDocument();
        expect(screen.getByText(/9827363281/i)).toBeInTheDocument();
    });

    it('renders skills and competencies section', () => {
        renderPage();

        expect(screen.getByText(/Skills & Competencies/i)).toBeInTheDocument();
        expect(screen.getAllByText(/React/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Node.js/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/System Design/i).length).toBeGreaterThan(0);
    });

    it('renders job description section', () => {
        renderPage();

        expect(screen.getByText(/Job Description/i)).toBeInTheDocument();
        expect(screen.getByText(/Roles & Responsibilities/i)).toBeInTheDocument();
        expect(screen.getByText(/Required Skills/i)).toBeInTheDocument();
    });

    it('renders additional details section', () => {
        renderPage();

        expect(screen.getByText(/Additional Details/i)).toBeInTheDocument();
        expect(screen.getByText(/Notice Period/i)).toBeInTheDocument();
        expect(screen.getByText(/30 Days/i)).toBeInTheDocument();
    });

    it('renders right side stats card', () => {
        renderPage();

        expect(screen.getByText(/Target/i)).toBeInTheDocument();
        expect(screen.getAllByText(/12/i).length).toBeGreaterThan(0);
        expect(screen.getByText(/In pipeline/i)).toBeInTheDocument();
        expect(screen.getAllByText(/7/i).length).toBeGreaterThan(0);
    });

    it('renders source candidates button', () => {
        renderPage();

        expect(screen.getByRole('button', { name: /Source Candidates/i })).toBeInTheDocument();
    });

    it('renders edit button', () => {
        renderPage();

        expect(screen.getByRole('button', { name: /Edit/i })).toBeInTheDocument();
    });

    it('renders job meta information', () => {
        renderPage();

        expect(screen.getAllByText(/Chennai/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/6-10 years/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Contract/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Client rate/i).length).toBeGreaterThan(0);
    });

    it('renders details and candidate tabs', () => {
        renderPage();

        expect(screen.getAllByText(/Details/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Candidate/i).length).toBeGreaterThan(0);
    });

    it('renders activity and notes tabs', () => {
        renderPage();

        expect(screen.getAllByText(/Activity/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Notes/i).length).toBeGreaterThan(0);
    });

    it('renders activity timeline dates', () => {
        renderPage();

        expect(screen.getByText(/May 20, 2026/i)).toBeInTheDocument();
        expect(screen.getByText(/May 17, 2026/i)).toBeInTheDocument();
    });

    it('renders right side child cards', () => {
        renderPage();

        expect(screen.getByTestId('client-submission-card')).toBeInTheDocument();
        expect(screen.getByTestId('sticky-notes-card')).toBeInTheDocument();
    });
    it('renders client id information', () => {
        renderPage();

        expect(screen.getByText(/Cognizant Technology Solutions/i)).toBeInTheDocument();
        expect(screen.getByText(/MSP ID 40123789/i)).toBeInTheDocument();
    });

    it('renders created date information', () => {
        renderPage();

        expect(screen.getByText(/Created on/i)).toBeInTheDocument();
        expect(screen.getByText(/Mar 10, 2026/i)).toBeInTheDocument();
    });

    it('renders activity status tags', () => {
        renderPage();

        expect(screen.getAllByText(/Shortlist/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Submitted/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Rejected/i).length).toBeGreaterThan(0);
    });

    it('renders activity time values', () => {
        renderPage();

        expect(screen.getByText(/10:30 AM/i)).toBeInTheDocument();
        expect(screen.getByText(/02:00 PM/i)).toBeInTheDocument();
        expect(screen.getByText(/04:00 PM/i)).toBeInTheDocument();
        expect(screen.getByText(/06:30 PM/i)).toBeInTheDocument();
    });

    it('renders job description important details', () => {
        renderPage();

        expect(screen.getByText(/Bill Rate/i)).toBeInTheDocument();
        expect(screen.getByText(/MSP Owner/i)).toBeInTheDocument();
        expect(screen.getByText(/Duration/i)).toBeInTheDocument();
        expect(screen.getByText(/GbaMS ReqID/i)).toBeInTheDocument();
    });
    it('renders client contact labels', () => {
        renderPage();

        expect(screen.getByText(/Contact Person/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Email/i).length).toBeGreaterThan(0);
        expect(screen.getByText(/Phone Number/i)).toBeInTheDocument();
    });

    it('renders skill category labels', () => {
        renderPage();

        expect(screen.getAllByText(/Primary Skills/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Secondary Skills/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Competencies/i).length).toBeGreaterThan(0);
    });

    it('renders secondary skills tags', () => {
        renderPage();

        expect(screen.getAllByText(/Docker/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Kubernetes/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Redis/i).length).toBeGreaterThan(0);
    });

    it('renders competency tags', () => {
        renderPage();

        expect(screen.getAllByText(/System Design/i).length).toBeGreaterThan(0);
        expect(screen.getByText(/Agile/i)).toBeInTheDocument();
        expect(screen.getByText(/Leadership/i)).toBeInTheDocument();
    });

    it('renders business unit information', () => {
        renderPage();

        expect(screen.getByText(/Business Unit/i)).toBeInTheDocument();
        expect(screen.getByText(/Cognizant Digital Business/i)).toBeInTheDocument();
    });

    it('renders candidate tab count', () => {
        renderPage();

        expect(screen.getAllByText(/5/i).length).toBeGreaterThan(0);
    });

    it('renders details tab count', () => {
        renderPage();

        expect(screen.getAllByText(/1/i).length).toBeGreaterThan(0);
    });

    it('renders activity count badge', () => {
        renderPage();

        expect(screen.getAllByText(/2/i).length).toBeGreaterThan(0);
    });

    it('renders submission and sticky cards inside activity section', () => {
        renderPage();

        expect(screen.getByTestId('client-submission-card')).toBeInTheDocument();
        expect(screen.getByTestId('sticky-notes-card')).toBeInTheDocument();
    });

    it('renders detail page main wrapper', () => {
        const { container } = renderPage();

        expect(container.querySelector('.dashboard-wrapper')).toBeInTheDocument();
    });

    it('renders detail page margin layout class', () => {
        const { container } = renderPage();

        expect(container.querySelector('.detail-margin-top')).toBeInTheDocument();
    });

    it('renders full width detail sections', () => {
        const { container } = renderPage();

        expect(container.querySelector('.detail-full-width')).toBeInTheDocument();
    });

    it('renders client detail cards', () => {
        const { container } = renderPage();

        expect(container.querySelectorAll('.client-details-card').length).toBeGreaterThan(0);
    });

    it('renders target submissions text', () => {
        renderPage();

        expect(screen.getByText(/submissions/i)).toBeInTheDocument();
    });

    it('renders pipeline candidates text', () => {
        renderPage();

        expect(screen.getAllByText(/candidates/i).length).toBeGreaterThan(0);
    });

});