import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { marketplaceRepository } from '@/services/marketplace';
import { CreateListingInput, ListingFilters } from '@/types/domain';

export const marketplaceKeys = {
  listings: (filters?: ListingFilters) => ['listings', filters ?? {}] as const,
  listing: (id: string) => ['listing', id] as const,
  conversations: ['conversations'] as const,
  messages: (conversationId: string) => ['messages', conversationId] as const,
};

export function useListings(filters?: ListingFilters) {
  return useQuery({ queryKey: marketplaceKeys.listings(filters), queryFn: () => marketplaceRepository.listListings(filters) });
}

export function useListing(id: string) {
  return useQuery({ queryKey: marketplaceKeys.listing(id), queryFn: () => marketplaceRepository.getListing(id), enabled: Boolean(id) });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listingId, nextValue }: { listingId: string; nextValue: boolean }) => marketplaceRepository.toggleFavorite(listingId, nextValue),
    onMutate: async ({ listingId, nextValue }) => {
      await queryClient.cancelQueries({ queryKey: ['listings'] });
      queryClient.setQueriesData({ queryKey: ['listings'] }, (old: any) => Array.isArray(old)
        ? old.map((listing) => listing.id === listingId ? { ...listing, isFavorite: nextValue } : listing)
        : old);
      queryClient.setQueryData(marketplaceKeys.listing(listingId), (old: any) => old ? { ...old, isFavorite: nextValue } : old);
    },
    onSettled: (_data, _error, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['listings'] });
      void queryClient.invalidateQueries({ queryKey: marketplaceKeys.listing(variables.listingId) });
    },
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateListingInput) => marketplaceRepository.createListing(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['listings'] }),
  });
}

export function useConversations() {
  return useQuery({ queryKey: marketplaceKeys.conversations, queryFn: () => marketplaceRepository.listConversations() });
}

export function useMessages(conversationId: string) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: marketplaceKeys.messages(conversationId),
    queryFn: () => marketplaceRepository.getMessages(conversationId),
    enabled: Boolean(conversationId),
  });

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase || !conversationId) return;
    const client = supabase;
    const channel = client.channel(`conversation:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}`,
      }, () => {
        void queryClient.invalidateQueries({ queryKey: marketplaceKeys.messages(conversationId) });
        void queryClient.invalidateQueries({ queryKey: marketplaceKeys.conversations });
      })
      .subscribe();
    return () => { void client.removeChannel(channel); };
  }, [conversationId, queryClient]);

  return query;
}

export function useStartConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (listingId: string) => marketplaceRepository.startConversation(listingId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: marketplaceKeys.conversations }),
  });
}

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => marketplaceRepository.sendMessage(conversationId, body),
    onSuccess: (message) => {
      queryClient.setQueryData(marketplaceKeys.messages(conversationId), (old: any) => [...(old ?? []), message]);
      void queryClient.invalidateQueries({ queryKey: marketplaceKeys.conversations });
    },
  });
}
