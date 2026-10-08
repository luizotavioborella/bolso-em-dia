# aqui estamos importando recursos do Flask que utilizaremos
# redirecionar o usuário, mostrar mensagens e armazenar informações na sessão.
from flask import Flask, render_template, request, redirect, url_for, flash, session

# importa a biblioteca que permite conectar o Python ao banco de dados Firebird
import fdb

# importa funções para criptografar as senhas e verificar as senhas durante o login
# diferente da forma ensinada em sala de aula, porém o grupo se adaptou melhor
from werkzeug.security import generate_password_hash, check_password_hash


# cria a aplicação do Flask
app = Flask(__name__)

# define uma chave secreta utilizada pelo Flask para proteger recursos, como a session (usada para guardar informações temporariamente).
app.config['SECRET_KEY'] = 'chave_secreta_bolso_em_dia'

# define as informações necessárias para acessar o banco de dados
host = "localhost"  # indica que o banco está no próprio computador
database = r"D:\Desktop\BOLSO_EM_DIA\BANCO.FDB"  # caminho do arquivo do banco
user = "sysdba"  # usuário utilizado para acessar o banco Firebird
password = "sysdba"  # senha do usuário do banco

# estabelece a conexão entre o sistema Flask e o banco de dados Firebird
con = fdb.connect(host=host, database=database, user=user, password=password)

def validar_senha(senha):
    # todos os requisitos começam como False pois ainda não foram cumpridos
    min_caractere = False
    min_upper = False
    min_lower = False
    min_num = False
    min_caractere_esp = False

    # aqui, o len(senha) conta quantos caracteres tem na senha digitada pelo usuário,
    # se for maior ou igual a 8, aquele requisito que antes era falso agora é verdadeiro
    if len(senha) >= 8:
        min_caractere = True


    # aqui, é preciso percorrer caractere por caractere para conferir os requisitos
    for caractere in senha:

        # aqui, o .isalpha() confere se o caractere selecionado é uma letra
        # e o .upper() transforma o caractere em maiúsculo
        # a lógica é conferir se o caractere selecionado é igual a ele mesmo transformado em maiúsculo
        # ou seja, esse if confere se o caractere é uma letra e se essa letra é maiúscula para tornar o requisito verdadeiro
        if caractere.isalpha() and caractere == caractere.upper():
            min_upper = True

        # aqui, o .isalpha() confere se o caractere selecionado é uma letra
        # e o .lower() transforma o caractere em minúsculo
        # a lógica é conferir se o caractere selecionado é igual a ele mesmo transformado em minúsculo
        # ou seja, esse if confere se o caractere é uma letra e se essa letra é minúsculo para tornar o requisito verdadeiro
        if caractere.isalpha() and caractere == caractere.lower():
            min_lower = True

        # aqui, o .isdigit() confere de o caractere selecionado é um número
        # para validar o requisito de no mínimo 1 número na senha
        if caractere.isdigit():
            min_num = True

        # aqui, usamos novamente o .isalpha() para descobrir se NÃO é letra e o .isdigit para descobrir se NÃO é número
        # se não for nenhum dos dois, significa que é um caractere especial
        if not caractere.isalpha() and not caractere.isdigit():
            min_caractere_esp = True

    # por fim, vamos conferir se todos os requisitos que antes eram False mudaram para True
    # se mudou, então a senha está validada (validacao = True
    if min_caractere == True and min_upper == True and min_lower == True and min_num == True and min_caractere_esp == True:
        validacao = True
        return validacao

    # se não mudou, então senha não está validada (validacao = False)
    else:
        validacao = False
        return validacao


@app.route('/') # rota responsável por carregar a página inicial
def index():
    return render_template('index.html')

@app.route('/pagina_cadastro') # rota responsável por carregar a tela da primeira etapa do cadastro
def pagina_cadastro():
    return render_template('cadastro.html')

