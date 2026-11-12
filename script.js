:root {
    --primary: #000000;
    --bg-white: #ffffff;
    --text-dark: #333333;
    --glass: rgba(255, 255, 255, 0.85);
    --border: #e0e0e0;
}

body {
    margin: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: var(--text-dark);
    background-color: var(--bg-white);
    overflow-x: hidden;
}

/* --- Live Wallpaper Background --- */
#live-wallpaper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    background: linear-gradient(45deg, #f0f0f0, #ffffff, #e6e6e6, #fafafa);
    background-size: 400% 400%;
    animation: gradientBG 15s ease infinite;
}

@keyframes gradientBG {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

/* --- Layout --- */
.container {
    max-width: 400px;
    margin: 40px auto;
    padding: 20px;
    position: relative;
}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.logo {
    font-weight: bold;
    border: 2px solid var(--primary);
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    background: white;
}

h1 {
    font-size: 20px;
    margin: 0;
    text-align: right;
}

.card {
    background: var(--glass);
    backdrop-filter: blur(10px);
    border: 1px solid var(--border);
    border-radius: 15px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
}

h2 {
    font-size: 18px;
    margin-top: 0;
    border-bottom: 1px solid var(--border);
    padding-bottom: 10px;
}

/* --- Forms & Buttons --- */
input {
    width: 100%;
    padding: 12px;
    margin: 8px 0;
    border: 1px solid var(--border);
    border-radius: 8px;
    box-sizing: border-box;
    outline: none;
    font-size: 16px;
}

input:focus {
    border-color: var(--primary);
}

button {
    width: 100%;
    padding: 12px;
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    transition: 0.3s;
    font-size: 16px;
}

button:hover {
    background-color: #333;
}

.btn-whatsapp {
    background-color: #25D366;
    color: white;
    text-decoration: none;
    display: block;
    text-align: center;
    padding: 12px;
    border-radius: 8px;
    font-weight: bold;
    margin-top: 10px;
}

.account-display {
    font-size: 24px;
    font-weight: bold;
    letter-spacing: 2px;
    text-align: center;
    padding: 15px;
    background: #f9f9f9;
    border-radius: 8px;
    border: 1px dashed #ccc;
    margin: 15px 0;
    color: #000;
}

.error-msg {
    color: #ff3333;
    font-size: 13px;
    margin: 5px 0;
    min-height: 15px;
    text-align: center;
}

.text-link {
    display: block;
    text-align: center;
    font-size: 13px;
    color: #666;
    margin-top: 15px;
    cursor: pointer;
    text-decoration: underline;
}

#protected-content {
    animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}