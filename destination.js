const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function loadMovie() {
    const apiKey = "1a34f58c1b1142fcf1b2d04310fa821b";

    try {


        const [movieRes, releaseRes, creditsRes] = await Promise.all([
            fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`),
            fetch(`https://api.themoviedb.org/3/movie/${id}/release_dates?api_key=${apiKey}`),
            fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`)
        ]);

        const movie = await movieRes.json();
        const releaseData = await releaseRes.json();
        const credits = await creditsRes.json();


        let rating = "N/A";
        const usRelease = releaseData.results.find(r => r.iso_3166_1 === "US");

        if (usRelease && usRelease.release_dates.length > 0) {
            rating = usRelease.release_dates[0].certification || "N/A";
        }


        const genres = movie.genres.map(g => g.name).join(", ");


        const castHTML = credits.cast
            .slice(0, 5)
            .map(actor => {

                const img = actor.profile_path
                    ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                    : "placeholder.jpg";

                return `
        <div class="actor">
            <img src="${img}" alt="${actor.name}">
            <p>${actor.name}</p>
        </div>
        `;
            })
            .join("");


        const listitem = document.createElement("div");

        listitem.innerHTML = `
        <div class="items">
            <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}">
            <h2>${movie.title}</h2>
            <p><i class="fa-solid fa-star"></i> ${movie.vote_average.toFixed(1)}/10 IMDb</p>
            <p>${genres}</p>
            <p>${movie.runtime} min</p>
            <p>${movie.original_language}</p>
            <p>Age rating: ${rating}</p>
            <p>${movie.overview}</p>
            <h3>Cast</h3>
    <div class="cast">
        ${castHTML}
    </div>
        </div>
        `;

        document.body.appendChild(listitem);

    } catch (error) {
        console.error("Error loading movie:", error);
    }
}

loadMovie();