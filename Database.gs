// ============================================================
// Database.gs - Google Sheets CRUD Operations
// ============================================================

function getDb() {
  var id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) throw new Error('Spreadsheet not set up. Please run setupSpreadsheet() first.');
  return SpreadsheetApp.openById(id);
}

// Read all rows from a sheet, returns array of objects
function readSheet(sheetName) {
  try {
    var sheet = getDb().getSheetByName(sheetName);
    if (!sheet) return [];
    var data = sheet.getDataRange().getValues();
    if (data.length < 2) return [];
    var headers = data[0];
    return data.slice(1).filter(function(row) {
      return row[0] !== '' && row[0] !== null && row[0] !== undefined;
    }).map(function(row) {
      var obj = {};
      headers.forEach(function(h, i) {
        obj[h] = row[i];
      });
      return obj;
    });
  } catch (e) {
    Logger.log('readSheet error: ' + e.message);
    return [];
  }
}

// Append a new row to a sheet
function appendRow(sheetName, data) {
  try {
    var sheet = getDb().getSheetByName(sheetName);
    if (!sheet) throw new Error('Sheet not found: ' + sheetName);
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var row = headers.map(function(h) { return data[h] !== undefined ? data[h] : ''; });
    sheet.appendRow(row);
    return { success: true, id: data.id };
  } catch (e) {
    Logger.log('appendRow error: ' + e.message);
    return { success: false, error: e.message };
  }
}

// Update a row in a sheet by id
function updateRow(sheetName, data) {
  try {
    var sheet = getDb().getSheetByName(sheetName);
    if (!sheet) throw new Error('Sheet not found: ' + sheetName);
    var allData = sheet.getDataRange().getValues();
    var headers = allData[0];
    var idColIndex = headers.indexOf('id');
    if (idColIndex === -1) throw new Error('No id column in ' + sheetName);

    for (var i = 1; i < allData.length; i++) {
      if (allData[i][idColIndex] === data.id) {
        var row = headers.map(function(h) {
          return data[h] !== undefined ? data[h] : allData[i][headers.indexOf(h)];
        });
        sheet.getRange(i + 1, 1, 1, row.length).setValues([row]);
        return { success: true };
      }
    }
    return { success: false, error: 'Row not found' };
  } catch (e) {
    Logger.log('updateRow error: ' + e.message);
    return { success: false, error: e.message };
  }
}

// Delete a row from a sheet by id
function deleteRow(sheetName, id) {
  try {
    var sheet = getDb().getSheetByName(sheetName);
    if (!sheet) throw new Error('Sheet not found: ' + sheetName);
    var allData = sheet.getDataRange().getValues();
    var headers = allData[0];
    var idColIndex = headers.indexOf('id');
    if (idColIndex === -1) throw new Error('No id column in ' + sheetName);

    for (var i = 1; i < allData.length; i++) {
      if (allData[i][idColIndex] === id) {
        sheet.deleteRow(i + 1);
        return { success: true };
      }
    }
    return { success: false, error: 'Row not found' };
  } catch (e) {
    Logger.log('deleteRow error: ' + e.message);
    return { success: false, error: e.message };
  }
}

// Get a single row by id
function getRowById(sheetName, id) {
  var rows = readSheet(sheetName);
  return rows.find(function(r) { return r.id === id; }) || null;
}

// Search rows by field value
function searchRows(sheetName, field, value) {
  var rows = readSheet(sheetName);
  return rows.filter(function(r) {
    return String(r[field]).toLowerCase().indexOf(String(value).toLowerCase()) !== -1;
  });
}
