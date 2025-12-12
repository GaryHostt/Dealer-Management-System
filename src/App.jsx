import React, { useState } from 'react';
import PurchaseOrderForm from './components/PurchaseOrderForm';
import ReferenceScreen from './components/ReferenceScreen';
import './App.css';

function App() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [salesforceOrderNumber, setSalesforceOrderNumber] = useState('');
  const [apiResponse, setApiResponse] = useState(null);

  // Initialize counter from localStorage or start at 3443
  const getNextSalesforceOrderNumber = () => {
    const COUNTER_KEY = 'sf_order_counter';
    const STARTING_NUMBER = 3443;
    
    // Get current counter from localStorage
    let counter = parseInt(localStorage.getItem(COUNTER_KEY) || STARTING_NUMBER);
    
    // Increment for next order
    counter++;
    
    // Save back to localStorage
    localStorage.setItem(COUNTER_KEY, counter.toString());
    
    // Format with leading zeros (8 digits total)
    return counter.toString().padStart(8, '0');
  };

  const handleSubmit = async (data) => {
    try {
      // Generate auto-incrementing Salesforce Order Number
      const sfOrderNum = getNextSalesforceOrderNumber();
      setSalesforceOrderNumber(sfOrderNum);
      
      console.log('Submitting to API via proxy...');
      console.log('Payload:', JSON.stringify(data, null, 2));
      
      // Submit to API via proxy server (bypasses CORS)
      const response = await fetch(
        'http://localhost:3001/api/submit-order',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      console.log('Response status:', response.status);
      console.log('Response statusText:', response.statusText);

      // Capture the response
      const responseData = await response.text();
      console.log('Response data:', responseData);
      
      setApiResponse({
        status: response.status,
        statusText: response.statusText,
        data: responseData || 'Order submitted successfully (no response body)'
      });

      // Always show the reference screen so user can see the response
      setSubmittedData(data);
      setSubmitted(true);
    } catch (error) {
      console.error('Error:', error);
      console.error('Error message:', error.message);
      
      setApiResponse({
        status: 'Error',
        statusText: 'Connection Error',
        data: `Failed to connect to proxy server.\n\n❌ Error: ${error.message}\n\n💡 Make sure the proxy server is running:\n\n1. Open a new terminal\n2. cd proxy-server\n3. npm install\n4. npm start\n\nThe proxy server should be running on http://localhost:3001`
      });
      
      // Still show the reference screen so user can see what went wrong
      setSubmittedData(data);
      setSubmitted(true);
    }
  };

  const handleNewOrder = () => {
    setSubmitted(false);
    setSubmittedData(null);
    setSalesforceOrderNumber('');
    setApiResponse(null);
  };

  // Get current counter value for display (without incrementing)
  const getCurrentCounter = () => {
    const COUNTER_KEY = 'sf_order_counter';
    const STARTING_NUMBER = 3443;
    return parseInt(localStorage.getItem(COUNTER_KEY) || STARTING_NUMBER);
  };

  // Reset counter (for admin purposes)
  const resetCounter = () => {
    const COUNTER_KEY = 'sf_order_counter';
    const STARTING_NUMBER = 3443;
    localStorage.setItem(COUNTER_KEY, STARTING_NUMBER.toString());
    alert(`Counter reset to ${STARTING_NUMBER}. Next order will be ${(STARTING_NUMBER + 1).toString().padStart(8, '0')}`);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Dealer Management System</h1>
      </header>
      
      {!submitted ? (
        <PurchaseOrderForm onSubmit={handleSubmit} />
      ) : (
        <ReferenceScreen 
          data={submittedData} 
          salesforceOrderNumber={salesforceOrderNumber}
          apiResponse={apiResponse}
          onNewOrder={handleNewOrder}
        />
      )}
    </div>
  );
}

export default App;

