export function statsTemplate(statValues, maxStatValue) {
    return `
        <div class="stats-container">
            <h4>Base Stats</h4>
            <table>
                <tr>
                    <td class="category">HP</td>
                    <td class="stats-number">${statValues.hp}</td>
                    <td class="progress-bar">
                        <div class="bar" style="width: ${statValues.hp / maxStatValue * 100}%;"></div>
                    </td>
                </tr>
                <tr>
                    <td class="category">Attack</td>
                    <td class="stats-number">${statValues.attack}</td>
                    <td class="progress-bar">
                        <div class="bar" style="width: ${statValues.attack / maxStatValue * 100}%;"></div>
                    </td>
                </tr>
                <tr>
                    <td class="category">Defense</td>
                    <td class="stats-number">${statValues.defense}</td>
                    <td class="progress-bar">
                        <div class="bar" style="width: ${statValues.defense / maxStatValue * 100}%;"></div>
                    </td>
                </tr>
                <tr>
                    <td class="category">Special Attack</td>
                    <td class="stats-number">${statValues.specialAttack}</td>
                    <td class="progress-bar">
                        <div class="bar" style="width: ${statValues.specialAttack / maxStatValue * 100}%;"></div>
                    </td>
                </tr>
                <tr>
                    <td class="category">Special Defense</td>
                    <td class="stats-number">${statValues.specialDefense}</td>
                    <td class="progress-bar">
                        <div class="bar" style="width: ${statValues.specialDefense / maxStatValue * 100}%;"></div>
                    </td>
                </tr>
                <tr>
                    <td class="category">Speed</td>
                    <td class="stats-number">${statValues.speed}</td>
                    <td class="progress-bar">
                        <div class="bar" style="width: ${statValues.speed / maxStatValue * 100}%;"></div>
                    </td>
                </tr>
                <tr>
                    <td class="category">Total</td>
                    <td class="stats-number">${statValues.total}</td>
                    <td class="progress-bar">
                        <div class="bar" style="width: ${statValues.total / (maxStatValue * 6) * 100}%;"></div>
                    </td>
                </tr>
            </table>
        </div>
    `;
}


export function calculateStatValues(stats) {
    if (!stats) {
        console.error('Stats data not found');
        return null;
    }

    let maxStatValue = 255; // Setze den Maximalwert für Stats (abhängig vom Spiel/Region kann variieren)
    
    let result = {
        hp: 0,
        attack: 0,
        defense: 0,
        specialAttack: 0,
        specialDefense: 0,
        speed: 0,
        total: 0,
        maxStatValue: maxStatValue
    };

    for (let i = 0; i < stats.length; i++) {
        let stat = stats[i].stat.name;
        let baseStat = stats[i].base_stat || 0;

        if (stat === 'hp') result.hp = baseStat;
        if (stat === 'attack') result.attack = baseStat;
        if (stat === 'defense') result.defense = baseStat;
        if (stat === 'special-attack') result.specialAttack = baseStat;
        if (stat === 'special-defense') result.specialDefense = baseStat;
        if (stat === 'speed') result.speed = baseStat;

        result.total += baseStat;
    }

    return result;
}
