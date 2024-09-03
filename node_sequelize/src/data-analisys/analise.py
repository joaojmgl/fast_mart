import mysql.connector
import pandas as pd
import streamlit as st
import matplotlib.pyplot as plt

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

# insights da tabela finances: --------------------

query_fin = "SELECT * FROM finance"
df_fin = pd.read_sql(query_fin, conexao)
conexao.close()

# Operações por tipo: (compra ou venda)
vendas = df_fin[df_fin['description'] == 'Venda']
compras = df_fin[df_fin['description'] == 'Compra']
total_vendas = vendas['value'].sum()
total_compras = compras['value'].sum()

select_compra_venda = df_fin['description'].tolist()[:2]


 # Operações por metodo de pagamento
 
select_payment_method = df_fin['payment_method'].tolist()[:4]

dinheiro = df_fin[df_fin['payment_method'] == 'Dinheiro']
total_din = dinheiro['value'].sum()

credito = df_fin[df_fin['payment_method'] == 'Cartão de credito']
total_cred = credito['value'].sum()

pix = df_fin[df_fin['payment_method'] == 'Pix']
total_pix = pix['value'].sum()

deb = df_fin[df_fin['payment_method'] == 'Cartão de débito']
total_deb = deb['value'].sum()

# volume de operações por método de pagamento:

agrupa = df_fin.groupby(['payment_method']).size()

   
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
    
with col6:
    st.header("Operações por compra ou venda: ")
    opr_selecionada = st.selectbox("selecione o tipo de opepração: ", select_compra_venda)
    operacoes_tipo_selec = df_fin[df_fin['description'] == opr_selecionada]
    st.dataframe(operacoes_tipo_selec[['product_id', 'description', 'value', 'quantity', 'payment_method']], hide_index=True, use_container_width= True)
    
    if opr_selecionada == 'Venda':
        st.markdown(
    f"""
    <div style='text-align: center; padding-top: 10px; font-size: 12px; color: gray;'>
        <hr>
        <p>Valor total das transações de venda:</p>
        <p>R$ {total_vendas:.2f}</p>
    </div>
    """, unsafe_allow_html=True
    )
    else:
        st.markdown(
    f"""
    <div style='text-align: center; padding-top: 10px; font-size: 12px; color: gray;'>
        <hr>
        <p>Valor total das transações de compra:</p>
        <p>R$ {total_compras:.2f}</p>
    </div>
    """, unsafe_allow_html=True
    )
        
col7, spacer, col8 = st.columns([1, 0.23, 1])

with col7:
    st.header("Operações por método de pagamento: ")
    opr_selecionada_pm = st.selectbox("selecione o método de pagamento: ", select_payment_method)
    operacoes_met_selec = df_fin[df_fin['payment_method'] == opr_selecionada_pm]
    st.dataframe(operacoes_met_selec[['product_id', 'description', 'value', 'quantity', 'payment_method']], hide_index=True, use_container_width= True)
    if opr_selecionada_pm == 'Dinheiro':
        st.markdown(
    f"""
    <div style='text-align: center; padding-top: 10px; font-size: 12px; color: gray;'>
        <hr>
        <p>Valor total das transações em dinheiro:</p>
        <p>R$ {total_din:.2f}</p>
    </div>
    """, unsafe_allow_html=True
    )
    elif opr_selecionada_pm == 'Cartão de credito':
        st.markdown(
    f"""
    <div style='text-align: center; padding-top: 10px; font-size: 12px; color: gray;'>
        <hr>
        <p>Valor total das transações no cartão de crédito:</p>
        <p>R$ {total_cred:.2f}</p>
    </div>
    """, unsafe_allow_html=True
    )
    elif opr_selecionada_pm == 'Pix':
        st.markdown(
    f"""
    <div style='text-align: center; padding-top: 10px; font-size: 12px; color: gray;'>
        <hr>
        <p>Valor total das transações via pix:</p>
        <p>R$ {total_pix:.2f}</p>
    </div>
    """, unsafe_allow_html=True
    )
    else:
        st.markdown(
    f"""
    <div style='text-align: center; padding-top: 10px; font-size: 12px; color: gray;'>
        <hr>
        <p>Valor total das transações no cartão de débito:</p>
        <p>R$ {total_deb:.2f}</p>
    </div>
    """, unsafe_allow_html=True
    )
        
with col8:
    st.header("Volume de operações por método de pagamento: ")
    st.bar_chart(agrupa)