# CRM System - Technical Documentation

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   Web Browser                        │
│  (Frontend: HTML, CSS, JavaScript)                   │
│  ┌─────────────────────────────────────────────┐    │
│  │ Index.html (Main Layout & Template)         │    │
│  │ Stylesheet.html (CSS - Responsive Design)   │    │
│  │ JavaScript.html (UI Logic & Event Handler)  │    │
│  │ i18n.html (Language Translations)           │    │
│  └─────────────────────────────────────────────┘    │
│                        ↕ API Calls                    │
├─────────────────────────────────────────────────────┤
│            Google Apps Script Server                 │
│  ┌─────────────────────────────────────────────┐    │
│  │ Code.gs (API Endpoints & Business Logic)    │    │
│  │ Database.gs (CRUD Operations)               │    │
│  │ appsscript.json (Configuration & OAuth)     │    │
│  └─────────────────────────────────────────────┘    │
│                        ↕ Sheet Operations            │
├─────────────────────────────────────────────────────┤
│              Google Sheets Database                  │
│  ┌─────────────────────────────────────────────┐    │
│  │ Customers | Activities | Deals | Tasks ...  │    │
│  │ SalesTargets | Users                        │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

## File Structure & Responsibilities

### Backend (Google Apps Script)

#### `appsscript.json`
- **Purpose**: Manifest file that defines project configuration
- **Contains**:
  - OAuth scopes (permissions needed)
  - Runtime version (V8)
  - Webapp configuration
  - Time zone settings
- **Key Scopes**:
  - `https://www.googleapis.com/auth/spreadsheets` - Read/write Sheets
  - `https://www.googleapis.com/auth/drive` - Create/delete Sheets
  - `https://www.googleapis.com/auth/userinfo.email` - Get user email

#### `Code.gs`
- **Purpose**: Main backend entry point and API endpoints
- **Key Functions**:
  - `doGet(e)` - Web app entry point, serves HTML template
  - `getCurrentUser()` - Retrieves logged-in user info from Users sheet
  - `getCustomers()` - Fetches all customer records
  - `saveCustomer(data)` - Creates or updates customer
  - `deleteCustomer(id)` - Deletes customer
  - `getActivities(customerId)` - Fetches activity history
  - `saveActivity(data)` - Records new activity
  - `getDeals(customerId)` - Fetches sales opportunities
  - `saveDeal(data)` - Creates/updates deal
  - `getTasks(assignee)` - Fetches tasks
  - `saveTask(data)` - Creates/updates task
  - `getSalesTargets()` - Fetches monthly sales targets
  - `getDashboardData()` - Calculates KPIs for dashboard
  - `getReportData(params)` - Generates report analytics
  - `setupSpreadsheet()` - Creates database sheets and sample data
  - `addSampleData(ss)` - Populates initial sample data

#### `Database.gs`
- **Purpose**: Generic database abstraction layer
- **Key Functions**:
  - `getDb()` - Gets the main Spreadsheet object
  - `readSheet(sheetName)` - Reads all rows from a sheet as objects
  - `appendRow(sheetName, data)` - Adds new row
  - `updateRow(sheetName, data)` - Updates row by ID
  - `deleteRow(sheetName, id)` - Deletes row by ID
  - `getRowById(sheetName, id)` - Finds single row by ID
  - `searchRows(sheetName, field, value)` - Searches by field value

### Frontend (Browser)

#### `Index.html`
- **Purpose**: Main HTML template and layout structure
- **Contains**:
  - Sidebar navigation
  - Top header with user info
  - Language switcher (JA/EN/TH tabs)
  - Content area (dynamically filled by JavaScript)
  - Modal templates (form, confirm, setup)
  - Includes all other HTML files via `<?!= include() ?>`

#### `Stylesheet.html`
- **Purpose**: All CSS styling
- **Features**:
  - Mobile-first responsive design
  - CSS Variables for theming (colors, sizes, shadows)
  - Grid and flexbox layouts
  - Component styles (cards, buttons, forms, tables, modals)
  - Media queries for tablet and mobile
  - Animations and transitions
  - Dark theme ready (structure in place)

