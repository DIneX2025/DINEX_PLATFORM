function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">DineX Admin</h1>
        <p className="text-gray-600 mb-6">
          Se você está vendo este cartão com sombra e fundo cinza, o Tailwind CSS está funcionando perfeitamente!
        </p>
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
          Entrar no Painel
        </button>
      </div>
    </div>
  )
}

export default App