import { Outlet } from "react-router-dom"
import Header from "./Components/Header"
import Footer from "./Components/Footer"


function App() {


  return (
    <>
   <Header/>
     <main className="min-h-[78vh] ">
      <Outlet/>
     </main>
     <Footer/>
     </>
  )
}

export default App
