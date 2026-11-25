import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@ghibli-explorer:favorites';

export async function getFavorites() {
  try {
    const json = await AsyncStorage.getItem(FAVORITES_KEY);
    if (json === null) {
      return [];
    }
    const favorites = JSON.parse(json);
    return Array.isArray(favorites) ? favorites : [];
  } catch (error) {
    console.log('Erro ao ler os favoritos:', error.message);
    throw new Error('Não foi possível carregar os favoritos.');
  }
}

export async function saveFavorites(favorites) {
  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.log('Erro ao salvar os favoritos:', error.message);
    throw new Error('Não foi possível salvar os favoritos.');
  }
}

// Compara pelo id quando existir. Sem id, compara pelo título.
function isSameFilm(filmA, filmB) {
  if (filmA.id && filmB.id) {
    return filmA.id === filmB.id;
  }
  return filmA.title === filmB.title;
}

export function isFavorite(favorites, film) {
  return favorites.some((item) => isSameFilm(item, film));
}

export function addFavorite(favorites, film) {
  if (isFavorite(favorites, film)) {
    return favorites;
  }
  return [...favorites, film];
}

export function removeFavorite(favorites, film) {
  return favorites.filter((item) => !isSameFilm(item, film));
}
