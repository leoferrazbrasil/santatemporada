/* ==========================================================================
   Santa Temporada - Main Application Logic & Data Engine
   ========================================================================== */

// Mock Database of Initial Santa Catarina Partner Offers
const OFFERS_DATA = [
    {
        id: "st-01",
        title: "Sequência de Camarão Completa à Beira-Mar (Para 2 Pessoas)",
        city: "floripa",
        location: "Florianópolis • Lagoa da Conceição",
        category: "gastronomia",
        image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80",
        oldPrice: 220.00,
        newPrice: 139.90,
        discountPercent: 36,
        rating: 4.9,
        reviewsCount: 184,
        popular: true,
        whatsappText: "Olá! Quero resgatar o cupom da Sequência de Camarão Completa em Floripa (R$ 139,90)."
    },
    {
        id: "st-02",
        title: "Passeio de Escuna Ilha de Anhatomirim + Almoço Frutos do Mar",
        city: "floripa",
        location: "Florianópolis • Canasvieiras",
        category: "passeios",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
        oldPrice: 180.00,
        newPrice: 119.90,
        discountPercent: 33,
        rating: 5.0,
        reviewsCount: 240,
        popular: true,
        whatsappText: "Olá! Quero resgatar o Passeio de Escuna Ilha de Anhatomirim em Floripa (R$ 119,90)."
    },
    {
        id: "st-03",
        title: "Diária em Suíte Vista Mar Pé na Areia com Café da Manhã",
        city: "garopaba",
        location: "Garopaba • Praia do Silveira",
        category: "pousadas",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
        oldPrice: 450.00,
        newPrice: 290.00,
        discountPercent: 35,
        rating: 4.9,
        reviewsCount: 96,
        popular: true,
        whatsappText: "Olá! Quero verificar disponibilidade e resgatar a diária na Pousada em Garopaba (R$ 290,00)."
    },
    {
        id: "st-04",
        title: "Day Pass Beach Club + Welcome Drink Exclusivo VIP",
        city: "bc",
        location: "Balneário Camboriú • Praia dos Amores",
        category: "beachclubs",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
        oldPrice: 150.00,
        newPrice: 89.90,
        discountPercent: 40,
        rating: 4.8,
        reviewsCount: 128,
        popular: false,
        whatsappText: "Olá! Quero resgatar o Day Pass Beach Club em Balneário Camboriú (R$ 89,90)."
    },
    {
        id: "st-05",
        title: "Mergulho de Batismo Guiado com Fotos Subaquáticas",
        city: "bombinhas",
        location: "Bombinhas • Praia da Sepultura",
        category: "passeios",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
        oldPrice: 280.00,
        newPrice: 189.90,
        discountPercent: 32,
        rating: 5.0,
        reviewsCount: 310,
        popular: true,
        whatsappText: "Olá! Quero agendar o Mergulho de Batismo em Bombinhas (R$ 189,90)."
    },
    {
        id: "st-06",
        title: "Parrilla Uruguaia & Frutos do Mar Grelhados",
        city: "bc",
        location: "Balneário Camboriú • Barra Sul",
        category: "gastronomia",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
        oldPrice: 190.00,
        newPrice: 114.90,
        discountPercent: 40,
        rating: 4.9,
        reviewsCount: 88,
        popular: false,
        whatsappText: "Olá! Quero resgatar o cupom da Parrilla Uruguaia em Balneário Camboriú (R$ 114,90)."
    }
];

// App State
let currentCategory = "all";
let currentCity = "floripa";
let searchQuery = "";
let currentSort = "popular";

// DOM Loaded Initialization
document.addEventListener("DOMContentLoaded", () => {
    initEvents();
    renderOffers();
    initQRCode();
});

function initQRCode() {
    const qrContainer = document.getElementById("qrcodeCanvas");
    if (qrContainer && typeof QRCode !== "undefined") {
        qrContainer.innerHTML = "";
        new QRCode(qrContainer, {
            text: "https://whatsapp.com/channel/0029Vb8s3tz6GcGL6bBy2w45",
            width: 150,
            height: 150,
            colorDark: "#1D1222",
            colorLight: "#FFFFFF",
            correctLevel: QRCode.CorrectLevel.H
        });
    }
}

