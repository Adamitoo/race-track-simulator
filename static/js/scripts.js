document.addEventListener("DOMContentLoaded", () => {
    const trackSelect = document.getElementById("trat");
    const lengthInput = document.getElementById("dlzka");
    const turnsInput = document.getElementById("zakruty");

    const TRACK_DATA = {
        "custom": { length: 0, turns: 0 },
        "monza": { length: 5.79, turns: 11 },
        "spa":   { length: 7.00, turns: 19 }
    };

    const monzaAnim = document.querySelector(".monza");
    const spaAnim = document.querySelector(".spa");
    const vlastnaAnim = document.getElementById("vlastnaTrat");
    const vlastnaPath = document.getElementById("vlastnaPath");

    // Funkcia na generovanie oblúkového tvaru trate
    function generateCustomTrack(turns) {
        const width = 500;
        const height = 400;
        const margin = 40;
        let points = [];

        // vytvor body, postupne od ľava doprava
        for (let i = 0; i < turns; i++) {
            const x = margin + (i / (turns - 1)) * (width - 2 * margin);
            const y = margin + Math.random() * (height - 2 * margin);
            points.push({x, y});
        }

        // vytvor cestu pomocou Q (quadratic) pre oblúky
        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            const prev = points[i-1];
            const curr = points[i];
            const cx = (prev.x + curr.x)/2;
            const cy = (prev.y + curr.y)/2;
            d += ` Q ${prev.x} ${prev.y} ${cx} ${cy}`;
        }

        // uzavrieť trať
        const last = points[points.length - 1];
        const first = points[0];
        const cx = (last.x + first.x)/2;
        const cy = (last.y + first.y)/2;
        d += ` Q ${last.x} ${last.y} ${cx} ${cy} Z`;

        return d;
    }

    function updateAnimation() {
        const value = trackSelect.value;

        monzaAnim.style.display = "none";
        spaAnim.style.display = "none";
        vlastnaAnim.style.display = "none";

        if(value === "monza") {
            monzaAnim.style.display = "block";
        } else if(value === "spa") {
            spaAnim.style.display = "block";
        } else if(value === "custom") {
            vlastnaAnim.style.display = "block";
            const turns = parseInt(turnsInput.value) || 5;
            const pathData = generateCustomTrack(turns);
            vlastnaPath.setAttribute("d", pathData);
        }
    }

    trackSelect.addEventListener("change", function () {
        const selected = this.value;
        if (TRACK_DATA[selected]) {
            lengthInput.value = TRACK_DATA[selected].length;
            turnsInput.value = TRACK_DATA[selected].turns;
        }
        updateAnimation();
    });

    turnsInput.addEventListener("input", () => {
        if(trackSelect.value === "custom") {
            updateAnimation();
        }
    });

    // počiatočné zobrazenie
    updateAnimation();
});
