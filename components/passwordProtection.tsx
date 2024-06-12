"use client";

import { postPassword } from "@/services/password";
import { Cancel } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

type PasswordProtectionProps = {
  children: React.ReactNode;
};

const PasswordProtection = ({ children }: PasswordProtectionProps) => {
  const [showPasswordProtection, setShowPasswordProtection] = useState(true);
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitPassword = async () => {
    try {
      setIsSubmitting(true);
      const res = await postPassword(password);
      setIsSubmitting(false);
      setShowPasswordProtection(false);
    } catch (e: unknown) {
      toast("Password was incorrect", { icon: <Cancel color="error" /> });
      setIsSubmitting(false);
    }
  };

  if (showPasswordProtection) {
    return (
      <div className="bg-white w-screen h-screen flex flex-col items-center justify-center gap-2">
        <TextField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          label="Password"
          placeholder="Password"
        ></TextField>
        <LoadingButton
          loading={isSubmitting}
          variant="contained"
          onClick={handleSubmitPassword}
        >
          Submit
        </LoadingButton>
      </div>
    );
  } else {
    return children;
  }
};

export default PasswordProtection;
