// ACL: dmn_demand | Operation: write
// Requires role: demand_manager (the forced OOB role)
// Script (advanced, "answer" variable):
answer = gs.hasRole('admin') || new DemandAccessUtils().canWrite(current);
