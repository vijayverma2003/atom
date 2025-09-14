"use client";

import { useEffect, useRef, useState } from "react";

const tabsData = [
  {
    label: "Objects",
    active: true,
    component: (
      <div key="objects">
        <p>Objects Tab</p>
      </div>
    ),
  },
  {
    label: "Collections",
    component: (
      <div key="collections">
        <p>Collections Tab</p>
      </div>
    ),
  },
  {
    label: "Settings",
    component: (
      <div key="settings">
        <p>Settings</p>
      </div>
    ),
  },
];

interface TabBarData {
  width: number;
  x: number;
}

const Tabs = () => {
  const tabBarRef = useRef<HTMLDivElement>(null);
  const tabsWrapperRef = useRef<HTMLDivElement>(null);
  const [tabs, setTabs] = useState(tabsData);
  const [bar, setBar] = useState<TabBarData>({ width: 0, x: 0 });

  const moveBar = (i: number) => {
    console.log("Moving Bar Start");
    if (!tabsWrapperRef.current || !tabBarRef.current) return;

    const activeTabs = tabsWrapperRef.current.querySelectorAll(".btn-tabular");
    const activeTab = activeTabs[i];
    if (!activeTab) return;

    const containerX = tabsWrapperRef.current.getBoundingClientRect().left;
    const { width, x } = activeTab.getBoundingClientRect();

    setBar({ width, x: x - containerX });
    console.log(width, x - containerX);
    console.log("Moving Bar End");
  };

  useEffect(() => {
    moveBar(0);
  }, []);

  const handleTabClick = (index: number) => {
    setTabs((prev) =>
      prev.map((tab, i) =>
        index === i ? { ...tab, active: true } : { ...tab, active: false }
      )
    );
    moveBar(index);
  };

  return (
    <section>
      <div
        ref={tabsWrapperRef}
        className="border-b border-light-background mb-8 flex gap-8 relative"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            className="btn-tabular"
            onClick={() => handleTabClick(index)}
          >
            {tab.label}
          </button>
        ))}
        <div
          ref={tabBarRef}
          className="absolute bottom-0 left-0 h-[2px] bg-dark-foreground transition-all duration-300 ease-out rounded-3xl"
          style={{
            width: bar.width,
            transform: `translateX(${bar.x}px)`,
          }}
        ></div>
      </div>
      <div>{tabs.map((tab) => (tab.active ? tab.component : null))}</div>
    </section>
  );
};

export default Tabs;
