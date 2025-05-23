import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
// import UsersTable from '../components/UsersTable';
// import MoviesTable from '../components/MoviesTable';
// import TicketsTable from '../components/TicketsTable';

export default function Admin() {
    const [activePage, setActivePage] = useState('dashboard');

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar activePage={activePage} setActivePage={setActivePage} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-auto p-6">
                    {activePage === 'dashboard' && <Dashboard />}
                    {activePage === 'users' && <UsersTable />}
                    {activePage === 'movies' && <MoviesTable />}
                    {activePage === 'tickets' && <TicketsTable />}
                </main>
            </div>
        </div>
    );
}
