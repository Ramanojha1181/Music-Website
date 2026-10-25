
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const results = document.getElementById("results");

async function searchMusic() {
    const query = searchInput.value.trim();

    if (!query) {
        results.textContent = "Please enter a song or artist name.";
        return;
    }

    results.innerHTML = "<p>Searching songs...</p>";
    searchBtn.disabled = true;

    try {
        const apiUrl =
            `https://proxy.cors.dev/https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=12`;

        const response = await fetch(apiUrl, {
            credentials: "omit"
        });

        if (!response.ok) {
            throw new Error("Unable to fetch songs. Please try again.");
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message || "Deezer API error.");
        }

        if (!data.data || data.data.length === 0) {
            results.innerHTML = "<p>No songs found. Try another search.</p>";
            return;
        }

        results.innerHTML = "";

        data.data.forEach(song => {
            const card = document.createElement("div");
            card.className = "song-card";

            const image = document.createElement("img");
            image.src = song.album.cover_medium;
            image.alt = `${song.album.title} album cover`;
            image.loading = "lazy";

            const title = document.createElement("h3");
            title.textContent = song.title;

            const artist = document.createElement("p");
            artist.textContent = song.artist.name;

            const album = document.createElement("p");
            album.textContent = song.album.title;

            const audio = document.createElement("audio");
            audio.controls = true;
            audio.preload = "none";

            if (song.preview) {
                audio.src = song.preview;
            } else {
                audio.hidden = true;
            }

            const link = document.createElement("a");
            link.href = song.link;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = "Open in Deezer";

            card.append(image, title, artist, album);

            if (song.preview) {
                card.appendChild(audio);
            } else {
                const message = document.createElement("p");
                message.textContent = "Preview unavailable";
                card.appendChild(message);
            }

            card.appendChild(link);
            results.appendChild(card);
        });

    } catch (error) {
        console.error("Search error:", error);
        results.textContent =
            error.message + " If the request is blocked, check the CORS proxy.";
    } finally {
        searchBtn.disabled = false;
    }
}

// Button click
searchBtn.addEventListener("click", searchMusic);

// Enter key se bhi search hoga
searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        searchMusic();
    }
});
