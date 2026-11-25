import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Divider, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import FilmPoster from '../components/FilmPoster';
import { formatDuration, formatScore, formatText } from '../utils/formatters';

function InfoItem({ label, value }) {
  return (
    <View style={styles.item}>
      <Text variant="labelLarge" style={styles.label}>
        {label}
      </Text>
      <Text variant="bodyLarge">{value}</Text>
    </View>
  );
}

export default function DetailsScreen({ route }) {
  const { film } = route.params;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card mode="outlined" style={styles.card}>
          <Card.Content>
            <View style={styles.poster}>
              <FilmPoster uri={film.image} width={180} height={270} />
            </View>

            <Text variant="headlineSmall" style={styles.title}>
              {formatText(film.title)}
            </Text>
            {film.original_title ? (
              <Text variant="bodyMedium" style={styles.originalTitle}>
                {film.original_title}
                {film.original_title_romanised ? ` (${film.original_title_romanised})` : ''}
              </Text>
            ) : null}

            <Divider style={styles.divider} />

            <InfoItem label="Descrição" value={formatText(film.description)} />
            <InfoItem label="Direção" value={formatText(film.director)} />
            <InfoItem label="Produção" value={formatText(film.producer)} />
            <InfoItem label="Ano de lançamento" value={formatText(film.release_date)} />
            <InfoItem label="Duração" value={formatDuration(film.running_time)} />
            <InfoItem label="Nota no Rotten Tomatoes" value={formatScore(film.rt_score)} />
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
  },
  poster: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  originalTitle: {
    marginTop: 4,
    textAlign: 'center',
    color: '#5F6368',
  },
  divider: {
    marginTop: 16,
    marginBottom: 4,
  },
  item: {
    marginTop: 12,
  },
  label: {
    color: '#5F6368',
    marginBottom: 2,
  },
});
