export class Tag {
    constructor(name, tag, color) {
        this.name = name;
        this.tag = tag;
        this.color = color;

        this.button = document.createElement('button');
        this.button.className = 'btn';
        this.button.style.margin = '0.5em'
        this.button.style.backgroundColor = this.color;
        this.button.style.display = 'block';
        this.button.innerHTML = `${this.name} <span>${this.tag}</span>`;
    }
}

