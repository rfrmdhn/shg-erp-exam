-- Siloam Vendor Management — seed data (PostgreSQL)
-- Equivalent to the Sequelize seeders in ../seeders.
-- The admin password_hash below is bcrypt('admin123', 10). Login: admin / admin123

INSERT INTO units (id, name) VALUES
    (1, 'Siloam Lippo Village'),
    (2, 'Siloam Bogor'),
    (3, 'Siloam Makassar')
ON CONFLICT (name) DO NOTHING;

-- keep the serial sequence in sync after explicit id inserts
SELECT setval(pg_get_serial_sequence('units', 'id'), (SELECT MAX(id) FROM units));

INSERT INTO users (username, password_hash, name, role) VALUES
    ('admin', '$2a$10$SKmeqTEfHIip4cvHAE4IiOz5Krbqf2Mu4IjVyLYpU2Vh8HV.L97vy', 'Administrator', 'admin')
ON CONFLICT (username) DO NOTHING;

INSERT INTO vendors (vendor_id, name, address, unit_id) VALUES
    ('Vendor001', 'Vendor 001', 'Tangerang', 1),
    ('Vendor002', 'Vendor 002', 'Jakarta Pusat', 1),
    ('Vendor003', 'Vendor 003', 'Bangka', 1),
    ('Vendor004', 'Vendor 004', 'Tangerang', 1),
    ('Vendor001', 'Bogor Supplier A', 'Bogor', 2),
    ('Vendor002', 'Bogor Supplier B', 'Cibinong', 2),
    ('Vendor001', 'Makassar Supplier A', 'Makassar', 3)
ON CONFLICT (vendor_id, unit_id) DO NOTHING;
