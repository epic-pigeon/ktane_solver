const Port = Object.freeze({
    DVI_D: 0,
    Parallel: 1,
    PS2: 2,
    RJ45: 3,
    Serial: 4,
    RSA: 5,
});

class BombInfo {
    constructor(options) {
        this.batteries = options.batteries;
        this.serialNumber = options.serialNumber.toUpperCase();
        this.ports = options.ports ?? [];
        this.indicators = options.indicators ?? {};
        this.strikes = options.strikes ?? 0;
        this.solvedModules = options.solvedModules ?? 0;
        this.solvableModules = options.solvableModules ?? 0;
    }
    lastSNDigitIsEven() {
        return parseInt(this.serialNumber[5]) % 2 === 0;
    }
    lastSNDigitIsOdd() {
        return !this.lastSNDigitIsEven();
    }
    hasParallelPort() {
        return this.ports.indexOf(Port.Parallel) !== -1;
    }
    moduleSolved() {
        this.solvedModules++;
    }
    mistakeMade() {
        this.strikes++;
    }
    SNContainsVowel() {
        for (const vowel of ["A", "E", "I", "O", "U"]) {
            if (this.serialNumber.indexOf(vowel) !== -1) return true;
        }
        return false;
    }
    hasIndicator(ind) {
        return this.indicators.hasOwnProperty(ind);
    }
    hasLitIndicator(ind) {
        return this.indicators.hasOwnProperty(ind) && this.indicators[ind];
    }
    hasUnlitIndicator(ind) {
        return this.indicators.hasOwnProperty(ind) && !this.indicators[ind];
    }
}

function solvePassword(availableLetters) {
    let passwordsString = `about after again below could
every first found great house
large learn never other place
plant point right small sound
spell still study their there
these thing think three water
where which world would write`;
    let passwords = passwordsString.split(/[ \n]+/);
    return passwords.filter((password) => {
        for (let i = 0; i < 5; i++) {
            if (!availableLetters[i]) continue;
            if (availableLetters[i].indexOf(password[i]) === -1) return false;
        }
        return true;
    });
}

function solveComplicatedWires(bombInfo, wireDescription) {
    if (wireDescription === "" || wireDescription === "RS" || wireDescription === "S") return true;
    if (wireDescription === "B" || wireDescription === "BR" || wireDescription === "BRL" || wireDescription === "R") return bombInfo.lastSNDigitIsEven();
    if (wireDescription === "BL" || wireDescription === "BRS" || wireDescription === "BSL") return bombInfo.hasParallelPort();
    if (wireDescription === "RL" || wireDescription === "RSL" || wireDescription === "SL") return bombInfo.batteries >= 2;
}

function solveMorseCode(letters) {
    let morseCode = {
        ".-": "A",
        "-.": "N",
        "-...": "B",
        "---": "O",
        "-.-.": "C",
        ".--.": "P",
        "-..": "D",
        "--.-": "Q",
        ".": "E",
        ".-.": "R",
        "..-.": "F",
        "...": "S",
        "--.": "G",
        "-": "T",
        "....": "H",
        "..-": "U",
        "..": "I",
        "...-": "V",
        ".---": "J",
        ".--": "W",
        "-.-": "K",
        "-..-": "X",
        ".-..": "L",
        "-.--": "Y",
        "--": "M",
        "--..": "Z",
    };
    let wordFrequencies = {
        shell: "3.505 MHz",
        halls: "3.515 MHz",
        slick: "3.522 MHz",
        trick: "3.532 MHz",
        boxes: "3.535 MHz",
        leaks: "3.542 MHz",
        strobe: "3.545 MHz",
        bistro: "3.552 MHz",
        flick: "3.555 MHz",
        bombs: "3.565 MHz",
        break: "3.572 MHz",
        brick: "3.575 MHz",
        steak: "3.582 MHz",
        sting: "3.592 MHz",
        vector: "3.595 MHz",
        beats: "3.600 MHz",
    };
    let words = Object.keys(wordFrequencies);
    return words.filter(word => {
        for (let i = 0; i < word.length; i++) {
            if (!letters[i]) continue;
            if (!morseCode[letters[i]]) throw new Error(`No letter with morse code ${letters[i]}`);
            if (morseCode[letters[i]].toLowerCase() !== word[i]) return false;
        }
        return true;
    }).map(word => wordFrequencies[word]);
}

