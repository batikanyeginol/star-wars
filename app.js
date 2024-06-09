document.getElementById('toggleButton').addEventListener('click', toggleCharacters);

function toggleCharacters() {
    const container = document.getElementById('characterContainer');
    const button = document.getElementById('toggleButton');

    if (container.innerHTML === '') {
        fetchCharacters()
            .then(characters => {
                renderCharacters(container, characters);
                button.innerHTML = 'Karakterleri Gizle';
                button.classList.remove('btn-success');
                button.classList.add('btn-danger');
            })
            .catch(error => {
                console.error('Error fetching characters:', error);
            });
    } else {
        container.innerHTML = '';
        button.innerHTML = 'Karakterleri Göster';
        button.classList.remove('btn-danger');
        button.classList.add('btn-success');
    }
}

async function fetchCharacters() {
    const response = await fetch('https://raw.githubusercontent.com/WildCodeSchool/starwars-api/master/db.json');
    const data = await response.json();
    return data.characters;
}

function renderCharacters(container, characters) {
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
