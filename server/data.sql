INSERT INTO tblAgriculturalStaff
(FirstName, LastName, Gender, Position, Department, ContactNumber, Email)
VALUES
('Admin', 'Admin', 'Male', 'System Administrator', 'Administrator', '', 'admin@example.com');



INSERT INTO tblUsers
(Username, PasswordHash, Email, Role, StaffID, Status)
VALUES
('Admin', '$2b$10$USe/6UHsgPmrCeOwKCVGr.m8xowu8JLcpbUOcTi3TmnOC6pW22pQq', 'admin@example.com', 'Admin', 1, 'Active');





INSERT INTO tblFarmers (FirstName, LastName, Gender, DateOfBirth, Address, ContactNumber, Email, FarmLocation, FarmSize, RegistrationDate)
VALUES 
('Juan', 'Dela Cruz', 'Male', '1985-03-15', '123 Rizal St, Manila', '09171234567', 'juan.delacruz@example.com', 'Quezon City', 2.5, '2023-01-10'),
('Maria', 'Santos', 'Female', '1990-07-22', '456 Mabini Ave, Cebu', '09281234567', 'maria.santos@example.com', 'Cebu City', 1.8, '2023-02-05'),
('Pedro', 'Garcia', 'Male', '1978-11-05', '789 Bonifacio Rd, Davao', '09391234567', 'pedro.garcia@example.com', 'Davao City', 3.0, '2023-01-20'),
('Ana', 'Reyes', 'Female', '1988-04-12', '1010 Mabuhay St, Baguio', '09451234567', 'ana.reyes@example.com', 'Baguio', 2.2, '2023-03-15'),
('Luis', 'Torres', 'Male', '1995-09-30', '2020 Sampaguita Ln, Iloilo', '09561234567', 'luis.torres@example.com', 'Iloilo City', 1.5, '2023-04-01'),
('Carmen', 'Lopez', 'Female', '1982-06-18', '3030 Poblacion St, Bacolod', '09671234567', 'carmen.lopez@example.com', 'Bacolod', 2.8, '2023-03-22'),
('Ramon', 'Martinez', 'Male', '1975-12-25', '4040 Mabini St, Zamboanga', '09781234567', 'ramon.martinez@example.com', 'Zamboanga City', 4.0, '2023-02-28'),
('Liza', 'Cruz', 'Female', '1992-08-10', '5050 Rizal Blvd, Legazpi', '09891234567', 'liza.cruz@example.com', 'Legazpi', 1.2, '2023-03-10'),
('Carlos', 'Navarro', 'Male', '1980-05-05', '6060 Bonifacio Ave, Tagaytay', '09901234567', 'carlos.navarro@example.com', 'Tagaytay', 3.5, '2023-01-30'),
('Sophia', 'Villanueva', 'Female', '1998-02-14', '7070 Mabuhay St, Pampanga', '09181234567', 'sophia.villanueva@example.com', 'San Fernando', 2.0, '2023-04-05');




INSERT INTO tblCrops 
(CropName, Category, Season, AverageYieldPerHectare, MarketPrice)
VALUES
-- 🌾 Grains
('Rice', 'Grains', 'Wet', 4.50, 22.00),
('Corn', 'Grains', 'Dry', 3.80, 18.50),

-- 🥕 Vegetables
('Tomato', 'Vegetables', 'Dry', 12.00, 45.00),
('Eggplant', 'Vegetables', 'Dry', 10.50, 35.00),
('Cabbage', 'Vegetables', 'Cool', 15.00, 28.00),
('Carrot', 'Vegetables', 'Cool', 14.00, 30.00),
('Onion', 'Vegetables', 'Dry', 9.00, 60.00),
('Garlic', 'Vegetables', 'Dry', 7.50, 120.00),

-- 🍌 Fruits
('Banana', 'Fruits', 'All Season', 20.00, 12.00),
('Mango', 'Fruits', 'Summer', 8.00, 80.00),
('Pineapple', 'Fruits', 'All Season', 18.00, 25.00),
('Papaya', 'Fruits', 'All Season', 22.00, 20.00),

-- ☕ Cash Crops
('Coffee', 'Cash Crop', 'Rainy', 2.50, 150.00),
('Coconut', 'Cash Crop', 'All Season', 6.00, 18.00),
('Sugarcane', 'Cash Crop', 'Dry', 60.00, 3.50),

-- 🌱 Root Crops
('Sweet Potato', 'Root Crop', 'Dry', 11.00, 25.00),
('Cassava', 'Root Crop', 'Dry', 13.00, 18.00),
('Taro', 'Root Crop', 'Wet', 9.50, 40.00);




