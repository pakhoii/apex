import json
import sys
import os
import urllib.request
import urllib.error
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# Add current directory to path
sys.path.append(os.getcwd())

from app.models.order import Order
from app.models.payment import Payment
from app.models.user import User
from app.core.enums import OrderStatus, PaymentStatus, UserRole

# Database setup
DATABASE_URL = "mysql+pymysql://apex:iloveanime@localhost:3307/apex"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_test_data(db):
    # Create a dummy user if not exists
    user = db.query(User).filter(User.email == "test_cancel@example.com").first()
    if not user:
        user = User(
            email="test_cancel@example.com",
            password_hash="hashed_password",
            first_name="Test",
            last_name="Cancel User",
            role=UserRole.USER,
            phone_number="1234567890"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    # Create a PAID order
    paid_order = Order(
        user_id=user.id,
        shipping_address="123 Test St",
        order_date=datetime.now(),
        status=OrderStatus.PENDING
    )
    db.add(paid_order)
    db.commit()
    db.refresh(paid_order)
    
    # Use raw SQL to insert payment to avoid ORM mismatch with missing transaction_id column
    db.execute(text("""
        INSERT INTO payments (order_id, payment_date, amount, payment_method, status)
        VALUES (:order_id, :payment_date, :amount, :payment_method, :status)
    """), {
        "order_id": paid_order.id,
        "payment_date": datetime.now(),
        "amount": 1000,
        "payment_method": "credit_card",
        "status": PaymentStatus.PAID.value
    })
    db.commit()

    # Create a NOT PAID order
    unpaid_order = Order(
        user_id=user.id,
        shipping_address="456 Test St",
        order_date=datetime.now(),
        status=OrderStatus.PENDING
    )
    db.add(unpaid_order)
    db.commit()
    db.refresh(unpaid_order)

    return paid_order.id, unpaid_order.id

def make_request(url, data):
    req = urllib.request.Request(
        url, 
        data=json.dumps(data).encode('utf-8'), 
        headers={'Content-Type': 'application/json'}
    )
    try:
        with urllib.request.urlopen(req) as response:
            return response.getcode(), json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        try:
            return e.code, json.loads(body)
        except json.JSONDecodeError:
            return e.code, {"raw_body": body}
    except urllib.error.URLError as e:
        return 500, {"detail": str(e)}

def verify_cancel():
    db = SessionLocal()
    try:
        paid_order_id, unpaid_order_id = create_test_data(db)
        print(f"Created PAID order: {paid_order_id}")
        print(f"Created UNPAID order: {unpaid_order_id}")
    finally:
        db.close()

    base_url = "http://localhost:8000/api/v1/orders/cancel"

    # Test PAID order cancellation
    print(f"\nTesting cancellation for PAID order {paid_order_id}...")
    status, data = make_request(base_url, {"order_id": paid_order_id})
    if status == 200:
        print(f"Response: {data}")
        if data["status"] == "refunded":
            print("SUCCESS: Paid order refunded.")
        else:
            print(f"FAILURE: Expected 'refunded', got '{data['status']}'")
    else:
        print(f"FAILURE: API error {status} - {data}")

    # Test UNPAID order cancellation
    print(f"\nTesting cancellation for UNPAID order {unpaid_order_id}...")
    status, data = make_request(base_url, {"order_id": unpaid_order_id})
    if status == 200:
        print(f"Response: {data}")
        if data["status"] == "cancelled":
            print("SUCCESS: Unpaid order cancelled.")
        else:
            print(f"FAILURE: Expected 'cancelled', got '{data['status']}'")
    else:
        print(f"FAILURE: API error {status} - {data}")

if __name__ == "__main__":
    verify_cancel()
