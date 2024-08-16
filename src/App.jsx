import React, { useEffect } from 'react';
import './App.css'
import copy from './assets/copy-xxl.png';
import { useState } from 'react';

const App = () => {
    const initialState = {
        pass: "",
        len: 0,
        uppercase: false,
        lowercase: true,
        numbers: false,
        symbols: false,
        checkboxesChecked: 1,
        indicator: '#ccc',
        copyMsg: ""
    };
    const [options, setOptions] = useState(initialState);
    const symb = `~@!#$%^&*()_-+=}]{[:;"'\\|,./?\`]`;
    const optionsChangeHandler = (event) => {
        const { name, value, type, checked } = event.target;
        setOptions({ ...options, [name]: (type == "checkbox") ? checked : value });
        if (type === "checkbox") {
            setOptions({ ...options, [name]: checked, "checkboxesChecked": (checked) ? options.checkboxesChecked + 1 : options.checkboxesChecked - 1 });
        }
        else {
            setOptions({ ...options, [name]: value });
        }
    };
    function getRndInteger(lowerBound, upperBound) {
        return (Math.floor(Math.random() * (upperBound - lowerBound)) + lowerBound);
    }
    function getRndDigit() {
        return getRndInteger(0, 10);
    }
    function getRndLowercase() {
        return String.fromCharCode(getRndInteger(97, 123));
    }
    function getRndUppercase() {
        return String.fromCharCode(getRndInteger(65, 91));
    }
    function getRndSymbol() {
        return symb[getRndInteger(0, symb.length - 1)];
    }
    function shufflePass(pass) {
        for (let i = options.len - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let k = pass[i];
            pass[i] = pass[j];
            pass[j] = k;
        }
        let str = "";
        pass.forEach(e => str += e);
        return str;
    }
    function calcStrength() {
        if (options.lowercase && options.uppercase && (options.symbols || options.numbers) && options.len >= 8) {
            setOptions({ ...options, "indicator": '#90EE90' });
        }
        else if ((options.lowercase || options.uppercase) && (options.symbols || options.numbers) && options.len >= 6) {
            setOptions({ ...options, "indicator": 'yellow' });
        }
        else {
            setOptions({ ...options, "indicator": 'red' });
        }
    }
    
    function submitHandler() {

        if (options.checkboxesChecked == 0) return;

        let listChecked = [];
        const funct = {
            numbers: getRndDigit,
            symbols: getRndSymbol,
            uppercase: getRndUppercase,
            lowercase: getRndLowercase
        };
        const checkboxes = ['uppercase', 'lowercase', 'numbers', 'symbols'];
        checkboxes.forEach((checkbox) => {
            if (options[checkbox]) {
                listChecked.push(funct[checkbox]);
            }
        });
        let newPass = "";
        for (let i = 0; i < options.checkboxesChecked; i++) {
            newPass += listChecked[i]();
        }

        for (let i = 0; i < (options.len - options.checkboxesChecked); i++) {
            let randomInd = getRndInteger(0, options.checkboxesChecked);
            newPass += listChecked[randomInd]();
        }

        newPass = shufflePass(Array.from(newPass));
        setOptions({ ...options, "pass": newPass, len: Math.max(options.checkboxesChecked, options.len) });
    }
    useEffect(() => {
        calcStrength();
    }, [options.pass]);


    async function copyHandler() {
        if (options.pass !== "") {
            try {
                await navigator.clipboard.writeText(options.pass);
                setOptions({ ...options, copyMsg: "Copied!" });
            }
            catch {
                setOptions({ ...options, copyMsg: "Failed!" });
            }
            setTimeout(() => {
                setOptions({ ...options, copyMsg: "" });
            }, 2000);
        }
    }

    return (
        <div className="wrapper w-[100vw] h-[100vh] min-h-[100%] flex justify-center items-center overflow-y-auto">
            <div className="container w-[90%] max-w-[450px]">
                <h1 className="text-[32px] mb-[1.8rem] opacity-80 leading-[2rem] tracking-[2px] font-[600] uppercase text-white text-center">
                    Password Generator
                </h1>
                <div className="displayContainer">
                    <input type="text" readOnly placeholder="PASSWORD" className="display bg-transparent py-[1.15rem] px-[1rem]" value={options.pass} />
                    <button>
                        <span className="copyMsg" style={{opacity: (options.copyMsg==="")?0:1}}>{options.copyMsg}</span>
                        <img src={copy} alt="copy" width="25px" height="25px" onClick={copyHandler} />
                    </button>
                </div>

                <div className="input-container">
                    <div className="length-container">
                        <p>Password Length</p>
                        <p>{options.len}</p>
                    </div>
                    <input type="range" name="len" id="" min="1" max="20" className="slider" step="1" onChange={optionsChangeHandler} value={options.len} style={{backgroundSize: (options.len-1)*100/(19)+'% 100%'}}  />
                    <div className="checkboxes">
                        <div className="check">
                            <input type="checkbox" name="uppercase" id="uppercase" onChange={optionsChangeHandler} checked={options.uppercase} />
                            <label htmlFor="uppercase">Include Uppercase Letters</label>
                        </div>
                        <div className="check">
                            <input type="checkbox" name="lowercase" id="lowercase" onChange={optionsChangeHandler} checked={options.lowercase} />
                            <label htmlFor="lowercase">Include Lowercase Letters</label>
                        </div>
                        <div className="check">
                            <input type="checkbox" name="numbers" id="numbers" onChange={optionsChangeHandler} checked={options.numbers} />
                            <label htmlFor="numbers">Include Numbers</label>
                        </div>
                        <div className="check">
                            <input type="checkbox" name="symbols" id="symbols" onChange={optionsChangeHandler} checked={options.symbols} />
                            <label htmlFor="symbols">Include Symbols</label>
                        </div>
                    </div>
                    <div className="strength-container">
                        <p>
                            Strength
                        </p>
                        <div className="indicator" style={{ backgroundColor: options.indicator, boxShadow: `0 0 12px 1px ${options.indicator}` }}>

                        </div>
                    </div>
                    <button className="generatePass" onClick={submitHandler}>
                        Generate Password
                    </button>
                </div>
            </div>
        </div>
    )
}

export default App