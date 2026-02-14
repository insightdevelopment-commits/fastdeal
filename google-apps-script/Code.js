// Google Apps Script Code for FastDeal Waitlist

/*
 * IMPORTANT: If you see "Cannot read properties of null", it means the script is not connected to the sheet.
 * OPTION 1: Create the script from the Google Sheet (Extensions > Apps Script).
 * OPTION 2: Paste your Spreadsheet ID below.
 * 
 * Your Spreadsheet ID is in the URL: https://docs.google.com/spreadsheets/d/THIS_PART_IS_THE_ID/edit
 */
const SPREADSHEET_ID = ''; // Keep empty if script is created from the Sheet (Extensions > Apps Script) 

function getSpreadsheet() {
    if (SPREADSHEET_ID) {
        return SpreadsheetApp.openById(SPREADSHEET_ID);
    }
    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        if (!ss) throw new Error("No active spreadsheet");
        return ss;
    } catch (e) {
        throw new Error("Script is NOT bound to a sheet. Please copy the Spreadsheet ID from the URL and paste it into the 'SPREADSHEET_ID' variable at the top of the script.");
    }
}

function doGet(e) {
    return ContentService.createTextOutput("FastDeal Waitlist API Active. Please use POST requests.");
}

function doPost(e) {
    const lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        logToSheet('Incoming Request: ' + JSON.stringify(e));

        const ss = getSpreadsheet();
        let sheet = ss.getSheetByName('Waitlist');
        if (!sheet) {
            ss.insertSheet('Waitlist');
            sheet = ss.getSheetByName('Waitlist');
            const headers = ['Timestamp', 'Email', 'First Name', 'User Type', 'Status', 'Token', 'Queue Position'];
            sheet.appendRow(headers);
        }

        const params = e.parameter;
        const action = params.action;

        if (action === 'register') {
            return handleRegister(params, sheet);
        } else if (action === 'verifyCode') {
            return handleVerifyCode(params, sheet);
        } else if (action === 'checkStatus') {
            const result = handleCheckStatus(params, sheet);
            return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
        } else if (action === 'getCount') {
            return handleGetCount(sheet);
        } else {
            return ContentService.createTextOutput(JSON.stringify({ result: 'error', message: 'Invalid action' })).setMimeType(ContentService.MimeType.JSON);
        }

    } catch (e) {
        logToSheet('Error in doPost: ' + e.toString());
        return ContentService.createTextOutput(JSON.stringify({ result: 'error', message: e.toString() })).setMimeType(ContentService.MimeType.JSON);
    } finally {
        lock.releaseLock();
    }
}

function logToSheet(message) {
    try {
        const ss = getSpreadsheet();
        let sheet = ss.getSheetByName('DebugLogs');
        if (!sheet) {
            ss.insertSheet('DebugLogs');
            sheet = ss.getSheetByName('DebugLogs');
            sheet.appendRow(['Timestamp', 'Message']);
        }
        sheet.appendRow([new Date(), message]);
    } catch (e) {
        // Fallback or ignore
    }
}

function handleRegister(params, sheet) {
    const email = params.email.toLowerCase().trim();
    const firstName = params.firstName || '';
    const userType = params.userType || 'Personal Shopper';

    logToSheet('Registering: ' + email);

    // 1. Check if ALREADY in Waitlist (Duplicate)
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
        if (data[i][1] === email) { // Email is column B (index 1)
            const queuePos = data[i][6] || (i + 1); // Use stored pos or row index
            logToSheet('Duplicate registration attempt: ' + email);
            return ContentService.createTextOutput(JSON.stringify({
                result: 'duplicate',
                row: queuePos,
                message: 'You are already on the waitlist!'
            })).setMimeType(ContentService.MimeType.JSON);
        }
    }

    // 2. Store Pending Registration in Script Properties (Not Sheet yet)
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const pendingData = {
        token: token,
        firstName: firstName,
        userType: userType,
        timestamp: new Date().toISOString()
    };

    // Store temporarily (overwrite if exists to allow retries)
    PropertiesService.getScriptProperties().setProperty('PENDING_' + email, JSON.stringify(pendingData));
    logToSheet('Stored PENDING property for: ' + email);

    // 3. Send Verification Email
    sendVerificationEmail(email, token, firstName);

    return ContentService.createTextOutput(JSON.stringify({ result: 'verification_sent' })).setMimeType(ContentService.MimeType.JSON);
}

