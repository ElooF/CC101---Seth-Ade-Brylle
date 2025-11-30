const video = document.getElementById('background-video');
const themeSwitch = document.getElementById('themeSwitch');

if (video && themeSwitch) {
  if (localStorage.getItem('theme') === 'night') {
    themeSwitch.checked = true;
    video.src = 'ading/night.mp4';
  }

  themeSwitch.addEventListener('change', () => {
    video.style.opacity = 0;
    setTimeout(() => {
      if (themeSwitch.checked) {
        video.src = 'ading/night.mp4';
        localStorage.setItem('theme', 'night');
      } else {
        video.src = 'ading/day.mp4';
        localStorage.setItem('theme', 'day');
      }
      video.style.opacity = 1;
    }, 400);
  });
}

for (let i = 0; i < 20; i++) {
  const petal = document.createElement("div");
  petal.classList.add("petal");
  petal.style.width = Math.random() * 10 + 13 + "px";
  petal.style.height = petal.style.width;
  petal.style.left = Math.random() * window.innerWidth + "px";
  petal.style.animationDuration = Math.random() * 5 + 5 + "s";
  petal.style.animationDelay = Math.random() * 2 + "s";
  document.body.appendChild(petal);
}

const music = document.getElementById("bgMusic");
const toggleBtn = document.getElementById("musicToggle");
const icon = document.getElementById("musicIcon");

if (toggleBtn && music && icon) {
  music.volume = 0.3;
  toggleBtn.addEventListener("click", () => {
    if (music.paused) {
      music.play();
      icon.src = "ading/mute.png";
    } else {
      music.pause();
      icon.src = "ading/play.png";
    }
  });
}

document.querySelectorAll('.chibi.small, .chibi.medium, .speech-bubble').forEach(el => {
  el.addEventListener('click', () => {
    el.classList.add('clicked');
    setTimeout(() => el.classList.remove('clicked'), 300);
  });
});

function showAbout() {
  const popup = document.getElementById("about-popup");
  if (popup) popup.style.display = "flex";
}

function closeAbout() {
  const popup = document.getElementById("about-popup");
  if (popup) popup.style.display = "none";
}

function openSkins() {
  const modal = document.getElementById("skinsModal");
  if (modal) modal.style.display = "flex";
}

function closeSkins() {
  const modal = document.getElementById("skinsModal");
  if (modal) modal.style.display = "none";
}

function startQuiz() {
  openSkins();
}

function selectSkin(src) {
  localStorage.setItem('selectedCharacter', src);
  window.location.href = "adegame1.html";
}

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 30;
let selectedAnswer = null;

