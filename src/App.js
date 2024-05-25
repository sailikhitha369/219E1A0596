import React, { useState, useEffect } from 'react';

function App() {
  const [type, setType] = useState('e');
  const [windowPrevState, setWindowPrevState] = useState([]);
  const [windowCurrState, setWindowCurrState] = useState([]);
  const [numbers, setNumbers] = useState([]);
  const [avg, setAvg] = useState(null);

  const WINDOW_SIZE = 10;
  const TIMEOUT = 500; 
  const NUMBER_TYPES = {
    'p': 'http://20.244.56.144/test/primes',
    'f': 'http://20.244.56.144/test/fibo',   
    'e': 'http://20.244.56.144/test/even',  
    'r': 'http://20.244.56.144/test/rand', 
  };

  const isValidNumberType = (type) => Object.keys(NUMBER_TYPES).includes(type);

  const fetchData = async () => {
    const startTime = Date.now();

    try {
      const url = NUMBER_TYPES[type]; 
      const response = await fetch(url, { timeout: TIMEOUT });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const newNumbers = await response.json();
      const filteredNumbers = newNumbers.slice(0, WINDOW_SIZE - window.length); 

      window.length = WINDOW_SIZE; 
      window.splice(0, window.length - filteredNumbers.length, ...filteredNumbers); 

      const newWindowPrevState = window.slice(0, window.length - filteredNumbers.length);
      const newWindowCurrState = window.slice();

      const newAvg = window.length > 0 ? window.reduce((sum, num) => sum + num, 0) / window.length : null;

      const responseTime = Date.now() - startTime;
      if (responseTime > TIMEOUT) {
        console.warn(`Request took longer than ${TIMEOUT}ms: ${responseTime}ms`);
      }

      setWindowPrevState(newWindowPrevState);
      setWindowCurrState(newWindowCurrState);
      setNumbers(newNumbers);
      setAvg(newAvg);
    } catch (error) {
      console.error('Error fetching numbers:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [type]);

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  return (
    <div>
      {/* UI elements to display: */}
      <p>Number Type: {type}</p>
      <p>Previous Window State: {windowPrevState.join(', ')}</p>
      <p>Current Window State: {windowCurrState.join(', ')}</p>
      <p>Received Numbers: {numbers.join(', ')}</p>
      <p>Average: {avg !== null ? avg.toFixed(2) : 'N/A'}</p>
      <select value={type} onChange={handleTypeChange}>
        <option value="e">Even</option>
        <option value="f">Fibonacci</option>
        <option value="p">Prime</option>
        <option value="r">Random</option>
      </select>
      <button onClick={fetchData}>Fetch Numbers</button>
    </div>
  );
}

export default App;
