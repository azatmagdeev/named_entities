import {Tag} from "./lib.js";

export class Interface {

    constructor(tagList) {
        this.tagList = tagList;
        this.markupList = [];
        this.nextId = 1;
        this.selection = null;

        this.styles = document.getElementById('styles');
        this.saveBtn = document.getElementById('saveBtn');
        this.p = document.getElementById('p');
        this.listElement = document.getElementById('list');
        this.tagListElement = document.getElementById('tagList');
        this.linkElement = document.getElementById('link');
        this.insertForm = document.getElementById('insertText');
        this.loadForm = document.getElementById('loadText');
        this.addTagForm = document.getElementById('addTag');
        this.deleteAllBtn = document.getElementById('deleteAll');

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

            item.button.addEventListener('click', () => {
                if (this.selection) {
                    if (this.selection.anchorNode.parentElement === this.p) {
                        const range = new Range();
                        if (this.selection.focusOffset > this.selection.anchorOffset) {
                            range.setStart(this.selection.anchorNode, this.selection.anchorOffset);
                            range.setEnd(this.selection.anchorNode, this.selection.focusOffset);
                        } else {
                            range.setStart(this.selection.anchorNode, this.selection.focusOffset);
                            range.setEnd(this.selection.anchorNode, this.selection.anchorOffset);
                        }

                        if (range.toString() !== "") {
                            const tag = document.createElement(`${item.tag}`);
                            tag.id = String(this.nextId++);
                            range.surroundContents(tag);
                            tag.innerHTML = tag.textContent + `
                    <span>${item.tag}</span>`;
                            this.markupList.push(tag);
                            this.renderMarkupList();
                            this.selection = null;
                        }
                    }
                }
            });
        })
    }

    addListeners() {
        document.addEventListener('selectionchange', () => {
            this.linkElement.style.display = 'none';
            this.selection = document.getSelection();
        });

        this.deleteAllBtn.addEventListener('click', () => {
            for (let i = this.listElement.children.length - 1; i >= 0; i--) {
                const el = this.listElement.children[i];
                el.querySelector('img').click()
            }
        })

        this.saveBtn.addEventListener('click', () => {
            const xmlStr =
                `<?xml version="1.0" encoding="UTF-8"?><markup>${this.p.innerHTML}</markup>`;
            this.linkElement.href = 'data:text/plain,' + xmlStr;
            this.linkElement.click();
        });

        this.insertForm[1].addEventListener('click', (e) => {
            e.preventDefault();
            this.p.innerHTML = this.insertForm[0].value;
            document.getElementsByTagName('details')[0].open = false;
        })

        this.loadForm[1].addEventListener('click', e => {
            e.preventDefault();
            const file = this.loadForm[0].files[0];
            const reader = new FileReader();
            reader.addEventListener('load', (e) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(`${e.target.result}`, 'text/xml')
                this.p.innerHTML = doc.children[0].innerHTML;
                this.markupList = [...doc.children[0].children];
                console.log(this.markupList);
                this.renderMarkupList();
                document.getElementsByTagName('details')[0].open = false;
            })
            reader.readAsText(file);
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

    renderMarkupList() {
        this.listElement.innerHTML = '';
        this.markupList.map(element => {
            const li = document.createElement('li');
            li.className = 'mb-1';
            li.innerHTML = element.outerHTML;
            const removeBtn = document.createElement('img');
            removeBtn.src = "../img/delete.png";
            removeBtn.style.height = "20px";
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