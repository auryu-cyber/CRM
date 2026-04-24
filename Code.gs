// ============================================================
// CRM System - Main Entry Point
// Google Apps Script Web App
// ============================================================

var SPREADSHEET_ID = ''; // Set this after creating your spreadsheet

// Called when the web app URL is opened
function doGet(e) {
  var template = HtmlService.createTemplateFromFile('Index');
  template.user = getCurrentUser();
  return template.evaluate()
    .setTitle('CRM System')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// Include helper for HTML templates
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// Get current logged-in user info
function getCurrentUser() {
  try {
    var email = Session.getActiveUser().getEmail();
    var db = getDb();
    var usersSheet = db.getSheetByName('Users');
    if (!usersSheet) return { email: email, role: 'viewer', name: email, lang: 'ja' };
    var data = usersSheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][1] === email) {
        return { email: email, role: data[i][3], name: data[i][0], lang: data[i][4] || 'ja' };
      }
    }
    return { email: email, role: 'viewer', name: email, lang: 'ja' };
  } catch (e) {
    return { email: 'unknown', role: 'viewer', name: 'Guest', lang: 'ja' };
  }
}

// ---- CUSTOMER MANAGEMENT ----
function getCustomers() {
  return readSheet('Customers');
}

function saveCustomer(data) {
  if (data.id) {
    return updateRow('Customers', data);
  } else {
    data.id = generateId();
    data.createdAt = new Date().toISOString();
    data.createdBy = Session.getActiveUser().getEmail();
    return appendRow('Customers', data);
  }
}

function deleteCustomer(id) {
  return deleteRow('Customers', id);
}

// ---- ACTIVITY / CONTACT HISTORY ----
function getActivities(customerId) {
  var rows = readSheet('Activities');
  if (customerId) return rows.filter(function(r) { return r.customerId === customerId; });
  return rows;
}

function saveActivity(data) {
  if (data.id) {
    return updateRow('Activities', data);
  } else {
    data.id = generateId();
    data.createdAt = new Date().toISOString();
    data.createdBy = Session.getActiveUser().getEmail();
    return appendRow('Activities', data);
  }
}

function deleteActivity(id) {
  return deleteRow('Activities', id);
}

// ---- DEAL / RFQ MANAGEMENT ----
function getDeals(customerId) {
  var rows = readSheet('Deals');
  if (customerId) return rows.filter(function(r) { return r.customerId === customerId; });
  return rows;
}

function saveDeal(data) {
  if (data.id) {
    return updateRow('Deals', data);
  } else {
    data.id = generateId();
    data.createdAt = new Date().toISOString();
    data.createdBy = Session.getActiveUser().getEmail();
    return appendRow('Deals', data);
  }
}

function deleteDeal(id) {
  return deleteRow('Deals', id);
}

// ---- TASK / REMINDER ----
function getTasks(assignee) {
  var rows = readSheet('Tasks');
  if (assignee) return rows.filter(function(r) { return r.assignee === assignee; });
  return rows;
}

function saveTask(data) {
  if (data.id) {
    return updateRow('Tasks', data);
  } else {
    data.id = generateId();
    data.createdAt = new Date().toISOString();
    data.createdBy = Session.getActiveUser().getEmail();
    return appendRow('Tasks', data);
  }
}

function deleteTask(id) {
  return deleteRow('Tasks', id);
}

// ---- SALES TARGETS ----
function getSalesTargets() {
  return readSheet('SalesTargets');
}

function saveSalesTarget(data) {
  if (data.id) {
    return updateRow('SalesTargets', data);
  } else {
    data.id = generateId();
    return appendRow('SalesTargets', data);
  }
}

function deleteSalesTarget(id) {
  return deleteRow('SalesTargets', id);
}

// ---- USERS ----
function getUsers() {
  var user = getCurrentUser();
  if (user.role !== 'admin') throw new Error('Permission denied');
  return readSheet('Users');
}

function saveUser(data) {
  var user = getCurrentUser();
  if (user.role !== 'admin') throw new Error('Permission denied');
  if (data.id) {
    return updateRow('Users', data);
  } else {
    data.id = generateId();
    data.createdAt = new Date().toISOString();
    return appendRow('Users', data);
  }
}

