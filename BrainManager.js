class BrainBase {
    constructor(labelsBase) {
        this.labelsBase = labelsBase;
    }

    set labelsBase(labelsBase) {
        this._labelsBase = labelsBase || {};
    }

    get labelsBase() {
        return this._labelsBase;
    }
}

class CustomError {
    constructor(errorMessage) {
        this.errorMessage = errorMessage;
    }

    set errorMessage(errorMessage) {
        this._errorMessage = errorMessage || "Ops, algo deu errado";
    }

    get errorMessage() {
        throw new Error(this._errorMessage);
    }
}

class BrainManager extends BrainBase {
    constructor(dataToCompare) {
        super();
        this.dataToCompare = dataToCompare;
    }

    set dataToCompare(text) {
        this._dataToCompare = text || "";
    }

    get dataToCompare() {
        return this._dataToCompare;
    }

    train(trainingData) {
        Trainer.train(trainingData, this.labelsBase);
    }

    match() {
        return MatchBrain.match(this.dataToCompare, this.labelsBase);
    }
}

class TextControl {
    static configText(props) {
        const { isArray = false, text } = props;

        if (isArray) {
            const textsToUpperCase = this.setAllTextsToUpperCase(text);
            const sanitizedTexts = this.sanitizeAllTexts(textsToUpperCase);

            return sanitizedTexts;
        }
        const textToUpperCase = this.setTextToUpperCase(text);
        const sanitizedText = this.sanitizeText(textToUpperCase);

        return sanitizedText;
    }

    static setAllTextsToUpperCase(texts) {
        return texts.map((text) => this.setTextToUpperCase(text));
    }

    static setTextToUpperCase(text) {
        return text.toUpperCase();
    }

    static sanitizeAllTexts(texts) {
        return texts.map((text) => this.sanitizeText(text))
            .filter((sanitizedText) => sanitizedText !== "");
    }

    static sanitizeText(text) {
        return text.replace(/[^\w\s]/gi, '');
    }
}

class Trainer {
    static train(data, labelsBase) {
        data.forEach((value) => {
            const { text, label } = value;
            const words = TextControl.configText({ isArray: true, text: text.split(" ") });

            if (!labelsBase[label]) {
                labelsBase[label] = [];
            }

            labelsBase[label].push(...words);
        });
    }
}

class MatchBrain extends CustomError {
    constructor() {
        super();
    }

    static match(text, labelsBase) {
        const sanitizedText = TextControl.sanitizeText(text);

        let bestMatch = null;
        let maxMatchCount = 0;

        for (const label in labelsBase) {
            const words = labelsBase[label];
            const matchCount = this.calculateMatchCount(sanitizedText, words);

            if (matchCount > maxMatchCount) {
                maxMatchCount = matchCount;
                bestMatch = label;
            }
        }

        if (bestMatch) {
            return this.setMessage({ word: text, label: bestMatch });
        } else {
            return this.setMessage({ error: true });
        }
    }

    static calculateMatchCount(text, words) {
        const sanitizedWords = words.map((word) => TextControl.configText({ isArray: false, text: word }));
        const wordsSet = new Set(sanitizedWords);

        const textWords = TextControl.configText({ isArray: true, text: text.split(" ") })
        const matchingWords = textWords.filter((word) => wordsSet.has(word));


        return matchingWords.length;
    }

    static setMessage({ word = null, label = null, error = false }) {
        if (error) {
            this.errorMessage = "Ops, resultado não encontrado.";
            return this.errorMessage;
        }

        return `A palavra ${word} é: ${label}`;
    }
}

// Exemplo de uso
const trainingData = [
    { text: "Horrível", label: "Negativa" },
    { text: "Legal", label: "Positiva" },
    { text: "Isto é Legal", label: "Positiva" },
    { text: "Estou péssimo", label: "Negativa" },
    { text: "Maravilhoso", label: "Positiva" },
    { text: "Muito bom", label: "Positiva" },
    { text: "Ruim", label: "Negativa" },
    { text: "Excelente", label: "Positiva" },
    { text: "Não gostei", label: "Negativa" },
    { text: "Incrível", label: "Positiva" },
    { text: "Péssimo serviço", label: "Negativa" },
    { text: "Ótimo trabalho", label: "Positiva" },
    { text: "Adorei isso", label: "Positiva" },
    { text: "Detestei", label: "Negativa" },
    { text: "Bom", label: "Positiva" },
    { text: "Muito ruim", label: "Negativa" },
];

const brainManager = new BrainManager();
brainManager.train(trainingData);
brainManager.dataToCompare = "ruim";
console.log(brainManager.match());
