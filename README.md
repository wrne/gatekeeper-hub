# Gatekeeper HUB - PUCRS

## Arquitetura de software

<img width="1171" height="461" alt="image" src="https://github.com/user-attachments/assets/a115d6f1-c7f2-4da0-a32e-6825157d7c8a" />


## Tecnologias utilizadas

| Tecnologia | Ferramenta |
| --- | --- | 
| **Back-end** | NodeJS |
| **Message Broker** | [RabbitMQ](https://www.notion.so/RabbitMQ-fb2c9d12b7e642bb86dffd6841c1c0e1?pvs=21) |
| **Banco de Dados** | SQL Server |
| **Gateway** | Nginx | 

## Registros de Decisões de Arquitetura - ADR

### August 12, 2025 - Nomeclatura das filas do RabbitMQ

**Contexto:** 
As filas eram definidas apenas pelo seu conteúdo, mas com a inclusão de novos sistemas legados nas integrações previstas gera-se a dúvida de quem será o responsável por processar as mensagens e o sentido que elas seguem, se vindas do ERP ou para ele.

**Decisão:** 
As filas a partir de agora, **carregam o nome do sistema que irá processar as mensagens.** Por exemplo: *protheus_sales_orders* contém novos pedidos de vendas que serão processados pelo Protheus, independente da origem. *tarken_customers* contém os clientes que serão enviados à plataforma Tarken.

**Consequências**: 
Fica fácil entender para onde as mensagens de uma determinada fila está indo.

Se a fila tem o nome de um sistema satélite, a informação foi originada no Protheus e está sendo enviada para o legado. Se a fila tem o nome do Protheus, significa que foi gerada em satélite e está sendo integrada ao Protheus.

Os bindings permanecem responsáveis por entregar as mensagens às filas corretamente. Podendo haver mais de uma fila para o mesmo binding.

### July 30, 2025 - Exchange tipo Topic para integrações vindas do Protheus

**Contexto:** 
Até o momento os exchagnes eram do tipo “direct”. Criando um binding por fila, cada fila responsável por processar os dados de um cadastro diferente no Protheus.
Com a integração de novas plataformas ao Conecta, teve-se a necessidade de integrar o mesmo cadastro a dois sistemas distintos. Por exemplo: Um novo cliente deve ser enviado tanto ao portal Farmi quanto á Tarken.

Como uma fila por sistema, deveriam ser realizadas duas chamadas no Protheus e a cada novo sistema, os fontes no Protheus deveriam ser alterados.

**Decisão:** 

1. Alterar o tipo do Exchange de novos cadastros do Protheus para **Topic.**
2. Definir os bindings com **padrões indicando a origem da mensagem, o destino e o contexto.**

Por exemplo:
protheus.*.customers: indica uma mensagem gerada pelo Protheus para todos os sistemas que tenham interesse em cliente.
tarken.*.pricing: indica uma mensagem gerada pela Tarken que tenha informações de um cliente.


**Consequências**: 
Ao alterar o tipo do Exchange para Topic, passamos a poder usar chaves genéricas como bindging de filas. Dessa forma várias filas podem receber a mesma mensagem com uma única operação de publish pelo Protheus.
****

## Métodos e Rotas implementados

Todas as rotas estão (e devem continuar sendo) documentadas no Swagger da API:

[Link aqui](https://api.ccab-agro.net/summer-dev/docs/)

## Componentes e Boas Práticas

### Padrão de resposta

Foi incluído um middleware na propriedade *response* do **Express** em todas as rotas que permite que todas as respostas sejam padronizadas, sejam elas de sucesso ou de erro.

**Mensagens de sucesso**

Execução do método ***res.success(data, message)***

Onde:

- data: objeto opcional em JSON com qualquer dado que deva ser retornado na API.
- message: Mensagem opcional que será retornada na API.

Formato de saída:

```jsx
{
    "status": 200,
    "message": "task added successful.", // Mensagem Padrão
    "data": null,
    "error": null
}
```

**Mensagens de erro**

Execução do método ***res.error(statusCode, errorObj, errorTitle)***

Onde:

- statusCode: código http do status code do erro. O *default* é 500.
- error: objeto com instancia da classe Error(). A propriedade error.message é retornada na API na propriedade message.
- titleError: Mensagem opcional que será enviada na propriedade error no retorno da API.

Formato de saída:

```jsx
{
    "status": 401,
    "message": "jwt expired",
    "error": "Not autorized"
}
```

Para saber mais sobre os status code que você pode utilizar, acesse: 

https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

### Logging

Todas as requisições geram um log padronizado com as informações:

- req.method,
- req.hostname,
- req.path,
- req.time,
- req.user

Para os demais casos, foi criado um componente para auxiliar na padronização dos logs de console.

```jsx
import {logMessage, logError} from "./utils/log-generator.js";

logMessage(`Servidor escutando na porta: ${port}`)
logError(`Falha no servidor!`)
```

Alguns logs são habilitados somente durante execuções no modo de Development. Para habilitar este modo:

`npm run dev` 

### Rotas

As rotas podem ser publicas ou privadas e são encontradas em: 

- `./src/routes/private-routes.js`
- `./src/routes/public-routes.js`

Todas as rotas sob o Router definido em private-routes.js aciona o middleware de autenticação.

### Autenticação e Autorização

A autenticação utiliza o método **Bearer com token JWT** para garantir a identidade do requisitante.
A gravação das senhas no banco é criptografa utilizando salt de 64 bits.

Todas as rotas além da autenticação, possuem definição de autorização.
Ou seja, mesmo autenticado no sistema, um usuário pode ter acesso limitado a uma determinada rota, ou grupo de rotas. 

As autorizações estão definidas no fonte `auth-routes.js`  e são interpretas pelo middleware `autorizateMiddleware` .

## Filas - RabbitMQ

### Exchanges

O Exchange escolhido é do tipo ***Topic***.

Isso permite que uma requisição para um Topic seja consumido por várias filas distintas.

Isto é útil quando precisamos que a mesma informação seja disponibilizada em vários lugares (sistemas) de maneira assíncrona.

Como exemplo podemos criar um novo cliente no Protheus e ter este cliente replicado via integração para o portal de e-commerce e para o sistema de análise de crédito. 

O padrão adotado de **binding keys** das filas é o seguinte: *origem.destino.assunto*

por exemplo: protheus.ecommerce.clientes.

# Pendências
[x] Controle de acesso por papeis (clientes) 

[ ] Testes automatizados

[ ] Containerização dos componentes

[ ] Cadastro de servidores de Webhooks

[ ] Interface gráfica para cadastro de novos usuários, servidores de webhooks

[ ] Possibilidade de habilitar ou desabilitar endpoints
