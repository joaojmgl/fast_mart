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
print("10 Produtos que dão mais lucro:")
print(produtos_mais_lucrativos[['name', 'purchase_price', 'sale_price', 'lucro']][:10])

# produtos com a maior margem de lucro percentual:

df['perc_lucro'] = ((df['sale_price'] - df['purchase_price']) / df['purchase_price']) * 100
maior_perc_lucro = df.sort_values(by='perc_lucro', ascending= False)
print("\n10 Produtos com maior percentual de lucro:")
print(maior_perc_lucro[['name', 'purchase_price', 'sale_price', 'perc_lucro']][:10])

# produtos mais proximos da data de validade:

df['expiry_date'] = pd.to_datetime(df['expiry_date'])
today = pd.Timestamp.now()
df_future = df[df['expiry_date'] > today]
df_sorted = df_future.sort_values(by='expiry_date')
top_products = df_sorted.head(10)

print("\n10 Produtos mais proximos da validade:")
print(top_products[['name', 'expiry_date', 'in_stock']])

# Produtos por fornecedor:

produtos_por_forncedor = df.groupby('supplier')['name'].apply(lambda x: '\n    '.join(x)).reset_index(name='products')
fornecedores = produtos_por_forncedor['supplier'].tolist()
print('\nProdutos por fornecedor:')
for _, row in produtos_por_forncedor.iterrows():
    print(f"{row['supplier']}:")
    print(f"    {row['products']}")
    print()
    
    
    
# ----- daqui pra cima, adicionar mais insights
# ----- daqui pra baixo, criação do dashboard

# Criação do dashboard Streamlit
st.title('Dashboard Fastmart')

st.header('10 Produtos que Dão Mais Lucro:')
st.bar_chart(df.sort_values(by='lucro', ascending=False).head(10).set_index('name')['lucro'])

st.header('10 Produtos com Maior Percentual de Lucro:')
st.bar_chart(df.sort_values(by='perc_lucro', ascending=False).head(10).set_index('name')['perc_lucro'])

st.header('10 Produtos Mais Próximos da Validade:')
st.dataframe(top_products[['name', 'expiry_date', 'in_stock']])

st.header('Produtos por Fornecedor:')
fornecedor_selecionado = st.selectbox('Selecione o fornecedor:', fornecedores)

# Filtra os produtos pelo fornecedor selecionado
produtos_fornecedor_selecionado = df[df['supplier'] == fornecedor_selecionado]
st.dataframe(produtos_fornecedor_selecionado[['name', 'sale_price', 'purchase_price', 'in_stock', 'expiry_date']])