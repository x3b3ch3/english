document.addEventListener('DOMContentLoaded', onDOMLoaded.bind(this));

function onDOMLoaded() {
  const xhttp = new XMLHttpRequest();
  xhttp.responseType = 'json';
  xhttp.onreadystatechange = onXhttpLoaded.bind(this);
  xhttp.open('GET', 'verbs.json', true);
  xhttp.send();
  
  
  document.querySelector('.correct').onclick = onCorrectClick;
  document.querySelector('.restart').onclick = onRestartClick;

}

function onXhttpLoaded(event) {
  if (event.target.readyState == 4 && event.target.status == 200) {
    this.verbs = event.target.response;
    const {from, to} = getParams();
    creatTable(from, to);
  }
}

function onCorrectClick() {
  const cellInputs = document.querySelectorAll('tbody input');
  let good = 0;
  for (const textInput of cellInputs) {
    if (textInput.value) {
      if (textInput.value.toLowerCase().hashCode() == textInput.dataset.reponse) {
        textInput.style.backgroundColor = 'lightgreen';
        good += 1;
      } else
        textInput.style.backgroundColor = 'lightcoral';
    } 
    const color = textInput.value === textInput.dataset.reponse ? 'lightgreen' : 'lightcoral';
  }
  const score = good/cellInputs.length;

  let appreciation = '';
  if (score < .4)      appreciation = 'Oups, Trop d\'erreurs. Tu peux facilement faire mieux';
  else if (score < .7) appreciation = 'Hum, encore un peu de travail, essaie encore';
  else if (score < 1)  appreciation = 'Presque parfait, bravo';
  else                 appreciation = 'Parfait, tu as fait un sans faute';
 
  document.querySelector('.score').innerHTML = `Ton résultat : ${good}/${cellInputs.length}, ${appreciation}`;
}

function onRestartClick() {
  const from = document.querySelector('.from').value;
  const to = document.querySelector('.to').value;

  window.location.hash = `#?from=${from}&to=${to}`;
  creatTable(from, to);
}

function getParams() {
  const params = window.location.hash && window.location.hash.includes('?')
                   ? window.location.hash.split('#?')[1]
                                         .split('&')
                                         .map(v => {
                                           const [key, value] = v.split('=');
                                           return {key,value}
                                         })
                   : [{key:'from',value:0},{key:'to',value:10}];

  const from = +params.find(p => p.key === 'from').value;
  const to = +params.find(p => p.key === 'to').value;

  if (!window.location.hash) window.location.hash = `#?from=${from}&to=${to}`;

  return {from, to};
}

function creatTable(from, to) {
  document.querySelector('.from').value = from;
  document.querySelector('.to').value = to;

  // raz
  const tbody = document.querySelector('tbody');
  tbody.innerHTML = '';
  document.querySelector('.score').innerHTML = '';

  for (const row of this.verbs.slice(from, to).sort(() => Math.random() - 0.5)) {
    const rowEl = document.createElement('tr');
    tbody.appendChild(rowEl);
    let cellIdx = 0;
    const randomCell = Math.floor(Math.random()*4);
    for (const cell of row) {
      const cellEl = document.createElement('td');
      if (cellIdx === randomCell) {
        cellEl.innerHTML = `<span class='word'>${cell}</span>`
      } else {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'tape ta réponse';
        input.dataset.reponse = cell.toLowerCase().hashCode();
        cellEl.appendChild(input);
      }
      rowEl.appendChild(cellEl);
      cellIdx++;
    }
  }
}

String.prototype.hashCode = function() {
  var hash = 0,
    i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}