import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { useState } from 'react';

import { postService } from '@/services/post-service';
import { useTheme } from '@/hooks/use-theme';

export function PostThumbnail({
  postId,
  imageUrl,
  version,
}: {
  postId: number;
  imageUrl?: string | null;
  version?: string | number;
}) {
  const theme = useTheme();
  const thumbnailUrl = postService.thumbnailUrl(postId, version);
  const [source, setSource] = useState(thumbnailUrl);
  return (
    <View style={[styles.frame, { backgroundColor: theme.backgroundElement }]}>
      <Image
        source={{ uri: source }}
        style={styles.image}
        contentFit="cover"
        transition={150}
        onError={() => {
          if (source === thumbnailUrl && imageUrl) setSource(imageUrl);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { width: '100%', aspectRatio: 16 / 9, overflow: 'hidden', borderRadius: 10 },
  image: { width: '100%', height: '100%' },
});
