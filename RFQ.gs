// ============================================================
// RFQ.gs - RFQ Management + Import from Existing Spreadsheet
// Source SS: 1ayCujkiboQC52S8GAcdDXWEpSfoN1PBcInvKdF7cJRo
// Confirmed column structure from source:
//   ID | Date | Customer | Subcon | BU | FAC | Item | Color |
//   UnitPrice | UnitPriceUnit | GP% | GP | Consumption/month |
//   ConsumptionUnit | Potential% | 1stPO_Month | Revenue/month |
//   GP/month | Remark
// ============================================================

var SOURCE_SPREADSHEET_ID = '1ayCujkiboQC52S8GAcdDXWEpSfoN1PBcInvKdF7cJRo';
var SOURCE_RFQ_SHEET_NAME = 'RFQ';

// ---- GET RFQs ----
function getRFQs(params) {
  params = params || {};
  var rows = readSheet('RFQ');

  if (params.status && params.status !== 'all') {
    rows = rows.filter(function(r) { return r.status === params.status; });
  }
  if (params.search) {
    var q = String(params.search).toLowerCase();
    rows = rows.filter(function(r) {
      return (r.rfqNumber    || '').toLowerCase().indexOf(q) !== -1 ||
             (r.customerName || '').toLowerCase().indexOf(q) !== -1 ||
             (r.partName     || '').toLowerCase().indexOf(q) !== -1 ||
             (r.partNumber   || '').toLowerCase().indexOf(q) !== -1 ||
             (r.productType  || '').toLowerCase().indexOf(q) !== -1;
    });
  }
  rows.sort(function(a, b) {
    return new Date(b.requestDate || b.createdAt || 0) -
           new Date(a.requestDate || a.createdAt || 0);
  });
  return rows;
}

function getRFQById(id) { return getRowById('RFQ', id); }

// ---- SAVE RFQ ----
function saveRFQ(data) {
  var user = getCurrentUser();
  if (data.id) {
    data.updatedAt = new Date().toISOString();
    data.updatedBy = user.email;
    return updateRow('RFQ', data);
  }
  data.id          = generateId();
  data.rfqNumber   = data.rfqNumber || generateRFQNumber();
  data.createdAt   = new Date().toISOString();
  data.createdBy   = user.email;
  data.source      = data.source || 'manual';
  return appendRow('RFQ', data);
}

function deleteRFQ(id) { return deleteRow('RFQ', id); }

// ---- AUTO-INCREMENT RFQ NUMBER ----
function generateRFQNumber() {
  var rows  = readSheet('RFQ');
  var year  = new Date().getFullYear();
  var month = String(new Date().getMonth() + 1).padStart(2, '0');
  var seq   = rows.filter(function(r) {
    return String(r.rfqNumber || '').indexOf('RFQ-' + year) !== -1;
  }).length + 1;
  return 'RFQ-' + year + month + '-' + String(seq).padStart(3, '0');
}

// ---- RFQ STATS ----
function getRFQStats() {
  var rows = readSheet('RFQ');
  var now  = new Date();
  var tm   = now.getMonth();
  var ty   = now.getFullYear();
  var stats = { total: rows.length, open: 0, quoting: 0, submitted: 0,
                won: 0, lost: 0, totalRevenue: 0, byStatus: {}, byProductType: {} };

  rows.forEach(function(r) {
    var s = r.status || 'Open';
    stats.byStatus[s] = (stats.byStatus[s] || 0) + 1;
    if (s === 'Open')      stats.open++;
    else if (s === 'Quoting')   stats.quoting++;
    else if (s === 'Submitted') stats.submitted++;
    else if (s === 'Won')  { stats.won++;  stats.totalRevenue += parseFloat(r.revenuePerMonth || r.quotedAmount) || 0; }
    else if (s === 'Lost') stats.lost++;

    var pt = r.productType || 'Other';
    stats.byProductType[pt] = (stats.byProductType[pt] || 0) + 1;
  });

  var closed = stats.won + stats.lost;
  stats.winRate = closed > 0 ? Math.round(stats.won / closed * 100) : 0;
  return stats;
}

// ============================================================
// IMPORT FROM SOURCE SPREADSHEET
// ============================================================

