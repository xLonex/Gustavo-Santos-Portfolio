//carrosel dos projetos
$(document).ready(function () {
  $(".carrossel").slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });
});
// Menu mobile
let btnMenu = document.getElementById("btn-menu");
let menu = document.getElementById("menu-mobile");
let overlay = document.getElementById("overlay-menu");
let btnFechar = document.querySelector(".btn-fechar");

btnMenu.addEventListener("click", () => {
  menu.classList.add("abrir-menu");
  overlay.style.display = "block";
  btnMenu.style.display = "none";
});

btnFechar.addEventListener("click", () => {
  menu.classList.remove("abrir-menu");
  overlay.style.display = "none";
  btnMenu.style.display = "block";
});

overlay.addEventListener("click", () => {
  menu.classList.remove("abrir-menu");
  overlay.style.display = "none";
  btnMenu.style.display = "block";
});

//Efeito de escrita
const typewriterElement = document.getElementById("typewriter");
const words = [
  "programador",
  "desenvolvedor",
  "freelancer",
  "a solução para seu site",
];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

const type = () => {
  const currentWord = words[wordIndex];
  const currentChar = currentWord.substring(0, charIndex);

  typewriterElement.textContent = currentChar;

  if (!isDeleting) {
    charIndex++;
    if (charIndex <= currentWord.length) {
      setTimeout(type, 100); // Velocidade de digitação
    } else {
      isDeleting = true;
      setTimeout(type, 1000); // Tempo de pausa após digitar
    }
  } else {
    // Apagamento
    charIndex--;
    if (charIndex >= 0) {
      setTimeout(type, 50); // Velocidade de apagamento
    } else {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length; // Avança para a próxima palavra
      setTimeout(type, 500); // Tempo de pausa antes de começar a digitar a próxima palavra
    }
  }
};
type();
// Botão mobile para voltar pro topo
const btnTopo = document.getElementById("btn-topo");
const sectionHome = document.getElementById("home");
const sectionServices = document.getElementById("services");

window.addEventListener("scroll", () => {
  const homeRect = sectionHome.getBoundingClientRect();
  const servicesRect = sectionServices.getBoundingClientRect();

  // Verifica se o usuário está na section services ou abaixo
  if (servicesRect.top <= 0) {
    btnTopo.classList.add("visible"); // Mostra o botão
  } else {
    btnTopo.classList.remove("visible"); // Esconde o botão
  }
});

// Voltar ao topo
btnTopo.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// A partir daqui são configurações dos meus projetos
// login elements
// login elements
const login = document.querySelector(".login");
const loginForm = login.querySelector(".login__form");
const loginInput = login.querySelector(".login__input");

// chat elements
const chat = document.querySelector(".chat");
const chatForm = chat.querySelector(".chat__form");
const chatInput = chat.querySelector(".chat__input");
const chatMessages = chat.querySelector(".chat__messages");

const colors = [
  "cadetblue",
  "darkgoldenrod",
  "cornflowerblue",
  "darkkhaki",
  "hotpink",
  "gold",
];

const user = { id: "", name: "", color: "" };

let websocket;

const createMessageSelfElement = (content) => {
  const div = document.createElement("div");

  div.classList.add("message--self");
  div.innerHTML = content;

  return div;
};

const createMessageOtherElement = (content, sender, senderColor) => {
  const div = document.createElement("div");
  const span = document.createElement("span");

  div.classList.add("message--other");

  span.classList.add("message--sender");
  span.style.color = senderColor;

  div.appendChild(span);

  span.innerHTML = sender;
  div.innerHTML += content;

  return div;
};

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const scrollScreen = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
};

const processMessage = ({ data }) => {
  const { userId, userName, userColor, content } = JSON.parse(data);

  const message =
    userId == user.id
      ? createMessageSelfElement(content)
      : createMessageOtherElement(content, userName, userColor);

  chatMessages.appendChild(message);

  scrollScreen();
};

const handleLogin = (event) => {
  event.preventDefault();

  user.id = crypto.randomUUID();
  user.name = loginInput.value;
  user.color = getRandomColor();

  login.style.display = "none";
  chat.style.display = "flex";

  websocket = new WebSocket("ws://localhost:8080");
  websocket.onmessage = processMessage;
};

const sendMessage = (event) => {
  event.preventDefault();

  const message = {
    userId: user.id,
    userName: user.name,
    userColor: user.color,
    content: chatInput.value,
  };

  websocket.send(JSON.stringify(message));

  chatInput.value = "";
};

loginForm.addEventListener("submit", handleLogin);
chatForm.addEventListener("submit", sendMessage);
