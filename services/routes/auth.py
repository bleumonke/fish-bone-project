from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from passlib.hash import bcrypt
from jose import JWTError, jwt
from typing import Dict, Optional
from datetime import datetime, timedelta

router = APIRouter(prefix="/auth", tags=["Auth"])

fake_users_db: Dict[str, Dict] = {}

SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

class SignupModel(BaseModel):
    email: EmailStr
    full_name: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class User(BaseModel):
    email: EmailStr
    full_name: str

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_password(plain_password, hashed_password):
    return bcrypt.verify(plain_password, hashed_password)

def get_password_hash(password):
    return bcrypt.hash(password)

def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None or email not in fake_users_db:
            raise HTTPException(status_code=401, detail="Invalid token or user not found")
        user_data = fake_users_db[email]
        return User(email=email, full_name=user_data["full_name"])
    except JWTError:
        raise HTTPException(status_code=401, detail="Token is invalid or expired")

@router.post("/signup", status_code=201)
def signup(user: SignupModel):
    if user.email in fake_users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pw = get_password_hash(user.password)
    fake_users_db[user.email] = {
        "email": user.email,
        "full_name": user.full_name,
        "hashed_password": hashed_pw,
    }
    return {"msg": "User created successfully"}

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = fake_users_db.get(form_data.username)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token_data = {"sub": user["email"]}
    access_token = create_access_token(
        data=token_data,
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=User)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user