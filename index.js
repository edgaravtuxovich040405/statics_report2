// --------------------------------------------------------------
    // РЕАЛЬНЫЕ ДАННЫЕ ИЗ base.csv (первая строка - заголовки, далее строки параметров)
    // Восстановлены в точности по предоставленному файлу.
    // --------------------------------------------------------------
    const csvRows = [
        ["parametrs","normal","Avtukhovich","Moiseev","Chumaevskiy","Teterin","Vorbobenko","Prixod'ko","Asta'feva","Merzlyakova","Netzel'skiy","Borisov"],
        ["рост (высота человека)","176.1","195","186","179","177","171","168","165","161","183.5","184.5"],
        ["Высота уровня глаз","162.8","183","174.8","173","165.5","159","157","155","149","173","174"],
        ["Высота плечевого сустава","147.0","157.5","154.5","149.5","151","151","141","137","133","152","153.5"],
        ["Высота локтя","107.8","117","98.5","109","111","103","102","112","105","114","117"],
        ["Глубина грудной клетки в положении стоя","23.0","19","21","20.5","21.5","21.5","21","21.5","23.3","25","24"],
        ["Ширина грудной клетки в положении стоя","34.0","29","34","33.5","34","31","31.4","26","26.7","40","30.5"],
        ["Высота сидя (прямо)","89.5","98","93","95","88.7","86","86.5","86","84.4","84.5","95"],
        ["Высота уровня глаз в положении сидя","78.5","88","84.6","82","77","74","85.5","77","75.5","74.3","84.5"],
        ["Высота шейной точки в положении сидя","65.0","81","77","81.5","69","64.5","66","67","67","61.4","74"],
        ["Высота плечевого сустава в положении сидя","59.0","69","62","63","60","58.3","59","55","55.7","55.2","62"],
        ["Расстояние «локоть – запястье»","28.0","31","31","32","30","24","25.5","29","25","30.8","36"],
        ["Ширина «локоть –локоть»","42.0","48","46.5","49","41","42","42","41","36","55","42"],
        ["Длина кисти руки","19.0","19.5","19","18","19.5","16.7","16","16.5","16","18.8","18"],
        ["Длина ладони","11.0","12","10","11","10","9","8.4","9","8.8","10.5","11.9"],
        ["Ширина кисти на уровне пястных костей","8.5","9.6","9","8.8","9.4","7.8","7.3","7.8","6.7","8.7","8.8"],
        ["Глубина головы","20.0","15","20.3","20.2","19.3","20","18","18","19.4","18","21.5"],
        ["Ширина головы","16.0","18.5","14.5","14.5","14.5","17","16","16.5","15.5","17","17"],
        ["Ось сжатия: протягивание кисти вперед","75.0","86","80","72.3","79","74","64","68.8","59.8","80.3","75.5"],
        ["Длина «предплечье – кончик пальцев»","49.0","53","59.5","48.4","49","44.3","41.1","44","39.6","48","49"],
        ["Длина бедра","61.0","67.5","63.5","60.8","60","55","50","52","50.5","60.4","65"]
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
// Статистические функции
    function mean(arr) {
        if (!arr.length) return NaN;
        return arr.reduce((a,b) => a + b, 0) / arr.length;
    }
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
    function stdDev(arr) {
        if (arr.length < 2) return 0;
        const m = mean(arr);
        const squaredDiffs = arr.map(v => (v - m) ** 2);
        return Math.sqrt(squaredDiffs.reduce((a,b) => a + b, 0) / (arr.length - 1));
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

    // Перцентиль методом линейной интерполяции (как в numpy)
    function percentile(arr, p) {
        if (!arr.length) return NaN;
        const sorted = [...arr].sort((a,b) => a - b);
        const n = sorted.length;
        const index = (p / 100) * (n - 1);
        const lower = Math.floor(index);
        const upper = Math.ceil(index);
        if (lower === upper) return sorted[lower];
        const weight = index - lower;
        return sorted[lower] * (1 - weight) + sorted[upper] * weight;
    }

    // Сбор статистики по всем параметрам
    const statistics = [];
    for (let i = 1; i < csvRows.length; i++) {
        const row = csvRows[i];
        const paramName = row[0];
        const values = extractValues(row);
        if (values.length === 0) continue;
        const stat = {
            param: paramName,
            n: values.length,
            mean: mean(values),
            median: median(values),
            mode: mode(values),
            std: stdDev(values),
            p5: percentile(values, 5),
            p25: percentile(values, 25),
            p50: percentile(values, 50),
            p75: percentile(values, 75),
            p95: percentile(values, 95),
            min: Math.min(...values),
            max: Math.max(...values),
            values: values
        };
        statistics.push(stat);
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
    // Отрисовка таблицы
    function renderStatsTable() {
        const tbody = document.getElementById('tableBody');
        tbody.innerHTML = '';
        statistics.forEach(s => {
            const row = tbody.insertRow();
            row.insertCell(0).innerHTML = `<strong>${s.param}</strong>`;
            row.insertCell(1).innerText = s.n;
            row.insertCell(2).innerText = s.mean.toFixed(2);
            row.insertCell(3).innerText = s.median.toFixed(2);
            row.insertCell(4).innerText = (typeof s.mode === 'number') ? s.mode.toFixed(2) : s.mode;
            row.insertCell(5).innerText = s.std.toFixed(2);
            row.insertCell(6).innerText = s.p5.toFixed(2);
            row.insertCell(7).innerText = s.p95.toFixed(2);
            row.insertCell(8).innerText = s.min.toFixed(2);
            row.insertCell(9).innerText = s.max.toFixed(2);
        });
    }

    // Сравнение с ГОСТ (выборочные параметры)
    const gostMap = {
        "рост (высота человека)": 176.0,
        "Высота уровня глаз": 164.5,
        "Высота плечевого сустава": 149.0,
        "Высота локтя": 108.0,
        "Глубина грудной клетки в положении стоя": 22.0,
        "Ширина грудной клетки в положении стоя": 32.0,
        "Высота сидя (прямо)": 90.0,
        "Высота уровня глаз в положении сидя": 79.0,
        "Длина кисти руки": 18.5,
        "Ширина кисти на уровне пястных костей": 8.7
    };
    function renderCompareTable() {
        const tbody = document.getElementById('compareBody');
        tbody.innerHTML = '';
        for (let [param, gostVal] of Object.entries(gostMap)) {
            const stat = statistics.find(s => s.param === param);
            if (!stat) continue;
            const diff = stat.median - gostVal;
            const row = tbody.insertRow();
            row.insertCell(0).innerText = param;
            row.insertCell(1).innerText = stat.median.toFixed(2);
            row.insertCell(2).innerText = gostVal.toFixed(2);
            row.insertCell(3).innerHTML = diff > 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2);
        }
    }

    // Построение перцентильных кривых с помощью Chart.js
    function renderPercentileCharts() {
        const container = document.getElementById('chartsContainer');
        container.innerHTML = '';
        // Для краткости покажем первые 8 параметров, можно добавить скролл или выбор
        const displayParams = statistics.slice(0, 8);
        displayParams.forEach(stat => {
            const card = document.createElement('div');
            card.className = 'chart-card';
            card.innerHTML = `<h4 style="margin-bottom:0.5rem;">📐 ${stat.param}</h4><canvas id="chart-${stat.param.replace(/[^a-z0-9]/gi,'_')}" width="400" height="250"></canvas>`;
            container.appendChild(card);
            const ctx = card.querySelector('canvas').getContext('2d');
            const percentiles = [5, 25, 50, 75, 95];
            const values = [stat.p5, stat.p25, stat.p50, stat.p75, stat.p95];
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: percentiles.map(p => p + '%'),
                    datasets: [{
                        label: 'Значение (см)',
                        data: values,
                        borderColor: '#003d7c',
                        backgroundColor: 'rgba(0,61,124,0.05)',
                        tension: 0.2,
                        fill: true,
                        pointBackgroundColor: '#ffb347',
                        pointRadius: 5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: { legend: { position: 'top' }, tooltip: { callbacks: { label: (ctx) => `${ctx.raw.toFixed(2)} см` } } }
                }
            });
        });
    }

    // Вывод методологии в консоль
    console.log("=== Статистический анализ на JavaScript (методология) ===");
    console.log("• Очистка от 'None', преобразование в Number");
    console.log("• Мода: частота, медиана: центральное значение, перцентили: линейная интерполяция");
    statistics.slice(0,3).forEach(s => {
        console.log(`${s.param}: медиана=${s.median.toFixed(2)}, 5%=${s.p5.toFixed(2)}, 95%=${s.p95.toFixed(2)}`);
    });

    // Запуск отрисовки
    renderStatsTable();
    renderCompareTable();
    renderPercentileCharts();
