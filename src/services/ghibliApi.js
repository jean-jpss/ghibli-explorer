const API_URL = 'https://ghibliapi.vercel.app/films';
const TIMEOUT_MS = 15000;

export async function fetchFilms() {
  // Cancela a requisição se a API demorar demais para responder
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response;
  try {
    response = await fetch(API_URL, { signal: controller.signal });
  } catch (error) {
    throw new Error('Não foi possível conectar à API. Verifique sua conexão com a internet.');
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    throw new Error(`A API está indisponível no momento (erro ${response.status}).`);
  }

  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error('A API retornou uma resposta inválida.');
  }

  if (!Array.isArray(data)) {
    throw new Error('A API retornou os dados em um formato inesperado.');
  }

  return data;
}
