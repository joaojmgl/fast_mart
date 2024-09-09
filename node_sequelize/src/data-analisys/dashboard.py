import mysql.connector
import pandas as pd
import streamlit as st
import os

def get_companyID():
    # Define o caminho completo do arquivo temporário
    temp_file_path = 'C:\\Users\\Gustavo Henrique\\Desktop\\fast_mart\\node_sequelize\\src\\controllers\\company_id.txt'

    # Lê o company_id do arquivo temporário
    if os.path.exists(temp_file_path):
        with open(temp_file_path, 'r') as file:
            company_id = file.read().strip()
        # Opcional: Remove o arquivo temporário após leitura
        os.remove(temp_file_path)
        return company_id
    else:
        raise FileNotFoundError("Arquivo com o Company ID não encontrado.")

# Conectar ao banco de dados e criação dos dataframes:

conexao = mysql.connector.connect(
    host="localhost", # ip do banco
    user="root", # usuario
    password="123456", # senha
    database="fastmart", # nome do banco
    charset="utf8mb4",  
    collation="utf8mb4_unicode_ci"
)

# Lendo dados da tabela produtos

query = "SELECT * FROM products"
df_products = pd.read_sql(query, conexao)

#Lendo a tabela finance

query_fin = "SELECT * FROM finance"
df_finances = pd.read_sql(query_fin, conexao)

#Lendo a tabela Companies

query_comp = "SELECT * FROM companies"
df_companies = pd.read_sql(query_comp, conexao)

conexao.close() # FECHANDO CONEXÃO AQUI !!!!

company_ID = get_companyID()
company_ID = int(company_ID)

# Filtragem dos dados baseados na empresa selecionada
df_products = df_products[df_products['company_id'] == company_ID]
df_finances = df_finances[df_finances['company_id'] == company_ID]

# ----------------------------------------------------------------------------------------

# Insights da tabela produtos ---------------------------------------------------------------------------------------

# produtos mais lucrativos:

df_products['lucro'] = df_products['sale_price'] - df_products['purchase_price']
produtos_mais_lucrativos = df_products.sort_values(by='lucro', ascending=False)

# produtos com a maior margem de lucro percentual:

df_products['perc_lucro'] = ((df_products['sale_price'] - df_products['purchase_price']) / df_products['purchase_price']) * 100
maior_perc_lucro = df_products.sort_values(by='perc_lucro', ascending= False)

# produtos mais proximos da data de validade:

df_products['expiry_date'] = pd.to_datetime(df_products['expiry_date'])
today = pd.Timestamp.now()
df_future = df_products[df_products['expiry_date'] > today]
df_sorted = df_future.sort_values(by='expiry_date')
top_products = df_sorted.head(10)

# Produtos por fornecedor:

produtos_por_forncedor = df_products.groupby('supplier')['name'].apply(lambda x: '\n    '.join(x)).reset_index(name='products')
fornecedores = produtos_por_forncedor['supplier'].tolist()

#produtos em menor quantidade no estoque:

menor_estoque = df_products.sort_values(by='quantity_per_unit', ascending= True)

# produtos vendidos e comprados pelo menor e maior valor, respctivamente

vendidos_por_menos = df_products.sort_values(by= 'sale_price', ascending= True)
comprados_por_mais = df_products.sort_values(by = 'purchase_price', ascending= False)

# ----- daqui pra cima, insights

# ----- daqui pra baixo, criação do dashboard

st.title('Dashboard Fastmart')

# Criação das abas
tabs = st.tabs(["Lucros e Margens", "Fornecedores", "Estoque", "Fechamento de caixa"])

# Criação das abas e sub abas

