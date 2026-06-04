import userEvent from '@testing-library/user-event';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DetailPages from '../pages/suryaDetailview';
import { vi } from 'vitest';


// Json Detail View

// 1
it('renders client name', () => {
  renderComponent();

  expect(
    screen.getByText(/NextWave Technologies/i)
  ).toBeInTheDocument();
});


// 2
it('renders job title', () => {
  renderComponent();

  expect(
    screen.getByText(/Python Automation Engineer/i)
  ).toBeInTheDocument();
});
    

// 3
it('renders status badge', () => {
  renderComponent();

  expect(
    screen.getByText(/Open/i)
  ).toBeInTheDocument();
});

// 4
it('renders location', () => {
  renderComponent();

  expect(
    screen.getByText(/Hyderabad/i)
  ).toBeInTheDocument();
});


// 5
it('renders experience', () => {
  renderComponent();

  expect(
    screen.getByText(/4 years/i)
  ).toBeInTheDocument();
});


// 6
it('renders employment type', () => {
  renderComponent();

  expect(
    screen.getByText(/Contract/i)
  ).toBeInTheDocument();
});


// 7
it('renders salary', () => {
  renderComponent();

  expect(
    screen.getByText(/\$70\/hr/i)
  ).toBeInTheDocument();
});


// 8
it('renders description', () => {
  renderComponent();

  expect(
    screen.getByText(/Looking for a senior React developer/i)
  ).toBeInTheDocument();
});


// 9
it('renders skills', () => {
  renderComponent();

  expect(screen.getByText('React')).toBeInTheDocument();
  expect(screen.getByText('Node.js')).toBeInTheDocument();
});


// 10
it('renders edit button', () => {
  renderComponent();

  expect(
    screen.getByRole('button', {
      name: /Edit/i,
    })
  ).toBeInTheDocument();
});


// 1
it('renders client name field', () => {
  renderComponent();

  expect(
    screen.getByText(/NextWave Technologies/i)
  ).toBeInTheDocument();
});

// 2
it('renders a job title', () => {
  renderComponent();

  expect(
    screen.getByRole('heading')
  ).toBeInTheDocument();
});

// 3
it('renders status badge', () => {
  renderComponent();

  expect(
    screen.getByText('Open')
  ).toBeInTheDocument();
});

// 4
it('renders location information', () => {
  renderComponent();

  expect(
    screen.getByText(/NextWave Technologies/i)
  ).toBeInTheDocument();
});

// 5
it('renders experience information', () => {
  renderComponent();

  expect(
    screen.getAllByText('5 years').length
  ).toBeGreaterThan(0);
});

// 6
it('renders employment type', () => {
  renderComponent();

  expect(
    screen.getAllByText(/Full-time/i).length
  ).toBeGreaterThan(0);
});

// 7
it('renders salary information', () => {
  renderComponent();

  expect(
    screen.getByText(/\$/i)
  ).toBeInTheDocument();
});

// 8
it('renders description section', () => {
  renderComponent();

  expect(
    screen.getByText(/About this Role/i)
  ).toBeInTheDocument();
});

// 9
it('renders at least one skill tag', () => {
  renderComponent();

  expect(
    screen.getByText('React')
  ).toBeInTheDocument();
});

// 10
it('renders edit button', () => {
  renderComponent();

  expect(
    screen.getByRole('button', {
      name: /Edit/i,
    })
  ).toBeInTheDocument();
});





// 1
it('renders client name', () => {
  renderComponent();

  expect(
    screen.getByText(/CodeSphere Solutions/i)
  ).toBeInTheDocument();
});

// 2
it('renders job title', () => {
  renderComponent();

  expect(
    screen.getByText(/Python Automation Engineer/i)
  ).toBeInTheDocument();
});

// 3
it('renders status badge', () => {
  renderComponent();

  expect(
    screen.getAllByText(/Submitted/i).length
  ).toBeGreaterThan(0);
});

// 4
it('renders location information', () => {
  renderComponent();

  expect(
    screen.getByText(/Hyderabad/i)
  ).toBeInTheDocument();
});

// 5
it('renders experience information', () => {
  renderComponent();

  expect(
    screen.getAllByText(/4 years/i).length
  ).toBeGreaterThan(0);
});

// 6
it('renders employment type', () => {
  renderComponent();

  expect(
    screen.getAllByText(/Contract/i).length
  ).toBeGreaterThan(0);
});

// 7
it('renders salary information', () => {
  renderComponent();

  expect(
    screen.getByText(/\$70\/hr/i)
  ).toBeInTheDocument();
});

// 8
it('renders About this Role section', () => {
  renderComponent();

  expect(
    screen.getByText(/About this Role/i)
  ).toBeInTheDocument();
});

// 9
it('renders React skill tag', () => {
  renderComponent();

  expect(
    screen.getByText(/^React$/)
  ).toBeInTheDocument();
});

// 10
it('renders Edit button', () => {
  renderComponent();

  expect(
    screen.getByRole('button', {
      name: /Edit/i,
    })
  ).toBeInTheDocument();
});

// 11
it('renders Detailed View breadcrumb', () => {
  renderComponent();

  expect(
    screen.getByText(/Detailed View/i)
  ).toBeInTheDocument();
});


// 12
it('renders Track Application button', () => {
  renderComponent();

  expect(
    screen.getByRole('button', {
      name: /Track Application/i,
    })
  ).toBeInTheDocument();
});


// 13
it('renders shortlisted status', () => {
  renderComponent();

  expect(
    screen.getByText(/^Shortlisted$/i)
  ).toBeInTheDocument();
});


// 14
it('renders Interview Process section', () => {
  renderComponent();

  expect(
    screen.getByText(/Interview Process/i)
  ).toBeInTheDocument();
});


// 15
it('renders application submitted step', () => {
  renderComponent();

  expect(
    screen.getByText(/Application Submitted/i)
  ).toBeInTheDocument();
});


// 16
it('renders Job Summary section', () => {
  renderComponent();

  expect(
    screen.getByText(/Job Summary/i)
  ).toBeInTheDocument();
});


// 17
it('renders work mode', () => {
  renderComponent();

  expect(
    screen.getByText(/Remote/i)
  ).toBeInTheDocument();
});


// 18
it('renders recruiter name', () => {
  renderComponent();

  expect(
    screen.getByText(/David Warner/i)
  ).toBeInTheDocument();
});


// 19
it('renders recruiter email', () => {
  renderComponent();

  expect(
    screen.getByText(/hiring@infosys.com/i)
  ).toBeInTheDocument();
});


// 20
it('renders Documents section', () => {
  renderComponent();

  expect(
    screen.getByText(/Documents/i)
  ).toBeInTheDocument();
});