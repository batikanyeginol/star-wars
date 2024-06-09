document.getElementById('toggleButton').addEventListener('click', toggleCharacters);

let homeworlds = [];

function toggleCharacters() {
    const container = document.getElementById('characterContainer');
    const button = document.getElementById('toggleButton');
    const filtersContainer = document.getElementById('filtersContainer');

    if (container.innerHTML === '') {
        fetchCharacters()
            .then(characters => {
                homeworlds = getUniqueHomeworlds(characters);
                renderFilters(homeworlds);
                renderCharacters(container, characters);
                button.innerHTML = 'Karakterleri Gizle';
                button.classList.remove('btn-success');
                button.classList.add('btn-danger');
                filtersContainer.style.display = 'flex'; // Filtreleri göster
            })
            .catch(error => {
                console.error('Error fetching characters:', error);
            });
    } else {
        container.innerHTML = '';
        button.innerHTML = 'Karakterleri Göster';
        button.classList.remove('btn-danger');
        button.classList.add('btn-success');
        filtersContainer.style.display = 'none'; // Filtreleri gizle
    }
}

async function fetchCharacters() {
    const response = await fetch('https://raw.githubusercontent.com/WildCodeSchool/starwars-api/master/db.json');
    const data = await response.json();
    return data.characters;
}

function getUniqueHomeworlds(characters) {
    const homeworldsRaw = characters.map(character => character.homeworld ?? 'other');
    const homeworldsLowercase = homeworldsRaw.map(hw => hw.toLowerCase());
    const homeworldsUnique = [...new Set(homeworldsLowercase)];
    return homeworldsUnique;
}

function renderFilters(homeworlds) {
    const filtersContainer = document.getElementById('filtersContainer');
    filtersContainer.innerHTML = '';

    homeworlds.forEach(homeworld => {
        const filterItem = document.createElement('div');
        filterItem.className = 'filter-item';

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'homeworld';
        input.id = homeworld;
        input.value = homeworld;
        input.className = 'form-check-input';

        const label = document.createElement('label');
        label.htmlFor = homeworld;
        label.className = 'form-check-label';
        label.innerText = homeworld.charAt(0).toUpperCase() + homeworld.slice(1);

        filterItem.appendChild(input);
        filterItem.appendChild(label);
        filtersContainer.appendChild(filterItem);

        input.addEventListener('change', () => {
            const selectedHomeworld = document.querySelector('input[name="homeworld"]:checked');
            if (selectedHomeworld) {
                const selectedValue = selectedHomeworld.value;
                fetchCharacters()
                    .then(characters => {
                        const filteredCharacters = characters.filter(character => character.homeworld?.toLowerCase() === selectedValue);
                        renderCharacters(document.getElementById('characterContainer'), filteredCharacters);
                    })
                    .catch(error => {
                        console.error('Error fetching characters:', error);
                    });
            } else {
                fetchCharacters()
                    .then(characters => {
                        renderCharacters(document.getElementById('characterContainer'), characters);
                    })
                    .catch(error => {
                        console.error('Error fetching characters:', error);
                    });
            }
        });
    });
}

function renderCharacters(container, characters) {
    container.innerHTML = '';
    characters.forEach(character => {
        const imageUrl = character.pic ? character.pic : 'https://via.placeholder.com/300x400?text=No+Image';

        const characterCard = `
            <div class="col-md-4">
                <div class="card">
                    <img src="${imageUrl}" class="card-img-top" alt="${character.name}">
                    <div class="card-body">
                        <h5 class="card-title">${character.name}</h5>
                        <p class="card-text">Homeworld: ${character.homeworld}</p>
                    </div>
                </div>
            </div>`;
        container.innerHTML += characterCard;
    });
}
