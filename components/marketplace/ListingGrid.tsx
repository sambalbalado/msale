import { FlashList } from '@shopify/flash-list';
import { useWindowDimensions, View } from 'react-native';

import { spacing } from '@/constants/theme';
import { Listing } from '@/types/domain';
import { ListingCard } from './ListingCard';

type Props = {
  listings: Listing[];
  onPress: (listing: Listing) => void;
  onToggleFavorite: (listing: Listing) => void;
  ListHeaderComponent?: React.ReactElement;
  ListEmptyComponent?: React.ReactElement;
  contentBottomPadding?: number;
};

export function ListingGrid({ listings, onPress, onToggleFavorite, ListHeaderComponent, ListEmptyComponent, contentBottomPadding = 120 }: Props) {
  const { width } = useWindowDimensions();
  const columns = width >= 1100 ? 4 : width >= 720 ? 3 : 2;
  return (
    <FlashList
      key={`grid-${columns}`}
      data={listings}
      numColumns={columns}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: contentBottomPadding }}
      ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
      renderItem={({ item, index }) => (
        <View style={{ flex: 1, marginLeft: index % columns === 0 ? 0 : spacing.xs, marginRight: index % columns === columns - 1 ? 0 : spacing.xs }}>
          <ListingCard listing={item} onPress={() => onPress(item)} onToggleFavorite={() => onToggleFavorite(item)} />
        </View>
      )}
    />
  );
}

