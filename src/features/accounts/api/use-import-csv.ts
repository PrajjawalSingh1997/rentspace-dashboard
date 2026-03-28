import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AccountsService } from '../services/accounts.service';

export function useImportCsv() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (file: File) => {
            return await AccountsService.importCsv(file);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
    });
}
