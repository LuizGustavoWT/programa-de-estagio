const BASE_URL = 'http://localhost:3001';
function createVeiculoRow(veiculo, document) {
    document.innerHTML = document.innerHTML.concat(`
        <tr class="vehicle">
            <input type="hidden" class="id" value="${veiculo.id}">
            <td class="locadora">${veiculo.locadora}</td>
            <td class="modelo">${veiculo.modelo}</td>
            <td class="marca">${veiculo.marca}</td>
            <td class="ano">${veiculo.ano}</td>
            <td class="motor">${veiculo.motor}</td>
            <td class="portas">${veiculo.portas}</td>
            <td class="cambio">${veiculo.cambio}</td>
            <td class="ar_condicionado">${veiculo.ar_condicionado ? 'Sim' : 'Não'}</td>
            <td>
                <button class="edit-button">Editar</button>
                <button class="delete-button">Excluir</button>
            </td>
        </tr>
    `);
}

async function editVehicle(documentVehicle) {
    const id = documentVehicle.getElementsByClassName('id')[0].value;

    try {
        var response = await fetch(`${BASE_URL}/vehicles/${id}`, {
            method: 'GET',
        });

        var veiculo = await response.json();

        if(veiculo){
            var {locadora, modelo, marca, ano, motor, portas, cambio, ar_condicionado: arCondicionado} = veiculo;
        } else {
            locadora =documentVehicle.getElementsByClassName('locadora')[0].innerText;
            modelo = documentVehicle.getElementsByClassName('modelo')[0].innerText;
            marca = documentVehicle.getElementsByClassName('marca')[0].innerText;
            ano = documentVehicle.getElementsByClassName('ano')[0].innerText;
            motor = documentVehicle.getElementsByClassName('motor')[0].innerText;
            portas = documentVehicle.getElementsByClassName('portas')[0].innerText;
            cambio = documentVehicle.getElementsByClassName('cambio')[0].innerText;
            arCondicionado = documentVehicle.getElementsByClassName('ar_condicionado')[0].innerText === 'Sim';
        }

        document.getElementById('locadora').value = locadora;
        document.getElementById('modelo').value = modelo;
        document.getElementById('marca').value = marca;
        document.getElementById('ano').value = ano;
        document.getElementById('motor').value = motor;
        document.getElementById('portas').value = portas;
        document.getElementById('cambio').value = cambio;
        document.getElementById('ar_condicionado').checked = arCondicionado;
        document.getElementById('id').value = id;

        document.getElementById('form-btn').innerText = 'Atualizar';

    } catch (e) {
        console.log(e);
    }
}

function addFakeVeiculos(document) {
    const veiculosFakes = [
        {
            locadora: 'Fake Locadora 1',
            modelo: 'Fake Modelo 1',
            marca: 'Fake Marca 1',
            ano: 2022,
            motor: '2.0',
            portas: 4,
            cambio: 'Automático',
            ar_condicionado: true,
        },
        {
            locadora: 'Fake Locadora 2',
            modelo: 'Fake Modelo 2',
            marca: 'Fake Marca 2',
            ano: 2021,
            motor: '1.6',
            portas: 2,
            cambio: 'Manual',
            ar_condicionado: false,
        }
    ];

    for (const veiculo of veiculosFakes) {
        createVeiculoRow(veiculo, document);
    }
}

function addVehicles(vehicles, document) {
    for (const veiculo of vehicles) {
        createVeiculoRow(veiculo, document);
    }
}

async function addVeiculo(veiculo) {
    await fetch(`${BASE_URL}/vehicles/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(veiculo)
    })

    document.getElementById('refresh-button').click();
}

async function updateVehicle(veiculo) {
    await fetch(`${BASE_URL}/vehicles/${veiculo.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(veiculo)
    })

    document.getElementById('form-btn').innerText = 'Adicionar';

    document.getElementById('refresh-button').click();
}

async function deleteVehicle(id) {
    await fetch(`${BASE_URL}/vehicles/${id}`, {
        method: 'DELETE',
    })

    document.getElementById('refresh-button').click();
}

async function getVehicles() {
    try {
        var response = await fetch(`${BASE_URL}/vehicles`, {
            method: 'GET',
        })

        const vehicles = await response.json();

        return vehicles;
    } catch (e) {
        console.log(e);
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const veiculosList = document.getElementById('veiculos-list');
    const addVeiculoForm = document.getElementById('add-veiculo-form');
    const refreshButton = document.getElementById('refresh-button');
    const arCondicionadoCheckbox = document.getElementById('ar_condicionado');

    refreshButton.addEventListener('click', async () => {

        veiculosList.innerHTML = '';

        var vehicles = await getVehicles();

        addVehicles(vehicles, veiculosList);


        if (document.querySelector('.edit-button') &&
            document.querySelector('.delete-button')) {
            const editButtons = document.querySelectorAll('.edit-button');
            const deleteButtons = document.querySelectorAll('.delete-button');

            for (let i = 0; i < editButtons.length; i++) {
                editButtons[i].addEventListener('click', (e) => {
                    e.preventDefault();
                    editVehicle(document.querySelectorAll('.vehicle')[i]);
                });

                deleteButtons[i].addEventListener('click', async (e) => {
                    e.preventDefault();
                    const id = document.querySelectorAll('.id')[i].value;
                    await deleteVehicle(id);
                    document.querySelectorAll('.vehicle')[i].remove();
                });
            }
        }
    });

    // Event listener para adicionar um novo veículo
    addVeiculoForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const locadora = document.getElementById('locadora').value;
        const modelo = document.getElementById('modelo').value;
        const marca = document.getElementById('marca').value;
        const ano = document.getElementById('ano').value;
        const motor = document.getElementById('motor').value;
        const portas = document.getElementById('portas').value;
        const cambio = document.getElementById('cambio').value;
        const arCondicionado = arCondicionadoCheckbox.checked;

        const newVeiculo = {
            locadora,
            modelo,
            marca,
            ano,
            motor,
            portas,
            cambio,
            ar_condicionado: arCondicionado,
        };

        if(document.getElementById('id').value !== 'null') {
            await updateVehicle({...newVeiculo, id: document.getElementById('id').value});
        }else {
            await addVeiculo(newVeiculo);
        }

        addVeiculoForm.reset();
    });
});
