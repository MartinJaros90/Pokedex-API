export async function fetchPokemonBatch(offset = 0, limit = 20) {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const { results } = await response.json();
        const allPokemon = await Promise.all(results.map(pokemon => fetchPokemonData(pokemon.url)));
        
        return allPokemon.filter(Boolean); 
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return [];
    }
}



export async function fetchPokemonData(pokemonUrl) {
    try {
        let response = await fetch(pokemonUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let pokemonData = await response.json();
        return pokemonData;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return null;
    }
}


export async function fetchEvolutionData(pokemonSpeciesUrl) {
    try {
        let response = await fetch(pokemonSpeciesUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let pokemonSpeciesData = await response.json();
        let evolutionChainUrl = pokemonSpeciesData.evolution_chain.url;

        response = await fetch(evolutionChainUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        let evolutionChainData = await response.json();
        return evolutionChainData;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return null;
    }
}
