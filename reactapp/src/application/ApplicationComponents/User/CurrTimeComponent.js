import React, { useState, useEffect } from 'react';

const CurrentTime = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval); 
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { hour12: false });
    };

    return (
        <div>
        {/*<h1>Current Time</h1>*/}
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{formatTime(time)}</p>
        </div>
    );
};

export default CurrentTime