import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-paper';

export default function FilmPoster({ uri, width, height }) {
  const [hasError, setHasError] = useState(false);
  const size = { width, height };

  // Mostra um ícone quando o filme não tem imagem ou quando ela não carrega
  if (!uri || hasError) {
    return (
      <View style={[styles.placeholder, size]}>
        <Icon source="image-off-outline" size={28} color="#9AA0A6" />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={[styles.image, size]}
      resizeMode="cover"
      onError={() => setHasError(true)}
      accessibilityIgnoresInvertColors
    />
  );
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 8,
    backgroundColor: '#E8EBF0',
  },
  placeholder: {
    borderRadius: 8,
    backgroundColor: '#E8EBF0',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
