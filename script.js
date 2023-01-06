"use strict";

class SaleCalculator {

    static #brandModels = {
        "mercedes": [new Option("SUV", "suv"), new Option("SEDAN", "sedan"), new Option("CROSSOVER", "crossover"), new Option("PICAPE", "picape"), new Option("CUPÊ", "cupe")],
        "volvo": [new Option("C40", "c40"),
        new Option("EX90", "ex90"),
        new Option("V60", "v60"),
        new Option("V90", "v90")],
        "saab": [new Option("92 LINE", "95line"),
        new Option("EV-1", "ev-1"),
        new Option("VIKING", "viking"),
        new Option("9000 CABRIOLET", "9000cabriolet")],
        "audi": [new Option("A3 SEDAN", "a3 sedan"),
        new Option("A4 WAGON", "a4 wagon"),
        new Option("A5 COUPE", "a5 coupe"),
        new Option("A5 SPORTBACK", "a5 sportback"),
        new Option("Q3 SUV", "q3 suv"),
        new Option("Q4 SUV SPORTBACK", "q4 suv sportback")],
        "bmw": [new Option("X3", "x3"),
        new Option("X5", "x5"),
        new Option("X6", "x6"),
        new Option("iX3", "ix3"),
        new Option("iX M60", "ix m60"),
        new Option("iX1", "ix1")],
        "wv": [new Option("GOLF 4 TDi", "x3"),
        new Option("GOLF 5 TDi", "x5"),
        new Option("PASSAT TDi", "x6")]
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


class Slideshow {

    constructor(slideshowRoot) {
        this.root = slideshowRoot;
        this.containerDiv = slideshowRoot.querySelector("div");

        this.slide = 0;

        this.slides = this.containerDiv.querySelectorAll("img");
        this.slideCount = this.slides.length;


        this.root.querySelector(".car-btn-left").onclick = this.#previousSlide.bind(this);
        this.root.querySelector(".car-btn-right").onclick = this.#nextSlide.bind(this);

        this.#setCorrectHeight();

        addEventListener("resize", this.#setCorrectHeight.bind(this));

        this.seconds = 0;
        setInterval(this.#updateSlideshow.bind(this), 1000);

        this.#queueSlideChange();
    }

    #updateSlideshow() {
        this.seconds++;

        if (this.seconds > 5 && this.seconds % 5 === 0) {
            this.#nextSlide();
        }
    }
    #cancelSlideChange() {
        clearTimeout(this.timeout);
    }

    #queueSlideChange() {
        this.timeout = setTimeout(this.#nextSlide.bind(this, true), 5000);
    }

    #setCorrectHeight() {
        let maxHeight = 0;
        let mul = 0;

        for (let slide of this.slides) {
            slide.style.left = mul + "%";

            if (slide.offsetHeight > maxHeight) {
                maxHeight = slide.offsetHeight;
            }
            mul += 100;
        }

        this.containerDiv.style.height = maxHeight + "px";
    }

    #nextSlide(auto) {

        ++this.slide;

        if (this.slide >= this.slideCount)
            this.slide = 0;

        this.#setSlide(this.slide);
    }

    #previousSlide(auto) {

        --this.slide;

        if (this.slide < 0)
            this.slide = this.slideCount - 1;

        this.#setSlide(this.slide);
    }

    #setSlide(i) {
        this.seconds = 0;
        this.containerDiv.style.transform = "translate(" + i * -100 + "%)";
    }
}

class Menu {

    #toggleMenu() {
        this.navList.classList.toggle("active-sandwich");
    }

    constructor(root, alt) {
        this.navList = alt ? root.querySelector("span") : root.querySelector("ul");
        root.querySelector("button").onclick = this.#toggleMenu.bind(this);
    }
}

const saleCalculator = new SaleCalculator(document.querySelector("#sale"));
const financeCalculator = new FinanceCalculator(document.querySelector("#finance"));
const slideshow = new Slideshow(document.querySelector(".carrossel"));
const menu = new Menu(document.querySelector("#sandwich-nav"), false);
const menu2 = new Menu(document.querySelector("#search-sandwich"), false);
const menu3 = new Menu(document.querySelector("#li6col1"), true);
const menu4 = new Menu(document.querySelector("#li6col2"), true);
const menu5 = new Menu(document.querySelector("#li6col3"), true);
const menu6 = new Menu(document.querySelector("#li6col4"), true);
const menu7 = new Menu(document.querySelector("#li6col5"), true);
const menu8 = new Menu(document.querySelector("#li6col6"), true);
const menu9 = new Menu(document.querySelector("#li7col1"), true);
const menu10 = new Menu(document.querySelector("#li7col2"), true);
const menu11 = new Menu(document.querySelector("#li7col3"), true);
const menu12 = new Menu(document.querySelector("#li7col4"), true);
const menu13 = new Menu(document.querySelector("#li7col5"), true);
const menu14 = new Menu(document.querySelector("#li7col6"), true);