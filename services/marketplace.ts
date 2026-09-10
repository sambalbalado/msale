import { fetch } from 'expo/fetch';
import * as Crypto from 'expo-crypto';

import { CURRENT_USER, MOCK_CONVERSATIONS, MOCK_LISTINGS, MOCK_MESSAGES } from '@/data/mock';
import { isSupabaseConfigured, requireSupabase } from '@/lib/supabase';
import { Conversation, CreateListingInput, Listing, ListingFilters, Message, Profile } from '@/types/domain';

export interface MarketplaceRepository {
  listListings(filters?: ListingFilters): Promise<Listing[]>;
  getListing(id: string): Promise<Listing | null>;
  toggleFavorite(listingId: string, nextValue: boolean): Promise<void>;
  createListing(input: CreateListingInput): Promise<Listing>;
  listConversations(): Promise<Conversation[]>;
  getMessages(conversationId: string): Promise<Message[]>;
  startConversation(listingId: string): Promise<string>;
  sendMessage(conversationId: string, body: string): Promise<Message>;
}

const delay = (milliseconds = 180) => new Promise((resolve) => setTimeout(resolve, milliseconds));

let mockListings = [...MOCK_LISTINGS];
let mockConversations = [...MOCK_CONVERSATIONS];
const mockMessages: Record<string, Message[]> = structuredClone(MOCK_MESSAGES);

