import box from "./box.js";

let init = () => {
  let URLObj = new URL(location.href);
  console.log(URLObj);
  if (document.querySelector("#readme table tbody")) {
    //载入自定义组件样式
    box.styleConfig();
    //载入自定义组件
    box.customElement();

    let audio_player = new Audio();
    audio_player.setAttribute("autoplay", "true");
    document
      .querySelector("#readme table tbody")
      .addEventListener("click", (event) => {
        let parentElement = event.target.parentElement;
        if (parentElement && parentElement.nodeName === "TR") {
          if (parentElement.firstElementChild === event.target) {
            //使用搜索引擎查询发音
            box.goToSearchPronounce(event.target.innerText);
          }
        }
        event.preventDefault();
        event.stopPropagation();
        let audio_url = null;
        if (event.target.nodeName === "TD") {
          let aTag = event.target.querySelector("a");
          if (aTag) {
            audio_url = aTag.getAttribute("href");
          }
        }
        if (event.target.nodeName === "IMG") {
          let aTag = event.target.parentNode.parentNode;
          audio_url = aTag.getAttribute("href");
        }
        if (event.target.nodeName === "G-EMOJI") {
          let aTag = event.target.parentNode;
          audio_url = aTag.getAttribute("href");
        }
        if (audio_url) {
          let desURL = new URL(audio_url);
          if (desURL.protocol === "http:") {
            location.href = audio_url;
          } else {
            audio_player.setAttribute("src", audio_url);
          }
        }
      });

    // 自动为表格的每一行增加“中文含义”列的 title 提示
    let rows = document.querySelectorAll("#readme table tbody tr");
    rows.forEach(row => {
      if (row.children.length >= 5) {
        // 第5列为中文含义
        let meaningTd = row.children[4];
        if (meaningTd && meaningTd.innerText.trim()) {
          meaningTd.setAttribute("title", "中文含义: " + meaningTd.innerText.trim());
          meaningTd.style.color = "#2b7a0b";
        }
      }
    });
    document
      .querySelector("#readme table tbody")
      .addEventListener("mouseover", (event) => {
        let parentElement = event.target.parentElement;
        if (parentElement && parentElement.nodeName === "TR") {
          if (parentElement.firstElementChild === event.target) {
            event.target.setAttribute("title", "点击我打开搜索引擎检索");
            event.target.style.cursor = "pointer";
          }
        }
      });

    let table = document.querySelector("#readme table");
    let parent = table.parentNode;
    let note = document.createElement("span");
    note.innerText = `⚪恢复扩展默认配置⚪`;
    note.setAttribute(
      "class",
      "chinese-programmer-wrong-pronunciation-custom-note-reset"
    );

    note.addEventListener("click", (event) => {
      //重置配置
      event.preventDefault();
      event.stopPropagation();
      box.cleanOpener();
    });
    parent.insertBefore(note, table);
  } else {
    console.log("no found README.md table");
  }
};

export { init };