# rota responsável por realizar a primeira etapa do cadastro
# metodo POST pois envia os dados do formulário para o python
@app.route('/cadastrar_usuario', methods=['POST'])
def cadastrar_usuario():

    # aqui, capturamos todos os dados preenchidos no formulário de cadastro, utilizando request.form
    nome = request.form['nome']
    email = request.form['email']
    data_nasc = request.form['data_nasc']
    telefone = request.form['telefone']
    cpf = request.form['cpf']
    senha = request.form['senha']
    confirmar = request.form['confirmar']

    # criar cursor que envia comando para ser executado no banco de dados
    cursor = con.cursor()

    # iniciamos com try para tratamento de erro (o sistema TENTA (try) fazer o código abaixo)
    try:

        # aqui procuramos se o email, telefone ou cpf já estõ cadastrados, se sim -> retorna 1
        cursor.execute("""SELECT 1 FROM USUARIO 
                          WHERE upper(EMAIL) = ? OR TELEFONE = ? OR CPF = ?""", (email.upper(), telefone, cpf,))


        # se retornar 1, o flash mostra uma mensagem para o usuário e volta para a página de cadastro
        if cursor.fetchone(): # fetchone pega a primeira linha encontrada da consulta
            flash('E-mail, telefone ou CPF já está sendo usado por outro usuário', 'error')
            return redirect(url_for('pagina_cadastro'))


        # aqui conferimos de os campos SENHA e CONFIRMAR SENHA foram preenchidos iguais
        # se estão diferentes o flash mostra uma mensagem ao usuário e volta para a página de cadastro
        if confirmar != senha:
            flash('Confirmação de senha não corresponde à senha', 'error')
            return redirect(url_for('pagina_cadastro'))

        # aqui chamamos a função que criamos lá no início para validar a senha
        # se ela passar pela validação (estando True), criptografamos ela
        if validar_senha(senha) == True:
            senha_cripto = generate_password_hash(senha)

            # após criptografar a senha, salvamos todos os dados coletados na session (a session serve para guardar informações temporariamente enquanto o usuário navega pelo sistema)
            # os dados são salvos em forma de dicionário
            session['cadastro'] = {
                'nome': nome,
                'email': email,
                'data_nasc': data_nasc,
                'telefone': telefone,
                'cpf': cpf,
                'senha': senha_cripto
            }

            # após salvar os dados na session, carregamos a tela da próxima etapa de cadastro
            return render_template('cadastro_info.html')

        # caso a senha não tenha passado pela validação (estanto False), a página recarrega e flash exibe uma mensagem de alerta
        else:
            flash('Senha não atende aos requisitos!', 'error')
            return redirect(url_for('pagina_cadastro'))

    # caso o sistema não consiga realizar o código de try por algum erro, except será executado para mostrar o erro e redirecionar para alguma página
    except Exception as e:
        flash(f'Ocorreu um erro: {e}', 'error')
        return redirect(url_for('pagina_cadastro'))

    # ao final do tratamento, devemos fechar o cursor
    # deixá-los abertos faz com que recursos sejam consumidos desnecessáriamente, podendo causar problemas no sistema
    finally:
        cursor.close()


