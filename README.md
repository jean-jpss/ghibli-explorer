# Ghibli Explorer

Atividade Individual 05 do curso de Análise e Desenvolvimento de Sistemas (ADS): aplicativo mobile com React Native, Expo e navegação entre telas.

## Objetivo

O Ghibli Explorer consulta uma API pública com os filmes do Studio Ghibli e permite:

- ver o catálogo de filmes;
- pesquisar filmes pelo nome;
- abrir os detalhes de um filme;
- salvar filmes favoritos no próprio celular.

O projeto demonstra o consumo de uma API externa, a navegação com React Navigation, a estilização com React Native Paper e o armazenamento local com AsyncStorage.

## Tecnologias utilizadas

| Tecnologia | Versão | Uso no projeto |
|---|---|---|
| React Native | 0.88.1 | Base do aplicativo |
| Expo | SDK 58 | Execução e testes com o Expo Go |
| JavaScript | | Linguagem do projeto |
| React Hooks | | `useState` e `useEffect` |
| React Navigation | 7 | Navegação do tipo Stack entre as telas |
| React Native Paper | 5 | Componentes visuais (cartões, botões, pesquisa, avisos) |
| AsyncStorage | 2.2.0 | Armazenamento local dos favoritos |
| Fetch API | | Requisição à API de filmes |

Bibliotecas complementares, exigidas pelas bibliotecas acima:

- `react-native-screens` e `react-native-safe-area-context`: necessárias para o React Navigation funcionar.
- `@expo/vector-icons`: fornece os ícones usados pelo React Native Paper (coração, lupa, atualizar).

Todas estão nas versões compatíveis com o Expo Go do SDK 58.

## Funcionalidades

**Catálogo (tela inicial)**
- Lista de filmes carregada da API, com pôster, título, ano de lançamento e direção.
- Campo de pesquisa por nome, com mensagem quando nenhum filme é encontrado.
- Botão "Favoritos" para abrir a tela de favoritos.
- Ícone de coração em cada cartão para adicionar ou remover dos favoritos.
- Indicador de carregamento, mensagem de erro e botão "Tentar novamente".

**Detalhes**
- Pôster, título, título original, descrição, direção, produção, ano de lançamento, duração e nota no Rotten Tomatoes.
- Se algum campo estiver vazio, aparece "Não informado". Se o pôster não carregar, aparece um ícone no lugar.

**Favoritos**
- Lista dos filmes salvos, com acesso aos detalhes.
- Remoção pelo ícone de coração.
- Mensagem quando não há favoritos.
- Os favoritos continuam salvos depois que o aplicativo é fechado.

## API utilizada

- **Serviço:** Studio Ghibli API, gratuita e sem chave de acesso. É mantida pela comunidade, não pelo Studio Ghibli.
- **Endpoint:** `GET https://ghibliapi.vercel.app/films`
- **Resposta:** uma lista em JSON (`application/json`). Em 24/11/2026, a lista tinha 22 filmes, todos com os campos abaixo preenchidos.

Campos usados pelo aplicativo:

| Campo | Tipo | Exemplo |
|---|---|---|
| `id` | texto | `"2baf70d1-42bb-4437-b551-e5fed5a87abe"` |
| `title` | texto | `"Castle in the Sky"` |
| `original_title` | texto | `"天空の城ラピュタ"` |
| `original_title_romanised` | texto | `"Tenkū no shiro Rapyuta"` |
| `image` | texto (link do pôster) | `"https://image.tmdb.org/t/p/w600_and_h900_bestv2/npOnzAbLh6VOIu3naU5QaEcTepo.jpg"` |
| `description` | texto | `"The orphan Sheeta inherited a mysterious crystal..."` |
| `director` | texto | `"Hayao Miyazaki"` |
| `producer` | texto | `"Isao Takahata"` |
| `release_date` | texto com o ano | `"1986"` |
| `running_time` | texto com os minutos | `"124"` |
| `rt_score` | texto com a nota | `"95"` |

A API também retorna `movie_banner`, `url`, `people`, `species`, `locations` e `vehicles`, que não são usados pelo app.

Observações:

