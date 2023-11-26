document.addEventListener("DOMContentLoaded", () => {
  const verbs = [
    ['arise', 'arose', 'arisen', 'surgir'],
    ['awake', 'awoke', 'awaken', 'se réveiller'],
    ['be', 'was', 'been', 'être'],
    ['beat', 'beat', 'beaten', 'battre'],
    ['become', 'became', 'become', 'devenir'],
    ['begin', 'began', 'begun', 'commencer'],
    ['bent', 'bent', 'bent', 'plier'],
    ['bet', 'bet', 'bet', 'parier'],
    ['bite', 'bit', 'bitten', 'mordre'],
    ['bleed', 'bled', 'bled', 'saigner'],
    ['blow', 'blew', 'blown', 'souffler'],
    ['break', 'broke', 'broken', 'casser'],
    ['breed', 'bred', 'bred', 'élever'],
    ['bring', 'brought', 'brought', 'apporter'],
    ['build', 'built', 'built', 'construire'],
    ['burn', 'burnt', 'burnt', 'brûler'],
    ['burst', 'burst', 'burst', 'éclater'],
    ['buy', 'bought', 'bought', 'acheter'],
    ['cast', 'cast', 'cast', 'jeter'],
    ['catch', 'caught', 'caught', 'attraper'],
    ['choose', 'chose', 'chosen', 'choisir'],
    ['come', 'came', 'come', 'venir'],
    ['cost', 'cost', 'cost', 'couter'],
    ['creep', 'crept', 'crept', 'ramper'],
    ['cut', 'cut', 'cut', 'couper'],
    ['deal', 'dealt', 'dealt', 'distribuer'],
    ['dig', 'dug', 'dug', 'creuser'],
    ['do', 'did', 'done', 'faire'],
    ['draw', 'drew', 'drown', 'dessiner'],
    ['dream', 'dreamt', 'dreamt', 'rêver'],
    ['drink', 'drank', 'drunk', 'boire'],
    ['drive','drove','driven','conduire'],
    ['eat','ate','eaten','manger'],
    ['fall','fell','fallen','tomber'],
    ['feed','fed','fed','nourrir'],
    ['feel','felt','felt','ressentir'],
    ['fight','fought','fought','combattre'],
    ['find','found','found','trouver'],
    ['fly','flew','flown','voler'],
    ['forbid','forbade','forbidden','interdire'],
    ['forget','forgot','forgotten','oublier'],
    ['forgive','forgave','forgiven','pardonner'],
    ['freeze','froze','frozen','geler'],
    ['get','got','got','obtenir'],
    ['give','gave','giver','donner'],
    ['go','went','gone','aller'],
    ['grind','ground','ground','moudre'],
    ['grow','grew','grown','pousser, grandir'],
    ['hang','hung','hung','accrocher'],
    ['have','had','had','avoir'],
    ['hear','heard','heard','entendre'],
    ['hide','hid','hidden','se cacher'],
    ['hit','hit','hit','frapper'],
    ['hold','held','held','tenir'],
    ['hurt','hurt','hurt','blesser'],
    ['keep','kept','kept','garder'],
    ['kneel','knelt','knelt','s\'agenouiller'],
    ['know','knew','known','connaître'],
    ['lay','laid','laid','mettre la table'],
    ['lead','led','led','mener'],
    ['learn','learnt','learnt','apprendre'],
    ['leave','left','left','partir, quitter'],
    ['lend','lent','lent','prêter'],
    ['let','let','let','laisser, louer'],
    ['swear','swore','sworn','jurer'],
    ['sweep','swept','swept','balayer'],
    ['swim','swam','swum','nager'],
    ['take','took','taken','prendre'],
    ['teach','taught','taught','enseigner'],
    ['tear','tore','torn','déchirer'],
    ['tell','told','told','dire, raconter'],
    ['think','thought','thought','penser'],
    ['throw','threw','thrown','jeter'],
    ['lie','lay','lain','se coucher'],
    ['light','lit','lit','allumer'],
    ['lose','lost','lost','perdre'],
    ['make','made','made','faire'],
    ['mean','meant','meant','signifier'],
    ['meet','met','met','rencontrer'],
    ['pay','paid','paid','payer']
  ];

  const params = window.location.hash && window.location.hash.includes('?')
                   ? window.location.hash.split('#?')[1]
                                         .split('&')
                                         .map(v => {
                                           const [key, value] = v.split('=');
                                           return {key,value}
                                         })
                   : null;

  if (!params) {
    window.location.hash += '#?from=0&to=10';
    window.location.reload();
    return;
  }

  const from = +params.find(p => p.key === 'from').value;
  const to = +params.find(p => p.key === 'to').value;
  
  document.querySelector('.from').value = from;
  document.querySelector('.to').value = to;

  // const xhttp = new XMLHttpRequest();
  //   xhttp.onreadystatechange = function() {
  //       if (this.readyState == 4 && this.status == 200) {
  //         debugger
  //          // Typical action to be performed when the document is ready:
  //          document.getElementById("demo").innerHTML = xhttp.responseText;
  //       }
  //   };
  // xhttp.open('GET', 'verbs.json', true);
  // xhttp.send();

  this.table = document.querySelector('table');
  for (const row of verbs.slice(from, to).sort(() => Math.random() - 0.5)) {
    const rowEl = document.createElement('tr');
    this.table.appendChild(rowEl);
    let cellIdx = 0;
    const randomCell = Math.floor(Math.random()*4);
    for (const cell of row) {
      const cellEl = document.createElement('td');
      if (cellIdx === randomCell)
        cellEl.innerHTML = cell
      else {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'tape ta réponse';
        input.dataset.reponse = cell;
        cellEl.appendChild(input);
      }
      rowEl.appendChild(cellEl);
      cellIdx++;
    }
  }

  document.querySelector('.correct').onclick = function() {
    for (const textInput of [...table.querySelectorAll('input')]) {
      const color = textInput.value === textInput.dataset.reponse ? 'lightgreen' : 'lightcoral';
      textInput.style.backgroundColor = color;
    }
  }

  document.querySelector('.restart').onclick = function() {
    const from = document.querySelector('.from').value;
    const to = document.querySelector('.to').value;
    window.location.hash = `#?from=${from}&to=${to}`;
    window.location.reload();
  }

});