#### `JavaScript.html`
- **Purpose**: All client-side logic
- **Structure**:
  - Global `app` object (holds state)
  - `initApp(userData)` - Initialization on page load
  - `navigate(page)` - Page routing
  - Page render functions:
    - `renderDashboard()` - KPI dashboard
    - `renderCustomersPage()` - Customer list & CRUD
    - `renderActivitiesPage()` - Activity history
    - `renderDealsPage()` - Sales deals/RFQ
    - `renderTasksPage()` - Task management
    - `renderReportsPage()` - Sales analytics
    - `renderSalesTargetsPage()` - Target management
    - `renderUsersPage()` - User admin (admin only)
  - Form handlers:
    - `showCustomerForm(id)` - Opens customer form
    - `submitCustomerForm()` - Saves customer data
    - Similar patterns for Activities, Deals, Tasks, etc.
  - UI helpers:
    - `toggleSidebar()` - Mobile menu toggle
    - `showToast(msg, type)` - Notification
    - `showConfirm(msg, callback)` - Confirmation dialog
    - `formatDate(dateStr)` - Date formatting
    - `formatCurrency(amount)` - Currency formatting

#### `i18n.html`
- **Purpose**: Internationalization (language support)
- **Contains**:
  - Translation objects for JA / EN / TH
  - `I18N` global object with all strings
  - `currentLang` variable (current language)
  - `t(key)` function - Gets translated string
  - `setLang(lang)` - Changes language
  - `applyTranslations()` - Updates page labels
  - Stores language preference in localStorage

## Data Model

### Sheets & Columns

#### Customers
```
id | companyName | contactName | email | phone | industry | country | status | assignedTo | notes | createdAt | createdBy
```

#### Activities
```
id | customerId | type | subject | description | contactName | activityDate | createdAt | createdBy
```

#### Deals
```
id | customerId | title | amount | currency | stage | probability | closedDate | assignedTo | notes | rfqNumber | createdAt | createdBy
```

#### Tasks
```
id | title | description | dueDate | priority | status | assignee | relatedId | relatedType | createdAt | createdBy
```

#### SalesTargets
```
id | year | month | targetAmount | currency | assignee | notes
```

#### Users
```
name | email | department | role | lang | createdAt
```

## API Flow

### Example: Get Customers
```javascript
// Frontend (JavaScript.html)
google.script.run
  .withSuccessHandler(function(customers) {
    app.data.customers = customers;
    renderCustomersTable(customers);
  })
  .getCustomers();

// Backend (Code.gs)
function getCustomers() {
  return readSheet('Customers');  // Calls Database.gs
}

// Database (Database.gs)
function readSheet(sheetName) {
  var sheet = getDb().getSheetByName(sheetName);
  var data = sheet.getDataRange().getValues();
  // Convert to array of objects with headers as keys
  return data.slice(1).map(function(row) { ... });
}
```

## Authentication & Permissions

### How User Authentication Works
1. **Google OAuth**: Apps Script automatically uses Google's login
2. **Session.getActiveUser().getEmail()** - Gets current user's email
3. **Users Sheet Lookup**: Email matched against Users sheet to find role
4. **Role-Based Access**:
   - `admin` - Full access to all features
   - `manager` - Can view reports and dashboard
   - `sales` - Can input customer/activity/deal data
5. **Permission Checks**:
   - Some functions check user role (e.g., `if (user.role !== 'admin')`)

## Browser-side State Management

```javascript
var app = {
  user: { email, name, role, lang },
  currentPage: 'dashboard',
  data: {
    customers: [],
    activities: [],
    deals: [],
    tasks: [],
    salesTargets: [],
    users: [],
    dashboard: {}
  },
  formData: {},
  editingId: null  // For tracking which record is being edited
};
```

## Responsive Design Strategy

### Breakpoints
- **PC**: > 1024px
  - Sidebar always visible
  - Full table layouts
  - Large KPI cards in grid
- **Tablet**: 768px - 1024px
  - Sidebar toggleable
  - 2-column KPI grid
  - Adjusted spacing
- **Mobile**: < 768px
  - Sidebar collapses (hamburger menu)
  - 1-column layouts
  - Stacked forms
  - Bottom toast notifications

### Viewport Meta Tag
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

## Language Implementation

### Translation Flow
```
User clicks "EN" tab
  ↓
setLang('en') called
  ↓
currentLang = 'en'
  ↓
applyTranslations() scans DOM for [data-i18n] attributes
  ↓
el.textContent = t(key) looks up I18N['en'][key]
  ↓
Page re-renders if needed
```

