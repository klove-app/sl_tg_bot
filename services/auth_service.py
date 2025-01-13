from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from database.models.user import User
from database.base import get_db
import config.config as cfg

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthService:
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def get_password_hash(password: str) -> str:
        return pwd_context.hash(password)

    @staticmethod
    def get_user_by_email(email: str) -> Optional[User]:
        db = next(get_db())
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def register_user(email: str, password: str, telegram_id: Optional[str] = None) -> User:
        db = next(get_db())
        
        # Проверяем, существует ли пользователь с таким email
        if AuthService.get_user_by_email(email):
            raise ValueError("Email уже зарегистрирован")

        # Если указан telegram_id, проверяем существует ли пользователь
        if telegram_id:
            existing_user = User.get_by_id(telegram_id)
            if existing_user:
                # Обновляем существующего пользователя
                existing_user.email = email
                existing_user.password_hash = AuthService.get_password_hash(password)
                existing_user.auth_type = 'both'  # и telegram и email
                existing_user.save()
                return existing_user

        # Создаем нового пользователя
        user = User(
            user_id=telegram_id or str(datetime.utcnow().timestamp()),
            email=email,
            password_hash=AuthService.get_password_hash(password),
            auth_type='email',
            username=email.split('@')[0]  # временное решение
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def authenticate_user(email: str, password: str) -> Optional[User]:
        user = AuthService.get_user_by_email(email)
        if not user or not user.password_hash:
            return None
        if not AuthService.verify_password(password, user.password_hash):
            return None
        
        # Обновляем время последнего входа
        user.last_login = datetime.utcnow()
        user.save()
        return user

    @staticmethod
    def create_access_token(data: dict) -> str:
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=cfg.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, cfg.SECRET_KEY, algorithm=cfg.ALGORITHM)
        return encoded_jwt

    @staticmethod
    def verify_token(token: str) -> Optional[str]:
        try:
            payload = jwt.decode(token, cfg.SECRET_KEY, algorithms=[cfg.ALGORITHM])
            user_id: str = payload.get("sub")
            if user_id is None:
                return None
            return user_id
        except JWTError:
            return None 