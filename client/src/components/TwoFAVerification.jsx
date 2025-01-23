import React from "react";
import { useState } from "react";
import { reset2FA, verify2FA } from "../service/authApi";

const TwoFAVerification = ({onVerifySuccess, onResetSuccess}) => {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");

    const handleTokenVerification = async (e) => {
        e.preventDefault();
        try {
            const { data } = await verify2FA(otp);
            setError("");
            onVerifySuccess(data);
        } catch (error) {
            setOtp("");
            console.log("the error is ", error); 
            setError("Invalid TOTP code");
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        try {
            const { data } = await reset2FA();
            setError("");
            onResetSuccess(data);
        } catch (error) {
            console.log("the error is ", error); 
            setError("Something went wrong during 2FA reset :" + error );
        }
    }


  return (
    <form
      onSubmit={handleTokenVerification}
      className="bg-white rounded-lg shadow-md w-full max-w-sm mx-auto"
    >
      <div className="pt-6">
        <h2 className="text-3xl text-center font-extralight">
            Verify OTP
        </h2>
      </div>
      <hr className="text-gray-200 mt-6 mb-6" />
      <p className="text-center text-gray-600 text-lg font-light m-2">
        Please enter the 6-digit time based OTP from your authenticator app.
      </p>

      <div className="p-6">
        <div className="mb-4">
          <label className="text-gray-600 text-sm">TOTP</label>
          <input
            label="TOTP"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 border rounded mt-2"
            placeholder="Enter your TOTP"
            required
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md mb-2"
        >
            Verity TOTP
          
        </button>

        <button
          type="submit"
          className="w-full bg-slate-500 text-white py-2 rounded-md mb-2"
          onClick={handleReset}
        >
            Reset 2FA
          
        </button>


      </div>
    </form>
  );
};

export default TwoFAVerification;
