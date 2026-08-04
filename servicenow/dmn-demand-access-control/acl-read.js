// ACL: dmn_demand | Operation: read
// Requires role: demand_manager (the forced OOB role)
// Script (advanced, "answer" variable):
answer = gs.hasRole('admin') || new DemandAccessUtils().canRead(current);
