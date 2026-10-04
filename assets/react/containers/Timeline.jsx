import React from 'react';

const STEPS = [
    {
        num: 1,
        text: 'Už pri prvotnej konzultácii sa budeme snažiť vypočuť Vaše predstavy a poradiť tak, aby bol finálny výsledok presne podľa Vašich očakávaní.',
    },
    {
        num: 2,
        text: 'Po odsúhlasení vypracujeme cenovú ponuku a prípadnú vizualizáciu pre ešte lepšiu predstavu.',
    },
    {
        num: 3,
        text: 'V čo najkratšom čase prichádza naskladnenie materiálu a samotná výroba.',
    },
    {
        num: 4,
        text: 'Ostáva posledný krok nášho procesu a tým je montáž. Vašu zákazku očistíme, zabalíme, dovezieme a všetko poskladáme do finálnej podoby.',
    },
];

const Timeline = () => {
    return (
        <div className="process">
            <div className="process__list">
                {STEPS.map((step) => (
                    <div className="process__step" key={step.num}>
                        <div className="process__marker">{step.num}</div>
                        <p className="process__text">{step.text}</p>
                    </div>
                ))}
            </div>

            <div className="process__quote">
                <i className="bi bi-quote process__quote-icon"></i>
                Našou najväčšou radosťou je spokojný zákazník, ktorý odporúča naše služby ostatným.
            </div>
        </div>
    );
};

export default Timeline;
