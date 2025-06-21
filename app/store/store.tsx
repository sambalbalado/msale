import { createContext, useContext, useState } from 'react';

export type Listing = {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
};

type ListingContextType = {
  listings: Listing[];
  addListing: (listing: Listing) => void;
};

const ListingContext = createContext<ListingContextType | undefined>(undefined);

export const ListingProvider = ({ children }: { children: React.ReactNode }) => {
  const [listings, setListings] = useState<Listing[]>([]);

  const addListing = (listing: Listing) => {
    setListings((prev) => [...prev, { ...listing, id: Date.now() }]);
  };

  return (
    <ListingContext.Provider value={{ listings, addListing }}>
      {children}
    </ListingContext.Provider>
  );
};

export const useListings = () => {
  const context = useContext(ListingContext);
  if (!context) throw new Error("useListings must be used inside ListingProvider");
  return context;
};