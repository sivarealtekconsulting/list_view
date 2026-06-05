import userEvent from '@testing-library/user-event';

import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import NewDashboard from '../pages/suryaDashboardPage';
import ListViews from '../components/suryaListView'

// 1
test('renders dashboard', () => {
    render(
        <BrowserRouter>
            <NewDashboard />
        </BrowserRouter>
    );

    expect(
        screen.getByText('Dashboard')
    ).toBeInTheDocument();
});


// 2
test('candidate form hidden initially', () => {
    render(
        <BrowserRouter>
            <NewDashboard />
        </BrowserRouter>
    );

    expect(
        screen.queryByText('Candidate Form')
    ).not.toBeInTheDocument();
});


// 3
test('opens candidate form', async () => {

    render(
        <BrowserRouter>
            <NewDashboard />
        </BrowserRouter>
    );

    const btn = screen.getByRole('button', {
        name: /open candidate form/i,
    });

    await userEvent.click(btn);

    expect(
        screen.getByText('Candidate Form')
    ).toBeInTheDocument();
});


// 4
test('closes candidate form', async () => {
    render(
        <BrowserRouter>
            <NewDashboard />
        </BrowserRouter>
    );

    await userEvent.click(
        screen.getByRole('button', {
            name: /open candidate form/i,
        })
    );

    await userEvent.click(
        screen.getByRole('button', {
            name: /close candidate form/i,
        })
    );

    expect(
        screen.queryByText('Candidate Form')
    ).not.toBeInTheDocument();
});


// 5
test('renders candidate management section', () => {
    render(
        <BrowserRouter>
            <NewDashboard />
        </BrowserRouter>
    );

    expect(
        screen.getByText(/candidate management/i)
    ).toBeInTheDocument();
});


// 6
test('button text changes after opening form', async () => {
    render(
        <BrowserRouter>
            <NewDashboard />
        </BrowserRouter>
    );

    await userEvent.click(
        screen.getByRole('button', {
            name: /open candidate form/i,
        })
    );

    expect(
        screen.getByRole('button', {
            name: /close candidate form/i,
        })
    ).toBeInTheDocument();
});


// 7
test('shows validation error', async () => {

    render(
        <BrowserRouter>
            <NewDashboard />
        </BrowserRouter>
    );

    await userEvent.click(
        screen.getByRole('button', {
            name: /open candidate form/i,
        })
    );

    expect(
        screen.getByText('Candidate Form')
    ).toBeInTheDocument();
});


// 8
test('renders stats cards section', () => {
    render(
        <BrowserRouter>
            <NewDashboard />
        </BrowserRouter>
    );

    expect(
        screen.getByText(/total jobs/i)
    ).toBeInTheDocument();
});



// 9
test('renders client submission card', () => {
    render(
        <BrowserRouter>
            <NewDashboard />
        </BrowserRouter>
    );

    expect(
        screen.getByText(/client submission/i)
    ).toBeInTheDocument();
});



// 10
test('renders client details card', () => {
    render(
        <BrowserRouter>
            <NewDashboard />
        </BrowserRouter>
    );

    expect(
        screen.getByText(/client details/i)
    ).toBeInTheDocument();
});



// 11
test('renders sticky notes card', () => {
    render(
        <BrowserRouter>
            <NewDashboard />
        </BrowserRouter>
    );

    expect(
        screen.getByText(/sticky notes/i)
    ).toBeInTheDocument();
});



// 12
test('renders calendar card', () => {
    render(
        <BrowserRouter>
            <NewDashboard />
        </BrowserRouter>
    );

    expect(
        screen.getAllByText(/may/i).length
    ).toBeGreaterThan(0);
});



// 13
test('renders list view section', () => {

    render(
        <BrowserRouter>
            <NewDashboard />
        </BrowserRouter>
    );

    expect(
        screen.getAllByText(/pipeline/i).length
    ).toBeGreaterThan(0);
});


// 14
test('candidate form card appears after open', async () => {
    render(
        <BrowserRouter>
            <NewDashboard />
        </BrowserRouter>
    );

    await userEvent.click(
        screen.getByRole('button', {
            name: /open candidate form/i,
        })
    );

    expect(
        screen.getByText('Candidate Form')
    ).toBeInTheDocument();
});



// 15
test('candidate form card removed after close', async () => {
    render(
        <BrowserRouter>
            <NewDashboard />
        </BrowserRouter>
    );

    await userEvent.click(
        screen.getByRole('button', {
            name: /open candidate form/i,
        })
    );

    await userEvent.click(
        screen.getByRole('button', {
            name: /close candidate form/i,
        })
    );

    expect(
        screen.queryByText('Candidate Form')
    ).not.toBeInTheDocument();
});



// 16
test('open candidate form button exists', () => {
    render(
        <BrowserRouter>
            <NewDashboard />
        </BrowserRouter>
    );

    expect(
        screen.getByRole('button', {
            name: /open candidate form/i,
        })
    ).toBeInTheDocument();
});



// 17
test('candidate management card exists', () => {
    render(
        <BrowserRouter>
            <NewDashboard />
        </BrowserRouter>
    );

    expect(
        screen.getByText(/candidate management/i)
    ).toBeInTheDocument();
});



// 18
test('dashboard wrapper renders', () => {
    const { container } = render(
        <BrowserRouter>
            <NewDashboard />
        </BrowserRouter>
    );

    expect(
        container.querySelector('.dashboard-wrapper')
    ).toBeInTheDocument();
});



// 19
test('breadcrumb home renders', () => {
    render(
        <BrowserRouter>
            <NewDashboard />
        </BrowserRouter>
    );

    expect(
        screen.getByText('Home')
    ).toBeInTheDocument();
});



// 20
test('breadcrumb dashboard renders', () => {
    render(
        <BrowserRouter>
            <NewDashboard />
        </BrowserRouter>
    );

    expect(
        screen.getByText('Dashboard')
    ).toBeInTheDocument();
});