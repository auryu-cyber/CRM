// ============================================================
// Code.gs - CRM System Main Entry Point
// Google Apps Script Web App
// ============================================================

var SPREADSHEET_ID = '';

function doGet(e) {
  var template = HtmlService.createTemplateFromFile('Index');
  template.user = getCurrentUser();
  return template.evaluate()
    .setTitle('CRM System')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getCurrentUser() {
  try {
    var email = Session.getActiveUser().getEmail();
    var db = getDb();
    var usersSheet = db.getSheetByName('Users');
    if (!usersSheet) return { email: email, role: 'admin', name: email, lang: 'ja' };
    var data = usersSheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][1] === email) {
        return { email: email, role: data[i][3], name: data[i][0], lang: data[i][4] || 'ja' };
      }
    }
    // First-time: treat as admin
    return { email: email, role: 'admin', name: email.split('@')[0], lang: 'ja' };
  } catch (e) {
    return { email: 'unknown', role: 'admin', name: 'Guest', lang: 'ja' };
  }
}

// ---- CUSTOMER MANAGEMENT ----
function getCustomers() { return readSheet('Customers'); }
function saveCustomer(data) {
  if (data.id) { return updateRow('Customers', data); }
  data.id = generateId();
  data.createdAt = new Date().toISOString();
  data.createdBy = Session.getActiveUser().getEmail();
  return appendRow('Customers', data);
}
function deleteCustomer(id) { return deleteRow('Customers', id); }

// ---- ACTIVITY / CONTACT HISTORY ----
function getActivities(customerId) {
  var rows = readSheet('Activities');
  if (customerId) return rows.filter(function(r) { return r.customerId === customerId; });
  return rows;
}
function saveActivity(data) {
  if (data.id) { return updateRow('Activities', data); }
  data.id = generateId();
  data.createdAt = new Date().toISOString();
  data.createdBy = Session.getActiveUser().getEmail();
  return appendRow('Activities', data);
}
function deleteActivity(id) { return deleteRow('Activities', id); }

// ---- DEAL MANAGEMENT ----
function getDeals(customerId) {
  var rows = readSheet('Deals');
  if (customerId) return rows.filter(function(r) { return r.customerId === customerId; });
  return rows;
}
function saveDeal(data) {
  if (data.id) { return updateRow('Deals', data); }
  data.id = generateId();
  data.createdAt = new Date().toISOString();
  data.createdBy = Session.getActiveUser().getEmail();
  return appendRow('Deals', data);
}
function deleteDeal(id) { return deleteRow('Deals', id); }

// ---- TASK / REMINDER ----
function getTasks(assignee) {
  var rows = readSheet('Tasks');
  if (assignee) return rows.filter(function(r) { return r.assignee === assignee; });
  return rows;
}
function saveTask(data) {
  if (data.id) { return updateRow('Tasks', data); }
  data.id = generateId();
  data.createdAt = new Date().toISOString();
  data.createdBy = Session.getActiveUser().getEmail();
  return appendRow('Tasks', data);
}
function deleteTask(id) { return deleteRow('Tasks', id); }

// ---- SALES TARGETS ----
function getSalesTargets() { return readSheet('SalesTargets'); }
function saveSalesTarget(data) {
  if (data.id) { return updateRow('SalesTargets', data); }
  data.id = generateId();
  return appendRow('SalesTargets', data);
}
function deleteSalesTarget(id) { return deleteRow('SalesTargets', id); }

// ---- USERS ----
function getUsers() {
  var user = getCurrentUser();
  if (user.role !== 'admin') throw new Error('Permission denied');
  return readSheet('Users');
}
function saveUser(data) {
  var user = getCurrentUser();
  if (user.role !== 'admin') throw new Error('Permission denied');
  if (data.id) { return updateRow('Users', data); }
  data.id = generateId();
  data.createdAt = new Date().toISOString();
  return appendRow('Users', data);
}
function deleteUser(id) {
  var user = getCurrentUser();
  if (user.role !== 'admin') throw new Error('Permission denied');
  return deleteRow('Users', id);
}

