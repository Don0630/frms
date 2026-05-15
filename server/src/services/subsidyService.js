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
  const distributionID = parseInt(distribution.DistributionID);
  const farmerID = parseInt(distribution.FarmerID);
  const amount = parseFloat(distribution.Amount);

  // 1. Check subsidy exists
  const subsidy = await subsidyModel.getSubsidyById(distributionID);
  if (!subsidy) throwError("Subsidy not found", "NOT_FOUND", 404);

  // 2. Farmer not already in this distribution
  const alreadyAdded = await subsidyModel.getFarmerInDistribution(distributionID, farmerID);
  if (alreadyAdded) throwError("Farmer is already added to this distribution", "DUPLICATE_ENTRY", 400);

  // 3. Amount cannot exceed unassigned budget (reuse existing model fn)
  const totalAssigned = parseFloat(await subsidyModel.getTotalAssignedAmount(distributionID));
  const unassigned = parseFloat(subsidy.TotalAmount) - totalAssigned;

  if (amount > unassigned) {
    throwError(
      `Amount exceeds unassigned budget. Available: ₱${unassigned.toLocaleString()}`,
      "BUDGET_EXCEEDED",
      400
    );
  }

  return await subsidyModel.createDistribution(distribution);
}

// ------------------ EDIT DISTRIBUTION ------------------
export async function editDistribution(id, distribution) {
  const distributionId = parseInt(id);

  // 1. Check exists
  const existing = await subsidyModel.getDistributionDetailById(distributionId);
  if (!existing) throwError("Distribution record not found", "NOT_FOUND", 404);

  // 2. Distribute action
  if (distribution.IsDistributed === 1) {
    if (existing.IsDistributed === 1) {
      throwError("Already distributed", "INVALID_OPERATION", 400);
    }

    // Check program is still active
    const subsidy = await subsidyModel.getSubsidyById(existing.DistributionID);
    const program = await programModel.getProgramById(subsidy.ProgramID);
    if (program.Status !== "Active") {
      throwError("Cannot distribute — program is no longer active", "INVALID_OPERATION", 400);
    }
  }

  // 3. Cancel action
  if (distribution.IsDistributed === 0) {
    if (existing.IsDistributed === 0) {
      throwError("Distribution is already pending", "INVALID_OPERATION", 400);
    }
  }

  return await subsidyModel.updateDistribution(distributionId, distribution);
}
   

// ------------------ REMOVE DISTRIBUTION ------------------
export async function removeDistribution(id) {
  const distributionId = parseInt(id);
  const existing = await subsidyModel.getDistributionDetailById(distributionId);
  if (!existing) throwError("Distribution record not found", "NOT_FOUND", 404);

  if (Number(existing.IsDistributed) === 1) {
    throwError("Cannot delete a record that has already been distributed", "INVALID_OPERATION", 400);
  }

  return await subsidyModel.deleteDistribution(distributionId);
}

// ------------------ FETCH SUBSIDY DETAILS ------------------
export async function fetchSubsidyDetails(id) {
  return await subsidyModel.getSubsidyDetails(id);
}