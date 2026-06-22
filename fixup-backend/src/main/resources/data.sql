INSERT INTO categories (name, description) 
VALUES 
('Plumbing', 'Water pipes, leaks, installations'),
('Electrical', 'Wiring, fixtures, repairs'),
('Carpentry', 'Furniture, woodwork, repairs'),
('Blacksmith', 'Metal work and fabrication'),
('Painting', 'Interior and exterior painting'),
('Cleaning', 'Home and office cleaning'),
('AC Technician', 'AC installation and repair')
ON CONFLICT (name) DO NOTHING;