function filterAndSort(listings: Listing[], filters: ListingFilters = {}) {
  const query = filters.query?.trim().toLocaleLowerCase();
  const result = listings.filter((listing) => {
    if (query && !`${listing.title} ${listing.description} ${listing.area}`.toLocaleLowerCase().includes(query)) return false;
    if (filters.category && filters.category !== 'all' && listing.category !== filters.category) return false;
    if (filters.state && listing.state !== filters.state) return false;
    if (filters.condition && filters.condition !== 'all' && listing.condition !== filters.condition) return false;
    if (filters.minPrice != null && listing.price < filters.minPrice) return false;
    if (filters.maxPrice != null && listing.price > filters.maxPrice) return false;
    return listing.status === 'active';
  });

  return result.sort((a, b) => {
    if (filters.sort === 'price_low') return a.price - b.price;
    if (filters.sort === 'price_high') return b.price - a.price;
    if (filters.sort === 'nearby') return (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

const mockRepository: MarketplaceRepository = {
  async listListings(filters) {
    await delay();
    return filterAndSort([...mockListings], filters);
  },
  async getListing(id) {
    await delay(100);
    return mockListings.find((listing) => listing.id === id) ?? null;
  },
  async toggleFavorite(listingId, nextValue) {
    mockListings = mockListings.map((listing) => listing.id === listingId ? { ...listing, isFavorite: nextValue } : listing);
  },
  async createListing(input) {
    await delay(300);
    const listing: Listing = {
      id: `listing-${Date.now()}`,
      seller: CURRENT_USER,
      title: input.title,
      description: input.description,
      price: input.price,
      currency: 'MYR',
      condition: input.condition,
      category: input.category,
      state: input.state,
      area: input.area,
      imageUrls: input.imageUris.length ? input.imageUris : ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85'],
      createdAt: new Date().toISOString(),
      status: 'active',
      meetupNotes: input.meetupNotes,
    };
    mockListings = [listing, ...mockListings];
    return listing;
  },
  async listConversations() {
    await delay();
    return [...mockConversations].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },
  async getMessages(conversationId) {
    await delay(100);
    return [...(mockMessages[conversationId] ?? [])];
  },
  async startConversation(listingId) {
    const existing = mockConversations.find((conversation) => conversation.listing.id === listingId);
    if (existing) return existing.id;
    const listing = mockListings.find((item) => item.id === listingId);
    if (!listing) throw new Error('Listing not found');
    const id = `conversation-${Date.now()}`;
    mockConversations = [{
      id,
      listing: { id: listing.id, title: listing.title, price: listing.price, currency: listing.currency, imageUrls: listing.imageUrls },
      otherUser: listing.seller,
      lastMessage: '',
      updatedAt: new Date().toISOString(),
      unreadCount: 0,
    }, ...mockConversations];
    mockMessages[id] = [];
    return id;
  },
  async sendMessage(conversationId, body) {
    const message: Message = {
      id: `message-${Date.now()}`,
      conversationId,
      senderId: CURRENT_USER.id,
      body,
      createdAt: new Date().toISOString(),
    };
    mockMessages[conversationId] = [...(mockMessages[conversationId] ?? []), message];
    mockConversations = mockConversations.map((conversation) => conversation.id === conversationId
      ? { ...conversation, lastMessage: body, updatedAt: message.createdAt }
      : conversation);
    return message;
  },
};

function mapProfile(row: Record<string, unknown> | null | undefined): Profile {
  if (!row) return CURRENT_USER;
  return {
    id: String(row.id),
    displayName: String(row.display_name ?? 'msale member'),
    avatarUrl: row.avatar_url ? String(row.avatar_url) : undefined,
    bio: row.bio ? String(row.bio) : undefined,
    state: String(row.state ?? 'Malaysia'),
    joinedAt: String(row.joined_at ?? new Date().toISOString()),
    rating: Number(row.rating ?? 0),
    reviewCount: Number(row.review_count ?? 0),
    responseRate: Number(row.response_rate ?? 0),
    verified: Boolean(row.verified),
    languages: Array.isArray(row.languages) ? row.languages as Profile['languages'] : ['en'],
  };
}

function mapListing(row: Record<string, any>, favoriteIds = new Set<string>()): Listing {
  const images = Array.isArray(row.listing_images) ? row.listing_images : [];
  return {
    id: String(row.id),
    seller: mapProfile(row.seller),
    title: String(row.title),
    description: String(row.description ?? ''),
    price: Number(row.price),
    currency: 'MYR',
    condition: row.condition,
    category: row.category_slug,
    state: String(row.state),
    area: String(row.area),
    distanceKm: row.distance_km == null ? undefined : Number(row.distance_km),
    imageUrls: images.sort((a: any, b: any) => a.sort_order - b.sort_order).map((image: any) => image.public_url),
    createdAt: String(row.created_at),
    status: row.status,
    isFavorite: favoriteIds.has(String(row.id)),
    meetupNotes: row.meetup_notes ? String(row.meetup_notes) : undefined,
  };
}

const supabaseRepository: MarketplaceRepository = {
  async listListings(filters = {}) {
    const client = requireSupabase();
    let query = client
      .from('listings')
      .select('*, listing_images(*), seller:profiles!seller_id(*)')
      .eq('status', 'active');

    if (filters.query?.trim()) query = query.textSearch('search_document', filters.query.trim(), { type: 'websearch', config: 'simple' });
    if (filters.category && filters.category !== 'all') query = query.eq('category_slug', filters.category);
    if (filters.state) query = query.eq('state', filters.state);
    if (filters.condition && filters.condition !== 'all') query = query.eq('condition', filters.condition);
    if (filters.minPrice != null) query = query.gte('price', filters.minPrice);
    if (filters.maxPrice != null) query = query.lte('price', filters.maxPrice);

    if (filters.sort === 'price_low') query = query.order('price', { ascending: true });
    else if (filters.sort === 'price_high') query = query.order('price', { ascending: false });
    else query = query.order('created_at', { ascending: false });

    const [{ data, error }, userResult] = await Promise.all([query.limit(80), client.auth.getUser()]);
    if (error) throw error;

    const favoriteIds = new Set<string>();
    if (userResult.data.user) {
      const { data: favorites } = await client.from('favorites').select('listing_id').eq('user_id', userResult.data.user.id);
      favorites?.forEach((favorite) => favoriteIds.add(String(favorite.listing_id)));
    }
    return (data ?? []).map((row) => mapListing(row, favoriteIds));
  },
  async getListing(id) {
    const client = requireSupabase();
    const { data, error } = await client
      .from('listings')
      .select('*, listing_images(*), seller:profiles!seller_id(*)')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data ? mapListing(data) : null;
  },
  async toggleFavorite(listingId, nextValue) {
    const client = requireSupabase();
    const { data: userData } = await client.auth.getUser();
    if (!userData.user) throw new Error('Authentication required');
    const operation = nextValue
      ? client.from('favorites').upsert({ user_id: userData.user.id, listing_id: listingId })
      : client.from('favorites').delete().eq('user_id', userData.user.id).eq('listing_id', listingId);
    const { error } = await operation;
    if (error) throw error;
  },
  async createListing(input) {
    const client = requireSupabase();
    const { data: userData } = await client.auth.getUser();
    if (!userData.user) throw new Error('Authentication required');

    const { data: listing, error } = await client.from('listings').insert({
      seller_id: userData.user.id,
      title: input.title,
      description: input.description,
      price: input.price,
      condition: input.condition,
      category_slug: input.category,
      state: input.state,
      area: input.area,
      meetup_notes: input.meetupNotes || null,
      status: 'active',
    }).select('*').single();
    if (error) throw error;

    await Promise.all(input.imageUris.map(async (uri, index) => {
      const extension = uri.split('.').pop()?.toLowerCase().split('?')[0] || 'jpg';
      const storagePath = `${userData.user!.id}/${listing.id}/${Crypto.randomUUID()}.${extension}`;
      const response = await fetch(uri);
      const bytes = await response.arrayBuffer();
      const { error: uploadError } = await client.storage.from('listing-images').upload(storagePath, bytes, {
        contentType: extension === 'png' ? 'image/png' : 'image/jpeg',
      });
      if (uploadError) throw uploadError;
      const { data: publicData } = client.storage.from('listing-images').getPublicUrl(storagePath);
      const { error: imageError } = await client.from('listing_images').insert({
        listing_id: listing.id,
        storage_path: storagePath,
        public_url: publicData.publicUrl,
        sort_order: index,
      });
      if (imageError) throw imageError;
    }));

    const created = await this.getListing(String(listing.id));
    if (!created) throw new Error('Could not load the new listing');
    return created;
  },
  async listConversations() {
    const client = requireSupabase();
    const { data: userData } = await client.auth.getUser();
    if (!userData.user) return [];
    const userId = userData.user.id;
    const { data, error } = await client
      .from('conversations')
      .select('*, listing:listings!listing_id(id,title,price,currency,listing_images(*)), buyer:profiles!buyer_id(*), seller:profiles!seller_id(*)')
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('last_message_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row: any) => ({
      id: String(row.id),
      listing: {
        id: String(row.listing.id),
        title: String(row.listing.title),
        price: Number(row.listing.price),
        currency: 'MYR' as const,
        imageUrls: (row.listing.listing_images ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order).map((image: any) => image.public_url),
      },
      otherUser: mapProfile(row.buyer_id === userId ? row.seller : row.buyer),
      lastMessage: String(row.last_message_preview ?? ''),
      updatedAt: String(row.last_message_at ?? row.created_at),
      unreadCount: Number(row.unread_count ?? 0),
    }));
  },
  async getMessages(conversationId) {
    const client = requireSupabase();
    const { data, error } = await client.from('messages').select('*').eq('conversation_id', conversationId).order('created_at');
    if (error) throw error;
    return (data ?? []).map((row) => ({
      id: String(row.id), conversationId: String(row.conversation_id), senderId: String(row.sender_id),
      body: String(row.body), createdAt: String(row.created_at), readAt: row.read_at ? String(row.read_at) : undefined,
    }));
  },
  async startConversation(listingId) {
    const client = requireSupabase();
    const { data: userData } = await client.auth.getUser();
    if (!userData.user) throw new Error('Authentication required');
    const { data: listing, error: listingError } = await client.from('listings').select('seller_id').eq('id', listingId).single();
    if (listingError) throw listingError;
    const { data, error } = await client.from('conversations').upsert({
      listing_id: listingId,
      buyer_id: userData.user.id,
      seller_id: listing.seller_id,
    }, { onConflict: 'listing_id,buyer_id' }).select('id').single();
    if (error) throw error;
    return String(data.id);
  },
  async sendMessage(conversationId, body) {
    const client = requireSupabase();
    const { data: userData } = await client.auth.getUser();
    if (!userData.user) throw new Error('Authentication required');
    const { data, error } = await client.from('messages').insert({
      conversation_id: conversationId,
      sender_id: userData.user.id,
      body,
    }).select('*').single();
    if (error) throw error;
    return { id: String(data.id), conversationId, senderId: String(data.sender_id), body: String(data.body), createdAt: String(data.created_at) };
  },
};

export const marketplaceRepository = isSupabaseConfigured ? supabaseRepository : mockRepository;
