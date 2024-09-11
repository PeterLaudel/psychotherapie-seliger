export function Contact() {
  const onSubmit = async (event) => {};
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-2">
      <h1 className="text-2xl font-bold mb-5">Kontakt</h1>
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md bg-white p-6 rounded-md shadow-md"
      >
        <div className="flex flex-col mb-4">
          <label
            htmlFor="vorname"
            className="mb-2 font-bold text-lg text-gray-900"
          >
            Vorname
          </label>
          <input
            type="text"
            name="vorname"
            className="border-2 border-gray-300 p-2 rounded-md"
          />
        </div>

        <div className="flex flex-col mb-4">
          <label
            htmlFor="nachname"
            className="mb-2 font-bold text-lg text-gray-900"
          >
            Nachname
          </label>
          <input
            type="text"
            name="nachname"
            className="border-2 border-gray-300 p-2 rounded-md"
          />
        </div>

        <div className="flex flex-col mb-4">
          <label
            htmlFor="email"
            className="mb-2 font-bold text-lg text-gray-900"
          >
            Email
          </label>
          <input
            type="text"
            name="email"
            className="border-2 border-gray-300 p-2 rounded-md"
          />
        </div>

        <div className="flex flex-col mb-4">
          <label
            htmlFor="phonenumber"
            className="mb-2 font-bold text-lg text-gray-900"
          >
            Telefonnummer
          </label>
          <input
            type="text"
            name="phonenumber"
            className="border-2 border-gray-300 p-2 rounded-md"
          />
        </div>

        <div className="flex flex-col mb-4">
          <label
            htmlFor="message"
            className="mb-2 font-bold text-lg text-gray-900"
          >
            Nachricht
          </label>
          <textarea
            name="message"
            className="border-2 border-gray-300 p-2 rounded-md"
          ></textarea>
        </div>

        <div className="flex flex-col mb-4">
          <label
            htmlFor="bezahlung"
            className="mb-2 font-bold text-lg text-gray-900"
          >
            Bezahlung
          </label>
          <select
            name="bezahlung"
            className="border-2 border-gray-300 p-2 rounded-md bg-white"
          >
            <option hidden disabled selected className="text-gray-300">
              Bitte auswählen
            </option>
            <option value="privatversichert">Privatversichert</option>
            <option value="beihilfe">Beihilfe</option>
            <option value="heilfürsorge">Heilfürsorge</option>
            <option value="selbstzahler">Selbstzahler</option>
          </select>
        </div>

        <div className="flex items-center mb-4">
          <input type="checkbox" name="privacy" className="mr-2" />
          <label htmlFor="privacy" className="text-lg text-gray-900">
            Datenschutz
          </label>
        </div>

        <button
          type="submit"
          disabled={true}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
        >
          Absenden
        </button>
      </form>
    </div>
  );
}
