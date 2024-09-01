import mysql.connector
import pandas as pd
import streamlit as st

# Conectar ao banco de dados:
conexao = mysql.connector.connect(
    host="localhost",
    user="root",
    password="123456",
    database="fastmart",
    charset="utf8mb4",  
    collation="utf8mb4_unicode_ci"
)

# Ler dados da tabela produtos
query = "SELECT * FROM products"
df = pd.read_sql(query, conexao)
conexao.close()

# Exibição de alguns insights da tabela produtos -----------

# produtos mais lucrativos:

df['lucro'] = df['sale_price'] - df['purchase_price']
produtos_mais_lucrativos = df.sort_values(by='lucro', ascending=False)

# produtos com a maior margem de lucro percentual:

df['perc_lucro'] = ((df['sale_price'] - df['purchase_price']) / df['purchase_price']) * 100
maior_perc_lucro = df.sort_values(by='perc_lucro', ascending= False)

# produtos mais proximos da data de validade:

df['expiry_date'] = pd.to_datetime(df['expiry_date'])
today = pd.Timestamp.now()
df_future = df[df['expiry_date'] > today]
df_sorted = df_future.sort_values(by='expiry_date')
top_products = df_sorted.head(10)

# Produtos por fornecedor:

produtos_por_forncedor = df.groupby('supplier')['name'].apply(lambda x: '\n    '.join(x)).reset_index(name='products')
fornecedores = produtos_por_forncedor['supplier'].tolist()

#produtos em menor quantidade no estoque:

menor_estoque = df.sort_values(by='quantity_per_unit', ascending= True)
   
# ----- daqui pra cima, adicionar mais insights
# ----- daqui pra baixo, criação do dashboard

# Criação do dashboard Streamlit
st.title('Dashboard Fastmart')

# Criação de colunas com espaçamento
col1, spacer, col2 = st.columns([1, 0.23, 1])

with col1:
    st.header('10 Produtos mais lucrativos')
    st.bar_chart(produtos_mais_lucrativos.head(10).set_index('name')['lucro'])

with col2:
    st.header('10 Produtos com Maior margem percentual de lucro:')
    st.bar_chart(maior_perc_lucro.head(10).set_index('name')['perc_lucro'])

# Outra linha de colunas com espaçamento
col3, spacer, col4 = st.columns([1, 0.23, 1])

with col3:
    st.header('10 Produtos Mais Próximos da Validade:')
    st.dataframe(top_products[['name', 'expiry_date', 'quantity_per_unit']], hide_index=True, use_container_width= True)

with col4:
    st.header('Produtos por Fornecedor:')
    fornecedor_selecionado = st.selectbox('Selecione o fornecedor:', fornecedores)
    produtos_fornecedor_selecionado = df[df['supplier'] == fornecedor_selecionado]
    st.dataframe(produtos_fornecedor_selecionado[['name', 'sale_price', 'purchase_price', 'quantity_per_unit', 'expiry_date']], hide_index= True, use_container_width= True)
    
col5, spacer, col6 = st.columns([1, 0.23, 1])

with col5:
    st.header('10 produtos em menor quantidade no estoque:')
    st.dataframe(menor_estoque.head(10)[['name', 'quantity_per_unit']], hide_index=True, use_container_width= True)