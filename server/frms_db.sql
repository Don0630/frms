-- =========================
-- CREATE DATABASE
-- =========================
-- CREATE DATABASE IF NOT EXISTS farm_db;
-- USE farm_db;


-- =========================
-- 9. USERS (linked to Farmers and Staff)
-- =========================
CREATE TABLE IF NOT EXISTS tblUsers (
  UserID INT AUTO_INCREMENT PRIMARY KEY,
  Username VARCHAR(50) NOT NULL UNIQUE,
  PasswordHash VARCHAR(255) NOT NULL,
  Email VARCHAR(100) UNIQUE,
  Role ENUM('Admin', 'Staff') DEFAULT 'Staff',
  StaffID INT NULL,
  DateRegistered DATETIME DEFAULT CURRENT_TIMESTAMP,
  LastLogin DATETIME NULL,
  Status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',

  -- Foreign keys
  FOREIGN KEY (StaffID) REFERENCES tblAgriculturalStaff(StaffID) ON DELETE SET NULL
);



-- =========================
-- 1. FARMERS (UPDATED)
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
  RegistrationDate DATE
);


-- =========================
-- 2. FARMS (NEW TABLE)
-- =========================
CREATE TABLE tblFarms (
  FarmID INT AUTO_INCREMENT PRIMARY KEY,
  FarmerID INT NOT NULL,

  FarmName VARCHAR(100),
  FarmBarangay VARCHAR(100),
  FarmMunicipality VARCHAR(100),

  FarmSize DECIMAL(10,2),

  FOREIGN KEY (FarmerID) REFERENCES tblFarmers(FarmerID)
  ON DELETE CASCADE
);  j

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
  Status ENUM('Active', 'Completed', 'Dropped'),

  FOREIGN KEY (FarmerID) REFERENCES tblFarmers(FarmerID) ON DELETE CASCADE,
  FOREIGN KEY (ProgramID) REFERENCES tblPrograms(ProgramID) ON DELETE CASCADE
);

-- =========================
-- 6. SUBSIDY DISTRIBUTION
-- =========================
CREATE TABLE tblSubsidyDistribution (
  DistributionID INT AUTO_INCREMENT PRIMARY KEY,
  ProgramID INT,
  TotalAmount DECIMAL(10,2),
  DistributionDate DATE,
  Remarks TEXT,

  FOREIGN KEY (ProgramID) REFERENCES tblPrograms(ProgramID) ON DELETE CASCADE
);



-- =========================
-- 7. SUBSIDY DISTRIBUTION DETAILS
-- =========================
CREATE TABLE tblSubsidyDistributionDetails (
  DistributionDetailsID INT AUTO_INCREMENT PRIMARY KEY,
  DistributionID INT,
  FarmerID INT, 
  Amount DECIMAL(10,2),
  IsDistributed TINYINT(1) NOT NULL DEFAULT 0,

  FOREIGN KEY (DistributionID) REFERENCES tblSubsidyDistribution(DistributionID) ON DELETE CASCADE
  FOREIGN KEY (FarmerID) REFERENCES tblFarmers(FarmerID) ON DELETE CASCADE,
);


-- =========================
-- 8. AGRICULTURAL STAFF
-- =========================
CREATE TABLE tblAgriculturalStaff (
  StaffID INT AUTO_INCREMENT PRIMARY KEY,
  FirstName VARCHAR(50),
  LastName VARCHAR(50),
  Gender ENUM('Male', 'Female'),
  Position VARCHAR(50),
  Department VARCHAR(50),
  ContactNumber VARCHAR(20),
  Email VARCHAR(100)
);

-- =========================
-- 9. MONITORING REPORTS
-- =========================
CREATE TABLE tblReportsAndMonitoring (
  ReportID INT AUTO_INCREMENT PRIMARY KEY,
  FarmerID INT,
  CropID INT NULL,
  LivestockID INT NULL,
  ReportDate DATE,
  ProductionVolume VARCHAR(50),
  Issues TEXT,
  Remarks TEXT,

  FOREIGN KEY (FarmerID) REFERENCES tblFarmers(FarmerID) ON DELETE CASCADE,
  FOREIGN KEY (CropID) REFERENCES tblCrops(CropID) ON DELETE SET NULL,
  FOREIGN KEY (LivestockID) REFERENCES tblLivestock(LivestockID) ON DELETE SET NULL
);