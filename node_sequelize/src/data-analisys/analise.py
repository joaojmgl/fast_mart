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
df_products = pd.read_sql(query, conexao)

# Exibição de alguns insights da tabela produtos -----------

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

# insights da tabela finances: --------------------

query_fin = "SELECT * FROM finance"
df_finances = pd.read_sql(query_fin, conexao)
conexao.close()

# merge de finances e products: vou precisar lá em baixo

fin_product_merge = pd.merge(df_finances, df_products[['id', 'name']], left_on='product_id', right_on='id', how='left') # left join

# Operações por tipo: (compra ou venda)
vendas = df_finances[df_finances['description'] == 'Venda']
compras = df_finances[df_finances['description'] == 'Compra']
total_vendas = vendas['value'].sum()
total_compras = compras['value'].sum()

select_compra_venda = df_finances['description'].tolist()[:2]


 # Operações por metodo de pagamento
 
select_payment_method = df_finances['payment_method'].tolist()[:4]

dinheiro = df_finances[df_finances['payment_method'] == 'Dinheiro']
total_din = dinheiro['value'].sum()

credito = df_finances[df_finances['payment_method'] == 'Cartão de credito']
total_cred = credito['value'].sum()

pix = df_finances[df_finances['payment_method'] == 'Pix']
total_pix = pix['value'].sum()

deb = df_finances[df_finances['payment_method'] == 'Cartão de débito']
total_deb = deb['value'].sum()

# volume de operações por método de pagamento:

agrupa_pmm = df_finances.groupby(['payment_method']).size()

   
# ----- daqui pra cima, adicionar mais insights

# ----- daqui pra baixo, criação do dashboard

import streamlit as st

st.title('Dashboard Fastmart')

# Criação das abas
tab1, tab2, tab3, tab4, tab5 = st.tabs(["Lucros e Margens", "Fornecedores", "Métodos de Pagamento", "Compra/Venda", "Estoque"])

# Primeira aba: Lucros e Margens
with tab1:
    
    subtab_1 = st.selectbox("Pagina: ", ["1", "2", "3"])
    
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
            st.dataframe(comprados_por_mais.head(10)[['name', 'sale_price', 'supplier']], hide_index=True, use_container_width= True)
        
        with col6:
            st.header('Visualização gráfica: ')
            st.bar_chart(comprados_por_mais.head(10), x='name', y='sale_price')
        

# Segunda aba: Fornecedores
with tab2:
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

# Terceira aba: Métodos de Pagamento e Estoque
with tab3:
    col9, spacer, col10 = st.columns([1, 0.1, 1])
    
    with col9:
        st.header("Operações por método de pagamento:")
        opr_selecionada_pm = st.selectbox("Selecione o método de pagamento:", select_payment_method)
        operacoes_met_selec = fin_product_merge[fin_product_merge['payment_method'] == opr_selecionada_pm]
        st.dataframe(operacoes_met_selec[['name', 'description', 'value', 'quantity', 'payment_method']], hide_index=True, use_container_width=True)
        
        # Exibir o valor total baseado no método de pagamento
        if opr_selecionada_pm == 'Dinheiro':
            total = total_din
        elif opr_selecionada_pm == 'Cartão de credito':
            total = total_cred
        elif opr_selecionada_pm == 'Pix':
            total = total_pix
        else:
            total = total_deb

        st.markdown(f"<p><b>Valor total das transações pagas com {opr_selecionada_pm}:</b></p><p> R$ {total:.2f}</p>", unsafe_allow_html=True)
    
    with col10:
        st.header("Volume de operações por método de pagamento:")
        st.bar_chart(agrupa_pmm)
with tab4:
    
    col11, spacer, col12 = st.columns([1, 0.1, 1])
    
    with col11:
        st.header("Operações por compra ou venda: ")
        opr_selecionada = st.selectbox("selecione o tipo de opepração: ", select_compra_venda)
        operacoes_tipo_selec = fin_product_merge[fin_product_merge['description'] == opr_selecionada]
        st.dataframe(operacoes_tipo_selec[['name', 'description', 'value', 'quantity', 'payment_method']], hide_index=True, use_container_width= True)
        
        if opr_selecionada == 'Venda':
            totalcv = total_vendas
        else:
            totalcv = total_compras
        st.markdown(f"<p><b>Valor total das transações de {opr_selecionada}:</b></p><p> R$ {totalcv:.2f}</p>", unsafe_allow_html=True)
        
    with col12:
        st.header("Volume de operações por compra ou venda: ")
        agrupa_cmp_vnd = df_finances.groupby(['description']).size()
        st.bar_chart(agrupa_cmp_vnd) 
with tab5:
    
    subtab_2 = st.selectbox("Pagina: ", ["1", "2", ])
    
    if subtab_2 == '1':
        
        col13, spacer, col14 = st.columns([1, 0.23, 1]) 
       
        with col13:
            st.header('10 produtos em menor quantidade no estoque:')
            st.dataframe(menor_estoque.head(10)[['name', 'quantity_per_unit']], hide_index=True, use_container_width= True)
        
        with col14:
            st.header('Volume dos 10 produtos em menor quantidade no estoque: ')
            st.bar_chart(menor_estoque.head(10), x='name', y='quantity_per_unit')
    else:
        col15, spacer, col16 = st.columns([1, 0.23, 1])
        
        with col15:
            st.header('10 Produtos Mais Próximos da Validade: ')
            st.dataframe(top_products[['name', 'expiry_date', 'quantity_per_unit']], hide_index=True, use_container_width= True)
            
        with col16:
            st.header('10 Produtos Mais Próximos da Validade em maior quantidade: ')
            top_products_ord = top_products.sort_values(by= 'quantity_per_unit', ascending= False)
            st.dataframe(top_products_ord[['name', 'expiry_date', 'quantity_per_unit']], hide_index=True, use_container_width= True)
        

   

    