- Os textos (títulos e descrições) vêm em inglês e são exibidos como a API envia.
- `rt_score` é a nota de aprovação da crítica no site Rotten Tomatoes, de 0 a 100. Não é classificação indicativa.
- A API não fornece gênero nem classificação indicativa, por isso esses campos não aparecem.
- Os pôsteres são links para imagens hospedadas no site The Movie Database (TMDB).
- A comunicação com a API fica no arquivo `src/services/ghibliApi.js`. A função `fetchFilms()` faz a requisição com `fetch()`, verifica se a resposta foi bem-sucedida, converte para JSON, confere se veio uma lista e retorna os filmes. Se a API não responder em 15 segundos, a requisição é cancelada e o app mostra a mensagem de erro.

## Estratégia de navegação

O app usa React Navigation com navegação do tipo **Stack** (pilha). Cada tela aberta fica por cima da anterior, e o botão voltar retorna à tela de baixo.

| Rota | Tela | Arquivo |
|---|---|---|
| `Films` | Catálogo de filmes (tela inicial) | `src/screens/FilmsScreen.js` |
| `Details` | Detalhes do filme | `src/screens/DetailsScreen.js` |
| `Favorites` | Favoritos | `src/screens/FavoritesScreen.js` |

Fluxo:

- Films → toque em um filme → Details
- Films → botão "Favoritos" → Favorites
- Favorites → toque em um filme → Details
- Em qualquer tela, a seta do cabeçalho ou o botão voltar do Android retornam à tela anterior.

As rotas são criadas no `App.js`. Para abrir os detalhes, o filme selecionado é enviado como parâmetro da rota:

```js
navigation.navigate('Details', { film: item });
```

A tela de detalhes lê esse parâmetro com `route.params.film`. Assim, ela usa os dados que já foram carregados, sem fazer uma nova requisição à API.

## Utilização do AsyncStorage

Os favoritos ficam salvos no próprio celular pelo arquivo `src/storage/favoritesStorage.js`, com a chave `@ghibli-explorer:favorites`.

- `getFavorites()`: lê a chave, converte o texto JSON em lista e retorna os favoritos. Se ainda não houver nada salvo, retorna uma lista vazia.
- `saveFavorites(favorites)`: converte a lista para JSON com `JSON.stringify` e grava na chave.
- `addFavorite`, `removeFavorite` e `isFavorite`: funções auxiliares que montam a nova lista. Elas comparam os filmes pelo `id`, o que impede favoritos duplicados.

O filme é salvo completo (título, descrição, pôster e os demais campos), por isso a tela de favoritos funciona e abre os detalhes sem consultar a API de novo.

A tela de catálogo recarrega os favoritos sempre que volta a aparecer, usando o evento `focus` da navegação. Assim, um filme removido na tela de favoritos já aparece sem o coração preenchido quando o usuário volta ao catálogo.

Se a leitura ou a gravação falhar, o app mostra um aviso na parte de baixo da tela e continua funcionando.

## Estrutura de pastas

```
GhibliExplorer/
├── App.js                      Tema e rotas da navegação
├── app.json                    Configuração do Expo
├── index.js                    Registro do componente principal
├── package.json                Dependências e scripts
├── package-lock.json           Versões exatas instaladas
├── README.md
├── .gitignore
├── assets/                     Ícones do aplicativo
└── src/
    ├── components/
    │   ├── FilmCard.js         Cartão de filme usado no catálogo e nos favoritos
    │   └── FilmPoster.js       Pôster com ícone substituto quando a imagem falha
    ├── screens/
    │   ├── FilmsScreen.js      Catálogo, pesquisa e favoritar
    │   ├── DetailsScreen.js    Detalhes do filme
    │   └── FavoritesScreen.js  Lista de favoritos
    ├── services/
    │   └── ghibliApi.js        Consulta à API
    ├── storage/
    │   └── favoritesStorage.js Leitura e gravação dos favoritos
    └── utils/
        └── formatters.js       Textos para campos vazios, duração e nota
```