// ---- DASHBOARD DATA (includes RFQ) ----
function getDashboardData() {
  var customers  = readSheet('Customers');
  var deals      = readSheet('Deals');
  var tasks      = readSheet('Tasks');
  var activities = readSheet('Activities');
  var targets    = readSheet('SalesTargets');
  var rfqs       = readSheet('RFQ');

  var now = new Date();
  var thisMonth = now.getMonth();
  var thisYear  = now.getFullYear();

  var wonDeals = deals.filter(function(d) {
    if (d.stage !== 'Won') return false;
    var date = new Date(d.closedDate || d.createdAt);
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
  });
  var wonAmount = wonDeals.reduce(function(s, d) { return s + (parseFloat(d.amount) || 0); }, 0);

  var pipelineAmount = deals.filter(function(d) {
    return d.stage !== 'Won' && d.stage !== 'Lost';
  }).reduce(function(s, d) { return s + (parseFloat(d.amount) || 0); }, 0);

  var overdueTasks = tasks.filter(function(t) {
    return t.status !== 'Done' && t.dueDate && new Date(t.dueDate) < now;
  });

  var currentTarget = targets.find(function(t) {
    return parseInt(t.year) === thisYear && parseInt(t.month) === (thisMonth + 1);
  });

  var stageCount = {};
  deals.forEach(function(d) { stageCount[d.stage] = (stageCount[d.stage] || 0) + 1; });

  var recentActivities = activities
    .sort(function(a, b) { return new Date(b.createdAt) - new Date(a.createdAt); })
    .slice(0, 5);

  var rfqStats = {
    total: rfqs.length,
    open: rfqs.filter(function(r) { return r.status === 'Open'; }).length,
    quoting: rfqs.filter(function(r) { return r.status === 'Quoting'; }).length,
    won: rfqs.filter(function(r) { return r.status === 'Won'; }).length,
    thisMonth: rfqs.filter(function(r) {
      var d = new Date(r.requestDate || r.createdAt);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length
  };

  return {
    totalCustomers: customers.length,
    wonAmountThisMonth: wonAmount,
    pipelineAmount: pipelineAmount,
    overdueTaskCount: overdueTasks.length,
    monthlyTarget: currentTarget ? parseFloat(currentTarget.targetAmount) : 0,
    stageCount: stageCount,
    recentActivities: recentActivities,
    openDeals: deals.filter(function(d) { return d.stage !== 'Won' && d.stage !== 'Lost'; }).length,
    rfqStats: rfqStats
  };
}

// ---- REPORT DATA ----
function getReportData(params) {
  params = params || {};
  var deals     = readSheet('Deals');
  var customers = readSheet('Customers');
  var targets   = readSheet('SalesTargets');
  var year = params.year || new Date().getFullYear();

  var monthlySales = {};
  for (var m = 1; m <= 12; m++) monthlySales[m] = 0;
  deals.forEach(function(d) {
    if (d.stage !== 'Won') return;
    var date = new Date(d.closedDate || d.createdAt);
    if (date.getFullYear() !== parseInt(year)) return;
    monthlySales[date.getMonth() + 1] += (parseFloat(d.amount) || 0);
  });

  var monthlyTargets = {};
  targets.filter(function(t) { return parseInt(t.year) === parseInt(year); })
    .forEach(function(t) { monthlyTargets[parseInt(t.month)] = parseFloat(t.targetAmount) || 0; });

  var salesByCustomer = {};
  deals.filter(function(d) { return d.stage === 'Won'; }).forEach(function(d) {
    salesByCustomer[d.customerId] = (salesByCustomer[d.customerId] || 0) + (parseFloat(d.amount) || 0);
  });
  var topCustomers = Object.keys(salesByCustomer).map(function(id) {
    var c = customers.find(function(c) { return c.id === id; }) || {};
    return { name: c.companyName || id, amount: salesByCustomer[id] };
  }).sort(function(a, b) { return b.amount - a.amount; }).slice(0, 10);

  var closedDeals = deals.filter(function(d) { return d.stage === 'Won' || d.stage === 'Lost'; });
  var winRate = closedDeals.length > 0
    ? Math.round(deals.filter(function(d) { return d.stage === 'Won'; }).length / closedDeals.length * 100)
    : 0;

  return {
    year: year, monthlySales: monthlySales, monthlyTargets: monthlyTargets,
    topCustomers: topCustomers, winRate: winRate,
    totalDeals: deals.length,
    wonDeals: deals.filter(function(d) { return d.stage === 'Won'; }).length
  };
}

// ---- SETUP SPREADSHEET (creates all sheets including RFQ) ----
function setupSpreadsheet() {
  var ss = SpreadsheetApp.create('CRM Database');

  var sheetsConfig = {
    'RFQ': ['id','rfqNumber','customerName','customerId','partName','partNumber',
             'quantity','unit','requestDate','dueDate','quotedDate','quotedAmount',
             'currency','status','assignedTo','notes','source','createdAt','createdBy',
             'updatedAt','updatedBy'],
    'Customers': ['id','companyName','contactName','email','phone','industry',
                  'country','status','assignedTo','notes','createdAt','createdBy'],
    'Activities': ['id','customerId','type','subject','description','contactName',
                   'activityDate','createdAt','createdBy'],
    'Deals': ['id','customerId','title','amount','currency','stage','probability',
              'closedDate','assignedTo','notes','rfqNumber','createdAt','createdBy'],
    'Tasks': ['id','title','description','dueDate','priority','status','assignee',
              'relatedId','relatedType','createdAt','createdBy'],
    'SalesTargets': ['id','year','month','targetAmount','currency','assignee','notes'],
    'Users': ['id','name','email','department','role','lang','createdAt']
  };

  var headerColors = {
    'RFQ': '#137333',
    'Customers': '#1a73e8',
    'Activities': '#7b1fa2',
    'Deals': '#e37400',
    'Tasks': '#c5221f',
    'SalesTargets': '#1565c0',
    'Users': '#37474f'
  };

  var defaultSheet = ss.getSheetByName('Sheet1');

  Object.keys(sheetsConfig).forEach(function(name) {
    var sheet = ss.insertSheet(name);
    var cols = sheetsConfig[name];
    sheet.getRange(1, 1, 1, cols.length).setValues([cols]);
    sheet.getRange(1, 1, 1, cols.length)
      .setBackground(headerColors[name] || '#1a73e8')
      .setFontColor('#ffffff')
      .setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 200);
  });

  if (defaultSheet) ss.deleteSheet(defaultSheet);

  var adminEmail = Session.getActiveUser().getEmail();
  var usersSheet = ss.getSheetByName('Users');
  usersSheet.appendRow([generateId(), 'Admin', adminEmail, 'Administration', 'admin', 'ja', new Date().toISOString()]);

  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', ss.getId());

  return { success: true, spreadsheetId: ss.getId(), url: ss.getUrl() };
}

function generateId() {
  return Utilities.getUuid();
}
