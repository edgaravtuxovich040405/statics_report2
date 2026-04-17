// список названий параметров
const titles = [
    "Рост (высота человека)",
    "Высота уровня глаз",
    "Высота плечевого сустава",
    "Высота локтя",
    "Глубина грудной клетки (стоя)",
    "Ширина грудной клетки (стоя)",
    "Высота сидя (прямо)",
    "Высота уровня глаз (сидя)",
    "Высота шейной точки (сидя)",
    "Высота плечевого сустава (сидя)",
    "Расстояние локоть – запястье",
    "Ширина локоть – локоть",
    "Длина кисти",
    "Длина ладони",
    "Ширина кисти (пястные кости)",
    "Глубина головы",
    "Ширина головы",
    "Ось сжатия (вытягивание руки)",
    "Длина предплечье – кончик пальцев",
    "Длина бедра"
];

const container = document.getElementById("charts-container");

// создаём модальное окно (увеличение картинки)
const modal = document.createElement("div");
modal.style.position = "fixed";
modal.style.top = 0;
modal.style.left = 0;
modal.style.width = "95%";
modal.style.height = "95%";
modal.style.background = "rgba(0,0,0,0.8)";
modal.style.display = "none";
modal.style.justifyContent = "center";
modal.style.alignItems = "center";
modal.style.zIndex = "1000";

const modalImg = document.createElement("img");
modalImg.style.maxWidth = "90%";
modalImg.style.maxHeight = "90%";
modalImg.style.borderRadius = "10px";

modal.appendChild(modalImg);
document.body.appendChild(modal);

// закрытие при клике
modal.addEventListener("click", () => {
    modal.style.display = "none";
});

// создаём 20 карточек
for (let i = 1; i <= 20; i++) {

    const card = document.createElement("div");
    card.className = "card";

    // картинка
    const img = document.createElement("img");
    img.src = `${i}.png`; // если в той же папке
    img.alt = titles[i - 1];
    img.className = "image";

    // подпись
    const text = document.createElement("div");
    text.className = "title";
    text.textContent = titles[i - 1];

    // клик → увеличить
    img.addEventListener("click", () => {
        modal.style.display = "flex";
        modalImg.src = img.src;
    });

    card.appendChild(img);
    card.appendChild(text);

    container.appendChild(card);
}
