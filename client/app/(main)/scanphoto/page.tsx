export default function Home() {
  return (
    <div className="min-h-screen items-center justify-center bg-gradient-to-r from-cyan-50 to-cyan-100 text-gray-700">
      <h1 className="text-2xl text-center font-bold p-8">Upload Photographs</h1>

      <div>
        <ul className="flex flex-col justify-center items-center text-gray-700">
          <li className="text-2xl pt-8">Before Photograph</li>
          <li>
            <input
              className="w-full pl-12 pt-4 pb-8 text-center"
              type="file"
              accept="image/*"
              capture="environment"
            />
          </li>
        </ul>
      </div>
      <div>
        <ul className="flex flex-col justify-center items-center text-gray-700">
          <li className="text-2xl pt-8">After Photograph</li>
          <li>
            <input
              className="w-full pl-12 pt-4 pb-8 text-center"
              type="file"
              accept="image/*"
              capture="environment"
            />
          </li>
        </ul>
      </div>
    </div>
  );
}
