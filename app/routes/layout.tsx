import { Outlet } from "react-router";
import Navbar from "~/components/navbar";

export default function Layout() {
  return (
    <>
    <Navbar />
    <div className="mt-20"></div>
    <Outlet />
    </>
  )
}
