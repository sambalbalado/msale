export type LanguageCode = 'en' | 'ms' | 'zh';

export type ListingCondition = 'new' | 'like_new' | 'good' | 'fair';
export type ListingStatus = 'draft' | 'active' | 'reserved' | 'sold' | 'archived';

export type CategorySlug =
  | 'furniture'
  | 'electronics'
  | 'fashion'
  | 'vehicles'
  | 'hobbies'
  | 'home'
  | 'sports'
  | 'other';

export interface Profile {
  id: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  state: string;
  joinedAt: string;
  rating: number;
  reviewCount: number;
  responseRate?: number;
  verified?: boolean;
  languages: LanguageCode[];
}

export interface Listing {
  id: string;
  seller: Profile;
  title: string;
  description: string;
  price: number;
  currency: 'MYR';
  condition: ListingCondition;
  category: CategorySlug;
  state: string;
  area: string;
  distanceKm?: number;
  imageUrls: string[];
  createdAt: string;
  status: ListingStatus;
  isFavorite?: boolean;
  meetupNotes?: string;
}

export interface ListingFilters {
  query?: string;
  category?: CategorySlug | 'all';
  state?: string;
  condition?: ListingCondition | 'all';
  minPrice?: number;
  maxPrice?: number;
  sort?: 'newest' | 'price_low' | 'price_high' | 'nearby';
}

export interface CreateListingInput {
  title: string;
  description: string;
  price: number;
  condition: ListingCondition;
  category: CategorySlug;
  state: string;
  area: string;
  imageUris: string[];
  meetupNotes?: string;
}

export interface Conversation {
  id: string;
  listing: Pick<Listing, 'id' | 'title' | 'price' | 'currency' | 'imageUrls'>;
  otherUser: Profile;
  lastMessage: string;
  updatedAt: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
  readAt?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

