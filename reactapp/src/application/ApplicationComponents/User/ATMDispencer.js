import React, { useState } from 'react';

const ATMDispenser = () => {
    const [amount, setAmount] = useState('');
    const [denominations, setDenominations] = useState(null);

    const currencyNotes = [1, 2, 5, 10, 20, 50, 100, 200, 500, 2000];

    const calculateDenominations = () => {
        let remainingAmount = parseInt(amount);
        if (isNaN(remainingAmount) || remainingAmount <= 0) {
            alert('Please enter a valid positive amount.');
            return;
        }

        const result = {};
        let totalNotes = 0;

        for (let i = currencyNotes.length - 1; i >= 0; i--) {
            const note = currencyNotes[i];
            const count = Math.floor(remainingAmount / note);
            remainingAmount %= note;
            result[note] = count;
            totalNotes += count;
        }

        result.totalNotes = totalNotes;
        setDenominations(result);
    };

    return (
        <div>
            <h1>ATM Dispenser</h1>
            <input
                type="number"
                placeholder="Enter amount to withdraw"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
        <br />
        <button onClick={calculateDenominations}>
            Withdraw
        </button>
        {denominations && (
            <div>
            <h2>Denominations:</h2>
            <ul>
                {currencyNotes.map((note) => (
                <li key={note}>
                    {denominations[note]} notes of Rs {note}
                </li>
                ))}
            </ul>
            <h3>Total notes dispensed: {denominations.totalNotes}</h3>
            </div>
        )}
        </div>
    );
};

export default ATMDispenser;