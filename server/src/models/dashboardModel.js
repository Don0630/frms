import { db } from "../config/db.js";

export async function getSummary() {
  const [[counts]] = await db.query(`
    SELECT
      (SELECT COUNT(*) FROM tblFarmers) as totalFarmers,
      (SELECT COUNT(*) FROM tblPrograms) as totalPrograms,
      (SELECT COUNT(*) FROM tblPrograms WHERE Status = 'Active') as activePrograms,
      (SELECT COUNT(*) FROM tblSubsidyDistribution) as totalDistributions,
      (SELECT COALESCE(SUM(TotalAmount), 0) FROM tblSubsidyDistribution) as totalSubsidyAmount,
      (SELECT COALESCE(SUM(Amount), 0) FROM tblSubsidyDistributionDetails WHERE IsDistributed = 1) as totalDistributed,
      (SELECT COALESCE(SUM(Amount), 0) FROM tblSubsidyDistributionDetails WHERE IsDistributed = 0) as totalRemaining,
      (SELECT COUNT(*) FROM tblSubsidyDistributionDetails WHERE IsDistributed = 1) as totalBeneficiaries,
      (SELECT COUNT(*) FROM tblFarmerProgramParticipation WHERE Status = 'Active') as activeParticipants,
      (SELECT COUNT(*) FROM tblReportsAndMonitoring) as totalReports,
      (SELECT COUNT(*) FROM tblUsers) as totalUsers,
      (SELECT COUNT(*) FROM tblAgriculturalStaff) as totalStaff
  `);

  return counts;
}