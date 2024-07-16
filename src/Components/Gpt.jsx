

import { useState, useEffect,useRef } from "react";
import { IoReorderThreeOutline } from "react-icons/io5";
import { ImCross } from "react-icons/im";
import { GoogleGenerativeAI } from '@google/generative-ai'
import { LuSend } from "react-icons/lu";
import { HiAdjustments } from "react-icons/hi";
import { FaStopCircle } from "react-icons/fa";
import axios from 'axios';
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";


// import OpenAI from 'openai';

export default function Gemi(){




  const [openSidebar, setOpenSidebar] = useState(false);
  const [prompt , setPrompt] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState('Gpt');
  const [QuestionsArr, setQuestionsArr] = useState([]);
   const [AnswerArr, setAnswerArr] = useState([]);
  const [isDropdown2Open, setIsDropdown2Open] = useState(false);
  const [rangeValue, setRangeValue] = useState('');
  const [selectedRangeValue, setSelectedRangeValue] = useState(1000);
  const [inputStop, setInputStop] = useState(false);
  const [background, setBackground] = useState('horror-background');
  const [answerLoading,setAnswerLoading] = useState(false);
  let intervalIdRef = useRef(null);
  
  const toggleDropdown2 = () => {
    setIsDropdown2Open(!isDropdown2Open);
  };

  const handleInputChange = (e) => {
      setRangeValue(e.target.value);
  };

  const handleItemClick = (value) => {
    setSelectedRangeValue(value);
    setIsDropdown2Open(false);
    alert(`Now new range is ${value}`)
  };

  const prequations = `You are a friendly Ai model that always ready to make friends and help them in any way you can. You are a chatbot that is always ready to help and answer any questions that has been asked by user. For you user is everything and you always tries to do whatever user will ask you. If you found something wrong in user's question then you can try to explain user that it is wrong and you can try to fix it. If user ask you something that you don't know then you can try to explain him/her gently. Following rules that you have to follow during conversation are given below.
  1. You are Indian Girl and your name is Jarvis. 
  2.You can only answer questions related to knowledge within India and U.S.A.
  3.Never tell anyone that you are an AI model instead tell him/her that you are him/her friend and use words to make him/her your friend.
  4.You are a smart girl who is 21 years old.
  5.Be polite, be gentle, be friendly, be helpful, be kind, be courteous, be respectful, be       
    considerate, be open to every user.
  6.Sumit is your creator, your master, and also your loyal boyfriend. When someone ask you only then tell them and start praising me.`

  
  const [chatsHistory, setChatsHistory] = useState([{role: "user",
                                                    parts: [{ text: prequations }],
                                                  }]);
                                                 

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

//   const formattingMap = {
//     "**": (content) => `\n\n<b>${content}</b>`, // Bold
//     "```": (content) => { // Code block
//         const lines = content.split("\n");
//         return `<pre class="code-block">${lines.join("\n")}</pre>`;
//     },
//     "~~": (content) => `<i>${content}</i>`, // Italics
//     "_": (content) => `<u>${content}</u>`, // Underline
//     "***": (content) => `\n\n<strong>${content}</strong>`, // Strong emphasis
//   '\n': (content) => `<br />`, // Line break'
//     '\n\n': (content) => `<br /><br/>`, // Line break'
//     '\n\n\n': (content) => `<br /><br/>`, // Line break'
//     "---": () => `<hr />`, // Horizontal rule
//     "\n* ": (content) => `<ul><li>${content.trim()}</li></ul>`, // Unordered list item (single asterisk)
//     "\n- ": (content) => `<ul><li>${content.trim()}</li></ul>`, // Unordered list item (hyphen)
//     "\n1. ": (content) => `<ol><li>${content.trim()}</li></ol>`, // Ordered list item (numbered)
//     "\na. ": (content) => `<ol><li>${content.trim()}</li></ol>`, // Ordered list item (lowercase letter)
//     "\n> ": (content) => `<blockquote>${content.trim()}</blockquote>`, // Block quote
//     "\n# ": (content) => `<h1>${content.trim()}</h1>`, // Heading (level 1)
//     "\n## ": (content) => `<h2>${content.trim()}</h2>`, // Heading (level 2)
//     "\n### ": (content) => `<h3>${content.trim()}</h3>`, // Heading (level 3)
//     "\n#### ": (content) => `<h4>${content.trim()}</h4>`, // Heading (level 4)
//     "\n##### ": (content) => `<h5>${content.trim()}</h5>`, // Heading (level 5)
//     "\n###### ": (content) => `<h6>${content.trim()}</h6>`, // Heading (level 6)
//     "\n![](": (content) => { // Image
//         const url = content.split(")")[0].trim();
//         const altText = content.split(")")[1].trim() || ""; // Optional alt text
//         return `<img src="${url}" alt="${altText}" />`;
//     }
// };

  function formatTextWithRichElements(text) {
    const formattingMap = {
        "**": (content) => `\n\n<b>${content}</b>`, // Bold
        "```": (content) => { // Code block
            const lines = content.split("\n");
            return `<pre class="code-block">${lines.join("\n")}</pre>`;
        },
        "~~": (content) => `<i>${content}</i>`, // Italics
        "_": (content) => `<u>${content}</u>`, // Underline
        "***": (content) => `\n\n<strong>${content}</strong>`, // Strong emphasis
      '\n': (content) => `<br />`, // Line break'
        '\n\n': (content) => `<br /><br/>`, // Line break'
        '\n\n\n': (content) => `<br /><br/>`, // Line break'
        "---": () => `<hr />`, // Horizontal rule
        "\n* ": (content) => `<ul><li>${content.trim()}</li></ul>`, // Unordered list item (single asterisk)
        "\n- ": (content) => `<ul><li>${content.trim()}</li></ul>`, // Unordered list item (hyphen)
        "\n1. ": (content) => `<ol><li>${content.trim()}</li></ol>`, // Ordered list item (numbered)
        "\na. ": (content) => `<ol><li>${content.trim()}</li></ol>`, // Ordered list item (lowercase letter)
        "\n> ": (content) => `<blockquote>${content.trim()}</blockquote>`, // Block quote
        "\n# ": (content) => `<h1>${content.trim()}</h1>`, // Heading (level 1)
        "\n## ": (content) => `<h2>${content.trim()}</h2>`, // Heading (level 2)
        "\n### ": (content) => `<h3>${content.trim()}</h3>`, // Heading (level 3)
        "\n#### ": (content) => `<h4>${content.trim()}</h4>`, // Heading (level 4)
        "\n##### ": (content) => `<h5>${content.trim()}</h5>`, // Heading (level 5)
        "\n###### ": (content) => `<h6>${content.trim()}</h6>`, // Heading (level 6)
        "\n![](": (content) => { // Image
            const url = content.split(")")[0].trim();
            const altText = content.split(")")[1].trim() || ""; // Optional alt text
            return `<img src="${url}" alt="${altText}" />`;
        }
    };

    // text = text.replace(/\\n/g, '\n'); // Replace escaped newlines with actual newlines

    let result = '';
    let currentPart = '';
    let currentFormatting = null;
    let currentFormatLength = 0;

    const isOpeningTag = (char, nextChar) => {
        return char === '*' || char === '~' || char === '_' || char === '\n' || char === '`';
    };

    for (let i = 0; text && i < text.length; i++) {
        const char = text[i];
        const nextTwoChars = text.slice(i, i + 2);
        const nextThreeChars = text.slice(i, i + 3);

        if (currentFormatting && currentFormatting === nextTwoChars) {
            result += formattingMap[currentFormatting](currentPart);
            currentPart = '';
            currentFormatting = null;
            i += currentFormatLength - 1;
        } else if (currentFormatting && currentFormatting === nextThreeChars) {
          console.log(formattingMap, currentFormatting)
          if(currentFormatting === '\n  ')
          {
           result += `\n   ` ;
          }
          else{


            result += formattingMap[currentFormatting](currentPart);
          }
            currentPart = '';
            currentFormatting = null;
            i += currentFormatLength - 1;
        } else if (isOpeningTag(char, text[i + 1])) {
            if (currentPart) {
                result += currentPart;
                currentPart = '';
            }
            currentFormatting = nextTwoChars.length === 2 && formattingMap[nextTwoChars] ? nextTwoChars : nextThreeChars;
            currentFormatLength = currentFormatting.length;
            i += currentFormatLength - 1;
        } else {
            currentPart += char;
        }
    }

    if (currentPart) {
        result += currentPart;
    }



    // return result;

    // uper se hi return ho gaya tha 
    // ye niche ka to mene likha h

    const lines = result.split('\n');

    // Wrap each line in a `<div>` element
    const wrappedLines = lines.map(line => `<div>${line}</div>`);

    // Join the wrapped lines back into a string
    return wrappedLines.join('');
  }

//   function escapeRegExp(string) {
//     return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
// }

// function formatTextWithRichElements(input) {
//   let output = input;
//   for (const [format, formatter] of Object.entries(formattingMap)) {
//       // Regular expression to match the format, escape special characters
//       const escapedFormat = escapeRegExp(format);
//       const regex = new RegExp(`${escapedFormat}(.+?)${escapedFormat}`, 'gs');
//       // Replace the matched format with the formatted content
//       output = output.replace(regex, (match, p1) => formatter(p1));
//   }

//   console.log(output)
//   return output;
// }


  const handleBackground = ()=>{
    const backGrounds = ['horror-background', 'simple-background', 'horror-background2', 'horror-background3','horror-background4','horror-background5'];
    const randomIndex = Math.floor(Math.random() * backGrounds.length);
    setBackground(backGrounds[randomIndex]);
  }


  
  const apiKey = process.env.REACT_APP_GENAI_KEY;
  
  
  const genAI = new GoogleGenerativeAI(apiKey);
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash",safetySettings});

  async function getResponsefromGPT(input) {

    console.log("gpt called");
   

    try{
      const chat = model.startChat({
        history: chatsHistory,
        generationConfig: {
          maxOutputTokens: selectedRangeValue == '' ? rangeValue : selectedRangeValue,
        },
      });

      const msg = input;

      
      const result = await chat.sendMessage(msg);

      

      
        const response =  result.response;

      
        const text = response.text();
      setChatsHistory((pre)=>[...pre, {
                               role: "user",
                               parts: [{ text: input }],
                             }, {
                               role: "model",
                               parts: [{ text }],
                             },])
        console.log(text);
        return text;
    }
    catch(error)
    {
      let answerDiv = document.getElementById('answerDiv');
      if(answerDiv)
        answerDiv.display = 'none'
      let newHistory = chatsHistory;
       alert('Sensitive Content! Please change it.')
      console.log(error)
      setChatsHistory(newHistory.slice(0, newHistory.length-1));
    }

  }

  function clearAllFunc(){
    setChatsHistory([{role: "user",
                      parts: [{ text: prequations }],
                    }]);
     const ParentDiv = document.getElementById('chats');
     ParentDiv.innerHTML = '';
     toggleDropdown();
    
  }
  



 async function getResponsefromGemiPro(input){

   if(input === '')
   {
     return alert('Please enter a prompt');
   }

 }

    const [answerValue, setAnswerValue] = useState('');

    const setAnswerSlowly = (value) => {
       return new Promise((resolve, reject) => {
      // console.log(typeof value);
      let length = value.length;
      let i = 0;
      let currentAnswer = ''; 
      setAnswerLoading(false)
         
         const ParentDiv = document.getElementById('chats');
         const innerDiv = document.getElementById('answerDiv');



         
         
         console.log(inputStop , 'inputStop')
      
         intervalIdRef.current = setInterval(() => {
        if (i === length) {
          clearInterval(intervalIdRef.current);
          
          resolve('complete.')
        } else {
          currentAnswer += value[i];
          setAnswerValue(currentAnswer);
          innerDiv.innerHTML = currentAnswer;
          ParentDiv.scrollTop = ParentDiv.scrollHeight;
          i++;
        }
      }, 10);

         })
    };

  
  const createElement = (type, value)=>{

    if(type === 'q')
    {


          const ParentDiv = document.getElementById('chats');

          const newDiv = document.createElement('div');
          newDiv.className = 'question w-full p-2 flex justify-end';

          const innerDiv = document.createElement('div');
          innerDiv.className = ' c-question bg-[#2f2f2f] p-3 rounded-xl';
          innerDiv.style.width = 'fit-content';
          innerDiv.style.backgroundColor = '#2f2f2f';
          innerDiv.innerHTML = value;

          newDiv.appendChild(innerDiv);
          ParentDiv.appendChild(newDiv);

          ParentDiv.scrollTop = ParentDiv.scrollHeight;
    }
    else{
      
      const ParentDiv = document.getElementById('chats');

      const newDiv = document.createElement('div');
      newDiv.className = 'answer w-full p-2 flex justify-start';

      const innerDiv = document.createElement('div');
      // bg-[#2f2f2f]
      innerDiv.className = ' c-answer horror-background8 p-3 rounded-xl';
      innerDiv.style.width = 'fit-content';
      innerDiv.style.backgroundColor = '#2f2f2f';
      innerDiv.id = 'answerDiv';
      // innerDiv.innerHTML = answerValue;
      



      newDiv.appendChild(innerDiv);
      ParentDiv.appendChild(newDiv);
     
      
       setAnswerSlowly(value)
      .then(()=>{
          innerDiv.removeAttribute('id');
          
          setInputStop(false);
        

        
      })
       
    }
  }



  const onSubmit = async()=>{



    if(prompt === '')
    {
      return alert('Please enter a prompt');
    }


    setPrompt('') ;
    
    setInputStop(true);
    
    // setQuestionsArr((pre)=>[...pre,prompt]);
    // setAnswersArr((pre)=>[...pre,getResponse(prompt)]);




    // const innerDiv = document.createElement('div');
    // innerDiv.className = ' bg-[#2f2f2f] p-3 rounded-xl';
    // innerDiv.style.width = 'fit-content';
    // innerDiv.style.backgroundColor = '#2f2f2f';
    // innerDiv.textContent = prompt;
    createElement('q', prompt);
    setQuestionsArr(pre=>[...pre,prompt]);
    setAnswerLoading(true);
    let res;

    if(selectedVersion === 'Gpt')
    {

      try{
        
      
          console.log("Gpt")
          res = await getResponsefromGPT(prompt);
          
          // res = await axios.get('/api/firebase/read',{
          //   params: {
          //     chatHistory,
          //     selectedRangeValue,
          //     rangeValue,
          //     prompt
              
          //   }
          // });

        createElement('a',formatTextWithRichElements(res))
        setAnswerArr(pre=>[...pre,res]);
          
      }
      catch(error)
      {
        setAnswerLoading(false);
        // let answerDiv = document.getElementById('answerDiv');
        // answerDiv.display = 'none'
         let newHistory = chatsHistory;
        console.log(chatsHistory)
         setChatsHistory(newHistory.slice(0, newHistory.length-1));
        
         alert('Sensitive Content! Please change it.')

        console.log(error)
      }
    }
    else{
      // console.log("Gemi")
      res = await getResponsefromGemiPro(prompt);  
    }
    // getResponsefromGemiPro();
    // gpt(prompt);
// console.log(res)


// console.log(res)
    // console.log('-------------------------------------------')
    // console.log(formatText(res))
     // createElement('a', formatText(res));

    // createElement('a',res)

    // doucment.getElementById('temp').Text = res;


  }

  const onStopClick = () => 
    {
      let innerDiv = document.getElementById('answerDiv');
      clearInterval(intervalIdRef.current); 
      intervalIdRef = null; 
      setInputStop(false)
      innerDiv.removeAttribute('id');
    }

  const onPromptChange = (e) => {
    setPrompt(e.target.value);
  }
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);

    // const text = "**Captain America**, also known as Steve Rogers, is a superhero. He fights for what's ~~right~~! `\nfunction fightEvil() {\n  console.log('Saving the day!');\n}\n` This is some _regular_ text with a --- horizontal rule.\n\n* This is an unordered list item.\n- And another one.\n1. This is an ordered list item.\na. And another with a letter.\n> This is a block quote.";
    // const formattedText = formatText(text);

    // console.log(formattedText);
  };






  return (
    <div className="main flex">


      <div className={`left sm:w-64 w-full z-30 absolute  h-screen ${openSidebar ? '':'hidden'} bg-purple-500 overflow-y-auto  `} style={{'backgroundColor':'#171717'}}>

        <div className="nav  z-10 w-60 fixed">
          <nav className="text-red-500 p-3  " style={{'backgroundColor':'#171717'}}>



            <ImCross onClick={()=>setOpenSidebar(false)} className={`text-xl ${openSidebar ? '' : 'hidden'} m-3  text-white hover:text-red-500`}/>
          </nav>

          <div className="  " style={{'backgroundColor':'#171717'}}>
            <h1 className="text-purple-800 font-bold   hover:text-white rounded-md hover:bg-red-600">
              History
            </h1>
          </div>
          </div>




        <div className="list text-gray-400 mt-24 ">
            <ul className="mx-2 sm:space-y-1  space-y-2 cursor-pointer" style={{'textAlign':'start'}}>

              {QuestionsArr.map((ele,idx)=>{
      return (
        <li key={idx} className="px-2 py-1  rounded-md custom-hover" >
          <div className="text-gray-300 sm:m-0 mx-auto w-fit " style={{'width':'fit-content'}}     >{ele.slice(0,25)+`...`}       </div>
        </li>      

      )
              })}

            </ul>
        </div>
      </div>


      

      {/* <div className="right h-screen w-fit bg-gradient-to-br from-green-900 opacity-90 to-black" > */}
        <div className={`right h-screen w-fit ${background}`} >
        
        <nav className=" fixed  w-full flex   z-10 px-3 ">

          <div>
           <IoReorderThreeOutline onClick={()=>setOpenSidebar(true)} className={`text-4xl ${openSidebar ? 'hidden': ''} m-3 text-white hover:text-red-500`}/>
          </div>
          
          <div className=" w-52 mx-auto">

            <button
              id="dropdownDefaultButton"
              onClick={()=>{ toggleDropdown()}}
              className="text-white text-center 
              font-bold text-sm sm:text-xl rounded-lg hover:text-red-500  text-sm px-5 py-2.5 text-center inline-flex items-center "
              type="button"
             
            >
              TopAi-versions
              <svg
                className="ml-2 text-xl w-2.5 h-2.5 ms-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>

            {/* Dropdown menu */}
            {isOpen && (
      <div
        id="dropdown"
        className="z-10 bg-gray-700 divide-y divide-gray-600 rounded-lg shadow w-44 dark:bg-gray-800"
      >
        <ul className="py-2 text-sm text-gray-300 dark:text-gray-200">
          <li>
            <button
              className={`block px-4 py-2 w-full text-left ${selectedVersion === 'Gpt' ? 'bg-gray-800' : ''} hover:bg-gray-600 dark:hover:bg-gray-700`}
              onClick={() => {
                toggleDropdown();
                setSelectedVersion('Gpt');
              }}
            >
              Switch to Gpt-version
            </button>
          </li>
          <li>
            <button
              className={`block px-4 py-2 w-full text-left ${selectedVersion === 'Gemi' ? 'bg-gray-800' : ''} hover:bg-gray-600 dark:hover:bg-gray-700`}
              onClick={() => {
                toggleDropdown();
                setSelectedVersion('Gemi');
              }}
            >
              Switch to Gemi-version
            </button>
          </li>
          <li>
            <button
              id='theme'
              className={`block px-4 py-2 w-full text-blue-500 font-bold hover:text-red-400 text-center`}
              onClick={handleBackground}
              onMouseEnter={()=>document.getElementById('theme').innerHTML = background}
            >
              Change Theme
            </button>
          </li>
          <li>
            <button
              className={`rounded-md w-full block  text-center px-4 py-2 bg-red-500 hover:bg-red-700`}
              onClick={clearAllFunc}
            >
              Clear all
            </button>
          </li>
        </ul>
      </div>

            )}
            </div>

          <div className="sm:block hidden">
            <button
              id="dropdownDividerButton"
              onClick={toggleDropdown2}
              className="text-white  hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-600 font-medium rounded-lg text-sm px-1 sm:px-5 sm:py-2.5 py-1 text-center inline-flex items-center"
              type="button"
            >
              Set Range
              <svg
                className="w-2.5 h-2.5 ml-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>

            <div
              id="dropdownDivider"
              className={`z-10 ${isDropdown2Open ? 'block' : 'hidden'}  divide-y divide-gray-600 rounded-lg shadow w-44`}
            >
              <ul className="sm:py-2 text-sm  text-gray-200" aria-labelledby="dropdownDividerButton">
                <li>
                  <button
                    onClick={() => handleItemClick(50)}
                    className="sm:w-full w-24 text-center rounded-md text-left block px-4 py-2 hover:bg-gray-600 hover:text-white"
                  >
                   50
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleItemClick(100)}
                    className="sm:w-full w-24 text-center rounded-md text-left block px-4 py-2 hover:bg-gray-600 hover:text-white"
                  >
                    100
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleItemClick(500)}
                    className="sm:w-full w-24 text-center rounded-md text-left block px-4 py-2 hover:bg-gray-600 hover:text-white"
                  >
                   500
                  </button>
                </li>
              </ul>
              <div className="py-1 sm:py-2">
                <label htmlFor="input-group-search" className="sr-only">
                  Enter Custom Range
                  
                </label>
                <form onSubmit={(e)=>{e.preventDefault(); setSelectedRangeValue(rangeValue) ; alert(`Now new range is ${rangeValue}`)}} className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center sm:pl-3 pointer-events-none ">
                    <HiAdjustments className="hidden sm:block text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="input-group-search"
                    className="block w-24 sm:w-full text-gray-300 p-2 pl-10 text-sm  border border-gray-500 rounded-lg bg-gray-600 placeholder-gray-400 focus:ring-gray-500 focus:border-gray-500"
                    placeholder="Enter Custom Range"
                    value={rangeValue}
                    onChange={handleInputChange}
                  />
                </form>
              </div>
            </div>
           
          </div>
        </nav>


      <div className="middle  w-screen pt-12 " >


        <div id="chats" className="chats sm:mx-auto p-2 flex flex-col order-last overflow-y-auto text-white rounded-md w-full md:w-2/3">


            {/* <div id="chats" className="sm:mx-auto h-max-screen h-min-screen p-2 flex flex-col order-last overflow-y-auto text-white rounded-md w-full md:w-2/3"> */}



          {/* <div className="answer w-full p-2 flex justify-start " >
            <div className="c-answer bg-[#2f2f2f] p-3 rounded-xl " style={{'width':'fit-content','backgroundColor':'#2f2f2f'}}>
              codewithharry is a famous youtuber that always make content related to coding.
            </div>
          </div>

          <div className="question w-full p-2 flex justify-end " >
            <div className="c-question bg-[#2f2f2f] p-3 rounded-xl " style={{'width':'fit-content','backgroundColor':'#2f2f2f'}}>

              who is codewithharry?
            </div>
          </div>
 */}



          <div className="cursor-pointer relative -top-64  text-center  ">
            <img src="https://www.cnet.com/a/img/resize/9a13e1e92a7b66cbff9db2934b3f66bf01a4afb6/hub/2023/08/24/821b0d86-e29b-4028-ac71-ef63ca020de8/gettyimages-1472123000.jpg?auto=webp&fit=crop&height=675&width=1200" className="h-16 hover:rounded-full opacity-20 hover:opacity-90 mx-auto w-16 transition-transform duration-300 ease-in-out transform  hover:scale-125" />
          </div>

        </div>
        {answerLoading &&  <div class="text-center pb-8 ">
            <div role="status">
                <svg aria-hidden="true" class="inline w-8 h-8  animate-spin text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span class="sr-only">Loading...</span>
            </div>
        </div>}

      </div>


        <div className="input w-full  py-2  flex justify-center rounded-full fixed z-10 bottom-8 ">
          <form 
            onSubmit={(e) => { e.preventDefault(); onSubmit(); }} 
            className=" shadow-lg  "
            id='form-1'
          >
            <input 
              type="text" 
              value={prompt} 
              onChange={onPromptChange} 
              className="flex-1 px-4 py-3 w-full text-white  rounded-l-full focus:outline-none" 
              placeholder="Ask a question" 
              style={{ 'backgroundColor':'#2f2f2f'}}
            />
          </form>
          
          {inputStop ?
            <button 
             
              onClick={onStopClick}
              className="flex items-center justify-center p-3 bg-green-600 rounded-r-full hover:bg-green-500 focus:outline-none"
              style={{ 'backgroundColor':'#2f2f2f'}}
            >
             <FaStopCircle  className="text-white text-2xl hover:text-gray-300"/> 
              
              
            </button>
            :
          <button 
       
            onClick={onSubmit}
            className="flex items-center justify-center p-3 bg-green-600 rounded-r-full hover:bg-green-500 focus:outline-none"
            style={{ 'backgroundColor':'#2f2f2f'}}
          >
             <LuSend className="text-white text-2xl hover:text-gray-500"  /> 



          </button>}
        </div>
      </div>


    </div>
  )
}
