(() => {
  function handleMessage(message, sender, response) {
    if (message.chatHistoryPageLoaded) {
      setTimeout(() => {
        insertContent();
      }, 5000);
    }

    if (message.newChatPageLoaded) {
      insertContent();
    }

    response({ received: true });
  }
  chrome.runtime.onMessage.addListener(handleMessage);

  insertCopyButton();
})();

function theme() {
  let theme = localStorage.getItem("theme") || "dark";
  if (theme !== "dark" && theme !== "light") {
    theme = "dark";
  }

  return theme;
}

function createMenuButton() {
  /* create menu button (Hamburger icon) */
  const menuButton = document.createElement("div");
  menuButton.classList.add(
    "sticky",
    "top-0",
    "z-10",
    "flex",
    "items-center",
    "border-white/20",
    "pl-1",
    "pt-1",
    "hidden",
    "md:flex",
    "lg:flex"
  );
  if (theme() === "dark") {
    menuButton.classList.add("text-gray-200");
  } else {
    menuButton.classList.add("bg-white");
  }
  menuButton.innerHTML = `
   <button type="button" id="menu-button" class="-ml-0.5 -mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-md hover:text-gray-900 focus:outline-none focus:ring-2
  focus:ring-inset focus:ring-white dark:hover:text-white ${
    theme() == "light" ? "text-black" : ""
  }">
       <span class="sr-only">Open sidebar</span>
       <svg stroke="currentColor" fill="none" stroke-width="1.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
           <line x1="3" y1="12" x2="21" y2="12"></line>
           <line x1="3" y1="6" x2="21" y2="6"></line>
           <line x1="3" y1="18" x2="21" y2="18"></line>
       </svg>
   </button>
  `;

  return menuButton;
}

function handleMenuIconClick(contentWrapper) {
  const menuIcon = document.getElementById("menu-button");
  menuIcon.addEventListener(
    "click",
    function () {
      const sideBar = document.querySelector(
        ".dark.hidden.bg-gray-900.md\\:fixed.md\\:inset-y-0.md\\:flex.md\\:w-\\[260px\\].md\\:flex-col"
      );

      if (sideBar.style.display === "none") {
        sideBar.style.opacity = "0";
        sideBar.style.transform = "translateX(-10px)";
        sideBar.style.display = "block";
        /* add md:pl-[260px] class, when the side bar
         will be visible the main div will come in the center*/
        contentWrapper.classList.add("md:pl-[260px]");
        /* add small animation */
        setTimeout(function () {
          sideBar.style.opacity = "1";
          sideBar.style.transform = "translateX(0)";
        }, 100);
        menuIcon.style.marginLeft = "0";
      } else {
        sideBar.style.opacity = "0";
        sideBar.style.transform = "translateX(-10px)";
        setTimeout(function () {
          /* animation */ sideBar.style.display = "none";
        }, 300);
        /* when sidebar is hidden, put menu icon on the very left side. */

        /* remove md:pl-[260px] class
         so main div will come to the center side bar will be hidden */
        contentWrapper.classList.remove("md:pl-[260px]");
      }
    },
    false
  );
}

function insertContent() {
  /* create menu button (Hamburger icon) */
  const menuButton = createMenuButton();

  const contentWrapper = document.querySelector(
    ".flex.h-full.flex-1.flex-col.md\\:pl-\\[260px\\]"
  );

  /* check if menu button is not already prepended */
  if (!contentWrapper.contains(menuButton)) {
    contentWrapper.prepend(menuButton);

    /* hide/show sidebar when click on menu icon */
    handleMenuIconClick(contentWrapper);
  }
}

function insertCopyButton() {
  window.setInterval(() => {
    const chatBox = document.querySelector(".flex .flex-col .items-center");

    const messageCards = chatBox.querySelectorAll("main.w-full .border-b");
    //console.log(messageCards);
    const addClipboardBtn = (container, text, type) => {
      if (!container.classList.contains("clipboard-btn")) {
        container.classList.add("clipboard-btn");
        container.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="1.5" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"/></svg>';
        container.addEventListener("click", () => {
          copyToClipboard(text);
        });
        if (type == "question") {
          container.classList.add("clipboard-btn-question");
        } else if (type == "answer") {
          container.classList.add("clipboard-btn-answer");
        }
      }
    };

    messageCards.forEach((chatbox, i) => {
      const impressionContainer = chatbox.querySelector(".flex .self-end");

      const isEven = (i + 1) % 2 === 0;

      if (isEven) {
        const text = chatbox.querySelector(".markdown").innerText;
        addClipboardBtn(impressionContainer, text, "answer");
      } else {
        const text = chatbox.querySelector(
          ".flex.flex-col.items-start"
        ).innerText;
        addClipboardBtn(impressionContainer, text, "question");
      }
    });
  }, 1000);

  function showNotification(message) {
    const notification = document.createElement("div");
    notification.classList.add("notification", "bottom");
    notification.innerText = message;
    document.body.appendChild(notification);
    notification.classList.add("show");
    setTimeout(function () {
      notification.classList.remove("show");
      notification.remove();
    }, 3000);
  }

  async function copyToClipboard(str) {
    try {
      await navigator.clipboard.writeText(str);
      const message = chrome.i18n.getMessage("copiedSuccessfully");
      showNotification(message);
    } catch (err) {
      console.error("There was some error. Please try again later: ", err);
    }
  }
}