function deleteUser(id) {
  var user = getCurrentUser();
  if (user.role !== 'admin') throw new Error('Permission denied');
  return deleteRow('Users', id);
}

// ---- DASHBOARD DATA ----
function getDashboardData() {
  var customers = readSheet('Customers');
  var deals = readSheet('Deals');
  var tasks = readSheet('Tasks');
  var activities = readSheet('Activities');
  var targets = readSheet('SalesTargets');

  var now = new Date();
  var thisMonth = now.getMonth();
  var thisYear = now.getFullYear();

  // Won deals this month
  var wonDeals = deals.filter(function(d) {
    if (d.stage !== 'Won') return false;
    var date = new Date(d.closedDate || d.createdAt);
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
  });

  var wonAmount = wonDeals.reduce(function(sum, d) {
    return sum + (parseFloat(d.amount) || 0);
  }, 0);

  // Pipeline amount (open deals)
  var pipelineAmount = deals.filter(function(d) {
    return d.stage !== 'Won' && d.stage !== 'Lost';
  }).reduce(function(sum, d) {
    return sum + (parseFloat(d.amount) || 0);
  }, 0);

  // Overdue tasks
  var overdueTasks = tasks.filter(function(t) {
    if (t.status === 'Done') return false;
    return t.dueDate && new Date(t.dueDate) < now;
  });

  // Monthly target
  var currentTarget = targets.find(function(t) {
    return parseInt(t.year) === thisYear && parseInt(t.month) === (thisMonth + 1);
  });

  // Deals by stage
  var stageCount = {};
  deals.forEach(function(d) {
    stageCount[d.stage] = (stageCount[d.stage] || 0) + 1;
  });

  // Recent activities
  var recentActivities = activities
    .sort(function(a, b) { return new Date(b.createdAt) - new Date(a.createdAt); })
    .slice(0, 5);

  return {
    totalCustomers: customers.length,
    wonAmountThisMonth: wonAmount,
    pipelineAmount: pipelineAmount,
    overdueTaskCount: overdueTasks.length,
    monthlyTarget: currentTarget ? parseFloat(currentTarget.targetAmount) : 0,
    stageCount: stageCount,
    recentActivities: recentActivities,
    openDeals: deals.filter(function(d) { return d.stage !== 'Won' && d.stage !== 'Lost'; }).length
  };
}

// ---- REPORT DATA ----
function getReportData(params) {
  params = params || {};
  var deals = readSheet('Deals');
  var customers = readSheet('Customers');
  var targets = readSheet('SalesTargets');

  var year = params.year || new Date().getFullYear();

  // Monthly sales (won deals grouped by month)
  var monthlySales = {};
  for (var m = 1; m <= 12; m++) monthlySales[m] = 0;

  deals.forEach(function(d) {
    if (d.stage !== 'Won') return;
    var date = new Date(d.closedDate || d.createdAt);
    if (date.getFullYear() !== parseInt(year)) return;
    var month = date.getMonth() + 1;
    monthlySales[month] = (monthlySales[month] || 0) + (parseFloat(d.amount) || 0);
  });

  // Monthly targets
  var monthlyTargets = {};
  targets.filter(function(t) { return parseInt(t.year) === parseInt(year); })
    .forEach(function(t) { monthlyTargets[parseInt(t.month)] = parseFloat(t.targetAmount) || 0; });

  // Sales by customer
  var salesByCustomer = {};
  deals.filter(function(d) { return d.stage === 'Won'; }).forEach(function(d) {
    salesByCustomer[d.customerId] = (salesByCustomer[d.customerId] || 0) + (parseFloat(d.amount) || 0);
  });

  var topCustomers = Object.keys(salesByCustomer).map(function(id) {
    var c = customers.find(function(c) { return c.id === id; }) || {};
    return { name: c.companyName || id, amount: salesByCustomer[id] };
  }).sort(function(a, b) { return b.amount - a.amount; }).slice(0, 10);

  // Win rate
  var closedDeals = deals.filter(function(d) { return d.stage === 'Won' || d.stage === 'Lost'; });
  var winRate = closedDeals.length > 0
    ? Math.round(deals.filter(function(d) { return d.stage === 'Won'; }).length / closedDeals.length * 100)
    : 0;

  return {
    year: year,
    monthlySales: monthlySales,
    monthlyTargets: monthlyTargets,
    topCustomers: topCustomers,
    winRate: winRate,
    totalDeals: deals.length,
    wonDeals: deals.filter(function(d) { return d.stage === 'Won'; }).length
  };
}

