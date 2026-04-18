

from fastapi import FastAPI
from routers import vaccination_sessions
from routers.page_routers import dashboard
from routers import auth, users, password, roles, patients, role_permission, appointments # khai báo router auth
from fastapi.middleware.cors import CORSMiddleware
# thêm middleware CORS để cho phép truy cập từ các nguồn khác nhau
# CORS là Cross-Origin Resource Sharing có nghĩa là chia sẻ tài nguyên giữa các nguồn khác nhau
app = FastAPI(
    title= "Vaccination Management",
    description= "Simple API to manage patients, vaccines, inventorys",
    version= "1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
# cấu hình CORS để cho phép tất cả các nguồn, phương thức và headers
app.include_router(auth.router) # bao gồm router auth vào ứng dụng chính
app.include_router(users.router) # bao gồm router users vào ứng dụng chính
app.include_router(password.router)
app.include_router(roles.router)
app.include_router(patients.router)
app.include_router(role_permission.router)
app.include_router(appointments.router)
app.include_router(dashboard.router)
app.include_router(vaccination_sessions.router)

@app.get("/") # endpoint gốc để kiểm tra trạng thái ứng dụng
def root():
    return {"status": "ok"}