class MemorySolver {
    constructor() {
        this.stage = 0;
        this.pressedButtons = [];
    }
    solveFirstStage(displayNumber) {
        if (this.stage !== 0) throw new Error(`This method should only be called on the first stage`);
        this.stage++;
        return {position: displayNumber === 1 ? 2 : displayNumber};
    }
    solveSecondStage(prevPosition, prevLabel, displayNumber) {
        if (this.stage !== 1) throw new Error(`This method should only be called on the second stage`);
        this.stage++;
        this.pressedButtons.push({position: prevPosition, label: prevLabel});
        switch (displayNumber) {
            case 1:
                return {label: 4};
            case 2:
            case 4:
                return {position: this.pressedButtons[0].position};
            case 3:
                return {position: 1};
        }
    }
    solveThirdStage(prevPosition, prevLabel, displayNumber) {
        if (this.stage !== 2) throw new Error(`This method should only be called on the third stage`);
        this.stage++;
        this.pressedButtons.push({position: prevPosition, label: prevLabel});
        switch (displayNumber) {
            case 1:
                return {label: this.pressedButtons[1].label};
            case 2:
                return {label: this.pressedButtons[0].label};
            case 3:
                return {position: 3};
            case 4:
                return {label: 4};
        }
    }
    solveFourthStage(prevPosition, prevLabel, displayNumber) {
        if (this.stage !== 3) throw new Error(`This method should only be called on the fourth stage`);
        this.stage++;
        this.pressedButtons.push({position: prevPosition, label: prevLabel});
        switch (displayNumber) {
            case 1:
                return {position: this.pressedButtons[0].position};
            case 2:
                return {position: 1};
            case 3:
            case 4:
                return {position: this.pressedButtons[1].position};
        }
    }
    solveFifthStage(prevPosition, prevLabel, displayNumber) {
        if (this.stage !== 4) throw new Error(`This method should only be called on the fifth stage`);
        this.stage++;
        this.pressedButtons.push({position: prevPosition, label: prevLabel});
        switch (displayNumber) {
            case 1:
                return {label: this.pressedButtons[0].label};
            case 2:
                return {label: this.pressedButtons[1].label};
            case 3:
                return {label: this.pressedButtons[3].label};
            case 4:
                return {label: this.pressedButtons[2].label};
        }
    }
    solve(...args) {
        return {
            0: this.solveFirstStage,
            1: this.solveSecondStage,
            2: this.solveThirdStage,
            3: this.solveFourthStage,
            4: this.solveFifthStage,
        }[this.stage].apply(this, args);
    }
}

const SimonSaysColor = Object.freeze({
    RED: "red",
    BLUE: "blue",
    GREEN: "green",
    YELLOW: "yellow",
});

const SimonSaysTable = Object.freeze({
    hasAVowel: [
        {
            "red": "blue",
            "blue": "red",
            "green": "yellow",
            "yellow": "green",
        },
        {
            "red": "yellow",
            "blue": "green",
            "green": "blue",
            "yellow": "red",
        },
        {
            "red": "green",
            "blue": "red",
            "green": "yellow",
            "yellow": "blue",
        },
    ],
    doesNotHaveAVowel: [
        {
            "red": "blue",
            "blue": "yellow",
            "green": "green",
            "yellow": "red",
        },
        {
            "red": "red",
            "blue": "blue",
            "green": "yellow",
            "yellow": "green",
        },
        {
            "red": "yellow",
            "blue": "green",
            "green": "blue",
            "yellow": "red",
        },
    ]
});

