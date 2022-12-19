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

    #getDate() {

    }
    #onSubmitFinanceForm() {
        return false;
    }

    constructor(calculatorRoot) {
        this.form = calculatorRoot.querySelector("form");
        this.makerSelector = calculatorRoot.querySelector("select[name=maker]");
        this.modelSelectorSpan = calculatorRoot.querySelector(".model-select");
        this.modelSelector = this.modelSelectorSpan.querySelector("select");
        this.submitButton = calculatorRoot.querySelector("input[type=submit]");

        this.makerSelector.onchange = this.#onChangeMaker.bind(this);
        this.form.onsubmit = this.#onSubmitFinanceForm.bind(this);
    }
}

const financeCalculator = new FinanceCalculator(document.querySelector("#finance-calculator"));