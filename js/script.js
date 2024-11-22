"use strict";
console.clear();
/*
*Milestone 1*
Sfruttando gli screen e gli asset in allegato riproduciamo la grafica proposta in maniera statica: utilizzando soltanto HTML e CSS e riproducendo una singola fotografia (usiamo una qualunque immagine a piacimento)
*Milestone 2*
Utilizzando Postman, testiamo una chiamata all’endpoint di JSON Placeholder:
https://jsonplaceholder.typicode.com/photos?_limit=6
Studiamo bene la risposta e i dati che ci fornisce iniziando a pensare a come poterli sfruttare.
*Milestone 3*
Inseriamo un foglio JavaScript ed effettuiamo una chiamata AJAX all’API di JSON Placeholder, sfruttando la risposta per generare dinamicamente in pagina una serie di foto!
*Bonus*
rendi la pagina responsive, in modo che su mobile e tablet le foto si dispongano man mano una sotto l’altra ed il titolo abbia una dimensione adeguata
*/


// Invoco subito la funzione per recuperare le immagini dal server
getCards();



/* Funzione che recupera i dati dal server */
function getCards() {
  const baseUrl = 'https://jsonplaceholder.typicode.com/';
  const resource = 'photos';

  const endpoint = baseUrl + resource;
  const params = { "_limit": 6 };
  // console.log(endpoint+'?_limit=6');
  console.log(endpoint + params);
  // Prelevo i dati da una chiamata Ajax
  axios.get(baseUrl + resource, { params }).then((res) => {
    console.log(res.data);
    const cards = res.data;
    drawCards(cards);
  }).catch((error) => {
    console.log(error);
  }).finally(() => {
    // Alla fine, trascorso un secondo tolgo il loader che simula il caricamento
    const loader = document.querySelector('#loader');
    setTimeout(() => {
      loader.classList.add('d-none');
    }, 1000);
  });
}



/* Funzione che stampa i dati sulla pagina html */
function drawCards(serverItems) {

  /* PRIMA SOLUZIONE: inserisco tutti i tag in una variabile     *
   * (cardsTemplate) usando i Template literals, e poi li        *
   * appendo tutti al loro container con il metodo innerHTML()   *

    // console.log(serverItems);
    // Recupero l'elemento container dalla pagina html
  const container = document.getElementById('container');
  container.innerHTML = '';

  let cardsTemplate = '';
  serverItems.forEach(element => {
    cardsTemplate += `
    <figure class="card-container">
        <img src="./img/pin.svg" alt="Pin" class="pin-image">
        <img src="${element.url}" alt="Prova" class="card-image">
        <figcaption class="title-image">${element.title}</figcaption>
    </figure>
    `;
  });
  container.innerHTML += cardsTemplate;

  FINE PRIMA SOLUZIONE */

  /* SECONDA SOLUZIONE ADOTTATA: creando i singoli elementi nodi *
   * che fanno parte del template html e aggiungendoli uno ad    *
   * uno nella pagina html con il metodo appendCHild()           */

  const container = document.getElementById('container');
  container.innerHTML = '';

  serverItems.forEach(element => {
    // mi creo i singoli elementi ad ogni iterazione del ciclo
    const elementFigure = document.createElement('figure');
    const elementImgPin = document.createElement('img');
    const elementImg = document.createElement('img');
    const elementFigcaption = document.createElement('figcaption');

    // Recupero le loro classi
    elementFigure.classList.add('card-container');
    elementImgPin.classList.add('pin-image');
    elementImg.classList.add('card-image');
    elementFigcaption.classList.add('title-image');

    // Aggiungo le loro proprietà
    elementFigure.id = element.id;
    elementImgPin.src = "./img/pin.svg";
    elementImgPin.alt = "Pin";
    elementImg.id = element.id;
    elementImg.src = element.url;
    elementImg.alt = element.title;
    elementFigcaption.textContent = element.title;

    // Aggiungo l'elemento <figure> dentro al container
    container.appendChild(elementFigure);

    // Aggiungo gli altri elementi dentro il tag <figure>
    elementFigure.appendChild(elementImgPin);
    elementFigure.appendChild(elementImg);
    elementFigure.appendChild(elementFigcaption);
  });

  // Richiamo la funzione che fara' comparire l'overlay
  getOverlay(serverItems);
}



