// --------------------------------------------------------------
    // РЕАЛЬНЫЕ ДАННЫЕ ИЗ base.csv (первая строка - заголовки, далее строки параметров)
    // Восстановлены в точности по предоставленному файлу.
    // --------------------------------------------------------------
    const csvRows = [
        ["parametrs","normal","Avtukhovich","Moiseev","Chumaevskiy","Teterin","Vorbobenko","Prixod'ko","Asta'feva","Merzlyakova","Netzel'skiy","Borisov"],
        ["рост (высота человека)","None","195","186","179","177","171","168","165","161","183.5","184.5"],
        ["Высота уровня глаз","None","183","174.8","173","165.5","159","157","155","149","173","174"],
        ["Высота плечевого сустава","None","157.5","154.5","149.5","151","151","141","137","133","152","153.5"],
        ["Высота локтя","None","117","98.5","109","111","103","102","112","105","114","117"],
        ["Глубина грудной клетки в положении стоя","None","19","21","20.5","21.5","21.5","21","21.5","23.3","25","24"],
        ["Ширина грудной клетки в положении стоя","None","29","34","33.5","34","31","31.4","26","26.7","40","30.5"],
        ["Высота сидя (прямо)","None","98","93","95","88.7","86","86.5","86","84.4","84.5","95"],
        ["Высота уровня глаз в положении сидя","None","88","84.6","82","77","74","85.5","77","75.5","74.3","84.5"],
        ["Высота шейной точки в положении сидя","None","81","77","81.5","69","64.5","66","67","67","61.4","74"],
        ["Высота плечевого сустава в положении сидя","None","69","62","63","60","58.3","59","55","55.7","55.2","62"],
        ["Расстояние «локоть – запястье»","None","31","31","32","30","24","25.5","29","25","30.8","36"],
        ["Ширина «локоть –локоть»","42","48","46.5","49","41","42","42","41","36","55","42"],
        ["Длина кисти руки","None","19.5","19","18","19.5","16.7","16","16.5","16","18.8","18"],
        ["Длина ладони","11","12","10","11","10","9","8.4","9","8.8","10.5","11.9"],
        ["Ширина кисти на уровне пястных костей","None","9.6","9","8.8","9.4","7.8","7.3","7.8","6.7","8.7","8.8"],
        ["Глубина головы","None","15","20.3","20.2","19.3","20","18","18","19.4","18","21.5"],
        ["Ширина головы","None","18.5","14.5","14.5","14.5","17","16","16.5","15.5","17","17"],
        ["Ось сжатия: протягивание кисти вперед","None","86","80","72.3","79","74","64","68.8","59.8","80.3","75.5"],
        ["Длина «предплечье – кончик пальцев»","None","53","59.5","48.4","49","44.3","41.1","44","39.6","48","49"],
        ["Длина бедра","None","67.5","63.5","60.8","60","55","50","52","50.5","60.4","65"]
    ];

    // Парсим данные: для каждого параметра (строки, начиная с индекса 1) собираем числовые значения из столбцов 1..end
    function extractNumericValues(row) {
        const values = [];
        for (let i = 1; i < row.length; i++) {
            let cell = row[i];
            if (cell === "None" || cell === null || cell === "") continue;
            let num = parseFloat(cell);
            if (!isNaN(num)) values.push(num);
        }
        return values;
    }

    // Функция вычисления моды: наиболее частое значение. Если все частоты =1 -> "Нет моды"
    // Если несколько значений с одинаковой максимальной частотой (>1) -> возвращаем первое (минимальное) и добавляем символ *
    function computeMode(values) {
        if (values.length === 0) return "—";
        const freq = new Map();
        for (let v of values) {
            freq.set(v, (freq.get(v) || 0) + 1);
        }
        let maxCount = 0;
        for (let cnt of freq.values()) {
            if (cnt > maxCount) maxCount = cnt;
        }
        if (maxCount === 1) return "Нет моды";
        const modes = [];
        for (let [val, cnt] of freq.entries()) {
            if (cnt === maxCount) modes.push(val);
        }
        if (modes.length === 1) return modes[0];
        else {
            // мультимода: выбираем наименьшее значение и помечаем
            const minMode = Math.min(...modes);
            return `${minMode} (мультимода)`;
        }
    }

    // Медиана
    function computeMedian(values) {
        if (values.length === 0) return NaN;
        const sorted = [...values].sort((a,b) => a-b);
        const mid = Math.floor(sorted.length / 2);
        if (sorted.length % 2 === 0) return (sorted[mid-1] + sorted[mid]) / 2;
        else return sorted[mid];
    }

    // Вычисление вероятностей (относительная частота)
    function computeProbabilities(values) {
        if (values.length === 0) return {};
        const freq = new Map();
        for (let v of values) {
            freq.set(v, (freq.get(v) || 0) + 1);
        }
        const total = values.length;
        const probs = {};
        for (let [val, cnt] of freq.entries()) {
            probs[val] = cnt / total;
        }
        return probs;
    }

    // Сбор статистики по всем параметрам
    const statistics = [];
    for (let i = 1; i < csvRows.length; i++) {
        const row = csvRows[i];
        const paramName = row[0];
        const numericValues = extractNumericValues(row);
        if (numericValues.length === 0) continue;
        const modeVal = computeMode(numericValues);
        const medianVal = computeMedian(numericValues);
        const maxVal = Math.max(...numericValues);
        const minVal = Math.min(...numericValues);
        const probs = computeProbabilities(numericValues);
        statistics.push({
            param: paramName,
            mode: modeVal,
            median: medianVal,
            max: maxVal,
            min: minVal,
            n: numericValues.length,
            probabilities: probs,
            rawValues: numericValues
        });
    }

    // Отрисовка таблицы
    function renderTable() {
        const tbody = document.getElementById('tableBody');
        tbody.innerHTML = '';
        statistics.forEach(stat => {
            const row = tbody.insertRow();
            // Параметр
            const paramCell = row.insertCell(0);
            paramCell.innerHTML = `<span class="param-name">${escapeHtml(stat.param)}</span>`;
            // Мода
            const modeCell = row.insertCell(1);
            if (typeof stat.mode === 'number') {
                modeCell.innerHTML = `<span class="mode-cell numeric">${stat.mode}</span>`;
            } else if (stat.mode === "Нет моды") {
                modeCell.innerHTML = `<span class="mode-cell no-mode">${stat.mode}</span>`;
            } else {
                modeCell.innerHTML = `<span class="mode-cell numeric">${escapeHtml(stat.mode)}</span>`;
            }
            // Медиана
            const medianCell = row.insertCell(2);
            medianCell.innerHTML = `<span class="numeric">${stat.median.toFixed(2)}</span>`;
            // Максимум
            const maxCell = row.insertCell(3);
            maxCell.innerHTML = `<span class="numeric">${stat.max.toFixed(2)}</span>`;
            // Минимум
            const minCell = row.insertCell(4);
            minCell.innerHTML = `<span class="numeric">${stat.min.toFixed(2)}</span>`;
            // n
            const nCell = row.insertCell(5);
            nCell.innerHTML = `<span class="numeric">${stat.n}</span>`;
        });
    }

    function escapeHtml(str) {
        if (str === undefined) return '';
        return String(str).replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    function formatNumberValue(val) {
        if (typeof val === 'number') {
            return Number.isInteger(val) ? val.toString() : val.toFixed(2);
        }
        return val;
    }

    function renderProbabilities() {
        const container = document.getElementById('probabilitiesContainer');
        container.innerHTML = '';
        statistics.forEach(stat => {
            const probEntries = Object.entries(stat.probabilities);
            probEntries.sort((a,b) => parseFloat(a[0]) - parseFloat(b[0]));
            const card = document.createElement('div');
            card.className = 'prob-card';
            const cardHeader = document.createElement('div');
            cardHeader.className = 'card-header';
            cardHeader.innerHTML = `
                <h3>
                    📐 ${escapeHtml(stat.param)}
                    <span class="sample-size">n = ${stat.n}</span>
                </h3>
            `;
            const probListDiv = document.createElement('div');
            probListDiv.className = 'prob-list';
            for (let [value, prob] of probEntries) {
                const percentVal = (prob * 100);
                const percentFormatted = percentVal.toFixed(1);
                const valueFormatted = formatNumberValue(parseFloat(value));
                const probItem = document.createElement('div');
                probItem.className = 'prob-item';
                probItem.innerHTML = `
                    <div class="value-label">
                        <span class="value">${escapeHtml(valueFormatted)}</span>
                        <span class="percent">${percentFormatted}%</span>
                    </div>
                    <div class="progress-bar-bg">
                        <div class="progress-fill" style="width: 0%;"></div>
                    </div>
                `;
                probListDiv.appendChild(probItem);
                setTimeout(() => {
                    const fillDiv = probItem.querySelector('.progress-fill');
                    if (fillDiv) fillDiv.style.width = `${percentVal}%`;
                }, 20);
            }
            // доп. информация о моде
            const modeNote = document.createElement('div');
            modeNote.style.fontSize = '0.7rem';
            modeNote.style.marginTop = '8px';
            modeNote.style.padding = '6px 10px';
            modeNote.style.backgroundColor = '#f4f9fe';
            modeNote.style.borderRadius = '14px';
            if (stat.mode === "Нет моды") {
                modeNote.innerHTML = '⚠️ Все значения уникальны — мода отсутствует';
                modeNote.style.backgroundColor = '#fff3e0';
            } else {
                modeNote.innerHTML = `★ Мода: ${stat.mode} (наиболее частое значение)`;
            }
            probListDiv.appendChild(modeNote);
            card.appendChild(cardHeader);
            card.appendChild(probListDiv);
            container.appendChild(card);
        });
    }

    // Анимации появления
    function animateElements() {
        const rows = document.querySelectorAll('#statsTable tbody tr');
        rows.forEach((row, idx) => {
            row.style.opacity = '0';
            row.style.transform = 'translateX(-5px)';
            setTimeout(() => {
                row.style.transition = 'all 0.2s ease';
                row.style.opacity = '1';
                row.style.transform = 'translateX(0)';
            }, idx * 25);
        });
        const cards = document.querySelectorAll('.prob-card');
        cards.forEach((card, idx) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px)';
            setTimeout(() => {
                card.style.transition = 'all 0.25s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, idx * 40);
        });
    }

    renderTable();
    renderProbabilities();
    setTimeout(() => {
        animateElements();
        document.querySelectorAll('.progress-fill').forEach(bar => {
            const parentItem = bar.closest('.prob-item');
            if (parentItem) {
                const percentSpan = parentItem.querySelector('.percent');
                if (percentSpan) {
                    let pctText = percentSpan.innerText.replace('%','');
                    let pct = parseFloat(pctText);
                    if (!isNaN(pct)) bar.style.width = `${pct}%`;
                }
            }
        });
    }, 100);

    // Лог в консоль (соответствие python-отчёту)
    console.log("=== СТАТИСТИЧЕСКИЙ ОТЧЁТ ПО ДАННЫМ base.csv (РТУ МИРЭА) ===");
    statistics.forEach(s => {
        console.group(`📏 ${s.param}`);
        console.log(`Мода: ${s.mode} | Медиана: ${s.median.toFixed(2)} | Max: ${s.max} | Min: ${s.min} | n=${s.n}`);
        console.log("Вероятности значений:");
        for (const [val, prob] of Object.entries(s.probabilities)) {
            console.log(`   ${val} : ${(prob*100).toFixed(2)}%`);
        }
        console.groupEnd();
    });