# rota responsável por realizar a segunda etapa do cadastro
# metodo POST pois envia os dados do formulário para o python
@app.route('/cadastrar_informacoes', methods=['POST'])
def cadastrar_informacoes():

    # aqui, capturamos todos os dados preenchidos no formulário de cadastro de informações, utilizando request.form
    valor_diaria = request.form['valor_diaria']
    adicional = request.form['adicional']
    min_pacotes = request.form['min_pacotes']
    dados = session['cadastro']

    # criar cursor que envia comando para ser executado no banco de dados
    cursor = con.cursor()

    # iniciamos com try para tratamento de erro (o sistema TENTA (try) fazer o código abaixo)
    try:

        # aqui estamos inserindo todos os dados coletados no banco de dados
        cursor.execute("""INSERT INTO USUARIO (
                        NOME_COMPLETO, EMAIL, DATA_NASCIMENTO,
                        TELEFONE, CPF, SENHA, STATUS, TENTATIVAS,
                        VALOR_DIARIA, ADICIONAL, MIN_PACOTES
                    )
                    VALUES (?, ?, ?, ?, ?, ?, 1, 0, ?, ?, ?)""", (dados['nome'], # como usamos o dicionário para guardar os dados anteriores, é assim que eles devem ser chamados
                                                                    dados['email'],
                                                                    dados['data_nasc'],
                                                                    dados['telefone'],
                                                                    dados['cpf'],
                                                                    dados['senha'],
                                                                    valor_diaria,
                                                                    adicional,
                                                                    min_pacotes))

        # aqui estamos buscando o id_usuario que foi criado, a partir do cpf (que é um dado único de cada pessoa, não há repetidos)
        cursor.execute("""SELECT ID_USUARIO FROM USUARIO WHERE CPF = ?""", (dados['cpf'],))

        # guardamos o id_usuario dentro de uma variável, utilizando o fetchone que pega a primeira linha da busca realizada
        id_usuario = cursor.fetchone()[0] # [0] para remover o valor da tupla. ele vem assim: (15,). com [0] deixamos assim: 15


        # após encontrarmos o id_usuario da pessoa que acabou de se cadastrar, salvamos a senha criada no banco de dados, em HISTORICO_SENHA
        # essa tabela será utilizada mais a frente para evitar que o usuário troque sua senha para uma igual às 3 últimas
        cursor.execute("""INSERT INTO HISTORICO_SENHA (ID_USUARIO, SENHA) VALUES(?,?)""", (id_usuario, dados['senha'],))


        # con.commit é utilizado para salvar alguma alteração realizada no banco
        con.commit()

        # como já salvamos os dados no banco, podemos limpar a session com os dados que estavam guardados nela
        # o None serve para que, se session estiver vazia, não vai tentar excluir nada
        session.pop('cadastro', None)

        # após o registro de todos os dados, redirecionamos o usuário para a página final do processo de cadastro
        return render_template('final_cadastro.html')

    # caso o sistema não consiga realizar o código de try por algum erro, except será executado para mostrar o erro e redirecionar para alguma página
    except Exception as e:
        con.rollback()
        flash(f'Ocorreu um erro: {e}', 'error')
        return redirect(url_for('pagina_cadastro'))

    # ao final do tratamento, devemos fechar o cursor
    # deixá-los abertos faz com que recursos sejam consumidos desnecessáriamente, podendo causar problemas no sistema
    finally:
        cursor.close()


# rota que carrega a página de login
@app.route('/pagina_login')
def pagina_login():
    return render_template('login.html')

