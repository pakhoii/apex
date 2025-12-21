CREATE TABLE IF NOT EXISTS users (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(15) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    is_2fa_enabled BOOLEAN DEFAULT FALSE     
    -- otp_secret VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS brands (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    logo_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS models (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    brand_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    price BIGINT NOT NULL,
    year INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    image_url VARCHAR(255),
    FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER NOT NULL,
    actor_id INTEGER NOT NULL,
    action VARCHAR(100) NOT NULL,
    details VARCHAR(255),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (actor_id) REFERENCES users(id)

CREATE TABLE IF NOT EXISTS orders (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    shipping_address VARCHAR(255) NOT NULL,
    order_date DATETIME NOT NULL,
    status VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)

CREATE TABLE IF NOT EXISTS order_items (
    order_id INTEGER NOT NULL,
    model_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price BIGINT NOT NULL, 
    PRIMARY KEY (order_id, model_id),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (model_id) REFERENCES models(id) 

CREATE TABLE IF NOT EXISTS payments (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    order_id INTEGER NOT NULL,
    payment_date DATETIME NOT NULL,
    amount BIGINT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(255), -- Mới thêm từ Python code (nullable=True)
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS carts (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cart_items (
    cart_id INTEGER NOT NULL,
    model_id INTEGER NOT NULL,
    unit_price BIGINT NOT NULL,
    quantity INTEGER NOT NULL,
    PRIMARY KEY (cart_id, model_id),
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    FOREIGN KEY (model_id) REFERENCES models(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS wishlists (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS wishlist_items (
    wishlist_id INTEGER NOT NULL,
    model_id INTEGER NOT NULL,
    PRIMARY KEY (wishlist_id, model_id),
    FOREIGN KEY (wishlist_id) REFERENCES wishlists(id) ON DELETE CASCADE,
    FOREIGN KEY (model_id) REFERENCES models(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    sent_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS testdrive_records (
    message_id INTEGER NOT NULL,
    model_id INTEGER NOT NULL,
    scheduled_date DATETIME NOT NULL,
    status VARCHAR(50) NOT NULL,
    PRIMARY KEY (message_id, model_id),
    FOREIGN KEY (message_id) REFERENCES contact_messages(id) ON DELETE CASCADE,
    FOREIGN KEY (model_id) REFERENCES models(id)
);

CREATE TABLE IF NOT EXISTS testdrive_slots (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    start_time TIME NOT NULL UNIQUE,
    end_time TIME NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE TABLE IF NOT EXISTS testdrive_bookings (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    model_id INTEGER NOT NULL,
    slot_id INTEGER NOT NULL,
    scheduled_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (model_id) REFERENCES models(id),
    FOREIGN KEY (slot_id) REFERENCES testdrive_slots(id),
    CONSTRAINT uq_model_slot_date UNIQUE (model_id, slot_id, scheduled_date)
);