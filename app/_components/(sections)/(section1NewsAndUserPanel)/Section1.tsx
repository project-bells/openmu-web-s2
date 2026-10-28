import { getServerSession } from "next-auth"
import Banners from "./Banners"
import LoginForm from "./LoginForm"
import { authOptions } from "@/lib/auth"
import UserPanel from "./UserPanel";

export default async function Section1() {
  //get session information if there is show UserPanel
  const session = await getServerSession(authOptions);
  const isLogged = session?.user != undefined;

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      <div className="lg:col-span-8 w-full h-[320px] sm:h-[380px]">
        <Banners />
      </div>
      <div className="lg:col-span-4 w-full h-[320px] sm:h-[380px] flex flex-col justify-center rounded-xl bg-slate-950/70 border border-slate-800/80 p-6 overflow-y-auto">
        {!isLogged && <LoginForm />}
        {isLogged && <UserPanel role={session.user.role}/>}
      </div>
    </div>
  )
}

