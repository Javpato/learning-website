// The single sample database used by every interactive SQL exercise across the
// course. It lives only in the visitor's browser (in-memory SQLite via sql.js)
// and is reseeded on every page load — there is no shared/server database.
//
// A small but realistic e-commerce schema: customers place orders, each order
// has line items referencing products, products belong to categories, and
// orders are handled by employees. Rich enough for SELECT, filtering, JOINs,
// dates, CASE and aggregation without being overwhelming.

export const SEED_SQL = /* sql */ `
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS customers;

CREATE TABLE categories (
  category_id   INTEGER PRIMARY KEY,
  name          TEXT NOT NULL
);

CREATE TABLE products (
  product_id    INTEGER PRIMARY KEY,
  name          TEXT NOT NULL,
  category_id   INTEGER REFERENCES categories(category_id),
  price         REAL NOT NULL,
  stock         INTEGER NOT NULL
);

CREATE TABLE customers (
  customer_id   INTEGER PRIMARY KEY,
  first_name    TEXT NOT NULL,
  last_name     TEXT NOT NULL,
  country       TEXT,
  email         TEXT,
  signup_date   TEXT NOT NULL          -- ISO 'YYYY-MM-DD'
);

CREATE TABLE employees (
  employee_id   INTEGER PRIMARY KEY,
  first_name    TEXT NOT NULL,
  last_name     TEXT NOT NULL,
  title         TEXT,
  hire_date     TEXT NOT NULL,
  salary        REAL,
  manager_id    INTEGER REFERENCES employees(employee_id)
);

CREATE TABLE orders (
  order_id      INTEGER PRIMARY KEY,
  customer_id   INTEGER REFERENCES customers(customer_id),
  employee_id   INTEGER REFERENCES employees(employee_id),
  order_date    TEXT NOT NULL,         -- ISO 'YYYY-MM-DD'
  status        TEXT NOT NULL          -- 'shipped' | 'pending' | 'cancelled'
);

CREATE TABLE order_items (
  order_id      INTEGER REFERENCES orders(order_id),
  product_id    INTEGER REFERENCES products(product_id),
  quantity      INTEGER NOT NULL,
  unit_price    REAL NOT NULL,
  PRIMARY KEY (order_id, product_id)
);

INSERT INTO categories (category_id, name) VALUES
  (1, 'Electronics'),
  (2, 'Books'),
  (3, 'Home & Kitchen'),
  (4, 'Toys');

INSERT INTO products (product_id, name, category_id, price, stock) VALUES
  (1,  'Wireless Mouse',        1,  24.99,  120),
  (2,  'Mechanical Keyboard',   1,  79.50,   45),
  (3,  'USB-C Hub',             1,  39.00,    0),
  (4,  'Noise-Cancel Headset',  1, 199.99,   18),
  (5,  'SQL in 30 Days',        2,  29.95,  200),
  (6,  'Clean Code',            2,  34.00,   75),
  (7,  'The Pragmatic Dev',     2,  41.50,   33),
  (8,  'Ceramic Mug',           3,   9.99,  300),
  (9,  'Chef Knife',            3,  59.00,   25),
  (10, 'Espresso Machine',      3, 249.00,    7),
  (11, 'Building Blocks Set',   4,  44.95,   60),
  (12, 'Puzzle 1000pc',         4,  14.99,   90),
  (13, 'Mystery Gadget',        1,  12.00,    5);   -- no category-less rows, but cheap

INSERT INTO customers (customer_id, first_name, last_name, country, email, signup_date) VALUES
  (1,  'Marisol', 'Garcia',   'Spain',   'marisol@example.com', '2023-01-15'),
  (2,  'Liam',    'O''Brien',  'Ireland', 'liam@example.com',    '2023-02-02'),
  (3,  'Yuki',    'Tanaka',    'Japan',   NULL,                  '2023-02-20'),
  (4,  'Amara',   'Okafor',    'Nigeria', 'amara@example.com',   '2023-03-11'),
  (5,  'Sven',    'Larsson',   'Sweden',  'sven@example.com',    '2023-05-08'),
  (6,  'Paula',   'Mendes',    'Spain',   'paula@example.com',   '2023-06-30'),
  (7,  'Chen',    'Wei',       'China',   'chen@example.com',    '2023-07-19'),
  (8,  'Noah',    'Smith',     'USA',     'noah@example.com',    '2023-09-01'),
  (9,  'Fatima',  'Hassan',    'Egypt',   NULL,                  '2024-01-04'),
  (10, 'Diego',   'Fernandez', 'Spain',   'diego@example.com',   '2024-03-22');

INSERT INTO employees (employee_id, first_name, last_name, title, hire_date, salary, manager_id) VALUES
  (1, 'Eva',   'Lindqvist', 'Sales Director',  '2020-04-01', 92000, NULL),
  (2, 'Tom',   'Becker',    'Sales Rep',       '2021-06-15', 54000, 1),
  (3, 'Aisha', 'Rahman',    'Sales Rep',       '2022-02-10', 51000, 1),
  (4, 'Marco', 'Rossi',     'Support Lead',    '2021-11-20', 61000, 1);

INSERT INTO orders (order_id, customer_id, employee_id, order_date, status) VALUES
  (1001, 1,  2, '2024-01-10', 'shipped'),
  (1002, 2,  3, '2024-01-12', 'shipped'),
  (1003, 1,  2, '2024-02-05', 'cancelled'),
  (1004, 4,  3, '2024-02-18', 'shipped'),
  (1005, 6,  2, '2024-03-02', 'pending'),
  (1006, 8,  3, '2024-03-14', 'shipped'),
  (1007, 5,  2, '2024-04-01', 'shipped'),
  (1008, 7,  3, '2024-04-20', 'pending'),
  (1009, 1,  2, '2024-05-09', 'shipped'),
  (1010, 10, 3, '2024-06-15', 'shipped'),
  (1011, 6,  2, '2024-06-28', 'cancelled'),
  (1012, 8,  3, '2024-07-04', 'shipped');

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
  (1001, 1,  2, 24.99),
  (1001, 5,  1, 29.95),
  (1002, 2,  1, 79.50),
  (1003, 4,  1, 199.99),
  (1004, 8,  4,  9.99),
  (1004, 9,  1, 59.00),
  (1005, 10, 1, 249.00),
  (1006, 5,  3, 29.95),
  (1006, 6,  1, 34.00),
  (1007, 11, 2, 44.95),
  (1008, 2,  1, 79.50),
  (1008, 1,  1, 24.99),
  (1009, 7,  2, 41.50),
  (1010, 12, 5, 14.99),
  (1011, 4,  1, 199.99),
  (1012, 8,  6,  9.99),
  (1012, 5,  2, 29.95);
`;

// A compact human-readable description of the schema, shown on the "Sample
// database" reference card and (optionally) inside exercises.
export type TableInfo = { name: string; columns: string; note: string };

export const SCHEMA: TableInfo[] = [
  { name: "categories", columns: "category_id, name", note: "Product categories." },
  { name: "products", columns: "product_id, name, category_id, price, stock", note: "Catalogue; category_id → categories." },
  { name: "customers", columns: "customer_id, first_name, last_name, country, email, signup_date", note: "Some emails are NULL." },
  { name: "employees", columns: "employee_id, first_name, last_name, title, hire_date, salary, manager_id", note: "manager_id is a self-reference." },
  { name: "orders", columns: "order_id, customer_id, employee_id, order_date, status", note: "status ∈ shipped/pending/cancelled." },
  { name: "order_items", columns: "order_id, product_id, quantity, unit_price", note: "Line items; links orders ↔ products." },
];
