import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type {
  ApiResponse,
  CreateCookingLogDto,
  CookingLogResponseDto,
  RecipeRecommendationsDto,
} from '@defree/shared-types'

export const useRecipeRecommendations = () => {
  return useQuery({
    queryKey: ['recipes', 'recommendations'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<RecipeRecommendationsDto>>(
        '/recipes/recommendations',
      )
      return data.data
    },
  })
}

export const useCompleteCooking = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreateCookingLogDto) => {
      const { data } = await api.post<ApiResponse<CookingLogResponseDto>>('/cooking-logs', payload)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
    },
  })
}