const questions = [
  { question: "Who was the first man created by God?", options: ["Adam", "Noah", "Abraham", "Moses"], answer: 0 },
  { question: "What is the first book of the Bible?", options: ["Exodus", "Genesis", "Leviticus", "Numbers"], answer: 1 },
  { question: "Who built the ark to survive the flood?", options: ["Abraham", "Noah", "David", "Solomon"], answer: 1 },
  { question: "What did God create on the first day?", options: ["Animals", "Light", "Man", "Plants"], answer: 1 },
  { question: "Who led the Israelites out of Egypt?", options: ["Joshua", "Moses", "Aaron", "David"], answer: 1 },
  { question: "What is the greatest commandment according to Jesus?", options: ["Love your neighbor", "Love the Lord your God", "Honor your parents", "Do not steal"], answer: 1 },
  { question: "How many disciples did Jesus have?", options: ["10", "12", "14", "16"], answer: 1 },
  { question: "What is the last book of the Bible?", options: ["Jude", "Revelation", "Hebrews", "James"], answer: 1 },
  { question: "Who was swallowed by a great fish?", options: ["Jonah", "Daniel", "Ezekiel", "Jeremiah"], answer: 0 },
  { question: "What did Jesus turn water into at the wedding in Cana?", options: ["Oil", "Wine", "Bread", "Fish"], answer: 1 },
  { question: "Who is known as the 'Father of Faith'?", options: ["Isaac", "Jacob", "Abraham", "Joseph"], answer: 2 },
  { question: "What is the name of the garden where Adam and Eve lived?", options: ["Eden", "Gethsemane", "Babylon", "Jerusalem"], answer: 0 },
  { question: "Which prophet confronted King Ahab and Queen Jezebel?", options: ["Elijah", "Elisha", "Isaiah", "Jeremiah"], answer: 0 },
  { question: "What is the name of the sea that Moses parted?", options: ["Dead Sea", "Red Sea", "Mediterranean Sea", "Sea of Galilee"], answer: 1 },
  { question: "Who betrayed Jesus for thirty pieces of silver?", options: ["Peter", "Judas Iscariot", "John", "Thomas"], answer: 1 },
  { question: "What is the name of the mountain where Moses received the Ten Commandments?", options: ["Mount Sinai", "Mount Zion", "Mount Carmel", "Mount Olives"], answer: 0 },
  { question: "Who was the strongest man in the Bible?", options: ["David", "Samson", "Goliath", "Solomon"], answer: 1 },
  { question: "What is the first miracle performed by Jesus?", options: ["Healing a blind man", "Feeding the 5000", "Turning water into wine", "Walking on water"], answer: 2 },
  { question: "Who wrote most of the Psalms?", options: ["Solomon", "Moses", "David", "Asaph"], answer: 2 },
  { question: "What is the name of the river where Jesus was baptized?", options: ["Nile", "Jordan", "Euphrates", "Tigris"], answer: 1 },
  { question: "Who was the first king of israel?", options: ["David", "Saul", "Solomon", "Samuel"], answer: 1 },
  { question: "What is the name of the disciple who doubted Jesus' resurrection until he saw Him?", options: ["Peter", "Thomas", "James", "John"], answer: 1 },
  { question: "What fruit did Adam and Eve eat that led to their expulsion from the Garden of Eden?", options: ["Apple", "Fig", "Pomegranate", "The Bible does not specify"], answer: 3 },
  { question: "Who was the mother of Jesus?", options: ["Mary", "Elizabeth", "Martha", "Anna"], answer: 0 },
  { question: "What is the name of the city where Jesus was born?", options: ["Nazareth", "Bethlehem", "Jerusalem", "Capernaum"], answer: 1 },
  { question: "Who was the first person to see Jesus after His resurrection?", options: ["Peter", "Mary Magdalene", "John", "Thomas"], answer: 1 },
  { question: "What is the name of the Jewish festival that celebrates the rededication of the Second Temple?", options: ["Passover", "Hanukkah", "Yom Kippur", "Sukkot"], answer: 1 },
  { question: "Who was the Roman governor who sentenced Jesus to be crucified?", options: ["Herod", "Pontius Pilate", "Caesar Augustus", "Tiberius"], answer: 1 },
  { question: "What is the name of the apostle who wrote the Book of Revelation?", options: ["Paul", "John", "Peter", "James"], answer: 1 },
  { question: "What is the name of the garden where Jesus prayed before His arrest?", options: ["Eden", "Gethsemane", "Babylon", "Jerusalem"], answer: 1 },
  { question: "Who was the first martyr in the Christian church?", options: ["Stephen", "James", "Peter", "Paul"], answer: 0 },
  { question: "What is the name of the sea where Jesus calmed the storm?", options: ["Dead Sea", "Red Sea", "Sea of Galilee", "Mediterranean Sea"], answer: 2 },
  { question: "Who was the prophet that anointed David as king?", options: ["Samuel", "Elijah", "Isaiah", "Jeremiah"], answer: 0 },
  { question: "What is the name of the disciple who denied Jesus three times?", options: ["Peter", "Judas Iscariot", "John", "Thomas"], answer: 0 },
  { question: "What is the name of the city where Paul was imprisoned?", options: ["Rome", "Corinth", "Ephesus", "Philippi"], answer: 3 },
  { question: "Who was the woman who washed Jesus' feet with her tears?", options: ["Mary Magdalene", "Martha", "Mary of Bethany", "Elizabeth"], answer: 2 },
  { question: "What is the name of the mountain where Jesus was transfigured?", options: ["Mount Sinai", "Mount Zion", "Mount Tabor", "Mount Olives"], answer: 2 },
  { question: "Who was the disciple known as the 'beloved disciple'?", options: ["Peter", "John", "James", "Andrew"], answer: 1 },
  { question: "What is the name of the river where Naaman was healed of leprosy?", options: ["Nile", "Jordan", "Euphrates", "Tigris"], answer: 1 },
  { question: "Who was the king known for his wisdom?", options: ["David", "Solomon", "Saul", "Hezekiah"], answer: 1 },
  { question: "What is the name of the disciple who was a tax collector?", options: ["Matthew", "Mark", "Luke", "John"], answer: 0 },
  { question: "What is the name of the city where Jesus performed His first miracle?", options: ["Nazareth", "Cana", "Bethlehem", "Jerusalem"], answer: 1 },
  { question: "Who was the prophet that confronted King David about his sin with Bathsheba?", options: ["Nathan", "Elijah", "Isaiah", "Jeremiah"], answer: 0 },
  { question: "What is the name of the sea where Jonah was swallowed by a great fish?", options: ["Dead Sea", "Red Sea", "Mediterranean Sea", "Sea of Galilee"], answer: 2 },
  { question: "Who was the disciple known for his doubting nature?", options: ["Peter", "Thomas", "James", "John"], answer: 1 },
  { question: "What is the name of the city where Jesus was crucified?", options: ["Nazareth", "Bethlehem", "Jerusalem", "Capernaum"], answer: 2 },
  { question: "Who was the first person to be baptized by John the Baptist?", options: ["Jesus", "Peter", "Andrew", "Philip"], answer: 0 },
  { question: "What is the name of the mountain where Elijah challenged the prophets of Baal?", options: ["Mount Sinai", "Mount Carmel", "Mount Tabor", "Mount Olives"], answer: 1 },
  { question: "Who was the disciple known for his zeal and passion?", options: ["Peter", "John", "James", "Simon the Zealot"], answer: 3 },
  { question: "What is the name of the river where Elisha parted the waters?", options: ["Nile", "Jordan", "Euphrates", "Tigris"], answer: 1 },
  { question: "Who was the king known for his wealth?", options: ["David", "Solomon", "Saul", "Hezekiah"], answer: 1 },
  { question: "What is the name of the disciple who wrote the Gospel of Luke?", options: ["Matthew", "Mark", "Luke", "John"], answer: 2 },
  { question: "What is the name of the city where Jesus performed the miracle of feeding the 5000?", options: ["Nazareth", "Capernaum", "Bethlehem", "Jerusalem"], answer: 1 },
  { question: "Who was the prophet that confronted King Ahab and Queen Jezebel on Mount Carmel?", options: ["Elijah", "Elisha", "Isaiah", "Jeremiah"], answer: 0 },
  { question: "What is the name of the sea that Jesus calmed during a storm?", options: ["Dead Sea", "Red Sea", "Sea of Galilee", "Mediterranean Sea"], answer: 2 },
  { question: "Who was the disciple known for his missionary journeys and letters in the New Testament?", options: ["Peter", "Paul", "James", "John"], answer: 1 },
  { question: "What is the name of the city where Jesus raised Jairus' daughter from the dead?", options: ["Nazareth", "Capernaum", "Bethlehem", "Jerusalem"], answer: 1 },
  { question: "Who was the first person to witness the resurrection of Jesus?", options: ["Peter", "Mary Magdalene", "John", "Thomas"], answer: 1 },
  { question: "What is the name of the Jewish festival that celebrates the giving of the Torah at Mount Sinai?", options: ["Passover", "Shavuot", "Yom Kippur", "Sukkot"], answer: 1 },
  { question: "Who was the Roman governor who presided over the trial of Jesus?", options: ["Herod", "Pontius Pilate", "Caesar Augustus", "Tiberius"], answer: 1 },
  { question: "What is the name of the apostle who wrote the Epistle to the Hebrews?", options: ["Paul", "John", "Peter", "James"], answer: 0 },
  { question: "What is the name of the garden where Jesus prayed before His crucifixion?", options: ["Eden", "Gethsemane", "Babylon", "Jerusalem"], answer: 1 },
  { question: "Who was the first deacon in the early Christian church?", options: ["Stephen", "Philip", "Peter", "Paul"], answer: 0 },
  { question: "What is the name of the sea where Jesus called His first disciples, Peter and Andrew?", options: ["Dead Sea", "Red Sea", "Sea of Galilee", "Mediterranean Sea"], answer: 2 },
  { question: "Who was the prophet that anointed Saul as the first king of Israel?", options: ["Samuel", "Elijah", "Isaiah", "Jeremiah"], answer: 0 },
  { question: "What is the name of the disciple who was a fisherman before following Jesus?", options: ["Matthew", "Mark", "Peter", "John"], answer: 2 },
  { question: "Who was the prophet that foretold the birth of Jesus in Bethlehem?", options: ["Isaiah", "Jeremiah", "Micah", "Daniel"], answer: 2 }
];

