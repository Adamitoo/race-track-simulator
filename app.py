from flask import Flask, render_template, request

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/simulator", methods=["GET", "POST"])
def simulator():
    cas = None

    vykon = hmotnost = rychlost = dlzka = zakruty = trat = None

    if request.method == "POST":
        trat = request.form["trat"]

        trate_info = {
            "monza":  {"dlzka": 5.79, "zakruty": 11},
            "spa":    {"dlzka": 7.00, "zakruty": 20},
            "custom": {"dlzka": None, "zakruty": None}
        }

        vykon = float(request.form["vykon"])
        hmotnost = float(request.form["hmotnost"])
        rychlost = float(request.form["rychlost"])

        if trat != "custom":
            dlzka = trate_info[trat]["dlzka"]
            zakruty = trate_info[trat]["zakruty"]
        else:
            dlzka = float(request.form["dlzka"])
            zakruty = int(request.form["zakruty"])

        try:
            efektivna_rychlost = (rychlost * (0.4 + 0.6 * (vykon / hmotnost)) * (1 - 0.002 * zakruty))

            sekundy = (dlzka * 3600) / efektivna_rychlost

            minuty = int(sekundy // 60)
            sec = int(sekundy % 60)
            ms = int((sekundy * 1000) % 1000)

            cas = f"{minuty}:{sec:02d}:{ms:03d}"

        except Exception as e:
            cas = f"Chyba vo vypocte: {e}"

    return render_template(
        "simulation.html",
        cas=cas,
        vykon=vykon,
        hmotnost=hmotnost,
        rychlost=rychlost,
        dlzka=dlzka,
        zakruty=zakruty,
        trat=trat
    )

if __name__ == "__main__":
    app.run(debug=True)
