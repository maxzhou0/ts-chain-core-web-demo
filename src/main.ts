import { ChainCore, CurrentStateChainRef } from "ts-chain-core";

type QueryType = string | Document | HTMLElement | EventTarget | null;
const $ = (q: QueryType) => {
  const getQuery = (q: QueryType) => {
    if (q === null || q === undefined) return document.body;
    if (typeof q === "string") {
      return document.querySelector(q) as HTMLElement;
    } else return q as HTMLElement;
  };

  return ChainCore(null)
    .extendRuntime<{ dom: HTMLElement }>()
    .extendInstanceFunctions({
      ready(ch, fn: () => void) {
        ch.runtime.dom.addEventListener("DOMContentLoaded", fn);
      },
      click(ch, fn: (ch: CurrentStateChainRef, event: MouseEvent) => void) {
        ch.runtime.dom.onclick = (event: MouseEvent) => fn(ch, event);
      },
      addClass(ch, className: string) {
        ch.runtime.dom.classList.add(className);
      },
      removeClass(ch, className: string) {
        ch.runtime.dom.classList.remove(className);
      },
      show(ch) {
        ch.runtime.dom.style.display = "";
      },
      hide(ch) {
        ch.runtime.dom.style.display = "none";
      },
      text(ch, str: any) {
        ch.runtime.dom.textContent = str;
      },
      query(ch, q: QueryType) {
        ch.runtime.dom = getQuery(q);
      },
    })
    .query(q);
};

$(document).ready(() => {
  $(".button")
    .extendRuntime({
      clicked: false,
    })
    .click((ch, event) => {
      ch.runtime.clicked = !ch.runtime.clicked;
      if (ch.runtime.clicked) {
        $(event.currentTarget)
          .addClass("clicked")
          .query("h2")
          .hide()
          .query("h1")
          .text("Hello, Chain!")
          .show();
      } else {
        $(event.currentTarget)
          .removeClass("clicked")
          .query("h2")
          .show()
          .query("h1")
          .hide();
      }
    });
});

class Example {
  toChain() {
    return ChainCore(this).extendFunctionsFromObject(Example);
  }
  add(a: number, b: number) {
    console.log(a + b);
  }
  addOne(a: number) {
    return (b: number) => {
      console.log(a + b);
    };
  }
  addEnd(a: number, b: number) {
    return a + b;
  }
}

new Example()
  .toChain()
  .add(3, 5) //8
  .add(4, 7) //11
  .addOne(4)(5)(
    //9
    6
  )(
    //10
    7
  ) //11
  .addEnd(11, 10); //chain ended here
// .add(42,1)  //❌error, chain function break
