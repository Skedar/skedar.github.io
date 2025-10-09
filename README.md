## Luis "Skedar" Rizzi Portfolio and Resume

Contact-me on: skedar@pm.me 

CV | Portfolio: https://skedar.com.br

Personal Blog: https://skedarcorp.com

Game DevLog: https://gamedesigner.space

---
### Some Projects:

Diversão Educativa: https://diversaoeducativa.com.br

RAWR!! Pages: https://rawr.page

Dead Pirate Studios: https://deadpiratestudios.com

Shop: https://viralforge.com.br

Brand: https://necromantis.com.br

---

## O SITE AGORA ESTÁ HOSPEDADO EM UM NOVO SERVIDOR E DOMÍNIO, PORTANTO AQUI FICARÃO APENAS OS ARQUIVOS MARKDOWN E PORTFOLIO

### Nova URL: https://skedar.com.br 



Este site foi a minha segunda experiência com blog estático. sendo a primeira dela no [Game Designer Space](https://gamedesigner.space).

Enquanto no Devlog utilizei um sistema para automatizar a escrita e envios do markdown (TinaCMS), neste fiz tudo semi-automatico sem o uso de terceiros aplicando somente um GitHub Action para adicionar e remover arquivos de publicações MarkDown automaticamente sem eu precisar ficar editando a entrada.

### O que foi implementado
#### 1- Scripts/Indexação
* scripts/build-index.js:
  + Lê posts de dois jeitos:
  + Arquivo .md diretamente em content/posts/ → usa capa padrão assets/images/blog-post-img.jpg.
  + Pasta content/posts/<slug>/ contendo <slug>.md e opcionalmente a capa <slug>.(webp|jpg|jpeg|png) → vincula essa capa automaticamente.
  + Extrai do frontmatter: title, slug, date, categories, tags, author, excerpt, image.
  + Normaliza arrays e ordena por date (mais novos primeiro).
  + Atualiza content/posts/index.json refletindo adições e remoções (se um .md for removido, sai do index no próximo build).
#### 2- GitHub Actions
  * .github/workflows/build-index.yml executa em push quando:
    + .md é adicionado/alterado/removido
    + imagens dentro de content/posts/** mudam
    + o script de build muda
  * Roda node scripts/build-index.js e commita o index.json atualizado.
#### 3- Estrutura suportada
  * Simples (sem pasta):
	+ content/posts/hello-world.md → capa padrão assets/images/blog-post-img.jpg
  * Por pasta (recomendado):
	+ content/posts/meu-post/meu-post.md
	+ content/posts/meu-post/meu-post.webp (ou .jpg/.jpeg/.png)
	+ A capa é detectada e usada nos cards/listas.
#### 4- Manutenção automática
  * Adicionar post: subir o .md (e a capa). 
  	+ O workflow atualiza o index e o site reflete.
  * Remover post: remover o .md (ou a pasta). 
  	+ O workflow remove do index.
  	+ Tags, Arquivos e Listas: já consomem o index.json, então atualizam automaticamente.
  	
----

## NOVA ATUALIZAÇÃO

Com a migração do site para um servidor e domínio próprio, foi adicionado uma nova ação. 

Os arquivos aqui neste diretório são automaticamente enviados para o servidor via SSH.

Este repositório servirá como redirecionamento para o novo site e armazenamento dos arquivos markdown.

Att,

Luis "Skedar" Rizzi.