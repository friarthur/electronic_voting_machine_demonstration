# Urna Eletrônica — Simulação Educacional

Uma simulação web educacional do fluxo de votação de uma urna eletrônica brasileira, desenvolvida com **HTML, CSS e JavaScript puro**.

O projeto foi criado com o objetivo de estudar e demonstrar conceitos de:

- Interface de uma urna eletrônica
- Fluxo de votação
- Validação de candidatos
- Voto branco
- Voto nulo
- Integridade de dados
- Hash
- Criptografia
- Registro de votos
- Apuração
- Arquitetura de software
- Segurança no frontend
- Preparação para integração com backend PHP

> **IMPORTANTE:** este projeto é uma simulação independente para fins educacionais. Ele não reproduz a implementação interna da urna eletrônica brasileira e não possui qualquer vínculo oficial com o Tribunal Superior Eleitoral (TSE).

---

## Demonstração

O usuário interage com uma urna eletrônica simulada através de um teclado virtual ou do teclado físico do computador.

O fluxo principal é:

```text
Eleitor
   │
   ▼
Digitação do número
   │
   ▼
Identificação do candidato
   │
   ▼
Conferência do voto
   │
   ▼
Confirmação
   │
   ▼
Processamento
   │
   ├── Validação
   │
   ├── Identificação interna
   │
   ├── Integridade
   │
   ├── Criptografia demonstrativa
   │
   └── Registro
   │
   ▼
Voto registrado
   │
   ▼
Apuração
Objetivo

A ideia principal não é apenas criar uma interface parecida com uma urna.

O projeto busca demonstrar visualmente que, em um sistema de votação, existe uma sequência de operações entre:

Entrada
   ↓
Validação
   ↓
Processamento
   ↓
Proteção
   ↓
Armazenamento
   ↓
Apuração

Durante o processamento, a aplicação apresenta cada etapa através de cards e transições.

Exemplo:

┌─────────────────────────────┐
│                             │
│      01 — ENTRADA           │
│                             │
│      Recebendo voto...      │
│                             │
└─────────────────────────────┘
              ↓
┌─────────────────────────────┐
│                             │
│      02 — VALIDAÇÃO         │
│                             │
│      Número válido          │
│                             │
└─────────────────────────────┘
              ↓
┌─────────────────────────────┐
│                             │
│      03 — INTEGRIDADE       │
│                             │
│      Gerando hash...        │
│                             │
└─────────────────────────────┘
              ↓
┌─────────────────────────────┐
│                             │
│      04 — CRIPTOGRAFIA      │
│                             │
│      Protegendo dados...    │
│                             │
└─────────────────────────────┘
              ↓
┌─────────────────────────────┐
│                             │
│      05 — REGISTRO          │
│                             │
│      Voto registrado        │
│                             │
└─────────────────────────────┘
Funcionalidades
Votação

A aplicação permite:

Digitar o número do candidato
Identificar candidatos fictícios
Exibir nome
Exibir partido
Exibir cargo
Exibir foto fictícia
Conferir o voto
Corrigir o voto
Confirmar o voto
Voto branco

O botão:

BRANCO

permite iniciar um voto em branco.

O sistema solicita confirmação antes de registrar o voto.

Voto nulo

Caso seja digitado um número inexistente, a aplicação informa que o candidato não foi encontrado.

O usuário pode:

CORRIGE

ou:

CONFIRMA

para registrar o voto como nulo na simulação.

Correção

O botão:

CORRIGE

limpa o voto atual e permite iniciar novamente a digitação.

Confirmação

O botão:

CONFIRMA

somente fica disponível quando o sistema está pronto para receber a confirmação.

Após a confirmação, começa o processamento do voto.

Pipeline de processamento

Após a confirmação, o sistema apresenta uma sequência visual de processamento.

1. Entrada

O sistema recebe o voto informado.

Número recebido:

16
2. Validação

O sistema verifica se o número informado corresponde a um candidato válido.

16

✓ Número válido
✓ Candidato encontrado
3. Identificação interna

A aplicação demonstra conceitualmente a associação entre o número público do candidato e um identificador interno.

Exemplo:

Número público:

16

↓

ID interno:

04

Essa etapa é apenas uma representação educacional.

4. Integridade

O sistema pode gerar um hash utilizando a API criptográfica disponível no navegador.

Conceitualmente:

Dados do registro
       ↓
     SHA-256
       ↓
Hash

O objetivo é demonstrar o conceito de integridade.

Se os dados forem alterados, o hash calculado será diferente.

Hash original
      ≠
Hash calculado

INTEGRIDADE VIOLADA
5. Criptografia

A aplicação demonstra conceitualmente a proteção de dados utilizando recursos criptográficos disponíveis no navegador quando aplicável.

A criptografia utilizada na demonstração não representa a implementação criptográfica real da urna eletrônica brasileira.

O objetivo é exclusivamente educacional.

6. Registro

Após o processamento, o voto é marcado como registrado dentro da simulação.

Exemplo:

Registro #000001

Tipo:
Nominal

Número:
16

Status:
Registrado
7. Conclusão

Ao final:

✓ VOTO REGISTRADO

O usuário pode iniciar uma nova simulação.

Apuração

O projeto possui uma representação simples de apuração.

Exemplo:

Candidato 16    1 voto
Candidato 17    0 votos
Brancos         0 votos
Nulos           0 votos

TOTAL           1 voto

Os resultados pertencem exclusivamente à simulação executada no navegador.

Detalhes técnicos

A aplicação possui uma área para visualizar informações técnicas do processamento.

Exemplo:

Número informado:
16

Tipo:
Voto nominal

ID interno:
04

Hash:
7c9e6679...

Dados protegidos:
...

Status:
REGISTRADO

As informações exibidas são exclusivamente demonstrativas.

Tecnologias

O projeto foi desenvolvido utilizando apenas tecnologias web nativas.

Frontend
HTML5
CSS3
JavaScript
Web Crypto API
Sem frameworks

O projeto não utiliza:

React
Vue
Angular
jQuery
Bootstrap
Tailwind
Axios
Estrutura do projeto
urna-eletronica/
│
├── index.html
│
├── css/
│   └── style.css
│
├── js/
│   └── app.js
│
├── assets/
│   └── ...
│
└── README.md
Separação de responsabilidades

O projeto mantém HTML, CSS e JavaScript separados.

HTML

Responsável pela estrutura da aplicação.

index.html
CSS

Responsável pela apresentação visual.

css/style.css
JavaScript

Responsável por:

Estado da aplicação
Teclado
Validação
Candidatos
Votação
Pipeline
Hash
Criptografia demonstrativa
Apuração
Eventos
Acessibilidade
js/app.js
Arquitetura planejada

Apesar de atualmente ser um projeto frontend, a aplicação foi pensada para futuramente receber um backend PHP.

A arquitetura planejada é:

Frontend
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Repository
   │
   ▼
Banco de dados

A ideia é evitar que:

Controller acesse diretamente o banco
View contenha SQL
Model renderize HTML
Dados sensíveis sejam tratados diretamente na interface
Futuro backend PHP

Uma futura versão poderá substituir os dados locais por um backend PHP.

Exemplo conceitual:

Urna
  │
  │ voto
  ▼
PHP Controller
  │
  ▼
VoteService
  │
  ├── valida voto
  ├── processa registro
  ├── gera integridade
  └── protege dados
  │
  ▼
VoteRepository
  │
  ▼
MySQL

A implementação do backend deverá tratar toda entrada do navegador como não confiável.

As validações realizadas no JavaScript servem principalmente para experiência do usuário.

A validação real deverá ocorrer no servidor.

Segurança

Este projeto foi desenvolvido também como estudo de segurança.

Alguns conceitos demonstrados:

Integridade
Dados
 ↓
Hash
 ↓
Verificação
Criptografia
Dados
 ↓
Algoritmo criptográfico
 ↓
Dados protegidos
Validação
Entrada do usuário
 ↓
Validação
 ↓
Processamento
Importante sobre criptografia

Este projeto não implementa os mecanismos criptográficos oficiais utilizados pelos sistemas eleitorais brasileiros.

Também não utiliza:

Base64

como se fosse criptografia.

Base64 é apenas uma forma de codificação e não fornece confidencialidade.

Quando recursos criptográficos são utilizados, o projeto prioriza APIs criptográficas nativas do navegador, como a:

Web Crypto API
Segurança do frontend

Nenhuma chave secreta ou credencial deve ser armazenada no JavaScript.

Nunca confiar somente em validações feitas pelo navegador.

Por exemplo:

if (numero === "16") {
    // ...
}

não representa uma proteção real.

Em uma aplicação real, o backend deverá validar novamente todas as informações recebidas.

Acessibilidade

A interface busca oferecer:

Navegação pelo teclado
Estados de foco
aria-label
aria-live
Botões semanticamente corretos
Contraste adequado
Suporte a prefers-reduced-motion

Também é possível utilizar o teclado físico:

0-9  → Digitar número
Enter → Confirmar
Backspace → Corrigir
Esc → Corrigir
B → Branco
Performance

O JavaScript foi estruturado para evitar operações desnecessárias no DOM.

Entre os princípios utilizados:

Cache de elementos DOM
Controle centralizado de estado
Evitar listeners duplicados
Evitar intervalos desnecessários
Uso controlado de timers
async/await quando apropriado
Bloqueio de múltiplas confirmações
Controle de etapas do processamento
Animações leves
Suporte a prefers-reduced-motion
Responsividade

A aplicação foi projetada para funcionar em:

Desktop
Notebook
Tablet
Smartphone

O teclado virtual deve continuar utilizável em telas menores.

Dados fictícios

Todos os candidatos utilizados na demonstração são fictícios.

O projeto não utiliza:

candidatos reais;
partidos reais;
dados eleitorais reais;
CPF;
título de eleitor;
informações pessoais de eleitores.

O objetivo é evitar associação entre o projeto e uma eleição real.

Aviso educacional

Este projeto é uma experiência de aprendizado em desenvolvimento de software e segurança.

Ele utiliza conceitos simplificados para tornar o processamento compreensível visualmente.

O pipeline apresentado:

Entrada
↓
Validação
↓
Identificação
↓
Integridade
↓
Criptografia
↓
Registro

é uma representação didática e não deve ser interpretado como uma descrição literal da implementação interna da urna eletrônica brasileira.

Referências

Para estudar o funcionamento real da urna eletrônica e dos sistemas eleitorais brasileiros, consulte diretamente as publicações e documentações oficiais do Tribunal Superior Eleitoral.

Tribunal Superior Eleitoral (TSE)
Documentação pública sobre urnas eletrônicas
Informações públicas sobre sistemas eleitorais
Documentação técnica disponibilizada pelo TSE
Próximos passos

Possíveis evoluções do projeto:

 Backend PHP
 MySQL
 Repository Pattern
 Service Layer
 API REST
 Sistema de eleições
 Cadastro de candidatos
 Apuração no backend
 Auditoria de registros
 Verificação de integridade
 Sistema de logs
 Testes automatizados
 Testes de segurança
 Docker
 Ambiente de produção
Licença

Este projeto é destinado a fins educacionais e de estudo.

Consulte o arquivo de licença do repositório para obter informações sobre uso, modificação e distribuição.

Autor

Desenvolvido como projeto experimental para estudos de:

PHP • JavaScript • Segurança • Criptografia • Sistemas de votação • Arquitetura de software

Electronic Voting Machine — Educational Simulation

An educational web simulation of the voting experience of a Brazilian electronic voting machine, built with HTML, CSS, and vanilla JavaScript.

The project was created to study and demonstrate concepts such as:

Voting interfaces
Voting workflows
Candidate validation
Blank votes
Null votes
Data integrity
Hashing
Cryptography
Vote registration
Vote counting
Software architecture
Frontend security
Future PHP backend integration

IMPORTANT: this is an independent educational simulation. It does not reproduce the internal implementation of Brazil's official electronic voting system and has no official affiliation with the Brazilian Superior Electoral Court (TSE).

Overview

The user interacts with a simulated electronic voting machine through a virtual keyboard or their physical keyboard.

The main workflow is:

Voter
  │
  ▼
Enter candidate number
  │
  ▼
Identify candidate
  │
  ▼
Review vote
  │
  ▼
Confirm
  │
  ▼
Processing
  │
  ├── Validation
  │
  ├── Internal identification
  │
  ├── Integrity
  │
  ├── Demonstration encryption
  │
  └── Registration
  │
  ▼
Vote registered
  │
  ▼
Counting
Features
Voting

The simulation supports:

Candidate number input
Fictional candidate lookup
Candidate name
Party
Office
Fictional candidate photo
Vote review
Vote correction
Vote confirmation
Blank vote

The user can select:

BLANK

and confirm the blank vote.

Null vote

If an unknown candidate number is entered, the application presents a null-vote scenario.

The user can either correct the number or confirm the null vote.

Vote correction

The correction button clears the current vote and allows the user to start again.

Vote confirmation

After the vote is reviewed, the user can confirm it.

The application then starts the educational processing pipeline.

Processing Pipeline

The simulation visually presents several conceptual processing stages.

Input
 ↓
Validation
 ↓
Internal identification
 ↓
Integrity
 ↓
Encryption
 ↓
Registration
 ↓
Completed

Each stage is displayed through a dedicated card.

For example:

┌─────────────────────────────┐
│                             │
│      01 — INPUT             │
│                             │
│      Receiving vote...      │
│                             │
└─────────────────────────────┘

followed by:

┌─────────────────────────────┐
│                             │
│      02 — VALIDATION        │
│                             │
│      Valid number           │
│                             │
└─────────────────────────────┘

and so on.

Integrity Demonstration

The project can demonstrate the concept of data integrity using hashing.

Conceptually:

Vote data
   ↓
SHA-256
   ↓
Hash

If the underlying data changes:

Expected hash
      ≠
Calculated hash

the application can report:

INTEGRITY VIOLATED

This is a conceptual demonstration and is not intended to reproduce the official electoral system implementation.

Cryptography

When cryptographic operations are demonstrated in the browser, the project prefers native browser cryptographic capabilities such as:

Web Crypto API

The cryptographic implementation is educational and must not be interpreted as the actual cryptographic architecture of Brazil's electronic voting system.

The project does not treat Base64 encoding as encryption.

Project Structure
urna-eletronica/
│
├── index.html
│
├── css/
│   └── style.css
│
├── js/
│   └── app.js
│
├── assets/
│   └── ...
│
└── README.md
Technology

The project uses native web technologies:

HTML5
CSS3
JavaScript
Web Crypto API

No frontend framework is required.

The project does not use:

React
Vue
Angular
jQuery
Bootstrap
Tailwind
Axios
Architecture

The frontend is intentionally separated into three files:

HTML
 ↓
Structure

CSS
 ↓
Presentation

JavaScript
 ↓
Application logic

The project is also designed with a future PHP backend in mind.

The planned architecture is:

Frontend
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
Database
Future PHP Backend

A future version may replace the local JavaScript data with a PHP backend.

Conceptually:

Voting machine
      │
      ▼
PHP Controller
      │
      ▼
Vote Service
      │
      ├── Validate vote
      ├── Process record
      ├── Generate integrity data
      └── Protect data
      │
      ▼
Vote Repository
      │
      ▼
MySQL

The backend should never trust data coming from the browser.

Frontend validation should be considered a user-experience feature, not a security boundary.

Security Principles

The project demonstrates concepts such as:

Validation
Integrity
Hashing
Encryption
State management
Input handling
Separation of responsibilities

Secrets, passwords, tokens, and private cryptographic keys must never be hardcoded into frontend JavaScript.

Accessibility

The interface supports:

Keyboard navigation
Visible focus states
ARIA labels
aria-live
Semantic buttons
High readability
Reduced-motion preferences

Keyboard controls:

0-9       → Enter number
Enter     → Confirm
Backspace → Correct
Esc       → Correct
B         → Blank
Performance

The JavaScript architecture focuses on:

DOM reference caching
Minimal DOM manipulation
Avoiding duplicated event listeners
Controlled timers
Async operations where appropriate
Centralized application state
Protection against duplicate confirmations
Lightweight animations
Reduced-motion support
Responsive Design

The application is designed for:

Desktop
Laptop
Tablet
Mobile

The virtual keyboard remains usable on smaller screens.

Fictional Data

The simulation uses fictional candidates only.

It does not use:

Real candidates
Real political parties
Real election data
Voter IDs
CPF information
Personal voter information
Educational Disclaimer

This project is a software engineering and security learning experiment.

The processing pipeline shown by the application is intentionally simplified:

Input
 ↓
Validation
 ↓
Identification
 ↓
Integrity
 ↓
Encryption
 ↓
Registration

It should not be interpreted as a literal description of the internal implementation of Brazil's official electronic voting machines.

Possible Future Improvements
 PHP backend
 MySQL database
 Repository Pattern
 Service Layer
 REST API
 Election management
 Candidate management
 Server-side vote counting
 Audit records
 Integrity verification
 Security logging
 Automated tests
 Security tests
 Docker
 Production environment
License

This project is intended for educational and experimental purposes.

See the repository license file for information about usage, modification, and distribution.

Author

Developed as an experimental project for studying:

PHP • JavaScript • Security • Cryptography • Voting Systems • Software Architecture
