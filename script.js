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

// Função para mostrar as cartas do jogador (mas não as dos outros)
function mostrarCartasJogadores(jogadores) {
    const jogadorAtual = 0; // Vamos assumir que o jogador atual é o de índice 0

    for (let i = 0; i < jogadores.length; i++) {
        const cartasJogador = jogadores[i];
        const playerDiv = document.getElementById(`player-${i + 1}`);

        if (i === jogadorAtual) {
            // Exibe as cartas do jogador atual
            playerDiv.innerHTML = `
                ${cartasJogador.map(carta => `<span class="${carta.naipe === '♥' || carta.naipe === '♦' ? 'red-card' : 'black-card'}">${carta.valor}${carta.naipe}</span>`).join('<br>')}
            `;
        } else {
            // Exibe apenas o verso das cartas dos outros jogadores
            playerDiv.innerHTML = `<div class="card-back"></div>`;
        }
    }
}

// Função para mostrar as cartas comunitárias
function mostrarCartasComunitarias(cartas) {
    const flopArea1 = document.getElementById('flop1');
    const flopArea2 = document.getElementById('flop2');
    const flopArea3 = document.getElementById('flop3');
    const turnArea = document.getElementById('turn');
    const riverArea = document.getElementById('river');

    flopArea1.innerHTML = `<span class="${cartas.flop[0].naipe === '♥' || cartas.flop[0].naipe === '♦' ? 'red-card' : 'black-card'}">${cartas.flop[0].valor}${cartas.flop[0].naipe}</span>`;
    flopArea2.innerHTML = `<span class="${cartas.flop[1].naipe === '♥' || cartas.flop[1].naipe === '♦' ? 'red-card' : 'black-card'}">${cartas.flop[1].valor}${cartas.flop[1].naipe}</span>`;
    flopArea3.innerHTML = `<span class="${cartas.flop[2].naipe === '♥' || cartas.flop[2].naipe === '♦' ? 'red-card' : 'black-card'}">${cartas.flop[2].valor}${cartas.flop[2].naipe}</span>`;
    turnArea.innerHTML = `<span class="${cartas.turn.naipe === '♥' || cartas.turn.naipe === '♦' ? 'red-card' : 'black-card'}">${cartas.turn.valor}${cartas.turn.naipe}</span>`;
    riverArea.innerHTML = `<span class="${cartas.river.naipe === '♥' || cartas.river.naipe === '♦' ? 'red-card' : 'black-card'}">${cartas.river.valor}${cartas.river.naipe}</span>`;
}

// Função que lida com a distribuição das cartas e apostas
let jogoEmAndamento = false;
let jogadores = [];
let baralho = [];

document.getElementById('dealBtn').addEventListener('click', () => {
    if (!jogoEmAndamento) {
        baralho = criarBaralho();
        embaralhar(baralho);
        jogadores = distribuirCartas(baralho);

        mostrarCartasJogadores(jogadores);

        let cartasComunitarias = {
            flop: [baralho.pop(), baralho.pop(), baralho.pop()],
            turn: baralho.pop(),
            river: baralho.pop()
        };

        mostrarCartasComunitarias(cartasComunitarias);
        jogoEmAndamento = true;
    }
});

// Função simples para apostas (usando IA para jogadores não humanos)
document.getElementById('betBtn').addEventListener('click', () => {
    if (jogoEmAndamento) {
        // Implementando IA básica para os jogadores
        let apostas = [];
        jogadores.forEach((_, index) => {
            if (Math.random() > 0.5) {
                apostas.push(`Jogador ${index + 1} apostou`);
            } else {
                apostas.push(`Jogador ${index + 1} desistiu`);
            }
        });

        alert(apostas.join('\n'));
    }
});

// Função para desistência
document.getElementById('foldBtn').addEventListener('click', () => {
    alert('Você desistiu da mão!');
    jogoEmAndamento = false;
});

class JogoPoker {
    constructor() {
        this.baralho = [];
        this.jogadores = [];
        this.pot = 0;
        this.apostaAtual = 0;
        this.dealerIndex = 0;
        this.jogadorAtualIndex = 0;
        this.phase = 'pré-flop';
        this.cartasComunitarias = [];
        this.acoesNecessarias = 0;
        
        this.inicializarJogadores();
        this.iniciarNovaMao();
    }

    inicializarJogadores() {
        for(let i = 0; i < 9; i++) {
            this.jogadores.push({
                fichas: 1000,
                aposta: 0,
                folded: false,
                cartas: [],
                ativo: true
            });
        }
    }

    iniciarNovaMao() {
        this.baralho = this.criarBaralho();
        this.embaralhar();
        this.distribuirCartas();
        this.cartasComunitarias = [];
        this.pot = 0;
        this.apostaAtual = 0;
        this.phase = 'pré-flop';
        this.dealerIndex = (this.dealerIndex + 1) % 9;
        this.jogadorAtualIndex = (this.dealerIndex + 1) % 9; // Small Blind
        this.acoesNecessarias = 9;
        
        this.coletarBlinds();
        this.atualizarUI();
    }

