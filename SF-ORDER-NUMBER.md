# Salesforce Order Number Auto-Increment Feature

## Overview

The application now generates auto-incrementing Salesforce Order Numbers starting from **00003443**.

## How It Works

### Initial State
- First order submitted: `00003444`
- Second order submitted: `00003445`
- Third order submitted: `00003446`
- And so on...

### Number Format
- **8 digits** with leading zeros
- Examples: `00003344`, `00003345`, `00012345`
- Increments by 1 for each order

### Persistence
- Counter is stored in browser's **localStorage**
- Persists across:
  - Page refreshes
  - Browser restarts
  - App reloads
- Each browser maintains its own counter

## User Interface

### Counter Display
Located in the header when on the order form:
```
Next SF Order #: 00003344
```

Shows the number that will be assigned to the next order.

### Reset Counter Button
Red button next to the counter display that:
- Resets counter back to starting value (3343)
- Shows confirmation with next order number
- Useful for testing or resetting sequence

## Technical Details

### Implementation
```javascript
// Counter stored in localStorage
localStorage.setItem('sf_order_counter', '3343');

// Auto-increments on each order submission
counter++;  // 3343 → 3344

// Formats with leading zeros (8 digits)
orderNumber = counter.toString().padStart(8, '0');  // "00003344"
```

### Storage Key
- Key: `sf_order_counter`
- Default value: `3443`
- Type: Integer stored as string

## Usage Examples

### Normal Operation
```
Submit Order 1 → SF Order #: 00003444
Submit Order 2 → SF Order #: 00003445
Submit Order 3 → SF Order #: 00003446
```

### After Reset
```
Click "Reset Counter"
Submit Order → SF Order #: 00003444
```

### Multiple Browsers
Each browser maintains its own counter:
```
Chrome:  00003444, 00003445, 00003446...
Firefox: 00003444, 00003445, 00003446...
Safari:  00003444, 00003445, 00003446...
```

## Advanced: Setting Custom Starting Number

To change the starting number, modify `src/App.jsx`:

```javascript
const STARTING_NUMBER = 5000;  // Change this value
```

Then:
1. Clear localStorage: `localStorage.removeItem('sf_order_counter')`
2. Refresh the page
3. Next order will start from 5001

## Advanced: Reading Current Counter

Open browser console and run:
```javascript
localStorage.getItem('sf_order_counter')
```

## Advanced: Manually Setting Counter

Open browser console and run:
```javascript
localStorage.setItem('sf_order_counter', '9999')
```

Next order will be `00010000`.

## Production Considerations

### For Production Use
If deploying to production, consider:

1. **Backend Counter**: Store counter in database instead of localStorage
   - Ensures unique numbers across all users
   - Prevents duplicate order numbers
   - Maintains global sequence

2. **Server-Side Generation**: Generate numbers on the server
   - More secure
   - Can't be manipulated by users
   - Guaranteed uniqueness

3. **API Integration**: Get order numbers from Salesforce API
   - Use actual Salesforce order numbers
   - Maintains consistency with backend

### Current Implementation
The current localStorage approach is suitable for:
- ✅ Single user applications
- ✅ Development/testing
- ✅ Demo purposes
- ❌ Multi-user production environments (would cause duplicates)

## Testing

### Test Auto-Increment
1. Submit an order → Note the SF Order # (should be 00003444)
2. Click "Create New Order"
3. Submit another order → Should be 00003445
4. Refresh page
5. Submit another order → Should be 00003446

### Test Reset
1. Click "Reset Counter" button
2. Confirm alert shows "Next order will be 00003444"
3. Submit an order → Should be 00003444

### Test Persistence
1. Submit several orders
2. Close browser completely
3. Reopen application
4. Counter should continue from where it left off

## Summary

- ✅ Auto-increments starting from 00003443
- ✅ First order will be 00003444
- ✅ 8-digit format with leading zeros
- ✅ Persists across sessions (localStorage)
- ✅ Reset button for testing (resets to 3443)
- ✅ Simple and reliable for single-user use

