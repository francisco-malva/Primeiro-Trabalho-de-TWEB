"use strict";

class FinanceCalculator {

    static #brandModels = {
        "mercedes": [new Option("SUV", "suv")]
    };

    #onChangeMaker(event) {
        const models = FinanceCalculator.#brandModels[this.makerSelector.value];


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
        let year = (new Date().getFullYear()) - Number.parseInt(formData.get("date"));
        let km = Number.parseInt(formData.get("kms"));

        c1 = year > 10 ? 0.04 : 0.05;

        if (km <= 30000)
            c2 = 1;
        else if (km <= 70000)
            c2 = 0.95;
        else
            c2 = 0.9;

        return price * (1 - year * c1) * c2;
    }

    #onSubmitFinanceForm(event) {
        let data = new FormData(event.target);
        let price = this.#calculatePrice(data);

        alert(this.#calculatePrice(data, 0.0));

        this.financeResults.style.display = "flex";


        const c3s = [
            1.1,
            1,
            0.6
        ];

        console.log(this.financeResults.children);

        this.financeResults.children.forEach((element, i) => {
            element.querySelector("ul li:first-child").text = price * c3s[i];
        });
        
        return false;
    }

    constructor(calculatorRoot) {
        this.form = calculatorRoot.querySelector("form");
        this.makerSelector = calculatorRoot.querySelector("select[name=maker]");
        this.modelSelectorSpan = calculatorRoot.querySelector(".model-select");
        this.modelSelector = this.modelSelectorSpan.querySelector("select");
        this.submitButton = calculatorRoot.querySelector("input[type=submit]");
        this.financeResults = calculatorRoot.querySelector("#finance-results");

        this.makerSelector.onchange = this.#onChangeMaker.bind(this);
        this.form.onsubmit = this.#onSubmitFinanceForm.bind(this);
    }
}

const financeCalculator = new FinanceCalculator(document.querySelector("#finance-calculator"));