#Primeira aba
with tabs[0]:
    subtab_1 = st.selectbox("Página: ", ["1", "2", "3"])
    
    if subtab_1 == '1':
        col1, spacer, col2 = st.columns([1, 0.1, 1])
    
        with col1:
            st.header('10 Produtos mais lucrativos')
            st.bar_chart(produtos_mais_lucrativos.head(10).set_index('name')['lucro'])

        with col2:
            st.header('10 Produtos com Maior margem percentual de lucro:')
            st.bar_chart(maior_perc_lucro.head(10).set_index('name')['perc_lucro'])
            
    elif subtab_1 == '2':
        col3, spacer, col4 = st.columns([1, 0.1, 1])
        
        with col3:
            st.header('10 produtos com menor valor de venda:')
            st.dataframe(vendidos_por_menos.head(10)[['name', 'sale_price', 'supplier']], hide_index=True, use_container_width= True)
            
        with col4:
            st.header('Visualização gráfica: ')
            st.bar_chart(vendidos_por_menos.head(10), x='name', y='sale_price')
    else:
        col5, spacer, col6 = st.columns([1, 0.1, 1])
           
        with col5:
            st.header('10 produtos com maior valor de compra:')
            st.dataframe(comprados_por_mais.head(10)[['name', 'purchase_price', 'supplier']], hide_index=True, use_container_width= True)
        
        with col6:
            st.header('Visualização gráfica: ')
            st.bar_chart(comprados_por_mais.head(10), x='name', y='purchase_price')

# Segunda aba 
with tabs[1]:
    col7, spacer, col8 = st.columns([1, 0.1, 1])
    
    with col7:
        st.header('Produtos por Fornecedor:')
        fornecedor_selecionado = st.selectbox('Selecione o fornecedor:', fornecedores)
        produtos_fornecedor_selecionado = df_products[df_products['supplier'] == fornecedor_selecionado]
        st.dataframe(produtos_fornecedor_selecionado[['name', 'sale_price', 'purchase_price', 'quantity_per_unit', 'expiry_date']], hide_index= True, use_container_width= True)

    with col8:
        st.header('Volume de produtos por Fornecedor: ')
        agrupa_product_forn = df_products.groupby(['supplier']).size()
        st.bar_chart(agrupa_product_forn)

# Terceira aba
with tabs[2]:
    
    subtab_2 = st.selectbox("Página: ", ["1", "2", ])
    
    if subtab_2 == '1':
        col9, spacer, col10 = st.columns([1, 0.1, 1])
       
        with col9:
                st.header('10 produtos em menor quantidade no estoque:')
                st.dataframe(menor_estoque.head(10)[['name', 'quantity_per_unit']], hide_index=True, use_container_width= True)
        
        with col10:
                st.header('Volume dos 10 produtos em menor quantidade no estoque: ')
                st.bar_chart(menor_estoque.head(10), x='name', y='quantity_per_unit')
    else:
        col11, spacer, col12 = st.columns([1, 0.23, 1])
        
        with col11:
            st.header('10 Produtos Mais Próximos da Validade: ')
            st.dataframe(top_products[['name', 'expiry_date', 'quantity_per_unit']], hide_index=True, use_container_width= True)
            
        with col12:
            st.header('10 Produtos Mais Próximos da Validade em maior quantidade: ')
            top_products_ord = top_products.sort_values(by= 'quantity_per_unit', ascending= False)
            st.dataframe(top_products_ord[['name', 'expiry_date', 'quantity_per_unit']], hide_index=True, use_container_width= True)
    