/* Funzione per far comparire l'overlay a tutti schermo al click sull'immagine */
function getOverlay(cards) {
  const figures = document.querySelectorAll('.card-container');
  const overlay = document.getElementById('overlay');
  // Recupero il pulsante Chiudi
  const btnChiudi = overlay.querySelector('#overlay button:nth-child(1)');
  // Recupero il pulsante Cancella
  const btnRemove = overlay.querySelector('#overlay button:nth-child(2)');
  const imageOverlay = document.querySelector('#overlay img');

  // Gestore degli eventi per la chiusura dell'overlay
  btnChiudi.addEventListener('click', (() => {
    // aggiungo la classe d-none per nascondere l'overlay
    overlay.classList.add('d-none');
    // Inizializzo il dataset e gli imposto il valore iniziale a zero
    overlay.dataset.dataId = false;
    overlay.dataset.dataIndex = false;
  }));



  figures.forEach((figure, index) => {
    figure.addEventListener('click', function (event) {
      event.stopPropagation();
      // Rimuovo la classe d-none per mostrare l'overlay
      overlay.classList.remove('d-none');
      // Al primo dataset gli assegno l'id del card-container (equivalente all'indice della figure stampata nell'html. Ps: l'indice parte da 1 non da 0))
      overlay.dataset.dataId = figure.id;
      // Al secondo assegno l'id corrente che sto visualizzando che equivale all'indice dell'oggetto cards
      overlay.dataset.dataIndex = index;

      /* Metodo 1:
      const imgSelected = figure.querySelector('img.card-image');
      imageOverlay.src = imgSelected.src;
      imageOverlay.alt = imgSelected.alt;
      */
      /* Metodo 2 utilizzato: */
      const photo = cards.find((element) => {
        // Controllo se gli id sono uguali e restituisco la rispettiva foto
        return element.id === parseInt(figure.id);
      });
      // Assegno l'url e l'alternative text esatto corrispondente alla foto
      imageOverlay.src = photo.url;
      imageOverlay.alt = photo.title;
      /* End Metodo 2 */
    });
  });


  /* Gestore degli eventi per la cancellazione della fotografia */
  btnRemove.addEventListener('click', ((event) => {
    // aggiungo la classe d-none per nascondere l'overlay
    overlay.classList.add('d-none');
    // Assegno i valori attuali dei dataset a due variabili
    const figure_id = overlay.dataset.dataId;
    const index = overlay.dataset.dataIndex;
    // Se i due indici sono diversi da false, e quindi non vuoti o comunque diversi
    // dal valore iniziale che gli ho assegnato 
    if (figure_id !== false && index !== false) {
      // Allora cancello l'oggetto corrispondente a quell'indice dall'array di oggetti cards
      cards.splice(index, 1);
      // Ed elimino dall'html la foto corrispondente a index
      document.getElementById(figure_id).remove();
    }

    if (cards.length === 0) {
      countdown();
    }
  }));
}


/* Funzione che ricaricare la pagina dopo 10 secondi */
function countdown() {
  let seconds = 10;
  const container = document.getElementById('container');
  container.innerHTML = `<h1>Tra ${seconds--} secondi la pagina verra ricaricata</h1> `;
  const timer = setInterval(() => {
    if (seconds > 0) {
      container.innerHTML = `<h1>Tra ${seconds--} secondi la pagina verra ricaricata</h1> `;
    }
    else {
      clearInterval(timer);
      location.reload();
    }
  }, 1000);
}