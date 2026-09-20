import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-green-50 font-sans">
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center justify-center py-20 px-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-green-900 mb-4">
            🌳 Green Tunisia
          </h1>
          <p className="text-xl text-green-700 mb-8">
            Plateforme de gestion des arbres et campagnes de plantation
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/arbres"
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Gérer les Arbres
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-white text-green-700 border-2 border-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium"
            >
              Dashboard
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">🌱</div>
            <h3 className="text-lg font-semibold text-green-900 mb-2">Plantation</h3>
            <p className="text-green-700">Gérez vos campagnes de plantation</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">💧</div>
            <h3 className="text-lg font-semibold text-green-900 mb-2">Arrosage</h3>
            <p className="text-green-700">Suivez les besoins en eau</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-green-900 mb-2">Analytics</h3>
            <p className="text-green-700">Analysez la croissance</p>
          </div>
        </div>
      </main>
    </div>
  );
}