// ---- SETUP ----
function setupSpreadsheet() {
  var ss = SpreadsheetApp.create('CRM Database');
  SPREADSHEET_ID = ss.getId();

  var sheetsConfig = {
    'Customers': ['id','companyName','contactName','email','phone','industry','country','status','assignedTo','notes','createdAt','createdBy'],
    'Activities': ['id','customerId','type','subject','description','contactName','activityDate','createdAt','createdBy'],
    'Deals': ['id','customerId','title','amount','currency','stage','probability','closedDate','assignedTo','notes','rfqNumber','createdAt','createdBy'],
    'Tasks': ['id','title','description','dueDate','priority','status','assignee','relatedId','relatedType','createdAt','createdBy'],
    'SalesTargets': ['id','year','month','targetAmount','currency','assignee','notes'],
    'Users': ['name','email','department','role','lang','createdAt']
  };

  // Remove default Sheet1
  var defaultSheet = ss.getSheetByName('Sheet1');

  Object.keys(sheetsConfig).forEach(function(name) {
    var sheet = ss.insertSheet(name);
    sheet.getRange(1, 1, 1, sheetsConfig[name].length).setValues([sheetsConfig[name]]);
    sheet.getRange(1, 1, 1, sheetsConfig[name].length)
      .setBackground('#1a73e8')
      .setFontColor('#ffffff')
      .setFontWeight('bold');
    sheet.setFrozenRows(1);
  });

  if (defaultSheet) ss.deleteSheet(defaultSheet);

  // Add current user as admin
  var adminEmail = Session.getActiveUser().getEmail();
  var usersSheet = ss.getSheetByName('Users');
  usersSheet.appendRow(['Admin', adminEmail, 'Administration', 'admin', 'ja', new Date().toISOString()]);

  // Add sample data
  addSampleData(ss);

  // Save ID to script properties
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', ss.getId());

  return { success: true, spreadsheetId: ss.getId(), url: ss.getUrl() };
}

