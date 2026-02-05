//問題

const quiz = [
    {
        question:`「TATTOO」がリリースされたのは2023年4月19日。<br>
                    では、発表されたのはいつ？`,
        choices:['2023年4月2日','2023年4月3日','2023年4月4日','2023年4月5日'],
        answer: 3
    }, 
    {
        question:'「ダーリン。」が収録されている「ラブとピースは君の中」の総曲数は？',
        choices:['8曲','6曲','7曲','9曲'],
        answer: 0
    }, 
    {
        question:'「アポトーシス」の意味とはなに？',
        choices:['細胞の不可逆','計画された細胞死','細胞の可逆','事故的な細胞死'],
        answer: 1
    }, 
    {
        question:'「ESCAPADE」がオマージュしている曲とは？',
        choices:['YAH YAH YAH','September','Shape of You','We Will Rock You'],
        answer: 1
    }, 
    {
        question:'Offical髭男dismが今年リリースした曲数は？(12月29日時点)',
        choices:['5曲','3曲','2曲','6曲'],
        answer: 1
    }
];

let current = 0;
let score = 0;
const title = document.getElementById('title');

//スタート画面
showStart();

function showStart(){
    title.textContent = 'Offical髭男dismについてのクイズページです';
    const box = document.getElementById('quizbox');
    box.innerHTML = `<button onclick="start();">ゲームスタート</button>`;
}

function start(){
    current = 0;
    score = 0;
    showQuestion();
}

//問題
function showQuestion(){
    const q = quiz[current];
    const box = document.getElementById('quizbox');
    title.textContent = `第${current + 1}問`;
    let html = `<p>${q.question}</p>`;
    q.choices.forEach((choice, index) =>{
        html += `<button onclick="answer(${index})">${choice}</button><br>`;
    });
    box.innerHTML = html;
}

function answer(selected){
    const box = document.getElementById('quizbox');
    const correct = quiz[current].answer;
    let html = '';
    if(selected == correct){
        score++;
        html = `<p class="result">正解</p>`;
    }else{
        html = `<p class="result">不正解</p>`;
    }

    box.innerHTML += html;
    setTimeout(() => {
        next();
    }, 5000);
}

function next(){
    current++;
    if(current < quiz.length){
        showQuestion();
    }else{
        showResult();
    }
}

function showResult(){
    const box = document.getElementById('quizbox');
    title.textContent = '結果発表';
    let message = '';
    if(score >= 4){
        message = 'よく知ってましたね！';
    }else{
        message = '知らなくて当然です...勉強しましょう。';
    }
    box.innerHTML =`
        <p>${quiz.length}問中${score}問正解でした！</p>
        <p><strong>${message}</strong></p>
        <button onclick="showStart()">もう一度挑戦する</button>
        `;
}