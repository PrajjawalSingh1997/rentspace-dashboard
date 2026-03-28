import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { MultiAccountResponse } from '../api/use-growth-analytics';

interface MultiAccountTableProps {
    data: MultiAccountResponse;
}

export function MultiAccountTable({ data }: MultiAccountTableProps) {
    const users = data.data || [];

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#3b82f6]">Multi-Account Users</CardTitle>
                <p className="text-sm text-muted-foreground">
                    Users who belong to 2 or more accounts — potential duplicates or power users.
                    Showing {users.length} of {data.total} users.
                </p>
            </CardHeader>
            <CardContent>
                {users.length === 0 ? (
                    <div className="flex items-center justify-center py-12 text-muted-foreground">
                        No multi-account users found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Name</th>
                                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Email</th>
                                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Phone</th>
                                    <th className="text-center py-3 px-4 text-muted-foreground font-medium">Accounts</th>
                                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-4 font-medium text-[#3b82f6]">{user.name || '—'}</td>
                                        <td className="py-3 px-4 text-muted-foreground">{user.email || '—'}</td>
                                        <td className="py-3 px-4 text-muted-foreground">{user.phone || '—'}</td>
                                        <td className="py-3 px-4 text-center">
                                            <Badge variant={user._count.memberships >= 3 ? 'destructive' : 'secondary'} className="font-semibold">
                                                {user._count.memberships}
                                            </Badge>
                                        </td>
                                        <td className="py-3 px-4 text-muted-foreground">
                                            {new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
