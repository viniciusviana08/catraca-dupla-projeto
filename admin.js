const API_URL = "https://api-catraca.vercel.app";
let cpfOriginal = null; // Variável para armazenar o CPF original durante a edição

document.getElementById("formUsuario").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const nome = document.getElementById("nome").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const active = document.getElementById("active").value === "true";
  
    if (!cpf.match(/^\d{11}$/)) {
      alert("CPF inválido. Digite os 11 números.");
      return;
    }
  
    const data = { nome, active, cpf };
  
    try {
      const response = await fetch(
        cpfOriginal ? `${API_URL}/aluno/${cpfOriginal}` : `${API_URL}/aluno`,
        {
          method: cpfOriginal ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
  
      if (response.ok) {
        alert(`Usuário ${cpfOriginal ? "atualizado" : "cadastrado"} com sucesso.`);
        document.getElementById("formUsuario").reset();
        cpfOriginal = null; // Limpar o CPF original após salvar
        carregarUsuarios();
      } else {
        const error = await response.json();
        alert(error.message || "Erro ao salvar.");
      }
    } catch (error) {
      alert("Erro de conexão com a API.");
    }
  });

async function carregarUsuarios() {
  try {
    const res = await fetch(`${API_URL}/alunos`);
    const usuarios = await res.json();

    const tabela = document.getElementById("tabelaUsuarios");
    tabela.innerHTML = "";

    usuarios.forEach((user) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td class="border-b p-2">${user.nome}</td>
        <td class="border-b p-2">${user.cpf}</td>
        <td class="border-b p-2">${user.active ? "Ativo" : "Inativo"}</td>
        <td class="border-b p-2 space-x-2">
          <button onclick="editarUsuario('${user.cpf}', '${user.nome}', ${user.active})" class="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500 text-white">Editar</button>
          <button onclick="deletarUsuario('${user.cpf}')" class="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-white">Excluir</button>
        </td>
      `;

      tabela.appendChild(row);
    });
  } catch (err) {
    console.error("Erro ao carregar usuários:", err);
  }
}

function editarUsuario(cpf, nome, active) {
  document.getElementById("nome").value = nome;
  document.getElementById("cpf").value = cpf;
  document.getElementById("active").value = active ? "true" : "false";
  cpfOriginal = cpf; // Armazenar o CPF original para referência
}

async function deletarUsuario(cpf) {
  if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

  try {
    const response = await fetch(`${API_URL}/aluno/${cpf}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Usuário excluído com sucesso.");
      carregarUsuarios();
    } else {
      const error = await response.json();
      alert(error.message || "Erro ao excluir.");
    }
  } catch (err) {
    alert("Erro ao excluir usuário.");
  }
}

carregarUsuarios();