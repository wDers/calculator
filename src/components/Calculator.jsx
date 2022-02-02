import React, { useState, useRef } from "react";
import { btns, BTN_ACTIONS } from "../btnConfig";
import { BiSun } from "react-icons/bi";
import { BsMoon } from "react-icons/bs";
import useDarkMode from "../hooks/useDarkMode";

/* eslint no-eval: 0 */
/* eslint-disable no-unused-vars */

function Calculator(props) {
  const [expression, setExpression] = useState("");
  const [darkTheme, setDarkTheme] = useDarkMode();

  const expRef = useRef(null);

  const handleClick = (item) => {
    const expDiv = expRef.current;
    const action = item.action;

    if (action === BTN_ACTIONS.ADD) {
      animateSpan(item.display);
      const oper = item.display !== "x" ? item.display : "*";
      setExpression(expression + oper);
    }

    if (action === BTN_ACTIONS.DELETE) {
      expDiv.parentNode.querySelector("div:last-child").innerHTML = "";
      expDiv.innerHTML = "";
      setExpression("");
    }

    if (action === BTN_ACTIONS.RELOAD) document.location.reload();

    if (action === BTN_ACTIONS.CALC) {
      if (expression.trim().length <= 0) return;

      expDiv.parentNode.querySelector("div:last-child").remove();

      const cloneNode = expDiv.cloneNode(true);
      const style = cloneNode.style;

      expDiv.parentNode.appendChild(cloneNode);
      style.opacity = 0;

      const transform = `translateY(${-(
        expDiv.offsetHeight - 30
      )}px) scale(0.43)`;

      try {
        const operations = ["+", "-", "x", "/"];
        let res = eval(expression);

        setExpression(res.toString());

        setTimeout(() => {
          style.transform = transform;
          style.opacity = 1;
          style.position = "absolute";
          style.top = "-0.5rem";
          style.fontWeight = "400";
          style.width = "125%";

          for (let i = 0; i < cloneNode.children.length; i++) {
            const span = cloneNode.children.item(i);

            operations.forEach((operation) => {
              if (span.innerHTML.includes(operation)) {
                span.style.color = "#d76061";
                span.style.margin = "0 1rem";
              }
            });

            if (span.innerHTML.includes("(") || span.innerHTML.includes(")")) {
              span.style.color = "#26dbbb";
            }
          }

          expDiv.innerHTML = "";

          animateSpan(Math.floor(res * 100000000) / 100000000);
        }, 200);
      } catch {
        setTimeout(() => {
          style.transform = transform;
          cloneNode.innerHTML = "Syntax err";
        }, 200);
      }
    }
  };

  const animateSpan = (content) => {
    const expDiv = expRef.current;
    const span = document.createElement("span");
    const style = span.style;

    span.innerHTML = String(content).replace(/(.)(?=(\d{3})+$)/g, "$1,");

    style.opacity = "0";
    style.display = "inline-block";
    style.overflow = "hidden";
    style.transition = "width 0.3s ease";
    expDiv.appendChild(span);

    const width = `${span.offsetWidth}px`;
    style.width = "0";

    setTimeout(() => {
      style.opacity = "1";
      style.width = width;
    }, 100);
  };

  const handleColorChange = () => {
    const expDiv = expRef.current;
    const cloneNode = expDiv.cloneNode(true);
    const style = cloneNode.style;

    document.body.classList.contains("dark")
      ? (style.color = "#fff")
      : (style.color = "#7a7c81");
  };

  return (
    <div className="flex flex-col justify-end h-screen w-screen min-w-[280px] bg-white drop-shadow-xl transition ease-out duration-150 md:h-[45rem] md:w-96 md:rounded-2xl dark:bg-[#22252d] dark:transition dark:ease-out dark:duration-150">
      <div className="w-[inherit] flex justify-center absolute top-8">
        <div className="h-2 w-[6.5rem] h-10 bg-bg rounded-full flex justify-between items-center dark:bg-[#292d36]">
          <div
            className="h-[inherit] flex justify-between items-center cursor-pointer"
            onClick={() => setDarkTheme(false) & handleColorChange()}
          >
            <BiSun className="mx-3 w-[23px] h-[23px] text-[#2f323b] dark:text-[#787A7F]" />
          </div>
          <div className="h-[inherit] flex justify-between items-center cursor-pointer">
            <BsMoon
              className="mx-3 w-[20px] h-[20px] text-[#dedede] dark:text-white"
              onClick={() => setDarkTheme(true) & handleColorChange()}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col-reverse items-end justify-end relative text-right mx-8 my-2">
        <div
          className="w-full text-5xl mb-5 text-text font-bold origin-top-right transition ease-in-out duration-300 overflow-hidden dark:text-white"
          ref={expRef}
        ></div>
        <div className="absolute right-0"></div>
      </div>
      <div className="h-[27rem] min-w-[280px] grid grid-cols-4 gap-1 place-items-center bg-bg px-5 pb-5 rounded-t-[2.25rem] md:px-6 dark:bg-[#292d36]">
        {btns.map((item, index) => (
          <button
            key={index}
            className={`text-xl rounded-xl bg-gray dark:text-white border-solid w-14 h-14 font-bold dark:bg-[#272b33] ${item.class}`}
            onClick={() => handleClick(item)}
          >
            {item.display}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Calculator;
