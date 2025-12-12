import React from 'react';
import './ReferenceScreen.css';

const ReferenceScreen = ({ data, salesforceOrderNumber, apiResponse, onNewOrder }) => {
  const po = data?.B2BMessage?.Data?.PurchaseOrder;
  const header = data?.B2BMessage?.Header;

  if (!po || !header) {
    return <div>No data available</div>;
  }

  const calculateTotal = () => {
    return po.POLineItems.reduce((total, item) => {
      return total + (parseFloat(item.Quantity) * parseFloat(item.UnitPrice));
    }, 0).toFixed(2);
  };

  const isSuccess = apiResponse && apiResponse.status >= 200 && apiResponse.status < 300;
  const isCorsWarning = apiResponse && apiResponse.statusText && apiResponse.statusText.includes('Order Likely Submitted');
  const isAccepted = apiResponse && apiResponse.status === 202;

  return (
    <div className="reference-screen">
      <div className={`success-banner ${!isSuccess && !isCorsWarning ? 'error-banner' : ''} ${isCorsWarning ? 'warning-banner' : ''}`}>
        <div className="success-icon">{isSuccess ? '✓' : isCorsWarning ? '⚠' : '✗'}</div>
        <h2>
          {isSuccess 
            ? isAccepted 
              ? 'Purchase Order Accepted' 
              : 'Purchase Order Submitted Successfully!'
            : isCorsWarning 
            ? 'Purchase Order Submitted (Response Blocked by CORS)'
            : 'Purchase Order Submission Failed'}
        </h2>
        <p>
          {isSuccess 
            ? isAccepted
              ? `Your order has been created with ${import.meta.env.VITE_COMPANY_NAME || '<company>'}, see order number below`
              : 'Your order has been processed and sent to the supplier.'
            : isCorsWarning
            ? 'Your order was sent to the API, but the browser cannot verify the response due to CORS restrictions.'
            : 'There was an error processing your order. Please check the details below.'}
        </p>
      </div>

      <div className="sf-order-section">
        <div className="sf-order-badge">
          <span className="badge-label">Salesforce Order Number</span>
          <span className="badge-value">{salesforceOrderNumber}</span>
        </div>
      </div>

      {apiResponse && (
        <div className="api-response-section">
          <h3>API Response</h3>
          <div className="response-box">
            <div className="response-status">
              <span className="status-label">Status:</span>
              <span className={`status-value ${isSuccess ? 'success' : isCorsWarning ? 'warning' : 'error'}`}>
                {apiResponse.status} {apiResponse.statusText}
              </span>
            </div>
            <div className="response-data">
              <pre>{typeof apiResponse.data === 'string' ? apiResponse.data : JSON.stringify(apiResponse.data, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}

      <div className="reference-content">
        <div className="info-section">
          <h3>Message Header</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Receiver ID:</span>
              <span className="info-value">{header.ReceiverID}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Sender ID:</span>
              <span className="info-value">{header.SenderID}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Message Type:</span>
              <span className="info-value">{header.MessageType}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Business Key:</span>
              <span className="info-value">{header.BusinessKey}</span>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3>Purchase Order Details</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">PO Number:</span>
              <span className="info-value">{po.PONumber}</span>
            </div>
            <div className="info-item">
              <span className="info-label">PO Purpose:</span>
              <span className="info-value">{po.POPurpose}</span>
            </div>
            <div className="info-item">
              <span className="info-label">PO Type:</span>
              <span className="info-value">{po.POType}</span>
            </div>
            <div className="info-item">
              <span className="info-label">PO Date:</span>
              <span className="info-value">{po.PODate}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Customer ID:</span>
              <span className="info-value">{po.CustomerId}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Customer Name:</span>
              <span className="info-value">{po.CustomerName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Contract Number:</span>
              <span className="info-value">{po.ContractNumber}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Bill To Code:</span>
              <span className="info-value">{po.BillToCode}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Buyer Name:</span>
              <span className="info-value">{po.BuyerName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Buyer Email:</span>
              <span className="info-value">{po.BuyerEmailAddress}</span>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3>References</h3>
          <div className="references-list">
            {po.References.map((ref, index) => (
              <div key={index} className="reference-item">
                <span className="ref-type">{ref.ReferenceType}</span>
                <span className="ref-value">{ref.ReferenceValue}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="info-section">
          <h3>Ship To Location</h3>
          <div className="location-card">
            <div className="location-header">
              <strong>{po.OrderShipToLocation.ShipToLocationName}</strong>
              <span className="location-code">{po.OrderShipToLocation.ShipToLocationCode}</span>
            </div>
            <div className="location-address">
              <p>{po.OrderShipToLocation.Address.AddressLine1}</p>
              {po.OrderShipToLocation.Address.AddressLine2 && (
                <p>{po.OrderShipToLocation.Address.AddressLine2}</p>
              )}
              <p>
                {po.OrderShipToLocation.Address.City}, {po.OrderShipToLocation.Address.State} {po.OrderShipToLocation.Address.PostalCode}
              </p>
              <p>{po.OrderShipToLocation.Address.Country}</p>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3>Line Items</h3>
          <div className="line-items-table">
            <table>
              <thead>
                <tr>
                  <th>Line</th>
                  <th>Supplier Item #</th>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {po.POLineItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.PurchaseOrderLineId}</td>
                    <td>{item.SupplierItemNum}</td>
                    <td>{item.ItemDescription}</td>
                    <td>{item.Quantity}</td>
                    <td>${parseFloat(item.UnitPrice).toFixed(2)}</td>
                    <td>${(parseFloat(item.Quantity) * parseFloat(item.UnitPrice)).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="5" className="total-label">Total Order Amount:</td>
                  <td className="total-amount">${calculateTotal()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <div className="reference-actions">
        <button onClick={onNewOrder} className="new-order-btn">
          Create New Order
        </button>
      </div>
    </div>
  );
};

export default ReferenceScreen;

