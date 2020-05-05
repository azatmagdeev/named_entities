// import {Tag} from "./lib.js";

export class Interface {

    constructor(tagList) {
        this.tagList = tagList;
        this.markupList = [];
        this.nextId = 1;
        this.selection = null;
        this.selectedTagList = [];

        this.styles = document.getElementById('styles');
        this.saveBtn = document.getElementById('saveBtn');
        this.p = document.getElementById('p');
        this.listElement = document.getElementById('list');
        this.tagListElement = document.getElementById('tagList');
        this.linkElement = document.getElementById('link');
        this.insertForm = document.getElementById('insertText');
        this.loadForm = document.getElementById('loadText');
        this.selectTagsForm = document.getElementById('selectTags');
        this.deleteAllBtn = document.getElementById('deleteAll');
        this.detailsElement = document.getElementById('details');

        this.renderSelectList();
        this.addListeners();
    }

    renderSelectList() {
        this.tagList.map((item, index) => {
            const div = document.createElement('div');
            div.innerHTML = `<label style=" background-color:${item.color};
            padding:0.5em;
            border-radius: 5px;"><input id=${index} type="checkbox" class="mr-1" checked>${item.button.innerHTML}</label>`;
            div.appendChild(item.button);
            this.selectTagsForm.appendChild(div);
        })

        this.defineSelectedTags()
    }

    defineSelectedTags() {
        this.selectedTagList = [];
        for (const input of this.selectTagsForm) {
            input.checked ? this.selectedTagList.push(this.tagList[input.id]) : null;
        }

        this.renderTagList()
    }

    renderTagList() {
        this.tagListElement.innerHTML = '';
        this.selectedTagList.map((item) => {
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

        this.selectTagsForm.addEventListener('change', () => {
            this.defineSelectedTags();
        })

        this.detailsElement.addEventListener('click', () => {
            this.tagListElement.style.display = 'none';

            setTimeout(() => {
                this.detailsElement.open ? this.tagListElement.style.display = 'none'
                    : this.tagListElement.style.display = 'block';
            }, 0)

        })

        document.addEventListener('selectionchange', () => {
            this.linkElement.style.display = 'none';
            this.selection = document.getSelection();
        });

        this.deleteAllBtn.addEventListener('click', () => {
            for (let i = this.listElement.children.length - 1; i >= 0; i--) {
                const el = this.listElement.children[i];
                el.querySelector('div').click()
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

        // this.addTagForm[3].addEventListener('click', e => {
        //     e.preventDefault();
        //     document.getElementsByTagName('details')[1].open = false;
        //     this.tagList.push(new Tag(
        //         this.addTagForm[1].value,
        //         this.addTagForm[0].value,
        //         this.addTagForm[2].value,
        //     ));
        //     this.renderTagList();
        // });
    }

    renderMarkupList() {
        this.listElement.innerHTML = '';
        this.markupList.map(element => {
            const li = document.createElement('li');
            li.className = 'mb-1';
            li.innerHTML = element.outerHTML;
            const removeBtn = document.createElement('div');
            removeBtn.style.display = 'inline';
            removeBtn.className = 'ml-2'
            removeBtn.innerHTML = `<svg  viewBox="0 0 12 16" width="12" height="16" aria-hidden="true">
                 <path fill-rule="evenodd" d="M11 2H9c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1H2c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1v9c0 .55.45 1 1 1h7c.55 0 1-.45 1-1V5c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 12H3V5h1v8h1V5h1v8h1V5h1v8h1V5h1v9zm1-10H2V3h9v1z"></path>
                 </svg>`
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