import { StyleSheet, View } from 'react-native';
import { Card, IconButton, Text, useTheme } from 'react-native-paper';
import FilmPoster from './FilmPoster';
import { formatText } from '../utils/formatters';

export default function FilmCard({ film, favorite, onPress, onToggleFavorite }) {
  const theme = useTheme();

  return (
    <Card mode="outlined" style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <FilmPoster uri={film.image} width={64} height={96} />

        <View style={styles.info}>
          <Text variant="titleMedium" numberOfLines={2}>
            {formatText(film.title)}
          </Text>
          <Text variant="bodyMedium" style={styles.detail}>
            Lançamento: {formatText(film.release_date)}
          </Text>
          <Text variant="bodySmall" style={styles.detail} numberOfLines={1}>
            Direção: {formatText(film.director)}
          </Text>
        </View>

        <IconButton
          icon={favorite ? 'heart' : 'heart-outline'}
          iconColor={favorite ? theme.colors.primary : theme.colors.onSurfaceVariant}
          accessibilityLabel={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          onPress={onToggleFavorite}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  detail: {
    marginTop: 4,
    color: '#5F6368',
  },
});
