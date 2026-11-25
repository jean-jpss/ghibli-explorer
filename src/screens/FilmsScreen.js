import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Searchbar, Snackbar, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import FilmCard from '../components/FilmCard';
import { fetchFilms } from '../services/ghibliApi';
import {
  addFavorite,
  getFavorites,
  isFavorite,
  removeFavorite,
  saveFavorites,
} from '../storage/favoritesStorage';

export default function FilmsScreen({ navigation }) {
  const [films, setFilms] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  async function loadFilms() {
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await fetchFilms();
      setFilms(data);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadFavorites() {
    try {
      const savedFavorites = await getFavorites();
      setFavorites(savedFavorites);
    } catch (error) {
      setSnackbarMessage(error.message);
    }
  }

  async function handleToggleFavorite(film) {
    const alreadyFavorite = isFavorite(favorites, film);
    const updatedFavorites = alreadyFavorite
      ? removeFavorite(favorites, film)
      : addFavorite(favorites, film);

    try {
      await saveFavorites(updatedFavorites);
      setFavorites(updatedFavorites);
      setSnackbarMessage(alreadyFavorite ? 'Filme removido dos favoritos.' : 'Filme adicionado aos favoritos.');
    } catch (error) {
      setSnackbarMessage(error.message);
    }
  }

  useEffect(() => {
    loadFilms();
  }, []);

  // Recarrega os favoritos sempre que a tela volta a ficar visível,
  // pois eles podem ter sido alterados na tela de favoritos
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadFavorites);
    return unsubscribe;
  }, [navigation]);

  const searchText = search.trim().toLowerCase();
  const filteredFilms = films.filter((film) => (film.title || '').toLowerCase().includes(searchText));

  function renderFilm({ item }) {
    return (
      <FilmCard
        film={item}
        favorite={isFavorite(favorites, item)}
        onPress={() => navigation.navigate('Details', { film: item })}
        onToggleFavorite={() => handleToggleFavorite(item)}
      />
    );
  }

  function renderContent() {
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.message}>Carregando filmes...</Text>
        </View>
      );
    }

    if (errorMessage !== '') {
      return (
        <View style={styles.center}>
          <Text variant="titleMedium">Não foi possível carregar os filmes</Text>
          <Text style={styles.message}>{errorMessage}</Text>
          <Button mode="contained" icon="refresh" onPress={loadFilms} style={styles.retryButton}>
            Tentar novamente
          </Button>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredFilms}
        keyExtractor={(item, index) => item.id || String(index)}
        renderItem={renderFilm}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListEmptyComponent={
          <Text style={styles.message}>
            {searchText !== '' ? `Nenhum filme encontrado para "${search.trim()}".` : 'Nenhum filme disponível.'}
          </Text>
        }
      />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text variant="titleLarge" style={styles.title}>
            Filmes do Studio Ghibli
          </Text>
          <Button mode="outlined" icon="heart" compact onPress={() => navigation.navigate('Favorites')}>
            Favoritos
          </Button>
        </View>

        <Searchbar
          placeholder="Pesquisar pelo nome"
          value={search}
          onChangeText={setSearch}
          style={styles.searchbar}
        />

        {!loading && errorMessage === '' && (
          <Text variant="bodySmall" style={styles.counter}>
            {filteredFilms.length} filmes encontrados
          </Text>
        )}
      </View>

      {renderContent()}

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
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontWeight: 'bold',
    flexShrink: 1,
    marginRight: 8,
  },
  searchbar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  counter: {
    marginTop: 8,
    color: '#5F6368',
  },
  list: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  message: {
    marginTop: 12,
    textAlign: 'center',
    color: '#5F6368',
  },
  retryButton: {
    marginTop: 16,
  },
});
