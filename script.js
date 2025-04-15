async function verificarAcesso() {
    const cpf = document.getElementById('cpfInput').value.trim();
    const mensagemEl = document.getElementById('mensagem');
  
    if (!cpf.match(/^\d{11}$/)) {
      mensagemEl.textContent = "CPF inválido. Digite os 11 números.";
      mensagemEl.className = "mt-4 text-red-600 font-medium";
      return;
    }
  
    try {
      const response = await fetch(`https://api-catraca.vercel.app/aluno/${cpf}`);
      const data = await response.json();
  
      if (response.status === 200) {
        mensagemEl.textContent = data.message;
        mensagemEl.className = "mt-4 text-green-600 font-medium";
      } else {
        mensagemEl.textContent = data.message;
        mensagemEl.className = "mt-4 text-red-600 font-medium";
      }
    } catch (error) {
      mensagemEl.textContent = "Erro na conexão com o servidor.";
      mensagemEl.className = "mt-4 text-red-600 font-medium";
    }
  }
  