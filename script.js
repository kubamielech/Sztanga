function calculatePlates(barbellWeight, targetWeight, availablePlates) {
    let weightPerSide = (targetWeight - barbellWeight) / 2;

    if (weightPerSide < 0) {
        throw new Error("Docelowa waga jest mniejsza niż waga sztangi.");
    }

    const platesNeeded = {};

    for (let plate of availablePlates) {
        const count = Math.floor(weightPerSide / plate);
        if (count > 0) {
            platesNeeded[plate] = count;
        }
        weightPerSide = parseFloat((weightPerSide - count * plate).toFixed(2));
    }

    if (weightPerSide > 0) {
        throw new Error("Nie można osiągnąć dokładnej wagi za pomocą dostępnych talerzy.");
    }

    return platesNeeded;
}

function sortAndRenderPlates(plates, container, isLeftSide) {
    const sortedPlates = Object.entries(plates)
        .sort((a, b) => isLeftSide ? a[0] - b[0] : b[0] - a[0]);

    const fragment = document.createDocumentFragment();

    for (const [plate, count] of sortedPlates) {
        const plateElement = document.createElement("div");
        plateElement.className = "plate";
        plateElement.dataset.weight = plate;
        
        if (count > 1) {
            plateElement.textContent = `${count}x ${plate}`;
            plateElement.style.lineHeight = "30px";
        } else {
            plateElement.textContent = `${plate}`;
        }

        fragment.appendChild(plateElement);
    }

    container.appendChild(fragment);
}

document.getElementById("barbellForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const barbellWeight = parseFloat(document.getElementById("barbellWeight").value);
    const targetWeight = parseFloat(document.getElementById("targetWeight").value);

    const availablePlates = Array.from(document.querySelectorAll('input[name="plates"]:checked'))
        .map(plate => parseFloat(plate.value))
        .sort((a, b) => b - a);

    try {
        const plates = calculatePlates(barbellWeight, targetWeight, availablePlates);

        const platesLeft = document.getElementById("platesLeft");
        const platesRight = document.getElementById("platesRight");

        platesLeft.innerHTML = "";
        platesRight.innerHTML = "";

        sortAndRenderPlates(plates, platesLeft, true);
        sortAndRenderPlates(plates, platesRight, false);

        document.getElementById("result").style.display = "flex";
    } catch (error) {
        alert(error.message);
    }
});

document.getElementById("resetButton").addEventListener("click", function () {
    document.getElementById("barbellForm").reset();
    document.getElementById("platesLeft").innerHTML = "";
    document.getElementById("platesRight").innerHTML = "";
    document.getElementById("result").style.display = "none";
});