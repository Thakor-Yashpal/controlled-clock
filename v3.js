const zeroPadded = number => ((number >= 10) ? number.toString() : `0${number}`);


const twelveClock = (twentyFourClock) => {
    if (twentyFourClock === 0) {
        return 12;
    }
    if (twentyFourClock > 12) {
        return twentyFourClock - 12;
    }
    return twentyFourClock;
};

// 1. SVG clock face
const clockFace = document.querySelector('svg g.clock--face');

for (let i = 0; i < 12; i += 1) {
    clockFace.innerHTML += `
    <text
        transform="rotate(${-90 + 30 * (i + 1)}) translate(34 0) rotate(${90 - 30 * (i + 1)})" >
        ${zeroPadded(i + 1)}
    </text>
  `;
}



const now = new Date();
const hours = now.getHours();
const minutes = now.getMinutes();
const seconds = now.getSeconds();

// as hours in the 0-23 range, normalize the values in the 1-12 range
const time = {
    hours: twelveClock(hours), // 1-12
    minutes, // 0-59
    seconds, // 0-59
};


const rotation = {
    hours: twelveClock(hours),
    minutes,
    seconds,
};


const entries = Object.entries(time);
entries.forEach(([key, value]) => {
    anime({
        targets: `g.${key}`,
        transform: (key === 'hours') ? `rotate(${-15 + value * 30})` : `rotate(${value * 6})`,
        duration: 2000,
    });

    const span = document.querySelector(`span.control--${key}`);
    span.textContent = zeroPadded(value);
});


// BUTTONS click event
const buttons = document.querySelectorAll('button');

function updateValues(instructions) {

    const { key, operation } = instructions;
    const { timeValue, rotationValue } = instructions;


    const degrees = operation === '+' ? rotationValue + 1 : rotationValue - 1;

    let value = operation === '+' ? timeValue + 1 : timeValue - 1;


    if (key === 'hours') {
        value = value > 12 ? 1 : value === 0 ? 12 : value;
    } else {
        value = value > 59 ? 0 : value < 0 ? 59 : value;
    }


    return { value, degrees };
}



function handleClick() {

    const key = this.parentElement.getAttribute('data-control');
    const operation = this.textContent;
    // retrieve the previous values
    const timeValue = time[key];
    const rotationValue = rotation[key];


    const instructions = {
        key,
        operation,
        timeValue,
        rotationValue,
    };
    const { value, degrees } = updateValues(instructions);

    time[key] = value;
    rotation[key] = degrees;

    anime({
        targets: `g.${key}`,
        transform: (key === 'hours') ? `rotate(${-15 + degrees * 30})` : `rotate(${degrees * 6})`,
        duration: 400,


        begin: () => buttons.forEach(button => button.removeEventListener('click', handleClick)),
        complete: () => buttons.forEach(button => button.addEventListener('click', handleClick))
    });


    const span = document.querySelector(`span.control--${key}`);
    span.textContent = zeroPadded(value);
}

buttons.forEach(button => button.addEventListener('click', handleClick));