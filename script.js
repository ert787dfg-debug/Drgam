let questions = [];
let currentIndex = 0;
let score = 0;
let selectedTopic = null;
let selectedSubject = null;

const topicScreen = document.getElementById('topicScreen');
const topicsEl = document.getElementById('topics');
const subjectScreen = document.getElementById('subjectScreen');
const subjectsEl = document.getElementById('subjects');
const startBtn = document.getElementById('startBtn');
const quiz = document.getElementById('quiz');
const qCounter = document.getElementById('questionCounter');
const qEl = document.getElementById('question');
const choicesEl = document.getElementById('choices');
const feedbackEl = document.getElementById('feedback');
const resultPanel = document.getElementById('resultPanel');
const scoreText = document.getElementById('scoreText');
const restartBtn = document.getElementById('restartBtn');
const themeToggle = document.getElementById('themeToggle');
const translateBtn = document.getElementById('translateBtn');

const dataStructure = {
  "الصفحة الأولى": ["أجهزة"]
};

renderTopics();

function renderTopics() {
  topicsEl.innerHTML = '';
  Object.keys(dataStructure).forEach(topic => {
    const li = document.createElement('li');
    li.textContent = topic;
    li.className = 'choice';
    li.addEventListener('click', () => selectTopic(topic));
    topicsEl.appendChild(li);
  });
}

function selectTopic(topic) {
  selectedTopic = topic;
  topicScreen.classList.add('hidden');
  subjectScreen.classList.remove('hidden');
  renderSubjects(topic);
}

function renderSubjects(topic) {
  subjectsEl.innerHTML = '';
  dataStructure[topic].forEach(subject => {
    const li = document.createElement('li');
    li.textContent = subject;
    li.className = 'choice';
    li.addEventListener('click', () => selectSubject(subject));
    subjectsEl.appendChild(li);
  });
}

function selectSubject(subject) {
  selectedSubject = subject;
  subjectScreen.classList.add('hidden');
  startQuiz();
}

async function startQuiz() {
  const res = await fetch('questions.json');
  const allQuestions = await res.json();
  questions = allQuestions.filter(q => q.topic === selectedTopic && q.subject === selectedSubject);
  currentIndex = 0;
  score = 0;
  quiz.classList.remove('hidden');
  renderQuestion();
}

function renderQuestion() {
  const q = questions[currentIndex];
  qCounter.textContent = `السؤال ${currentIndex + 1} من ${questions.length}`;
  qEl.textContent = q.text;
  feedbackEl.textContent = '';
  choicesEl.innerHTML = '';

  q.choices.forEach((choiceText, idx) => {
    const li = document.createElement('li');
    li.className = 'choice';
    li.textContent = choiceText;
    li.dataset.index = idx;
    li.addEventListener('click', () => onSelect(idx, li));
    choicesEl.appendChild(li);
  });
}

function onSelect(idx, li) {
  const q = questions[currentIndex];
  const isCorrect = idx === q.answer;

  Array.from(choicesEl.children).forEach((c, i) => {
    if (i === q.answer) c.classList.add('correct');
    if (i === idx && !isCorrect) c.classList.add('wrong');
  });

  if (isCorrect) {
    score++;
    feedbackEl.textContent = q.feedback.correct;
    feedbackEl.className = 'success';
  } else {
    feedbackEl.textContent = q.feedback.wrong;
    feedbackEl.className = 'error';
  }

  setTimeout(() => {
    if (currentIndex < questions.length - 1) {
      currentIndex++;
      renderQuestion();
    } else {
      showResult();
    }
  }, 1500);
}

function showResult() {
  quiz.classList.add('hidden');
  resultPanel.classList.remove('hidden');
  const total = questions.length;
  const percent = Math.round((score / total) * 100);

  let message = '';
  if (percent >= 80)
