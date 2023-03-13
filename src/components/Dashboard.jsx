import { useAuthUser } from "react-auth-kit"
import { useQuery} from "react-query"
import { Route, Routes } from "react-router-dom"
import { getAuth } from "../services/authservice"
import Client from "./Client"
import Clients from "./Clients"
import Fournisseur from "./Fournisseur"
import Fournisseurs from "./Fournisseurs"
import Produits from "./Produits"
import { Profil } from "./Profil"
import Stats from "./Stats"
import Stocks from "./Stocks"
import Unites from "./Unites"
import Users from "./Users"
import Vente from "./Vente"
import VenteDetail from "./VenteDetail"
import Ventes from "./Ventes"

const Dashboard = () => {

 
  const auth = useAuthUser()();
  const qk = ['auth',auth?.id]
  const {data} = useQuery(qk, () => getAuth(auth?.id), {
    stateTime: 100_000,
    refetchOnWindowFocus:false,
  })

  return (
    
    <div className="overflow-x-hidden">
   <div className="drawer drawer-mobile">
    <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
    <div className="drawer-content flex flex-col">
    <div className="navbar bg-sky-500">
    <div className="flex-none">
    
    <button className="btn btn-square btn-ghost">
    <label htmlFor="my-drawer-2" className="btn bg-white drawer-button"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg> </label>
      </button>
    
     
        
    </div>
    <div className="flex-1">
      <a className="btn btn-ghost normal-case text-xl mx-2 text-white">FACTURE PRINT</a>
    </div>
  </div>
  <Routes>
     <Route path="" element={<Ventes auth={data} />} />
     <Route path="profil" element={<Profil auth={data}/>} />
     <Route path="users" element={<Users auth={data}/>} />
     <Route path="stats" element={<Stats auth={data}/>} />
     <Route path="facturations" element={<Ventes auth={data}/>} />
     <Route path="stocks" element={<Stocks auth={data}/>} />
     <Route path="details" element={<VenteDetail auth={data}/>} />
     <Route path="unites" element={<Unites auth={data}/>} />
     <Route path="ventes/:id" element={<Vente/>} />
     <Route path="clients" element={<Clients auth={data}/>} />
     <Route path="clients/:id" element={<Client auth={data}/>} />
     <Route path="fournisseurs" element={<Fournisseurs auth={data}/>} />
     <Route path="fournisseurs/:id" element={<Fournisseur auth={data}/>} />
     <Route path="produits" element={<Produits auth={data}/>} />
     </Routes>
    
    </div> 
    <div className="drawer-side">
      <label htmlFor="my-drawer-2" className="drawer-overlay"></label> 
      <div className="bg-sky-500 w-80">
          <div className=" flex items-center justify-center my-5">
               <div className="avatar">
          <div className="w-24 rounded">
              <img src="/img/shop.png" />
          </div>
          </div>
          </div>
         
          <ul className="menu p-4 w-80 space-y-1">
        <li className="bg-white hover:bg-orange-400 rounded-md shadow-md text-center"><a>UTILISATEURS</a></li>
        <li className="bg-white hover:bg-orange-400 rounded-md shadow-md text-center"><a>FACTURATIONS</a></li>
        <li className="bg-white hover:bg-orange-400 rounded-md shadow-md text-center"><a>CLIENTS</a></li>
        <li className="bg-white hover:bg-orange-400 rounded-md shadow-md text-center"><a>FOURNISSEURS</a></li>
        <li className="bg-white hover:bg-orange-400 rounded-md shadow-md text-center"><a>STOCKS</a></li>
        <li className="bg-white hover:bg-orange-400 rounded-md shadow-md text-center"><a>PRODUITS</a></li>
        <li className="bg-white hover:bg-orange-400 rounded-md shadow-md text-center"><a>UNITES</a></li>
      </ul>
      </div>
      
    
    </div>
  </div>
    </div>
  )
}

export default Dashboard