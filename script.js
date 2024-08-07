import { typeColors, typeImages } from './scripts/typeMappings.js';
import { pokemonCardTemplate, typeTemplate, createDialogContent, generatePokedexDataHtml, evolutionStageTemplate, capitalizeFirstLetter } from './scripts/templates.js';
import { statsTemplate, calculateStatValues } from './scripts/statsTemplates.js';
import { fetchPokemonBatch, fetchPokemonData, fetchEvolutionData } from './scripts/api.js';


let allPokemon = [];
let filteredPokemon = [];
let offset = 0;
let limit = 10;


function showLoading(container) {
    let loadingContainer = document.getElementById('loading-container');
    if (!loadingContainer) return;

    container.style.opacity = '0.5';
    loadingContainer.style.display = 'flex';

    let buttons = document.querySelector('.buttons');
    if (buttons) {
        buttons.style.display = 'none';
    }
}


function hideLoading(container) {
    let loadingContainer = document.getElementById('loading-container');
    if (!loadingContainer) return;

    container.style.opacity = '1';
    loadingContainer.style.display = 'none';

    let buttons = document.querySelector('.buttons');
    if (buttons) {
        buttons.style.display = 'flex';
    }
}


function isPokemonInList(pokemon, list) {
    return list.some(p => p.id === pokemon.id);
}


function generatePokemonHtml(data, index) {
    let pokemonNumber = `#${data.id}`;
    let pokemonName = capitalizeFirstLetter(data.name);
    let pokemonTypes = data.types.map(typeInfo => typeInfo.type.name);
    let pokemonImage = data.sprites.front_default;
    let backgroundColor = typeColors[pokemonTypes[0]] || '#ffffff';

    let typesHtml = pokemonTypes.map(type => typeTemplate(type, typeImages[type])).join('');

    return pokemonCardTemplate(pokemonNumber, pokemonName, typesHtml, pokemonImage, backgroundColor, index);
}


function updateContainer(container, htmlContent, append = false) {
    if (append) {
        container.innerHTML += htmlContent;
    } else {
        container.innerHTML = htmlContent;
    }
    hideLoading(container);
    addCardClickEventListeners();
}


async function displayPokemonInfo(offset, limit, append = false) {
    let container = document.getElementById('pokemon-container');
    if (!container) return;

    showLoading(container);

    let pokemonData = await fetchAndStorePokemonData(offset, limit);
    if (pokemonData.length === 0) {
        hideLoading(container);
        return;
    }

    updatePokemonDisplay(container, offset, limit, append);

    hideLoading(container);
}


async function fetchAndStorePokemonData(offset, limit) {
    let pokemonData = await fetchPokemonBatch(offset, limit);
    pokemonData.forEach(pokemon => {
        if (!isPokemonInList(pokemon, allPokemon)) {
            allPokemon.push(pokemon);
        }
    });
    return pokemonData;
}


function updatePokemonDisplay(container, offset, limit, append = false) {
    let pokemonToDisplay = filteredPokemon.length > 0 ? filteredPokemon : allPokemon;
    let pokemonDataArray = pokemonToDisplay.slice(offset, offset + limit);
    let allPokemonHtml = pokemonDataArray.map((data, i) => data ? generatePokemonHtml(data, offset + i) : '').join('');
    updateContainer(container, allPokemonHtml, append);
    updatePaginationButtons(offset, limit);
}


function updatePaginationButtons(offset, limit) {
    let prevPageBtn = document.getElementById('prev-page-btn');
    let loadMoreBtn = document.getElementById('load-more-btn');
    prevPageBtn.disabled = offset === 0;
    loadMoreBtn.disabled = allPokemon.length < limit;
}


async function filterByName(name) {
    let container = document.getElementById('pokemon-container');
    if (!container) return;

    showLoading(container);

    filteredPokemon = filterPokemonByName(name);
    offset = 0;

    if (filteredPokemon.length === 0) {
        updateContainer(container, '');
    } else {
        updatePokemonDisplay(container, offset, limit);
    }

    hideLoading(container);
}


function filterPokemonByName(name) {
    return allPokemon.filter(pokemon => pokemon.name.toLowerCase().includes(name.toLowerCase()));
}


async function applyFilter(type) {
    let container = document.getElementById('pokemon-container');
    if (!container) return;

    showLoading(container);

    filteredPokemon = filterPokemonByType(type);
    offset = 0;
    updatePokemonDisplay(container, offset, limit);

    hideLoading(container);
}


function filterPokemonByType(type) {
    return type === 'all' ? [] : allPokemon.filter(pokemon => pokemon.types.some(typeInfo => typeInfo.type.name === type));
}

async function handlePrevPage() {
    if (offset > 0) {
        offset -= limit;
        await displayPokemonInfo(offset, limit);
    }
}


async function handleNextPage() {
    offset += limit;
    await displayPokemonInfo(offset, limit);
}


function generateEvolutionHtml(evolutionChain) {
    let evolutionHtml = '<h4>Evolution Chain</h4>';
    let current = evolutionChain.chain;

    while (current) {
        evolutionHtml += evolutionStageTemplate(current.species.url, current.species.name);
        current = current.evolves_to[0];
    }

    return evolutionHtml;
}


