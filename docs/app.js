class Tag {
    constructor(name, tag, color) {
        this.name = name;
        this.tag = tag;
        this.color = color;
        this.entities = [];
    }

    update(name, tag, color) {
        name ? this.name = name : null;
        tag ? this.tag = tag : null;
        color ? this.color = color : null;
    }
}

class TagList {
    constructor() {
        this.items = [];
    }

    addTagToList(tag) {
        this.items.push(tag);
        return this.items;
    }

    removeTagFromList(tag) {
        return this.items.filter((item) => tag.tag !== item.tag)
    }
}

const buttons = [];

const personTag = new Tag('Персона', 'person', 'rgba(100%, 0%, 0%, 0.4)');
const locationTag = new Tag('Место', 'loc', 'rgba(0%, 0%, 100%, 0.4)');
const timeTag = new Tag('Время', 'time', 'rgba(0%, 100%, 0%, 0.4)');
const tagList = new TagList();

tagList.addTagToList(personTag);
tagList.addTagToList(locationTag);
tagList.addTagToList(timeTag);

const list = document.getElementById('list');
const parseBtn = document.getElementById('parseBtn');

const p = document.getElementById('p');

renderTagList();


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
                // li.textContent = `"${str}"`;
                // list.appendChild(li);
                const tag = document.createElement(`${button.item.tag}`);
                tag.style = `background-color:${button.item.color};
                            padding:2px;
                            border-radius: 5px;`;
                range.surroundContents(tag);
                tag.innerHTML = tag.textContent + `
                <span>${button.item.tag}</span>
                `;
            }
        });
    }
});


const parser = new DOMParser();



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
loadForm[1].addEventListener('click', e => {
    e.preventDefault();
    console.dir(loadForm[0]);
    const file = loadForm[0].files[0];

    const reader = new FileReader();
    reader.addEventListener('load', (e) => {
        console.log(e);
        p.innerHTML = String(e.target.result);
        document.getElementsByTagName('details')[0].open = false;
    })
    reader.readAsText(file)


    // p.innerHTML = loadForm[0].files[0].toString();
})

// console.log(new File());

const addTagForm = document.getElementById('addTag');
addTagForm[3].addEventListener('click', e => {
    e.preventDefault();
    tagList.addTagToList(new Tag(
        addTagForm[0].value,
        addTagForm[1].value,
        addTagForm[2].value,
    ));
    document.getElementsByTagName('details')[1].open = false;

    renderTagList();
});

function renderTagList() {
    document.getElementById('tagList').innerHTML = '';
    tagList.items.map((item) => {
        const button = document.createElement('button');
        button.className = 'btn';
        button.style.margin = '1em'
        button.style.backgroundColor = item.color;
        button.style.display = 'block';
        button.innerHTML = `${item.name} <span>${item.tag}</span>`;
        document.getElementById('tagList').appendChild(button);
        button.item = item;
        buttons.push(button);
    });
}