export const Profil = ({auth}) => {
  return (
    <>
    <div className="flex flex-wrap mt-6 -mx-3">
    <div className="w-full px-3 mb-6 lg:mb-0 lg:flex-none">
      <div className="relative flex flex-col h-40 min-w-0 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border">
        <div className="flex-auto p-4">
          <div className="flex flex-wrap -mx-3">
            <div className="max-w-full px-3 lg:w-1/2 lg:flex-none">
              <div className="flex items-center justify-center h-full">
                <h5 className="font-bold text-3xl">Mon Profil</h5>
                <img className="relative z-20 w-32 pt-6 h-32" src="/img/profil.png" alt="logo_profle" />
              </div>
            </div>
           
          </div>
        </div>
      </div>
    </div>
  </div>
 <div className="w-full my-10 mx-5">
  <div className="flex flex-col h-full bg-white border-0 shadow-soft-xl rounded-2xl">
    <div className="p-4 bg-white border-b-0 rounded-t-2xl">
      <div className="flex">
        <div className="flex items-center w-full md:w-8/12 md:flex-none">
          <h6 className="mb-0">Mes Informations</h6>
        </div>
      </div>
    </div>

    <div className="p-4 w-full flex items-center justify-center">
      <ul className="flex flex-col mb-0 rounded-lg w-full">
        <li className="relative block px-4 py-2 pt-0 pl-0 leading-normal bg-white border-0 rounded-t-lg text-sm text-inherit"><strong className="text-slate-700">Prenom:</strong> &nbsp; {auth?.prenom}</li>
        <li className="relative block px-4 py-2 pt-0 pl-0 leading-normal bg-white border-0 rounded-t-lg text-sm text-inherit"><strong className="text-slate-700">Nom:</strong> &nbsp; {auth?.nom}</li>
        <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-sm text-inherit"><strong className="text-slate-700">Mobile:</strong> &nbsp; {auth?.tel}</li>
        <li className="relative block px-4 py-2 pt-0 pl-0 leading-normal bg-white border-0 rounded-t-lg text-sm text-inherit"><strong className="text-slate-700">Role:</strong> &nbsp; {auth?.role}</li>
      </ul>
    </div>
  </div>
</div>

  </>
  )
}
