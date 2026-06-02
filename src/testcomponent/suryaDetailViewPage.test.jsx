import userEvent from '@testing-library/user-event';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DetailPages from '../pages/suryaDetailview';
import { vi } from 'vitest';


const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ jobId: '102' }),
  };
});



const renderComponent = () =>
  render(
    <BrowserRouter>
      <DetailPages />
    </BrowserRouter>
  );


// 1
it('renders Detail Page without crashing', () => {
  renderComponent();

  expect(
    screen.getByText('Detailed View')
  ).toBeInTheDocument();
});

// 2
it('renders breadcrumb items', () => {
  renderComponent();

  expect(screen.getByText('Home')).toBeInTheDocument();
  expect(screen.getByText('Jobs')).toBeInTheDocument();
  expect(
    screen.getByText('Detailed View')
  ).toBeInTheDocument();
});

// 3
it('displays the job title', () => {
  renderComponent();

  expect(
    screen.getByRole('heading')
  ).toBeInTheDocument();
});

// 4
it('shows applied status badge', () => {
  renderComponent();

  expect(
    screen.getByText('Applied')
  ).toBeInTheDocument();
});

// 5
it('renders edit button', () => {
  renderComponent();

  expect(
    screen.getByRole('button', {
      name: /edit/i,
    })
  ).toBeInTheDocument();
});

// 6
it('navigates to edit page when edit button is clicked', () => {
  renderComponent();

  fireEvent.click(
    screen.getByRole('button', {
      name: /edit/i,
    })
  );

  expect(mockNavigate).toHaveBeenCalled();
});

// 7
it('renders track application button', () => {
  renderComponent();

  expect(
    screen.getByRole('button', {
      name: /track application/i,
    })
  ).toBeInTheDocument();
});

// 8
it('renders interview process timeline', () => {
  renderComponent();

  expect(
    screen.getByText('Application Submitted')
  ).toBeInTheDocument();

  expect(
    screen.getByText('Technical Screening')
  ).toBeInTheDocument();

  expect(
    screen.getByText('Manager Discussion')
  ).toBeInTheDocument();

  expect(
    screen.getByText('HR Round')
  ).toBeInTheDocument();
});

// 9
it('renders recruiter details', () => {
  renderComponent();

  expect(
    screen.getByText('David Warner')
  ).toBeInTheDocument();

  expect(
    screen.getByText('Senior Recruiter')
  ).toBeInTheDocument();

  expect(
    screen.getByText('hiring@infosys.com')
  ).toBeInTheDocument();
});

// 10
it('renders document buttons', () => {
  renderComponent();

  expect(
    screen.getByText('Resume.pdf')
  ).toBeInTheDocument();

  expect(
    screen.getByText('CoverLetter.pdf')
  ).toBeInTheDocument();

  expect(
    screen.getByText('Experience.pdf')
  ).toBeInTheDocument();
});


// 11
it('renders company name', () => {
  renderComponent();

  expect(
    screen.getByText(/Infosys • Job ID/i)
  ).toBeInTheDocument();
});


// 12
it('renders job location', () => {
  renderComponent();

  expect(
    screen.getByText(/Texas/i)
  ).toBeInTheDocument();
});


// 13
it('renders experience details', () => {
  renderComponent();

  expect(
    screen.getAllByText(/8\+ Years/i).length
  ).toBeGreaterThan(0);
});


// 14
it('renders salary details', () => {
  renderComponent();

  expect(
    screen.getByText(/\$85\/hr/i)
  ).toBeInTheDocument();
});


// 15
it('renders About this Role section', () => {
  renderComponent();

  expect(
    screen.getByText('About this Role')
  ).toBeInTheDocument();
});


// 16
it('renders Responsibilities section', () => {
  renderComponent();

  expect(
    screen.getByText('Responsibilities')
  ).toBeInTheDocument();
});


// 17
it('renders React skill tag', () => {
  renderComponent();

  expect(
    screen.getByText('React')
  ).toBeInTheDocument();
});


// 18
it('renders AWS skill tag', () => {
  renderComponent();

  expect(
    screen.getByText('AWS')
  ).toBeInTheDocument();
});



// 19
it('renders Job Summary card', () => {
  renderComponent();

  expect(
    screen.getByText('Job Summary')
  ).toBeInTheDocument();
});



// 20
it('renders shortlisted status', () => {
  renderComponent();

  expect(
    screen.getByText('Shortlisted')
  ).toBeInTheDocument();
});





