# Easy Pomodoro

<!--Tecnologias Utilizadas e suas versões-->

[![Manifest versão][manifest-badget]][manifest-link]

> Status: :white_check_mark: Finalizado

## Indíce :bookmark_tabs:

:cd: [Descrição](#descrição-clipboard) 

:cd: [Funcionalidades](#funcionalidades-gear)    

:cd: [Telas da Extensão](#telas-da-extensão-art) 

:cd: [Como Instalar](#como-instalar-floppy_disk)

:cd: [Outras Tecnologias](#outras-tecnologias-books)

:cd: [Créditos](#créditos-clapper)

:cd: [Contribuir](#contribuir-gift) 

## Descrição :clipboard:

<p style="text-align:justify">
Easy Pomodoro é uma extensão de timer Pomodoro para o navegador Chrome, onde o usuário pode definir, iniciar, pausar e encerrar seus próprios Pomodoros e Pausas Curtas ou Longas. Além disso, é possível definir ciclos de timers para organizar a rotina do usuário.
</p>

*PS: Um ciclo de timers é uma série de timers entre Pomodoros e Pausas Curtas, até terminar na primeira Pausa Longa. Cada rotina pode incluir vários ciclos, com uma sequência que melhor atenda as necessidades do usuário.*

## Funcionalidades :gear:

### O usuário pode:
- Definir a duração dos timers;
- Iniciar, Pausar e Encerrar um timer;
- Pular um timer;
- Definir a frequência das pausas, e assim criar um ciclo de timers;
- Reiniciar um ciclo de timers.

### O sistema pode:
- Mostrar uma notificação ao final do timer;
- Apresentar o ciclo atual e a sua quantidade de pomodoros, pausas curtas e longas;
- Indicar qual é o próximo timer a ser tocado.

## Telas da Extensão :art:

### Home Page - Timer Não Iniciado

![Home Page - Timer não inciado][home-page-timer-nao-iniciado-img]

### Home Page - Timer Iniciado | Pausado | Cancelado

![Home Page - Timer Iniciado | Pausado | Cancelado][home-page-timer-iniciado-gif]

### Settings Page

![Settings Page][settings-page-img]

## Como Instalar :floppy_disk:

### 1. Clone

Clone este projeto no seu computador para poder adicioná-lo ao Chrome:
```
git clone https://github.com/GustavoHerreroNunes/easy_pomodoro.git
```

### 2. Gerenciar de Extensões

1. No Chrome, abra o menu de extensões clicando no ícone de quebra-cabeça no canto superior direito da tela

2. Clique na última opção, "Gerenciar Extensões"

![Gerenciar de Extensões][gerenciar-de-extensoes-img]

### 3. Modo Desenvolvedor

Ative o modo desenvolvedor para adicionar uma extensão diretamento do seu computador.

![Modo Desenvolvedor][modo-desenvolvedor-img]

### 4. Carregar Sem Compactação

1. Aperte no botão "Carregar sem compactação" no canto superior esquerdo da tela:
![Carregar sem compactacao][carregar-sem-compactacao-img]

2. Selecione a pasta do projeto "easy-pomodoro"

3. Pronto, a extensão já foi adicionada.

## Outras tecnologias :books:

Neste projeto foi também foi usado:
- [Indexed DB][indexed-db-mdn]
- [Web Storage][web-storage-mdn]

## Créditos :clapper:

Um agradecimentos a todos os artistas do [Flaticon][flaticon-link] que criaram os ícones utilizados neste projeto:

- [Play by Noplubery][play-icon-link]
- [Pause by inkubators][pause-icon-link]
- [Settings by Phoenix Group][settings-icon-link]
- [Tomato by popo2021][tomato-icon-link]
- ['X' by bsd][x-icon-link]
- [Reset by Dixit Lakhani_02][reset-icon-link]

## Contribuir :gift:

Se você tem alguma ideia, sugestão, ou viu algum erro, você pode me contar [aqui (Issues)][issues].

<!---Links utilizados no documento-->

[manifest-badget]:https://img.shields.io/static/v1?label=Manifest&message=V3&color=blue&style=for-the-badge
[manifest-link]: https://developer.chrome.com/docs/extensions/mv3/intro/

[home-page-timer-nao-iniciado-img]: https://github.com/GustavoHerreroNunes/easy-pomodoro/blob/main/assets/README/home_page-timer_nao_iniciado.jpg

[home-page-timer-iniciado-gif]: https://github.com/GustavoHerreroNunes/easy-pomodoro/blob/main/assets/README/home_page-timer_iniciado.gif

[settings-page-img]: https://github.com/GustavoHerreroNunes/easy-pomodoro/blob/main/assets/README/settings_page.jpg

[gerenciar-de-extensoes-img]: https://github.com/GustavoHerreroNunes/easy-pomodoro/blob/main/assets/README/gerenciar_extensoes.jpg

[modo-desenvolvedor-img]: https://github.com/GustavoHerreroNunes/easy-pomodoro/blob/main/assets/README/modo_desenvolvedor.jpg

[carregar-sem-compactacao-img]: https://github.com/GustavoHerreroNunes/easy-pomodoro/blob/main/assets/README/carregar_sem_compactacao.jpg

[indexed-db-mdn]: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API

[web-storage-mdn]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API

[flaticon-link]: https://www.flaticon.com/

[play-icon-link]: https://www.flaticon.com/br/icones-gratis/video

[pause-icon-link]: https://www.flaticon.com/br/icones-gratis/pausa

[settings-icon-link]: https://www.flaticon.com/free-icons/setting

[tomato-icon-link]: https://www.flaticon.com/free-icons/tomato

[x-icon-link]: https://www.flaticon.com/free-icons/close-button

[reset-icon-link]:https://www.flaticon.com/free-icons/reset 

[issues]: https://github.com/GustavoHerreroNunes/easy_pomodoro/issues