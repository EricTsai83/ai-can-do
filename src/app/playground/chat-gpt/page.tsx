'use client';
import { useState } from 'react';
import SplitPane, {
  Divider,
  SplitPaneBottom,
  SplitPaneLeft,
  SplitPaneRight,
  SplitPaneTop,
} from './components/SplitPane';
import ContentContext from './context/ContentContext';
import ChatGPT from './components/ChatGPT';
import contents from './page-content';

function Page() {
  const [currContent, setCurrContent] = useState(1);

  return (
    <div className="flex h-screen w-screen flex-col px-8 pt-24 xl:w-[calc(100vw-240px)]">
      <ContentContext.Provider
        value={{ contents, currContent, setCurrContent }}>
        <SplitPane className="flex h-full w-full flex-row">
          <SplitPaneLeft>
            <SplitPane className="flex h-full w-full flex-col">
              <SplitPaneTop />
              <Divider className="cursor-row-resize border border-gray-800 hover:border-4 active:border-4" />
              <SplitPaneBottom />
            </SplitPane>
          </SplitPaneLeft>
          <Divider className="cursor-col-resize border border-gray-800 hover:border-4 active:border-4" />

          <SplitPaneRight>
            <div className="h-full rounded-t-lg bg-gray-500">
              <ChatGPT />
            </div>
          </SplitPaneRight>
        </SplitPane>
      </ContentContext.Provider>
    </div>
  );
}

export default Page;
