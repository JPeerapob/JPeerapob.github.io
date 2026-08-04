// Business Rule: "Demand Access - Query Filter"
// Table: dmn_demand | When: before | Query: true | Insert/Update/Delete: false
// Order: run early (e.g. 100), so the filter applies before any other query BRs.
// This is what prevents "X rows removed by security constraints": the
// restriction is applied to the SQL query itself, not evaluated per-row
// after fetch.
(function executeRule(current) {
    if (gs.hasRole('admin'))
        return;

    var filter = new DemandAccessUtils().getVisibilityFilter();
    current.addEncodedQuery(filter);
})(current);
