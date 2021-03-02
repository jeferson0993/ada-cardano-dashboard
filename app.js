let date = new Date(), past_day, low = 999, high = 0, _low = 0, _high = 0, arr = [], _arr = [], labels = [];

(function () {
    for (let index = 6; index >= 0; index--) {
        if (Number(date.getDate()) - index <= 0) {
            past_day = Number(date.getDate()) - index + 30 + '-' + Number(date.getMonth()) + '-' + Number(date.getFullYear());
        } else {
            past_day = Number(date.getDate()) - index + '-' + Number(date.getMonth() + 1) + '-' + Number(date.getFullYear());
        }
        labels.push(past_day);

        fetch(`https://api.coingecko.com/api/v3/coins/cardano/history?date=${past_day}&localization=false`)
            .then(response => response.json())
            .then(json => {

                if (json.market_data.current_price.brl > high) {
                    high = json.market_data.current_price.brl
                } else if (json.market_data.current_price.brl < low) {
                    low = json.market_data.current_price.brl;
                }

                arr.push(json.market_data.current_price.brl);
            })
            .then(function () {

                new Chart(document.getElementById("chartjs-0"), {
                    "type": "line",
                    "data": {
                        "labels": labels,
                        "datasets": [{
                            "label": "Cotação ultimos 7 dias",
                            "data": arr,
                            "fill": false,
                            "borderColor": "rgb(99, 102, 241)",
                            "lineTension": 0.1
                        }]
                    },
                    "options": {}
                });

            })
            .catch((error) => {
                document.querySelector('.console').innerHTML += '<br />Fetch operation: ' + error.message;
            })

        fetch(`https://api.coingecko.com/api/v3/coins/cardano/history?date=${past_day}&localization=false`)
            .then(response => response.json())
            .then(json => {

                if (Number(json.market_data.market_cap.brl.toString().substring(0, 3)) > _high) {
                    _high = Number(json.market_data.market_cap.brl.toString().substring(0, 3));
                }

                if (_low === 0) {
                    _low = Number(json.market_data.market_cap.brl.toString().substring(0, 3));
                } else if (Number(json.market_data.market_cap.brl.toString().substring(0, 3)) < low) {
                    _low = Number(json.market_data.market_cap.brl.toString().substring(0, 3));
                }

                _arr.push(Number(json.market_data.market_cap.brl.toString().substring(0, 3)));

            })
            .then(function () {
                new Chart(document.getElementById("chartjs-1"), {
                    "type": "bar",
                    "data": {
                        "labels": labels,
                        "datasets": [{
                            "label": "Capitalização ultimos 7 dias (Bilhões)",
                            "data": _arr,
                            "fill": false,
                            "backgroundColor": ["rgba(99, 102, 241, 0.8)", "rgba(99, 102, 241, 0.6)", "rgba(99, 102, 241, 0.8)", "rgba(99, 102, 241, 0.6)", "rgba(99, 102, 241, 0.8)", "rgba(99, 102, 241, 0.6)", "rgba(99, 102, 241, 0.8)"],
                            "borderColor": ["rgba(99, 102, 241)", "rgba(99, 102, 241)", "rgba(99, 102, 241)", "rgba(99, 102, 241)", "rgba(99, 102, 241)", "rgba(99, 102, 241)"],
                            "borderWidth": 1
                        }]
                    },
                    "options": {
                        "scales": {
                            "yAxes": [{
                                "ticks": {
                                    "beginAtZero": true
                                }
                            }]
                        }
                    }
                });
            })
            .catch((error) => {
                document.querySelector('.console').innerHTML += '<br />Fetch operation: ' + error.message;
            });
    }

    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=brl&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24')
        .then(response => response.json())
        .then(json => {
            let tbody_content = '';
            let rank = 0;
            for (let index = 0; index < 10; index++) {
                rank = index + 1;
                document.querySelector('.console').innerHTML += '<br /><strong>' + formatter.format(json[index].current_price)+'</strong><br />'+
                '<br />Símbolo: ('+json[index].symbol.toUpperCase()+')'+
                '<br />Ranking no mercado: '+json[index].market_cap_rank+
                '<br />Capitalização de Mercado: '+formatter.format(json[index].market_cap)+
                '<br />'+
                '<br />Variação das ultima 24 hrs'+
                '<br />Alta: '+formatter.format(json[index].high_24h)+ ' | Baixa: '+formatter.format(json[index].low_24h)+
                '<br />'+
                '<br />Alta histórica: '+formatter.format(json[index].ath)+' em '+json[index].ath_date.substring(0,10)+
                '<br />'+
                '<br />Fornecimento Total: '+json[index].total_supply+' '+json[index].symbol.toUpperCase()+'s'+
                '<br />Fornecimento Circulante: '+json[index].circulating_supply+' '+json[index].symbol.toUpperCase()+'s'+
                '<br />';
                tbody_content += `
                    <tr>
                        <!--td>${json[index].market_cap_rank}</td-->
                        <td>${json[index].name}</td>
                        <!--td>${formatter.format(json[index].current_price)}</td-->
                        <td>${formatter.format(json[index].market_cap)}</td>
                    </tr>
                `;

            }
            document.querySelector('#tbody').innerHTML = tbody_content;
        })
        .catch((error) => {
            document.querySelector('.console').innerHTML += '<br />Fetch operation: ' + error.message;
        });
})();

