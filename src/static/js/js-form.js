function sendAnswers() {
    const questions = document.getElementsByClassName("questionContainer");
    const answers = [];

    for (let i = 0; i < questions.length; i++) {
        const answer = {
            question: {
                name: questions[i].id.replace(`-${questions[i].id.split('-')[questions[i].id.split('-').length - 1]}`, ''),
                type: parseInt(questions[i].id.split('-')[questions[i].id.split('-').length - 1]),
            },
            text: ""
        };
        if (answer.question.type === 0) answer.text = questions[i].children[1].value;
        else
            for (let j = 1; j < questions[i].children.length; j++)
                if (questions[i].children[j].children[0].checked)
                    answer.text = questions[i].children[j].children[1].textContent;
        answers.push(answer);
    }

    fetch("/answer", {
        method: "POST",
        body: JSON.stringify({ form_id: parseInt(document.getElementById("form-data").children[0].textContent), answers }),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    }).then(async result => {
        const status = result.status;
        result = await result.json();
        if (status === 200) alert("Ответ успешно записан!");
        else alert(result.message);
    });
}

async function deleteForm() {
    if (confirm("Вы действительно хотите удалить форму?"))
        fetch('/form/' + parseInt(document.getElementById("form-data").children[0].textContent)
            , {
                method: 'DELETE',
            }).then(async result => {
                const status = result.status;
                result = await result.json();
                if (status === 200) alert("Форма успешно удалена!");
                else alert(result.message);
            });
}