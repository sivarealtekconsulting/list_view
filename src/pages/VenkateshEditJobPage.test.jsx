import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import VenkateshEditJobPage from './VenkateshEditJobPage';

vi.mock('antd', async () => {
  const antd = await vi.importActual('antd');

  return {
    ...antd,
    message: {
      ...antd.message,
      success: vi.fn(),
    },
  };
});

const renderPage = (initialEntry = '/Venkatesh-detailview/1/edit-job') => render(
  <MemoryRouter initialEntries={[initialEntry]}>
    <Routes>
      <Route path="/Venkatesh-detailview/:id/edit-job" element={<VenkateshEditJobPage />} />
      <Route path="/Venkatesh-detailview/:id" element={<div>Detail Route</div>} />
      <Route path="/Venkatesh" element={<div>Venkatesh Route</div>} />
    </Routes>
  </MemoryRouter>,
);

async function replaceField(label, value) {
  const input = screen.getByLabelText(label);
  await userEvent.clear(input);
  await userEvent.type(input, value);
}

async function selectField(label, optionText) {
  await userEvent.click(screen.getByLabelText(label));
  const options = await screen.findAllByTitle(optionText);
  await userEvent.click(options[options.length - 1]);
}

async function fillValidEditFormValues() {
  await replaceField('Personality ID', 'PER-999');
  await replaceField('Personality Name', 'Jane Smith');
  await replaceField('Role', 'Product Manager');
  await replaceField('Email', 'jane.smith@example.com');
  await replaceField('Phone', '9876543210');
  await replaceField('Location', 'Austin');
  await replaceField('Department', 'Product');
  await replaceField('Completion', '85');

  await selectField('Category', 'Type A');
  await selectField('Status', 'Active');
  await selectField('Priority', 'High');
}

describe('VenkateshEditJobPage', () => {
  it('renders breadcrumbs, edit form sections, and editable fields', () => {
    renderPage();

    expect(screen.getByText('Venkatesh')).toBeInTheDocument();
    expect(screen.getByText('Edit Job')).toBeInTheDocument();
    expect(screen.getByText('Basic Details')).toBeInTheDocument();
    expect(screen.getByText('Contact Details')).toBeInTheDocument();
    expect(screen.getByText('Assignment & Status')).toBeInTheDocument();
    expect(screen.getByLabelText('Personality ID')).toBeInTheDocument();
    expect(screen.getByLabelText('Personality Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Role')).toBeInTheDocument();
    expect(screen.getByLabelText('Department')).toBeInTheDocument();
  });

  it('formats name and phone values while typing', async () => {
    renderPage();

    const nameInput = screen.getByLabelText('Personality Name');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'jane smith');
    expect(nameInput).toHaveValue('Jane Smith');

    const phoneInput = screen.getByLabelText('Phone');
    await userEvent.clear(phoneInput);
    await userEvent.type(phoneInput, '(987) abc 654-3210');
    expect(phoneInput).toHaveValue('9876543210');
  });

  it('keeps completion numeric and trims it to three digits', async () => {
    renderPage();

    const completionInput = screen.getByLabelText('Completion');
    await userEvent.clear(completionInput);
    await userEvent.type(completionInput, 'abc1200');

    expect(completionInput).toHaveValue('120');
  });

  it('shows validation messages when required values are cleared and update is clicked', async () => {
    renderPage();

    await replaceField('Personality ID', 'PER-999');
    await replaceField('Personality Name', 'Jane Smith');
    await replaceField('Email', 'jane.smith@example.com');

    await userEvent.clear(screen.getByLabelText('Personality ID'));
    await userEvent.clear(screen.getByLabelText('Personality Name'));
    await userEvent.clear(screen.getByLabelText('Email'));
    await userEvent.click(screen.getByRole('button', { name: /Update/i }));

    expect(await screen.findAllByText('Mandatory Field')).toHaveLength(3);
  });

  it('shows field-specific validation for invalid email, phone, and date of birth', async () => {
    renderPage();

    await userEvent.clear(screen.getByLabelText('Email'));
    await userEvent.type(screen.getByLabelText('Email'), 'wrong-email');
    await userEvent.clear(screen.getByLabelText('Phone'));
    await userEvent.type(screen.getByLabelText('Phone'), '12345');
    await userEvent.clear(screen.getByLabelText('Date of Birth'));
    await userEvent.type(screen.getByLabelText('Date of Birth'), '13/40/2024');
    await userEvent.click(screen.getByRole('button', { name: /Update/i }));

    expect(await screen.findByText('Please enter a valid email address.')).toBeInTheDocument();
    expect(await screen.findByText('Phone number must contain exactly 10 digits.')).toBeInTheDocument();
    expect(await screen.findByText('DOB must be in MM/DD/YYYY format.')).toBeInTheDocument();
  });

  it('allows optional date of birth to be cleared while keeping other valid data submittable', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    renderPage();

    await fillValidEditFormValues();
    await userEvent.clear(screen.getByLabelText('Date of Birth'));
    await userEvent.click(screen.getByRole('button', { name: /Update/i }));

    await waitFor(() => {
      expect(screen.getByText('Detail Route')).toBeInTheDocument();
    });
    expect(logSpy).toHaveBeenCalledWith(
      'Updated personality values:',
      expect.objectContaining({ dob: '' }),
    );

    logSpy.mockRestore();
  });

  it('navigates back to detail route when Cancel is clicked', async () => {
    renderPage();

    await userEvent.click(screen.getByRole('button', { name: /Cancel/i }));

    expect(screen.getByText('Detail Route')).toBeInTheDocument();
  });

  it('navigates through breadcrumbs to list and detail routes', async () => {
    const { unmount } = renderPage();

    await userEvent.click(screen.getByText('Venkatesh'));
    expect(screen.getByText('Venkatesh Route')).toBeInTheDocument();

    unmount();
    const { container } = renderPage();
    await userEvent.click(container.querySelectorAll('.ant-breadcrumb .ant-typography-secondary')[1]);
    expect(screen.getByText('Detail Route')).toBeInTheDocument();
  });

  it('submits valid values and navigates back to detail route on Update', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    renderPage();

    await fillValidEditFormValues();
    await userEvent.click(screen.getByRole('button', { name: /Update/i }));

    await waitFor(() => {
      expect(screen.getByText('Detail Route')).toBeInTheDocument();
    });
    expect(logSpy).toHaveBeenCalledWith(
      'Updated personality values:',
      expect.objectContaining({ completion: expect.stringMatching(/%$/) }),
    );

    logSpy.mockRestore();
  });

  it('submits edited field values with formatted payload', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    renderPage();

    await fillValidEditFormValues();
    const nameInput = screen.getByLabelText('Personality Name');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'jane smith');

    const completionInput = screen.getByLabelText('Completion');
    await userEvent.clear(completionInput);
    await userEvent.type(completionInput, '85');

    await userEvent.click(screen.getByRole('button', { name: /Update/i }));

    await waitFor(() => {
      expect(screen.getByText('Detail Route')).toBeInTheDocument();
    });
    expect(logSpy).toHaveBeenCalledWith(
      'Updated personality values:',
      expect.objectContaining({
        personalityName: 'Jane Smith',
        completion: '85%',
      }),
    );

    logSpy.mockRestore();
  });

  it('renders not found state for unknown record id', () => {
    renderPage('/Venkatesh-detailview/999/edit-job');

    expect(screen.getByText('Edit record not found')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Back to Venkatesh/i })).toBeInTheDocument();
  });
});
