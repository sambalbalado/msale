// ✅ app/store/store.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// ✅ Define the shape of a single listing
export type Listing = {
  id: number;
  title: string;
  price: string;
  description: string;
  images: string[];       // List of image URIs
  createdAt: number;      // Timestamp for auto-delete logic
};

// ✅ Define the shape of the context
export type ListingContextType = {
  listings: Listing[];
  addListing: (listing: Listing) => void;
  removeListing: (id: number) => void;
};

// ✅ Create the context
const ListingContext = createContext<ListingContextType | undefined>(undefined);

// ✅ Custom hook to access context
export const useListings = (): ListingContextType => {
  const context = useContext(ListingContext);
  if (!context) {
    throw new Error('useListings must be used within a ListingProvider');
  }
  return context;
};

// ✅ Provider component
export const ListingProvider = ({ children }: { children: ReactNode }) => {
  const [listings, setListings] = useState<Listing[]>([]);

  const addListing = (listing: Listing) => {
    setListings((prev) => [listing, ...prev]);
  };

  const removeListing = (id: number) => {
    setListings((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <ListingContext.Provider value={{ listings, addListing, removeListing }}>
      {children}
    </ListingContext.Provider>
  );
};
