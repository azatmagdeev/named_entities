// const range = new Range();
// console.log(range);
// //
// const element = document
//     .getElementsByClassName('col')[0];
//
// // range.setStart(
// //     element, 3
// // );
// //
// // range.setEnd(
// //     element, 4
// // );
//
// // range.setStartBefore(element.children[1]);
// // range.setEndAfter(element.children[3]);
//
// // range.selectNode(element.children[1]);
// range.selectNodeContents(element.children[2]);
// // range2 = range.cloneRange();
// // console.log(range2);

//
// document.getSelection().addRange(range);
//
// document.addEventListener('selectionchange',()=> {
//     // console.log('ok');
//     const selection = document.getSelection();
//     // selection.removeAllRanges();
//     // range.setEndBefore();
//     // selection.addRange(range);
//     console.log(selection);
// // selection.collapseToEnd();
// });
// const p = document.getElementById('p');
// p.addEventListener('dblclick',()=>{

const redBtn = document.getElementById('red');
const blueBtn = document.getElementById('blue');
const greenBtn = document.getElementById('green');
const buttons = [redBtn,blueBtn,greenBtn];

    document.addEventListener('selectionchange',(e)=>{
        // console.log(e);
        const selection = document.getSelection();
        console.log(selection.toString());

        for (const button of buttons) {
            button.addEventListener('click',()=>{
                const range = new Range();

                range.setStart(selection.anchorNode,selection.anchorOffset);
                range.setEnd(selection.anchorNode,selection.focusOffset);
                // console.log(range);
                //
                // document.getSelection().addRange(range);

                // const str = p.textContent.slice(selection.anchorOffset,selection.focusOffset);
                const str = range.toString();
                // console.log({str});
                if (str === ""){}else{
                    const li = document.createElement('li');
                    li.textContent = `"${str}"`;
                    list.appendChild(li);
                    const span = document.createElement('span');
                    span.className = button.className;
                    range.surroundContents(span);
                    // selection.removeAllRanges();
                }
            });
        }






    });

// });





textarea = document.getElementById('textarea');
list = document.getElementById('list');
textarea.addEventListener('select',(e)=>{
    console.dir(textarea);
// textarea.value.length =
const str = textarea.textContent.slice(textarea.selectionStart,textarea.selectionEnd);

    console.log({str});
    const li = document.createElement('li');
    li.textContent = str;
    list.appendChild(li)
});