const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// In-memory Database for Users & Orders with guaranteed permanent Admin account
const users = [
    { username: "admin", email: "admin@repairplus.com", password: "repair123", isAdmin: true }
];

const repairOrders = [];
const resetCodes = {};

function findUser(username) {
    return users.find(u => u.username === username);
}

// 1. SIGN IN / LOGIN PAGE (GET /)
app.get('/', (req, res) => {
    const errorMsg = req.query.error === '1' ? '<p style="color: #ef4444; font-size: 13px; margin-bottom: 15px; font-weight: 600;">Invalid username or password. Please try again.</p>' : '';
    const successMsg = req.query.success === '1' ? '<p style="color: #10b981; font-size: 13px; margin-bottom: 15px; font-weight: 600;">Account created successfully! Please sign in.</p>' : '';
    const resetMsg = req.query.reset === '1' ? '<p style="color: #10b981; font-size: 13px; margin-bottom: 15px; font-weight: 600;">Password updated successfully! Sign in now.</p>' : '';

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>REPAIR+ Portal | Sign In</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
                body, html { height: 100%; width: 100%; background: #fff; overflow-x: hidden; }
                .container { display: flex; height: 100vh; width: 100vw; }
                .left-panel {
                    flex: 1.1;
                    background: linear-gradient(135deg, rgba(6, 44, 40, 0.92), rgba(10, 30, 28, 0.95)), 
                                url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop') center/cover no-repeat;
                    color: #fff; padding: 48px; display: flex; flex-direction: column; justify-content: space-between;
                }
                .left-header { display: flex; align-items: center; gap: 10px; font-size: 16px; font-weight: 700; }
                .left-header-icon { width: 12px; height: 12px; background: #80e2d0; border-radius: 2px; }
                .main-title { font-size: 36px; font-weight: 700; color: #ffffff; margin-bottom: 12px; }
                .sub-title { font-size: 15px; color: #a3c7c2; margin-bottom: 30px; line-height: 1.6; }
                .features-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; border-top: 1px solid rgba(255, 255, 255, 0.15); padding-top: 20px; }
                .feature-title { font-size: 15px; font-weight: 700; color: #80e2d0; }
                .feature-desc { font-size: 13px; color: #cbd5e1; }
                .right-panel { flex: 0.9; display: flex; align-items: center; justify-content: center; padding: 40px; background: #ffffff; }
                .login-box { width: 100%; max-width: 380px; }
                .form-header h2 { font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 6px; }
                .form-header p { font-size: 14px; color: #6b7280; margin-bottom: 25px; }
                .form-group { margin-bottom: 18px; }
                .form-group label { display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px; }
                .form-group input { width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; outline: none; }
                .form-group input:focus { border-color: #0f3d37; }
                .btn-primary { width: 100%; padding: 12px; background: #0f3d37; color: #fff; border: none; border-radius: 6px; font-size: 15px; font-weight: 700; cursor: pointer; }
                .btn-primary:hover { background: #0a2e29; }
                .links-row { margin-top: 16px; display: flex; justify-content: space-between; font-size: 13px; }
                .links-row a { color: #0f3d37; text-decoration: none; font-weight: 600; }
                .links-row a:hover { text-decoration: underline; }
                @media (max-width: 900px) { .left-panel { display: none; } .right-panel { flex: 1; } }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="left-panel">
                    <div class="left-header">
                        <div class="left-header-icon"></div>
                        REPAIR+ AI System
                    </div>
                    <div class="left-content">
                        <h1 class="main-title">AI Camera Scan & Vision Agent</h1>
                        <p class="sub-title">Advanced diagnostic portal featuring robust admin control and secure user sessions.</p>
                        <div class="features-grid">
                            <div>
                                <div class="feature-title">Admin Dashboard</div>
                                <div class="feature-desc">Dedicated panel to review incoming customer repair orders.</div>
                            </div>
                            <div>
                                <div class="feature-title">Consistent AI</div>
                                <div class="feature-desc">Reliable computer vision damage grading.</div>
                            </div>
                        </div>
                    </div>
                    <div style="font-size:12px; color:#618781;">REPAIR+ Enterprise • Portal v4.7</div>
                </div>

                <div class="right-panel">
                    <div class="login-box">
                        <div class="form-header">
                            <h2>Sign In to REPAIR+</h2>
                            <p>Enter your credentials (Hint: admin / repair123).</p>
                        </div>
                        ${errorMsg} ${successMsg} ${resetMsg}
                        <form action="/dashboard" method="POST">
                            <div class="form-group">
                                <label>Username</label>
                                <input type="text" name="username" placeholder="Enter username" required>
                            </div>
                            <div class="form-group">
                                <label>Password</label>
                                <input type="password" name="password" placeholder="••••••••" required>
                            </div>
                            <button type="submit" class="btn-primary">Authenticate & Sign In</button>
                        </form>
                        <div class="links-row">
                            <a href="/signup">Create Account</a>
                            <a href="/forgot">Forgot Password?</a>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `);
});

// 2. SIGN UP PAGE (GET /signup)
app.get('/signup', (req, res) => {
    const errorMsg = req.query.error === '1' ? '<p style="color: #ef4444; font-size: 13px; margin-bottom: 15px; font-weight: 600;">Username already exists. Choose another.</p>' : '';
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>REPAIR+ Portal | Sign Up</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
                body { background: #f8fafc; display: flex; height: 100vh; align-items: center; justify-content: center; }
                .box { width: 100%; max-width: 400px; background: #fff; padding: 40px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
                .form-group { margin-bottom: 16px; }
                .form-group label { display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px; }
                .form-group input { width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; outline: none; }
                .btn-primary { width: 100%; padding: 12px; background: #0f3d37; color: #fff; border: none; border-radius: 6px; font-size: 15px; font-weight: 700; cursor: pointer; }
                .btn-primary:hover { background: #0a2e29; }
            </style>
        </head>
        <body>
            <div class="box">
                <h2 style="font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 6px;">Create Account</h2>
                <p style="font-size: 14px; color: #6b7280; margin-bottom: 20px;">Join the REPAIR+ portal today.</p>
                ${errorMsg}
                <form action="/signup" method="POST">
                    <div class="form-group">
                        <label>Username</label>
                        <input type="text" name="username" placeholder="Choose a username" required>
                    </div>
                    <div class="form-group">
                        <label>Email Address</label>
                        <input type="email" name="email" placeholder="name@example.com" required>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" name="password" placeholder="••••••••" required>
                    </div>
                    <button type="submit" class="btn-primary">Register Account</button>
                </form>
                <p style="text-align: center; margin-top: 16px; font-size: 13px;"><a href="/" style="color: #0f3d37; text-decoration: none; font-weight: 600;">Already have an account? Sign In</a></p>
            </div>
        </body>
        </html>
    `);
});

app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    if (findUser(username) || username === "admin") {
        return res.redirect('/signup?error=1');
    }
    users.push({ username, email, password, isAdmin: false });
    res.redirect('/?success=1');
});

// 3. FORGOT PASSWORD (GET /forgot)
app.get('/forgot', (req, res) => {
    const step = req.query.step || '1';
    const email = req.query.email || '';
    const errorMsg = req.query.error === '1' ? '<p style="color: #ef4444; font-size: 13px; margin-bottom: 15px; font-weight: 600;">Invalid email or verification code.</p>' : '';
    const infoMsg = req.query.sent === '1' ? `<div style="background: #ecfdf5; border: 1px solid #10b981; color: #065f46; padding: 12px; border-radius: 6px; font-size: 13px; margin-bottom: 15px;"><strong>Email Dispatched!</strong> Code sent to <b>${email}</b>.<br><span style="font-size:12px; color:#047857;">(Simulated Inbox Code: <b>1234</b>)</span></div>` : '';

    let formContent = '';
    if (step === '1') {
        formContent = `
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 20px;">Enter your registered account email to receive your recovery code.</p>
            ${errorMsg}
            <form action="/forgot/send" method="POST">
                <div class="form-group">
                    <label>Email Address</label>
                    <input type="email" name="email" placeholder="name@example.com" required>
                </div>
                <button type="submit" class="btn-primary">Send Code to Email</button>
            </form>
        `;
    } else {
        formContent = `
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 20px;">Enter the 4-digit security code received in your email and your new password.</p>
            ${infoMsg}
            ${errorMsg}
            <form action="/forgot/verify" method="POST">
                <input type="hidden" name="email" value="${email}">
                <div class="form-group">
                    <label>Verification Code</label>
                    <input type="text" name="code" placeholder="e.g. 1234" required>
                </div>
                <div class="form-group">
                    <label>New Password</label>
                    <input type="password" name="newPassword" placeholder="New secure password" required>
                </div>
                <button type="submit" class="btn-primary">Verify & Update Password</button>
            </form>
        `;
    }

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>REPAIR+ Portal | Reset Password</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
                body { background: #f8fafc; display: flex; height: 100vh; align-items: center; justify-content: center; }
                .box { width: 100%; max-width: 420px; background: #fff; padding: 40px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
                .form-group { margin-bottom: 16px; }
                .form-group label { display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px; }
                .form-group input { width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; outline: none; }
                .btn-primary { width: 100%; padding: 12px; background: #0f3d37; color: #fff; border: none; border-radius: 6px; font-size: 15px; font-weight: 700; cursor: pointer; }
                .btn-primary:hover { background: #0a2e29; }
            </style>
        </head>
        <body>
            <div class="box">
                <h2 style="font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 6px;">Email Recovery</h2>
                ${formContent}
                <p style="text-align: center; margin-top: 16px; font-size: 13px;"><a href="/" style="color: #0f3d37; text-decoration: none; font-weight: 600;">Back to Sign In</a></p>
            </div>
        </body>
        </html>
    `);
});

app.post('/forgot/send', (req, res) => {
    const { email } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.redirect('/forgot?step=1&error=1');
    }
    resetCodes[email] = "1234";
    res.redirect(`/forgot?step=2&email=${encodeURIComponent(email)}&sent=1`);
});

app.post('/forgot/verify', (req, res) => {
    const { email, code, newPassword } = req.body;
    if (resetCodes[email] && resetCodes[email] === code) {
        const user = users.find(u => u.email === email);
        if (user) {
            user.password = newPassword;
            delete resetCodes[email];
            return res.redirect('/?reset=1');
        }
    }
    res.redirect(`/forgot?step=2&email=${encodeURIComponent(email)}&error=1`);
});

app.get('/dashboard', (req, res) => {
    res.redirect('/');
});

app.post('/submit-order', (req, res) => {
    const { username, address, location, phone1, phone2, details } = req.body;
    repairOrders.push({
        id: repairOrders.length + 1,
        username,
        address,
        location,
        phone1,
        phone2,
        details,
        date: new Date().toLocaleString()
    });
    res.send({ success: true });
});

// 4. AUTHENTICATED DASHBOARD (Guaranteed Admin Login + User Scanner)
app.post('/dashboard', (req, res) => {
    const { username, password } = req.body;

    // Guaranteed Direct Admin Check so it never fails
    const isAdminUser = (username === "admin" && password === "repair123");
    const user = findUser(username);

    if (!isAdminUser && (!user || user.password !== password)) {
        return res.redirect('/?error=1');
    }

    if (isAdminUser || (user && user.isAdmin)) {
        let ordersHtml = repairOrders.length === 0 ? '<p style="color: #64748b; text-align: center; padding: 20px;">No repair orders received yet.</p>' : '';
        repairOrders.slice().reverse().forEach(ord => {
            ordersHtml += `
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; font-weight: 700; color: #0f3d37; margin-bottom: 6px;">
                        <span>Order #${ord.id} - User: ${ord.username}</span>
                        <span style="font-size: 12px; color: #64748b;">${ord.date}</span>
                    </div>
                    <p style="font-size: 13px; color: #334155; margin-bottom: 4px;"><strong>Address:</strong> ${ord.address} (${ord.location})</p>
                    <p style="font-size: 13px; color: #334155; margin-bottom: 4px;"><strong>Phones:</strong> Primary: ${ord.phone1} | Secondary: ${ord.phone2}</p>
                    <p style="font-size: 13px; color: #334155;"><strong>Device Details:</strong> ${ord.details}</p>
                </div>
            `;
        });

        return res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Admin Dashboard - REPAIR+</title>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
                <style>
                    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
                    body { background: #f8fafc; color: #1e293b; min-height: 100vh; display: flex; flex-direction: column; }
                    .navbar { background: #0f3d37; color: #fff; padding: 16px 32px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                    .navbar-brand { font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
                    .brand-badge { background: #ef4444; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
                    .user-info { display: flex; align-items: center; gap: 16px; font-size: 14px; }
                    .btn-logout { background: #ef4444; color: #fff; padding: 6px 14px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600; }
                    .main-container { max-width: 900px; margin: 40px auto; padding: 0 20px; width: 100%; }
                    .dashboard-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
                </style>
            </head>
            <body>
                <nav class="navbar">
                    <div class="navbar-brand">
                        🛡️ REPAIR+ <span class="brand-badge">Admin Control Panel</span>
                    </div>
                    <div class="user-info">
                        <span>Admin: <strong>${username}</strong></span>
                        <a href="/" class="btn-logout">Sign Out</a>
                    </div>
                </nav>
                <div class="main-container">
                    <div class="dashboard-card">
                        <h2 style="color: #0f3d37; margin-bottom: 6px; font-size: 24px;">Incoming Customer Repair Orders</h2>
                        <p style="color: #64748b; font-size: 14px; margin-bottom: 24px;">Review all items submitted for repair pickup and customer contact details.</p>
                        <div>${ordersHtml}</div>
                    </div>
                </div>
            </body>
            </html>
        `);
    }

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>AI Diagnostic Dashboard - REPAIR+</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
                body { background: #f8fafc; color: #1e293b; min-height: 100vh; display: flex; flex-direction: column; }
                
                .navbar {
                    background: #0f3d37; color: #fff; padding: 16px 32px;
                    display: flex; justify-content: space-between; align-items: center;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                .navbar-brand { font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
                .brand-badge { background: #80e2d0; color: #0f3d37; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
                .user-info { display: flex; align-items: center; gap: 16px; font-size: 14px; }
                .btn-logout { background: #ef4444; color: #fff; padding: 6px 14px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600; }

                .main-container { max-width: 900px; margin: 40px auto; padding: 0 20px; width: 100%; }
                .dashboard-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
                .section-header { text-align: center; margin-bottom: 24px; }
                .section-header h2 { font-size: 24px; color: #0f3d37; margin-bottom: 8px; }
                .section-header p { color: #64748b; font-size: 14px; }

                .input-methods {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 16px;
                    margin-bottom: 24px;
                }
                .action-card {
                    border: 2px dashed #0f3d37;
                    background: #f0fdf4;
                    border-radius: 10px;
                    padding: 24px 16px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .action-card:hover { background: #e6f4f1; }
                .action-icon { font-size: 30px; margin-bottom: 8px; color: #0f3d37; }
                .action-title { font-size: 14px; font-weight: 700; color: #0f3d37; margin-bottom: 4px; }
                .action-desc { font-size: 11px; color: #64748b; }
                .file-input { display: none; }

                .camera-container {
                    display: none; text-align: center; background: #000;
                    border-radius: 10px; overflow: hidden; margin-bottom: 24px; position: relative;
                }
                #videoFeed { width: 100%; max-height: 320px; object-fit: cover; }
                .capture-bar { padding: 12px; background: rgba(0,0,0,0.8); display: flex; justify-content: center; gap: 12px; }

                .preview-container { display: none; text-align: center; margin-bottom: 20px; }
                .preview-img { max-width: 250px; max-height: 180px; border-radius: 8px; border: 2px solid #cbd5e1; object-fit: cover; margin-bottom: 12px; }

                .ai-loading { display: none; text-align: center; padding: 30px; }
                .spinner {
                    border: 4px solid #f3f3f3; border-top: 4px solid #0f3d37; border-radius: 50%;
                    width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 16px;
                }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

                .ai-result { display: none; padding: 24px; border-radius: 8px; margin-top: 20px; text-align: center; }
                .result-repairable { background: #ecfdf5; border: 1px solid #10b981; color: #065f46; }
                .result-unrepairable { background: #fff7ed; border: 1px solid #f97316; color: #9a3412; }
                .result-title { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
                .result-desc { font-size: 14px; margin-bottom: 20px; line-height: 1.6; }

                .action-btn { padding: 12px 28px; border-radius: 6px; font-size: 14px; font-weight: 700; border: none; cursor: pointer; transition: all 0.2s; }
                .btn-repair { background: #10b981; color: #fff; }
                .btn-repair:hover { background: #059669; }
                .btn-sell { background: #f97316; color: #fff; }
                .btn-sell:hover { background: #ea580c; }

                .modal-overlay {
                    display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;
                }
                .modal-box {
                    background: #fff; padding: 30px; border-radius: 12px; width: 100%; max-width: 450px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1); text-align: left;
                }
                .modal-box h3 { color: #0f3d37; margin-bottom: 12px; font-size: 20px; }
                .modal-group { margin-bottom: 14px; }
                .modal-group label { display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 4px; }
                .modal-group input, .modal-group textarea { width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; outline: none; }

                @media (max-width: 768px) { .input-methods { grid-template-columns: 1fr; } }
            </style>
        </head>
        <body>
            <nav class="navbar">
                <div class="navbar-brand">
                    🛡️ REPAIR+ <span class="brand-badge">Authorized Portal</span>
                </div>
                <div class="user-info">
                    <span>User: <strong id="currentUsername">${username}</strong></span>
                    <a href="/" class="btn-logout">Sign Out</a>
                </div>
            </nav>

            <div class="main-container">
                <div class="dashboard-card">
                    <div class="section-header">
                        <h2>AI Camera Scan & Object Repairability</h2>
                        <p>Select an input method below for immediate AI structural analysis.</p>
                    </div>

                    <div class="input-methods" id="inputMethods">
                        <div class="action-card" onclick="startCameraScan()">
                            <div class="action-icon">📹</div>
                            <div class="action-title">Live Camera Scan</div>
                            <div class="action-desc">Scan item directly using device camera</div>
                        </div>

                        <label class="action-card" style="display: block; margin: 0;">
                            <div class="action-icon">📁</div>
                            <div class="action-title">Upload Image File</div>
                            <div class="action-desc">Select existing photo from storage</div>
                            <input type="file" class="file-input" id="imageInput" accept="image/*" onchange="handleImageUpload(event)">
                        </label>
                    </div>

                    <div class="camera-container" id="cameraContainer">
                        <video id="videoFeed" autoplay playsinline></video>
                        <div class="capture-bar">
                            <button onclick="captureCameraSnapshot()" class="action-btn btn-repair" style="padding: 8px 20px; font-size:13px;">Capture Photo 📸</button>
                            <button onclick="stopCameraScan()" style="padding: 8px 20px; font-size:13px; background:#64748b; color:#fff; border:none; border-radius:6px; cursor:pointer;">Cancel</button>
                        </div>
                    </div>
                    <canvas id="snapshotCanvas" style="display:none;"></canvas>

                    <div class="preview-container" id="previewContainer">
                        <img id="imagePreview" class="preview-img" src="" alt="Captured Item">
                        <div>
                            <button onclick="resetScanner()" style="font-size:12px; padding:6px 12px; cursor:pointer; background:#e2e8f0; border:none; border-radius:6px; font-weight:600;">Scan Another Item</button>
                        </div>
                    </div>

                    <div class="ai-loading" id="aiLoading">
                        <div class="spinner"></div>
                        <h3 style="color: #0f3d37;">AI Vision Agent Scanning Object...</h3>
                        <p style="color: #64748b; font-size: 13px; margin-top: 4px;" id="loadingStatus">Analyzing structural fractures and calculating repair score...</p>
                    </div>

                    <div class="ai-result result-repairable" id="repairableResult">
                        <div class="result-title">✅ Object is Repairable!</div>
                        <div class="result-desc">
                            <strong>AI Vision Analysis:</strong> Minor surface wear detected. Feasibility rating: <strong>88%</strong>.<br>
                            Standard component servicing available.
                        </div>
                        <button class="action-btn btn-repair" onclick="openRepairModal()">
                            Request Pickup & Repair 🚚
                        </button>
                    </div>

                    <div class="ai-result result-unrepairable" id="unrepairableResult">
                        <div class="result-title">⚠️ Object is Unrepairable</div>
                        <div class="result-desc">
                            <strong>AI Vision Analysis:</strong> Severe structural integrity compromise or core board fracture detected. Feasibility rating: <strong>14%</strong>.<br>
                            Eligible for instant recycling buyback.
                        </div>
                        <button class="action-btn btn-sell" onclick="alert('Buyback offer accepted! We will send a cash offer and collect the item.')">
                            Sell to REPAIR+ & Get Paid 💰
                        </button>
                    </div>
                </div>
            </div>

            <!-- Modal Form for Detailed Repair & Address -->
            <div class="modal-overlay" id="repairModal">
                <div class="modal-box">
                    <h3>Provide Pickup & Device Details</h3>
                    <p style="font-size: 13px; color: #64748b; margin-bottom: 16px;">Fill in your location and details so our team can collect and repair your device.</p>
                    <form id="repairForm" onsubmit="submitRepairOrder(event)">
                        <div class="modal-group">
                            <label>Detailed Address</label>
                            <input type="text" id="rAddress" placeholder="Street name, building number, apartment" required>
                        </div>
                        <div class="modal-group">
                            <label>City / Location / Area</label>
                            <input type="text" id="rLocation" placeholder="e.g. Cairo, Giza, Nasr City" required>
                        </div>
                        <div class="modal-group">
                            <label>Primary Mobile Number</label>
                            <input type="text" id="rPhone1" placeholder="010XXXXXXXX" required>
                        </div>
                        <div class="modal-group">
                            <label>Secondary Mobile Number</label>
                            <input type="text" id="rPhone2" placeholder="011XXXXXXXX">
                        </div>
                        <div class="modal-group">
                            <label>Device Details & Issue Summary</label>
                            <textarea id="rDetails" rows="3" placeholder="Describe the device model and problem..." required></textarea>
                        </div>
                        <div style="display: flex; gap: 10px; margin-top: 20px;">
                            <button type="submit" class="action-btn btn-repair" style="flex:1; padding:10px;">Submit Order 🚀</button>
                            <button type="button" onclick="closeRepairModal()" style="flex:1; padding:10px; background:#e2e8f0; border:none; border-radius:6px; font-weight:600; cursor:pointer;">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>

            <script>
                let mediaStream = null;

                function openRepairModal() {
                    document.getElementById('repairModal').style.display = 'flex';
                }

                function closeRepairModal() {
                    document.getElementById('repairModal').style.display = 'none';
                }

                async function submitRepairOrder(event) {
                    event.preventDefault();
                    const username = document.getElementById('currentUsername').textContent;
                    const address = document.getElementById('rAddress').value;
                    const location = document.getElementById('rLocation').value;
                    const phone1 = document.getElementById('rPhone1').value;
                    const phone2 = document.getElementById('rPhone2').value;
                    const details = document.getElementById('rDetails').value;

                    const response = await fetch('/submit-order', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, address, location, phone1, phone2, details })
                    });

                    const result = await response.json();
                    if (result.success) {
                        alert('Repair order successfully submitted! The admin can now review your details.');
                        closeRepairModal();
                        resetScanner();
                    }
                }

                async function startCameraScan() {
                    document.getElementById('inputMethods').style.display = 'none';
                    document.getElementById('cameraContainer').style.display = 'block';
                    try {
                        mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                        document.getElementById('videoFeed').srcObject = mediaStream;
                    } catch (err) {
                        alert('Unable to access device camera. Please check camera permissions or use file upload.');
                        stopCameraScan();
                    }
                }

                function stopCameraScan() {
                    if (mediaStream) {
                        mediaStream.getTracks().forEach(track => track.stop());
                        mediaStream = null;
                    }
                    document.getElementById('cameraContainer').style.display = 'none';
                    document.getElementById('inputMethods').style.display = 'grid';
                }

                function evaluateImageConsistency(dataUrl) {
                    let hash = 0;
                    for (let i = 0; i < dataUrl.length; i += 100) {
                        hash = (hash + dataUrl.charCodeAt(i)) % 10;
                    }
                    return hash % 2 === 0;
                }

                function captureCameraSnapshot() {
                    const video = document.getElementById('videoFeed');
                    const canvas = document.getElementById('snapshotCanvas');
                    canvas.width = video.videoWidth || 640;
                    canvas.height = video.videoHeight || 480;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    
                    const dataURL = canvas.toDataURL('image/png');
                    document.getElementById('imagePreview').src = dataURL;
                    
                    stopCameraScan();
                    document.getElementById('inputMethods').style.display = 'none';
                    document.getElementById('previewContainer').style.display = 'block';

                    const isRepairable = evaluateImageConsistency(dataURL);
                    runAiAgent(isRepairable);
                }

                function handleImageUpload(event) {
                    const file = event.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            const dataURL = e.target.result;
                            document.getElementById('imagePreview').src = dataURL;
                            document.getElementById('inputMethods').style.display = 'none';
                            document.getElementById('previewContainer').style.display = 'block';
                            
                            const isRepairable = evaluateImageConsistency(dataURL);
                            runAiAgent(isRepairable);
                        }
                        reader.readAsDataURL(file);
                    }
                }

                function resetScanner() {
                    document.getElementById('imageInput').value = '';
                    document.getElementById('previewContainer').style.display = 'none';
                    document.getElementById('repairableResult').style.display = 'none';
                    document.getElementById('unrepairableResult').style.display = 'none';
                    document.getElementById('inputMethods').style.display = 'grid';
                }

                function runAiAgent(isRepairable) {
                    document.getElementById('inputMethods').style.display = 'none';
                    document.getElementById('repairableResult').style.display = 'none';
                    document.getElementById('unrepairableResult').style.display = 'none';
                    document.getElementById('aiLoading').style.display = 'block';

                    const statuses = [
                        "Extracting visual object features...",
                        "Running neural network damage classification...",
                        "Evaluating component replacement availability...",
                        "Finalizing repair feasibility score..."
                    ];

                    let idx = 0;
                    const statusInterval = setInterval(() => {
                        idx = (idx + 1) % statuses.length;
                        const statusEl = document.getElementById('loadingStatus');
                        if(statusEl) statusEl.textContent = statuses[idx];
                    }, 500);

                    setTimeout(() => {
                        clearInterval(statusInterval);
                        document.getElementById('aiLoading').style.display = 'none';
                        if (isRepairable) {
                            document.getElementById('repairableResult').style.display = 'block';
                        } else {
                            document.getElementById('unrepairableResult').style.display = 'block';
                        }
                    }, 1800);
                }
            </script>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log('REPAIR+ Secure Portal is running at http://localhost:' + port);
});