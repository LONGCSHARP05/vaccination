import redis
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType

# import thư viện Redis và FastMail để gửi email

# Kết nối Redis (mặc định port 6379)
redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

# Cấu hình Mail
mail_conf = ConnectionConfig(
    MAIL_USERNAME="longcsharp05@gmail.com",
    MAIL_PASSWORD="ebbw rcod qsop wtpc",
    MAIL_FROM="longcsharp05@gmail.com",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)