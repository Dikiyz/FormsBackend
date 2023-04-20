const questions = {};
let form_name = "";
let form_desc = "";
let next_question_id = 1;

function addQuestion() {
    const questionContainer = document.getElementById('content');
    if (questionContainer.children.length >= 15) return alert("В одну форму нельзя добавить более 15-ти вопросов!");
    questions[new String(next_question_id)] = { name: "", type: 0, data: {} };
    const questionBlock = document.createElement('div');
    questionBlock.className = `questionContainer ${next_question_id}`;

    const inputQuestionName = document.createElement('input');
    inputQuestionName.type = "text";
    inputQuestionName.name = `form_name ${next_question_id}`;
    inputQuestionName.placeholder = "Вопрос";
    inputQuestionName.onchange = (e) => questions[e.target.name.split(' ')[1]].name = e.target.value;
    questionBlock.appendChild(inputQuestionName);

    const pTag = document.createElement('p');
    pTag.id = "questionTypeText";
    pTag.textContent = "Тип вопроса:";
    questionBlock.appendChild(pTag);

    const radioBlock = document.createElement('div');
    radioBlock.id = "variantList";

    const addVariant = document.createElement('button');
    addVariant.style = "display: none;";

    const radio = document.createElement('input');
    radio.type = "radio";
    radio.id = `radio ${next_question_id}-1`;
    radio.checked = true;
    radio.name = `question ${next_question_id}`;
    radio.onchange = (e) => {
        if (questionBlock.children.length < 6) return;
        questionBlock.children[4].remove();
        questions[e.target.name.split(' ')[1]].data = {};
        questions[e.target.name.split(' ')[1]].type = 0;
        addVariant.style = "display: none;";
    };
    radioBlock.appendChild(radio);

    const label = document.createElement('label');
    label.setAttribute('for', `radio ${next_question_id}-1`);
    label.textContent = "Любой ответ";
    radioBlock.appendChild(label);

    const radioBlock2 = document.createElement('div');
    radioBlock2.style = "display: flex";
    radioBlock2.id = "variantList";

    const radio2 = document.createElement('input');
    radio2.type = "radio";
    radio2.id = `radio ${next_question_id}-2`;
    radio2.name = `question ${next_question_id}`;
    radio2.onchange = (e) => {
        if (questionBlock.children.length >= 6) return;
        const addedBlock = document.createElement('div');
        const question = questions[e.target.name.split(' ')[1]];
        question.type = 1;
        question.data = { variants: {}, next_variant_id: 1 };

        const variantList = document.createElement('div');
        variantList.id = "variantList";
        variantList.className = "block";

        addVariant.style = "display: block;";
        addVariant.className = "button";
        addVariant.id = "addVariant";
        addVariant.onclick = (e) => {
            if (variantList.children.length >= 9) return alert("К одному вопросу нельзя добавить более 8-ми вариантов!");
            const variantContainer = document.createElement('div');
            variantContainer.style = "display: flex; justify-content: space-between; width: 400px;";
            variantContainer.id = "variant";
            variantContainer.className = "block";

            const label = document.createElement('input');
            label.type = "text";
            label.id = `${question.data.next_variant_id}`;
            label.className = "variantInput"
            label.onchange = (e) => {
                question.data.variants[e.target.id] = e.target.value;
            }
            variantContainer.appendChild(label);

            const removeBtn = document.createElement('button');
            removeBtn.id = `removeVariant ${question.data.next_variant_id}`;
            removeBtn.className = "removeVariant";
            removeBtn.onclick = (e) => {
                delete question.data.variants[e.target.id.split(' ')[1]];
                variantContainer.remove();
            }
            variantContainer.appendChild(removeBtn);
            // variantList.insertBefore(variantContainer, variantList.children[variantList.children.length - 1]);
            variantList.append(variantContainer);

            question.data.variants[new String(question.data.next_variant_id)] = label.textContent;
            question.data.next_variant_id++;
        }

        // variantList.appendChild(addVariant);
        addedBlock.appendChild(variantList);

        questionBlock.insertBefore(addedBlock, questionBlock.children[questionBlock.children.length - 1]);
    };
    radioBlock2.appendChild(radio2);

    const label2 = document.createElement('label');
    label2.setAttribute('for', `radio ${next_question_id}-2`);
    label2.textContent = "Ответ из предложеннных вариантов";
    radioBlock2.appendChild(label2);
    questionBlock.appendChild(radioBlock);
    questionBlock.appendChild(radioBlock2);

    const removeButton = document.createElement('button');
    removeButton.className = "button";
    removeButton.id = "removeQuestion";
    removeButton.setAttribute('onClick', `deleteQuestion(${next_question_id})`);

    const questionPanel = document.createElement('div');
    questionPanel.style = "display: flex; width: 70px; justify-content: space-between;"
    questionPanel.append(removeButton);
    questionPanel.append(addVariant);
    questionBlock.appendChild(questionPanel);

    questionContainer.appendChild(questionBlock)
    next_question_id++;
}

function createForm() {
    if (form_name.length < 5 || form_name > 120)
        return alert(`Имя формы может содержать от 5-ти до 120-ти символов. Ваше имя содержит ${form_name.length}!`);
    if (form_desc > 500)
        return alert(`Описание формы не может превышать 500 символов. Ваше описание содержит ${form_desc.length}!`);
    if (Object.keys(questions).length == 0)
        return alert('Форма обязательно должна содержать хотябы один вопрос.');

    let questionsToSend = [];
    for (let key in questions) questionsToSend[parseInt(key)] = questions[key];
    questionsToSend = questionsToSend.filter(vary => { return !!vary; });
    questionsToSend = questionsToSend.map(question => {
        let newVariants = [];
        for (let key in question.data.variants) newVariants[parseInt(key)] = question.data.variants[key];
        newVariants = newVariants.filter(vary => { return !!vary; });

        return question = {
            name: question.name,
            type: question.type,
            data: { variants: newVariants }
        }
    });

    fetch("/form/add", {
        method: "POST",
        body: JSON.stringify({ name: form_name, description: form_desc, questions: questionsToSend }),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    }).then(async result => {
        const status = result.status;
        result = await result.json();
        if (status === 200) alert("Форма успешно создана!");
        else alert(result.message);
    });
}

function deleteQuestion(id) {
    for (let key in questions)
        if (key == new String(id)) delete questions[key];

    const mainBlock = document.getElementById('content');
    for (let i = 0; i < mainBlock.children.length; i++) {
        if (parseInt(mainBlock.children[i].className.split(' ')[1]) === id) {
            mainBlock.children[i].remove();
            return;
        }
    }
}

function changeName(value) {
    form_name = value;
}

function changeDesc(value) {
    form_desc = value;
}