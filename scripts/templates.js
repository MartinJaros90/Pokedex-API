export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}


export function pokemonCardTemplate(pokemonNumber, pokemonName, typesHtml, pokemonImage, backgroundColor, index) {
    return `
        <div class="pokemon-card" data-index="${index}" style="background-color: ${backgroundColor};">
            <div class="id-number">
                <span>${pokemonNumber}</span>
                <span>${pokemonName}</span>
            </div>
            <div>
                ${typesHtml}
            </div>
            <div>
                <img class="pokemon-image" src="${pokemonImage}" alt="${pokemonName}">
            </div>
        </div>
    `;
}


export function typeTemplate(type, typeImage) {
    return `
        <div class="types">
            <img src="${typeImage}" alt="${type}" class="type-icon">
            <span>${type}</span>
        </div>
    `;
}


export function createDialogContent(pokemonData, pokemonTypes, typeColors, generatePokedexDataHtml, pokemonName) {
    let bgColor = typeColors[pokemonTypes[0]] || '#ffffff';
    return `
        <div class="current-pokemon" style="background-color: ${bgColor};">
            <h1>
                <img class="pokeball-dialog" src="./assets/img/pokeball-img.png" alt="">
                Details for Pokémon
                <img class="pokeball-dialog" src="./assets/img/pokeball-img.png" alt="">
            </h1>
            <h2>#${pokemonData.id} ${pokemonName}</h2>
            <img src="${pokemonData.sprites.front_default}" alt="${pokemonName}">
            <div class="dialog-btns">
                <button id="about-btn">About</button>
                <button id="stats-btn">Stats</button>
                <button id="evolution-btn">Evolution</button>
            </div>
        </div>
        <div id="data-container" class="data-container">
            ${generatePokedexDataHtml(pokemonData, pokemonTypes)}
        </div>
    `;
}


export function generatePokedexDataHtml(pokemonData, pokemonTypes) {
    return `
        <h4>Pokédex Data</h4>
        <table>
            <tr>
                <td class="category">Height</td>
                <td class="stats-number">${pokemonData.height}m</td>
            </tr>
            <tr>
                <td class="category">Weight</td>
                <td class="stats-number">${pokemonData.weight}kg</td>
            </tr>
            <tr>
                <td class="category">Abilities</td>
                <td class="stats-number">${pokemonData.abilities.map(function (abilityInfo) {
                    return abilityInfo.ability.name;
                }).join(', ')}</td>
            </tr>
            <tr>
                <td class="category">Types</td>
                <td class="stats-number">${pokemonTypes.join(', ')}</td>
            </tr>
        </table>
    `;
}


export function evolutionStageTemplate(speciesUrl, speciesName) {
    return `
        <div class="evolution-stage">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getIdFromUrl(speciesUrl)}.png" alt="${capitalizeFirstLetter(speciesName)}">
            <span>${capitalizeFirstLetter(speciesName)}</span>
        </div>`;
}


function getIdFromUrl(url) {
    let parts = url.split('/');
    return parts[parts.length - 2];
}