# Quarta aba
with tabs[3]:
    st.header("Fechamento de Caixa")
    
    # Seção 1: Seleção do Caixa e Tipo de Fechamento
    col1, col2 = st.columns(2)

    with col1:
        # Selecionar o caixa
        caixas_disponiveis = df_finances['cash_register'].unique().tolist()
        caixa_selecionado = st.selectbox("Selecione o Caixa:", caixas_disponiveis)
    
    with col2:
        # Selecionar o tipo de fechamento (diário, semanal, mensal)
        tipo_fechamento = st.selectbox("Selecione o tipo de fechamento:", ["Diário", "Semanal", "Mensal"])

    # Filtrar os dados do caixa selecionado
    df_finances_caixa = df_finances[df_finances['cash_register'] == caixa_selecionado]
    
    # Converter a coluna 'date' para datetime
    df_finances_caixa['date'] = pd.to_datetime(df_finances_caixa['date'])

    # Seção 2: Fechamento de Caixa por Período
    st.subheader(f"Fechamento de Caixa - {tipo_fechamento}")

    # Função para gerar o fechamento baseado na seleção
    if tipo_fechamento == "Diário":
        df_fechamento = df_finances_caixa.groupby(df_finances_caixa['date'].dt.date).agg({'value': 'sum'}).reset_index()
        df_fechamento.columns = ['Data', 'Total']
    elif tipo_fechamento == "Semanal":
        df_fechamento = df_finances_caixa.groupby(df_finances_caixa['date'].dt.isocalendar().week).agg({'value': 'sum'}).reset_index()
        df_fechamento.columns = ['Semana', 'Total']
    elif tipo_fechamento == "Mensal":
        df_fechamento = df_finances_caixa.groupby(df_finances_caixa['date'].dt.to_period('M')).agg({'value': 'sum'}).reset_index()
        df_fechamento.columns = ['Mês', 'Total']

    # Exibir o fechamento em formato de tabela
    st.dataframe(df_fechamento, hide_index=True, use_container_width=True)

    # Exibir gráfico de barras do fechamento
    st.bar_chart(df_fechamento.set_index(df_fechamento.columns[0])['Total'])

    # Seção 3: Totais de Compra/Venda
    st.subheader(f"Totais de Compra/Venda - {tipo_fechamento}")

    # Filtrar vendas e compras
    vendas = df_finances_caixa[df_finances_caixa['description'] == 'Venda']
    compras = df_finances_caixa[df_finances_caixa['description'] == 'Compra']

    # Agrupar pelo tipo de operação e data
    if tipo_fechamento == "Diário":
        vendas_fechamento = vendas.groupby(vendas['date'].dt.date).agg({'value': 'sum'}).reset_index()
        compras_fechamento = compras.groupby(compras['date'].dt.date).agg({'value': 'sum'}).reset_index()
    elif tipo_fechamento == "Semanal":
        vendas_fechamento = vendas.groupby(vendas['date'].dt.isocalendar().week).agg({'value': 'sum'}).reset_index()
        compras_fechamento = compras.groupby(compras['date'].dt.isocalendar().week).agg({'value': 'sum'}).reset_index()
    elif tipo_fechamento == "Mensal":
        vendas_fechamento = vendas.groupby(vendas['date'].dt.to_period('M')).agg({'value': 'sum'}).reset_index()
        compras_fechamento = compras.groupby(compras['date'].dt.to_period('M')).agg({'value': 'sum'}).reset_index()

    # Exibir totais de compra e venda
    col3, col4 = st.columns(2)
    with col3:
        st.metric("Total de Vendas", f"R$ {vendas['value'].sum():.2f}")
    with col4:
        st.metric("Total de Compras", f"R$ {compras['value'].sum():.2f}")

    # Exibir gráfico de comparação entre compra e venda
    df_comparacao = pd.DataFrame({
        'Operação': ['Venda', 'Compra'],
        'Total': [vendas['value'].sum(), compras['value'].sum()]
    })

    st.subheader("Comparação de Totais de Compra/Venda")
    st.bar_chart(df_comparacao.set_index('Operação'))

    # Seção 4: Fechamento por Métodos de Pagamento
    st.subheader(f"Fechamento por Método de Pagamento - {tipo_fechamento}")

    # Agrupar por método de pagamento
    metodos_pagamento = df_finances_caixa.groupby(['payment_method']).agg({'value': 'sum'}).reset_index()

    # Exibir totais por método de pagamento
    col5, col6, col7, col8 = st.columns(4)
    for i, row in enumerate(metodos_pagamento.itertuples()):
        if i == 0:
            col5.metric(f"Total {row.payment_method}", f"R$ {row.value:.2f}")
        elif i == 1:
            col6.metric(f"Total {row.payment_method}", f"R$ {row.value:.2f}")
        elif i == 2:
            col7.metric(f"Total {row.payment_method}", f"R$ {row.value:.2f}")
        elif i == 3:
            col8.metric(f"Total {row.payment_method}", f"R$ {row.value:.2f}")

    # Exibir gráfico de barras dos métodos de pagamento
    st.bar_chart(metodos_pagamento.set_index('payment_method')['value'])