function solveSimonSays(bombInfo, colors) {
    return colors ? colors.map(color => SimonSaysTable[bombInfo.SNContainsVowel() ? "hasAVowel" : "doesNotHaveAVowel"][bombInfo.strikes][color]) : SimonSaysTable[bombInfo.SNContainsVowel() ? "hasAVowel" : "doesNotHaveAVowel"][bombInfo.strikes];
}

const ButtonColor = Object.freeze({
    BLUE: "blue",
    YELLOW: "yellow",
    RED: "red",
    WHITE: "white",
    OTHER: "other",
});

const ButtonText = Object.freeze({
    ABORT: "abort",
    DETONATE: "detonate",
    HOLD: "hold",
    OTHER: "other",
});

function solveButton(bombInfo, buttonColor, buttonText) {
    if (buttonColor === ButtonColor.BLUE && buttonText === ButtonText.ABORT) return "hold";
    if (bombInfo.batteries > 1 && buttonText === ButtonText.DETONATE) return "press";
    if (buttonColor === ButtonColor.WHITE && bombInfo.hasLitIndicator("CAR")) return "hold";
    if (bombInfo.batteries > 2 && bombInfo.hasLitIndicator("FRK")) return "press";
    if (buttonColor === ButtonColor.YELLOW) return "hold";
    if (buttonColor === ButtonColor.RED && buttonText === ButtonText.HOLD) return "press";
    return "hold";
}

const WireColor = Object.freeze({
    RED: "red",
    WHITE: "white",
    BLUE: "blue",
    YELLOW: "yellow",
    BLACK: "black",
    OTHER: "other",
});

function solveWires(bombInfo, wires) {
    switch (wires.length) {
        case 3:
            if (wires.indexOf(WireColor.RED) === -1) return 2;
            if (wires[2] === WireColor.WHITE) return 3;
            if (wires.filter(wire => wire === WireColor.BLUE).length > 1) return wires.lastIndexOf(WireColor.BLUE)+1;
            return 3;
        case 4:
            if (wires.filter(wire => wire === WireColor.RED).length > 1 && bombInfo.lastSNDigitIsOdd()) return wires.lastIndexOf(WireColor.RED)+1;
            if (wires[3] === WireColor.YELLOW && wires.indexOf(WireColor.RED) === -1) return 1;
            if (wires.filter(wire => wire === WireColor.BLUE).length === 1) return 1;
            if (wires.filter(wire => wire === WireColor.YELLOW).length > 1) return 4;
            return 2;
        case 5:
            if (wires[4] === WireColor.BLACK && bombInfo.lastSNDigitIsOdd()) return 4;
            if ((wires.filter(wire => wire === WireColor.RED).length === 1) && (wires.filter(wire => wire === WireColor.YELLOW).length > 1)) return 1;
            if (wires.indexOf(WireColor.BLACK) === -1) return 2;
            return 1;
        case 6:
            if (wires.indexOf(WireColor.YELLOW) === -1 && bombInfo.lastSNDigitIsOdd()) return 4;
            if ((wires.filter(wire => wire === WireColor.YELLOW).length === 1) && (wires.filter(wire => wire === WireColor.WHITE).length > 1)) return 4;
            if (wires.indexOf(WireColor.RED) === -1) return 6;
            return 4;
    }
}

const NotButtonColor = Object.freeze({
    RED: "red",
    ORANGE: "orange",
    YELLOW: "yellow",
    GREEN: "green",
    CYAN: "cyan",
    BLUE: "blue",
    PURPLE: "purple",
    PINK: "pink",
    WHITE: "white",
    BLACK: "black"
});

const NotButtonText = Object.freeze({
    PRESS: 0,
    HOLD: 1,
    DETONATE: 2,
    TAP: 3,
    PUSH: 4,
    ABORT: 5,
    BUTTON: 6,
    CLICK: 7,
    MASH: 8
});

