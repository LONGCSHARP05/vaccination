from passlib.context import CryptContext
from enum import Enum

pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto"
)

class HashPurpose(str, Enum):
    PASSWORD = "password"
    OTP = "otp"

HASH_POLICY = {
    HashPurpose.PASSWORD: {"max_length": 128},
    HashPurpose.OTP: {"max_length": 10}
}

def hash_secret(secret: str, purpose: HashPurpose) -> str:
    policy = HASH_POLICY[purpose]
    secret = secret[:policy["max_length"]]
    return pwd_context.hash(secret)

def verify_secret(plain: str, hashed: str, purpose: HashPurpose) -> bool:
    policy = HASH_POLICY[purpose]
    plain = plain[:policy["max_length"]]
    return pwd_context.verify(plain, hashed)
