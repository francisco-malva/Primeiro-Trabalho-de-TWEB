"use strict";

class SaleCalculator {

    static #brandModels = {
        "mercedes": [new Option("SUV", "suv")],
        "volvo": [new Option("V5", "v5")]
    };

    #onChangeMaker(event) {
        const models = SaleCalculator.#brandModels[this.makerSelector.value];


        while (this.modelSelector.options.length > 0) {
            this.modelSelector.options.remove(0);
        }


        for (let i = 0; i < models.length; i++) {
            this.modelSelector.options.add(models[i]);
        }

        this.modelSelectorSpan.style.display = "block";
    }

    #calculatePrice(formData) {
        let c1;
        let c2;

        let price = Number.parseFloat(formData.get("price"));

        let currentYear = new Date().getFullYear();

        let year = currentYear - Number.parseInt(formData.get("date"));
        let km = Number.parseInt(formData.get("kms"));

        c1 = 0;

        while (year > 0) {
            c1 += year > 10 ? 0.04 : 0.05;
            --year;
        }

        if (km <= 30000)
            c2 = 1;
        else if (km <= 70000)
            c2 = 0.95;
        else
            c2 = 0.9;

        return price * (1 - c1) * c2;
    }

    #onSubmitSaleForm(event) {

        try {
            let data = new FormData(event.target);
            let price = this.#calculatePrice(data);

            this.financeResults.style.display = "flex";


            const c3s = [
                1.1,
                1,
                0.6
            ];

            console.log(this.financeResults.children);

            let i = 0;

            for (let div of this.financeResults.children) {

                if (div.classList[0] != "vertical-line") {
                    div.querySelector("ul li:first-child").innerHTML = (Math.round(price * c3s[i])).toString() + " €";
                    ++i;
                }
            }

            return false;
        }
        catch (e) {
            console.log(e);
            return false;
        }

    }

    constructor(calculatorRoot) {
        this.form = calculatorRoot.querySelector("form");
        this.makerSelector = calculatorRoot.querySelector("select[name=maker]");
        this.modelSelectorSpan = calculatorRoot.querySelector(".model-select");
        this.modelSelector = this.modelSelectorSpan.querySelector("select");
        this.financeResults = calculatorRoot.querySelector(".results");

        this.makerSelector.onchange = this.#onChangeMaker.bind(this);
        this.form.onsubmit = this.#onSubmitSaleForm.bind(this);
    }
}

class FinanceCalculator {

    static #getSpread() {
        return 1 + (Math.random() * 4);
    }

    #onSubmitFinanceForm(event) {
        try {
            let data = new FormData(event.target);
            let deposit = Number.parseInt(data.get("price"));
            let financed = Number.parseInt(data.get("price-finance"));
            let years = Number.parseInt(data.get("years"));

            let total = deposit + financed;

            this.financeResults.style.display = "flex";

            let i = 0;


            let months = years * 12;

            for (let div of this.financeResults.children) {

                if (div.classList[0] != "vertical-line") {


                    let totalLi = div.querySelector(".tot-amt");
                    let emprLi = div.querySelector(".len-amt");
                    let durLi = div.querySelector(".dur-amt");
                    let taxLi = div.querySelector(".tax-amt");
                    let spreadLi = div.querySelector(".spd-amt");
                    let initLi = div.querySelector(".ini-amt");
                    let monLi = div.querySelector(".mon-amt");

                    let spread = FinanceCalculator.#getSpread();
                    let tax = 5 + spread;

                    let monthly = (financed / months) * (1 + (tax / 100));


                    totalLi.innerHTML = "Preço do Automóvel: " + total + " €";
                    durLi.innerHTML = "Duração: " + months + " meses";
                    taxLi.innerHTML = "Taxa: " + tax.toFixed(2) + "%";
                    spreadLi.innerHTML = "Spread: " + spread.toFixed(2) + "%";
                    initLi.innerHTML = "Valor do Depósito: " + deposit + " €";
                    monLi.innerHTML = "Pagamento Mensal: " + monthly.toFixed(2) + " €";
                    ++i;
                }
            }

            return false;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }

    constructor(financeRoot) {
        this.form = financeRoot.querySelector("form");
        this.financeResults = financeRoot.querySelector(".results");
        this.form.onsubmit = this.#onSubmitFinanceForm.bind(this);
    }
}

const saleCalculator = new SaleCalculator(document.querySelector("#sale"));
const financeCalculator = new FinanceCalculator(document.querySelector("#finance")); 