// Step 1: Preview source data (called from UI before import)
function previewSourceRFQData() {
  try {
    var ss    = SpreadsheetApp.openById(SOURCE_SPREADSHEET_ID);
    var sheet = findRFQSheet(ss);
    if (!sheet) return { success: false, error: 'RFQ sheet not found. Available sheets: ' +
      ss.getSheets().map(function(s){ return s.getName(); }).join(', ') };

    var all     = sheet.getDataRange().getValues();
    if (all.length === 0) return { success: false, error: 'Sheet is empty' };

    // Detect header row (first row that has ≥ 5 non-empty cells)
    var headerRow = 0;
    for (var i = 0; i < Math.min(5, all.length); i++) {
      var filled = all[i].filter(function(c){ return c !== '' && c !== null; }).length;
      if (filled >= 5) { headerRow = i; break; }
    }

    var headers   = all[headerRow].map(function(h){ return String(h).trim(); });
    var dataRows  = all.slice(headerRow + 1).filter(function(r) {
      return r.some(function(c){ return c !== '' && c !== null; });
    });
    var preview   = dataRows.slice(0, 10);
    var mapping   = buildColumnMapping(headers);

    return {
      success:    true,
      sheetName:  sheet.getName(),
      headers:    headers,
      preview:    preview.map(function(r){ return r.map(function(c){ return String(c); }); }),
      totalRows:  dataRows.length,
      mapping:    mapping
    };
  } catch(e) {
    Logger.log('previewSourceRFQData: ' + e.message);
    return { success: false, error: e.message };
  }
}

// Find the RFQ sheet (tries exact name then partial match)
function findRFQSheet(ss) {
  var exact = ss.getSheetByName(SOURCE_RFQ_SHEET_NAME);
  if (exact) return exact;
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getName().toUpperCase().indexOf('RFQ') !== -1) return sheets[i];
  }
  // Fallback: sheet with the most data
  var best = null, maxRows = 0;
  sheets.forEach(function(s) {
    if (s.getLastRow() > maxRows) { maxRows = s.getLastRow(); best = s; }
  });
  return best;
}

// Build column index mapping based on confirmed source structure
function buildColumnMapping(headers) {
  var mapping = {};
  var norm    = headers.map(function(h){ return String(h).toLowerCase().trim(); });

  // Direct column name patterns (from confirmed structure)
  var patterns = {
    rfqNumber:       ['id','no','rfq','rfq no','rfq number','inquiry no','番号'],
    customerName:    ['customer','company','customer name','会社','顧客','บริษัท','ลูกค้า'],
    subcon:          ['subcon','sub-con','sub contractor'],
    productType:     ['bu','business unit','product','category','type','ประเภท'],
    factory:         ['fac','factory','site','plant','location'],
    partName:        ['item','part name','product name','description','品名','สินค้า'],
    partColor:       ['color','colour','สี'],
    unitPrice:       ['unitprice','unit price','price','ราคา','単価'],
    unitPriceUnit:   ['unitpriceunit','price unit','unit'],
    grossProfitPct:  ['gp%','gp %','gross profit %','margin%'],
    grossProfit:     ['gp','gross profit','margin'],
    quantity:        ['consumption/month','consumption','qty','quantity','จำนวน','数量','monthly volume'],
    consumptionUnit: ['consumptionunit','consumption unit','unit','หน่วย'],
    probability:     ['potential%','potential %','potential','probability','win rate','%'],
    closedDate:      ['1stpo_month','1st po','first po','po month','expected po','due date','ครบกำหนด'],
    revenuePerMonth: ['revenue/month','revenue per month','monthly revenue','monthly sales'],
    gpPerMonth:      ['gp/month','gp per month','monthly gp'],
    notes:           ['remark','note','notes','comment','หมายเหตุ','備考']
  };

  Object.keys(patterns).forEach(function(field) {
    var candidates = patterns[field];
    for (var i = 0; i < norm.length; i++) {
      for (var j = 0; j < candidates.length; j++) {
        if (norm[i] === candidates[j] || norm[i].indexOf(candidates[j]) !== -1) {
          if (mapping[field] === undefined) mapping[field] = i;
          break;
        }
      }
    }
  });

  return mapping;
}

