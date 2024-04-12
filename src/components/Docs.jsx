import React, { useState } from "react";

const Docs = () => {
  const [Title, setTitle] = useState("");
  const [Content, setContent] = useState("");

  const documentation = [
    {
      id: "0",
      title: "What is Analysis Tool",
      content:
        "Analysis Tool helps you analyze data and make informed decisions. It provides various tools and features to explore and visualize data.",
    },
    {
      id: 1,
      title: "Step 1 - IFE Matrix",
      content:
        "Step 1 - IFE Matrix: This step involves analyzing internal factors of an organization, such as strengths and weaknesses, to create an Internal Factor Evaluation (IFE) matrix.",
    },
    {
      id: 2,
      title: "Step 2 - EFE Matrix",
      content:
        "Step 2 - EFE Matrix: Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      id: 3,
      title: "Step 3 - CPM Matrix",
      content:
        "Step 3 - CPM Matrix: Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    },
    {
      id: 4,
      title: "Step 4 - BCG Matrix",
      content:
        "Step 4 - BCG Matrix: Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    },
    {
      id: 5,
      title: "Step 5 - IE Matrix",
      content:
        "Step 5 - IE Matrix: Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
    {
      id: 6,
      title: "Step 6 - Space Matrix",
      content:
        "Step 6 - Space Matrix: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: 7,
      title: "Step 7 - Perceptual Map",
      content:
        "Step 7 - Perceptual Map: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: 8,
      title: "Step 8 - Grand Strategy Matrix",
      content:
        "Step 8 - Grand Strategy Matrix: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: 9,
      title: "Step 9 - SWOT Analysis",
      content:
        "Step 9 - SWOT Analysis: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: 10,
      title: "Step 10 - QSPM",
      content:
        "Step 10 - QSPM: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
  ];

  function handleOnClick(title, content) {
    setTitle(title);
    setContent(content);
  }

  return (
    <div className='flex px-4 gap-0 pt-[90px] capitalize'>
      <div className="w-[15vw] fixed left-[30px] top-[90px] border-r bg-[rgba(255,255,255,0.4)]">
        <h2 className="text-2xl font-bold text-center mt-5 mb-3">Index</h2>
        <div>
          {documentation.map((item) => (
            <div key={item.id} onClick={() => handleOnClick(item.title, item.content)}>
              {item.title}
            </div>
          ))}
        </div>
      </div>
      <div className="w-[85vw] ml-[16vw]">
        <div className=" bg-[rgba(255,255,255,0.4)] p-10">
          <h1 className="text-3xl font-bold text-center mt-1 mb-3">{Title}</h1>
          <div className="border-sp-2 border-gray-200 my-3">
            <h3 className="text-lg font-bold">Content</h3>
            <div>{Content}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;
