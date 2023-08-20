# Typerio (deprecated)

Bem-vindo à primeira versão do Typer! Esta é uma plataforma de chatting dinâmica desenvolvida com o uso de Next.js, websockets e Express.

## Features

- 🔥 Comunicação em tempo real através de websockets, garantindo atualizações instantâneas. 
- ✨ Interface amigável com estética neobrutalista para uma experiência visual única. 
- 🌊 Experiência do usuário fluida e interativa com elementos arrastáveis.
- 🌐 Navegação com sistema de roteamento do Next.js 13.3.

## Stack Utilizada
- Typescript
- Next.js 13.3
- Express
- Socket.io
- Tailwind
- Prisma ORM
- NextAuth

## Setup

1. Clone este repositório em sua máquina.
2. Instale as dependências
    - Do server `cd server & npm install`
    - Do client `cd ../server & npm install`
3. Configure seu `.env`
    - No server `DATABASE_URL=********`
    - No client
```env
NEXTAUTH_SECRET=********

# Para auth com Github https://next-auth.js.org/providers/github
GITHUB_ID=********
GITHUB_SECRET=********

# Para auth com Google https://next-auth.js.org/providers/google
GOOGLE_ID=********
GOOGLE_SECRET=********

# Spotify docs https://developer.spotify.com/documentation/web-api
SPOTIFY_ID=********
SPOTIFY_SECRET=********
```

4. Inicie os servidores de desenvolvimento
	- Do server `cd server & npm run dev`
	- Do client `cd client & npm run dev`

## Problemas

Se você encontrar problemas ou bugs nesta versão, honestamente é de se esperar, porém infelizmente não serão corrigidos </3.