function initEvents() {
    initMobileMenu();

    // Category pill click handler
    const pills = document.querySelectorAll(".cat-pill");
    pills.forEach(pill => {
        pill.addEventListener("click", (e) => {
            pills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            currentCategory = pill.getAttribute("data-cat");
            renderOffers();
        });
    });

    // City selector change
    const citySelect = document.getElementById("citySelect");
    citySelect.addEventListener("change", (e) => {
        currentCity = e.target.value;
        renderOffers();
    });

    // Search input typing
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderOffers();
    });
}

function filterOffers() {
    renderOffers();
}

function sortOffers() {
    currentSort = document.getElementById("sortSelect").value;
    renderOffers();
}

function renderOffers() {
    const grid = document.getElementById("offersGrid");
    
    // Filter
    let filtered = OFFERS_DATA.filter(item => {
        const matchCategory = (currentCategory === "all") || (item.category === currentCategory);
        const matchCity = (currentCity === "all") || (item.city === currentCity);
        const matchSearch = searchQuery === "" || 
            item.title.toLowerCase().includes(searchQuery) || 
            item.location.toLowerCase().includes(searchQuery);
        
        return matchCategory && matchCity && matchSearch;
    });

    // Sort
    if (currentSort === "popular") {
        filtered.sort((a, b) => b.reviewsCount - a.reviewsCount);
    } else if (currentSort === "discount") {
        filtered.sort((a, b) => b.discountPercent - a.discountPercent);
    } else if (currentSort === "price-low") {
        filtered.sort((a, b) => a.newPrice - b.newPrice);
    }

    // Render HTML
    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
                <i class="fa-solid fa-umbrella-beach" style="font-size: 3rem; margin-bottom: 16px; color: var(--primary);"></i>
                <h3>Nenhuma experiência encontrada nesta praia</h3>
                <p>Tente mudar a praia ou a busca para ver mais ofertas em Santa Catarina.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(item => `
        <div class="offer-card">
            <div class="card-img-wrapper">
                <img src="${item.image}" alt="${item.title}" class="card-img" loading="lazy">
                <span class="card-badge">-${item.discountPercent}% OFF</span>
                <span class="card-badge-vip"><i class="fa-solid fa-crown"></i> SC VIP</span>
            </div>
            <div class="card-body">
                <div class="card-location">
                    <i class="fa-solid fa-location-dot"></i> ${item.location}
                </div>
                <h3 class="card-title">${item.title}</h3>
                <div class="card-desc">⭐ ${item.rating} (${item.reviewsCount} avaliações) • Resgate imediato</div>
                
                <div class="card-price-row">
                    <div>
                        <span class="price-old">De R$ ${item.oldPrice.toFixed(2).replace('.', ',')}</span> <br>
                        <span class="price-new">R$ ${item.newPrice.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>

                <a href="https://whatsapp.com/channel/0029Vb8s3tz6GcGL6bBy2w45" 
                   target="_blank" 
                   class="btn btn-card-resgate">
                    <i class="fa-brands fa-whatsapp"></i> Ver no Canal do WhatsApp
                </a>
            </div>
        </div>
    `).join("");
}

function initMobileMenu() {
    const toggleBtn = document.getElementById("mobileMenuToggle");
    const navMenu = document.getElementById("navMenu");
    
    if (!toggleBtn || !navMenu) return;

    toggleBtn.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("open");
        toggleBtn.classList.toggle("active", isOpen);
        toggleBtn.setAttribute("aria-expanded", isOpen);
    });

    document.addEventListener("click", (e) => {
        if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target) && navMenu.classList.contains("open")) {
            navMenu.classList.remove("open");
            toggleBtn.classList.remove("active");
            toggleBtn.setAttribute("aria-expanded", "false");
        }
    });
}
