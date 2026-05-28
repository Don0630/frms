-- =========================
-- 1. FARMERS
-- =========================
CREATE TABLE tblFarmers (
  FarmerID INT AUTO_INCREMENT PRIMARY KEY,
  FirstName VARCHAR(50) NOT NULL,
  MiddleName VARCHAR(50),
  LastName VARCHAR(50) NOT NULL,
  Gender ENUM('Male', 'Female', 'Other'),
  DateOfBirth DATE,
  Barangay VARCHAR(100),
  Municipality VARCHAR(100),
  Province VARCHAR(100),
  ContactNumber VARCHAR(20),
  Email VARCHAR(100),
  RegistrationDate DATE DEFAULT (CURRENT_DATE),
  UNIQUE KEY unique_farmer (FirstName, MiddleName, LastName),
  UNIQUE KEY unique_contact (ContactNumber),
  UNIQUE KEY unique_email (Email)
);

-- =========================
-- 2. FARMS
-- =========================
CREATE TABLE tblFarms (
  FarmID INT AUTO_INCREMENT PRIMARY KEY,
  FarmerID INT NOT NULL,
  FarmBarangay VARCHAR(100),
  FarmMunicipality VARCHAR(100),
  FarmProvince VARCHAR(100),
  FarmSize DECIMAL(10,2),
  FOREIGN KEY (FarmerID) REFERENCES tblFarmers(FarmerID) ON DELETE RESTRICT,
  UNIQUE KEY unique_farm (FarmerID, FarmBarangay, FarmMunicipality, FarmProvince)
);

-- =========================
-- 3. CROPS
-- =========================
CREATE TABLE tblCrops (
  CropID INT AUTO_INCREMENT PRIMARY KEY,
  CropName VARCHAR(50) NOT NULL,
  Category VARCHAR(50),
  Season VARCHAR(50),
  AverageYieldPerHectare DECIMAL(10,2),
  MarketPrice DECIMAL(10,2),
  UNIQUE KEY unique_crop (CropName)
);

-- =========================
-- 4. LIVESTOCK
-- =========================
CREATE TABLE tblLivestock (
  LivestockID INT AUTO_INCREMENT PRIMARY KEY,
  Type VARCHAR(50),
  Breed VARCHAR(50),
  AverageProduction VARCHAR(50),
  MarketPrice DECIMAL(10,2),
  UNIQUE KEY unique_livestock (Type, Breed)
);

-- =========================
-- 5. PROGRAMS
-- =========================
CREATE TABLE tblPrograms (
  ProgramID INT AUTO_INCREMENT PRIMARY KEY,
  ProgramName VARCHAR(100),
  Description TEXT,
  StartDate DATE,
  EndDate DATE,
  Budget DECIMAL(12,2),
  TargetBeneficiaries INT,
  Status ENUM('Active', 'Completed', 'Dropped') DEFAULT 'Active',
  UNIQUE KEY unique_program (ProgramName)
);

-- =========================
-- 6. FARMER PROGRAM PARTICIPATION
-- =========================
CREATE TABLE tblFarmerProgramParticipation (
  ParticipationID INT AUTO_INCREMENT PRIMARY KEY,
  FarmerID INT,
  ProgramID INT,
  DateJoined DATE,
  Status ENUM('Active', 'Completed', 'Dropped'),
  FOREIGN KEY (FarmerID) REFERENCES tblFarmers(FarmerID) ON DELETE RESTRICT,
  FOREIGN KEY (ProgramID) REFERENCES tblPrograms(ProgramID) ON DELETE RESTRICT,
  UNIQUE KEY unique_participation (FarmerID, ProgramID)
);

-- =========================
-- 7. SUBSIDY DISTRIBUTION
-- =========================
CREATE TABLE tblSubsidyDistribution (
  DistributionID INT AUTO_INCREMENT PRIMARY KEY,
  ProgramID INT,
  TotalAmount DECIMAL(10,2),
  DistributionDate DATE,
  Remarks TEXT,
  FOREIGN KEY (ProgramID) REFERENCES tblPrograms(ProgramID) ON DELETE RESTRICT
);

-- =========================
-- 8. SUBSIDY DISTRIBUTION DETAILS
-- =========================
CREATE TABLE tblSubsidyDistributionDetails (
  DistributionDetailsID INT AUTO_INCREMENT PRIMARY KEY,
  DistributionID INT,
  FarmerID INT,
  Amount DECIMAL(10,2),
  IsDistributed TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (DistributionID) REFERENCES tblSubsidyDistribution(DistributionID) ON DELETE RESTRICT,
  FOREIGN KEY (FarmerID) REFERENCES tblFarmers(FarmerID) ON DELETE RESTRICT,
  UNIQUE KEY unique_distribution_farmer (DistributionID, FarmerID)
);

-- =========================
-- 9. AGRICULTURAL STAFF
-- =========================
CREATE TABLE tblAgriculturalStaff (
  StaffID INT AUTO_INCREMENT PRIMARY KEY,
  FirstName VARCHAR(50),
  MiddleName VARCHAR(50),
  LastName VARCHAR(50),
  Gender ENUM('Male', 'Female', 'Other'),
  DateOfBirth DATE,
  Position VARCHAR(50),
  Department VARCHAR(50),
  ContactNumber VARCHAR(20),
  Email VARCHAR(100),
  UNIQUE KEY unique_staff (FirstName, MiddleName, LastName),
  UNIQUE KEY unique_staff_contact (ContactNumber),
  UNIQUE KEY unique_staff_email (Email)
);

-- =========================
-- 10. USERS
-- =========================
CREATE TABLE tblUsers (
  UserID INT AUTO_INCREMENT PRIMARY KEY,
  Username VARCHAR(50) NOT NULL,
  PasswordHash VARCHAR(255) NOT NULL,
  Email VARCHAR(100),
  Role ENUM('Admin', 'Staff') DEFAULT 'Staff',
  StaffID INT NULL,
  DateRegistered DATETIME DEFAULT CURRENT_TIMESTAMP,
  LastLogin DATETIME NULL,
  Status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
  FOREIGN KEY (StaffID) REFERENCES tblAgriculturalStaff(StaffID) ON DELETE RESTRICT,
  UNIQUE KEY unique_username (Username),
  UNIQUE KEY unique_user_email (Email)
);

-- =========================
-- 11. MONITORING REPORTS
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
  FOREIGN KEY (FarmerID) REFERENCES tblFarmers(FarmerID) ON DELETE RESTRICT,
  FOREIGN KEY (CropID) REFERENCES tblCrops(CropID) ON DELETE RESTRICT,
  FOREIGN KEY (LivestockID) REFERENCES tblLivestock(LivestockID) ON DELETE RESTRICT,
  UNIQUE KEY unique_report (FarmerID, ReportDate)
);