const NotButtonActionTable = Object.freeze({
    [NotButtonColor.RED]: `Press Mash Hold Press Hold Hold Press Mash Press`.split(" "),
    [NotButtonColor.ORANGE]: `Mash Press Press Hold Mash Mash Mash Mash Mash`.split(" "),
    [NotButtonColor.YELLOW]: `Hold Press Mash Mash Press Hold Press Press Hold`.split(" "),
    [NotButtonColor.GREEN]: `Press Hold Press Mash Mash Hold Press Press Press`.split(" "),
    [NotButtonColor.CYAN]: `Hold Mash Mash Press Hold Press Hold Press Mash`.split(" "),
    [NotButtonColor.BLUE]: `Press Hold Press Mash Press Hold Mash Hold Press`.split(" "),
    [NotButtonColor.PURPLE]: `Mash Hold Hold Press Mash Mash Hold Mash Hold`.split(" "),
    [NotButtonColor.PINK]: `Mash Press Hold Press Press Press Mash Hold Mash`.split(" "),
    [NotButtonColor.WHITE]: `Press Mash Press Hold Mash Press Press Pres Hold`.split(" "),
    [NotButtonColor.BLACK]: `Hold Hold Mash Mash Press Mash Hold Mash Mash`.split(" "),
});

function calculateNotButtonNumber(bombInfo, color, text) {
    let a = bombInfo.batteries;
    let b = new Set(bombInfo.ports);
    let c = bombInfo.solvableModules;
    let d = Object.keys(bombInfo.indicators).length;
    let e = parseInt(bombInfo.serialNumber[5]);
    let f = [...bombInfo.serialNumber].filter(char => char.match(/[a-zA-Z]/))[1];
    if (f) f = f.charCodeAt(0) - "A".charCodeAt(0) + 1; else f = 0;
    let g = Object.keys(NotButtonText).find(key => NotButtonText[key] === text).length;
    let val = (() => {
        switch (color) {
            case NotButtonColor.RED:
                return (a + 2 * b) - d;
            case NotButtonColor.ORANGE:
                return (2 * b + 1) - g;
            case NotButtonColor.YELLOW:
                return (2 * a + d) - c;
            case NotButtonColor.GREEN:
                return d + (2 * f - b);
            case NotButtonColor.CYAN:
                return (e + f + g) - b;
            case NotButtonColor.BLUE:
                return 2 * c + (d - 1);
            case NotButtonColor.PURPLE:
                return 2 * (f - a) + d;
            case NotButtonColor.PINK:
                return 3 * g - (a + 3);
            case NotButtonColor.WHITE:
                return (f + a * c) * (e + d);
            case NotButtonColor.BLACK:
                return (a * b + c * d) - g * (e - f);
        }
    })();
    while (val < 10) val += 7;
    while (val > 99) val -= 7;
    return val;
}

function solveNotButton(bombInfo, color, text) {
    let action = NotButtonActionTable[color][text];
    if (action === "Mash") return { mash: calculateNotButtonNumber(bombInfo, color, text) };
    if (action === "Press") return { press: true };
    if (action === "Hold") return { hold: true };
}

const NotComplicatedWiresFunctions = Object.freeze({
    AND: (a, b) => a && b,
    XOR: (a, b) => a ^ b,
    OR: (a, b) => a || b,
    XNOR: (a, b) => a === b,
    IMPLIES: (a, b) => a !== true && b !== false,
    NAND: (a, b) => !(a && b),
});