### Adding New Translations
1. Add key-value pair to `I18N.ja`, `I18N.en`, `I18N.th`
2. Use in HTML: `<span data-i18n="myKey">Default Text</span>`
3. Or in JavaScript: `var label = t('myKey');`

## Common Patterns

### Creating a New Module/Page

1. **Add to Navigation** (Index.html):
```html
<button class="nav-item" data-page="mypage" onclick="navigate('mypage')">
  <span class="nav-icon">📄</span>
  <span data-i18n="myPageLabel">My Page</span>
</button>
```

2. **Add Translations** (i18n.html):
```javascript
var I18N = {
  ja: { myPageLabel: 'マイページ', ... },
  en: { myPageLabel: 'My Page', ... },
  th: { myPageLabel: 'หน้าของฉัน', ... }
};
```

3. **Add Page Renderer** (JavaScript.html):
```javascript
function renderMyPagePage() {
  setHeaderTitle(t('myPageLabel'));
  document.getElementById('pageContent').innerHTML = 'Page HTML here';
  // Fetch data and populate
}
```

4. **Add to Navigation Switch** (JavaScript.html):
```javascript
switch(page) {
  case 'mypage': renderMyPagePage(); break;
  // ...
}
```

5. **Add Backend API** (Code.gs):
```javascript
function getMyPageData() {
  return readSheet('MySheet');
}
```

## Performance Considerations

### Optimization Tips
1. **Data Caching**: `app.data` stores fetched data to avoid re-fetching
2. **Lazy Loading**: Data only loaded when page is visited
3. **Batch Reads**: Single `readSheet()` call returns all rows at once
4. **Sheet Size**: Can handle ~10,000 rows before noticeable slowdown
5. **Concurrent Users**: 5-10 simultaneous users work fine
6. **Large Files**: Keep Sheets under 50 MB for best performance

### Scaling Recommendations
- For > 50,000 rows: Consider Google Cloud SQL
- For > 20 concurrent users: Consider Cloud Functions
- For real-time sync: Consider Cloud Pub/Sub

## Error Handling

### Try-Catch in Database.gs
```javascript
try {
  var sheet = getDb().getSheetByName(sheetName);
  // operations
} catch (e) {
  Logger.log('readSheet error: ' + e.message);
  return [];
}
```

### User Feedback (Frontend)
```javascript
google.script.run
  .withFailureHandler(function(err) {
    showToast('Error: ' + err.message, 'error');
  })
  .getCustomers();
```

## Deployment Checklist

- [ ] All 7 files copied to Apps Script
- [ ] appsscript.json configured
- [ ] Project deployed as Web App
- [ ] Correct OAuth scopes granted
- [ ] Spreadsheet created via setup button
- [ ] Sample data visible in sheets
- [ ] Language switcher works
- [ ] Mobile view tested
- [ ] All CRUD operations tested
- [ ] Dashboard KPIs display correctly
- [ ] Team access configured

## Troubleshooting

### Issue: 403 Permission Denied
- **Cause**: appsscript.json scopes incorrect
- **Fix**: Grant all requested permissions in OAuth screen

### Issue: Data not saving
- **Cause**: Spreadsheet ID not saved in Script Properties
- **Fix**: Run setup button to create sheets first

### Issue: Slow performance
- **Cause**: Too many rows or large formulas in Sheets
- **Fix**: Archive old data to separate sheet

### Issue: Language not changing
- **Cause**: localStorage blocked or translation keys missing
- **Fix**: Check browser console for errors

## Future Enhancement Ideas

1. **Export to PDF/Excel**: Use Google Sheets API
2. **Email Notifications**: Apps Script MailApp
3. **Scheduled Reports**: Apps Script Triggers
4. **Multi-spreadsheet**: Support multiple databases
5. **Offline Mode**: Service Worker + IndexedDB
6. **Advanced Analytics**: Charts.js integration
7. **API Integration**: Slack, Salesforce, SAP
8. **Custom Fields**: Dynamic form builder
9. **Audit Log**: Track all changes
10. **2FA**: Additional security layer

---

**Last Updated**: 2026-04-24
**Version**: 1.0
**Author**: Claude Code
