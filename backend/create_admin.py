import os
import sys
from getpass import getpass
from sqlalchemy.orm import Session
from passlib.context import CryptContext

# --- Phần thiết lập đường dẫn (Path Setup) ---
# Thêm thư mục gốc của dự án vào Python path
# Điều này cho phép script import các module từ 'app' như 'app.models', 'app.db'
# mà không gặp lỗi ModuleNotFoundError.
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
sys.path.append(PROJECT_ROOT)
# ---------------------------------------------

# --- Import các thành phần cần thiết từ ứng dụng của bạn ---
# Giả sử SessionLocal được định nghĩa trong app/db/database.py
from app.db.database import SessionLocal 
from app.models.user import User, UserRole
# ---------------------------------------------------------

# Định nghĩa context để băm mật khẩu, giống như trong service của bạn
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_super_user(db: Session):
    """
    Hàm chính để tạo tài khoản superuser (admin) qua giao diện dòng lệnh.
    """
    print("--- Creating Superuser (Admin) ---")
    
    try:
        # 1. Lấy thông tin từ người dùng
        first_name = input("Enter admin's first name: ").strip()
        last_name = input("Enter admin's last name: ").strip()
        email = input("Enter admin's email: ").strip()
        phone_number = input("Enter admin's phone number: ").strip()
        
        # Dùng getpass để ẩn mật khẩu khi nhập
        password = getpass("Enter password: ")
        confirm_password = getpass("Confirm password: ")

        if not all([first_name, last_name, email, phone_number, password]):
            print("\n[Error] All fields are required. Aborting.")
            return

        if password != confirm_password:
            print("\n[Error] Passwords do not match. Aborting.")
            return

        # 2. Kiểm tra xem người dùng đã tồn tại chưa
        if db.query(User).filter(User.email == email).first():
            print(f"\n[Error] User with email '{email}' already exists. Aborting.")
            return
        
        if db.query(User).filter(User.phone_number == phone_number).first():
            print(f"\n[Error] User with phone number '{phone_number}' already exists. Aborting.")
            return

        # 3. Băm mật khẩu
        hashed_password = pwd_context.hash(password)

        # 4. Tạo đối tượng User với vai trò là ADMIN
        admin_user = User(
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone_number=phone_number,
            password_hash=hashed_password,
            role=UserRole.ADMIN  # <-- ĐÂY LÀ BƯỚC QUAN TRỌNG NHẤT
        )

        # 5. Lưu vào cơ sở dữ liệu
        db.add(admin_user)
        db.commit()

        print(f"\n[Success] Admin user '{email}' created successfully!")

    except Exception as e:
        print(f"\n[Error] An unexpected error occurred: {e}")
        db.rollback() # Hoàn tác lại các thay đổi nếu có lỗi

def main():
    # Lấy một session database độc lập
    db: Session = SessionLocal()
    try:
        create_super_user(db)
    finally:
        # Luôn đảm bảo session được đóng lại sau khi hoàn tất
        print("--- Closing database session ---")
        db.close()

# Chạy hàm main khi script được thực thi trực tiếp
if __name__ == "__main__":
    main()