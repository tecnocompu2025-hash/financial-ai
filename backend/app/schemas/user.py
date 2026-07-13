from pydantic import BaseModel, EmailStr, Field, model_validator


class UserRegister(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

    @model_validator(mode="after")
    def password_is_secure(self):
        if not any(character.isdigit() for character in self.password) or not any(character.isalpha() for character in self.password):
            raise ValueError("Password must include letters and numbers")
        return self


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8, max_length=128)
    confirm_password: str

    @model_validator(mode="after")
    def passwords_match(self):
        if self.new_password != self.confirm_password:
            raise ValueError("Las contraseñas nuevas no coinciden")
        if not any(character.isdigit() for character in self.new_password) or not any(character.isalpha() for character in self.new_password):
            raise ValueError("La contraseña debe incluir letras y números")
        return self

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str = Field(min_length=20)
    new_password: str = Field(min_length=8, max_length=128)
    confirm_password: str
    @model_validator(mode="after")
    def passwords_match(self):
        if self.new_password != self.confirm_password: raise ValueError("Las contraseñas nuevas no coinciden")
        return self

    @model_validator(mode="after")
    def password_is_secure(self):
        if not any(character.isdigit() for character in self.new_password) or not any(character.isalpha() for character in self.new_password):
            raise ValueError("Password must include letters and numbers")
        return self


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        from_attributes = True
