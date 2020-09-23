function fetchJson(url) {
    return fetch(url).then(resposta => resposta.json());
}

function formatarPreco(preco) {
    return preco.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
  }

const criarCardDeFilme = (filme) => {
        const filmesTopli = document.createElement("li");
        filmesTopli.style.backgroundImage = `url(${filme.poster_path})`;
      
        filmesTopli.innerHTML = `
          <div class="filtro"></div>
      
          <img class="estrela" src="estrela.png">
      
          <div class="titulo-nota">
            <h5>${filme.original_title}</h5>
            
            <div class="nota">
              <img src="estrela-dourada.png">
              <span>${filme.vote_average}</span>
            </div>
          </div>
    
          <button>Sacola ${formatarPreco(filme.price)}</button>
        `;
        return filmesTopli;
}
      
let filmesCarrinho = [];

fetchJson('https://tmdb-proxy-workers.vhfmag.workers.dev/3/discover/movie?language=pt-BR')
    .then(respostaJson => {

        const meusFilmes = respostaJson.results

        const filmesTop = document.querySelector('.conteiner-top')

         for (let i = 0; i < 5; i++) {
            const filmesTopli = criarCardDeFilme(meusFilmes[i]);
            filmesTop.append(filmesTopli);
         }

         listarfilmesCategorias(meusFilmes)

         const botoesSacola = document.querySelectorAll('li button')
         const texto = document.querySelector('.texto')
         const imagem = document.querySelector('.imagem img')

         for (let i = 0; i < botoesSacola.length; i++) {
            let botao = botoesSacola[i];
            console.log(botao)

            botao.addEventListener("click", () => {
              const filmeExiste = filmesCarrinho.filter((filme) => {
                return filme.id === meusFilmes[i].id;
              });
        
              if (filmeExiste.length > 0) {
                filmesCarrinho = filmesCarrinho.map((filme) => {
                  if (filme.id === meusFilmes[i].id) {
                    filme.qtd += 1;
                    return filme;
                  }
        
                  return filme;
                });
              } else {
                filmesCarrinho.push({
                  id: meusFilmes[i].id,
                  capa: meusFilmes[i].poster_path,
                  title: meusFilmes[i].title,
                  price: meusFilmes[i].price,
                  qtd: 1,
                });
              }
        
              if (texto.innerText.includes("vazia")) {
                texto.innerText = "";
                imagem.remove("img");
              }
        
              montarCarrinho();
            });
         }
         
    })




    const montarCarrinho = () => {
        const meioSacola = document.querySelector(".meio-sacola");
        meioSacola.innerHTML = "";
      
        filmesCarrinho.forEach((filme) => {
          const carrinho = document.createElement("div");
          carrinho.classList.add("carrinho");
      
          let imgCarrinho = document.createElement("img");
          imgCarrinho.setAttribute("src", filme.capa);
          const tituloDiv = document.createElement("div");
          tituloDiv.classList.add("titulo-preco");
          tituloDiv.innerHTML = ` <h6>${filme.title}</h6>
                           <span>${formatarPreco(filme.price)}</span>`;
          const quantidade = document.createElement("div");
          quantidade.classList.add("quantidade");
      
          const botaoAdd = document.createElement("img");
          botaoAdd.setAttribute("id", filme.id);
          botaoAdd.classList.add("adicionar");
          botaoAdd.src = "adicionar.png";
      
          const botaoRemove = document.createElement("img");
          botaoRemove.setAttribute("id", filme.id);
          botaoRemove.classList.add("deletar");
          botaoRemove.src = "deletar.png";
      
          const spanQtd = document.createElement("span");
          spanQtd.classList.add("contagem");
          spanQtd.innerText = filme.qtd;
      
          quantidade.append(botaoAdd, spanQtd, botaoRemove);
      
          carrinho.append(imgCarrinho, tituloDiv, quantidade);
          meioSacola.append(carrinho);
      
          botaoAdd.addEventListener("click", addItem);
          botaoRemove.addEventListener("click", removeItem);
        });
      };
      
      const addItem = (event) => {
        const id = Number(event.target.id);
        const carrinho = event.target.closest(".carrinho");
        const contagem = carrinho.querySelector(".contagem");
      
        contagem.innerText = Number(contagem.innerText) + 1;
      
        filmesCarrinho = filmesCarrinho.map((filme) => {
          if (filme.id === id) {
            filme.qtd += 1;
            return filme;
          }
      
          return filme;
        });
      };

const removeItem = (event) => {
    const id = Number(event.target.id);
    const carrinho = event.target.closest(".carrinho");
    const contagem = carrinho.querySelector(".contagem");

    contagem.innerText = Number(contagem.innerHTML) - 1

    
    filmesCarrinho = filmesCarrinho.map((filme, i) => {
            if(filme[i].id === id) {
                filme.qtd -= 1
                if(filme.qtd == 0) {
                return filmesCarrinho = filmesCarrinho.splice(filme[i], 1)
                }  
                
            }
        })
    

}

function listarfilmesCategorias(meusFilmes) {

    const categorias = document.querySelectorAll('.categorias  button');
    const filmes = document.querySelector('.conteiner-dez');

    const listarAcao = (meusFilmes) => {
        let meusfilmesAcao = meusFilmes.filter((x, i) => meusFilmes[i].genre_ids.includes(28));
        return meusfilmesAcao;
    };

    const listarRomance = (meusFilmes) => {
        let meusFilmesRomance = meusFilmes.filter((x, i) => meusFilmes[i].genre_ids.includes(10749));
        return meusFilmesRomance;
    };

    const listarFc = (meusFilmes) => {
        let meusFilmesFc = meusFilmes.filter((x, i) => meusFilmes[i].genre_ids.includes(878));
        return meusFilmesFc;
    };

    const listarTerror = (meusFilmes) => {
        let meusFilmesTerror = meusFilmes.filter((x, i) => meusFilmes[i].genre_ids.includes(27));
        return meusFilmesTerror;
    };

    for (const categoria of categorias) {
        categoria.addEventListener("click", () => {
            let filmesFiltrados;

            if (categoria.innerText === "Todos") {
                filmesFiltrados = meusFilmes;
            } else if (categoria.innerText === "Ação") {
                filmesFiltrados = listarAcao(meusFilmes);
            } else if (categoria.innerText === "Romance") {
                filmesFiltrados = listarRomance(meusFilmes);
            } else if (categoria.innerText === "Ficção Científica") {
                filmesFiltrados = listarFc(meusFilmes);
            } else if (categoria.innerText === "Terror") {
                filmesFiltrados = listarTerror(meusFilmes);
            }

            filmes.innerHTML = "";
            for (const filme of filmesFiltrados.slice(0, 10)) {
                filmes.append(criarCardDeFilme(filme));
            }
        });
    }

}

   
   

