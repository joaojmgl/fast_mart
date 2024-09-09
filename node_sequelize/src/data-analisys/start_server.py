import subprocess

# Comando para iniciar o servidor Streamlit -- COLOCAR CAMINHO CORRETO PARA O ARQUIVO DASHBOARD.PY AQUI!!!!
comando = 'python -m streamlit run "C:/Users/julia/Documents/GitHub/fast_mart/node_sequelize/src/data-analisys/dashboard.py" --server.port 8501 --server.headless true'

# Função para executar o comando
def iniciar_streamlit():
    try:
        subprocess.Popen(comando, shell=True)
        print("Servidor Streamlit iniciado com sucesso.")
    except Exception as e:
        print(f"Erro ao iniciar o servidor Streamlit: {e}")

if __name__ == "__main__":
    iniciar_streamlit()
