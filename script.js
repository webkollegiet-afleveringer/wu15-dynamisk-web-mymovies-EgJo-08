const listElement = document.querySelector("#movieList");
const normlistElement = document.querySelector("#normal_list");
const popularlistElement = document.querySelector("#popular_list");

let genreMap = {};


fetch("https://api.themoviedb.org/3/genre/movie/list?api_key=1a34f58c1b1142fcf1b2d04310fa821b")
    .then(res => res.json())
    .then(data => {

        data.genres.forEach(genre => {
            genreMap[genre.id] = genre.name;
        });

        loadMovies();
    });

function loadMovies() {

    fetch("https://api.themoviedb.org/3/movie/popular?api_key=1a34f58c1b1142fcf1b2d04310fa821b")
        .then(res => res.json())
        .then(data => {


            data.results.forEach(movies => {

                const id = movies.id;
                const listitem = document.createElement("div");

                listitem.innerHTML = `
        <div class="items">
        <a href="destination.html?id=${id}">
        <img src="https://image.tmdb.org/t/p/w200${movies.poster_path}">
            <h2>${movies.title}</h2>
            <p><i class="fa-solid fa-star"></i>${movies.vote_average.toFixed(1)}/10 imDb</p>
        </a>
        </div>
        `;

                normlistElement.appendChild(listitem);

            });


            data.results
                .sort((a, b) => b.popularity - a.popularity)
                .forEach(movies => {

                    const id = movies.id;

                    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=1a34f58c1b1142fcf1b2d04310fa821b`)
                        .then(res => res.json())
                        .then(details => {

                            const runtime = details.runtime;

                            const genres = movies.genre_ids
                                .map(id => genreMap[id])
                                .join(", ");

                            const listitem = document.createElement("div");

                            listitem.innerHTML = `
        <div class="items_popular">
        <a href="destination.html?id=${id}">
        <img src="https://image.tmdb.org/t/p/w200${movies.poster_path}">
            <h2>${movies.title}</h2>
            <p><i class="fa-solid fa-star"></i>${movies.vote_average.toFixed(1)}/10 imDb</p>
            <p>${genres}</p>
            <p><i class="fa-regular fa-clock"></i>${runtime} min</p>
        </a>
        </div>
        `;

                            popularlistElement.appendChild(listitem);

                        });

                });

        });
}