# rota responsável por realizar as verificações de dados e executar o login
@app.route('/login', methods=['POST'])
def login():

    # captura dos dados de login (a variável login refere-se ao campo para inserir email, telefone ou cpf)
    login = request.form['login']
    senha = request.form['senha']

    print("Login digitado:", repr(login))
    print("Tamanho:", len(login))

    # criar cursor que envia comando para ser executado no banco de dados
    cursor = con.cursor()

    # iniciamos com try para tratamento de erro (o sistema TENTA (try) fazer o código abaixo)
    try:

        # aqui buscamos no banco de dados através do email,telefone ou cpf, o id do usuario, seu status e quantas tentativas de login já foram realizadas, para confirmar que esse usuario existe
        if len(login) > 15: # como o campo de cpf e telefone aceitam só 15 caracteres, verificamos se o login digitado foi maior que isso
            # se for maior, vamos comparar somente com o email (pois não tem como telefone ou cpf serem maiores que 15)
            cursor.execute("""SELECT ID_USUARIO, SENHA, COALESCE(STATUS, 1), COALESCE(TENTATIVAS, 0) FROM USUARIO WHERE upper(EMAIL) = ?""", (login.upper(),))
        else: # se for menor ou igual a 15, vai conferir com todos
            cursor.execute("""SELECT ID_USUARIO, SENHA, COALESCE(STATUS, 1), COALESCE(TENTATIVAS, 0) FROM USUARIO WHERE upper(EMAIL) = ? OR CPF = ? OR TELEFONE = ?""", (login.upper(), login, login,))

        # a primeira linha de busca encontrada ficará salva numa variável chamada "usuario"
        usuario = cursor.fetchone()

        # se usuario existir (busca foi encontrada)
        if usuario:

            # conferimos o status desse usuario (0 para inativo, 1 para ativo), se ele estiver ativo checaremos os dados
            if usuario[2] == 1:

                # pegamos o id e a senha que foram devolvidas para nós na busca no banco de dados
                id_usuario = usuario[0]
                senha_banco = usuario[1]


                # após salvarmos a senha que estava registrada no banco, vamos conferir se ela é igual a senha digitada na área de login
                # porém a senha do banco está criptogrfada, então utilizamos check_password_hash para fazer essa verificação
                if check_password_hash(senha_banco, senha):

                    # se as senhas são iguais, voltamos as tentativas para 0 (caso elas estivessem acima disso)
                    cursor.execute("""UPDATE USUARIO SET TENTATIVAS = 0 WHERE ID_USUARIO = ?""", (id_usuario, ))

                    # con.commit é utilizado para salvar alguma alteração realizada no banco
                    con.commit()

                    # salvamos na session qual usuario está logado através do seu id
                    session['id_usuario'] = id_usuario

                    # redireciona para a página inicial após o login (dashboard)
                    return redirect(url_for('dashboard'))


                # caso a senha digitada não seja a mesma salva no banco...
                else:
                    # a cada erro adicionamos +1 em tentativas
                    cursor.execute("""UPDATE USUARIO SET TENTATIVAS = COALESCE(TENTATIVAS, 0) + 1 WHERE ID_USUARIO = ?""", (id_usuario,))

                    # buscamos as tentativas para guardar o valor de erros em uma variável
                    cursor.execute("""SELECT TENTATIVAS FROM USUARIO WHERE ID_USUARIO = ?""", (id_usuario,))
                    erros = cursor.fetchone()[0]

                    # con.commit é utilizado para salvar alguma alteração realizada no banco
                    con.commit()

                    # verificamos se a variável erros está igual a 3 (nem maior nem menor, exatamente 3)
                    if erros == 3:
                        # caso erros for igual a 3, atualizamos o status do usuário para inativo, agora ele está bloqueado
                        cursor.execute("""UPDATE USUARIO SET STATUS = 0 WHERE ID_USUARIO = ?""", (id_usuario,))
                        con.commit()

                        # flash mostra uma mensagem de alerta
                        flash('USUÁRIO BLOQUEADO: 3 tentativas falhas', 'error')
                        return redirect(url_for('pagina_login'))

                    # a cada erro, flash mostra uma mensagem de alerta de senha incorreta e retorna para a página de login
                    flash('Senha incorreta!', 'error')
                    return redirect(url_for('pagina_login'))

            # se o status do usuário for 0, ele não consegue fazer login pois está inativo
            else:
                flash('Usuário inativo!', 'error')
                return redirect(url_for('pagina_login'))

        # se o usuário não foi encontrado no banco de dados, flash mostra uma mensagem de alerta
        else:
            flash('E-mail, telefone ou CPF não cadastrado!', 'error')
            return redirect(url_for('pagina_login'))

    # caso o sistema não consiga realizar o código de try por algum erro, except será executado para mostrar o erro e redirecionar para alguma página
    except Exception as e:
        con.rollback()
        flash(f"Ocorreu um erro: {e}", "error")
        return redirect(url_for('pagina_login'))

    # ao final do tratamento, devemos fechar o cursor
    # deixá-los abertos faz com que recursos sejam consumidos desnecessáriamente, podendo causar problemas no sistema
    finally:
        cursor.close()

# rota responsável pelo logout do usuário
@app.route('/logout')
def logout():
    # se nenhum id está salvo em session (ou seja, usuário não está logado), retorna para a página de login
    if 'id_usuario' not in session:
        return redirect(url_for('pagina_login'))

    # se estiver logado, ao apertar em logout seu id é apagado de session e flash mostra uma mensagem de sessão encerrada
    session.pop('id_usuario', None)
    flash('Sessão encerrada. Faça login novamente.')
    return redirect(url_for('pagina_login'))


