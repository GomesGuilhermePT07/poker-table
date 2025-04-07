// Função que cria um baralho de cartas
function criarBaralho() {
    const naipes = ['♥', '♦', '♣', '♠'];
    const valores = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    let baralho = [];

    for (let naipe of naipes) {
        for (let valor of valores) {
            baralho.push({ valor: valor, naipe: naipe });
        }
    }

    return baralho;
}

// Função para embaralhar o baralho
function embaralhar(baralho) {
    for (let i = baralho.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [baralho[i], baralho[j]] = [baralho[j], baralho[i]];
    }
}

// Função para distribuir as cartas para os jogadores
function distribuirCartas(baralho) {
    const jogadores = [];

    for (let i = 0; i < 9; i++) {
        jogadores.push([baralho.pop(), baralho.pop()]); // Cada jogador recebe 2 cartas
    }

    return jogadores;
}

// Função para mostrar as cartas na mesa
function mostrarCartasJogadores(jogadores) {
    for (let i = 0; i < jogadores.length; i++) {
        const cartasJogador = jogadores[i];
        const playerDiv = document.getElementById(`player-${i + 1}`);
        
        // Exibe apenas as cartas do jogador e não as dos outros
        playerDiv.innerHTML = `
            ${cartasJogador.map(carta => `<span class="${carta.naipe === '♥' || carta.naipe === '♦' ? 'red-card' : 'black-card'}">${carta.valor}${carta.naipe}</span>`).join('<br>')}
        `;
    }
}

// Função para mostrar as cartas comunitárias
function mostrarCartasComunitarias(cartas) {
    const flopArea = document.getElementById('flop');
    const turnArea = document.getElementById('turn');
    const riverArea = document.getElementById('river');

    flopArea.innerHTML = cartas.flop.map(carta => `<span class="${carta.naipe === '♥' || carta.naipe === '♦' ? 'red-card' : 'black-card'}">${carta.valor}${carta.naipe}</span>`).join('<br>');
    turnArea.innerHTML = `<span class="${cartas.turn.naipe === '♥' || cartas.turn.naipe === '♦' ? 'red-card' : 'black-card'}">${cartas.turn.valor}${cartas.turn.naipe}</span>`;
    riverArea.innerHTML = `<span class="${cartas.river.naipe === '♥' || cartas.river.naipe === '♦' ? 'red-card' : 'black-card'}">${cartas.river.valor}${cartas.river.naipe}</span>`;
}

// Função que lida com a distribuição das cartas e aposta
document.getElementById('dealBtn').addEventListener('click', () => {
    let baralho = criarBaralho();
    embaralhar(baralho);

    let jogadores = distribuirCartas(baralho);
    mostrarCartasJogadores(jogadores);

    let cartasComunitarias = {
        flop: [baralho.pop(), baralho.pop(), baralho.pop()],
        turn: baralho.pop(),
        river: baralho.pop()
    };

    mostrarCartasComunitarias(cartasComunitarias);
});

// Exemplo de funcionalidade de aposta
document.getElementById('betBtn').addEventListener('click', () => {
    alert("Aposta feita!");
});
