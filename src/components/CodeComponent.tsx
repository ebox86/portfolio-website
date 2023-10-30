import React, { useState, useEffect }  from 'react';
import Refractor from 'react-refractor';
import { FaClipboard } from 'react-icons/fa'; // Importing clipboard icon from react-icons
import copy from 'clipboard-copy';
import js from 'refractor/lang/javascript';
import ts from 'refractor/lang/typescript';
import java from 'refractor/lang/java';
import batch from 'refractor/lang/batch';
import csharp from 'refractor/lang/csharp';
import css from 'refractor/lang/css';
import go from 'refractor/lang/go';
import xml from 'refractor/lang/xml-doc';
import python from 'refractor/lang/python';
import markdown from 'refractor/lang/markdown';
import json from 'refractor/lang/json';
import sql from 'refractor/lang/sql';

import 'prism-themes/themes/prism-atom-dark.css'; // Import the theme CSS here
import lang from 'refractor/lang/javascript';

Refractor.registerLanguage(js);
Refractor.registerLanguage(ts);
Refractor.registerLanguage(java);
Refractor.registerLanguage(batch);
Refractor.registerLanguage(csharp);
Refractor.registerLanguage(go);
Refractor.registerLanguage(css);
Refractor.registerLanguage(xml);
Refractor.registerLanguage(python);
Refractor.registerLanguage(markdown);
Refractor.registerLanguage(json);
Refractor.registerLanguage(sql);

interface CodeProps {
  value?: {
    language?: string;
    code?: string;
  };
}

const CodeComponent: React.FC<CodeProps> = (props) => {
  const [copied, setCopied] = useState(false);

  var language = props.value?.language === 'plain text' ? 'text' : props.value?.language || 'text';
  const code = props.value?.code || '';

  if(language === 'mysql') {
    language = 'sql'
  }

  const handleCopyClick = () => {
    if (props.value?.code) {
      copy(props.value.code);
      setCopied(true); // Set copied state to true
    }
  };

  useEffect(() => {
    if (copied) {
      // Reset the copied state after a timeout
      const timer = setTimeout(() => {
        setCopied(false);
      }, 1500);

      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [copied]);
  return (
    <div className="flex flex-col rounded-lg bg-[#282c34] shadow-md mb-4 overflow-hidden">
      <div className="flex-1 p-4">
        <Refractor language={language} value={code} />
      </div>
      <div className="bg-gray-700 px-2 py-1 flex justify-between items-center"> 
        <span className="text-xs text-gray-400">
          {language}
        </span>
        <div className="relative">
          <button 
            onClick={handleCopyClick} 
            className="bg-gray-700 hover:bg-gray-600 text-white rounded p-1 focus:outline-none"
            aria-label="Copy to clipboard"
          >
            <FaClipboard size={16} />
          </button>
          {copied && (
            <div className="absolute right-0 bottom-full mb-2 text-xs bg-black text-white p-1 rounded">
              Copied!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CodeComponent;
