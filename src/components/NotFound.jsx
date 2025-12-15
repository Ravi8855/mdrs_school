import React from 'react';

const NotFound = ({ onGoBack }) => {
    return (
        <div className="container" style={{ paddingTop: '50px' }}>
            <h1 style={{ fontSize: '5rem', color: '#FF6B6B' }}>404</h1>
            <h2>You bunked this page! 🤣</h2>
            <p style={{ fontSize: '1.5rem', margin: '20px' }}>
                This page is like your homework: <b>Missing.</b>
            </p>
            <button
                onClick={onGoBack}
                style={{ fontSize: '1.2rem', padding: '10px 20px', backgroundColor: '#FFD700' }}
            >
                Go Back to Class 🏃‍♂️
            </button>
        </div>
    );
};

export default NotFound;
