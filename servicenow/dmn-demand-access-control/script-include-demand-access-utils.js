// Script Include: DemandAccessUtils (Client callable: false)
// Single source of truth for dmn_demand row visibility/write rules,
// used by the before-query Business Rule and by the read/write ACLs.
var DemandAccessUtils = Class.create();
DemandAccessUtils.prototype = {
    initialize: function() {},

    // Returns an encoded query fragment scoping dmn_demand to what the
    // current user's persona role(s) allow. Empty string = no restriction
    // (used only for full admins, applied by the caller).
    getVisibilityFilter: function() {
        var clauses = [];
        var scopeField = gs.getProperty('x_demand.manager_scope_field');
        var ownerField = gs.getProperty('x_demand.owner_field');

        if (gs.hasRole('demand_requester'))
            clauses.push(ownerField + '=' + gs.getUserID());

        if (gs.hasRole('demand_manager_scope'))
            clauses.push(scopeField + '=' + gs.getProperty('x_demand.manager_scope_value'));

        if (gs.hasRole('demand_screener'))
            clauses.push('type=' + gs.getProperty('x_demand.screener_type_value') +
                '^assignment_groupIN' + gs.getUser().getMyGroups());

        if (gs.hasRole('demand_approver'))
            clauses.push('type=' + gs.getProperty('x_demand.approver_type_value'));

        return clauses.length ? clauses.join('^NQ') : 'sys_idISEMPTY';
    },

    // Record-level equivalent of getVisibilityFilter(), for direct
    // record/API access (form open, related list, REST) outside of lists.
    canRead: function(demand) {
        var scopeField = gs.getProperty('x_demand.manager_scope_field');
        var ownerField = gs.getProperty('x_demand.owner_field');

        if (gs.hasRole('demand_requester') && demand.getValue(ownerField) == gs.getUserID())
            return true;
        if (gs.hasRole('demand_manager_scope') && demand.getValue(scopeField) == gs.getProperty('x_demand.manager_scope_value'))
            return true;
        if (gs.hasRole('demand_screener') && demand.getValue('type') == gs.getProperty('x_demand.screener_type_value') &&
            gs.getUser().isMemberOf(demand.getValue('assignment_group')))
            return true;
        if (gs.hasRole('demand_approver') && demand.getValue('type') == gs.getProperty('x_demand.approver_type_value'))
            return true;
        return false;
    },

    // Write is narrower than read: requester owns it, manager is in-scope.
    canWrite: function(demand) {
        var scopeField = gs.getProperty('x_demand.manager_scope_field');
        var ownerField = gs.getProperty('x_demand.owner_field');

        if (gs.hasRole('demand_requester') && demand.getValue(ownerField) == gs.getUserID())
            return true;
        if (gs.hasRole('demand_manager_scope') && demand.getValue(scopeField) == gs.getProperty('x_demand.manager_scope_value'))
            return true;
        return false;
    },

    type: 'DemandAccessUtils'
};