function getIdFromUrl(url) {
    let parts = url.split('/');
    return parts[parts.length - 2];
}


async function displayEvolutionData(pokemonSpeciesUrl) {
    let evolutionData = await fetchEvolutionData(pokemonSpeciesUrl);
    if (!evolutionData) return;

    document.getElementById('data-container').innerHTML = generateEvolutionHtml(evolutionData);
}


function setDialogEventListeners(pokemonData) {
    let setContent = (content) => document.getElementById('data-container').innerHTML = content;

    document.getElementById('about-btn').addEventListener('click', () =>
        setContent(generatePokedexDataHtml(pokemonData, pokemonData.types.map(typeInfo => typeInfo.type.name)))
    );

    document.getElementById('stats-btn').addEventListener('click', () =>
        displayStatsData(pokemonData.stats)
    );

    document.getElementById('evolution-btn').addEventListener('click', async () => {
        let evolutionData = await fetchEvolutionData(pokemonData.species.url);
        if (evolutionData) {
            setContent(generateEvolutionHtml(evolutionData));
        }
    });
}


function openDialog(index) {
    let pokemonData = filteredPokemon.length > 0 ? filteredPokemon[index] : allPokemon[index];
    if (!pokemonData) return;

    let pokemonTypes = pokemonData.types.map(typeInfo => typeInfo.type.name);

    let dialogElement = document.getElementById('dialog');
    dialogElement.dataset.index = index;
    document.getElementById('dialog').classList.remove('d-none');

    let pokemonName = capitalizeFirstLetter(pokemonData.name);
    document.getElementById('dialog-message').innerHTML = createDialogContent(pokemonData, pokemonTypes, typeColors, generatePokedexDataHtml, pokemonName);

    setDialogEventListeners(pokemonData);
    updateArrowVisibility(index);
}


function displayStatsData(stats) {
    let statValues = calculateStatValues(stats);

    if (!statValues) return;
    let html = statsTemplate(statValues, statValues.maxStatValue);

    document.getElementById('data-container').innerHTML = html;
}


function closeDialog() {
    let dialogElement = document.getElementById('dialog');
    dialogElement.classList.add('dialog-closing');

    setTimeout(() => {
        dialogElement.classList.add('d-none');
        dialogElement.classList.remove('dialog-closing');
    }, 500);
}


function addCardClickEventListeners() {
    let cards = document.querySelectorAll('.pokemon-card');
    for (let i = 0; i < cards.length; i++) {
        cards[i].addEventListener('click', function () {
            let index = cards[i].dataset.index;
            openDialog(index);
        });
    }
}


async function init() {
    await initializePokemonDisplay();
    setupEventListeners();
    setupArrowEventListeners();
}


async function initializePokemonDisplay() {
    await displayPokemonInfo(offset, limit);
}


function setupEventListeners() {
    setupLoadMoreButton();
    setupPrevPageButton();
    setupSearchNameInput();
    setupTypeLinks();
    setupDialogClose();
}


function setupLoadMoreButton() {
    let loadMoreBtn = document.getElementById('load-more-btn');
    loadMoreBtn.addEventListener('click', async () => {
        offset += limit;
        await displayPokemonInfo(offset, limit, true);
    });
}


function setupPrevPageButton() {
    let prevPageBtn = document.getElementById('prev-page-btn');
    prevPageBtn.addEventListener('click', handlePrevPage);
}


function setupSearchNameInput() {
    let searchName = document.getElementById('search-name');
    searchName.addEventListener('input', async (e) => {
        let searchTerm = e.target.value.trim();
        if (searchTerm.length >= 3) {
            await filterByName(searchTerm);
        } else {
            resetSearch();
        }
    });
}


function resetSearch() {
    filteredPokemon = [];
    offset = 0;
    displayPokemonInfo(offset, limit);
}


function setupTypeLinks() {
    let typeLinks = document.querySelectorAll('.types-bar a');
    typeLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            let type = link.getAttribute('data-type');
            applyFilter(type);
        });
    });
}


function setupDialogClose() {
    let dialog = document.getElementById('dialog');
    dialog.addEventListener('click', (e) => {
        if (e.target.classList.contains('dialog-bg') || e.target.id === 'close-dialog-btn') {
            closeDialog();
        }
    });
}


function setupArrowEventListeners() {
    document.querySelector('.arrow-left').addEventListener('click', () => changePokemon(-1));
    document.querySelector('.arrow-right').addEventListener('click', () => changePokemon(1));
}


function changePokemon(direction) {
    let currentPokemonData = filteredPokemon.length > 0 ? filteredPokemon : allPokemon;
    let currentIndex = parseInt(document.getElementById('dialog').dataset.index, 10);

    let newIndex = currentIndex + direction;

    if (newIndex < 0 || newIndex >= currentPokemonData.length) return;

    openDialog(newIndex);
}


function updateArrowVisibility(index) {
    let arrowLeft = document.getElementById('arrow-left');
    let arrowRight = document.getElementById('arrow-right');
    let pokemonList = filteredPokemon.length > 0 ? filteredPokemon : allPokemon;

    arrowLeft.style.display = index <= 0 ? 'none' : 'block';
    arrowRight.style.display = index >= pokemonList.length - 1 ? 'none' : 'block';
}


document.addEventListener('DOMContentLoaded', init);
