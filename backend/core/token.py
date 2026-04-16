from datetime import datetime, timedelta
from jose import jwt, JWTError

SECRET_KEY = "CHANGE_ME"
ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 25
REFRESH_TOKEN_EXPIRE_DAYS = 7


def create_tokens(user_uuid: str):

    access_token_payload = {
        "sub": user_uuid,
        "type": "access",
        "exp": datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }

    refresh_token_payload = {
        "sub": user_uuid,
        "type": "refresh",
        "exp": datetime.now() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    }

    access_token = jwt.encode(access_token_payload, SECRET_KEY, algorithm=ALGORITHM)
    refresh_token = jwt.encode(refresh_token_payload, SECRET_KEY, algorithm=ALGORITHM)

    return {"access_token":access_token, "refresh_token":refresh_token}