# rota responsável por carregar a página inicial de dashboard
@app.route('/dashboard')
def dashboard():

    # se o usuario não estiver logado (se seu id não estiver guardado em session) ele não consegue acessar a tela de dashboard
    if 'id_usuario' not in session:
        flash('É necessário realizar o login', 'error')
        return redirect(url_for('pagina_login'))

    # pega o id do usuário que está logado
    id_usuario = session['id_usuario']

    # criar cursor que envia comando para ser executado no banco de dados
    cursor = con.cursor()

    # iniciamos com try para tratamento de erro (o sistema TENTA (try) fazer o código abaixo)
    try:
        # aqui buscamos o nome completo do usuário através do seu id
        cursor.execute("""SELECT NOME_COMPLETO FROM USUARIO WHERE ID_USUARIO = ?""", (id_usuario,))

        # e salvamos a linha de busca encontrada em uma variável
        usuario = cursor.fetchone()

        # envia o nome para a dashboard
        return render_template("dashboard.html", usuario=usuario[0])

    # caso o sistema não consiga realizar o código de try por algum erro, except será executado para mostrar o erro e redirecionar para alguma página
    except Exception as e:
        flash(f'Ocorreu um erro: {e}', 'error')
        return redirect(url_for('pagina_login'))

    # ao final do tratamento, devemos fechar o cursor
    # deixá-los abertos faz com que recursos sejam consumidos desnecessáriamente, podendo causar problemas no sistema
    finally:
        cursor.close()

@app.route('/perfil', methods=['GET'])
def perfil():
    if 'id_usuario' not in session:
        flash('É necessário realizar o login', 'error')
        return redirect(url_for('pagina_login'))

    # vamos salvar em uma variável o mesmo id que está guardado em session
    id_usuario = session['id_usuario']

    # criar cursor que envia comando para ser executado no banco de dados
    cursor = con.cursor()

    # iniciamos com try para tratamento de erro (o sistema TENTA (try) fazer o código abaixo)
    try:
        # aqui buscamos todos os dados registrados do usuário através do id dele
        cursor.execute("""SELECT NOME_COMPLETO, EMAIL, DATA_NASCIMENTO, TELEFONE, CPF, VALOR_DIARIA, ADICIONAL, MIN_PACOTES FROM USUARIO WHERE ID_USUARIO = ?""",(id_usuario,))

        # e salvamos a linha de busca encontrada em uma variável
        usuario = cursor.fetchone()

        return render_template('perfil.html', usuario=usuario)

    # caso o sistema não consiga realizar o código de try por algum erro, except será executado para mostrar o erro e redirecionar para alguma página
    except Exception as e:
        con.rollback()
        flash(f'Ocorreu um erro: {e}', 'error')
        return redirect(url_for('dashboard'))

    # ao final do tratamento, devemos fechar o cursor
    # deixá-los abertos faz com que recursos sejam consumidos desnecessáriamente, podendo causar problemas no sistema
    finally:
        cursor.close()