function initQuiz() {
  const img = document.getElementById('selectedCharacter');
  const selected = localStorage.getItem('selectedCharacter');
  if (img && selected) img.src = selected;
  loadQuestion();
}

function loadQuestion() {
  const q = questions[currentQuestionIndex];
  document.getElementById('question').textContent = q.question;
  document.getElementById('current-question').textContent = currentQuestionIndex + 1;
  document.getElementById('total-questions').textContent = questions.length;
  document.getElementById('score').textContent = score;

  const positionsContainer = document.getElementById('positions');
  const positionElements = positionsContainer.querySelectorAll('.position');
  q.options.forEach((opt, i) => {
    positionElements[i].textContent = opt;
    positionElements[i].onclick = () => selectOption(i);
    positionElements[i].classList.remove('correct', 'incorrect', 'selected');
    positionElements[i].style.pointerEvents = 'auto';
  });

  const characterImg = document.getElementById('selectedCharacter');
  characterImg.style.transition = 'none';
  characterImg.style.transform = 'translate(0, 0)';
  setTimeout(() => characterImg.style.transition = '', 10);

  selectedAnswer = null;

  timeLeft = 15;
  document.getElementById('timer').textContent = timeLeft;
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      processAnswer();
    }
  }, 1000);

  document.getElementById('question-container').style.display = 'block';
  document.getElementById('result-container').style.display = 'none';
  document.getElementById('end-container').style.display = 'none';
}

