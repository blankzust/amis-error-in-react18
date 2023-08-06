import { useState } from 'react'
import { render } from 'amis'
import { MainStore } from './store'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Provider } from 'mobx-react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import AMISRenderer from './components/AMISRenderer'

function App() {
  const test = {"pages":[{"id":"1","icon":"fa fa-file","path":"hello-world","label":"Hello world","schema":{"type":"page","title":"Hello world","body":[{"type":"tpl","tpl":"初始页面","wrapperComponent":"","inline":false,"id":"u:f34e8ef68c5c"},{"type":"input-repeat","label":"周期","name":"repeat","id":"u:4b9f53ae2efa"}],"id":"u:da1fafc70cc8"}}],"theme":"cxd","asideFixed":true,"asideFolded":false,"offScreen":false,"addPageIsOpen":false,"preview":false,"isMobile":false,"schema":{"type":"page","title":"Hello world","body":[{"type":"tpl","tpl":"初始页面","wrapperComponent":"","inline":false,"id":"u:f34e8ef68c5c"},{"type":"input-repeat","label":"周期","name":"repeat","id":"u:4b9f53ae2efa"}],"id":"u:da1fafc70cc8"}};

  const store = ((window as any).store = MainStore.create(
    {},
    {
    }
  ));

  return (
    <Provider store={store}>
      <HashRouter>
        <Routes>
          <Route path='/test' element={<AMISRenderer schema={test}/>}></Route>
        </Routes>
      </HashRouter>
    </Provider>
  )
}

export default App
