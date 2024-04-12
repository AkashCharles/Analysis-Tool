import React, { useEffect, useState } from "react";

const Docs = () => {
const [Title, SetTitle] = useState("") 
const [Content, SetContent] = useState('')
  
 const documentation = [
  {
    id: "0",
    title: "Algorithms",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 1,
    title:
      "Building blocks of algorithms (statements, state, control flow, functions)",
    content:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 2,
    title: "Notation (pseudo code, flow chart, programming language)",
    content:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  },
  {
    id: 3,
    title: "Algorithmic problem solving",
    content:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  },
  {
    id: 4,
    title:
      "Simple strategies for developing algorithms (iteration, recursion)",
    content:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  },
  {
    id: 5,
    title: "Illustrative problems: find minimum in a list",
    content:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  },
  {
    id: 6,
    title: "Insert a card in a list of sorted cards",
    content:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  },
  {
    id: 7,
    title: "Guess an integer number in a range",
    content:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  },

  {
    id: 8,
    title: "Towers of Hanoi",
    content:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  },
];

function handleOnCLick(title, content) {
  SetTitle(title)

  SetContent(content)
}
  return (

      <div className='flex px-4 gap-0 pt-[90px] capitalize'>
        <div className="w-[15vw] fixed left-[30px] top-[90px] border-r bg-[rgba(255,255,255,0.4)]">
          <h2 className="text-2xl font-bold text-center mt-5 mb-3">Index</h2>
          <div>
            {documentation.map((item) => (
              <div key={item.id} onClick={handleOnCLick(item.title, item.content)}>{item.title}</div>
            ))}
          </div>
        </div>
        <div className="w-[85vw] ml-[16vw]">
          <div className=" bg-[rgba(255,255,255,0.4)] p-10">
            <h1 className="text-3xl font-bold text-center mt-1 mb-3">
              {Title}
            </h1>
            <h2 className="text-2xl text-center font-extrabold">
              dfghfghfdh
            </h2>
            <h2 className="text-2xl font-bold text-center mt-2">
              fgh
              PART - fghhgf
            </h2>
            <div className="border-sp-2 border-gray-200 my-3">
              <h3 className="text-lg font-bold">fhfhg</h3>
              <div>
                {Content}
              </div>
            </div>
          </div>
        </div>
      </div>

  );
};

export default Docs;