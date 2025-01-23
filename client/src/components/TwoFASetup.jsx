import { useState } from "react";
import { useEffect } from "react";
import { setup2FA } from "../service/authApi";

const TwoFASetup = ({ onSetupComplete }) => {
  const [message, setMessage] = useState("");
  const [responce, setResponse] = useState({});

  const fetchQRCode = async () => {
    const { data } = await setup2FA();
    console.log(responce);
    setResponse(data);
  };

  useEffect(() => {
    fetchQRCode();
  }, []); // run once

  const copyClipboard = async () => {
    await navigator.clipboard.writeText(responce.secret);
    setMessage("Copied to clipboard");
  };
  console.log("responce", responce);
  return (
    <div className="bg-white rounded-lg shadow-md w-full max-w-sm mx-auto">
      <div className="pt-6">
        <h2 className="text-3xl text-center font-extralight">Setup 2FA</h2>
      </div>
      <hr className="text-gray-200 mt-6 mb-6" />
      <p className="text-center text-gray-600 text-lg font-light pr-6 pl-6">
        Scan the QR code using your authenticator app
      </p>
      <div className="p-6">
        <div className="flex justify-center">
          {responce.qrCode ? (
            <img
              src={responce.qrCode}
              alt="2FA QR Code"
              className="mb-4 border rounded-md"
            />
          ) : (
            ""
          )}
        </div>
        <div className="flex items-center mt-3 mb-3">
          <div className="border-t border-1 border-gray-200 flex-grow"></div>

          <div className="text-gray-600 text-sm font-light pr-2 pl-2">
            OR enter this code manually:
          </div>

          <div className="border-t border-1 border-gray-200 flex-grow"></div>
        </div>
        <div className="mb-6">
          {message && (
            <p className="text-center text-sm mb-3 text-green-500">{message}</p>
          )}

          <input
            readOnly
            defaultValue=""
            value={responce.secret}
            className="w-full p-4 border rounded mt-2 text-xs text-gray-600"
            onClick={copyClipboard}
          />
        </div>
        <button
          onClick={onSetupComplete}
          className="w-full py-4 bg-blue-500 text-white rounded-md"
        >
          {" "}
          Continue to verification{" "}
        </button>
      </div>
    </div>
  );
};

export default TwoFASetup;
