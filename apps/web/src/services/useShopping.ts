import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type {
  ApiResponse,
  ShoppingListDto,
  CreateShoppingItemDto,
  ShoppingListItemDto,
} from '@defree/shared-types'

export const useShoppingList = () => {
  return useQuery({
    queryKey: ['shopping-list'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<ShoppingListDto>>('/shopping-list')
      return data.data
    },
  })
}

export const useGenerateShoppingList = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<ApiResponse<ShoppingListDto>>('/shopping-list/generate')
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping-list'] })
    },
  })
}

export const useAddShoppingItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreateShoppingItemDto) => {
      const { data } = await api.post<ApiResponse<ShoppingListItemDto>>(
        '/shopping-list/items',
        payload,
      )
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping-list'] })
    },
  })
}