// Step 2: Execute import
function importRFQFromSource() {
  try {
    var ss    = SpreadsheetApp.openById(SOURCE_SPREADSHEET_ID);
    var sheet = findRFQSheet(ss);
    if (!sheet) return { success: false, error: 'RFQ sheet not found' };

    var all = sheet.getDataRange().getValues();
    if (all.length < 2) return { success: false, error: 'No data rows found' };

    // Detect header row
    var headerRow = 0;
    for (var i = 0; i < Math.min(5, all.length); i++) {
      if (all[i].filter(function(c){ return c !== '' && c !== null; }).length >= 5) {
        headerRow = i; break;
      }
    }

    var headers  = all[headerRow].map(function(h){ return String(h).trim(); });
    var mapping  = buildColumnMapping(headers);
    var dataRows = all.slice(headerRow + 1);
    var user     = getCurrentUser();
    var imported = 0, skipped = 0;

    // Get existing IDs to avoid duplicates
    var existing     = readSheet('RFQ');
    var existingIds  = {};
    existing.forEach(function(r){ if(r.rfqNumber) existingIds[r.rfqNumber] = true; });

    dataRows.forEach(function(row) {
      // Skip fully empty rows
      if (row.every(function(c){ return c === '' || c === null || c === undefined; })) {
        skipped++; return;
      }

      function col(field) {
        var idx = mapping[field];
        if (idx === undefined || idx === null) return '';
        return (row[idx] !== undefined && row[idx] !== null) ? String(row[idx]).trim() : '';
      }

      var rfqNum = col('rfqNumber') || ('IMP-' + (imported + skipped + 1));

      // Skip duplicates
      if (existingIds[rfqNum]) { skipped++; return; }

      // Normalize potential% → probability + status
      var potRaw  = col('probability');
      var prob    = normalizeProbability(potRaw);
      var status  = normalizeStatusFromProbability(potRaw);

      var record = {
        id:              generateId(),
        rfqNumber:       rfqNum,
        customerName:    col('customerName'),
        customerId:      '',
        subcon:          col('subcon'),
        productType:     col('productType'),   // BU: TUBE, DIPPING, etc.
        factory:         col('factory'),        // FAC: LKB, GTW
        partName:        col('partName'),
        partColor:       col('partColor'),
        partNumber:      '',
        quantity:        col('quantity'),
        unit:            col('consumptionUnit') || col('unitPriceUnit') || 'pcs',
        unitPrice:       col('unitPrice'),
        unitPriceUnit:   col('unitPriceUnit'),
        grossProfitPct:  col('grossProfitPct'),
        grossProfit:     col('grossProfit'),
        probability:     prob,
        requestDate:     formatDateCell(col('rfqNumber') === rfqNum ? '' : ''), // use record date if available
        closedDate:      formatDateCell(col('closedDate')),
        quotedAmount:    col('unitPrice'),
        revenuePerMonth: col('revenuePerMonth'),
        gpPerMonth:      col('gpPerMonth'),
        currency:        'THB',
        status:          status,
        assignedTo:      user.email,
        notes:           col('notes'),
        source:          'imported',
        createdAt:       new Date().toISOString(),
        createdBy:       user.email
      };

      // Try to get date from the row (Date column)
      var dateVal = col('rfqNumber'); // headers may vary
      // Search for a date-looking value in the row
      for (var ci = 0; ci < row.length; ci++) {
        var cell = row[ci];
        if (cell instanceof Date) {
          record.requestDate = Utilities.formatDate(cell, 'Asia/Bangkok', 'yyyy-MM-dd');
          break;
        }
      }

      appendRow('RFQ', record);
      existingIds[rfqNum] = true;
      imported++;
    });

    return { success: true, imported: imported, skipped: skipped, total: dataRows.length };
  } catch(e) {
    Logger.log('importRFQFromSource: ' + e.message);
    return { success: false, error: e.message };
  }
}

// Map "Potential%" values to numeric probability
function normalizeProbability(raw) {
  if (!raw) return 30;
  var s = String(raw).toLowerCase().trim();
  if (s === 'focus')   return 80;
  if (s === 'closed')  return 100;
  var m = s.match(/(\d+)/);
  return m ? parseInt(m[1]) : 30;
}

// Map "Potential%" values to status
function normalizeStatusFromProbability(raw) {
  if (!raw) return 'Open';
  var s = String(raw).toLowerCase().trim();
  if (s === 'closed' || s === '100%' || s === '100') return 'Won';
  if (s === 'focus')    return 'Quoting';
  var m = s.match(/(\d+)/);
  if (m) {
    var pct = parseInt(m[1]);
    if (pct >= 100) return 'Won';
    if (pct >= 50)  return 'Quoting';
    if (pct > 0)    return 'Open';
  }
  return 'Open';
}

function formatDateCell(raw) {
  if (!raw || raw === '') return '';
  try {
    var d = new Date(raw);
    if (!isNaN(d.getTime())) return Utilities.formatDate(d, 'Asia/Bangkok', 'yyyy-MM-dd');
  } catch(e) {}
  return String(raw);
}

// Get all available sheet names in source spreadsheet
function getSourceSheetNames() {
  try {
    return SpreadsheetApp.openById(SOURCE_SPREADSHEET_ID)
      .getSheets().map(function(s){ return s.getName(); });
  } catch(e) {
    return [];
  }
}
