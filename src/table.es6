// import AES from 'node_modules/crypto-js/aes';

document.addEventListener('DOMContentLoaded', onDOMLoaded);

function onDOMLoaded() {
  const xhttp = new XMLHttpRequest();
  xhttp.responseType = 'json';
  xhttp.onreadystatechange = onXhttpLoaded;
  xhttp.open('GET', 'dist/json/shared.json', true);
  xhttp.send();
  
  document.querySelector('.correct').onclick = onCorrectClick;
  document.querySelector('.restart').onclick = onRestartClick;
}

function onXhttpLoaded(event) {
  if (event.target.readyState == 4 && event.target.status == 200) {
    window.verbs = event.target.response;
    const {from, to} = getParams();
    creatTable(from, to);
  }
}

function onCorrectClick() {
  const cellInputs = document.querySelectorAll('tbody input');
  for (const textInput of cellInputs) {
    if (textInput.value) {
      const values = textInput.value.toLowerCase().trim().split(',').map(v => v.trim());
      // if as many matches as submitted responses => lightgreen else lightcoral
      const isRight = values.intersect(textInput.responses.decrypt()).length === values.length;
      textInput.className = isRight ? 'right'
                                    : 'wrong';
    }
  }
  const good = document.querySelectorAll('input.right').length;
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

  for (const row of window.verbs.slice(from, to).sort(() => Math.random() - 0.5)) {
    const rowEl = document.createElement('tr');
    tbody.appendChild(rowEl);
    let cellIdx = 0;
    const randomCell = Math.floor(Math.random()*4);
    for (const cell of row) {
      const cellEl = document.createElement('td');
      if (cellIdx === randomCell) {
        cellEl.innerHTML = `<span class='word'>${cell.decrypt().toString()}</span>`
      } else {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Ta réponse?';
        input.responses = cell;
        cellEl.appendChild(input);
      }
      rowEl.appendChild(cellEl);
      cellIdx++;
    }
  }
}

String.prototype.decrypt = function() {
  return CryptoJS.AES.decrypt(this, 'secret key 123').toString(CryptoJS.enc.Utf8);
}

Array.prototype.decrypt = function() {
  return this.map(i => i.decrypt());
}

Array.prototype.intersect = function(array) {
  return this.reduce((prev,curr) => [...array.filter(e => e === curr), ...prev] , []);
}