# rota responsável pela edição dos dados do usuário
# métodos GET e POST utilizados, get para mostrar na tela os dados já registrados, post para os dados editados serem enviados ao python
@app.route('/editar_usuario', methods=['GET','POST'])
def editar_usuario():

    # se o usuário não estiver logado, ele não consegue acessar essa tela de edição
    if 'id_usuario' not in session:
        flash('É necessário realizar o login', 'error')
        return redirect(url_for('pagina_login'))

    # vamos salvar em uma variável o mesmo id que está guardado em session
    id_usuario = session['id_usuario']

    # criar cursor que envia comando para ser executado no banco de dados
    cursor = con.cursor()

    # iniciamos com try para tratamento de erro (o sistema TENTA (try) fazer o código abaixo)
    try:
        # aqui buscamos todos os dados registrados do usuário através do id dele
        cursor.execute("""SELECT NOME_COMPLETO, EMAIL, DATA_NASCIMENTO, TELEFONE, CPF, SENHA, VALOR_DIARIA, ADICIONAL, MIN_PACOTES FROM USUARIO WHERE ID_USUARIO = ?""", (id_usuario,))

        # e salvamos a linha de busca encontrada em uma variável
        usuario = cursor.fetchone()

        # caso o metodo POST seja utilizado (ou seja, os dados forem editados), capturamos novamente todos os dados do usuário
        if request.method == 'POST':
            nome = request.form['nome']
            email = request.form['email']
            data_nasc = request.form['data_nasc']
            telefone = request.form['telefone']
            cpf = request.form['cpf']
            senha_nova = request.form['senha']
            valor_diaria = request.form['valor_diaria']
            adicional = request.form['adicional']
            min_pacotes = request.form['min_pacotes']


            # verifica se e-mail, telefone ou CPF já pertencem a outro usuário (<> id -> diferente do id do usuário que está editando)
            cursor.execute("""SELECT 1 FROM USUARIO WHERE (upper(EMAIL) = ? OR TELEFONE = ? OR CPF = ?) AND ID_USUARIO <> ? """, (email.upper(), telefone, cpf, id_usuario))

            # se a busca for encontrada, flash exibe uma mensagem de alerta e a página reinicia, o usuário não pode utilizar dados que já estão cadastrados por outros usuários
            if cursor.fetchone():
                flash('E-mail, telefone ou CPF já está sendo usado por outro usuário', 'error')
                return redirect(url_for('editar_usuario'))

            # agora, salvamos em uma variável quais são as 3 últimas senhas que foram utilizadas por esse usuário
            cursor.execute("""SELECT FIRST 3 SENHA FROM HISTORICO_SENHA WHERE ID_USUARIO = ? ORDER BY DATA_ALTERACAO DESC""", (id_usuario,))
            senhas_antigas = cursor.fetchall()

            # se o usuário mudar a senha, cria um novo hash
            if senha_nova:

                # antes de mudar de fato a senha no banco, conferimos se ela não é igual às últimas 3 utilizadas por esse usuário
                for senha_antiga in senhas_antigas:
                    if check_password_hash(senha_antiga[0], senha_nova):

                        # caso seja igual, flash mostra uma mensagem de alerta e a página se reinicia
                        flash('A nova senha não pode ser igual às últimas 3 senhas!', 'error')
                        return redirect(url_for('editar_usuario'))

                # caso a senha seja diferente das 3 últimas, vamos validar ela
                # se ela for validada (True)...
                if validar_senha(senha_nova):

                    # a senha nova é criptografada
                    senha_cripto = generate_password_hash(senha_nova)

                # caso a senha não seja validada (False)
                else:
                    # flash mostra uma mensagem de alerta e a página é reiniciada
                    flash('Senha não atende aos requisitos!', 'error')
                    return redirect(url_for('editar_usuario'))

            # se a senha estiver vazia (ou seja, não foi mudada), mantém a senha atual
            else:
                senha_cripto = usuario[5]

            # agora, atualizamos todos os dados do usuário no banco de dados
            cursor.execute("""UPDATE USUARIO SET NOME_COMPLETO = ?, EMAIL = ?, DATA_NASCIMENTO = ?, TELEFONE = ?, CPF = ?, SENHA = ?, VALOR_DIARIA = ?, ADICIONAL = ?, MIN_PACOTES = ? WHERE ID_USUARIO = ?""",(nome, email, data_nasc, telefone, cpf, senha_cripto, valor_diaria, adicional, min_pacotes, id_usuario,))

            # registra a nova senha no histórico somente quando ela foi alterada
            if senha_nova:
                cursor.execute("""INSERT INTO HISTORICO_SENHA (ID_USUARIO, SENHA) VALUES (?, ?)""",(id_usuario, senha_cripto,))

            # con.commit é utilizado para salvar alguma alteração realizada no banco
            con.commit()

            # o flash mostra uma mensagem de sucesso e o usuário é levado para a página de dashboard
            flash('Usuário editado com sucesso!', 'success')
            return redirect(url_for('perfil'))

        # caso o usuário não utilize o metodo post (não tente editar as informações), a rota apenas carrega a página normalmente
        else:
            return render_template("editar.html", usuario=usuario)

# caso o sistema não consiga realizar o código de try por algum erro, except será executado para mostrar o erro e redirecionar para alguma página
    except Exception as e:
        con.rollback()
        print("ERRO AO EDITAR USUÁRIO:", repr(e))
        flash(f"Ocorreu um erro: {e}", "error")
        return redirect(url_for('dashboard'))

    # ao final do tratamento, devemos fechar o cursor
    # deixá-los abertos faz com que recursos sejam consumidos desnecessáriamente, podendo causar problemas no sistema
    finally:
        cursor.close()


if __name__ == "__main__":
    app.run(debug=True)