const NotComplicatedWiresFunctionsTable = Object.freeze({
    "16EJ": [NotComplicatedWiresFunctions.AND, NotComplicatedWiresFunctions.XOR, NotComplicatedWiresFunctions.OR, NotComplicatedWiresFunctions.XNOR, NotComplicatedWiresFunctions.IMPLIES, NotComplicatedWiresFunctions.NAND],
    "27DI": [NotComplicatedWiresFunctions.OR, NotComplicatedWiresFunctions.IMPLIES, NotComplicatedWiresFunctions.NAND, NotComplicatedWiresFunctions.AND, NotComplicatedWiresFunctions.XOR, NotComplicatedWiresFunctions.XNOR],
    "38CH": [NotComplicatedWiresFunctions.XNOR, NotComplicatedWiresFunctions.AND, NotComplicatedWiresFunctions.XOR, NotComplicatedWiresFunctions.IMPLIES, NotComplicatedWiresFunctions.NAND, NotComplicatedWiresFunctions.OR],
    "49BG": [NotComplicatedWiresFunctions.IMPLIES, NotComplicatedWiresFunctions.NAND, NotComplicatedWiresFunctions.XNOR, NotComplicatedWiresFunctions.XOR, NotComplicatedWiresFunctions.OR, NotComplicatedWiresFunctions.AND],
    "50AF": [NotComplicatedWiresFunctions.XOR, NotComplicatedWiresFunctions.OR, NotComplicatedWiresFunctions.AND, NotComplicatedWiresFunctions.NAND, NotComplicatedWiresFunctions.XNOR, NotComplicatedWiresFunctions.IMPLIES],
    "default": [NotComplicatedWiresFunctions.NAND, NotComplicatedWiresFunctions.XNOR, NotComplicatedWiresFunctions.IMPLIES, NotComplicatedWiresFunctions.OR, NotComplicatedWiresFunctions.AND, NotComplicatedWiresFunctions.XOR]
});

const NotComplicatedWiresColors = Object.freeze({
    WHITE: 0,
    RED: 1,
    BLUE: 2,
    WHITE_RED: 3,
    WHITE_BLUE: 4,
    RED_BLUE: 5
});

function solveNotComplicatedWires(bombInfo, color, led, star) {
    let char = bombInfo.serialNumber[1];
    let key = Object.keys(NotComplicatedWiresFunctionsTable).filter(key => key !== "default").find(key => key.indexOf(char) !== -1) ?? "default";
    return NotComplicatedWiresFunctionsTable[key][color](led, star);
}

