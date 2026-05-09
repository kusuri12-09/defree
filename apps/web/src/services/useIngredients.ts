import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type {
  ApiListResponse,
  ApiResponse,
  IngredientDto,
  IngredientQueryDto,
  CreateIngredientDto,
} from '@defree/shared-types'

export const useIngredients = (filters?: IngredientQueryDto) => {
  return useQuery({
    queryKey: ['ingredients', filters],
    queryFn: async () => {
      const { data } = await api.get<ApiListResponse<IngredientDto>>('/ingredients', {
        params: filters,
      })
      return data
    },
  })
}

export const useAddIngredient = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreateIngredientDto) => {
      const { data } = await api.post<ApiResponse<IngredientDto>>('/ingredients', payload)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
    },
  })
}
