document.addEventListener('DOMContentLoaded', () => {
    // Gestione Notizie (solo se siamo sulla homepage)
    const newsContainer = document.getElementById('news-container');
    const newsFilterInput = document.getElementById('news-filter');

    let allNews = []; // Per conservare tutte le notizie caricate

    if (newsContainer && newsFilterInput) {
        fetchNews();

        newsFilterInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterNews(searchTerm);
        });
    }

    async function fetchNews() {
        try {
            const response = await fetch('data/news.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allNews = await response.json();
            displayNews(allNews);
        } catch (error) {
            console.error("Errore nel caricamento delle notizie:", error);
            newsContainer.innerHTML = "<p>Impossibile caricare le notizie al momento.</p>";
        }
    }

    function displayNews(newsArray) {
        newsContainer.innerHTML = ''; // Pulisce il contenitore
        if (newsArray.length === 0) {
            newsContainer.innerHTML = "<p>Nessuna notizia trovata.</p>";
            return;
        }
        newsArray.forEach(news => {
            const newsItemDiv = document.createElement('div');
            newsItemDiv.classList.add('news-item');
            newsItemDiv.innerHTML = `
                <h4>${news.titolo}</h4>
                <p class="date">Data: ${new Date(news.data).toLocaleDateString('it-IT')}</p>
                <p class="tag">Tag: <span>${news.tag}</span></p>
                <p>${news.descrizione}</p>
            `;
            newsContainer.appendChild(newsItemDiv);
        });
    }

    function filterNews(searchTerm) {
        const filteredNews = allNews.filter(news => 
            news.tag.toLowerCase().includes(searchTerm) || 
            news.titolo.toLowerCase().includes(searchTerm) ||
            news.descrizione.toLowerCase().includes(searchTerm)
        );
        displayNews(filteredNews);
    }

    // Gestione Prodotti (per le pagine dei prodotti)
    const productGallery = document.getElementById('product-gallery');
    if (productGallery) {
        const category = productGallery.dataset.category;
        if (category) {
            loadProducts(category);
        }
    }

    async function loadProducts(categoryKey) {
        try {
            const response = await fetch('data/products.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const allProductsData = await response.json();
            const categoryProducts = allProductsData[categoryKey];

            if (categoryProducts && categoryProducts.length > 0) {
                displayProducts(categoryProducts);
            } else {
                productGallery.innerHTML = "<p>Nessun prodotto trovato in questa categoria.</p>";
            }
        } catch (error) {
            console.error(`Errore nel caricamento dei prodotti per la categoria ${categoryKey}:`, error);
            productGallery.innerHTML = "<p>Impossibile caricare i prodotti al momento.</p>";
        }
    }

    function displayProducts(productsArray) {
        productGallery.innerHTML = ''; // Pulisce la galleria
        productsArray.forEach(product => {
            const productItemDiv = document.createElement('div');
            productItemDiv.classList.add('product-item');

            // Gestisce sia URL che percorsi locali per le immagini
            let imagePath = product.immagine;
            if (!imagePath.startsWith('http://') && !imagePath.startsWith('https://')) {
                // Assumiamo che sia un percorso locale relativo alla cartella 'images'
                // Se 'images/' non è già nel percorso, lo aggiungiamo.
                // Questo è un esempio base, potrebbe necessitare di logica più robusta
                // a seconda di come sono strutturati i percorsi in products.json
            }

            productItemDiv.innerHTML = `
                <img src="${imagePath}" alt="${product.Testo}" onerror="this.onerror=null;this.src='images/placeholder.png';">
                <h3>${product.Testo}</h3>
                <p>${product.descrizione}</p>
                <p class="price">${product.prezzo}</p>
                ${product.tag ? `<p class="tag">Tag: <span>${product.tag}</span></p>` : ''}
            `;
            // L'attributo onerror nell'img fa sì che se l'immagine non viene trovata,
            // viene mostrata un'immagine placeholder.
            productGallery.appendChild(productItemDiv);
        });
    }
});