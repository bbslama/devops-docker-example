CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL
);

INSERT INTO messages (title, content) VALUES 
('Some data from MySQL DB', 'This record was inserted using an initialization script'),
('Other data from MySQL DB', 'This record was also inserted using the same initialization script');

