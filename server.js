const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// In-memory Database for Users
const users = [
    { username: "admin", email: "admin@repairplus.com", password: "repair123" }
];

function findUser(username) {
    return users.find(u => u.username === username);
}

// 1. SIGN IN / LOGIN PAGE (GET /)
app.get('/', (req, res) => {
    const error = req.query.error === '1' ? '<div style="background: #fee2e2; color: #b91c1c; padding: 10px; border-radius: 6px; font-size: 13px; margin-bottom: 15px; font-weight: 500;">Invalid username or password. Please try again.</div>' : '';
    const success = req.query.success === '1' ? '<div style="background: #d1fae5; color: #047857; padding: 10px; border-radius: 6px; font-size: 13px; margin-bottom: 15px; font-weight: 500;">Account created successfully! Please sign in.</div>' : '';
    const reset = req.query.reset === '1' ? '<div style="background: #d1fae5; color: #047857; padding: 10px; border-radius: 6px; font-size: 13px; margin-bottom: 15px; font-weight: 500;">Password updated successfully! Sign in now.</div>' : '';

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>REPAIR+ Portal | Sign In</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
                body { background: #f8fafc; display: flex; height: 100vh; width: 100vw; align-items: center; justify-content: center; }
                .wrapper { display: flex; width: 900px; max-width: 90%; background: #fff; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e2e8f0; }
                .left-side { flex: 1; background: linear-gradient(135deg, #0f3d37 0%, #1a5c53 100%); color: #fff; padding: 48px; display: flex; flex-direction: column; justify-content: space-between; }
                .right-side { flex: 1; padding: 48px; display: flex; flex-direction: column; justify-content: center; }
                .form-group { margin-bottom: 16px; }
                .form-group label { display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px; }
                .form-group input { width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none; }
                .form-group input:focus { border-color: #0f3d37; }
                .btn { width: 100%; padding: 12px; background: #0f3d37; color: #fff; border: none; border-radius: 8px; font-weight: 600; font-size: 15px; cursor: pointer; }
                .btn:hover { background: #164e47; }
                .links { margin-top: 16px; display: flex; justify-content: space-between; font-size: 13px; }
                .links a { color: #0f3d37; text-decoration: none; font-weight: 600; }
                @media(max-width: 768px) { .left-side { display: none; } .wrapper { width: 100%; height: 100%; border-radius: 0; border: none; } }
            </style>
        </head>
        <body>
            <div class="wrapper">
                <div class="left-side">
                    <div>
                        <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 12px;">REPAIR+</h1>
                        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.5;">Professional Device Solutions & Manual Assessment Portal.</p>
                    </div>
                    <p style="font-size: 12px; color: #94a3b8;">© 2026 REPAIR+ System.</p>
                </div>
                <div class="right-side">
                    <h2 style="font-size: 24px; font-weight: 700; color: #1e293b; margin-bottom: 6px;">Welcome Back</h2>
                    <p style="color: #64748b; font-size: 14px; margin-bottom: 24px;">Please sign in to access your dashboard.</p>
                    ${error} ${success} ${reset}
                    <form action="/dashboard" method="POST">
                        <div class="form-group">
                            <label>Username</label>
                            <input type="text" name="username" placeholder="Enter your username" required>
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" name="password" placeholder="••••••••" required>
                        </div>
                        <button type="submit" class="btn">Sign In</button>
                    </form>
                    <div class="links">
                        <a href="/signup">Create Account</a>
                        <a href="/forgot">Forgot Password?</a>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `);
});

// 2. SIGN UP PAGE (GET /signup)
app.get('/signup', (req, res) => {
    const error = req.query.error === '1' ? '<div style="background: #fee2e2; color: #b91c1c; padding: 10px; border-radius: 6px; font-size: 13px; margin-bottom: 15px; font-weight: 500;">Username already exists. Choose another.</div>' : '';
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>REPAIR+ Portal | Sign Up</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
                body { background: #f8fafc; display: flex; height: 100vh; width: 100vw; align-items: center; justify-content: center; }
                .box { width: 400px; max-width: 90%; background: #fff; padding: 40px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
                .form-group { margin-bottom: 16px; }
                .form-group label { display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px; }
                .form-group input { width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none; }
                .btn { width: 100%; padding: 12px; background: #0f3d37; color: #fff; border: none; border-radius: 8px; font-weight: 600; font-size: 15px; cursor: pointer; }
            </style>
        </head>
        <body>
            <div class="box">
                <h2 style="font-size: 24px; font-weight: 700; color: #1e293b; margin-bottom: 6px;">Create Account</h2>
                <p style="color: #64748b; font-size: 14px; margin-bottom: 24px;">Join REPAIR+ platform today.</p>
                ${error}
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
                    <button type="submit" class="btn">Register Account</button>
                </form>
                <p style="text-align: center; margin-top: 16px; font-size: 13px;"><a href="/" style="color: #0f3d37; text-decoration: none; font-weight: 600;">Already have an account? Sign In</a></p>
            </div>
        </body>
        </html>
    `);
});

app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    if (findUser(username)) {
        return res.redirect('/signup?error=1');
    }
    users.push({ username, email, password });
    res.redirect('/?success=1');
});

// 3. FORGOT PASSWORD (GET /forgot)
app.get('/forgot', (req, res) => {
    const error = req.query.error === '1' ? '<div style="background: #fee2e2; color: #b91c1c; padding: 10px; border-radius: 6px; font-size: 13px; margin-bottom: 15px; font-weight: 500;">Username not found in system records.</div>' : '';
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>REPAIR+ Portal | Reset Password</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
                body { background: #f8fafc; display: flex; height: 100vh; width: 100vw; align-items: center; justify-content: center; }
                .box { width: 400px; max-width: 90%; background: #fff; padding: 40px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
                .form-group { margin-bottom: 16px; }
                .form-group label { display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px; }
                .form-group input { width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none; }
                .btn { width: 100%; padding: 12px; background: #0f3d37; color: #fff; border: none; border-radius: 8px; font-weight: 600; font-size: 15px; cursor: pointer; }
            </style>
        </head>
        <body>
            <div class="box">
                <h2 style="font-size: 24px; font-weight: 700; color: #1e293b; margin-bottom: 6px;">Reset Password</h2>
                <p style="color: #64748b; font-size: 14px; margin-bottom: 24px;">Enter your username and new password.</p>
                ${error}
                <form action="/forgot" method="POST">
                    <div class="form-group">
                        <label>Username</label>
                        <input type="text" name="username" placeholder="Your username" required>
                    </div>
                    <div class="form-group">
                        <label>New Password</label>
                        <input type="password" name="newPassword" placeholder="New secure password" required>
                    </div>
                    <button type="submit" class="btn">Update Password</button>
                </form>
                <p style="text-align: center; margin-top: 16px; font-size: 13px;"><a href="/" style="color: #0f3d37; text-decoration: none; font-weight: 600;">Back to Sign In</a></p>
            </div>
        </body>
        </html>
    `);
});

app.post('/forgot', (req, res) => {
    const { username, newPassword } = req.body;
    const user = findUser(username);
    if (!user) {
        return res.redirect('/forgot?error=1');
    }
    user.password = newPassword;
    res.redirect('/?reset=1');
});

// Prevent direct GET /dashboard
app.get('/dashboard', (req, res) => {
    res.redirect('/');
});

// 4. DASHBOARD (POST /dashboard) - Manual Control Center
app.post('/dashboard', (req, res) => {
    const { username, password } = req.body;
    const user = findUser(username);

    if (!user || user.password !== password) {
        return res.redirect('/?error=1');
    }

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>REPAIR+ Dashboard</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
                body { background: #f8fafc; color: #1e293b; min-height: 100vh; display: flex; flex-direction: column; }
                .navbar { background: #0f3d37; color: #fff; padding: 16px 32px; display: flex; justify-content: space-between; align-items: center; width: 100%; }
                .main-container { max-width: 800px; width: 100%; margin: 40px auto; padding: 0 20px; flex: 1; }
                .card { background: #fff; padding: 40px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px rgba(0,0,0,0.02); text-align: center; }
                .btn-ctrl { padding: 14px 28px; border-radius: 8px; border: none; font-weight: 600; font-size: 15px; cursor: pointer; margin: 10px; transition: opacity 0.2s; display: inline-flex; align-items: center; gap: 8px; }
                .btn-ctrl:hover { opacity: 0.9; }
                .btn-repair { background: #10b981; color: #fff; }
                .btn-buyback { background: #f97316; color: #fff; }
                .panel-result { display: none; margin-top: 30px; padding: 24px; border-radius: 8px; text-align: left; }
            </style>
        </head>
        <body>
            <div class="navbar">
                <div style="font-weight: 700; font-size: 18px;">🛡️ REPAIR+ Dashboard</div>
                <div style="font-size: 14px;">User: <strong>${username}</strong> | <a href="/" style="color: #cbd5e1; text-decoration: none; margin-left: 10px;">Sign Out</a></div>
            </div>
            
            <div class="main-container">
                <div class="card">
                    <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 8px; color: #0f172a;">Manual Device Assessment</h2>
                    <p style="color: #64748b; font-size: 14px; margin-bottom: 30px;">Select the repair status for your item directly below:</p>
                    
                    <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
                        <button class="btn-ctrl btn-repair" onclick="setOutcome('repair')">✅ Set as Repairable</button>
                        <button class="btn-ctrl btn-buyback" onclick="setOutcome('buyback')">⚠️ Set as Unrepairable (Buyback)</button>
                    </div>

                    <div id="repairBox" class="panel-result" style="background: #ecfdf5; border: 1px solid #10b981; color: #065f46;">
                        <h3 style="margin-bottom: 6px; font-size: 18px;">Status: Repairable Device</h3>
                        <p style="font-size: 14px; line-height: 1.5;">This item has been manually marked as repairable. Proceeding with standard repair workflow and component servicing.</p>
                    </div>

                    <div id="buybackBox" class="panel-result" style="background: #fff7ed; border: 1px solid #f97316; color: #9a3412;">
                        <h3 style="margin-bottom: 6px; font-size: 18px;">Status: Unrepairable (Buyback Offered)</h3>
                        <p style="font-size: 14px; line-height: 1.5;">This item has been manually marked as unrepairable. Eligible for the instant parts buyback program.</p>
                    </div>
                </div>
            </div>

            <script>
                function setOutcome(type) {
                    document.getElementById('repairBox').style.display = (type === 'repair') ? 'block' : 'none';
                    document.getElementById('buybackBox').style.display = (type === 'buyback') ? 'block' : 'none';
                }
            </script>
        </body>
        </html>
    `);
});

app.listen(port, () => console.log('Server running on port ' + port));