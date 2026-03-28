'use client';

import { useAuthStore } from '@/features/auth/stores/auth';
import type { AdminRole } from '@/config/rbac';
import { canPerformAction } from '@/config/rbac';

interface RoleGateProps {
    /** Required role(s). If string, checks isSuperAdmin. If action string like 'rent:manual-payment', uses canPerformAction. */
    requiredRole?: AdminRole | AdminRole[];
    /** Named action from WRITE_ACTION_ROLES — e.g. 'rent:manual-payment' */
    action?: string;
    /** Content to show when access is granted */
    children: React.ReactNode;
    /** Optional fallback when access is denied (default: null) */
    fallback?: React.ReactNode;
}

/**
 * RoleGate — conditionally renders children based on admin role.
 * 
 * Usage:
 *   <RoleGate action="rent:manual-payment">
 *     <Button>Record Payment</Button>
 *   </RoleGate>
 * 
 *   <RoleGate requiredRole="SUPER_ADMIN">
 *     <AdminOnlySection />
 *   </RoleGate>
 */
export function RoleGate({ requiredRole, action, children, fallback = null }: RoleGateProps) {
    const role = useAuthStore((s) => s.admin?.role);

    if (!role) return <>{fallback}</>;

    // Check by named action
    if (action) {
        if (!canPerformAction(role, action)) return <>{fallback}</>;
        return <>{children}</>;
    }

    // Check by required role
    if (requiredRole) {
        const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        if (!roles.includes(role as AdminRole)) return <>{fallback}</>;
        return <>{children}</>;
    }

    // No restriction specified — allow
    return <>{children}</>;
}

/**
 * Hook version — returns true/false for conditional rendering in JSX.
 */
export function useHasRole(requiredRole: AdminRole | AdminRole[]): boolean {
    const role = useAuthStore((s) => s.admin?.role);
    if (!role) return false;
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    return roles.includes(role as AdminRole);
}

/**
 * Hook version for action-based checks.
 */
export function useCanPerformAction(action: string): boolean {
    const role = useAuthStore((s) => s.admin?.role);
    return canPerformAction(role as AdminRole | undefined, action);
}
