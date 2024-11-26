const formulario = document.querySelector("form");
const tarefa = document.querySelector(".input-tarefa");
const lista = document.querySelector(".lista");

const botoes = document.getElementsByClassName("botoes")
const botaoEditar = document.getElementsByClassName("btn-warning")
const botaoExcluir = document.getElementsByClassName("btn-danger")

document.addEventListener("DOMContentLoaded", mostrarTarefas);

formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const nomeTarefa = formulario.elements["nome-tarefa"].value.trim();
    if (nomeTarefa === "") {
        alert("Por favor, insira um nome de tarefa válido.");
        return;
    }

    adicionarTarefa(nomeTarefa);

    criarElemento(formulario.elements["nome-tarefa"].value);

    formulario.elements["nome-tarefa"].value = "";
});

function adicionarTarefa(tarefa) {
    const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
    tarefas.push(tarefa);
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function mostrarTarefas() {
    const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
    tarefas.forEach(tarefa => {
        const nome = typeof tarefa === "string" ? tarefa : tarefa.nome;
        const concluida = typeof tarefa === "object" && tarefa.concluida;
        criarElemento(nome);

        if (concluida) {
            const itens = lista.querySelectorAll("li");
            itens[itens.length - 1].classList.add("concluida");
        }
    });
}

function criarElemento(tarefa) {
    const linha = document.createElement("li");
    const grupoTarefa = document.createElement("div");
    const nomeTarefa = document.createElement("p");
    const grupoBotoes = document.createElement("div");
    const botaoEditar = document.createElement("button");
    const botaoExcluir = document.createElement("button");
    const botaoConcluir = document.createElement("button");

    const textoBotaoEditar = document.createTextNode("Editar");
    botaoEditar.classList.add("m-1", "btn", "btn-warning");
    botaoEditar.appendChild(textoBotaoEditar);

    const textoBotaoExcluir = document.createTextNode("Excluir");
    botaoExcluir.classList.add("m-1", "btn", "btn-danger");
    botaoExcluir.appendChild(textoBotaoExcluir);

    const textoBotaoConcluir = document.createTextNode("Concluir");
    botaoConcluir.classList.add("m-1", "btn", "btn-success");
    botaoConcluir.appendChild(textoBotaoConcluir);

    grupoBotoes.classList.add("botoes", "col-auto");
    grupoBotoes.appendChild(botaoEditar);
    grupoBotoes.appendChild(botaoExcluir);
    grupoBotoes.appendChild(botaoConcluir);

    const textoTarefa = document.createTextNode(tarefa);
    nomeTarefa.classList.add("col", "m-auto");
    nomeTarefa.appendChild(textoTarefa);

    grupoTarefa.classList.add("row");
    grupoTarefa.appendChild(nomeTarefa);
    grupoTarefa.appendChild(grupoBotoes);

    linha.classList.add("list-group-item");
    linha.appendChild(grupoTarefa);

    lista.appendChild(linha);

    botaoEditar.addEventListener("click", () => {
        editarTarefa(tarefa, linha);
    });
    
    botaoExcluir.addEventListener("click", () => {
        excluirTarefa(tarefa, linha)
    });

    botaoConcluir.addEventListener("click", () => {
        const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
        const indice = tarefas.indexOf(tarefa);
        if (indice > -1) {
            tarefas[indice] = { nome: tarefa, concluida: !linha.classList.contains("concluida") };
            localStorage.setItem("tarefas", JSON.stringify(tarefas));
        }
        linha.classList.toggle("concluida");
    });
}

function editarTarefa(tarefaAntiga, elementoLinha) {
    const nomeTarefaElemento = elementoLinha.querySelector("p");

    let novoNome = prompt("Editar tarefa:", tarefaAntiga)?.trim();

    while (!novoNome) {
        alert("Por favor, insira um nome de tarefa válido.");
        novoNome = prompt("Editar tarefa:", tarefaAntiga)?.trim();
    }

    nomeTarefaElemento.textContent = novoNome;

    const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
    const indice = tarefas.indexOf(tarefaAntiga);
    if (indice > -1) {
        tarefas[indice] = novoNome;
        localStorage.setItem("tarefas", JSON.stringify(tarefas));
    }
}

function excluirTarefa(tarefa, linha) {
    if (confirm("Tem certeza de que deseja excluir esta tarefa?")) {
        const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
        const novasTarefas = tarefas.filter(t => t !== tarefa);
        localStorage.setItem("tarefas", JSON.stringify(novasTarefas));

        linha.remove();
    }
}