class NotWhosOnFirstSolver {
    constructor() {
        this.stage = 0;
        this.displayWords = [];
        this.pressedButtons = [];
    }
    getStageOnePosition(word) {
        let wordTable = [
            `THERE\nNOTHING\nUR\nYOUR\nSAY`,
            `SEE\nHOLD ON\nREED\nYES\nLEAD`,
            `FIRST\nSAYS\nC\nTHEIR\nU`,
            `THEY ARE\nRED\nDISPLAY\nBLANK\nOK`,
            `THEY’RE\nCEE\nYOU’RE\nYOU ARE\nLED`,
            `READ\nNO\nOKAY\nLEED\nYOU`
        ];
        return Object.keys(wordTable).find(key => wordTable[key].split("\n").indexOf(word) !== -1);
    }
    solveFirstStage(displayWord) {
        if (this.stage !== 0) throw new Error(`This method should only be called on the first stage`);
        this.stage++;
        this.displayWords.push(displayWord);
        return [this.getStageOnePosition(displayWord)];
    }
    getStageTwoChartPosition(number) {
        let positionTable = [
            [52, 3, 5, 44, 2, 16, 46, 60, 29, 45],
            [37, 4, 59, 10, 24, 47, 43, 38, 39, 53],
            [9, 19, 51, 40, 14, 17, 6, 7, 26, 31],
            [18, 13, 20, 57, 55, 56, 11, 30, 1, 27],
            [48, 49, 23, 35, 34, 36, 58, 22, 33, 21],
            [28, 42, 12, 54, 25, 15, 50, 41, 8, 32]
        ];
        return Object.keys(positionTable).find(key => positionTable[key].indexOf(number) !== -1);
    }
    solveSecondStage(prevPosition, prevLabel, displayWord) {
        if (this.stage !== 1) throw new Error(`This method should only be called on the second stage`);
        this.stage++;
        this.displayWords.push(displayWord);
        this.pressedButtons.push({position: prevPosition, label: prevLabel});
        let letterTable = [
            `YGIVZDUQJAEHFBRCWSXMLNTPO`,
            `UWZLYGCPDTSQVNKOHMREAJXFI`,
            `AISZBUDSYKANOJXRMQLHETGIP`,
            `EMVVXCSWMKUFNJYPFXBATIRGQ`,
            `OCUGZAOWPCBLFTVUMZYDJMXKI`,
            `LGKYCQBRAHOJKUPDPFZSITLXG`,
            `TCEXQALNDUFKYRPVGBJBSIWOH`,
            `YEOUJVMZPRWLDACGRSKXFNBTQ`,
            `CHFVONTLRUJYESBPQAWMDZKXG`,
            `QGWIPXLDZYVCFRTMEBKHSNUOA`,
            `JZULXPIVGYTEFBORCNSWKHMQD`,
            `IRBDMGYJTOQURCNAEPHVIKWZS`,
            `EZESXPWLJDAVURCHNGBIHOTQK`,
            `ODXPUJKZOLBTXGEDRQHVICIWY`,
            `KSUQUTHOKJOLJTGZVCFMTULXR`,
            `KYBBCTBCIMRQSOXUCFZDFKTQN`,
            `SKUWLPEHSQMNIVAYXGJWZFHKB`,
            `KDBEVUQTEMMZHSIWYBMJUTNZQ`,
            `JFNPMOIAJYDMIQHXCKLYORWUG`,
            `SGIYDHBNWMXQUPZOELAKJCFRV`,
            `YSPOAMLTNERFVXBCDHQJIKZWG`,
            `JFXGRZEAMSEVOFQDSNBWPIYCL`,
            `GAFLYDNGZROAPYUQHKDYWNFVW`,
            `NVMZHTNFRJCODAWYWJLHABZEH`,
            `PDLZXIAJPFNVREGNPDLSTMHSN`,
            `ERWLGHQASBTVXICECFVPAXEVW`,
        ];
        let word1 = prevLabel.replace("'", "").replace(" ", "");
        let word2 = displayWord.replace("'", "").replace(" ", "");
        let result = 0;
        for (let i = 0; i < word1.length || i < word2.length; i++) {
            result += letterTable[word2[i%word2.length].charCodeAt(0)-0x41][word1[i%word1.length].charCodeAt(0)-0x41].charCodeAt(0) - 0x40;
        }
        result = result % 60 + 1;
        this.stageTwoNumber = result;
        return [this.getStageTwoChartPosition(result)];
    }
    getStageThreeDiagramPosition(button, displayWord) {
        let descriptor = "";
        if (button.position % 2 === 0) descriptor += "L";
        if (button.label.replace("'", "").replace(" ", "").length % 2 === 0) descriptor += "E";
        if ([...displayWord].filter(letter => ["A", "E", "I", "O", "U"].indexOf(letter) !== -1).length % 2 === 1) descriptor += "O";
        if (!this.stageTwoNumber) throw new Error(`This method can only be called after stage 2`);
        if ((function (num) {
            for (let i = 2; i <= Math.sqrt(num); i++)
                if(num % i === 0) return false;
            return num > 1;
        })(this.stageTwoNumber)) descriptor += "P";
        return {
            "": [0],
            "P": [0, 1, 2, 3, 4, 5],
            "O": [0, 1],
            "OP": [5, 6],
            "E": [1, 3, 5],
            "EP": [5, 6],
            "EO": [0, 2, 4],
            "EOP": [2, 3, 4, 5],
            "L": [button.position],
            "LP": [button.position + (button.position % 2 ? 1 : -1)],
            "LO": [2, 3],
            "LOP": [0, 1, 2, 3],
            "LE": [1],
            "LEP": [3],
            "LEO": [2],
            "LEOP": [4],
        }[descriptor];
    }
    getStageThreeReferencePosition(displayWord) {
        return this.getStageOnePosition(displayWord);
    }
    solveThirdStage(prevPosition, prevLabel, referencePosition, referenceLabel, displayWord) {
        if (this.stage !== 2) throw new Error(`This method should only be called on the third stage`);
        this.stage++;
        this.displayWords.push(displayWord);
        this.pressedButtons.push({position: prevPosition, label: prevLabel});
        return this.getStageThreeDiagramPosition(this.stageThreeReferenceButton = {position: referencePosition, label: referenceLabel}, displayWord)
    }
    solveFourthStage(prevPosition, prevLabel, buttons, displayWord) {
        if (this.stage !== 3) throw new Error(`This method should only be called on the fourth stage`);
        this.stage++;
        this.displayWords.push(displayWord);
        this.pressedButtons.push({position: prevPosition, label: prevLabel});
        let visited = [0, 0, 0, 0, 0, 0];
        let position = this.thirdStageReferenceButton.position;
        while (true) {
            let label = buttons[position];
            if (`WHAT?\nPRESS\nYOU\nLEFT\nWAIT\nOKAY\nNO`.split("\n").indexOf(label) !== -1) {
                position -= 2;
                if (position < 0) position += 6;
            }
            if (`YOUR\nHOLD\nYES\nMIDDLE\nLIKE\nUHHH\nDONE`.split("\n").indexOf(label) !== -1) {
                position += 2;
                if (position >= 6) position -= 6;
            }
            if (`BLANK\nRIGHT\nSURE\nYOU’RE\nREADY\nU\nUH UH\nWHAT\nUH HUH\nUR\nNEXT\nNOTHING\nFIRST\nYOU ARE`.split("\n").indexOf(label) !== -1) {
                position = position + (position % 2 ? 1 : -1)
            }
            visited[position]++;
            if (visited[position] > 1) break;
        }
        return this.getStageThreeDiagramPosition(this.stageFourReferenceButton = {position, label: buttons[position]}, displayWord);
    }
    solveFifthStage(prevPosition, prevLabel, displayWord) {
        if (this.stage !== 3) throw new Error(`This method should only be called on the fourth stage`);
        this.stage++;
        this.displayWords.push(displayWord);
        this.pressedButtons.push({position: prevPosition, label: prevLabel});
        let numTable = {
            "READY": [1, 2, 3, 4, 5, 6],
            "FIRST": [4, 5, 6, 2, 1, 3],
            "NO": [2, 6, 4, 1, 3, 5],
            "BLANK": [3, 1, 5, 2, 4, 6],
            "NOTHING": [5, 4, 1, 2, 3, 6],
            "YES": [6, 3, 4, 5, 2, 1],
            "WHAT": [2, 3, 6, 1, 5, 4],
            "UHHH": [5, 1, 4, 3, 6, 2],
            "LEFT": [2, 4, 6, 1, 5, 3],
            "RIGHT": [1, 6, 3, 4, 5, 2],
            "MIDDLE": [2, 3, 1, 5, 4, 6],
            "OKAY": [3, 6, 2, 5, 4, 1],
            "WAIT": [6, 1, 3, 4, 2, 5],
            "PRESS": [4, 2, 5, 6, 1, 3],
            "YOU": [3, 4, 6, 1, 2, 5],
            "YOU ARE": [2, 6, 3, 5, 1, 4],
            "YOUR": [4, 1, 5, 6, 3, 2],
            "YOU'RE": [5, 4, 2, 1, 6, 3],
            "UR": [1, 3, 2, 4, 5, 6],
            "U": [6, 3, 4, 2, 1, 5],
            "UH HUH": [3, 2, 4, 1, 5, 6],
            "UH UH": [5, 4, 3, 6, 1, 2],
            "WHAT?": [4, 1, 2, 3, 5, 6],
            "DONE": [2, 6, 5, 3, 1, 4],
            "NEXT": [5, 2, 4, 3, 6, 1],
            "HOLD": [4, 5, 6, 1, 2, 3],
            "SURE": [3, 4, 1, 6, 2, 5],
            "LIKE": [1, 4, 6, 5, 3, 2],
        };
        function getNum(button) {
            return numTable[button.label][button.position];
        }
        let sum = getNum(this.pressedButtons[0]) + getNum(this.pressedButtons[1])
            + getNum(this.pressedButtons[2]) + getNum(this.pressedButtons[3])
            + getNum(this.stageThreeReferenceButton) + getNum(this.stageFourReferenceButton)
            + this.stageTwoNumber;
        return this.getStageTwoChartPosition(sum % 60 + 1);
    }
}