function showSection(section) {
    console.log(section);
    document.querySelector('#dashboard').classList.add('hidden');
    document.querySelector('#console').classList.add('hidden');
    
    document.querySelector('#'+section).classList.remove('hidden');
    console.table('dashboard: ', document.querySelector('#dashboard').classList, 'console: ', document.querySelector('#console').classList);
}

/*Toggle dropdown list*/
function toggleDD(myDropMenu) {
    document.getElementById(myDropMenu).classList.toggle("invisible");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.drop-button')) {
        var dropdowns = document.getElementsByClassName("dropdownlist");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (!openDropdown.classList.contains('invisible')) {
                openDropdown.classList.add('invisible');
            }
        }
    }
}

document.querySelector('#menu-dashboard').addEventListener('click', function () {
    showSection('dashboard');
})
document.querySelector('#menu-console').addEventListener('click', function () {
    showSection('console');
})

let formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
(function () {
    let current_price = 0;
    fetch('https://api.coingecko.com/api/v3/coins/cardano')
        .then(response => response.json())
        .then(json => {
            current_price = json.market_data.current_price.brl;
            document.querySelector('#current_price').textContent = formatter.format(json.market_data.current_price.brl);
            document.querySelector('#high_24').textContent = formatter.format(json.market_data.high_24h.brl);
            document.querySelector('#low_24').textContent = formatter.format(json.market_data.low_24h.brl);
            document.querySelector('#circulating_supply').textContent = json.market_data.circulating_supply;
            document.querySelector('#total_supply').textContent = json.market_data.total_supply;
            document.querySelector('#market_cap').textContent = formatter.format(json.market_data.market_cap.brl);

        })
        .then(() => {
            fetch('https://jeferson0993.github.io/cardano-data/api/v1/data.json')
            .then(response => response.json())
            .then(json => {
                document.querySelector('#balance').textContent = json.total_ada;
                document.querySelector('#balance_brl').textContent = formatter.format( json.total_ada * current_price );

                let labels = [], data = [];
                let _object = json.stake_pool_delegated;
                for (const key in _object) {
                    if (Object.hasOwnProperty.call(_object, key)) {
                        labels.push(key);
                        data.push(_object[key]);
                    }
                }

                new Chart(document.getElementById("chartjs-4"), {
                    "type": "doughnut",
                    "data": {
                        "labels": labels,
                        "datasets": [{
                            "label": "Stake pools",
                            "data": data,
                            "backgroundColor": ["rgba(89, 92, 255, 1)", "rgba(144, 170, 255, 1)", "rgba(180, 222, 255, 1)"]
                        }]
                    }
                });
            })
            .catch((err) => {
                document.querySelector('.console').innerHTML += '<br />github: ' + err.message;
            });
        })
        .catch((err) => {
           document.querySelector('.console').innerHTML += '<br />coingecko: ' + err.message;
        });

})();

document.querySelector('.console').innerHTML += '<br /> Jeferson ';
