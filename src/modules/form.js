import { getClientDetails } from "../services/get-client-details";

const form = document.querySelector('form');
const profile = document.querySelector('.profile');
const history = document.querySelector('.history');
const fidelity = document.querySelector('.fidelity');
const milestone = document.querySelector('.milestone');

function fillClientDetails(clientDetails) {
    const img = profile.querySelector("img");
    const name = profile.querySelector("h2");
    const clientSince = profile.querySelector("p");

    img.src = clientDetails.image;
    name.textContent = clientDetails.name;
    clientSince.textContent = `Cliente desde ${clientDetails.clientSince}`
}

function fillHistoryLog(clientDetails) {
    history.querySelector('span').textContent = '';

    const quantidadeCortes = clientDetails.appointmentHistory.length;

    history.querySelector('span').textContent = `${quantidadeCortes} cortes`;

    history.querySelector('ul').innerHTML = '';

    for (let index = 0; index < quantidadeCortes; index++) {
        const { date, time } = clientDetails.appointmentHistory[index];

        const li = document.createElement('li');
        li.classList.add('flex');
        li.classList.add('items-center');
        li.classList.add('space-between');

        const div = document.createElement('div');
        const p = document.createElement('p');

        p.classList.add('subtitle-sm')
        p.classList.add('text-base-gray-600')
        p.textContent = date;

        const small = document.createElement('small');
        small.classList.add('text-xs')
        small.classList.add('text-base-gray-500')
        small.textContent = time;

        div.append(p, small);

        const verified = document.createElement('div');
        verified.classList.add('verified')

        const img = document.createElement('img');
        img.src = './src/assets/Verificado.svg';
        img.alt = 'Ícone de verificado'

        verified.append(img)

        li.append(div, verified)

        history.querySelector('ul').append(li)
    }
}

function fillFidelityPoints(id, {
    cutsNeeded,
    totalCuts
}) {
    fidelity.querySelector('.tag').innerHTML = '';

    fidelity.querySelector('.tag').textContent = `ID: ${id}`;

    const boxList = fidelity.querySelector('div:last-child')
    boxList.innerHTML = ''

    for (let index = 0; index < cutsNeeded; index++) {
        const grayBox = document.createElement('div');
        grayBox.classList.add('gray-box');

        if (cutsNeeded - 1 === index && cutsNeeded > totalCuts) {
            const img = document.createElement('img');
            img.src = './src/assets/GrayGift.svg';
            img.alt = 'Ícone de presente cinza, parecendo desabilitado';
            grayBox.append(img)
        }

        boxList.append(grayBox)
    }

    for (let index = 0; index < totalCuts; index++) {
        const iconeVerificado = document.createElement('img');
        iconeVerificado.src = './src/assets/PinCheck.png';
        iconeVerificado.alt = 'Ícone de verificado verde com sombra';

        if (index === cutsNeeded - 1 && cutsNeeded >= totalCuts) {
            iconeVerificado.classList.add('achievement')
        }

        fidelity.querySelector(`.gray-box:nth-child(${index + 1})`).appendChild(iconeVerificado)
    }
}

function fillMilestone({
    totalCuts, 
    cutsNeeded, 
    cutsRemaining
}) {
    milestone.querySelector('h3').textContent = cutsRemaining;
    milestone.querySelector('.progress-text').textContent = `${totalCuts} de ${cutsNeeded}`;

    const percentage = (totalCuts / cutsNeeded) * 100;
    milestone.querySelector('.progress').style.setProperty('width', `${percentage}%`);
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const {id} = Object.fromEntries(formData);

    if (!(/\d{3}-\d{3}-\d{3}-\d{3}/).test(id)) {
        alert('ID em formato inválido. Use XXX-XXX-XXX-XXX.')
        return;
    }

    try {
        const clientDetails = await getClientDetails(id);

        fillClientDetails(clientDetails);
        fillHistoryLog(clientDetails);
        fillFidelityPoints( id, clientDetails.loyaltyCard);
        fillMilestone(clientDetails.loyaltyCard);
        
        if (clientDetails.loyaltyCard.totalCuts >= clientDetails.loyaltyCard.cutsNeeded) {
            alert('Parabéns! Seu próximo corte é gratuito!');
        }
    } catch (error) {
        console.error(error)
        alert('Cliente não encontrado');
    }
})
