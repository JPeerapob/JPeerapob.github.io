// UI Action: "Move to Screening" | Table: dmn_demand | Form button + List banner button
// Condition (runs client and server side, keep it in the Condition field):
current.state == 'submitted' &&
((gs.hasRole('demand_screener') && current.type == gs.getProperty('x_demand.screener_type_value')) ||
 (gs.hasRole('demand_approver') && current.type == gs.getProperty('x_demand.approver_type_value')))

// Action script:
current.state = 'screening';
current.update();
action.setRedirectURL(current);
