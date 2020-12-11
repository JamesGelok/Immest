import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import "./styles.css";

// Deep Freeze
function deepFreezeAndDisableFunctions(obj) {
  if (typeof obj === "object") {
    for (const child in obj) {
      if (typeof obj[child] === "function") {
        obj[child] = () => console.log("class methods have been disabled");
      } else deepFreeze(obj[child]);
    }
    return Object.freeze(obj);
  }
}




function useClass(myClass: any) {
  
  let wrapper = function(myClass) {
    for (let index in myClass) {
      let val = myClass[index];
      if (typeof val === 'function') {
        this[index] = (...params) => {
          myClass[index].call(this, ...params);
        }
      } else {
        if (typeof val === 'object'){
          this[index] = {...val};
        } else {
          this[index] = val;
        }
      }
    }
  }

  const finalClass = new wrapper(myClass);

  
  const [myClassStateful, setState] = useState(() => finalClass); // 1

  // for ) {
  //   wrapper. = (...params) =  myClass.call(this, ...params)
  // }



  myClassStateful.getStableValue = (valName) => {
    let value = cachedVals.current[valName];
    deepFreezeAndDisableFunctions(value);
    return cachedVals.current[valName];
  };

  const oldClass = new myClass(); // 0

  const draftClass = new myClass(); // 1
  const nonFunctionsinDraft = [
    ...draftClass.butOnlyGiveThingsThatArentFunctions
  ];

  // const oldClass = new myClass()

  // 14234
  myClassStateful.setState = () => setState({ ...myClassStateful });
  // if our setState is called, update obj & return it

  useEffect(() => {});

  // if setState from somewhere else is called, ignore it
  // and pass our untainted old obj

  return myClassStateful;
}

// function usePersistentClass(myClass: any) {
//   const [myClassStateful, setState] = useState(() => new myClass()); // 1

//   //14234
//   myClassStateful.setState = () => setState({ ...myClassStateful });
//   // if our setState is called, update obj & return it

//   useEffect(() => {

//   })

//   // if setState from somewhere else is called, ignore it
//   // and pass our untainted old obj

//   return myClassStateful;
// }

class DateHelper {
  myDate = new Date();

  updateDate = (date) => (this.myDate = date);
  getDate = () => this.myDate;
}

export default function App() {
  const [count, setCount] = useState(0); // 0
  const inc = () => setCount((c) => ++c);

  const [oldClass, newClass] = useCached(DateHelper);

  oldClass.ChangeSomething();
  // const [oldClass, updateToTheNewClass] = useCached(DateHelper);

  const [oldClass, commit, revert] = useJamesCached(DataHelper); // _persistantClass
  oldClass.blah();

  // commit(false)                              commit() || commit(true)
  //    |                                         |
  // oldClass   --------> draftClass --------> newClass
  // immutable
  // prototypeCall
  // is broken
  const [draftClass, oldClass, commit] = useSamJamCached(DataHelper);

  draftClass.getStableValue("myVal"); // aka draftClass.getOldValue('myVal');

  draftClass.myVal;

  draftClass.changeSomething();
  function doSomething() {
    draftClass.blah();
    draftClass.foo();
    draftClass.bar();

    doSomethingElse();
  }

  function doSomethingElse() {
    draftClass.blah();
    draftClass.foo();
    draftClass.bar();

    if (draftClass.cond()) {
      commit();
    } else {
      revert();
    }
  }

  function updateAndSetState() {
    MyDateHelper.foo = "bar";
    MyDateHelper.foo = "1";
    MyDateHelper.foo = "2";
    MyDateHelper.foo = "3";
    MyDateHelper.foo = "4";
    MyDateHelper.foo = "5";

    MyDateHelper.setState();
  }

  function updateAndDontSetState() {
    MyDateHelper.updateDate();

    return;
  }

  const cb = () => {
    // 2
    console.log("count incremented!");
  };
  useEffect(cb, [count]);

  return (
    <div className="App">
      <h1>The Date: {MyDateHelper.getDate().toISOString()}</h1>
      <hr />
      <div>
        <button onClick={updateAndSetState}>I update date AND setState</button>
      </div>
      <hr />
      <div>
        <button onClick={updateAndDontSetState}>
          I update date AND DONT SETSTATE
        </button>
      </div>
      <hr />
      <div>
        <button onClick={inc}>
          I'M AN unrelated button that increments a counter, my count is:{" "}
          {count}
        </button>
      </div>
      <hr />
      <div>
        <button onClick={() => (count = count + 1)}>
          INC COUNT BUT DONT SET STATE:{" "}
        </button>
      </div>
    </div>
  );
}