    coletarBlinds() {
        const smallBlind = 10;
        const bigBlind = 20;
        
        this.fazerAposta((this.dealerIndex + 1) % 9, smallBlind);
        this.fazerAposta((this.dealerIndex + 2) % 9, bigBlind);
    }

    criarBaralho() {
        // Mesma função anterior
    }

    embaralhar() {
        // Mesma função anterior
    }

    distribuirCartas() {
        this.jogadores.forEach(jogador => {
            jogador.cartas = [this.baralho.pop(), this.baralho.pop()];
        });
    }

    proximaFase() {
        const phases = ['pré-flop', 'flop', 'turn', 'river'];
        const nextPhase = phases[phases.indexOf(this.phase) + 1];
        
        if(nextPhase) {
            this.phase = nextPhase;
            this.revelarCartasComunitarias();
            this.apostaAtual = 0;
            this.jogadorAtualIndex = (this.dealerIndex + 1) % 9;
            this.acoesNecessarias = this.jogadores.filter(j => !j.folded).length;
            this.atualizarUI();
        } else {
            this.determinarVencedor();
        }
    }

    revelarCartasComunitarias() {
        switch(this.phase) {
            case 'flop':
                this.cartasComunitarias.push(this.baralho.pop(), this.baralho.pop(), this.baralho.pop());
                break;
            case 'turn':
                this.cartasComunitarias.push(this.baralho.pop());
                break;
            case 'river':
                this.cartasComunitarias.push(this.baralho.pop());
                break;
        }
    }

    processarAcao(jogadorIndex, acao, valor) {
        const jogador = this.jogadores[jogadorIndex];
        
        if(jogador.folded) return;

        switch(acao) {
            case 'fold':
                jogador.folded = true;
                break;
            case 'call':
                const diferenca = this.apostaAtual - jogador.aposta;
                jogador.fichas -= diferenca;
                jogador.aposta += diferenca;
                this.pot += diferenca;
                break;
            case 'raise':
                const raiseAmount = valor - this.apostaAtual;
                jogador.fichas -= raiseAmount;
                jogador.aposta += raiseAmount;
                this.pot += raiseAmount;
                this.apostaAtual = valor;
                this.acoesNecessarias = this.jogadores.filter(j => !j.folded).length - 1;
                break;
        }

        this.acoesNecessarias--;
        this.proximoJogador();

        if(this.acoesNecessarias <= 0) {
            this.proximaFase();
        }

        this.atualizarUI();
    }

    proximoJogador() {
        do {
            this.jogadorAtualIndex = (this.jogadorAtualIndex + 1) % 9;
        } while(this.jogadores[this.jogadorAtualIndex].folded);
    }

    determinarVencedor() {
        // Implementar lógica de avaliação de mãos
        // ...
        alert(`Jogador X venceu com ${this.pot} fichas!`);
        this.iniciarNovaMao();
    }

    atualizarUI() {
        // Atualizar a interface com o estado atual do jogo
        this.jogadores.forEach((jogador, index) => {
            const elemento = document.getElementById(`player-${index + 1}`);
            elemento.innerHTML = `
                <div>Fichas: ${jogador.fichas}</div>
                <div>Aposta: ${jogador.aposta}</div>
                ${jogador.folded ? '<div>FOLDED</div>' : ''}
            `;
            
            if(index === 0) { // Jogador humano
                elemento.innerHTML += jogador.cartas.map(carta => 
                    `<span class="${['♥','♦'].includes(carta.naipe) ? 'red-card' : 'black-card'}">
                        ${carta.valor}${carta.naipe}
                    </span>`
                ).join('');
            }
        });

        // Atualizar cartas comunitárias
        const comunitarias = document.querySelectorAll('.card-area');
        comunitarias.forEach((area, index) => {
            area.innerHTML = this.cartasComunitarias[index] 
                ? `<span class="${['♥','♦'].includes(this.cartasComunitarias[index].naipe) ? 'red-card' : 'black-card'}">
                     ${this.cartasComunitarias[index].valor}${this.cartasComunitarias[index].naipe}
                   </span>`
                : '';
        });
    }
}

// Interface do usuário
const jogo = new JogoPoker();

document.getElementById('dealBtn').addEventListener('click', () => jogo.iniciarNovaMao());
document.getElementById('betBtn').addEventListener('click', () => {
    const valor = prompt('Digite o valor da aposta:');
    jogo.processarAcao(0, 'raise', parseInt(valor));
});
document.getElementById('foldBtn').addEventListener('click', () => jogo.processarAcao(0, 'fold'));