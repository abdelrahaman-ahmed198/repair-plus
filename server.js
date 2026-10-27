const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

// Hardcoded restricted credentials for enterprise security
const VALID_USERNAME = "admin";
const VALID_PASSWORD = "repair123";

// 1. Login Page with Error Handling
app.get('/', (req, res) => {
    const errorMsg = req.query.error === '1' ? '<p style="color: #ef4444; font-size: 13px; margin-bottom: 15px; font-weight: 600;">Invalid username or password. Please try again.</p>' : '';
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>REPAIR+ Portal</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
                body, html { height: 100%; width: 100%; background: #fff; overflow-x: hidden; }
                .container { display: flex; height: 100vh; width: 100vw; }

                /* Left Panel - Banner */
                .left-panel {
                    flex: 1.1;
                    background: linear-gradient(135deg, rgba(6, 44, 40, 0.92), rgba(10, 30, 28, 0.95)), 
                                url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop') center/cover no-repeat;
                    color: #fff;
                    padding: 48px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                .left-header { display: flex; align-items: center; gap: 10px; font-size: 16px; font-weight: 700; }
                .left-header-icon { width: 12px; height: 12px; background: #80e2d0; border-radius: 2px; }
                .main-title { font-size: 36px; font-weight: 700; color: #ffffff; margin-bottom: 12px; }
                .sub-title { font-size: 15px; color: #a3c7c2; margin-bottom: 30px; line-height: 1.6; }
                .features-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; border-top: 1px solid rgba(255, 255, 255, 0.15); padding-top: 20px; }
                .feature-title { font-size: 15px; font-weight: 700; color: #80e2d0; }
                .feature-desc { font-size: 13px; color: #cbd5e1; }

                /* Right Panel - Form */
                .right-panel { flex: 0.9; display: flex; align-items: center; justify-content: center; padding: 40px; background: #ffffff; }
                .login-box { width: 100%; max-width: 380px; }
                .form-header h2 { font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 6px; }
                .form-header p { font-size: 14px; color: #6b7280; margin-bottom: 25px; }
                .form-group { margin-bottom: 18px; }
                .form-group label { display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px; }
                .form-group input { width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; }
                .btn-primary { width: 100%; padding: 12px; background: #0f3d37; color: #fff; border: none; border-radius: 6px; font-size: 15px; font-weight: 700; cursor: pointer; }
                .btn-primary:hover { background: #0a2e29; }
                
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
                        <p class="sub-title">Secure restricted access portal featuring live camera scanning, computer vision object diagnosis, and repair evaluation.</p>
                        <div class="features-grid">
                            <div>
                                <div class="feature-title">Restricted Access</div>
                                <div class="feature-desc">Secure authorization for authorized administrative staff.</div>
                            </div>
                            <div>
                                <div class="feature-title">Camera Scan Mode</div>
                                <div class="feature-desc">Live camera capture or image file uploads for automated grading.</div>
                            </div>
                        </div>
                    </div>
                    <div style="font-size:12px; color:#618781;">REPAIR+ Enterprise • Restricted Portal v3.0</div>
                </div>

                <div class="right-panel">
                    <div class="login-box">
                        <div class="form-header">
                            <h2>Restricted Sign In</h2>
                           
                        </div>
                        ${errorMsg}
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
                    </div>
                </div>
            </div>
        </body>
        </html>
    `);
});

// 2. Restricted Authentication Route + Dashboard with Camera Scan Feature
app.post('/dashboard', (req, res) => {
    const { username, password } = req.body;

    // Strict credential check
    if (username !== VALID_USERNAME || password !== VALID_PASSWORD) {
        return res.redirect('/?error=1');
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
                
                /* Navbar */
                .navbar {
                    background: #0f3d37;
                    color: #fff;
                    padding: 16px 32px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                .navbar-brand { font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
                .brand-badge { background: #80e2d0; color: #0f3d37; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
                .user-info { display: flex; align-items: center; gap: 16px; font-size: 14px; }
                .btn-logout { background: #ef4444; color: #fff; padding: 6px 14px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600; }

                /* Main Content */
                .main-container { max-width: 900px; margin: 40px auto; padding: 0 20px; width: 100%; }
                .dashboard-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
                .section-header { text-align: center; margin-bottom: 24px; }
                .section-header h2 { font-size: 24px; color: #0f3d37; margin-bottom: 8px; }
                .section-header p { color: #64748b; font-size: 14px; }

                /* Input Methods Grid */
                .input-methods {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
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

                /* Live Camera Scanner Viewport */
                .camera-container {
                    display: none;
                    text-align: center;
                    background: #000;
                    border-radius: 10px;
                    overflow: hidden;
                    margin-bottom: 24px;
                    position: relative;
                }
                #videoFeed {
                    width: 100%;
                    max-height: 320px;
                    object-fit: cover;
                }
                .capture-bar {
                    padding: 12px;
                    background: rgba(0,0,0,0.8);
                    display: flex;
                    justify-content: center;
                    gap: 12px;
                }

                /* Image Preview Container */
                .preview-container {
                    display: none;
                    text-align: center;
                    margin-bottom: 20px;
                }
                .preview-img {
                    max-width: 250px;
                    max-height: 180px;
                    border-radius: 8px;
                    border: 2px solid #cbd5e1;
                    object-fit: cover;
                    margin-bottom: 12px;
                }

                /* AI Loading & Results */
                .ai-loading { display: none; text-align: center; padding: 30px; }
                .spinner {
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #0f3d37;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 16px;
                }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

                .ai-result { display: none; padding: 24px; border-radius: 8px; margin-top: 20px; text-align: center; }
                .result-repairable { background: #ecfdf5; border: 1px solid #10b981; color: #065f46; }
                .result-unrepairable { background: #fff7ed; border: 1px solid #f97316; color: #9a3412; }

                .result-title { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
                .result-desc { font-size: 14px; margin-bottom: 20px; line-height: 1.6; }

                .action-btn {
                    padding: 12px 28px;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 700;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-repair { background: #10b981; color: #fff; }
                .btn-repair:hover { background: #059669; }
                .btn-sell { background: #f97316; color: #fff; }
                .btn-sell:hover { background: #ea580c; }
            </style>
        </head>
        <body>
            <nav class="navbar">
                <div class="navbar-brand">
                    🛡️ REPAIR+ <span class="brand-badge">Authorized Admin</span>
                </div>
                <div class="user-info">
                    <span>Logged in as: <strong>${username}</strong></span>
                    <a href="/" class="btn-logout">Sign Out</a>
                </div>
            </nav>

            <div class="main-container">
                <div class="dashboard-card">
                    <div class="section-header">
                        <h2>AI Camera Scan & Object Repairability</h2>
                        <p>Use your live camera scanner or upload an image file for immediate AI structural analysis.</p>
                    </div>

                    <!-- Input Methods Selection -->
                    <div class="input-methods" id="inputMethods">
                        <!-- Camera Scan Option -->
                        <div class="action-card" onclick="startCameraScan()">
                            <div class="action-icon">📹</div>
                            <div class="action-title">Live Camera Scan</div>
                            <div class="action-desc">Scan item directly using device camera</div>
                        </div>

                        <!-- File Upload Option -->
                        <label class="action-card" style="display: block; margin: 0;">
                            <div class="action-icon">📁</div>
                            <div class="action-title">Upload Image File</div>
                            <div class="action-desc">Select existing photo from device storage</div>
                            <input type="file" class="file-input" id="imageInput" accept="image/*" onchange="handleImageUpload(event)">
                        </label>
                    </div>

                    <!-- Live Camera Feed Box -->
                    <div class="camera-container" id="cameraContainer">
                        <video id="videoFeed" autoplay playsinline></video>
                        <div class="capture-bar">
                            <button onclick="captureCameraSnapshot()" class="action-btn btn-repair" style="padding: 8px 20px; font-size:13px;">Capture Photo 📸</button>
                            <button onclick="stopCameraScan()" style="padding: 8px 20px; font-size:13px; background:#64748b; color:#fff; border:none; border-radius:6px; cursor:pointer;">Cancel</button>
                        </div>
                    </div>
                    <canvas id="snapshotCanvas" style="display:none;"></canvas>

                    <!-- Image Preview Area -->
                    <div class="preview-container" id="previewContainer">
                        <img id="imagePreview" class="preview-img" src="" alt="Captured Item">
                        <div>
                            <button onclick="resetScanner()" style="font-size:12px; padding:4px 10px; cursor:pointer; background:#e2e8f0; border:none; border-radius:4px;">Scan Another Item</button>
                        </div>
                    </div>

                    <!-- AI Loading & Processing View -->
                    <div class="ai-loading" id="aiLoading">
                        <div class="spinner"></div>
                        <h3 style="color: #0f3d37;">AI Vision Agent Scanning Object...</h3>
                        <p style="color: #64748b; font-size: 13px; margin-top: 4px;" id="loadingStatus">Analyzing structural fractures and calculating repair score...</p>
                    </div>

                    <!-- Repairable Result Box -->
                    <div class="ai-result result-repairable" id="repairableResult">
                        <div class="result-title">✅ Object is Repairable!</div>
                        <div class="result-desc">
                            <strong>AI Vision Analysis:</strong> Minor wear and surface fault detected. Repair feasibility rating: <strong>94%</strong>.<br>
                            We can schedule a pickup, restore the item professionally, and return it to you.
                        </div>
                        <button class="action-btn btn-repair" onclick="alert('Repair order created! Our logistics team will contact you for pickup.')">
                            Request Pickup & Repair 🚚
                        </button>
                    </div>

                    <!-- Unrepairable Result Box -->
                    <div class="ai-result result-unrepairable" id="unrepairableResult">
                        <div class="result-title">⚠️ Object is Unrepairable</div>
                        <div class="result-desc">
                            <strong>AI Vision Analysis:</strong> Severe structural integrity compromise detected. Repair feasibility rating: <strong>12%</strong>.<br>
                            Don't discard it! Sell it to REPAIR+ for recycling and get paid instantly.
                        </div>
                        <button class="action-btn btn-sell" onclick="alert('Buyback offer accepted! We will send a cash offer and collect the item.')">
                            Sell to REPAIR+ & Get Paid 💰
                        </button>
                    </div>

                    <!-- Quick Simulator Testing Controls -->
                    <div style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px; text-align: center;">
                        <span style="font-size: 12px; color: #94a3b8; display: block; margin-bottom: 8px;">(Quick Test Simulator Controls)</span>
                        <button onclick="runAiAgent(true)" style="font-size: 12px; padding: 6px 12px; cursor: pointer; background: #e2e8f0; border: none; border-radius: 4px;">Simulate: Fixable Item</button>
                        <button onclick="runAiAgent(false)" style="font-size: 12px; padding: 6px 12px; cursor: pointer; background: #e2e8f0; border: none; border-radius: 4px; margin-left: 8px;">Simulate: Unfixable Item (Buyback)</button>
                    </div>
                </div>
            </div>

            <script>
                let mediaStream = null;

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

                    const randomOutcome = Math.random() > 0.5;
                    runAiAgent(randomOutcome);
                }

                function handleImageUpload(event) {
                    const file = event.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            document.getElementById('imagePreview').src = e.target.result;
                            document.getElementById('inputMethods').style.display = 'none';
                            document.getElementById('previewContainer').style.display = 'block';
                            
                            const randomOutcome = Math.random() > 0.5;
                            runAiAgent(randomOutcome);
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
                    }, 2200);
                }
            </script>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log('REPAIR+ Secure Portal with Camera Scan is running at http://localhost:3000');
});