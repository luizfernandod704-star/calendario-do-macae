let dataAtual = new Date();

let anotacoes = JSON.parse(
    localStorage.getItem("anotacoesCalendario")
) || {};

let gastos = JSON.parse(
    localStorage.getItem("gastosCalendario")
) || [];

let diaSelecionado = null;


// =========================
// CORRIGIR ANOTAÇÕES ANTIGAS
// =========================
// Se você já tinha anotações salvas,
// elas continuam funcionando.

Object.keys(anotacoes).forEach(chave => {

    anotacoes[chave] = anotacoes[chave].map(anotacao => {

        if (typeof anotacao === "string") {

            return {
                texto: anotacao,
                concluida: false
            };

        }

        return {
            texto: anotacao.texto || "",
            concluida: anotacao.concluida || false
        };

    });

});


// =========================
// NOMES DOS MESES
// =========================

const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
];


// =========================
// ELEMENTOS
// =========================

const mesAno = document.getElementById("mesAno");
const dias = document.getElementById("dias");

const modal = document.getElementById("modal");
const listaAnotacoes = document.getElementById("listaAnotacoes");
const novaAnotacao = document.getElementById("novaAnotacao");


// =========================
// CRIAR CHAVE DO DIA
// =========================

function criarChave(ano, mes, dia) {

    return `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

}


// =========================
// MOSTRAR CALENDÁRIO
// =========================

function mostrarCalendario() {

    const ano = dataAtual.getFullYear();

    const mes = dataAtual.getMonth();

    mesAno.textContent = `${meses[mes]} ${ano}`;

    dias.innerHTML = "";


    // Primeiro dia do mês

    const primeiroDia = new Date(
        ano,
        mes,
        1
    ).getDay();


    // Quantidade de dias

    const quantidadeDias = new Date(
        ano,
        mes + 1,
        0
    ).getDate();


    // Espaços antes do primeiro dia

    for (let i = 0; i < primeiroDia; i++) {

        const vazio = document.createElement("div");

        dias.appendChild(vazio);

    }


    // Criar cada dia

    for (
        let dia = 1;
        dia <= quantidadeDias;
        dia++
    ) {

        const elemento = document.createElement("div");

        elemento.className = "dia";


        const chave = criarChave(
            ano,
            mes + 1,
            dia
        );


        const lista =
            anotacoes[chave] || [];


        // =========================
        // NÚMERO DO DIA
        // =========================

        const numero =
            document.createElement("div");

        numero.className =
            "numero-dia";

        numero.textContent = dia;


        // =========================
        // PONTINHO VERMELHO
        // =========================

        if (lista.length > 0) {

            const indicador =
                document.createElement("span");

            indicador.className =
                "indicador";

            numero.appendChild(indicador);

        }


        elemento.appendChild(numero);


        // =========================
        // MOSTRAR ANOTAÇÕES
        // =========================

        lista.slice(0, 3).forEach(anotacao => {

            const elementoAnotacao =
                document.createElement("div");

            elementoAnotacao.className =
                "anotacao-preview";


            if (anotacao.concluida) {

                elementoAnotacao.style.textDecoration =
                    "line-through";

                elementoAnotacao.style.opacity =
                    "0.5";

            }


            elementoAnotacao.textContent =
                anotacao.texto;


            elemento.appendChild(
                elementoAnotacao
            );

        });


        // =========================
        // MOSTRAR QUANTIDADE RESTANTE
        // =========================

        if (lista.length > 3) {

            const mais =
                document.createElement("div");

            mais.className =
                "anotacao-preview";

            mais.textContent =
                `+ ${lista.length - 3} anotações`;

            elemento.appendChild(mais);

        }


        // =========================
        // CLICAR NO DIA
        // =========================

        elemento.addEventListener(
            "click",
            () => {

                abrirDia(
                    chave,
                    dia,
                    mes,
                    ano
                );

            }
        );


        dias.appendChild(elemento);

    }

}


// =========================
// ABRIR DIA
// =========================

function abrirDia(
    chave,
    dia,
    mes,
    ano
) {

    diaSelecionado = chave;


    document.getElementById(
        "tituloModal"
    ).textContent =
        `${dia} de ${meses[mes]} de ${ano}`;


    mostrarAnotacoes();


    modal.classList.remove(
        "escondido"
    );


    novaAnotacao.value = "";

}


// =========================
// MOSTRAR ANOTAÇÕES
// =========================

function mostrarAnotacoes() {

    listaAnotacoes.innerHTML = "";


    const lista =
        anotacoes[diaSelecionado] || [];


    lista.forEach(
        (anotacao, index) => {

            const item =
                document.createElement("div");

            item.className =
                "item-anotacao";


            // =========================
            // TEXTO
            // =========================

            const span =
                document.createElement("span");

            span.textContent =
                anotacao.texto;


            if (anotacao.concluida) {

                span.style.textDecoration =
                    "line-through";

                span.style.opacity =
                    "0.5";

            }


            // =========================
            // BOTÕES
            // =========================

            const botoes =
                document.createElement("div");

            botoes.className =
                "botoes-anotacao";


            // =========================
            // BOTÃO CONCLUIR
            // =========================

            const concluir =
                document.createElement("button");

            concluir.textContent =
                anotacao.concluida
                    ? "↩️"
                    : "✅";

            concluir.title =
                anotacao.concluida
                    ? "Marcar como pendente"
                    : "Marcar como concluída";


            concluir.onclick = () => {

                anotacoes[
                    diaSelecionado
                ][index].concluida =
                    !anotacoes[
                        diaSelecionado
                    ][index].concluida;


                salvarAnotacoes();

                mostrarAnotacoes();

                mostrarCalendario();

            };


            // =========================
            // BOTÃO EDITAR
            // =========================

            const editar =
                document.createElement("button");

            editar.textContent =
                "✏️";

            editar.title =
                "Editar anotação";


            editar.onclick = () => {

                const novoTexto =
                    prompt(
                        "Editar anotação:",
                        anotacao.texto
                    );


                if (
                    novoTexto !== null &&
                    novoTexto.trim() !== ""
                ) {

                    anotacoes[
                        diaSelecionado
                    ][index].texto =
                        novoTexto.trim();


                    salvarAnotacoes();

                    mostrarAnotacoes();

                    mostrarCalendario();

                }

            };


            // =========================
            // BOTÃO APAGAR
            // =========================

            const apagar =
                document.createElement("button");

            apagar.textContent =
                "🗑️";

            apagar.title =
                "Apagar anotação";


            apagar.onclick = () => {

                const confirmar =
                    confirm(
                        "Tem certeza que deseja apagar esta anotação?"
                    );


                if (!confirmar) {

                    return;

                }


                anotacoes[
                    diaSelecionado
                ].splice(index, 1);


                if (
                    anotacoes[
                        diaSelecionado
                    ].length === 0
                ) {

                    delete anotacoes[
                        diaSelecionado
                    ];

                }


                salvarAnotacoes();

                mostrarAnotacoes();

                mostrarCalendario();

            };


            // =========================
            // COLOCAR BOTÕES
            // =========================

            botoes.appendChild(
                concluir
            );

            botoes.appendChild(
                editar
            );

            botoes.appendChild(
                apagar
            );


            // =========================
            // COLOCAR NA ANOTAÇÃO
            // =========================

            item.appendChild(
                span
            );

            item.appendChild(
                botoes
            );


            listaAnotacoes.appendChild(
                item
            );

        }
    );

}


// =========================
// ADICIONAR ANOTAÇÃO
// =========================

document
    .getElementById(
        "adicionarAnotacao"
    )
    .addEventListener(
        "click",
        () => {

            const texto =
                novaAnotacao.value.trim();


            if (texto === "") {

                alert(
                    "Digite alguma coisa primeiro."
                );

                return;

            }


            if (
                !anotacoes[
                    diaSelecionado
                ]
            ) {

                anotacoes[
                    diaSelecionado
                ] = [];

            }


            anotacoes[
                diaSelecionado
            ].push({
                texto: texto,
                concluida: false
            });


            salvarAnotacoes();


            novaAnotacao.value = "";


            mostrarAnotacoes();

            mostrarCalendario();

        }
    );


// =========================
// SALVAR ANOTAÇÕES
// =========================

function salvarAnotacoes() {

    localStorage.setItem(
        "anotacoesCalendario",
        JSON.stringify(anotacoes)
    );

}


// =========================
// FECHAR JANELA
// =========================

document
    .getElementById(
        "fecharModal"
    )
    .addEventListener(
        "click",
        () => {

            modal.classList.add(
                "escondido"
            );

        }
    );


// =========================
// MÊS ANTERIOR
// =========================

document
    .getElementById(
        "mesAnterior"
    )
    .addEventListener(
        "click",
        () => {

            dataAtual.setMonth(
                dataAtual.getMonth() - 1
            );


            mostrarCalendario();

        }
    );


// =========================
// PRÓXIMO MÊS
// =========================

document
    .getElementById(
        "mesProximo"
    )
    .addEventListener(
        "click",
        () => {

            dataAtual.setMonth(
                dataAtual.getMonth() + 1
            );


            mostrarCalendario();

        }
    );


// =========================
// BOTÃO CALENDÁRIO
// =========================

document
    .getElementById(
        "btnCalendario"
    )
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "calendario"
                )
                .classList.remove(
                    "escondido"
                );


            document
                .getElementById(
                    "gastos"
                )
                .classList.add(
                    "escondido"
                );

        }
    );


// =========================
// BOTÃO GASTOS
// =========================

document
    .getElementById(
        "btnGastos"
    )
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "calendario"
                )
                .classList.add(
                    "escondido"
                );


            document
                .getElementById(
                    "gastos"
                )
                .classList.remove(
                    "escondido"
                );


            mostrarGastos();

        }
    );


// =========================
// ABRIR GASTOS
// =========================

document
    .getElementById(
        "novoGasto"
    )
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "modalGasto"
                )
                .classList.remove(
                    "escondido"
                );

        }
    );


// =========================
// FECHAR GASTOS
// =========================

document
    .getElementById(
        "fecharGasto"
    )
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "modalGasto"
                )
                .classList.add(
                    "escondido"
                );

        }
    );


// =========================
// SALVAR GASTO
// =========================

document
    .getElementById(
        "salvarGasto"
    )
    .addEventListener(
        "click",
        () => {

            const nome =
                document
                    .getElementById(
                        "nomeGasto"
                    )
                    .value
                    .trim();


            const valor =
                Number(
                    document
                        .getElementById(
                            "valorGasto"
                        )
                        .value
                );


            if (
                nome === "" ||
                valor <= 0
            ) {

                alert(
                    "Preencha o nome e o valor."
                );

                return;

            }


            gastos.push({
                nome: nome,
                valor: valor
            });


            localStorage.setItem(
                "gastosCalendario",
                JSON.stringify(gastos)
            );


            document
                .getElementById(
                    "nomeGasto"
                )
                .value = "";


            document
                .getElementById(
                    "valorGasto"
                )
                .value = "";


            document
                .getElementById(
                    "modalGasto"
                )
                .classList.add(
                    "escondido"
                );


            mostrarGastos();

        }
    );


// =========================
// MOSTRAR GASTOS
// =========================

function mostrarGastos() {

    const lista =
        document.getElementById(
            "listaGastos"
        );


    lista.innerHTML = "";


    let total = 0;


    gastos.forEach(
        (gasto, index) => {

            total += gasto.valor;


            const elemento =
                document.createElement(
                    "div"
                );


            elemento.className =
                "gasto";


            elemento.innerHTML = `
                <span>
                    ${gasto.nome}
                    <br>
                    <strong>
                        R$ ${gasto.valor
                            .toFixed(2)
                            .replace(".", ",")}
                    </strong>
                </span>

                <button
                    onclick="apagarGasto(${index})"
                >
                    🗑️
                </button>
            `;


            lista.appendChild(
                elemento
            );

        }
    );


    document
        .getElementById(
            "totalGastos"
        )
        .textContent =
        total
            .toFixed(2)
            .replace(".", ",");

}


// =========================
// APAGAR GASTO
// =========================

function apagarGasto(index) {

    gastos.splice(
        index,
        1
    );


    localStorage.setItem(
        "gastosCalendario",
        JSON.stringify(gastos)
    );


    mostrarGastos();

}


// =========================
// INICIAR
// =========================

mostrarCalendario();