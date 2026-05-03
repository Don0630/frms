// services/subsidyService.js
import * as subsidyModel from "../models/subsidyModel.js";


// ------------------ FETCH ALL SUBSIDIES ------------------
export async function fetchSubsidies() {
  return await subsidyModel.getAllSubsidy();
}

// ------------------ ADD SUBSIDY ------------------
export async function addSubsidy(subsidy) {
  const { ProgramID, TotalAmount } = subsidy;

  // Get budget summary of the selected program
  const budgetSummary =
    await subsidyModel.getProgramBudgetSummary(ProgramID);

  if (!budgetSummary) {
    throw new Error("Program not found");
  }

  const programBudget = Number(
    budgetSummary.ProgramBudget || 0
  );

  const totalSubsidyBudget = Number(
    budgetSummary.TotalSubsidyBudget || 0
  );

  const newSubsidyAmount = Number(TotalAmount || 0);

  // Validate amount
  if (newSubsidyAmount <= 0) {
    throw new Error("Invalid subsidy amount");
  }

  // Validate against remaining budget
  if (
    totalSubsidyBudget + newSubsidyAmount >
    programBudget
  ) {
    const remaining =
      programBudget - totalSubsidyBudget;

    throw new Error(
      `Insufficient program budget. Remaining budget: ₱${remaining.toLocaleString(
        "en-PH"
      )}`
    );
  }

  // Proceed insert
  return await subsidyModel.createSubsidy(subsidy);
}

 
// ------------------ FETCH AVAILABLE FARMERS (SEARCH) ------------------
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


export async function fetchSubsidyById(id) {
  return await subsidyModel.getSubsidyById(id);
}