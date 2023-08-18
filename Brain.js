class BrainBase {
    constructor(labelsBase) {
        this._labelsBase = labelsBase || {};
    }

    get labelsBase() {
        return this._labelsBase;
    }
}

class BrainManager extends BrainBase {
    constructor() {
        super();
        this._dataToCompare = '';
    }

    set dataToCompare(text) {
        this._dataToCompare = text;
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

class Trainer {
    static train(data, labelsBase) {
        data.forEach((value) => {
            const { text, label } = value;
            const words = text.split(" ");

            if (!labelsBase[label]) {
                labelsBase[label] = words;
            } else {
                labelsBase[label].push(...words);
            }
        });
    }
}

class MatchBrain {
    static match(text, labelsBase) {
        for (const label in labelsBase) {
            if (labelsBase[label].includes(text)) {
                return label;
            }
        }
    }
}

// Exemplo de uso
const trainingData = [
    { text: "Horrível", label: "negativo" },
    { text: "Legal", label: "positivo" },
    { text: "Isto é Legal", label: "positivo" },
    { text: "Estou péssimo", label: "negativo" },
];

const brainManager = new BrainManager();
brainManager.train(trainingData);
brainManager.dataToCompare = "péssimo";
console.log(brainManager.match());