function selectOption(index) {
  selectedAnswer = index;
  const positionElements = document.querySelectorAll('.position');
  positionElements.forEach((pos, i) => {
    if (i === index) pos.classList.add('selected');
    else pos.classList.remove('selected');
  });

  // Move character to selected position
  const selectedPos = positionElements[index].getBoundingClientRect();
  const characterImg = document.getElementById('selectedCharacter');
  const charRect = characterImg.getBoundingClientRect();

  const translateX = selectedPos.left + selectedPos.width / 2 - (charRect.left + charRect.width / 2);
  const translateY = selectedPos.top - (charRect.top + charRect.height);
  characterImg.style.transform = `translate(${translateX}px, ${translateY}px)`;

  // Wait 3 seconds, then show feedback and return character
  setTimeout(() => {
    processAnswer();
  }, 3000);
}

function processAnswer() {
  if (timer) clearInterval(timer);

  const q = questions[currentQuestionIndex];
  const positionElements = document.querySelectorAll('.position');

  positionElements.forEach((pos, i) => {
    if (i === q.answer) pos.classList.add('correct');
    else if (i === selectedAnswer && selectedAnswer !== null) pos.classList.add('incorrect');
    pos.style.pointerEvents = 'none';
  });

  document.getElementById('result').textContent =
    selectedAnswer === q.answer
      ? "Correct!"
      : selectedAnswer === null
      ? `Time's up! The correct answer is: ${q.options[q.answer]}`
      : `Incorrect! The correct answer is: ${q.options[q.answer]}`;

  if (selectedAnswer === q.answer) score++;

  // Return character to bottom after showing result
  const characterImg = document.getElementById('selectedCharacter');
  characterImg.style.transform = 'translate(0, 0)';

  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
}

function nextQuestion() {
  currentQuestionIndex++;
  currentQuestionIndex < questions.length ? loadQuestion() : endQuiz();
}

function endQuiz() {
  document.getElementById('final-score').textContent = `Your Score: ${score}/${questions.length}`;
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'none';
  document.getElementById('end-container').style.display = 'block';
}

function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  initQuiz();
}

function goHome() {
  window.location.href = "adegame.html";
}

window.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("adegame1.html")) {
    initQuiz();
  }
});