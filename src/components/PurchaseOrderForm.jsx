import React, { useState } from 'react';
import './PurchaseOrderForm.css';

const PurchaseOrderForm = ({ onSubmit }) => {
  // Store date in YYYY-MM-DD format for HTML input, will convert to YYYYMMDD on submit
  const today = new Date().toISOString().split('T')[0];
  const timestamp = Date.now();

  // Collapse state for sections - header and references collapsed by default
  const [collapsed, setCollapsed] = useState({
    header: true,
    references: true,
    shipTo: false,
    lineItems: false
  });

  const toggleSection = (section) => {
    setCollapsed(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const [formData, setFormData] = useState({
    header: {
      receiverId: 'MYTHICAL',
      senderId: 'HOMESUPPLIES',
      messageType: 'CUSTOMER_PURCHASE_ORDER',
      businessKey: `HS-${timestamp}`
    },
    purchaseOrder: {
      poPurpose: 'New',
      poType: 'NE',
      poNumber: `HS-${timestamp}`,
      customerId: 'HOMESUPPLIES',
      customerName: 'HOMESUPPLIES',
      contractNumber: 'C87313019',
      poDate: today,
      billToCode: '27097115',
      buyerName: 'Maxime Balistreri',
      buyerEmailAddress: 'Teresa92@example.org',
      references: [
        { referenceType: 'MR', referenceValue: '60024251' },
        { referenceType: 'KK', referenceValue: 'S' }
      ],
      shipToLocation: {
        shipToLocationName: 'HOMESUPPLIES - Oakland',
        shipToLocationCode: 'HD OAK',
        addressLine1: '764 OLIVE BLVD',
        addressLine2: '',
        city: 'OAKLAND',
        state: 'CA',
        postalCode: '94765',
        country: 'US'
      },
      lineItems: [
        {
          purchaseOrderLineId: '1',
          quantity: '450',
          unitPrice: '180.74',
          supplierItemNum: 'bci3036586',
          itemDescription: '24 Inch Wide Built-In Automatic Coffee Machine with Home Connect'
        },
        {
          purchaseOrderLineId: '2',
          quantity: '670',
          unitPrice: '101.17',
          supplierItemNum: 'bci4455957',
          itemDescription: '16-7/8" Inch Wide Convection Countertop Toaster Oven with Air Fry'
        },
        {
          purchaseOrderLineId: '3',
          quantity: '140',
          unitPrice: '128.45',
          supplierItemNum: 'bci4377715',
          itemDescription: '10-in-1 Touchscreen Countertop Smart Oven Starter Set'
        },
        {
          purchaseOrderLineId: '4',
          quantity: '320',
          unitPrice: '171.64',
          supplierItemNum: 'bci4392348',
          itemDescription: '30 Inch Wide Built In ADA Compliant Coffee Maker'
        }
      ]
    }
  });

  const handleHeaderChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      header: { ...prev.header, [field]: value }
    }));
  };

  const handlePOChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      purchaseOrder: { ...prev.purchaseOrder, [field]: value }
    }));
  };

  const handleShipToChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      purchaseOrder: {
        ...prev.purchaseOrder,
        shipToLocation: { ...prev.purchaseOrder.shipToLocation, [field]: value }
      }
    }));
  };

  const handleReferenceChange = (index, field, value) => {
    setFormData(prev => {
      const newReferences = [...prev.purchaseOrder.references];
      newReferences[index] = { ...newReferences[index], [field]: value };
      return {
        ...prev,
        purchaseOrder: { ...prev.purchaseOrder, references: newReferences }
      };
    });
  };

  const handleLineItemChange = (index, field, value) => {
    setFormData(prev => {
      const newLineItems = [...prev.purchaseOrder.lineItems];
      newLineItems[index] = { ...newLineItems[index], [field]: value };
      return {
        ...prev,
        purchaseOrder: { ...prev.purchaseOrder, lineItems: newLineItems }
      };
    });
  };

  const addLineItem = () => {
    const newLineId = (formData.purchaseOrder.lineItems.length + 1).toString();
    setFormData(prev => ({
      ...prev,
      purchaseOrder: {
        ...prev.purchaseOrder,
        lineItems: [
          ...prev.purchaseOrder.lineItems,
          {
            purchaseOrderLineId: newLineId,
            quantity: '',
            unitPrice: '',
            supplierItemNum: '',
            itemDescription: ''
          }
        ]
      }
    }));
  };

  const removeLineItem = (index) => {
    if (formData.purchaseOrder.lineItems.length > 1) {
      setFormData(prev => ({
        ...prev,
        purchaseOrder: {
          ...prev.purchaseOrder,
          lineItems: prev.purchaseOrder.lineItems.filter((_, i) => i !== index)
        }
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filter out any line items with empty required fields
    const validLineItems = formData.purchaseOrder.lineItems.filter(item => 
      item.purchaseOrderLineId && 
      item.quantity && 
      item.unitPrice && 
      item.supplierItemNum && 
      item.itemDescription
    );

    if (validLineItems.length === 0) {
      alert('Please fill in at least one complete line item.');
      return;
    }

    // Check if any line items have incomplete data
    const incompleteItems = formData.purchaseOrder.lineItems.length - validLineItems.length;
    if (incompleteItems > 0) {
      const proceed = window.confirm(
        `Warning: ${incompleteItems} line item(s) have incomplete data and will not be included in the order.\n\n` +
        `Valid items to submit: ${validLineItems.length}\n` +
        `Incomplete items (will be skipped): ${incompleteItems}\n\n` +
        `Do you want to proceed?`
      );
      if (!proceed) {
        return;
      }
    }
    
    // Convert date from YYYY-MM-DD to YYYYMMDD format required by API
    const formattedDate = formData.purchaseOrder.poDate.replace(/-/g, '');
    
    // Transform to API format - using ONLY valid line items
    const payload = {
      B2BMessage: {
        Header: {
          ReceiverID: formData.header.receiverId,
          SenderID: formData.header.senderId,
          MessageType: formData.header.messageType,
          BusinessKey: formData.header.businessKey
        },
        Data: {
          PurchaseOrder: {
            POPurpose: formData.purchaseOrder.poPurpose,
            POType: formData.purchaseOrder.poType,
            PONumber: formData.purchaseOrder.poNumber,
            CustomerId: formData.purchaseOrder.customerId,
            CustomerName: formData.purchaseOrder.customerName,
            ContractNumber: formData.purchaseOrder.contractNumber,
            PODate: formattedDate,
            BillToCode: formData.purchaseOrder.billToCode,
            BuyerName: formData.purchaseOrder.buyerName,
            BuyerEmailAddress: formData.purchaseOrder.buyerEmailAddress,
            References: formData.purchaseOrder.references.map(ref => ({
              ReferenceType: ref.referenceType,
              ReferenceValue: ref.referenceValue
            })),
            OrderShipToLocation: {
              ShipToLocationName: formData.purchaseOrder.shipToLocation.shipToLocationName,
              ShipToLocationCode: formData.purchaseOrder.shipToLocation.shipToLocationCode,
              Address: {
                AddressLine1: formData.purchaseOrder.shipToLocation.addressLine1,
                AddressLine2: formData.purchaseOrder.shipToLocation.addressLine2 || null,
                City: formData.purchaseOrder.shipToLocation.city,
                State: formData.purchaseOrder.shipToLocation.state,
                PostalCode: formData.purchaseOrder.shipToLocation.postalCode,
                Country: formData.purchaseOrder.shipToLocation.country
              }
            },
            POLineItems: validLineItems.map(item => ({
              PurchaseOrderLineId: item.purchaseOrderLineId,
              Quantity: item.quantity,
              UnitPrice: item.unitPrice,
              SupplierItemNum: item.supplierItemNum,
              ItemDescription: item.itemDescription
            }))
          }
        }
      }
    };

    // Log payload for verification
    console.log('=== PAYLOAD VERIFICATION ===');
    console.log(`Total Line Items in Form: ${formData.purchaseOrder.lineItems.length}`);
    console.log(`Valid Line Items to Submit: ${validLineItems.length}`);
    console.log(`Incomplete Line Items (skipped): ${incompleteItems}`);
    console.log('Line Items Being Sent:', JSON.stringify(payload.B2BMessage.Data.PurchaseOrder.POLineItems, null, 2));
    console.log('Full Payload:', JSON.stringify(payload, null, 2));
    console.log('===========================');

    onSubmit(payload);
  };

  return (
    <form className="po-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <div className="section-header">
          <h2>Message Header</h2>
          <button 
            type="button" 
            className="collapse-btn" 
            onClick={() => toggleSection('header')}
            aria-label={collapsed.header ? "Expand section" : "Collapse section"}
          >
            {collapsed.header ? '▼' : '▲'}
          </button>
        </div>
        {!collapsed.header && (
          <div className="form-grid">
            <div className="form-group">
              <label>Receiver ID</label>
              <input
                type="text"
                value={formData.header.receiverId}
                onChange={(e) => handleHeaderChange('receiverId', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Sender ID</label>
              <input
                type="text"
                value={formData.header.senderId}
                onChange={(e) => handleHeaderChange('senderId', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Message Type</label>
              <input
                type="text"
                value={formData.header.messageType}
                onChange={(e) => handleHeaderChange('messageType', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Business Key</label>
              <input
                type="text"
                value={formData.header.businessKey}
                onChange={(e) => handleHeaderChange('businessKey', e.target.value)}
                required
              />
            </div>
          </div>
        )}
      </div>

      <div className="form-section">
        <h2>Purchase Order Details</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>PO Purpose</label>
            <input
              type="text"
              value={formData.purchaseOrder.poPurpose}
              onChange={(e) => handlePOChange('poPurpose', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>PO Type</label>
            <input
              type="text"
              value={formData.purchaseOrder.poType}
              onChange={(e) => handlePOChange('poType', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>PO Number</label>
            <input
              type="text"
              value={formData.purchaseOrder.poNumber}
              onChange={(e) => handlePOChange('poNumber', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Customer ID</label>
            <input
              type="text"
              value={formData.purchaseOrder.customerId}
              onChange={(e) => handlePOChange('customerId', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Customer Name</label>
            <input
              type="text"
              value={formData.purchaseOrder.customerName}
              onChange={(e) => handlePOChange('customerName', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Contract Number</label>
            <input
              type="text"
              value={formData.purchaseOrder.contractNumber}
              onChange={(e) => handlePOChange('contractNumber', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>PO Date</label>
            <input
              type="date"
              value={formData.purchaseOrder.poDate}
              onChange={(e) => handlePOChange('poDate', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Bill To Code</label>
            <input
              type="text"
              value={formData.purchaseOrder.billToCode}
              onChange={(e) => handlePOChange('billToCode', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Buyer Name</label>
            <input
              type="text"
              value={formData.purchaseOrder.buyerName}
              onChange={(e) => handlePOChange('buyerName', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Buyer Email</label>
            <input
              type="email"
              value={formData.purchaseOrder.buyerEmailAddress}
              onChange={(e) => handlePOChange('buyerEmailAddress', e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">
          <h2>References</h2>
          <button 
            type="button" 
            className="collapse-btn" 
            onClick={() => toggleSection('references')}
            aria-label={collapsed.references ? "Expand section" : "Collapse section"}
          >
            {collapsed.references ? '▼' : '▲'}
          </button>
        </div>
        {!collapsed.references && formData.purchaseOrder.references.map((ref, index) => (
          <div key={index} className="form-grid" style={{ marginBottom: '15px' }}>
            <div className="form-group">
              <label>Reference Type {index + 1}</label>
              <input
                type="text"
                value={ref.referenceType}
                onChange={(e) => handleReferenceChange(index, 'referenceType', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Reference Value {index + 1}</label>
              <input
                type="text"
                value={ref.referenceValue}
                onChange={(e) => handleReferenceChange(index, 'referenceValue', e.target.value)}
                required
              />
            </div>
          </div>
        ))}
      </div>

      <div className="form-section">
        <div className="section-header">
          <h2>Ship To Location</h2>
          <button 
            type="button" 
            className="collapse-btn" 
            onClick={() => toggleSection('shipTo')}
            aria-label={collapsed.shipTo ? "Expand section" : "Collapse section"}
          >
            {collapsed.shipTo ? '▼' : '▲'}
          </button>
        </div>
        {!collapsed.shipTo && (
          <div className="form-grid">
          <div className="form-group">
            <label>Location Name</label>
            <input
              type="text"
              value={formData.purchaseOrder.shipToLocation.shipToLocationName}
              onChange={(e) => handleShipToChange('shipToLocationName', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Location Code</label>
            <input
              type="text"
              value={formData.purchaseOrder.shipToLocation.shipToLocationCode}
              onChange={(e) => handleShipToChange('shipToLocationCode', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Address Line 1</label>
            <input
              type="text"
              value={formData.purchaseOrder.shipToLocation.addressLine1}
              onChange={(e) => handleShipToChange('addressLine1', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Address Line 2</label>
            <input
              type="text"
              value={formData.purchaseOrder.shipToLocation.addressLine2}
              onChange={(e) => handleShipToChange('addressLine2', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              value={formData.purchaseOrder.shipToLocation.city}
              onChange={(e) => handleShipToChange('city', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>State</label>
            <input
              type="text"
              value={formData.purchaseOrder.shipToLocation.state}
              onChange={(e) => handleShipToChange('state', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Postal Code</label>
            <input
              type="text"
              value={formData.purchaseOrder.shipToLocation.postalCode}
              onChange={(e) => handleShipToChange('postalCode', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Country</label>
            <input
              type="text"
              value={formData.purchaseOrder.shipToLocation.country}
              onChange={(e) => handleShipToChange('country', e.target.value)}
              required
            />
          </div>
        </div>
        )}
      </div>

      <div className="form-section">
        <div className="section-header">
          <h2>Line Items</h2>
          <button 
            type="button" 
            className="collapse-btn" 
            onClick={() => toggleSection('lineItems')}
            aria-label={collapsed.lineItems ? "Expand section" : "Collapse section"}
          >
            {collapsed.lineItems ? '▼' : '▲'}
          </button>
        </div>
        {!collapsed.lineItems && (
          <>
            {formData.purchaseOrder.lineItems.map((item, index) => (
              <div key={index} className="line-item-card">
                <div className="line-item-header">
                  <h3>Item {index + 1}</h3>
                  {formData.purchaseOrder.lineItems.length > 1 && (
                    <button
                      type="button"
                      className="remove-item-btn"
                      onClick={() => removeLineItem(index)}
                      aria-label={`Remove item ${index + 1}`}
                    >
                      ✕
                    </button>
                  )}
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Line ID</label>
                    <input
                      type="text"
                      value={item.purchaseOrderLineId}
                      onChange={(e) => handleLineItemChange(index, 'purchaseOrderLineId', e.target.value)}
                      placeholder="Enter line ID"
                    />
                  </div>
                  <div className="form-group">
                    <label>Quantity</label>
                    <input
                      type="text"
                      value={item.quantity}
                      onChange={(e) => handleLineItemChange(index, 'quantity', e.target.value)}
                      placeholder="Enter quantity"
                    />
                  </div>
                  <div className="form-group">
                    <label>Unit Price</label>
                    <input
                      type="text"
                      value={item.unitPrice}
                      onChange={(e) => handleLineItemChange(index, 'unitPrice', e.target.value)}
                      placeholder="Enter unit price"
                    />
                  </div>
                  <div className="form-group">
                    <label>Supplier Item Number</label>
                    <input
                      type="text"
                      value={item.supplierItemNum}
                      onChange={(e) => handleLineItemChange(index, 'supplierItemNum', e.target.value)}
                      placeholder="Enter supplier item #"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Item Description</label>
                    <input
                      type="text"
                      value={item.itemDescription}
                      onChange={(e) => handleLineItemChange(index, 'itemDescription', e.target.value)}
                      placeholder="Enter item description"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button 
              type="button" 
              className="add-item-btn"
              onClick={addLineItem}
            >
              + Add Line Item
            </button>
          </>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn">Submit Purchase Order</button>
      </div>
    </form>
  );
};

export default PurchaseOrderForm;

