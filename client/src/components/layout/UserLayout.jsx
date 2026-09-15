import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const UserLayout = ({ children }) => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)' }}>
            <Navbar />
            <main style={{ flexGrow: 1 }}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default UserLayout;