INSERT INTO tblLivestock (Type, Breed, AverageProduction, MarketPrice) VALUES
('Cattle', 'Holstein', '20 liters/day', 45000.00),
('Cattle', 'Brahman', '15 liters/day', 40000.00),
('Cattle', 'Angus', '18 liters/day', 47000.00),
('Poultry', 'Leghorn', '250 eggs/year', 250.00),
('Poultry', 'Rhode Island Red', '200 eggs/year', 300.00),
('Poultry', 'Pekin Duck', '180 eggs/year', 350.00),
('Swine', 'Landrace', '120 kg/litter', 15000.00),
('Swine', 'Duroc', '110 kg/litter', 14000.00),
('Swine', 'Berkshire', '100 kg/litter', 16000.00),
('Goat', 'Boer', '2 liters/day', 12000.00),
('Goat', 'Saanen', '1.5 liters/day', 10000.00),
('Goat', 'Nubian', '1.8 liters/day', 11000.00);




INSERT INTO tblPrograms (ProgramName, Description, StartDate, EndDate, Budget, TargetBeneficiaries)
VALUES
('Livestock Development', 'Support farmers with livestock breeding and care programs.', '2026-01-15', '2026-06-15', 500000.00, 120),
('Organic Farming Training', 'Train farmers on sustainable organic farming methods.', '2026-02-01', '2026-05-30', 300000.00, 80),
('Irrigation Support Project', 'Provide irrigation equipment and training to increase crop yields.', '2026-03-01', '2026-08-31', 750000.00, 200),
('Fisheries Enhancement', 'Enhance local fisheries with fishpond development and technical assistance.', '2026-04-01', '2026-09-30', 600000.00, 150),
('Community Agro-Enterprise', 'Develop small community businesses for processing and selling agricultural products.', '2026-05-01', '2026-10-31', 450000.00, 100);


 

-- Example corrected tblReportsAndMonitoring
INSERT INTO tblReportsAndMonitoring 
  (FarmerID, CropID, LivestockID, ReportDate, ProductionVolume, Issues, Remarks)
VALUES
  (1, 3, NULL, '2026-04-01', '50 kg', 'Pests observed on leaves', 'Applied organic pesticide'), -- CropID 3 = Tomato
  (2, NULL, 4, '2026-04-02', '10 liters', 'Low milk yield', 'Fed high-protein feed'),            -- LivestockID 4 = Leghorn
  (3, 4, 5, '2026-04-03', '30 kg, 5 liters', 'Mild disease in livestock', 'Administered vaccine'),
  (1, 5, NULL, '2026-04-04', '40 kg', NULL, 'No issues this week'),
  (4, NULL, 6, '2026-04-05', '15 liters', 'Cows stressed due to heat', 'Moved to shaded area'),
  (5, 7, NULL, '2026-04-06', '60 kg', 'Fungal infection on crop', 'Used fungicide spray');





INSERT INTO tblSubsidyDistribution
(ProgramID, TotalAmount, DistributionDate, Remarks)
VALUES
(1, 80000.00, '2026-01-20', 'Livestock support batch 1'),
(2, 35000.00, '2026-02-10', 'Organic farming assistance'),
(3, 140000.00, '2026-03-10', 'Irrigation support batch'),
(4, 80000.00, '2026-04-05', 'Fisheries assistance'),
(5, 55000.00, '2026-05-10', 'Agro-enterprise support');



 

 -- =========================
-- 7. SUBSIDY DISTRIBUTION DETAILS
-- =========================

-- DistributionID 1: Livestock support batch 1
INSERT INTO tblSubsidyDistributionDetails (DistributionID, FarmerID, Amount)
VALUES
  (1, 1, 10000.00),
  (1, 2, 15000.00),
  (1, 3, 20000.00),
  (1, 4, 15000.00);

-- DistributionID 2: Organic farming assistance
INSERT INTO tblSubsidyDistributionDetails (DistributionID, FarmerID, Amount)
VALUES
  (2, 5, 10000.00),
  (2, 6, 12000.00),
  (2, 7, 13000.00);

-- DistributionID 3: Irrigation support batch
INSERT INTO tblSubsidyDistributionDetails (DistributionID, FarmerID, Amount)
VALUES
  (3, 1, 40000.00),
  (3, 3, 50000.00),
  (3, 8, 50000.00);

-- DistributionID 4: Fisheries assistance
INSERT INTO tblSubsidyDistributionDetails (DistributionID, FarmerID, Amount)
VALUES
  (4, 2, 20000.00),
  (4, 4, 30000.00),
  (4, 5, 30000.00);

-- DistributionID 5: Agro-enterprise support
INSERT INTO tblSubsidyDistributionDetails (DistributionID, FarmerID, Amount)
VALUES
  (5, 6, 15000.00),
  (5, 7, 20000.00),
  (5, 8, 20000.00);