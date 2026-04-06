-- =========================
-- CREATE DATABASE
-- =========================
-- CREATE DATABASE IF NOT EXISTS farm_db;
-- USE farm_db;


-- =========================
-- 9. USERS (linked to Farmers and Staff)
-- =========================
CREATE TABLE IF NOT EXISTS tblUsers (
  ID INT AUTO_INCREMENT PRIMARY KEY,
  Username VARCHAR(50) NOT NULL UNIQUE,
  PasswordHash VARCHAR(255) NOT NULL,
  Email VARCHAR(100) UNIQUE,
  Role ENUM('Admin', 'Staff') DEFAULT 'Staff',
  StaffID INT NULL,
  DateRegistered DATETIME DEFAULT CURRENT_TIMESTAMP,
  LastLogin DATETIME NULL,
  Status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active'
 *
   
);



-- =========================
-- 1. FARMERS
-- =========================
CREATE TABLE tblFarmers (
  FarmerID INT AUTO_INCREMENT PRIMARY KEY,
  FirstName VARCHAR(50) NOT NULL,
  LastName VARCHAR(50) NOT NULL,
  Gender ENUM('Male', 'Female', 'Other'),
  DateOfBirth DATE,
  Address TEXT,
  ContactNumber VARCHAR(20),
  Email VARCHAR(100),
  FarmLocation VARCHAR(100),
  FarmSize DECIMAL(10,2), 
  RegistrationDate DATE
);

-- =========================
-- 2. CROPS
-- =========================
CREATE TABLE tblCrops (
  CropID INT AUTO_INCREMENT PRIMARY KEY,
  CropName VARCHAR(50) NOT NULL,
  Category VARCHAR(50),
  Season VARCHAR(50),
  AverageYieldPerHectare DECIMAL(10,2),
  MarketPrice DECIMAL(10,2)
);

-- =========================
-- 3. LIVESTOCK
-- =========================
CREATE TABLE tblLivestock (
  LivestockID INT AUTO_INCREMENT PRIMARY KEY,
  Type VARCHAR(50),
  Breed VARCHAR(50),
  AverageProduction VARCHAR(50),
  MarketPrice DECIMAL(10,2)
);

-- =========================
-- 4. PROGRAMS
-- =========================
CREATE TABLE tblPrograms (
  ProgramID INT AUTO_INCREMENT PRIMARY KEY,
  ProgramName VARCHAR(100),
  Description TEXT,
  StartDate DATE,
  EndDate DATE,
  Budget DECIMAL(12,2),
  TargetBeneficiaries INT,
  Status ENUM('Active', 'Completed', 'Dropped') DEFAULT 'Active'
);

-- =========================
-- 5. FARMER PROGRAM PARTICIPATION
-- =========================
CREATE TABLE tblFarmerProgramParticipation (
  ParticipationID INT AUTO_INCREMENT PRIMARY KEY,
  FarmerID INT,
  ProgramID INT,
  DateJoined DATE,
  Status ENUM('Active', 'Completed', 'Dropped')
 
);

-- =========================
-- 6. SUBSIDY DISTRIBUTION
-- =========================
CREATE TABLE tblSubsidyDistribution (
  DistributionID INT AUTO_INCREMENT PRIMARY KEY,
  FarmerID INT,
  ProgramID INT,
  Amount DECIMAL(10,2),
  DistributionDate DATE,
  Remarks TEXT
 
);

-- =========================
-- 7. AGRICULTURAL STAFF
-- =========================
CREATE TABLE tblAgriculturalStaff (
  StaffID INT AUTO_INCREMENT PRIMARY KEY,
  FirstName VARCHAR(50),
  LastName VARCHAR(50),
  Gender ENUM('Male', 'Female'),
  Position VARCHAR(50),
  Department VARCHAR(50),
  ContactNumber VARCHAR(20),
  Email VARCHAR(100),
  IsUser TINYINT(1) DEFAULT 0
);

-- =========================
-- 8. MONITORING REPORTS
-- =========================
CREATE TABLE tblReportsAndMonitoring (
  ReportID INT AUTO_INCREMENT PRIMARY KEY,
  FarmerID INT,
  CropID INT NULL,
  LivestockID INT NULL,
  ReportDate DATE,
  ProductionVolume VARCHAR(50),
  Issues TEXT,
  Remarks TEXT
 
);