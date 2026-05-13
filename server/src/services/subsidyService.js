// services/subsidyService.js
import * as subsidyModel from "../models/subsidyModel.js";
import * as programModel from "../models/programModel.js";
import { throwError } from "../utils/throwError.js";

// ------------------ FETCH ALL SUBSIDIES ------------------
export async function fetchSubsidies() {
  return await subsidyModel.getAllSubsidy();
}

// ------------------ ADD SUBSIDY ------------------ 
export async function addSubsidy(subsidy) {
  // 1. Check program exists
  const program = await programModel.getProgramById(subsidy.ProgramID);
  if (!program) throwError("Program not found", "NOT_FOUND", 404);

  // 2. Check program is active
  if (program.Status !== "Active") {
    throwError("Cannot add subsidy to a non-active program", "INVALID_PROGRAM", 400);
  }


  // 3. Check available budget
  const totalExisting = await subsidyModel.getTotalSubsidyByProgram(subsidy.ProgramID);
  const remaining = parseFloat(program.Budget) - parseFloat(totalExisting);

  if (parseFloat(subsidy.TotalAmount) > remaining) {
    throwError(
      `Amount exceeds remaining program budget. Remaining: ₱${remaining.toLocaleString()}`,
      "BUDGET_EXCEEDED",
      400
    );
  }


  // 4. Validate distribution date against program dates
  const distributionDate = new Date(subsidy.DistributionDate);
  const programStart = new Date(program.StartDate);
  const programEnd = new Date(program.EndDate);

  distributionDate.setHours(0, 0, 0, 0);
  programStart.setHours(0, 0, 0, 0);
  programEnd.setHours(0, 0, 0, 0);

  if (distributionDate < programStart) {
    throwError("Distribution date cannot be before the program start date", "INVALID_DATE", 400);
  }

  if (distributionDate > programEnd) {
    throwError("Distribution date cannot exceed the program end date", "INVALID_DATE", 400);
  }



  return await subsidyModel.createSubsidy(subsidy);
}

// ------------------ EDIT SUBSIDY ------------------
export async function editSubsidy(id, subsidy) {
  const subsidyId = parseInt(id);

  // 1. Check subsidy exists
  const existing = await subsidyModel.getSubsidyById(subsidyId);
  if (!existing) throwError("Subsidy not found", "NOT_FOUND", 404);

  // 2. Cannot edit if any farmer has already been distributed
  if (existing.DistributedCount > 0) {
    throwError(
      "Cannot edit a subsidy that has already been partially or fully distributed",
      "INVALID_OPERATION",
      400
    );
  }

  // 3. Get program for date and budget validation
  const program = await programModel.getProgramById(existing.ProgramID);

  // 4. Validate distribution date against program dates
  const distributionDate = new Date(subsidy.DistributionDate);
  const programStart = new Date(program.StartDate);
  const programEnd = new Date(program.EndDate);

  distributionDate.setHours(0, 0, 0, 0);
  programStart.setHours(0, 0, 0, 0);
  programEnd.setHours(0, 0, 0, 0);

  if (distributionDate < programStart) {
    throwError("Distribution date cannot be before the program start date", "INVALID_DATE", 400);
  }

  if (distributionDate > programEnd) {
    throwError("Distribution date cannot exceed the program end date", "INVALID_DATE", 400);
  }

  // 5. Check available budget (exclude current subsidy)
  const totalExisting = await subsidyModel.getTotalSubsidyByProgram(existing.ProgramID, subsidyId);
  const remaining = parseFloat(program.Budget) - parseFloat(totalExisting);

  if (parseFloat(subsidy.TotalAmount) > remaining) {
    throwError(
      `Amount exceeds remaining program budget. Remaining: ₱${remaining.toLocaleString()}`,
      "BUDGET_EXCEEDED",
      400
    );
  }

  // 6. Cannot reduce amount below total already assigned to farmers
  const totalAssigned = await subsidyModel.getTotalAssignedAmount(subsidyId);
  if (parseFloat(subsidy.TotalAmount) < parseFloat(totalAssigned)) {
    throwError(
      `Amount cannot be less than total already assigned to farmers (₱${totalAssigned.toLocaleString()})`,
      "INVALID_AMOUNT",
      400
    );
  }

  return await subsidyModel.updateSubsidy(subsidyId, subsidy);
}


// ------------------ FETCH AVAILABLE FARMERS ------------------
export async function fetchAvailableFarmer(distributionID, search = "") {
  return await subsidyModel.getAvailableFarmer(distributionID, search);
}

// ------------------ ADD DISTRIBUTION ------------------
export async function addDistribution(distribution) {
  return await subsidyModel.createDistribution(distribution);
}

// ------------------ EDIT DISTRIBUTION ------------------
export async function editDistribution(id, distribution) {
  return await subsidyModel.updateDistribution(id, distribution);
}

// ------------------ REMOVE DISTRIBUTION ------------------
export async function removeDistribution(id) {
  return await subsidyModel.deleteDistribution(id);
}

// ------------------ FETCH SUBSIDY DETAILS ------------------
export async function fetchSubsidyDetails(id) {
  return await subsidyModel.getSubsidyDetails(id);
}