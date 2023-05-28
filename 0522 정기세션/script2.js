const title = document.querySelector("h1");

// 1. fetch를 이용해서 데이터 가져오기
const url = "https://api.github.com/users/john-smilga/followers?per_page=100";

const fetchFollowers = async () => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

// 2. 실행하기
const init = async () => {
  const followers = await fetchFollowers();
  title.textContent = "Pagination";

  pages = paginate(followers);
  setupUI();
};

const setupUI = () => {
  displayFollowers(pages[index]);
  displayButtons(btnContainer, pages, index);
};

// 3. displayFollowers로 가져온 정보 가공해서 보여주기
const container = document.querySelector(".container");

const displayFollowers = (followers) => {
  let newFollowers = followers.map((person) => {
    const { avatar_url, login, html_url } = person;

    return `
        <article class="card">
            <img src="${avatar_url}", alt='person'/>
            <h4>${login}</h4>
            <a href="${html_url}" class="btn">view profile</a>
        </article>`;
  });

  newFollowers = newFollowers.join("");
  container.innerHTML = newFollowers;
};

// 4. 페이지 이동 버튼 만들기
//(1) 버튼을 지정해줍니다.
const btnContainer = document.querySelector(".btn-container");

//(2) displayButton 만들기
const displayButtons = (container, pages, activeIndex) => {
    //(3) pageIndex를 이용해서 map -> 활성화된 인덱스와 페이지 인덱스가 같으면, active-btn 
  let btns = pages.map((_, pageIndex) => {
    return `<button class="page-btn ${
      activeIndex === pageIndex ? "active-btn" : ""
    }" data-index="${pageIndex}">
    ${pageIndex + 1}</button>`;
  });

  //(4) next 버튼을 뒤에, prev 버튼을 앞에 넣어줍니다
  btns.push(`<button class="next-btn">next</button>`);
  btns.unshift(`<button class="prev-btn">prev</button>`);
  container.innerHTML = btns.join("");
};

// 5. 페이지 이동하게 만들기
let pages = [];

const paginate = (followers) => {
  const itemsPerPage = 10;
  const numberOfPages = Math.ceil(followers.length / itemsPerPage);
//Math.ceil: 주어진 숫자보다 크거나 같은 숫자 중 가장 작은 숫자를 integer 로 반환
//followers의 길이를 10으로 나눈 것을 numberOfPages에 담기

//Array.from 유사 객체 배열로 처리
  const newFollowers = Array.from({ length: numberOfPages }, (_, index) => {
    const start = index * itemsPerPage;
    return followers.slice(start, start + itemsPerPage);
//followers를 start 값과 start+itemsPerPage 값으로 분리하기
  });

  return newFollowers;
};

// 6. (4+5) 버튼에 이벤트 넣기
let index = 0;

btnContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-container")) return;
  if (e.target.classList.contains("page-btn")) {
    index = parseInt(e.target.dataset.index);
  }

  //next 버튼을 눌렀을 때 index++
  if (e.target.classList.contains("next-btn")) {
    index++;
    if (index > pages.length - 1) {
      index = 0;
    }
  }

//prev 버튼을 눌렀을 때 index--
  if (e.target.classList.contains("prev-btn")) {
    index--;
    if (index < 0) {
      index = pages.length - 1;
    }
  }
  setupUI();
});

init();
