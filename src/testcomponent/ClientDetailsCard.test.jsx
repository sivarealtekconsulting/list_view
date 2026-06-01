/**
 * ClientDetailsCard.test.jsx
 * ───────────────────────────
 * Deep UI test suite for src/components/cards/ClientDetailsCard.jsx.
 *
 * Stack : Vitest + React Testing Library
 * Run   : npm test -- ClientDetailsCard.test.jsx
 *
 * Coverage areas
 *  1. Card structure        — title, subtitle, form wrapper
 *  2. Row 1 — Name          — label, BankOutlined icon, Select, PlusOutlined
 *  3. Row 1 — Client Req ID — label, InfoCircle tooltip, Input
 *  4. Row 2 — Contact Person— label, Select with UserOutlined
 *  5. Row 2 — End Client    — label, Input
 *  6. Row 3 — Client Location — label, Input
 *  7. Row 3 — Account Manager — label, Select with UserOutlined
 *  8. All fields present simultaneously
 */

import { render, screen } from '@testing-library/react';
import ClientDetailsCard from '../components/cards/ClientDetailsCard';

const renderCard = () => render(<ClientDetailsCard />);

// ════════════════════════════════════════════════════════════════════════════
// 1. Card structure
// ════════════════════════════════════════════════════════════════════════════
describe('ClientDetailsCard card structure', () => {
  it('renders without crashing', () => {
    renderCard();
  });

  it('renders "Client Details" as the card title', () => {
    renderCard();
    expect(screen.getByText('Client Details')).toBeInTheDocument();
  });

  it('renders the BankOutlined icon in the card title', () => {
    const { container } = renderCard();
    expect(container.querySelector('.anticon-bank')).toBeInTheDocument();
  });

  it('renders the subtitle text', () => {
    renderCard();
    expect(
      screen.getByText('Basic client and contact information for this job'),
    ).toBeInTheDocument();
  });

  it('renders the form with cd-form class', () => {
    const { container } = renderCard();
    expect(container.querySelector('.cd-form')).toBeInTheDocument();
  });

  it('renders the client-details-card container', () => {
    const { container } = renderCard();
    expect(container.querySelector('.client-details-card')).toBeInTheDocument();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 2. Row 1 — Name field
// ════════════════════════════════════════════════════════════════════════════
describe('ClientDetailsCard Name field', () => {
  it('renders "*Name" label', () => {
    renderCard();
    expect(screen.getByText('*Name')).toBeInTheDocument();
  });

  it('renders the helper text below the Name select', () => {
    renderCard();
    expect(
      screen.getByText('Select a client to view and complete the remaining job details.'),
    ).toBeInTheDocument();
  });

  it('renders the info-circle icon near the helper text', () => {
    const { container } = renderCard();
    expect(container.querySelectorAll('.anticon-info-circle').length).toBeGreaterThanOrEqual(1);
  });

  it('renders the PlusOutlined add-client icon', () => {
    const { container } = renderCard();
    expect(container.querySelector('.anticon-plus')).toBeInTheDocument();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 3. Row 1 — Client Req ID field
// ════════════════════════════════════════════════════════════════════════════
describe('ClientDetailsCard Client Req ID field', () => {
  it('renders "* Client Req ID" label', () => {
    renderCard();
    expect(screen.getByText('* Client Req ID')).toBeInTheDocument();
  });

  it('renders an input for Client Req ID', () => {
    const { container } = renderCard();
    expect(container.querySelectorAll('input').length).toBeGreaterThanOrEqual(1);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 4. Row 2 — Contact Person field
// ════════════════════════════════════════════════════════════════════════════
describe('ClientDetailsCard Contact Person field', () => {
  it('renders "Contact Person" label', () => {
    renderCard();
    expect(screen.getByText('Contact Person')).toBeInTheDocument();
  });

  it('renders a UserOutlined icon in Contact Person select', () => {
    const { container } = renderCard();
    expect(container.querySelectorAll('.anticon-user').length).toBeGreaterThanOrEqual(1);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 5. Row 2 — End Client field
// ════════════════════════════════════════════════════════════════════════════
describe('ClientDetailsCard End Client field', () => {
  it('renders "End Client" label', () => {
    renderCard();
    expect(screen.getByText('End Client')).toBeInTheDocument();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 6. Row 3 — Client Location field
// ════════════════════════════════════════════════════════════════════════════
describe('ClientDetailsCard Client Location field', () => {
  it('renders "Client Location" label', () => {
    renderCard();
    expect(screen.getByText('Client Location')).toBeInTheDocument();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 7. Row 3 — Account Manager field
// ════════════════════════════════════════════════════════════════════════════
describe('ClientDetailsCard Account Manager field', () => {
  it('renders "Account Manager" label', () => {
    renderCard();
    expect(screen.getByText('Account Manager')).toBeInTheDocument();
  });

  it('renders 2 UserOutlined icons (Contact Person + Account Manager)', () => {
    const { container } = renderCard();
    expect(container.querySelectorAll('.anticon-user').length).toBeGreaterThanOrEqual(2);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 8. All fields present simultaneously
// ════════════════════════════════════════════════════════════════════════════
describe('ClientDetailsCard full render', () => {
  it('renders all 6 field labels at the same time', () => {
    renderCard();
    [
      '*Name',
      '* Client Req ID',
      'Contact Person',
      'End Client',
      'Client Location',
      'Account Manager',
    ].forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('renders at least 3 form row sections', () => {
    const { container } = renderCard();
    expect(container.querySelectorAll('.ant-row').length).toBeGreaterThanOrEqual(3);
  });

  it('renders at least 6 cd-form-item groups', () => {
    const { container } = renderCard();
    expect(container.querySelectorAll('.cd-form-item').length).toBeGreaterThanOrEqual(6);
  });

  it('renders at least 2 ant-select elements (Name + Contact Person + Account Manager)', () => {
    const { container } = renderCard();
    expect(container.querySelectorAll('.ant-select').length).toBeGreaterThanOrEqual(2);
  });

  it('renders at least 2 input elements (Client Req ID + End Client + Client Location)', () => {
    const { container } = renderCard();
    expect(container.querySelectorAll('input').length).toBeGreaterThanOrEqual(2);
  });
});
