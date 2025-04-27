USE sharespace;

-- 1. Temporarily turn off foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- 2. Truncate all tables (delete all data)
TRUNCATE TABLE messages;
TRUNCATE TABLE roommate_prefs;
TRUNCATE TABLE users;
TRUNCATE TABLE likes;

-- 3. Reset auto-increment IDs back to 1
ALTER TABLE messages AUTO_INCREMENT = 1;
ALTER TABLE roommate_prefs AUTO_INCREMENT = 1;
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE likes AUTO_INCREMENT = 1;

-- 4. Turn foreign key checks back on
SET FOREIGN_KEY_CHECKS = 1;