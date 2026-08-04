// UI Action: "Qualify" | Table: dmn_demand | Form button
// Condition:
current.state == 'screening' &&
gs.hasRole('demand_approver') &&
current.type == gs.getProperty('x_demand.approver_type_value')

// Action script:
current.state = 'qualification';
current.update();
action.setRedirectURL(current);
