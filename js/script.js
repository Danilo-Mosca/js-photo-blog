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

  // Creo l'oggetto vuoto che conterrà le cards
  const objectCards = [{}, {}, {}, {}, {}, {}];

  for (let i = 0; i < 6; i++) {
    axios.get(baseUrl + resource, { params }).then((res) => {
      // console.log(res.data);

      // Recupero i singoli elementi e li aggiungo all'oggetto
      objectCards[i].title = res.data[i].title;
      objectCards[i].url = res.data[i].url;



      if (objectCards.length === 6) {
        // console.log(arrayImage);
        // console.log(arrayTitle);

        // Una volta ottenuti tutte le immagini e le descrizioni dal
        // server e popolato objectCards richiamo la funzione drawCards()
        // che li stampa sulla pagina web
        drawCards(objectCards);
      }
    });
  }
}


/* Funzione che stampa i dati sulla pagina html */
function drawCards(objectCards) {


  // Recupero l'elemento container dalla pagina html
  const container = document.getElementById('container');
  container.innerHTML = '';
  let cardContainer = document.createElement('figure');

  objectCards.forEach(element => {
    cardContainer.innerHTML += `
    <figure class="card-container">
        <img src="./img/pin.svg" alt="Pin" class="pin-image">
        <img src="${element.url}" alt="Prova" class="card-image">
        <figcaption class="title-image">${element.title}</figcaption>
    </figure>
    `;
    container.appendChild(cardContainer);
  });
}