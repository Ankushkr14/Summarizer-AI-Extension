import React, { useState } from 'react';
import axios from 'axios';

function SummarizePage() {
    const [text, setText] = useState('');
    const [summary, setSummary] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        setSummary('');
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/summary', { text }, { withCredentials: true });
            if(response.data && response.data.response){
                setSummary(response.data.response);
            }else{
                setError('Unexpected response from the server.')
            }
        } catch (error) {
            if (error.response) {
                setError(`Error: ${error.response.data?.message || error.response.statusText}`);
            } else {
                setError("Failed to summarize text due to a network error.");
            }
        }
    };

    return (
        <div>
            <h2>Text Summarizer</h2>
            <textarea 
                value={text} 
                onChange={(e) => setText(e.target.value)}
                placeholder='Enter a text to summarize'
                rows="6"
                cols="60"
            />
            <button onClick={handleSubmit}>Summarize</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <h3>Summary:</h3>
            <p>{summary}</p>
        </div>
    );
}

export default SummarizePage;