function handleVerifyCode(params, sheet) {
    const email = params.email ? params.email.toLowerCase().trim() : '';
    const code = params.code ? params.code.trim() : '';

    logToSheet('Verifying: ' + email + ' with code: ' + code);

    if (!email || !code) {
        return ContentService.createTextOutput(JSON.stringify({ result: 'error', message: 'Missing email or code' })).setMimeType(ContentService.MimeType.JSON);
    }

    // 1. Check Pending Registrations first
    const pendingJson = PropertiesService.getScriptProperties().getProperty('PENDING_' + email);
    logToSheet('Pending Data Found: ' + (pendingJson ? 'YES' : 'NO'));

    if (pendingJson) {
        const pendingData = JSON.parse(pendingJson);

        if (pendingData.token === code) {
            // SUCCESS! Move to Sheet
            const timestamp = new Date();
            // Queue Position = Current Rows (excluding header) + 1000 base
            // actually just row index + 1000
            const queuePosition = sheet.getLastRow() + 1000;
            logToSheet('Verification Success! Appending to row: ' + (sheet.getLastRow() + 1));

            sheet.appendRow([
                timestamp,
                email,
                pendingData.firstName,
                pendingData.userType,
                'Verified',
                code,
                queuePosition
            ]);

            // Clear pending status
            PropertiesService.getScriptProperties().deleteProperty('PENDING_' + email);

            return ContentService.createTextOutput(JSON.stringify({ result: 'success', row: queuePosition })).setMimeType(ContentService.MimeType.JSON);
        } else {
            logToSheet('Invalid Code. Expected: ' + pendingData.token + ', Got: ' + code);
            return ContentService.createTextOutput(JSON.stringify({ result: 'error', message: 'Invalid code. Please try again.' })).setMimeType(ContentService.MimeType.JSON);
        }
    }

    // 2. Fallback: Check if they are already in the sheet (maybe re-verifying?)
    // If they are in the sheet, they are already verified (since we only add verified users now).
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
        if (data[i][1] === email) {
            logToSheet('Already verified and on waitlist: ' + email);
            return ContentService.createTextOutput(JSON.stringify({
                result: 'duplicate',
                row: data[i][6],
                message: 'Already verified and on the waitlist.'
            })).setMimeType(ContentService.MimeType.JSON);
        }
    }

    logToSheet('No pending verification found for: ' + email);
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', message: 'No pending verification found for this email.' })).setMimeType(ContentService.MimeType.JSON);
}


function handleCheckStatus(params, sheet) {
    const email = params.email;
    if (!email) return { result: 'error' };

    const cleanEmail = email.toLowerCase().trim();
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
        if (data[i][1] === cleanEmail) {
            if (data[i][4] === 'Verified') {
                return { result: 'verified', row: data[i][6] };
            } else {
                return { result: 'pending' };
            }
        }
    }
    return { result: 'not_found' };
}


function handleGetCount(sheet) {
    const count = getVerifiedCount(sheet);
    return ContentService.createTextOutput(JSON.stringify({ result: 'success', count: count + 1000 })).setMimeType(ContentService.MimeType.JSON);
}

function getVerifiedCount(sheet) {
    const data = sheet.getDataRange().getValues();
    let count = 0;
    // Start verify from 1 to skip header
    for (let i = 1; i < data.length; i++) {
        if (data[i][4] === 'Verified') {
            count++;
        }
    }
    return count;
}

function sendVerificationEmail(email, token, name) {
    const subject = "Your FastDeal Verification Code";

    const htmlBody = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 40px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #7c3aed; margin: 0; font-size: 24px; font-weight: bold;">FastDeal</h1>
      </div>
      
      <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #0f172a; margin-top: 0;">Verification Code</h2>
        <p style="font-size: 16px; color: #475569;">Hello ${name || 'There'},</p>
        <p style="font-size: 16px; color: #475569;">Use the code below to complete your sign-up for the FastDeal waitlist:</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; text-align: center; margin: 25px 0;">
          <span style="font-family: monospace; font-size: 32px; letter-spacing: 4px; font-weight: bold; color: #7c3aed; display: block;">${token}</span>
        </div>
        
        <p style="font-size: 14px; color: #94a3b8; margin-bottom: 0;">This code will remain valid for 1 hour. If you didn't request this, please ignore this email.</p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #94a3b8; font-size: 12px;">
        &copy; ${new Date().getFullYear()} FastDeal. All rights reserved.
      </div>
    </div>
  `;

    MailApp.sendEmail({
        to: email,
        subject: subject,
        htmlBody: htmlBody
    });
}
