// src/config/rbac.ts
// Central RBAC configuration for the RentSpace dashboard

export type AdminRole = 'SUPER_ADMIN' | 'SUPPORT' | 'READ_ONLY';

/**
 * Routes accessible by each role.
 * If a route is not listed for a role, access is denied.
 * Prefix matching is used — '/accounts' also grants access to '/accounts/123'.
 */
export const ROLE_ROUTE_ACCESS: Record<AdminRole, string[]> = {
    SUPER_ADMIN: [
        // Full access to everything
        '/overview', '/alerts', '/growth', '/revenue', '/subscriptions', '/platform', '/reports',
        '/accounts', '/users', '/plans',
        '/rent', '/properties', '/tenants', '/maintenance', '/move-outs', '/support', '/notifications', '/staff',
        '/admin-users', '/settings',
    ],
    SUPPORT: [
        // Business Intelligence (read-only)
        '/overview', '/alerts', '/growth', '/revenue', '/subscriptions', '/platform', '/reports',
        // Support-related operations
        '/support', '/notifications', '/staff',
    ],
    READ_ONLY: [
        // Business Intelligence only
        '/overview', '/alerts', '/growth', '/revenue', '/subscriptions', '/platform', '/reports',
    ],
};

/**
 * Write actions that require specific roles.
 * Used by the RoleGate component to show/hide action buttons.
 */
export const WRITE_ACTION_ROLES: Record<string, AdminRole[]> = {
    // Account management
    'account:status-override': ['SUPER_ADMIN'],
    'account:bulk-action': ['SUPER_ADMIN'],
    'account:import': ['SUPER_ADMIN'],
    'account:notes': ['SUPER_ADMIN'],
    'account:churn-override': ['SUPER_ADMIN'],
    // User management
    'user:reset-password': ['SUPER_ADMIN'],
    'user:force-logout': ['SUPER_ADMIN'],
    'user:edit': ['SUPER_ADMIN'],
    'user:merge': ['SUPER_ADMIN'],
    // Rent management
    'rent:manual-payment': ['SUPER_ADMIN'],
    'rent:waive-charges': ['SUPER_ADMIN'],
    'rent:mark-paid': ['SUPER_ADMIN'],
    // Property management
    'property:transfer': ['SUPER_ADMIN'],
    // Tenant management
    'tenant:edit': ['SUPER_ADMIN'],
    'tenant:extend-lease': ['SUPER_ADMIN'],
    'tenant:adjust-rent': ['SUPER_ADMIN'],
    // Support
    'support:respond': ['SUPER_ADMIN', 'SUPPORT'],
    'support:close': ['SUPER_ADMIN', 'SUPPORT'],
    'support:assign': ['SUPER_ADMIN'],
    // Suggestions
    'suggestion:update-status': ['SUPER_ADMIN', 'SUPPORT'],
    // Notifications
    'notification:broadcast': ['SUPER_ADMIN'],
    'notification:recall': ['SUPER_ADMIN'],
    // Admin management
    'admin:create': ['SUPER_ADMIN'],
    'admin:update': ['SUPER_ADMIN'],
    'admin:delete': ['SUPER_ADMIN'],
    // System
    'system:cache-clear': ['SUPER_ADMIN'],
    'system:maintenance': ['SUPER_ADMIN'],
    // Plans & Billing
    'billing:refund': ['SUPER_ADMIN'],
    'billing:discount': ['SUPER_ADMIN'],
    'billing:clear-arrears': ['SUPER_ADMIN'],
    'billing:resend-invoices': ['SUPER_ADMIN'],
    // Alerts
    'alert:resolve': ['SUPER_ADMIN', 'SUPPORT'],
    'alert:mark-read': ['SUPER_ADMIN', 'SUPPORT'],
};

/**
 * Check if a role can access a specific route path.
 */
export function hasAccess(role: AdminRole | undefined, pathname: string): boolean {
    if (!role) return false;
    const allowedRoutes = ROLE_ROUTE_ACCESS[role];
    if (!allowedRoutes) return false;
    return allowedRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));
}

/**
 * Check if a role can perform a specific write action.
 */
export function canPerformAction(role: AdminRole | undefined, action: string): boolean {
    if (!role) return false;
    const allowedRoles = WRITE_ACTION_ROLES[action];
    if (!allowedRoles) return false; // Unknown action = deny
    return allowedRoles.includes(role);
}

/**
 * Shorthand: is the role SUPER_ADMIN?
 */
export function isSuperAdmin(role: AdminRole | undefined): boolean {
    return role === 'SUPER_ADMIN';
}

/**
 * Get a display-friendly role name.
 */
export function getRoleDisplayName(role: AdminRole): string {
    switch (role) {
        case 'SUPER_ADMIN': return 'Super Admin';
        case 'SUPPORT': return 'Support';
        case 'READ_ONLY': return 'Read Only';
        default: return role;
    }
}
