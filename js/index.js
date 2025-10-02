async function carregarTiposDeCommit() {
    try {
        const response = await fetch('./json/commitPrefixes.json'); 
        if (!response.ok) {
            throw new Error(`Erro de rede ou arquivo não encontrado: ${response.status}`);
        }
        return response.json(); 
        
    } catch (error) {
        console.error("Houve um erro ao carregar o JSON:", error);
    }
}

let commitPrefixes = [];
const prefixButtonContainer = document.getElementById("prefix-buttons")
const prefixDetailsContainer = document.getElementById('prefix-details');

let currentActiveButton = null;

function displayDetails(prefixId) {
    const prefix = commitPrefixes.find(p => p.id === prefixId);
    if(!prefix) return;

    prefixDetailsContainer.innerHTML = `
    <div class="flex items-center mb-4">
                    <span class="text-3xl mr-3">${prefix.emoji}</span>
                    <div>
                        <h3 class="text-2xl font-bold text-teal-800">${prefix.name}</h3>
                        <p class="text-md text-slate-600 font-medium">${prefix.title}</p>
                    </div>
                </div>
                <p class="text-slate-700 leading-relaxed mb-4">${prefix.description}</p>
                <p class="text-sm font-semibold text-slate-500 mb-1">EXEMPLO PRÁTICO:</p>
                <div class="commit-example">${prefix.example}</div>
    `;

    const newActiveButton = document.querySelector(`[data-prefix-id="${prefixId}"]`);
    if (currentActiveButton) {
        currentActiveButton.classList.remove("active-prefix");
    }
    if (newActiveButton)
    {
        newActiveButton.classList.add('active-prefix');
        currentActiveButton = newActiveButton;
    }
}


function renderButtons(){
    commitPrefixes.forEach(prefix => {
        const button = document.createElement("button");
        button.className = "p-3 bg-teal-600/10 text-teal-800 font-bold rounded-lg hover:bg-teal-600/20 transition-all duration-200 ease-in-out cursor-pointer";
        button.textContent = prefix.name;
        button.dataset.prefixId = prefix.id;
        prefixButtonContainer.appendChild(button)
    })
}

prefixButtonContainer.addEventListener("click", (event) => {
        if (event.target.tagName === "BUTTON"){
            const prefixId = event.target.dataset.prefixId;
            displayDetails(prefixId);
        }
    })

document.addEventListener("DOMContentLoaded", async () => {
    commitPrefixes = await carregarTiposDeCommit();
    renderButtons();
    displayDetails('feat');
})