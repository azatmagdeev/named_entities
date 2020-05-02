// import './books.xml';


const redBtn = document.getElementById('red');
const blueBtn = document.getElementById('blue');
const greenBtn = document.getElementById('green');
const buttons = [redBtn, blueBtn, greenBtn];
const list = document.getElementById('list');
const parseBtn = document.getElementById('parseBtn');

document.addEventListener('selectionchange', (e) => {

    const selection = document.getSelection();
    console.log(selection.toString());

    for (const button of buttons) {
        button.addEventListener('click', () => {
            const range = new Range();

            range.setStart(selection.anchorNode, selection.anchorOffset);
            range.setEnd(selection.anchorNode, selection.focusOffset);
            const str = range.toString();
            if (str === "") {
            } else {
                const li = document.createElement('li');
                li.textContent = `"${str}"`;
                list.appendChild(li);
                const tag = document.createElement(`${button.textContent}`);
                tag.className = button.className;
                range.surroundContents(tag);
            }
        });
    }
});




const parser = new DOMParser();


const p = document.getElementById('p');
const xmlStr = `<?xml version="1.0" encoding="UTF-8"?>
<text>
    ${p.innerHTML}
</text>`;
parseBtn.addEventListener('click',()=>{

    const xmlDoc = parser.parseFromString(xmlStr, "text/xml");
    console.log(xmlDoc);
});








