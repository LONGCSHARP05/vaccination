# Các file/thư mục được bỏ qua (từ .gitignore)

- __pycache__/ — thư mục bytecode Python đã biên dịch.
- *.py[cod] — file Python biên dịch (.pyc, .pyo, ...).
- *$py.class — file biên dịch Java/Python tương tự (nếu có).
- .venv/, venv/, env/ — virtual environment.
- **/core/config.py — file cấu hình nhạy cảm (chứa secrets).
- **/core/auth.py — file xác thực (chứa secrets).
- .env, .env.local, .env.* — file biến môi trường (chứa mật khẩu, token).
- backend/core/config.py — file cấu hình trong thư mục backend.
- *.db — database SQLite local.
- .vscode/, .idea/ — cấu hình IDE/editor.
- .DS_Store — macOS Finder metadata.
- Thumbs.db — Windows Explorer metadata.
- *.log — file log.

Ghi chú: nếu bạn lưu mật khẩu trực tiếp trong database.py, cân nhắc di chuyển ra .env hoặc thêm file đó vào .gitignore.
