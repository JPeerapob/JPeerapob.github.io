# `dmn_demand` Access Control

Restricts read/write/state-transition access on the Demand table
(`dmn_demand`) by persona, even though every user in scope is forced to
carry the out-of-box `demand_manager` role.

## Why this design

- **Everyone has `demand_manager`**, so it can't distinguish personas by
  itself. Fix: layer **supplementary custom roles** on top of it, assigned
  to groups declaratively (System Security > Roles, then attach each role
  to a group's *Roles* related list). No group name or sys_id ever appears
  in a script — scripts only check role names and System Properties.
- **"X rows removed by security constraints"** happens when a row-level
  read ACL script rejects rows *after* they're fetched for a list page. The
  fix here is a **before-query Business Rule** that adds the same
  restriction as an encoded query (`addEncodedQuery`), so ineligible rows
  never enter the result set. The Read ACL applies the identical logic
  (via the shared Script Include) as a defense-in-depth check for
  non-list access (form open, related lists, REST/Import).

## Role matrix

| Persona | Custom role | Read scope | Write scope | State transitions |
|---|---|---|---|---|
| Demand User (Requester) | `demand_requester` | Own demands | Own demands | Create/Submit only |
| Demand Manager | `demand_manager_scope` | Demands where scope field = `ODX/P` | Same | — |
| Demand Screener | `demand_screener` | Assigned demands, type = Application service catalog | — | Submitted → Screening |
| Demand Approver | `demand_approver` | All demands, type = PoC | — | Submitted → Screening; Screening → Qualification/Rejected/Deferred |

All four roles are **additive** on top of the required `demand_manager`
role — a user needs both to see anything beyond nothing.

## Setup steps (one-time, in the ServiceNow instance)

1. Create roles: `demand_requester`, `demand_manager_scope`,
   `demand_screener`, `demand_approver`.
2. Attach each role to the appropriate group(s) via the group's *Roles*
   related list. This is the only place persona membership is
   maintained — never in script.
3. Create System Properties:
   - `x_demand.manager_scope_field` — field on `dmn_demand` holding the
     scope/portfolio value (placeholder used here: `u_portfolio` — **verify
     against the real schema**).
   - `x_demand.manager_scope_value` — `ODX/P`
   - `x_demand.screener_type_value` — `Application service catalog`
   - `x_demand.approver_type_value` — `PoC`
   - `x_demand.owner_field` — field identifying the demand's
     owner/requester (placeholder used here: `requested_for` — **verify
     against the real schema**).
4. Import the artifacts in this folder:
   - `script-include-demand-access-utils.js` → Script Include
     `DemandAccessUtils` (client callable: false)
   - `business-rule-before-query.js` → Business Rule on `dmn_demand`,
     when=`before`, query=`true`, insert/update/delete=`false`
   - `acl-read.js` → Read ACL on `dmn_demand`, required role
     `demand_manager`, script type "Advanced"
   - `acl-write.js` → Write ACL on `dmn_demand`, required role
     `demand_manager`, script type "Advanced"
   - `ui-action-move-to-screening.js`, `ui-action-qualify-poc.js`,
     `ui-action-reject-poc.js`, `ui-action-defer-poc.js` → UI Actions on
     `dmn_demand` (paste the Condition/Action blocks into their respective
     fields)

## Assumptions to confirm before go-live

- `state` values used here (`submitted`, `screening`, `qualification`,
  `rejected`, `deferred`) are placeholders for whatever the real `dmn_demand`
  choice list values are — confirm and adjust the UI Action scripts if
  different.
- The screener's "assigned demands" is implemented as
  `assignment_group` membership; if assignment instead lives on
  `dmn_demand_task`, move the screener visibility clause there.
