-- Add sample venue inquiries for testing
INSERT INTO venue_inquiries (venue_id, full_name, email, phone, event_date, guest_count, message, status, created_at)
SELECT id, 'Rajesh Kumar', 'rajesh.kumar@example.com', '+91 9876543210', CURRENT_DATE + 45, 150, 
'Looking to book for wedding reception. Please share pricing for 150 guests.', 'pending', NOW() - INTERVAL '2 days'
FROM venues WHERE slug = 'grand-palace-hall' LIMIT 1;

INSERT INTO venue_inquiries (venue_id, full_name, email, phone, event_date, guest_count, message, status, created_at)
SELECT id, 'Priya Sharma', 'priya.sharma@example.com', '+91 8765432109', CURRENT_DATE + 60, 80,
'Planning engagement ceremony. Can we visit the venue?', 'pending', NOW() - INTERVAL '1 day'
FROM venues WHERE slug = 'royal-gardens-resort' LIMIT 1;

INSERT INTO venue_inquiries (venue_id, full_name, email, phone, event_date, guest_count, message, status, created_at)
SELECT id, 'Amit Patel', 'amit.patel@example.com', '+91 7654321098', CURRENT_DATE + 30, 200,
'Company annual day event for 200 employees. Do you provide catering?', 'responded', NOW() - INTERVAL '5 days'
FROM venues WHERE slug = 'lakeside-convention-center' LIMIT 1;

INSERT INTO venue_inquiries (venue_id, full_name, email, phone, event_date, guest_count, message, status, created_at)
SELECT id, 'Sneha Reddy', 'sneha.reddy@example.com', '+91 6543210987', CURRENT_DATE + 90, 120,
'Birthday party in garden setting. Budget 1.5 lakhs for 120 people.', 'pending', NOW() - INTERVAL '3 hours'
FROM venues WHERE slug = 'sunset-terrace-banquet' LIMIT 1;

INSERT INTO venue_inquiries (venue_id, full_name, email, phone, event_date, guest_count, message, status, created_at)
SELECT id, 'Vikram Singh', 'vikram.singh@example.com', '+91 5432109876', CURRENT_DATE + 120, 300,
'Grand wedding venue for 300 guests. Need parking for 100 cars.', 'converted', NOW() - INTERVAL '10 days'
FROM venues WHERE slug = 'grand-palace-hall' LIMIT 1;

INSERT INTO venue_inquiries (venue_id, full_name, email, phone, event_date, guest_count, message, status, created_at)
SELECT id, 'Meera Joshi', 'meera.joshi@example.com', '+91 4321098765', CURRENT_DATE + 20, 50,
'Anniversary celebration for 50 family members. Allow outside catering?', 'pending', NOW() - INTERVAL '12 hours'
FROM venues WHERE slug = 'royal-gardens-resort' LIMIT 1;

INSERT INTO venue_inquiries (venue_id, full_name, email, phone, event_date, guest_count, message, status, created_at)
SELECT id, 'Arjun Mehta', 'arjun.mehta@example.com', '+91 3210987654', CURRENT_DATE + 75, 180,
'Product launch event. Need AV equipment and stage for 180 people.', 'responded', NOW() - INTERVAL '4 days'
FROM venues WHERE slug = 'lakeside-convention-center' LIMIT 1;

INSERT INTO venue_inquiries (venue_id, full_name, email, phone, event_date, guest_count, message, status, created_at)
SELECT id, 'Kavya Nair', 'kavya.nair@example.com', '+91 2109876543', CURRENT_DATE + 40, 100,
'Baby shower function with good lighting for photography. 100 guests.', 'rejected', NOW() - INTERVAL '7 days'
FROM venues WHERE slug = 'sunset-terrace-banquet' LIMIT 1;

SELECT '✅ Added ' || COUNT(*) || ' sample inquiries' as result
FROM venue_inquiries WHERE created_at > NOW() - INTERVAL '11 days';
