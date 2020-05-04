import {Tag} from "./lib.js";

export class Interface {

    constructor(tagList) {
        this.tagList = tagList;
        this.markupList = [];
        this.nextId = 1;

        this.styles = document.getElementById('styles');
        this.saveBtn = document.getElementById('saveBtn');
        this.p = document.getElementById('p');
        this.listElement = document.getElementById('list');
        this.tagListElement = document.getElementById('tagList');
        this.linkElement = document.getElementById('link');
        this.insertForm = document.getElementById('insertText');
        this.loadForm = document.getElementById('loadText');
        this.addTagForm = document.getElementById('addTag');

        this.renderTagList();
        this.addListeners();
    }

    renderTagList() {
        this.tagListElement.innerHTML = '';
        this.tagList.map((item) => {
            this.tagListElement.appendChild(item.button);
            this.styles.textContent += `
            ${item.tag}{
            background-color:${item.color};
            padding:2px;
            border-radius: 5px;
            }
            `;
        })
    }

    addListeners() {
        document.addEventListener('selectionchange', () => {
            this.linkElement.style.display = 'none';
            this.handleSelection()
        });

        this.saveBtn.addEventListener('click', () => {
            const xmlStr =
                `<?xml version="1.0" encoding="UTF-8"?><text>${this.p.innerHTML}</text>`;
            this.linkElement.href = 'data:text/plain,' + xmlStr;
            this.linkElement.style.display = 'inline';
        });

        this.insertForm[1].addEventListener('click', (e) => {
            e.preventDefault();
            this.p.innerHTML = this.insertForm[0].value;
            document.getElementsByTagName('details')[0].open = false;
            this.linkElement.style.display = 'none';
        })

        this.loadForm[1].addEventListener('click', e => {
            e.preventDefault();
            const file = this.loadForm[0].files[0];
            const reader = new FileReader();
            reader.addEventListener('load', (e) => {
                this.p.innerHTML = String(e.target.result);
                document.getElementsByTagName('details')[0].open = false;
            })
            reader.readAsText(file);

            this.linkElement.style.display = 'none';
        })

        this.addTagForm[3].addEventListener('click', e => {
            e.preventDefault();
            document.getElementsByTagName('details')[1].open = false;
            this.tagList.push(new Tag(
                this.addTagForm[1].value,
                this.addTagForm[0].value,
                this.addTagForm[2].value,
            ));
            this.renderTagList();
        });
    }

    handleSelection() {
        const selection = document.getSelection();

        this.tagList.map(item => {
            item.button.addEventListener('click', () => {

                const range = new Range();
                if (selection.focusOffset > selection.anchorOffset) {
                    range.setStart(selection.anchorNode, selection.anchorOffset);
                    range.setEnd(selection.anchorNode, selection.focusOffset);
                } else {
                    range.setStart(selection.anchorNode, selection.focusOffset);
                    range.setEnd(selection.anchorNode, selection.anchorOffset);
                }

                const str = range.toString();
                if (str === "") {
                } else {
                    const tag = document.createElement(`${item.tag}`);
                    tag.id = String(this.nextId++);
                    range.surroundContents(tag);
                    tag.innerHTML = tag.textContent + `
                    <span>${item.tag}</span>`;
                    this.markupList.push(tag);
                    this.renderMarkupList();
                }
            });
        })
    }

    renderMarkupList() {
        this.listElement.innerHTML = '';
        this.markupList.map(element => {
            const li = document.createElement('li');
            li.innerHTML = element.innerHTML;
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'x'
            removeBtn.className = 'btn btn-sm btn-outline-danger'
            li.appendChild(removeBtn);
            this.listElement.appendChild(li);

            removeBtn.addEventListener('click', () => {
                document.getElementById(element.id) ?
                    document.getElementById(element.id).outerHTML = element.firstChild.textContent
                    : null;
                this.listElement.removeChild(li);
                this.markupList = this.markupList.filter(value => value !== element)
                this.renderMarkupList();

            })
        })
    }
}