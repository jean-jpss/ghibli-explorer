import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Snackbar, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import FilmCard from '../components/FilmCard';
import { getFavorites, removeFavorite, saveFavorites } from '../storage/favoritesStorage';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  async function loadFavorites() {
    try {
      const savedFavorites = await getFavorites();
      setFavorites(savedFavorites);
    } catch (error) {
      setSnackbarMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveFavorite(film) {
    const updatedFavorites = removeFavorite(favorites, film);
    try {
      await saveFavorites(updatedFavorites);
      setFavorites(updatedFavorites);
      setSnackbarMessage('Filme removido dos favoritos.');
    } catch (error) {
      setSnackbarMessage(error.message);
    }
  }

  useEffect(() => {
    loadFavorites();
  }, []);

  function renderFavorite({ item }) {
    return (
      <FilmCard
        film={item}
        favorite
        onPress={() => navigation.navigate('Details', { film: item })}
        onToggleFavorite={() => handleRemoveFavorite(item)}
      />
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={favorites}
        keyExtractor={(item, index) => item.id || String(index)}
        renderItem={renderFavorite}
        contentContainerStyle={favorites.length === 0 ? styles.center : styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text variant="titleMedium">Nenhum filme favorito</Text>
            <Text style={styles.message}>
              Toque no coração de um filme no catálogo para salvá-lo aqui.
            </Text>
          </View>
        }
      />

      <Snackbar visible={snackbarMessage !== ''} onDismiss={() => setSnackbarMessage('')} duration={2500}>
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  center: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  empty: {
    alignItems: 'center',
  },
  message: {
    marginTop: 8,
    textAlign: 'center',
    color: '#5F6368',
  },
});
