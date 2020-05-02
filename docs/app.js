// import './books.xml';


const redBtn = document.getElementById('red');
const blueBtn = document.getElementById('blue');
const greenBtn = document.getElementById('green');
const buttons = [redBtn, blueBtn, greenBtn];
const list = document.getElementById('list');
const parseBtn = document.getElementById('parseBtn');

document.addEventListener('selectionchange', (e) => {

    const selection = document.getSelection();
    // console.log(selection);

    for (const button of buttons) {
        button.addEventListener('click', () => {
            console.log(selection.anchorOffset);
            console.log(selection.focusOffset);
            const range = new Range();
            if (selection.focusOffset > selection.anchorOffset) {
                range.setStart(selection.anchorNode, selection.anchorOffset);
                range.setEnd(selection.anchorNode, selection.focusOffset);
            } else {
                range.setStart(selection.anchorNode, selection.focusOffset);
                range.setEnd(selection.anchorNode, selection.anchorOffset);
            }

            // console.log(range);
            const str = range.toString();
            if (str === "") {
                console.log('?????')
            } else {
                const li = document.createElement('li');
                li.textContent = `"${str}"`;
                list.appendChild(li);
                const tag = document.createElement(`${button.textContent}`);
                // tag.className = button.className;
                range.surroundContents(tag);
                tag.innerHTML = tag.textContent + `
<span>${button.textContent}</span>
`;
            }
        });
    }
});


const parser = new DOMParser();


const p = document.getElementById('p');
p.textContent = `Песков заявил о возможном обращении Путина к россиянам 9 мая
16:15 02.05.2020
10940
Президент РФ Владимир Путин во время онлайн-встречи с участниками общероссийской акции взаимопомощи МыВместе
© РИА Новости / Алексей Дружинин
Перейти в фотобанк
МОСКВА, 2 мая — РИА Новости. Президент России Владимир Путин 9 мая обратится к россиянам, заявил его пресс-секретарь Дмитрий Песков.
"Мы ожидаем, что 9 мая президент возложит цветы к Вечному огню и именно оттуда обратится ко всем россиянам", — сказал он в опубликованном анонсе программы "Москва, Кремль. Путин".

До этого глава государства несколько раз обращался к россиянам, последний раз — 28 апреля. Тогда он озвучил результаты работы по мобилизации промышленности и системы здравоохранения, а также дал новые поручения, призванные поддержать экономику и помочь регионам справиться с коронавирусом.
Кроме того, Путин объявил о продлении нерабочих дней до 11 мая.`;

parseBtn.addEventListener('click', () => {
    const xmlStr = `<?xml version="1.0" encoding="UTF-8"?><text>${p.innerHTML}</text>`;
    const xmlDoc = parser.parseFromString(
        xmlStr,
        "text/xml");
    console.log(xmlDoc);

    const reader = new FileReader();
    console.log(reader);

    const type = 'data:text/plain,';
    // var text = 'jxowsjsivneic';
    // const base = window.btoa(xmlStr);
    document.getElementById('test').href = type + xmlStr;
    document.getElementById('test').style.display = 'inline';


});



const fileForm = document.getElementById('my_file');

fileForm.addEventListener('input', () => {
    console.log('ok');
});


const insertForm = document.getElementById('insertText');
console.dir(insertForm[1])
insertForm[1].addEventListener('click', (e) => {
    e.preventDefault();
    p.innerHTML = insertForm[0].value;
    console.dir();
    document.getElementsByTagName('details')[0].open = false;
})

const loadForm = document.getElementById('loadText');
loadForm[1].addEventListener('click',e=>{
    e.preventDefault();
    console.dir(loadForm[0]);
    const file = loadForm[0].files[0];

    const reader = new FileReader();
    reader.addEventListener('load',(e)=>{
        console.log(e);
        p.innerHTML = String(e.target.result);
        document.getElementsByTagName('details')[0].open = false;
    })
    reader.readAsText(file)


    // p.innerHTML = loadForm[0].files[0].toString();
})

// console.log(new File());