function addSampleData(ss) {
  var now = new Date().toISOString();
  var customersSheet = ss.getSheetByName('Customers');
  var sampleCustomers = [
    [generateId(), 'Thai Auto Parts Co., Ltd.', 'Somchai Wongsawat', 'somchai@thaiautop.co.th', '+66-2-555-1234', 'Automotive', 'Thailand', 'Active', 'admin@example.com', 'Major supplier of automotive components', now, 'admin@example.com'],
    [generateId(), 'Japan Manufacturing Corp.', 'Hiroshi Tanaka', 'h.tanaka@jmc.co.jp', '+81-3-1234-5678', 'Manufacturing', 'Japan', 'Active', 'admin@example.com', 'Long-term partner since 2018', now, 'admin@example.com'],
    [generateId(), 'Bangkok Electronics Ltd.', 'Napat Srisuk', 'napat@bkkelec.co.th', '+66-2-888-9999', 'Electronics', 'Thailand', 'Active', 'admin@example.com', 'Electronics components buyer', now, 'admin@example.com'],
    [generateId(), 'Global Steel Works', 'David Chen', 'd.chen@globalsteel.com', '+1-555-234-5678', 'Steel', 'USA', 'Prospect', 'admin@example.com', 'Potential new customer', now, 'admin@example.com'],
    [generateId(), 'Osaka Precision Mfg.', 'Kenji Yamamoto', 'k.yamamoto@osaka-p.co.jp', '+81-6-9876-5432', 'Precision Parts', 'Japan', 'Active', 'admin@example.com', 'High precision component orders', now, 'admin@example.com']
  ];
  customersSheet.getRange(2, 1, sampleCustomers.length, sampleCustomers[0].length).setValues(sampleCustomers);

  var customerIds = sampleCustomers.map(function(r) { return r[0]; });

  var dealsSheet = ss.getSheetByName('Deals');
  var sampleDeals = [
    [generateId(), customerIds[0], 'Brake Pad Supply Q2', 250000, 'THB', 'Negotiation', 70, '2026-06-30', 'admin@example.com', 'Annual supply contract', 'RFQ-2026-001', now, 'admin@example.com'],
    [generateId(), customerIds[1], 'Engine Parts Export', 1200000, 'JPY', 'Proposal', 50, '2026-07-15', 'admin@example.com', 'Export 500 units', 'RFQ-2026-002', now, 'admin@example.com'],
    [generateId(), customerIds[2], 'PCB Assembly Order', 180000, 'THB', 'Won', 100, '2026-04-01', 'admin@example.com', 'Completed order', 'RFQ-2026-003', now, 'admin@example.com'],
    [generateId(), customerIds[3], 'Steel Beam Supply', 5000000, 'USD', 'Qualification', 20, '2026-09-30', 'admin@example.com', 'Large new deal', 'RFQ-2026-004', now, 'admin@example.com'],
    [generateId(), customerIds[4], 'CNC Parts Batch', 890000, 'JPY', 'Won', 100, '2026-03-15', 'admin@example.com', 'Repeat order', 'RFQ-2026-005', now, 'admin@example.com']
  ];
  dealsSheet.getRange(2, 1, sampleDeals.length, sampleDeals[0].length).setValues(sampleDeals);

  var activitiesSheet = ss.getSheetByName('Activities');
  var sampleActivities = [
    [generateId(), customerIds[0], 'Meeting', 'Q2 Contract Discussion', 'Reviewed terms and pricing for Q2 supply', 'Somchai Wongsawat', '2026-04-20', now, 'admin@example.com'],
    [generateId(), customerIds[1], 'Email', 'Proposal Sent', 'Sent detailed quotation for engine parts', 'Hiroshi Tanaka', '2026-04-18', now, 'admin@example.com'],
    [generateId(), customerIds[2], 'Call', 'Order Confirmed', 'PCB assembly order confirmed by phone', 'Napat Srisuk', '2026-04-15', now, 'admin@example.com'],
    [generateId(), customerIds[0], 'Visit', 'Factory Visit', 'Visited customer factory to review specs', 'Somchai Wongsawat', '2026-04-10', now, 'admin@example.com'],
    [generateId(), customerIds[4], 'Call', 'Follow-up Call', 'Follow-up on CNC batch delivery timeline', 'Kenji Yamamoto', '2026-04-08', now, 'admin@example.com']
  ];
  activitiesSheet.getRange(2, 1, sampleActivities.length, sampleActivities[0].length).setValues(sampleActivities);

  var tasksSheet = ss.getSheetByName('Tasks');
  var sampleTasks = [
    [generateId(), 'Send Q2 quotation to Thai Auto Parts', 'Prepare and send updated pricing', '2026-04-28', 'High', 'Open', 'admin@example.com', customerIds[0], 'Customer', now, 'admin@example.com'],
    [generateId(), 'Follow up Japan Mfg proposal', 'Call Hiroshi to confirm proposal receipt', '2026-04-26', 'High', 'Open', 'admin@example.com', customerIds[1], 'Customer', now, 'admin@example.com'],
    [generateId(), 'Prepare RFQ for Global Steel', 'Research market pricing for steel beams', '2026-05-05', 'Medium', 'Open', 'admin@example.com', customerIds[3], 'Customer', now, 'admin@example.com'],
    [generateId(), 'Monthly sales report', 'Compile April sales data', '2026-04-30', 'Medium', 'Open', 'admin@example.com', '', '', now, 'admin@example.com'],
    [generateId(), 'Update customer contacts in CRM', 'Verify all contact info is current', '2026-04-25', 'Low', 'Done', 'admin@example.com', '', '', now, 'admin@example.com']
  ];
  tasksSheet.getRange(2, 1, sampleTasks.length, sampleTasks[0].length).setValues(sampleTasks);

  var targetsSheet = ss.getSheetByName('SalesTargets');
  var months = [1,2,3,4,5,6,7,8,9,10,11,12];
  var targetAmounts = [500000,500000,600000,600000,700000,700000,600000,600000,700000,700000,800000,900000];
  var sampleTargets = months.map(function(m, i) {
    return [generateId(), 2026, m, targetAmounts[i], 'THB', 'all', ''];
  });
  targetsSheet.getRange(2, 1, sampleTargets.length, sampleTargets[0].length).setValues(sampleTargets);
}

// Utility: generate unique ID
function generateId() {
  return Utilities.getUuid();
}
