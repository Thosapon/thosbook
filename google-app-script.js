function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'getCategories') {
    return responseJSON(getRowsData('Categories'));
  } else if (action === 'getBookmarks') {
    return responseJSON(getRowsData('Bookmarks'));
  }
  return responseJSON({ status: 'error', message: 'Invalid GET action' });
}

function doPost(e) {
  try {
    const contents = JSON.parse(e.postData.contents);
    const action = contents.action;

    if (action === 'login') {
      const users = getRowsData('Users');
      const user = users.find(u => u.username === contents.username && u.password === contents.password);
      if (user) {
        return responseJSON({ 
          status: 'success', 
          user: { id: user.id, name: user.name, username: user.username, role: user.role || 'viewer' } 
        });
      }
      return responseJSON({ status: 'error', message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }

    if (action === 'addBookmark') {
      return responseJSON(appendRowData('Bookmarks', contents.data));
    } else if (action === 'updateBookmark') {
      return responseJSON(updateRowData('Bookmarks', contents.id, contents.data));
    } else if (action === 'deleteBookmark') {
      return responseJSON(deleteRowData('Bookmarks', contents.id));
    } else if (action === 'addCategory') {
      return responseJSON(appendRowData('Categories', contents.data));
    } else if (action === 'updateCategory') {
      return responseJSON(updateRowData('Categories', contents.id, contents.data));
    } else if (action === 'deleteCategory') {
      return responseJSON(deleteRowData('Categories', contents.id));
    }

    return responseJSON({ status: 'error', message: 'Invalid Action' });
  } catch (error) {
    return responseJSON({ status: 'error', message: error.toString() });
  }
}

function getRowsData(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  const headers = data[0];
  const rows = data.slice(1);
  
  return rows.map(row => {
    let obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
}

function appendRowData(sheetName, rowObj) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const headers = sheet.getDataRange().getValues()[0];
  const newRow = headers.map(header => rowObj[header] || '');
  sheet.appendRow(newRow);
  return { status: 'success' };
}

function updateRowData(sheetName, id, rowObj) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id) {
      headers.forEach((header, colIdx) => {
        if (rowObj[header] !== undefined) {
          sheet.getRange(i + 1, colIdx + 1).setValue(rowObj[header]);
        }
      });
      return { status: 'success' };
    }
  }
  return { status: 'error', message: 'Record not found' };
}

function deleteRowData(sheetName, id) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id) {
      sheet.deleteRow(i + 1);
      return { status: 'success' };
    }
  }
  return { status: 'error', message: 'Record not found' };
}

function responseJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}