O `FilmPoster.js` foi separado porque o pôster aparece no cartão e na tela de detalhes, com a mesma regra para imagens que não carregam. A pasta `utils` reúne as funções de formatação usadas por esses dois lugares.

## Requisitos para execução

- Node.js na versão 22.13 ou superior (linha 22), 24.3 ou superior (linha 24), ou 26 em diante. Versões ímpares, como 23 e 25, não são suportadas pelo Expo SDK 58. Confira com `node -v`.
- Visual Studio Code.
- Celular com o aplicativo **Expo Go** atualizado (com suporte ao SDK 58), ou um emulador Android configurado no Android Studio.
- Computador e celular na mesma rede Wi-Fi.
- Internet no celular, pois o app consulta a API online.

## Instalação e execução no Windows com VS Code

1. Extraia o arquivo ZIP.
2. No VS Code, clique em **File > Open Folder** e selecione a pasta `GhibliExplorer` que contém o arquivo `package.json`. A opção "Extrair tudo" do Windows pode criar uma pasta dentro de outra com o mesmo nome. Nesse caso, abra a de dentro.
3. Abra o terminal com **Terminal > New Terminal** (atalho `Ctrl + '`) e confira se está na pasta certa com `dir`. O `package.json` deve aparecer na lista.
4. Instale as dependências:

```
npm install
```

5. Inicie o Expo:

```
npx expo start
```

6. Abra o app:
   - **Android:** no Expo Go, escaneie o QR Code exibido no terminal.
   - **iPhone:** aponte a câmera para o QR Code e toque no link.
   - **Emulador Android:** com o emulador aberto, pressione `a` no terminal.

Na primeira execução, o Firewall do Windows pode pedir permissão para o Node.js. Permita o acesso em redes privadas. Se a rede bloquear a conexão (comum em redes de faculdade), use `npx expo start --tunnel`. O Expo pode pedir para instalar um pacote adicional, basta confirmar.

## Como testar as funcionalidades

1. **Catálogo:** ao abrir, aparece o indicador de carregamento e depois a lista com os filmes e seus pôsteres.
2. **Pesquisa:** digite `totoro`. Depois digite um texto que não existe, como `naruto`, para ver a mensagem de nenhum resultado.
3. **Detalhes:** toque em um filme. Volte pela seta do cabeçalho.
4. **Favoritar:** toque no coração de dois filmes. O coração fica preenchido e aparece o aviso "Filme adicionado aos favoritos."
5. **Favoritos:** toque em "Favoritos". Os filmes salvos aparecem. Toque em um deles para abrir os detalhes.
6. **Remover:** na tela de favoritos, toque no coração de um filme. Remova todos para ver a mensagem "Nenhum filme favorito".
7. **Persistência:** favorite um filme, feche o Expo Go por completo e abra o projeto de novo. O coração continua preenchido.
8. **Erro:** ative o modo avião, recarregue o app (tecla `r` no terminal) e veja a mensagem de erro. Desative o modo avião e toque em "Tentar novamente".

## Publicação no GitHub

1. Crie um repositório **público** e vazio no GitHub, sem README, sem .gitignore e sem licença.
2. No terminal do VS Code, dentro da pasta do projeto, rode um comando por vez:

```bash
git init
git add .
git commit -m "Atividade 05 - React Native e rotas"
git branch -M main
git remote add origin URL_DO_REPOSITORIO
git push -u origin main
```

Substitua `URL_DO_REPOSITORIO` pelo endereço que o GitHub mostra depois de criar o repositório, no formato `https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git`.

O `.gitignore` impede o envio da pasta `node_modules`, dos arquivos temporários do Expo, de arquivos `.env` e de configurações pessoais do editor.

## Observações

- A Studio Ghibli API é mantida pela comunidade e hospedada gratuitamente. Se ela ficar fora do ar, o app mostra a mensagem de erro e o botão "Tentar novamente".
- O `npm install` pode mostrar avisos de vulnerabilidades moderadas em ferramentas internas do Expo. Não execute `npm audit fix --force`, pois esse comando rebaixa o Expo para uma versão antiga e quebra o projeto.
- A execução no navegador (tecla `w`) não foi configurada, porque o foco do projeto é o celular.
