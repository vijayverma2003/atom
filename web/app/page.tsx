import { getClientUser } from "@/services/users";
import Link from "next/link";
import { redirect } from "next/navigation";
import Logo from "./_components/Logo";
import Hero from "./_components/Hero";

export default async function Home() {
  const { user, error } = await getClientUser();
  if (user) redirect("/home");

  const redirectUrl = process.env.NEXT_PUBLIC_BASE_URL + "/";

  return (
    <main>
      <nav className="flex justify-between items-center p-container">
        <h1 className="text-3xl font-bold">
          <Logo />
        </h1>
        <div className="relative tooltip-trigger z-10">
          <button className="btn btn-primary text-xl">Login</button>
          <div className="py-2 tooltip-content absolute top-[100%] right-0">
            <div className="bg-light-background py-4 px-8 flex flex-col items-start justify-center gap-2 rounded-2xl border border-light-background">
              <Link
                href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login/google?redirectURL=${redirectUrl}`}
                className="btn btn-ghost text-lg whitespace-nowrap w-full flex justify-start gap-4"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    opacity="0.987"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.8135 1.59149C11.901 1.46999 12.5445 1.46999 13.713 1.59149C15.7814 1.89763 17.6988 2.85372 19.188 4.32149C18.1817 5.27269 17.1886 6.23779 16.209 7.21649C14.333 5.62649 12.239 5.25949 9.927 6.11549C8.231 6.89549 7.05 8.15949 6.384 9.90749C5.29566 9.09724 4.2215 8.26811 3.162 7.42049C3.08837 7.38173 3.00427 7.36754 2.922 7.37999C4.605 4.13499 7.235 2.20499 10.812 1.58999"
                    fill="#F44336"
                  />
                  <path
                    opacity="0.997"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2.91901 7.38C3.00401 7.367 3.08451 7.3805 3.16051 7.4205C4.22001 8.26812 5.29417 9.09724 6.38251 9.9075C6.21125 10.5886 6.10329 11.284 6.06001 11.985C6.09701 12.663 6.20451 13.3285 6.38251 13.9815L3.00001 16.674C1.52701 13.596 1.50001 10.498 2.91901 7.38Z"
                    fill="#FFC107"
                  />
                  <path
                    opacity="0.999"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M19.0275 19.935C17.9743 19.0061 16.8717 18.1349 15.7245 17.325C16.8745 16.513 17.5725 15.399 17.8185 13.983H12.183V10.0695C15.433 10.0425 18.6815 10.07 21.9285 10.152C22.5445 13.497 21.833 16.513 19.794 19.2C19.5515 19.4577 19.2947 19.703 19.0275 19.935Z"
                    fill="#448AFF"
                  />
                  <path
                    opacity="0.993"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.3825 13.983C7.6125 17.04 9.8675 18.467 13.1475 18.264C14.0682 18.1574 14.951 17.8358 15.7245 17.325C16.8725 18.137 17.9735 19.007 19.0275 19.935C17.3575 21.4357 15.2282 22.3261 12.987 22.461C12.4778 22.5017 11.9662 22.5017 11.457 22.461C7.639 22.011 4.82 20.082 3 16.674L6.3825 13.983Z"
                    fill="#43A047"
                  />
                </svg>

                <span>Login with Google</span>
              </Link>
              <Link
                href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login/facebook?redirectURL=${redirectUrl}`}
                className="btn btn-ghost text-lg whitespace-nowrap flex justify-start gap-4"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24 12C24 5.37262 18.6274 0 12 0C5.37262 0 0 5.37262 0 12C0 17.9895 4.38825 22.954 10.125 23.8542V15.4688H7.07812V12H10.125V9.35625C10.125 6.34875 11.9166 4.6875 14.6576 4.6875C15.9705 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8306C14.3399 7.875 13.875 8.80003 13.875 9.74906V12H17.2031L16.6711 15.4688H13.875V23.8542C19.6118 22.954 24 17.9896 24 12Z"
                    fill="#1877F2"
                  />
                  <path
                    d="M16.6711 15.4688L17.2031 12H13.875V9.74906C13.875 8.79994 14.3399 7.875 15.8306 7.875H17.3438V4.92188C17.3438 4.92188 15.9705 4.6875 14.6575 4.6875C11.9166 4.6875 10.125 6.34875 10.125 9.35625V12H7.07812V15.4688H10.125V23.8542C10.7453 23.9514 11.3722 24.0001 12 24C12.6278 24.0001 13.2547 23.9514 13.875 23.8542V15.4688H16.6711Z"
                    fill="white"
                  />
                </svg>

                <span> Login with Facebook</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <Hero />
    </main>
  );
}
