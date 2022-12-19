import Header from "../../components/Header.js"
import { getProviders, signIn as SignIntoProvider } from "next-auth/react"

function signIn({ providers }) {
  return (
    <>
      <Header />
      <div className=" flex flex-col items-center min-h-screen justify-center p-2 -mt-36 px-14 text-center">
        <img className="w-80" src="https://links.papareact.com/ocw" alt="" />
        <p className=" font-xs italic">
          This is built for educational purposes.
        </p>
        <div className=" mt-40">
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button
                className=" p-3 bg-blue-500 rounded-lg text-white"
                onClick={() => SignIntoProvider(provider.id, {
                  callbackUrl: `${window.location.origin}/`,
                })}
              >
                Sign in with {provider.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}




export async function getServerSideProps(context) {
  const providers = await getProviders()

  return {
    props: {
      providers
    }
  }
}


export default signIn