# Reset Counter to 3443

If you need to reset the Salesforce Order Number counter so the next order will be **00003444**, follow these steps:

## Method 1: Browser Console (Recommended)

1. Open your browser at `http://localhost:3000`
2. Open Developer Tools (F12 or Right-click → Inspect)
3. Go to the **Console** tab
4. Paste this command and press Enter:

```javascript
localStorage.setItem('sf_order_counter', '3443');
console.log('✅ Counter reset to 3443 - Next order will be 00003444');
```

5. Refresh the page
6. Submit an order → It will be **00003444**

## Method 2: Application Storage (Chrome/Edge)

1. Open Developer Tools (F12)
2. Go to **Application** tab
3. In the left sidebar: **Storage** → **Local Storage** → `http://localhost:3000`
4. Find the key: `sf_order_counter`
5. Double-click the value and change it to: `3443`
6. Refresh the page

## Method 3: Clear All Storage

To completely reset and start fresh:

1. Open Developer Tools (F12)
2. Go to **Console** tab
3. Paste this command:

```javascript
localStorage.clear();
location.reload();
```

This will reset the counter to the default starting value (3443).

## Verify

After resetting, you can verify the current counter value:

```javascript
localStorage.getItem('sf_order_counter')
```

Should return: `"3443"`

Next order will be: **00003444**

## Current Configuration

- **Starting Number**: 3443
- **First Order**: 00003444
- **Second Order**: 00003445
- **And so on...**

